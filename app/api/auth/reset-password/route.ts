import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json({ message: 'Token and password are required' }, { status: 400 })
    }

    // Call the Payload CMS reset-password endpoint
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, password }),
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
        { message: 'Failed to process password reset request' },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
