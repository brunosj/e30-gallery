import { NextRequest, NextResponse } from 'next/server'

// Function to verify Turnstile token
async function verifyTurnstileToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

// Simple in-memory rate limiting (for production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const RATE_LIMIT_MAX_ATTEMPTS = 3 // Max 3 attempts per hour

// Common disposable email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'yopmail.com',
  'temp-mail.org',
  'throwaway.email',
  'getnada.com',
]

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const clientData = rateLimitMap.get(clientIP)

  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (clientData.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false
  }

  clientData.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    console.log('Newsletter API called - Environment check:')
    console.log('MAILERLITE_BASE_URL:', process.env.MAILERLITE_BASE_URL)
    console.log('MAILERLITE_API_KEY exists:', !!process.env.MAILERLITE_API_KEY)
    console.log('TURNSTILE_SECRET_KEY exists:', !!process.env.TURNSTILE_SECRET_KEY)

    const body = await request.json()
    const { email, firstName, lastName, preferences, turnstileToken, website } = body

    console.log('Form data received:', {
      email,
      firstName,
      lastName,
      preferences,
      turnstileToken: !!turnstileToken,
      honeypotFilled: !!website,
    })

    // Check honeypot field (should be empty)
    if (website) {
      console.log('Honeypot triggered - potential bot detected')
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }

    // Rate limiting
    const clientIP =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`)
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, first name, and last name are required' },
        { status: 400 },
      )
    }

    // Validate Turnstile token
    if (!turnstileToken) {
      return NextResponse.json({ error: 'CAPTCHA verification is required' }, { status: 400 })
    }

    // Verify Turnstile token
    const isTurnstileValid = await verifyTurnstileToken(turnstileToken)
    if (!isTurnstileValid) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check for disposable email domains
    const emailDomain = email.split('@')[1]?.toLowerCase()
    if (emailDomain && DISPOSABLE_EMAIL_DOMAINS.includes(emailDomain)) {
      console.log(`Disposable email detected: ${emailDomain}`)
      return NextResponse.json(
        { error: 'Disposable email addresses are not allowed' },
        { status: 400 },
      )
    }

    // Prepare subscriber data for MailerLite with individual preference fields
    const subscriberData = {
      email,
      fields: {
        name: firstName,
        last_name: lastName,
        // Individual preference fields for better filtering
        show_me_art: preferences.includes('showMeArt') ? 'yes' : 'no',
        tell_me_where: preferences.includes('tellMeWhere') ? 'yes' : 'no',
        want_to_join: preferences.includes('wantToJoin') ? 'yes' : 'no',
        just_looking: preferences.includes('justLooking') ? 'yes' : 'no',
      },
    }

    // Make request to MailerLite API
    const apiUrl = `${process.env.MAILERLITE_BASE_URL}/api/subscribers`
    console.log('Making request to:', apiUrl)
    console.log('Subscriber data:', subscriberData)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(subscriberData),
    })

    console.log('MailerLite response status:', response.status)

    const responseData = await response.json()

    if (!response.ok) {
      console.error('MailerLite API error:', responseData)
      console.error('Response status:', response.status)
      console.error('Response headers:', Object.fromEntries(response.headers.entries()))

      // Handle specific MailerLite errors
      if (response.status === 422 && responseData.errors?.email) {
        return NextResponse.json(
          { error: 'This email is already subscribed or invalid' },
          { status: 422 },
        )
      }

      return NextResponse.json(
        { error: `Failed to subscribe to newsletter: ${responseData.message || 'Unknown error'}` },
        { status: response.status },
      )
    }

    return NextResponse.json(
      {
        message: 'Successfully subscribed to newsletter',
        subscriber: responseData.data,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
