'use client'

import type { Social } from '@/app/payload-types'
import React, { createContext, useContext } from 'react'

const SocialsContext = createContext<Social | null>(null)

export function SocialsProvider({
  socials,
  children,
}: {
  socials: Social | null
  children: React.ReactNode
}) {
  return <SocialsContext.Provider value={socials}>{children}</SocialsContext.Provider>
}

export function useSocials(): Social | null {
  return useContext(SocialsContext)
}
