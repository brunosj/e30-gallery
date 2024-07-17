'use client'

import React, { ElementType } from 'react'
import { Link } from '@/lib/i18n'
import classes from './index.module.css'

export type Props = {
  label?: string
  appearance?: 'default' | 'primary' | 'secondary' | null
  el?: 'reference' | 'custom' | 'mailto'
  onClick?: () => void
  href?: string | null
  newTab?: boolean | null
  className?: string
  type?: 'submit' | 'button'
  disabled?: boolean
  invert?: boolean
  email?: string
  subject?: string
  body?: string
  url?: string
}

export const Button: React.FC<Props> = ({
  el: elFromProps = 'reference',
  label,
  newTab = false,
  href = '',
  appearance,
  className: classNameFromProps,
  onClick,
  type = 'button',
  disabled,
  invert,
}) => {
  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  const className = [
    classes.button,
    classNameFromProps,
    classes[`appearance--${appearance}`],
    invert && classes[`${appearance}--invert`],
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <div className={classes.content}>
      <span className={classes.label}>{label}</span>
    </div>
  )

  if (
    (elFromProps === 'reference' && type !== 'submit') ||
    (elFromProps === 'custom' && type !== 'submit')
  ) {
    return (
      <Link href={href || ''} className={className} {...newTabProps} onClick={onClick}>
        {content}
      </Link>
    )
  } else {
    return (
      <button
        className={className}
        type={type}
        onClick={onClick}
        disabled={disabled}
        {...newTabProps}
      >
        {content}
      </button>
    )
  }

  // const Element: ElementType = elFromProps as ElementType

  // return (
  //   <Element
  //     href={href}
  //     className={className}
  //     type={type}
  //     {...newTabProps}
  //     onClick={onClick}
  //     disabled={disabled}
  //   >
  //     {content}
  //   </Element>
  // )
}
