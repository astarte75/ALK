'use client'

import { documentToReactComponents, type Options } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, type Document } from '@contentful/rich-text-types'
import Image from 'next/image'
import React from 'react'

const renderOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (_node, children) => <h1>{children}</h1>,
    [BLOCKS.HEADING_2]: (_node, children) => <h2>{children}</h2>,
    [BLOCKS.HEADING_3]: (_node, children) => <h3>{children}</h3>,
    [BLOCKS.HEADING_4]: (_node, children) => <h4>{children}</h4>,
    [BLOCKS.HEADING_5]: (_node, children) => <h5>{children}</h5>,
    [BLOCKS.HEADING_6]: (_node, children) => <h6>{children}</h6>,

    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const fields = node.data.target?.fields
      if (!fields) return null

      const file = fields.file
      const title = fields.title

      if (!file || !file.contentType?.startsWith('image/')) return null

      return (
        <Image
          src={`https:${file.url}`}
          alt={title || ''}
          width={file.details?.image?.width || 800}
          height={file.details?.image?.height || 600}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )
    },

    [INLINES.HYPERLINK]: (node, children) => {
      const uri = node.data.uri as string
      const isExternal = uri.startsWith('http://') || uri.startsWith('https://')
      return (
        <a
          href={uri}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
  },
}

export function renderRichText(document: Document): React.ReactNode {
  return documentToReactComponents(document, renderOptions)
}
