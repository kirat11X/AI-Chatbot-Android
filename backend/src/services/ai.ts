import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { AppError } from '../lib/appError'
import type { ChatMessageInput } from '../types/chat'

const DEFAULT_MODEL = 'gpt-5.2'
const REQUEST_TIMEOUT_MS = 30_000

let cachedClient: OpenAI | null = null
let cachedApiKey: string | null = null

function getClient() {
  const apiKey = process.env.AI_API_KEY?.trim()

  if (!apiKey) {
    throw new AppError(
      503,
      'AI_PROVIDER_UNAVAILABLE',
      'AI_API_KEY is missing. Set it in the backend environment before using chat.',
    )
  }

  if (!cachedClient || cachedApiKey !== apiKey) {
    cachedClient = new OpenAI({
      apiKey,
      maxRetries: 1,
      timeout: REQUEST_TIMEOUT_MS,
    })
    cachedApiKey = apiKey
  }

  return cachedClient
}

function toProviderMessages(
  messages: ChatMessageInput[],
): ChatCompletionMessageParam[] {
  return messages.map((message) => ({
    content: message.content,
    role: message.role,
  }))
}

export async function getAIReply(messages: ChatMessageInput[]) {
  const client = getClient()
  const model = process.env.AI_MODEL?.trim() || DEFAULT_MODEL

  try {
    const completion = await client.chat.completions.create({
      messages: toProviderMessages(messages),
      model,
    })

    const reply = completion.choices[0]?.message?.content?.trim()

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

    if (error instanceof OpenAI.APIConnectionTimeoutError) {
      throw new AppError(
        503,
        'AI_TIMEOUT',
        'AI provider timed out. Please try again.',
      )
    }

    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API error', {
        name: error.name,
        requestId: error.requestID,
        status: error.status,
      })

      throw new AppError(
        503,
        'AI_PROVIDER_ERROR',
        'AI provider is unavailable right now. Please try again later.',
      )
    }

    console.error('Unexpected AI service error', error)
    throw new AppError(
      503,
      'AI_PROVIDER_ERROR',
      'AI provider is unavailable right now. Please try again later.',
    )
  }
}
