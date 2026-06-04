'use client'

import { ProgressProvider } from '@bprogress/next/app'

export default function Progress({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      height="3px"
      color="var(--color-accent)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  )
}
