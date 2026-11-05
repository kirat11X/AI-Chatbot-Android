import { getAIReply, type GeminiMessage } from './gemini'

export type ApiErrorCode =
  | 'AI_ERROR'
  | 'OFFLINE'
  | 'TIMEOUT'
  | 'UNKNOWN'

export class ApiError extends Error {
  code: ApiErrorCode

  constructor(code: ApiErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = 'ApiError'
  }
}

export interface ChatRequestMessage {
  content: string
  role: 'assistant' | 'user'
}

interface ChatResponse {
  reply: {
    content: string
    role: 'assistant'
  }
}

export async function sendMessage(
  _conversationId: string,
  messages: ChatRequestMessage[],
): Promise<ChatResponse> {
  const geminiMessages: GeminiMessage[] = messages.map((m) => ({
    content: m.content,
    role: m.role,
  }))

  // 1. Try Vercel Serverless Private API (/api/chat) with server-side private GEMINI_API_KEY
  if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 28000)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: geminiMessages }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = (await response.json()) as ChatResponse
        if (data?.reply?.content) {
          return data
        }
      }
    } catch {
      // Serverless endpoint not present or timed out; fall back to client engine
    }
  }

  // 2. Fall back to client-side engine (localStorage key, client env key, or local offline fallback)
  try {
    const reply = await getAIReply(geminiMessages)

    return {
      reply: {
        content: reply,
        role: 'assistant',
      },
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error) {
      if (error.message === 'AI_TIMEOUT') {
        throw new ApiError(
          'TIMEOUT',
          'The assistant took too long to respond. Please try again.',
        )
      }

      if (error.message === 'AI_EMPTY_RESPONSE') {
        throw new ApiError(
          'AI_ERROR',
          'The AI returned an empty response. Please try again.',
        )
      }
    }

    throw new ApiError(
      'AI_ERROR',
      'Something went wrong with the AI. Please try again later.',
    )
  }
}
