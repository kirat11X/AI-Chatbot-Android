import { GoogleGenerativeAI } from '@google/generative-ai'
import { AppError } from '../lib/appError'
import type { ChatMessageInput } from '../types/chat'

const DEFAULT_MODEL = 'gemini-2.5-flash-lite'
const REQUEST_TIMEOUT_MS = 30_000

let cachedClient: GoogleGenerativeAI | null = null
let cachedApiKey: string | null = null

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim()

  if (!apiKey) {
    throw new AppError(
      503,
      'AI_PROVIDER_UNAVAILABLE',
      'GEMINI_API_KEY is missing. Set it in the backend environment before using chat.',
    )
  }

  if (!cachedClient || cachedApiKey !== apiKey) {
    cachedClient = new GoogleGenerativeAI(apiKey)
    cachedApiKey = apiKey
  }

  return cachedClient
}

function toProviderMessages(messages: ChatMessageInput[]) {
  return messages.map((message) => ({
    content: message.content,
    role: message.role === 'assistant' ? 'model' : 'user',
  }))
}

export async function getAIReply(messages: ChatMessageInput[]) {
  const client = getClient()
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL

  try {
    const geminiModel = client.getGenerativeModel({ model })
    const contents = toProviderMessages(messages).map((message) => ({
      parts: [{ text: message.content }],
      role: message.role,
    }))

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Gemini request timed out.'))
      }, REQUEST_TIMEOUT_MS)
    })

    const result = (await Promise.race([
      geminiModel.generateContent({ contents }),
      timeoutPromise,
    ])) as { response: { text(): string } }

    const reply = result.response.text().trim()

    if (!reply) {
      throw new AppError(
        503,
        'AI_EMPTY_RESPONSE',
        'AI provider returned an empty response.',
      )
    }

    return reply
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    if (error instanceof Error && error.message.includes('timed out')) {
      throw new AppError(
        503,
        'AI_TIMEOUT',
        'Gemini provider timed out. Please try again.',
      )
    }

    console.error('Gemini API error', error)
    throw new AppError(
      503,
      'AI_PROVIDER_ERROR',
      'Gemini provider is unavailable right now. Please try again later.',
    )
  }
}
