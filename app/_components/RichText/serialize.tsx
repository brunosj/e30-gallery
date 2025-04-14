'use client'

import React, { Fragment } from 'react'
import escapeHTML from 'escape-html'
import { Text } from 'slate'
import { Link } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

import classes from './index.module.css'
// eslint-disable-next-line no-use-before-define
type Children = Leaf[]

type DocValue = {
  slug?: string
  meta?: {
    title?: string
    description?: string
    keywords?: string
  }
  title?: string
  _status?: string
  id?: string
}

type Doc = {
  relationTo: string
  value: DocValue
}

type LinkFields = {
  link: {
    type: 'reference' | 'custom' | 'mailto'
    appearance?: 'default' | 'primary' | 'secondary'
    url?: string
    email?: string
    subject?: string
    body?: string
  }
}

type Leaf = {
  type: string
  children: Children
  url?: string
  doc?: Doc
  fields?: LinkFields
  linkType?: 'internal' | 'external'
  [key: string]: unknown
}

// Convert to a component with capitalized name to follow React conventions
const Serialize = ({ children }: { children: Children }): React.ReactNode => {
  const locale = useLocale()

  return children.map((node, i) => {
    if (Text.isText(node)) {
      let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />

      if (node.bold) {
        text = <strong key={i}>{text}</strong>
      }

      if (node.code) {
        text = <code key={i}>{text}</code>
      }

      if (node.italic) {
        text = <em key={i}>{text}</em>
      }

      if (node.underline) {
        text = (
          <span style={{ textDecoration: 'underline' }} key={i}>
            {text}
          </span>
        )
      }

      if (node.strikethrough) {
        text = (
          <span style={{ textDecoration: 'line-through' }} key={i}>
            {text}
          </span>
        )
      }

      return <Fragment key={i}>{text}</Fragment>
    }

    if (!node) {
      return null
    }

    switch (node.type) {
      case 'h1':
        return <h1 key={i}>{node.children && <Serialize>{node.children}</Serialize>}</h1>
      case 'h2':
        return <h2 key={i}>{node.children && <Serialize>{node.children}</Serialize>}</h2>
      case 'h3':
        return <h3 key={i}>{node.children && <Serialize>{node.children}</Serialize>}</h3>
      case 'h4':
        return <h4 key={i}>{node.children && <Serialize>{node.children}</Serialize>}</h4>
      case 'h5':
        return <h5 key={i}>{node.children && <Serialize>{node.children}</Serialize>}</h5>
      case 'h6':
        return <h6 key={i}>{node.children && <Serialize>{node.children}</Serialize>}</h6>
      case 'blockquote':
        return (
          <blockquote key={i}>{node.children && <Serialize>{node.children}</Serialize>}</blockquote>
        )
      case 'ul':
        return <ul key={i}>{node.children && <Serialize>{node.children}</Serialize>}</ul>
      case 'ol':
        return <ol key={i}>{node.children && <Serialize>{node.children}</Serialize>}</ol>
      case 'li':
        return <li key={i}>{node.children && <Serialize>{node.children}</Serialize>}</li>
      case 'link':
        // Handle internal references
        if (node.linkType === 'internal' && node.doc) {
          const { relationTo, value } = node.doc
          const slug = value?.slug || ''

          // Special handling for homepage
          if (relationTo === 'homepage') {
            return (
              <Link href={'/' as any} key={i} className={classes.link}>
                {node.children && <Serialize>{node.children}</Serialize>}
              </Link>
            )
          }

          // Special handling for artist pages - handle both 'artist' (singular) and 'artists' (plural)
          if (relationTo === 'artist' || relationTo === 'artists') {
            return (
              <Link
                href={
                  {
                    pathname: '/artists/[slug]',
                    params: { slug },
                  } as any
                }
                key={i}
                className={classes.link}
              >
                {node.children && <Serialize>{node.children}</Serialize>}
              </Link>
            )
          }

          // Special handling for exhibition pages
          if (relationTo === 'exhibition' || relationTo === 'exhibitions-page') {
            return (
              <Link
                href={
                  {
                    pathname: '/exhibitions/[slug]',
                    params: { slug },
                  } as any
                }
                key={i}
                className={classes.link}
              >
                {node.children && <Serialize>{node.children}</Serialize>}
              </Link>
            )
          }

          // Special handling for gallery page
          if (relationTo === 'gallery-page') {
            return (
              <Link href={'/gallery' as any} key={i} className={classes.link}>
                {node.children && <Serialize>{node.children}</Serialize>}
              </Link>
            )
          }

          // Special handling for art society page
          if (relationTo === 'art-society-page') {
            return (
              <Link href={'/art-society' as any} key={i} className={classes.link}>
                {node.children && <Serialize>{node.children}</Serialize>}
              </Link>
            )
          }

          // Special handling for members area
          if (relationTo === 'members-only-page') {
            return (
              <Link href={'/members-area' as any} key={i} className={classes.link}>
                {node.children && <Serialize>{node.children}</Serialize>}
              </Link>
            )
          }

          // Special handling for blog posts
          if (relationTo === 'blogpost' || relationTo === 'blog-page') {
            return (
              <Link
                href={
                  {
                    pathname: '/insights/[...slug]',
                    params: { slug: [slug] },
                  } as any
                }
                key={i}
                className={classes.link}
              >
                {node.children && <Serialize>{node.children}</Serialize>}
              </Link>
            )
          }

          // Handle generic pages
          if (relationTo === 'generic-pages') {
            return (
              <Link href={`/${slug}` as any} key={i} className={classes.link}>
                {node.children && <Serialize>{node.children}</Serialize>}
              </Link>
            )
          }

          // Handle newsletter page
          if (relationTo === 'newsletter-page') {
            return (
              <Link href={'/newsletter' as any} key={i} className={classes.link}>
                {node.children && <Serialize>{node.children}</Serialize>}
              </Link>
            )
          }

          // Handle artists list page
          if (relationTo === 'artists-page') {
            return (
              <Link href={'/artists' as any} key={i} className={classes.link}>
                {node.children && <Serialize>{node.children}</Serialize>}
              </Link>
            )
          }

          // Fallback for any other collection types
          return (
            <Link
              href={
                {
                  pathname: `/${relationTo}/[slug]`,
                  params: { slug },
                } as any
              }
              key={i}
              className={classes.link}
            >
              {node.children && <Serialize>{node.children}</Serialize>}
            </Link>
          )
        }

        // Handle custom URLs
        if (node.fields?.link.type === 'custom' && node.fields.link.url) {
          // Use anchor tag for external URLs
          if (node.fields.link.url.startsWith('http')) {
            return (
              <a
                href={node.fields.link.url}
                key={i}
                className={classes.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {node.children && <Serialize>{node.children}</Serialize>}
              </a>
            )
          }

          // Use Link for internal paths
          return (
            <Link href={node.fields.link.url as any} key={i} className={classes.link}>
              {node.children && <Serialize>{node.children}</Serialize>}
            </Link>
          )
        }

        // Handle mailto links
        if (node.fields?.link.type === 'mailto' && node.fields.link.email) {
          const subject = node.fields.link.subject
            ? `?subject=${encodeURIComponent(node.fields.link.subject)}`
            : ''
          const body = node.fields.link.body
            ? `${subject ? '&' : '?'}body=${encodeURIComponent(node.fields.link.body)}`
            : ''
          return (
            <a
              href={`mailto:${node.fields.link.email}${subject}${body}`}
              key={i}
              className={classes.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {node.children && <Serialize>{node.children}</Serialize>}
            </a>
          )
        }

        // Fallback for legacy or malformed links
        if (node.url && node.url.startsWith('http')) {
          return (
            <a
              href={node.url}
              key={i}
              className={classes.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {node.children && <Serialize>{node.children}</Serialize>}
            </a>
          )
        }

        return (
          <Link href={(node.url || '/') as any} key={i} className={classes.link}>
            {node.children && <Serialize>{node.children}</Serialize>}
          </Link>
        )

      default:
        return <p key={i}>{node.children && <Serialize>{node.children}</Serialize>}</p>
    }
  })
}

// Create a non-component function to maintain the existing API
const serialize = (children: Children): React.ReactNode[] => {
  return [<Serialize key="serialize">{children}</Serialize>]
}

export default serialize
