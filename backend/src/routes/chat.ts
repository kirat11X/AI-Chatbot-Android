import { Router } from 'express'
import { AppError } from '../lib/appError'
import { getAIReply } from '../services/ai'
import { ChatMessageInput, ChatRequestBody, chatRoles } from '../types/chat'

function isChatRole(value: string): value is ChatMessageInput['role'] {
  return chatRoles.includes(value as ChatMessageInput['role'])
}

function parseChatRequest(body: unknown): ChatRequestBody {
  if (!body || typeof body !== 'object') {
    throw new AppError(400, 'INVALID_BODY', 'Request body must be a JSON object.')
  }

  const payload = body as Record<string, unknown>
  const { conversationId, messages } = payload

  if (typeof conversationId !== 'string' || !conversationId.trim()) {
    throw new AppError(
      400,
      'INVALID_CONVERSATION_ID',
      'conversationId must be a non-empty string.',
    )
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new AppError(
      400,
      'INVALID_MESSAGES',
      'messages must be a non-empty array.',
    )
  }

  const normalizedMessages = messages.map((message, index) => {
    if (!message || typeof message !== 'object') {
      throw new AppError(
        400,
        'INVALID_MESSAGE',
        `Message at index ${index} must be an object.`,
      )
    }

    const candidate = message as Record<string, unknown>
    const role =
      typeof candidate.role === 'string' ? candidate.role.trim() : undefined
    const content =
      typeof candidate.content === 'string'
        ? candidate.content.trim()
        : undefined

    if (!role || !isChatRole(role)) {
      throw new AppError(
        400,
        'INVALID_MESSAGE_ROLE',
        `Message at index ${index} has an invalid role.`,
      )
    }

    if (!content) {
      throw new AppError(
        400,
        'INVALID_MESSAGE_CONTENT',
        `Message at index ${index} must include non-empty content.`,
      )
    }

    return {
      content,
      role,
    }
  })

  return {
    conversationId: conversationId.trim(),
    messages: normalizedMessages,
  }
}

const chatRouter = Router()

chatRouter.post('/', async (request, response) => {
  const { messages } = parseChatRequest(request.body)
  const reply = await getAIReply(messages)

  response.json({
    reply: {
      content: reply,
      role: 'assistant',
    },
  })
})

export default chatRouter
