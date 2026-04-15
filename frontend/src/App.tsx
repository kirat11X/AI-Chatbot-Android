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
    apiBaseUrl,
    banner,
    closeDrawer,
    closeSettings,
    conversations,
    createConversation,
    draft,
    health,
    isActiveConversationPending,
    isDrawerOpen,
    isSettingsOpen,
    openConversation,
    openDrawer,
    openSettings,
    refreshHealth,
    retryMessage,
    selectPrompt,
    sendDraft,
    setDraft,
    dismissBanner,
  } = useChat()

  const conversationTitle = activeConversation?.title ?? 'New conversation'
  const shouldShowEmptyState =
    !activeConversation || activeConversation.messages.length === 0

  return (
    <div className="app-shell">
      <div className="app-shell__ambient app-shell__ambient--left" />
      <div className="app-shell__ambient app-shell__ambient--right" />

      <TopBar
        title={conversationTitle}
        onNewChat={createConversation}
        onOpenDrawer={openDrawer}
        onOpenSettings={openSettings}
      />

      <Drawer
        activeConversationId={activeConversationId}
        conversations={conversations}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onNewChat={createConversation}
        onSelectConversation={openConversation}
      />

      <SettingsDrawer
        apiBaseUrl={apiBaseUrl}
        health={health}
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        onRefreshHealth={refreshHealth}
      />

      <main className="app-shell__main">
        {banner ? (
          <StatusBanner banner={banner} onDismiss={dismissBanner} />
        ) : null}

        {shouldShowEmptyState ? (
          <EmptyState prompts={SUGGESTED_PROMPTS} onSelectPrompt={selectPrompt} />
        ) : (
          <ChatView
            conversation={activeConversation}
            isThinking={isActiveConversationPending}
            onRetry={retryMessage}
          />
        )}
      </main>

      <Composer
        disabled={isActiveConversationPending}
        onChange={setDraft}
        onSend={sendDraft}
        value={draft}
      />
    </div>
  )
}

export default App
