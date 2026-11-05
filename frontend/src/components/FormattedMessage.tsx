import { useState, type ReactNode } from 'react'
import { Icon } from './icons.tsx'

interface FormattedMessageProps {
  content: string
}

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <button
      className="code-block__copy"
      onClick={handleCopy}
      type="button"
      title="Copy code"
    >
      {copied ? (
        <>
          <Icon name="check" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Icon name="copy" />
          <span>Copy</span>
        </>
      )}
    </button>
  )
}

function renderInlineText(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g
  let lastIdx = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index))
    }

    const token = match[0]
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-ink">
          {token.slice(2, -2)}
        </strong>,
      )
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="inline-code">
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic">
          {token.slice(1, -1)}
        </em>,
      )
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = /^\[(.*?)\]\((.*?)\)$/.exec(token)
      if (linkMatch) {
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {linkMatch[1]}
          </a>,
        )
      } else {
        parts.push(token)
      }
    } else {
      parts.push(token)
    }

    lastIdx = regex.lastIndex
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx))
  }

  return parts
}

export function FormattedMessage({ content }: FormattedMessageProps) {
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
  const blocks: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let blockKey = 0

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textChunk = content.slice(lastIndex, match.index)
      blocks.push(
        <div key={`text-${blockKey++}`} className="markdown-prose">
          {renderMarkdownSection(textChunk)}
        </div>,
      )
    }

    const lang = match[1]?.trim() || 'code'
    const code = match[2]?.replace(/\n$/, '') || ''

    blocks.push(
      <div key={`code-${blockKey++}`} className="code-block">
        <div className="code-block__header">
          <span className="code-block__lang">{lang}</span>
          <CopyCodeButton code={code} />
        </div>
        <pre className="code-block__pre">
          <code>{code}</code>
        </pre>
      </div>,
    )

    lastIndex = codeBlockRegex.lastIndex
  }

  if (lastIndex < content.length) {
    const textChunk = content.slice(lastIndex)
    blocks.push(
      <div key={`text-${blockKey++}`} className="markdown-prose">
        {renderMarkdownSection(textChunk)}
      </div>,
    )
  }

  return <div className="formatted-message">{blocks}</div>
}

function renderMarkdownSection(chunk: string): ReactNode[] {
  const lines = chunk.split('\n')
  const elements: ReactNode[] = []
  let listItems: string[] = []
  let isNumbered = false

  const flushList = (key: number) => {
    if (listItems.length === 0) return
    if (isNumbered) {
      elements.push(
        <ol key={`ol-${key}`} className="markdown-ol">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInlineText(item)}</li>
          ))}
        </ol>,
      )
    } else {
      elements.push(
        <ul key={`ul-${key}`} className="markdown-ul">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInlineText(item)}</li>
          ))}
        </ul>,
      )
    }
    listItems = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '---' || trimmed === '***') {
      flushList(i)
      elements.push(<hr key={`hr-${i}`} className="markdown-hr" />)
      continue
    }

    if (trimmed.startsWith('# ')) {
      flushList(i)
      elements.push(
        <h1 key={`h1-${i}`} className="markdown-h1">
          {renderInlineText(trimmed.slice(2))}
        </h1>,
      )
      continue
    }
    if (trimmed.startsWith('## ')) {
      flushList(i)
      elements.push(
        <h2 key={`h2-${i}`} className="markdown-h2">
          {renderInlineText(trimmed.slice(3))}
        </h2>,
      )
      continue
    }
    if (trimmed.startsWith('### ')) {
      flushList(i)
      elements.push(
        <h3 key={`h3-${i}`} className="markdown-h3">
          {renderInlineText(trimmed.slice(4))}
        </h3>,
      )
      continue
    }

    if (trimmed.startsWith('> ')) {
      flushList(i)
      elements.push(
        <blockquote key={`bq-${i}`} className="markdown-bq">
          {renderInlineText(trimmed.slice(2))}
        </blockquote>,
      )
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      if (isNumbered && listItems.length > 0) flushList(i)
      isNumbered = false
      listItems.push(trimmed.replace(/^[-*]\s+/, ''))
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      if (!isNumbered && listItems.length > 0) flushList(i)
      isNumbered = true
      listItems.push(trimmed.replace(/^\d+\.\s+/, ''))
      continue
    }

    if (!trimmed) {
      flushList(i)
      continue
    }

    flushList(i)
    elements.push(
      <p key={`p-${i}`} className="markdown-p">
        {renderInlineText(line)}
      </p>,
    )
  }

  flushList(lines.length)
  return elements
}
