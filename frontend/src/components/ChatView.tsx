import { useEffect, useRef } from 'react'
import type { Conversation } from '../types.ts'
import { MessageBubble } from './MessageBubble.tsx'
import { ThinkingBubble } from './ThinkingBubble.tsx'

interface ChatViewProps {
  conversation: Conversation
  isThinking: boolean
  onRetry: (messageId: string) => void
}

export function ChatView({
  conversation,
  isThinking,
  onRetry,
}: ChatViewProps) {
  const lastMessageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [conversation.id, conversation.messages.length, isThinking])

  return (
    <section className="chat-view">
      <div className="chat-view__inner">
        {conversation.messages.map((message, index) => {
          const isLastMessage = index === conversation.messages.length - 1

          return (
            <div key={message.id} ref={isLastMessage ? lastMessageRef : null}>
              <MessageBubble message={message} onRetry={onRetry} />
            </div>
          )
        })}

        {isThinking ? (
          <div ref={lastMessageRef}>
            <ThinkingBubble />
          </div>
        ) : null}
      </div>
    </section>
  )
}
