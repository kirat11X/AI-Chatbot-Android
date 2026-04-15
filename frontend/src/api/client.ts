const DEFAULT_TIMEOUT_MS = 30_000

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:3001'

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'OFFLINE'
  | 'SERVICE_UNAVAILABLE'
  | 'TIMEOUT'
  | 'UNKNOWN'

interface ApiErrorPayload {
  error?: {
    code?: string
    message?: string
  }
}

export class ApiError extends Error {
  code: ApiErrorCode
  status?: number

  constructor(code: ApiErrorCode, message: string, status?: number) {
    super(message)
    this.code = code
    this.name = 'ApiError'
    this.status = status
  }
}

function buildUrl(path: string) {
  const normalizedBaseUrl = API_BASE_URL.endsWith('/')
    ? API_BASE_URL
    : `${API_BASE_URL}/`

  return new URL(path.replace(/^\//, ''), normalizedBaseUrl).toString()
}

async function request<T>(
  path: string,
  init?: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
) {
  if (!window.navigator.onLine) {
    throw new ApiError('OFFLINE', 'No internet connection')
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => {
    controller.abort()
  }, timeoutMs)

  try {
    const response = await fetch(buildUrl(path), {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      signal: controller.signal,
    })

    const isJson = response.headers
      .get('content-type')
      ?.includes('application/json')
    const payload = isJson
      ? ((await response.json()) as T | ApiErrorPayload)
      : undefined

    if (!response.ok) {
      const errorMessage =
        (payload as ApiErrorPayload | undefined)?.error?.message ??
        `Request failed with status ${response.status}`

      if (response.status === 400) {
        throw new ApiError('BAD_REQUEST', errorMessage, response.status)
      }

      if (response.status >= 500) {
        throw new ApiError(
          'SERVICE_UNAVAILABLE',
          errorMessage,
          response.status,
        )
      }

      throw new ApiError('UNKNOWN', errorMessage, response.status)
    }

    return payload as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        'TIMEOUT',
        'The request timed out. Please try again.',
      )
    }

    throw new ApiError(
      'SERVICE_UNAVAILABLE',
      'AI service unavailable, try again later',
    )
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export interface HealthResponse {
  status: 'ok'
  timestamp: string
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

export function checkHealth() {
  return request<HealthResponse>('/api/health', {
    method: 'GET',
  }, 5_000)
}

export function sendMessage(
  conversationId: string,
  messages: ChatRequestMessage[],
) {
  return request<ChatResponse>('/api/chat', {
    body: JSON.stringify({
      conversationId,
      messages,
    }),
    method: 'POST',
  })
}
