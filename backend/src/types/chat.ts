export const chatRoles = ['user', 'assistant'] as const

export type ChatRole = (typeof chatRoles)[number]

export interface ChatMessageInput {
  content: string
  role: ChatRole
}

export interface ChatRequestBody {
  conversationId: string
  messages: ChatMessageInput[]
}
