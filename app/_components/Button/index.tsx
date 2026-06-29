import type { LinkObject } from '@/app/types'

import React from 'react'
import { Link } from '@/i18n/navigation'
import { resolveLinkHref } from '@/app/_utilities/linkHref'
import { isExternalUrl } from '@/app/_utilities/normalizeExternalUrl'

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

  const finalHref = link ? resolveLinkHref(link) : null

  if (action !== 'submit' && finalHref) {
    const isExternal = typeof finalHref === 'string' && isExternalUrl(finalHref)

    if (isExternal) {
      return (
        <a href={finalHref} className={className} {...newTabProps} onClick={onClick}>
          {content}
        </a>
      )
    }

    return (
      <Link href={finalHref as Parameters<typeof Link>[0]['href']} className={className} {...newTabProps} onClick={onClick}>
        {content}
      </Link>
    )
  }

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
