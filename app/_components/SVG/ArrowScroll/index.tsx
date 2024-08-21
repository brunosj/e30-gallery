'use client'

import React from 'react'

type IconProps = {
  color: string
  size: number
  className?: string
}

const ArrowScroll = ({ color, size, className }: IconProps) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={color}
    >
      <g fill="none" stroke="currentColor" strokeLinejoin="round">
        <path d="m.5 6.46l6.15 6.14a.48.48 0 0 0 .7 0l6.15-6.14" />
        <path d="M.5 1.25L6.65 7.4a.5.5 0 0 0 .7 0l6.15-6.15" />
      </g>
    </svg>
  </div>
)

export default ArrowScroll
