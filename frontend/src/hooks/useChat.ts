import {
  startTransition,
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  API_BASE_URL,
  ApiError,
  type ChatRequestMessage,
  checkHealth,
  sendMessage,
} from '../api/client.ts'
import type { BannerState } from '../components/StatusBanner.tsx'
import {
  appendMessage,
  createConversation as createConversationRecord,
  setActiveConversation,
  setConversationTitle,
  updateMessageStatus,
  useActiveConversation,
  useConversationStoreStatus,
  useConversations,
} from '../store/conversations.ts'
import { MessageRole, MessageStatus } from '../types.ts'

export type HealthState =
  | { type: 'checking'; detail: string }
  | { type: 'online'; detail: string }
  | { type: 'offline'; detail: string }

function createUserMessage(content: string) {
  return {
    content,
    createdAt: new Date().toISOString(),
    id: crypto.randomUUID(),
    role: MessageRole.USER,
    status: MessageStatus.SENDING,
  }
}

function createAssistantMessage(content: string) {
  return {
    content,
    createdAt: new Date().toISOString(),
    id: crypto.randomUUID(),
    role: MessageRole.ASSISTANT,
    status: MessageStatus.SENT,
  }
}

function titleFromMessage(input: string) {
  const compact = input.trim().replace(/\s+/g, ' ')
  return compact.length <= 40 ? compact : `${compact.slice(0, 40).trim()}…`
}

function bannerFromError(error: unknown): Omit<BannerState, 'id'> {
  if (error instanceof ApiError) {
    if (error.code === 'OFFLINE') {
      return {
        message: 'No internet connection',
        tone: 'warning',
      }
    }

    if (error.code === 'TIMEOUT') {
      return {
        message: 'The assistant took too long to respond. Please try again.',
        tone: 'warning',
      }
    }

    if (error.code === 'SERVICE_UNAVAILABLE') {
      return {
        message: 'AI service unavailable, try again later',
        tone: 'error',
      }
    }
  }

  return {
    message: 'Something went wrong while sending your message.',
    tone: 'error',
  }
}

