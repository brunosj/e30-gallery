import type { LinkObject } from '@/app/types'

import React from 'react'
import { Link } from '@/lib/i18n'
import classes from './index.module.css'
import cn from 'classnames'

export type Props = {
  onClick?: () => void
  link?: LinkObject
  className?: string
  action?: 'submit' | 'button'
  disabled?: boolean
  invert?: boolean
}

export const Button: React.FC<Props> = ({
  className: classNameFromProps,
  onClick,
  action = 'button',
  disabled,
  invert,
  link,
}) => {
  const newTabProps = link?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const className = cn(
    classes.button,
    classNameFromProps,
    link?.appearance && classes[`appearance--${link.appearance}`],
    invert && link?.appearance && classes[`${link.appearance}--invert`],
  )

  const content = (
    <div className={classes.content}>
      <span className={classes.label}>{link?.label}</span>
    </div>
  )

  let finalHref = ''

  if (link) {
    switch (link.type) {
      case 'mailto':
        if (link.email) {
          finalHref = `mailto:${link.email}`
          const queryParams = []
          if (link.subject) queryParams.push(`subject=${encodeURIComponent(link.subject)}`)
          if (link.body) queryParams.push(`body=${encodeURIComponent(link.body)}`)
          if (queryParams.length > 0) {
            finalHref += `?${queryParams.join('&')}`
          }
        }
        break
      case 'custom':
        if (link.url) {
          finalHref = link.url
        }
        break
      case 'reference':
        if (link.reference) {
          finalHref = (link.reference.value as { slug: string }).slug
        }
        break
      default:
        if (link.url) {
          finalHref = link.url
        }
        break
    }
  }

  if (action !== 'submit' && finalHref) {
    return (
      <Link href={finalHref} className={className} {...newTabProps} onClick={onClick}>
        {content}
      </Link>
    )
  } else {
    return (
      <button
        className={className}
        type={action}
        onClick={onClick}
        disabled={disabled}
        {...newTabProps}
      >
        {content}
      </button>
    )
  }
}
