import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { Icon } from './icons.tsx'

interface ComposerProps {
  disabled: boolean
  onChange: (value: string) => void
  onSend: () => void
  value: string
}

export function Composer({
  disabled,
  onChange,
  onSend,
  value,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const isSendDisabled = disabled || value.trim().length === 0

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = '0px'

    const computedStyle = window.getComputedStyle(textarea)
    const lineHeight = Number.parseFloat(computedStyle.lineHeight) || 24
    const maxHeight = lineHeight * 5 + 12

    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }, [value])

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const shouldSendOnEnter = window.matchMedia('(min-width: 768px)').matches

    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      shouldSendOnEnter &&
      !isSendDisabled
    ) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className="composer-shell">
      <div className="composer">
        <textarea
          aria-label="Message composer"
          className="composer__input"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Lumina anything..."
          ref={textareaRef}
          rows={1}
          value={value}
        />

        <button
          className="composer__send"
          disabled={isSendDisabled}
          onClick={onSend}
          type="button"
        >
          <Icon name="send" />
        </button>
      </div>
    </div>
  )
}
