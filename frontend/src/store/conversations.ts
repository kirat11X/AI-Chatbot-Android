import { useSyncExternalStore } from 'react'
import { MessageStatus } from '../types.ts'
import type { Conversation, Message } from '../types.ts'

const CONVERSATIONS_STORAGE_KEY = 'lumina.conversations.v1'
const ACTIVE_CONVERSATION_STORAGE_KEY = 'lumina.activeConversationId.v1'

interface ConversationStoreSnapshot {
  activeConversationId: string | null
  conversations: Conversation[]
  hydrated: boolean
}

let snapshot: ConversationStoreSnapshot = {
  activeConversationId: null,
  conversations: [],
  hydrated: false,
}

const listeners = new Set<() => void>()

function isBrowser() {
  return typeof window !== 'undefined'
}

function emitChange() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function sortConversations(conversations: Conversation[]) {
  return [...conversations].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}

function normalizeMessage(candidate: unknown): Message | null {
  if (!candidate || typeof candidate !== 'object') {
    return null
  }

  const message = candidate as Record<string, unknown>
  if (
    typeof message.id !== 'string' ||
    typeof message.content !== 'string' ||
    typeof message.createdAt !== 'string' ||
    (message.role !== 'user' && message.role !== 'assistant') ||
    (message.status !== MessageStatus.SENDING &&
      message.status !== MessageStatus.SENT &&
      message.status !== MessageStatus.ERROR)
  ) {
    return null
  }

  return {
    content: message.content,
    createdAt: message.createdAt,
    id: message.id,
    role: message.role,
    status: message.status,
  }
}

function normalizeConversation(candidate: unknown): Conversation | null {
  if (!candidate || typeof candidate !== 'object') {
    return null
  }

  const conversation = candidate as Record<string, unknown>
  if (
    typeof conversation.id !== 'string' ||
    typeof conversation.title !== 'string' ||
    typeof conversation.createdAt !== 'string' ||
    typeof conversation.updatedAt !== 'string' ||
    !Array.isArray(conversation.messages)
  ) {
    return null
  }

  const messages = conversation.messages
    .map(normalizeMessage)
    .filter((message): message is Message => !!message)

  return {
    createdAt: conversation.createdAt,
    id: conversation.id,
    messages,
    title: conversation.title,
    updatedAt: conversation.updatedAt,
  }
}

function persistSnapshot() {
  if (!isBrowser() || !snapshot.hydrated) {
    return
  }

  window.localStorage.setItem(
    CONVERSATIONS_STORAGE_KEY,
    JSON.stringify(snapshot.conversations),
  )

  if (snapshot.activeConversationId) {
    window.localStorage.setItem(
      ACTIVE_CONVERSATION_STORAGE_KEY,
      snapshot.activeConversationId,
    )
  } else {
    window.localStorage.removeItem(ACTIVE_CONVERSATION_STORAGE_KEY)
  }
}

function ensureHydrated() {
  if (snapshot.hydrated || !isBrowser()) {
    return
  }

  const storedConversations = window.localStorage.getItem(
    CONVERSATIONS_STORAGE_KEY,
  )
  const storedActiveConversationId = window.localStorage.getItem(
    ACTIVE_CONVERSATION_STORAGE_KEY,
  )

  let parsedConversations: Conversation[] = []

  if (storedConversations) {
    try {
      const candidate = JSON.parse(storedConversations) as unknown

      if (Array.isArray(candidate)) {
        parsedConversations = candidate
          .map(normalizeConversation)
          .filter((conversation): conversation is Conversation => !!conversation)
      }
    } catch {
      parsedConversations = []
    }
  }

  snapshot = {
    activeConversationId:
      storedActiveConversationId &&
      parsedConversations.some(
        (conversation) => conversation.id === storedActiveConversationId,
      )
        ? storedActiveConversationId
        : parsedConversations[0]?.id ?? null,
    conversations: sortConversations(parsedConversations),
    hydrated: true,
  }
}

function updateSnapshot(
  updater: (currentSnapshot: ConversationStoreSnapshot) => ConversationStoreSnapshot,
) {
  ensureHydrated()
  snapshot = updater(snapshot)
  persistSnapshot()
  emitChange()
}

function getSnapshot() {
  ensureHydrated()
  return snapshot
}

function getServerSnapshot(): ConversationStoreSnapshot {
  return {
    activeConversationId: null,
    conversations: [],
    hydrated: false,
  }
}

function createConversationRecord(): Conversation {
  const now = new Date().toISOString()

  return {
    createdAt: now,
    id: crypto.randomUUID(),
    messages: [],
    title: 'New conversation',
    updatedAt: now,
  }
}

export function useConversations() {
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot().conversations,
    () => getServerSnapshot().conversations,
  )
}

export function useActiveConversation() {
  return useSyncExternalStore(
    subscribe,
    () => {
      const currentSnapshot = getSnapshot()
      return (
        currentSnapshot.conversations.find(
          (conversation) =>
            conversation.id === currentSnapshot.activeConversationId,
        ) ?? null
      )
    },
    () => null,
  )
}

export function useConversationStoreStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function createConversation(options?: { activate?: boolean }) {
  const conversation = createConversationRecord()

  updateSnapshot((currentSnapshot) => ({
    ...currentSnapshot,
    activeConversationId:
      options?.activate === false
        ? currentSnapshot.activeConversationId
        : conversation.id,
    conversations: sortConversations([
      conversation,
      ...currentSnapshot.conversations,
    ]),
  }))

  return conversation
}

export function setActiveConversation(conversationId: string) {
  updateSnapshot((currentSnapshot) => ({
    ...currentSnapshot,
    activeConversationId: currentSnapshot.conversations.some(
      (conversation) => conversation.id === conversationId,
    )
      ? conversationId
      : currentSnapshot.activeConversationId,
  }))
}

export function setConversationTitle(conversationId: string, title: string) {
  updateSnapshot((currentSnapshot) => ({
    ...currentSnapshot,
    conversations: sortConversations(
      currentSnapshot.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              title,
            }
          : conversation,
      ),
    ),
  }))
}

export function appendMessage(conversationId: string, message: Message) {
  updateSnapshot((currentSnapshot) => ({
    ...currentSnapshot,
    conversations: sortConversations(
      currentSnapshot.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, message],
              updatedAt: message.createdAt,
            }
          : conversation,
      ),
    ),
  }))
}

export function updateMessageStatus(
  conversationId: string,
  messageId: string,
  status: Message['status'],
) {
  updateSnapshot((currentSnapshot) => ({
    ...currentSnapshot,
    conversations: sortConversations(
      currentSnapshot.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              updatedAt: new Date().toISOString(),
              messages: conversation.messages.map((message) =>
                message.id === messageId
                  ? {
                      ...message,
                      status,
                    }
                  : message,
              ),
            }
          : conversation,
      ),
    ),
  }))
}
