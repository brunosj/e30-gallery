'use client'

import React from 'react'

type IconProps = {
  color: string
  size: number
  className?: string
}

const ArrowRight = ({ color, size, className }: IconProps) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path
        fill="currentColor"
        d="M15.187 12L7.47 4.285q-.221-.222-.218-.532t.224-.532T8.009 3t.531.221l7.637 7.642q.242.243.354.54t.111.597t-.111.596t-.354.54L8.535 20.78q-.222.221-.53.218t-.528-.224t-.221-.532t.22-.531z"
      ></path>
    </svg>
  </div>
)

export default ArrowRight
