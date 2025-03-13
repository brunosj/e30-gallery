import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    // Use the custom check-email endpoint
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      } else {
        // If the custom endpoint fails, try a direct query to check if email exists
        const usersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users?where[email][equals]=${encodeURIComponent(email)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          return NextResponse.json({ exists: usersData.docs.length > 0 })
        }

        // If direct query fails, try a login attempt as a last resort
        const loginResponse = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password: 'this-is-not-a-real-password-just-checking-if-email-exists',
            }),
          },
        )

        const loginData = await loginResponse.json()

        // Check for specific error messages that indicate email doesn't exist
        const emailNotFound = loginData.errors?.some((error: { message: string }) => {
          const message = error.message.toLowerCase()
          return (
            message.includes('email') &&
            (message.includes('not found') ||
              message.includes('no user') ||
              message.includes('does not exist'))
          )
        })

        return NextResponse.json({ exists: !emailNotFound })
      }
    } catch (error) {
      return NextResponse.json({ message: 'Failed to check if email exists' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
