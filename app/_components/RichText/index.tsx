'use client'

import React from 'react'

import serialize from './serialize'
import cn from 'classnames'
import classes from './index.module.css'

export const RichText: React.FC<{ className?: string; content: any }> = ({
  className,
  content,
}) => {
  if (!content) {
    return null
  }

  return <div className={cn(classes.richText, className)}>{serialize(content)}</div>
}
