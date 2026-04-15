import type { Conversation } from '../types.ts'
import { formatRelativeTime } from '../utils/time.ts'
import { Icon } from './icons.tsx'
import { LiquidMark } from './LiquidMark.tsx'

interface DrawerProps {
  activeConversationId: string
  conversations: Conversation[]
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
  onSelectConversation: (conversationId: string) => void
}

export function Drawer({
  activeConversationId,
  conversations,
  isOpen,
  onClose,
  onNewChat,
  onSelectConversation,
}: DrawerProps) {
  const orderedConversations = [...conversations].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  return (
    <>
      <button
        aria-label="Close navigation drawer"
        className={`sheet-backdrop ${isOpen ? 'sheet-backdrop--visible' : ''}`}
        onClick={onClose}
        type="button"
      />

      <aside
        aria-hidden={!isOpen}
        className={`drawer ${isOpen ? 'drawer--open' : ''}`}
      >
        <div className="drawer__header">
          <div className="drawer__brand">
            <LiquidMark />
            <div>
              <p className="drawer__brand-title">Lumina</p>
              <p className="drawer__brand-copy">Warm intelligence, production wired</p>
            </div>
          </div>

          <button
            aria-label="Close drawer"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <button
          className="drawer__new-chat"
          onClick={() => {
            onNewChat()
            onClose()
          }}
          type="button"
        >
          <Icon name="plus" />
          <span>New chat</span>
        </button>

        <div className="drawer__section-label">Recent conversations</div>

        <div className="drawer__list">
          {orderedConversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId

            return (
              <button
                className={`drawer__conversation ${
                  isActive ? 'drawer__conversation--active' : ''
                }`}
                key={conversation.id}
                onClick={() => {
                  onSelectConversation(conversation.id)
                  onClose()
                }}
                type="button"
              >
                <div className="drawer__conversation-icon">
                  <Icon name="history" />
                </div>

                <div className="drawer__conversation-copy">
                  <span className="drawer__conversation-title">
                    {conversation.title}
                  </span>
                  <span className="drawer__conversation-time">
                    {formatRelativeTime(conversation.updatedAt)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </aside>
    </>
  )
}
