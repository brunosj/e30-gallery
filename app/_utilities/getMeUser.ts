import { cookies } from 'next/headers'

import type { User } from '../payload-types'

export const getMeUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  user: User | null
  token: string | undefined
  redirectUrl?: string
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    return { user: null, token: undefined, redirectUrl: nullUserRedirect }
  }

  const meUserReq = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  })

  if (!meUserReq.ok) {
    return { user: null, token, redirectUrl: nullUserRedirect }
  }

  const { user }: { user: User } = await meUserReq.json()

  if (user) {
    return { user, token, redirectUrl: validUserRedirect }
  } else {
    return { user: null, token, redirectUrl: nullUserRedirect }
  }
}
