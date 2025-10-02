#!/usr/bin/env node

/**
 * Migration script to convert existing newsletter_grouping field to individual preference fields
 *
 * This script will:
 * 1. Fetch all subscribers from MailerLite
 * 2. Parse existing newsletter_grouping field
 * 3. Update each subscriber with individual preference fields
 *
 * Usage: node scripts/migrate-newsletter-preferences.js
 */

require('dotenv').config()

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
const MAILERLITE_BASE_URL = process.env.MAILERLITE_BASE_URL || 'https://connect.mailerlite.com'

if (!MAILERLITE_API_KEY) {
  console.error('❌ MAILERLITE_API_KEY environment variable is required')
  process.exit(1)
}

// Mapping of old preference keys to new field names
const PREFERENCE_MAPPING = {
  showMeArt: 'show_me_art',
  tellMeWhere: 'tell_me_where',
  wantToJoin: 'want_to_join',
  justLooking: 'just_looking',
}

// Alternative text patterns to match in newsletter_grouping field
const TEXT_PATTERNS = {
  show_me_art: [
    'Show me art I can grow my collection with!',
    'show me art i can grow my collection with',
    'grow my collection with',
    'grow my collection',
    'collection with',
  ],
  tell_me_where: [
    'Tell me where and how to start when buying art!',
    'tell me where and how to start when buying art',
    'where and how to start',
    'how to start when buying',
    'start when buying art',
  ],
  want_to_join: [
    'I want to join your shows and events!',
    'i want to join your shows and events',
    'want to join your shows',
    'join your shows and events',
    'shows and events',
  ],
  just_looking: [
    'Ahh, just looking around!',
    'ahh, just looking around',
    'just looking around',
    'just looking',
  ],
}

async function makeRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MAILERLITE_API_KEY}`,
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
    )
  }

  return response.json()
}

function parsePreferences(newsletterGrouping) {
  if (!newsletterGrouping || typeof newsletterGrouping !== 'string') {
    return {
      show_me_art: 'no',
      tell_me_where: 'no',
      want_to_join: 'no',
      just_looking: 'no',
    }
  }

  const preferences = {
    show_me_art: 'no',
    tell_me_where: 'no',
    want_to_join: 'no',
    just_looking: 'no',
  }

  const lowerGrouping = newsletterGrouping.toLowerCase()

  // Check for exact key matches first
  Object.entries(PREFERENCE_MAPPING).forEach(([oldKey, newKey]) => {
    if (lowerGrouping.includes(oldKey.toLowerCase())) {
      preferences[newKey] = 'yes'
    }
  })

  // Check for text pattern matches
  Object.entries(TEXT_PATTERNS).forEach(([fieldName, patterns]) => {
    patterns.forEach(pattern => {
      if (lowerGrouping.includes(pattern.toLowerCase())) {
        preferences[fieldName] = 'yes'
      }
    })
  })

  return preferences
}

async function getAllSubscribers() {
  console.log('📥 Fetching all subscribers...')

  let allSubscribers = []
  let cursor = null
  let page = 1

  do {
    const url = new URL(`${MAILERLITE_BASE_URL}/api/subscribers`)
    url.searchParams.set('limit', '100') // Max limit per request
    if (cursor) {
      url.searchParams.set('cursor', cursor)
    }

    console.log(`   Fetching page ${page}...`)
    const response = await makeRequest(url.toString())

    allSubscribers = allSubscribers.concat(response.data)
    cursor = response.meta?.next_cursor
    page++

    console.log(
      `   Found ${response.data.length} subscribers on this page (total: ${allSubscribers.length})`,
    )

    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  } while (cursor)

  console.log(`✅ Total subscribers fetched: ${allSubscribers.length}`)
  return allSubscribers
}

async function updateSubscriber(subscriber) {
  const { id, email, fields } = subscriber

  // Parse existing newsletter_grouping field
  const existingGrouping = fields?.newsletter_grouping || ''
  const newPreferences = parsePreferences(existingGrouping)

  // Check if subscriber already has the new fields
  const hasNewFields = Object.keys(PREFERENCE_MAPPING).some(
    key => fields && fields[PREFERENCE_MAPPING[key]] !== undefined,
  )

  if (hasNewFields && !existingGrouping) {
    console.log(`   ⏭️  Skipping ${email} - already has new fields and no legacy data`)
    return { skipped: true }
  }

  try {
    const updateData = {
      email,
      fields: {
        ...newPreferences,
      },
    }

    await makeRequest(`${MAILERLITE_BASE_URL}/api/subscribers`, {
      method: 'POST',
      body: JSON.stringify(updateData),
    })

    console.log(`   ✅ Updated ${email}:`, newPreferences)
    return {
      updated: true,
      email,
      oldGrouping: existingGrouping,
      newPreferences,
    }
  } catch (error) {
    console.error(`   ❌ Failed to update ${email}:`, error.message)
    return {
      error: true,
      email,
      errorMessage: error.message,
    }
  }
}

async function main() {
  console.log('🚀 Starting newsletter preferences migration...\n')

  try {
    // Fetch all subscribers
    const subscribers = await getAllSubscribers()

    if (subscribers.length === 0) {
      console.log('ℹ️  No subscribers found to migrate')
      return
    }

    // Filter subscribers that have newsletter_grouping field or need migration
    const subscribersToMigrate = subscribers.filter(sub => {
      const hasLegacyData = sub.fields?.newsletter_grouping
      const hasNewFields = Object.values(PREFERENCE_MAPPING).some(
        field => sub.fields && sub.fields[field] !== undefined,
      )
      return hasLegacyData || !hasNewFields
    })

    console.log(`\n📊 Migration Summary:`)
    console.log(`   Total subscribers: ${subscribers.length}`)
    console.log(`   Subscribers to migrate: ${subscribersToMigrate.length}`)
    console.log(
      `   Subscribers already migrated: ${subscribers.length - subscribersToMigrate.length}\n`,
    )

    if (subscribersToMigrate.length === 0) {
      console.log('✅ All subscribers already have the new preference fields!')
      return
    }

    // Process subscribers in batches to avoid rate limiting
    console.log('🔄 Starting migration...\n')
    const results = {
      updated: 0,
      skipped: 0,
      errors: 0,
      details: [],
    }

    for (let i = 0; i < subscribersToMigrate.length; i++) {
      const subscriber = subscribersToMigrate[i]
      console.log(`[${i + 1}/${subscribersToMigrate.length}] Processing ${subscriber.email}...`)

      const result = await updateSubscriber(subscriber)
      results.details.push(result)

      if (result.updated) results.updated++
      else if (result.skipped) results.skipped++
      else if (result.error) results.errors++

      // Add delay between requests to avoid rate limiting
      if (i < subscribersToMigrate.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    // Final summary
    console.log('\n🎉 Migration completed!')
    console.log(`   ✅ Updated: ${results.updated}`)
    console.log(`   ⏭️  Skipped: ${results.skipped}`)
    console.log(`   ❌ Errors: ${results.errors}`)

    if (results.errors > 0) {
      console.log('\n❌ Errors encountered:')
      results.details
        .filter(r => r.error)
        .forEach(r => console.log(`   ${r.email}: ${r.errorMessage}`))
    }
  } catch (error) {
    console.error('💥 Migration failed:', error.message)
    process.exit(1)
  }
}

// Run the migration
main().catch(console.error)
