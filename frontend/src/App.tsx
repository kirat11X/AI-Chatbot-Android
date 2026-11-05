import { useEffect, useState } from 'react'
import './App.css'
import { ChatView } from './components/ChatView.tsx'
import { Composer } from './components/Composer.tsx'
import { Drawer } from './components/Drawer.tsx'
import { EmptyState } from './components/EmptyState.tsx'
import { SettingsDrawer } from './components/SettingsDrawer.tsx'
import { StatusBanner } from './components/StatusBanner.tsx'
import { TopBar } from './components/TopBar.tsx'
import { SUGGESTED_PROMPTS } from './data/starterPrompts.ts'
import { useChat } from './hooks/useChat.ts'

function App() {
  const {
    activeConversation,
    activeConversationId,
    banner,
    closeDrawer,
    closeSettings,
    conversations,
    createConversation,
    draft,
    isActiveConversationPending,
    isDrawerOpen,
    isSettingsOpen,
    openConversation,
    openDrawer,
    openSettings,
    retryMessage,
    selectPrompt,
    sendDraft,
    setDraft,
    dismissBanner,
  } = useChat()

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024
    }
    return true
  })

  // Keyboard shortcuts (Cmd/Ctrl + K for new chat)
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        createConversation()
      }
      if (e.key === 'Escape') {
        closeSettings()
        closeDrawer()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [createConversation, closeSettings, closeDrawer])

  const conversationTitle = activeConversation?.title ?? 'New conversation'
  const shouldShowEmptyState =
    !activeConversation || activeConversation.messages.length === 0

  return (
    <div
      className={`app-shell ${
        isDesktopSidebarOpen ? 'app-shell--desktop-sidebar-open' : ''
      }`}
    >
      <div className="app-shell__ambient app-shell__ambient--left" />
      <div className="app-shell__ambient app-shell__ambient--right" />

      {/* Persistent Sidebar on Desktop / Drawer on Mobile */}
      <Drawer
        activeConversationId={activeConversationId}
        conversations={conversations}
        isOpen={isDrawerOpen || isDesktopSidebarOpen}
        onClose={() => {
          closeDrawer()
          setIsDesktopSidebarOpen(false)
        }}
        onNewChat={createConversation}
        onSelectConversation={openConversation}
        onOpenSettings={openSettings}
      />

      <div className="app-shell__body">
        <TopBar
          title={conversationTitle}
          onNewChat={createConversation}
          onOpenDrawer={openDrawer}
          onOpenSettings={openSettings}
          isSidebarOpen={isDesktopSidebarOpen}
          onToggleSidebar={() => setIsDesktopSidebarOpen((prev) => !prev)}
        />

        <main className="app-shell__main">
          <div className="app-shell__content-container">
            {banner ? (
              <StatusBanner banner={banner} onDismiss={dismissBanner} />
            ) : null}

            {shouldShowEmptyState ? (
              <EmptyState
                prompts={SUGGESTED_PROMPTS}
                onSelectPrompt={selectPrompt}
              />
            ) : (
              <ChatView
                conversation={activeConversation}
                isThinking={isActiveConversationPending}
                onRetry={retryMessage}
              />
            )}
          </div>
        </main>

        <Composer
          disabled={isActiveConversationPending}
          onChange={setDraft}
          onSend={sendDraft}
          value={draft}
        />
      </div>

      <SettingsDrawer isOpen={isSettingsOpen} onClose={closeSettings} />
    </div>
  )
}

export default App
