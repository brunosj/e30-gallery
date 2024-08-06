'use client'

import React from 'react'

type IconProps = {
  color: string
  size: number
  className?: string
}

const ArrowLeft = ({ color, size, className }: IconProps) => (
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
        d="m2.82 12l7.715 7.715q.22.222.218.53t-.224.528t-.529.221t-.529-.22L1.83 13.136q-.242-.243-.354-.54q-.112-.299-.112-.597t.112-.596t.354-.54L9.47 3.22q.221-.221.532-.218q.31.003.532.224t.22.529t-.22.529z"
      ></path>
    </svg>
  </div>
)

export default ArrowLeft
