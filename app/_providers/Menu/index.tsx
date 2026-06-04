'use client'

import type { Menu } from '@/app/payload-types'
import React, { createContext, useContext } from 'react'

const MenuContext = createContext<Menu | null>(null)

export function MenuProvider({
  menu,
  children,
}: {
  menu: Menu | null
  children: React.ReactNode
}) {
  return <MenuContext.Provider value={menu}>{children}</MenuContext.Provider>
}

export function useMenu(): Menu | null {
  return useContext(MenuContext)
}
