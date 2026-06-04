'use client'

import { RiseLoader } from 'react-spinners'

export default function RouteLoader() {
  return (
    <div className="loader" aria-live="polite" aria-busy="true">
      <RiseLoader color="var(--color-black)" size={15} />
    </div>
  )
}
