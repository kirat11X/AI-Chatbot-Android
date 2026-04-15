export const MessageRole = {
  USER: 'user',
  ASSISTANT: 'assistant',
} as const

export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole]

export const MessageStatus = {
  SENDING: 'sending',
  SENT: 'sent',
  ERROR: 'error',
} as const

export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus]

export interface Message {
  id: string
  role: MessageRole
  content: string
  status: MessageStatus
  createdAt: string
}

export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}
