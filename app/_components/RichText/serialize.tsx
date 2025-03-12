import React, { Fragment } from 'react'
import escapeHTML from 'escape-html'
import { Text } from 'slate'
import { Link } from '@/lib/i18n'
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

const serialize = (children: Children): React.ReactNode[] =>
  children.map((node, i) => {
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
        return <h1 key={i}>{serialize(node.children)}</h1>
      case 'h2':
        return <h2 key={i}>{serialize(node.children)}</h2>
      case 'h3':
        return <h3 key={i}>{serialize(node.children)}</h3>
      case 'h4':
        return <h4 key={i}>{serialize(node.children)}</h4>
      case 'h5':
        return <h5 key={i}>{serialize(node.children)}</h5>
      case 'h6':
        return <h6 key={i}>{serialize(node.children)}</h6>
      case 'blockquote':
        return <blockquote key={i}>{serialize(node.children)}</blockquote>
      case 'ul':
        return <ul key={i}>{serialize(node.children)}</ul>
      case 'ol':
        return <ol key={i}>{serialize(node.children)}</ol>
      case 'li':
        return <li key={i}>{serialize(node.children)}</li>
      case 'link':
        // Handle internal references
        if (node.linkType === 'internal' && node.doc) {
          const { relationTo, value } = node.doc
          const slug = value?.slug || ''
          return (
            <Link
              href={`/${relationTo === 'homepage' ? '' : slug}`}
              key={i}
              className={classes.link}
            >
              {serialize(node.children)}
            </Link>
          )
        }

        // Handle custom URLs
        if (node.fields?.link.type === 'custom' && node.fields.link.url) {
          return (
            <Link
              href={node.fields.link.url}
              key={i}
              className={classes.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {serialize(node.children)}
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
              {serialize(node.children)}
            </a>
          )
        }

        // Fallback for legacy or malformed links
        return (
          <Link
            href={node.url || '#'}
            key={i}
            className={classes.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {serialize(node.children)}
          </Link>
        )

      default:
        return <p key={i}>{serialize(node.children)}</p>
    }
  })

export default serialize
