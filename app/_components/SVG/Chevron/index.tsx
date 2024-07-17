'use client'
import React from 'react'

type IconProps = {
  color: string
  size: number
  className?: string
}

const Chevron = ({ color, size, className }: IconProps) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d="M27.0752 4.00543e-05L27.0752 8.18555L7.97569 8.18555L7.97569 27.0752L5.53131e-05 27.0752L5.76801e-05 3.76873e-05L27.0752 4.00543e-05Z" />
    </svg>
  </div>
)

export default Chevron