export function useChat() {
  const conversations = useConversations()
  const activeConversation = useActiveConversation()
  const { activeConversationId } = useConversationStoreStatus()

  const [draft, setDraft] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [pendingConversationIds, setPendingConversationIds] = useState<string[]>(
    [],
  )
  const [banner, setBanner] = useState<BannerState | null>(null)
  const [health, setHealth] = useState<HealthState>({
    type: 'checking',
    detail: 'Checking backend reachability…',
  })

  const isActiveConversationPending =
    !!activeConversationId && pendingConversationIds.includes(activeConversationId)

  const showBanner = useCallback((nextBanner: Omit<BannerState, 'id'>) => {
    setBanner({
      ...nextBanner,
      id: Date.now(),
    })
  }, [])

  const refreshHealth = useCallback(async () => {
    if (!window.navigator.onLine) {
      setHealth({
        type: 'offline',
        detail: 'Device is offline',
      })
      return
    }

    setHealth({
      type: 'checking',
      detail: 'Checking /api/health…',
    })

    try {
      await checkHealth()
      setHealth({
        type: 'online',
        detail: 'Backend is reachable',
      })
    } catch (error) {
      const nextBanner = bannerFromError(error)

      setHealth({
        type: 'offline',
        detail:
          error instanceof ApiError && error.code === 'OFFLINE'
            ? 'Device is offline'
            : 'Backend is unavailable right now',
      })
      showBanner(nextBanner)
    }
  }, [showBanner])

  useEffect(() => {
    const initialRefreshId = window.setTimeout(() => {
      void refreshHealth()
    }, 0)

    const handleOnline = () => {
      void refreshHealth()
    }

    const handleOffline = () => {
      setHealth({
        type: 'offline',
        detail: 'Device is offline',
      })
      showBanner({
        message: 'No internet connection',
        tone: 'warning',
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.clearTimeout(initialRefreshId)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [refreshHealth, showBanner])

  const runSendFlow = useCallback(
    async (
      conversationId: string,
      userMessageId: string,
      requestMessages: ChatRequestMessage[],
    ) => {
      setPendingConversationIds((currentIds) =>
        currentIds.includes(conversationId)
          ? currentIds
          : [...currentIds, conversationId],
      )

      try {
        const response = await sendMessage(conversationId, requestMessages)

        updateMessageStatus(conversationId, userMessageId, MessageStatus.SENT)
        appendMessage(conversationId, createAssistantMessage(response.reply.content))

        setPendingConversationIds((currentIds) =>
          currentIds.filter((id) => id !== conversationId),
        )
        setHealth({
          type: 'online',
          detail: 'Backend is reachable',
        })
      } catch (error) {
        updateMessageStatus(conversationId, userMessageId, MessageStatus.ERROR)
        setPendingConversationIds((currentIds) =>
          currentIds.filter((id) => id !== conversationId),
        )

        const nextBanner = bannerFromError(error)
        showBanner(nextBanner)

        if (
          error instanceof ApiError &&
          (error.code === 'OFFLINE' || error.code === 'SERVICE_UNAVAILABLE')
        ) {
          setHealth({
            type: 'offline',
            detail:
              error.code === 'OFFLINE'
                ? 'Device is offline'
                : 'Backend is unavailable right now',
          })
        }
      }
    },
    [showBanner],
  )

  function createConversation() {
    const conversation = createConversationRecord()
    setDraft('')
    setIsDrawerOpen(false)

    startTransition(() => {
      setActiveConversation(conversation.id)
    })
  }

  function selectPrompt(prompt: string) {
    setDraft(prompt)
  }

  function openConversation(conversationId: string) {
    startTransition(() => {
      setActiveConversation(conversationId)
    })
  }

  function sendDraft() {
    const content = draft.trim()

    if (!content || isActiveConversationPending) {
      return
    }

    const conversation =
      activeConversation ?? createConversationRecord({ activate: true })
    const existingMessages = conversation.messages
    const userMessage = createUserMessage(content)

    appendMessage(conversation.id, userMessage)

    if (existingMessages.length === 0) {
      setConversationTitle(conversation.id, titleFromMessage(content))
    }

    setDraft('')

    const requestMessages = [...existingMessages, userMessage].map((message) => ({
      content: message.content,
      role: message.role,
    }))

    void runSendFlow(conversation.id, userMessage.id, requestMessages)
  }

  function retryMessage(messageId: string) {
    if (!activeConversation || isActiveConversationPending) {
      return
    }

    const messageIndex = activeConversation.messages.findIndex(
      (message) => message.id === messageId,
    )

    if (messageIndex < 0) {
      return
    }

    const targetMessage = activeConversation.messages[messageIndex]
    if (targetMessage.role !== MessageRole.USER) {
      return
    }

    updateMessageStatus(
      activeConversation.id,
      targetMessage.id,
      MessageStatus.SENDING,
    )

    const requestMessages = activeConversation.messages
      .slice(0, messageIndex + 1)
      .map((message) => ({
        content: message.content,
        role: message.role,
      }))

    void runSendFlow(activeConversation.id, targetMessage.id, requestMessages)
  }

  return {
    activeConversation,
    activeConversationId: activeConversationId ?? '',
    apiBaseUrl: API_BASE_URL,
    banner,
    closeDrawer: () => setIsDrawerOpen(false),
    closeSettings: () => setIsSettingsOpen(false),
    conversations,
    createConversation,
    dismissBanner: () => setBanner(null),
    draft,
    health,
    isActiveConversationPending,
    isDrawerOpen,
    isSettingsOpen,
    openConversation,
    openDrawer: () => setIsDrawerOpen(true),
    openSettings: () => setIsSettingsOpen(true),
    refreshHealth: () => void refreshHealth(),
    retryMessage,
    selectPrompt,
    sendDraft,
    setDraft,
  }
}
