import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, preferences } = body

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, first name, and last name are required' },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
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
    const response = await fetch(`${process.env.MAILERLITE_BASE_URL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(subscriberData),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('MailerLite API error:', responseData)

      // Handle specific MailerLite errors
      if (response.status === 422 && responseData.errors?.email) {
        return NextResponse.json(
          { error: 'This email is already subscribed or invalid' },
          { status: 422 },
        )
      }

      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
