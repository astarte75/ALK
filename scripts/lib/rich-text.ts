/**
 * Rich text conversion utilities for Contentful.
 * Converts plain text and markdown to Contentful Rich Text JSON format.
 */

interface RichTextNode {
  nodeType: string
  data: Record<string, unknown>
  content?: RichTextNode[]
  value?: string
  marks?: Array<{ type: string }>
}

interface RichTextDocument {
  nodeType: 'document'
  data: Record<string, never>
  content: RichTextNode[]
}

function emptyDocument(): RichTextDocument {
  return {
    nodeType: 'document',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        data: {},
        content: [{ nodeType: 'text', value: '', marks: [], data: {} }],
      },
    ],
  }
}

function textNode(value: string, marks: Array<{ type: string }> = []): RichTextNode {
  return { nodeType: 'text', value, marks, data: {} }
}

function paragraphNode(children: RichTextNode[]): RichTextNode {
  return { nodeType: 'paragraph', data: {}, content: children }
}

function headingNode(level: number, children: RichTextNode[]): RichTextNode {
  return { nodeType: `heading-${level}`, data: {}, content: children }
}

function listItemNode(children: RichTextNode[]): RichTextNode {
  return {
    nodeType: 'list-item',
    data: {},
    content: [paragraphNode(children)],
  }
}

function unorderedListNode(items: RichTextNode[]): RichTextNode {
  return { nodeType: 'unordered-list', data: {}, content: items }
}

function hyperlinkNode(uri: string, text: string): RichTextNode {
  return {
    nodeType: 'hyperlink',
    data: { uri },
    content: [textNode(text)],
  }
}

/**
 * Parse inline markdown formatting (bold, italic, links) into rich text nodes.
 */
function parseInlineMarkdown(text: string): RichTextNode[] {
  const nodes: RichTextNode[] = []
  // Match bold, italic, and links
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    // Text before the match
    if (match.index > lastIndex) {
      nodes.push(textNode(text.slice(lastIndex, match.index)))
    }

    if (match[1] && match[2]) {
      // Link: [text](url)
      nodes.push(hyperlinkNode(match[2], match[1]))
    } else if (match[3]) {
      // Bold + italic: ***text***
      nodes.push(textNode(match[3], [{ type: 'bold' }, { type: 'italic' }]))
    } else if (match[4]) {
      // Bold: **text**
      nodes.push(textNode(match[4], [{ type: 'bold' }]))
    } else if (match[5]) {
      // Italic: *text*
      nodes.push(textNode(match[5], [{ type: 'italic' }]))
    } else if (match[6]) {
      // Italic: _text_
      nodes.push(textNode(match[6], [{ type: 'italic' }]))
    }

    lastIndex = match.index + match[0].length
  }

  // Remaining text
  if (lastIndex < text.length) {
    nodes.push(textNode(text.slice(lastIndex)))
  }

  if (nodes.length === 0) {
    nodes.push(textNode(text))
  }

  return nodes
}

/**
 * Convert plain text to Contentful Rich Text document.
 */
export function textToRichText(text: string | null | undefined): RichTextDocument {
  if (!text) return emptyDocument()

  const paragraphs = text.split(/\n\n+/).filter(Boolean)
  if (paragraphs.length === 0) return emptyDocument()

  return {
    nodeType: 'document',
    data: {},
    content: paragraphs.map((p) => paragraphNode([textNode(p.trim())])),
  }
}

/**
 * Convert markdown text to Contentful Rich Text document.
 * Handles: headings, bold, italic, links, unordered lists, paragraphs.
 */
export function markdownToRichText(markdown: string | null | undefined): RichTextDocument {
  if (!markdown) return emptyDocument()

  const lines = markdown.split('\n')
  const blocks: RichTextNode[] = []
  let currentListItems: RichTextNode[] = []
  let currentParagraphLines: string[] = []

  function flushParagraph() {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(' ').trim()
      if (text) {
        blocks.push(paragraphNode(parseInlineMarkdown(text)))
      }
      currentParagraphLines = []
    }
  }

  function flushList() {
    if (currentListItems.length > 0) {
      blocks.push(unorderedListNode(currentListItems))
      currentListItems = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    // Empty line: flush current block
    if (!trimmed) {
      flushParagraph()
      flushList()
      continue
    }

    // Heading: ### text
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      flushParagraph()
      flushList()
      const level = Math.min(headingMatch[1].length, 6)
      blocks.push(headingNode(level, parseInlineMarkdown(headingMatch[2])))
      continue
    }

    // Unordered list item: - text
    const listMatch = trimmed.match(/^[-*]\s+(.+)$/)
    if (listMatch) {
      flushParagraph()
      currentListItems.push(listItemNode(parseInlineMarkdown(listMatch[1])))
      continue
    }

    // Regular text (paragraph continuation)
    if (currentListItems.length > 0) {
      flushList()
    }
    currentParagraphLines.push(trimmed)
  }

  flushParagraph()
  flushList()

  if (blocks.length === 0) return emptyDocument()

  return { nodeType: 'document', data: {}, content: blocks }
}
