import type { LinkObject } from '@/app/types'

import React, { ElementType } from 'react'
import { Link } from '@/lib/i18n'
import classes from './index.module.css'

export type Props = {
  label?: string
  appearance?: 'default' | 'primary' | 'secondary' | null
  type?: 'reference' | 'custom' | 'mailto' | null
  onClick?: () => void
  link?: LinkObject | null
  className?: string
  action?: 'submit' | 'button'
  disabled?: boolean
  invert?: boolean
  newTab?: boolean | null
  href?: string | null
}

export const Button: React.FC<Props> = ({
  type = 'reference',
  label,
  newTab = false,
  appearance,
  className: classNameFromProps,
  onClick,
  action = 'button',
  disabled,
  invert,
  href,
  link,
}) => {
  const newTabProps = link?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
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

  let finalHref = href || ''

  if (link) {
    if (link.type === 'mailto' && link.email) {
      finalHref = `mailto:${link.email}`
      if (link.subject) {
        finalHref += `?subject=${encodeURIComponent(link.subject)}`
        if (link.body) {
          finalHref += `&body=${encodeURIComponent(link.body)}`
        }
      }
    } else if (link.type === 'custom' && link.url) {
      finalHref = link.url
    } else if (link.type === 'reference' && link.reference) {
      finalHref = (link.reference.value as { slug: string }).slug
    }
  }

  if (
    (href && action !== 'submit') ||
    (link?.type === 'reference' && action !== 'submit') ||
    (link?.type === 'custom' && action !== 'submit') ||
    (link?.type === 'mailto' && action !== 'submit')
  ) {
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
