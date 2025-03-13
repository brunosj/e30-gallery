import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    // First check if the email exists
    try {
      const checkEmailResponse = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users?where[email][equals]=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (checkEmailResponse.ok) {
        const userData = await checkEmailResponse.json()

        // If email doesn't exist, return an error
        if (userData.docs.length === 0) {
          return NextResponse.json(
            { message: 'No account found with that email address' },
            { status: 404 },
          )
        }
      }

      // If email exists or we couldn't check, proceed with password recovery
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      )

      // Get the response data
      let data
      try {
        data = await response.json()
      } catch (e) {
        data = { message: 'Failed to parse response' }
      }

      // Return the response with the same status code
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      return NextResponse.json(
        { message: 'Failed to process password recovery request' },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
