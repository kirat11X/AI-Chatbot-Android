import { isApiKeyConfigured, getStoredModel } from '../api/gemini.ts'
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
  onOpenSettings?: () => void
}

export function Drawer({
  activeConversationId,
  conversations,
  isOpen,
  onClose,
  onNewChat,
  onSelectConversation,
  onOpenSettings,
}: DrawerProps) {
  const isConfigured = isApiKeyConfigured()
  const activeModel = getStoredModel()

  const orderedConversations = [...conversations].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  const handleSelect = (conversationId: string) => {
    onSelectConversation(conversationId)
    if (window.innerWidth < 840) {
      onClose()
    }
  }

  const handleNew = () => {
    onNewChat()
    if (window.innerWidth < 840) {
      onClose()
    }
  }

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
              <p className="drawer__brand-title">Lumina AI</p>
              <p className="drawer__brand-copy">Web &amp; Android Assistant</p>
            </div>
          </div>

          <button
            aria-label="Close drawer"
            className="icon-button drawer__close-btn"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <button
          className="drawer__new-chat"
          onClick={handleNew}
          type="button"
        >
          <Icon name="plus" />
          <span>New Conversation</span>
        </button>

        {/* Engine status indicator */}
        <div
          className="drawer__status"
          onClick={onOpenSettings}
          title="Click to configure AI Engine in Settings"
        >
          <span className={`drawer__status-dot ${isConfigured ? 'drawer__status-dot--online' : ''}`} />
          <span className="drawer__status-text">
            {isConfigured ? `Gemini (${activeModel})` : 'Local Fallback Engine'}
          </span>
        </div>

        <div className="drawer__section-label">Recent conversations</div>

        <div className="drawer__list">
          {orderedConversations.length === 0 ? (
            <div className="drawer__empty">No conversation history yet.</div>
          ) : (
            orderedConversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId

              return (
                <button
                  className={`drawer__conversation ${
                    isActive ? 'drawer__conversation--active' : ''
                  }`}
                  key={conversation.id}
                  onClick={() => handleSelect(conversation.id)}
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
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="drawer__footer">
          {onOpenSettings ? (
            <button
              className="drawer__footer-item"
              onClick={onOpenSettings}
              type="button"
            >
              <Icon name="settings" />
              <span>Settings &amp; Keys</span>
            </button>
          ) : null}

          <a
            className="drawer__footer-item"
            href="/LuminaAI-debug.apk"
            download="LuminaAI-debug.apk"
            title="Download Android APK"
          >
            <Icon name="spark" />
            <span>Download Android APK</span>
          </a>
        </div>
      </aside>
    </>
  )
}
