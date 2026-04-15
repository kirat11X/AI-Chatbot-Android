import type { Message } from '../types.ts'
import { MessageRole, MessageStatus } from '../types.ts'
import { formatMessageTime } from '../utils/time.ts'
import { Icon } from './icons.tsx'

interface MessageBubbleProps {
  message: Message
  onRetry?: (messageId: string) => void
}

export function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const isUserMessage = message.role === MessageRole.USER
  const isSending = message.status === MessageStatus.SENDING
  const isError = message.status === MessageStatus.ERROR

  return (
    <article
      className={`message-row ${isUserMessage ? 'message-row--user' : ''}`}
    >
      <div
        className={`message-bubble ${
          isUserMessage ? 'message-bubble--user' : 'message-bubble--assistant'
        } ${isError ? 'message-bubble--error' : ''}`}
      >
        <p className="message-bubble__content">{message.content}</p>

        <div className="message-bubble__meta">
          <span>{formatMessageTime(message.createdAt)}</span>

          {isSending ? (
            <span className="message-bubble__status">
              <span className="spinner" />
              Sending
            </span>
          ) : null}

          {isError ? (
            <button
              className="message-bubble__retry"
              onClick={() => onRetry?.(message.id)}
              type="button"
            >
              <Icon name="refresh" />
              Retry
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
