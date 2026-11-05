import { useEffect, useRef, useState } from 'react'
import { isApiKeyConfigured, getStoredModel } from '../api/gemini.ts'
import { Icon } from './icons.tsx'
import { LiquidMark } from './LiquidMark.tsx'

interface TopBarProps {
  title: string
  onNewChat: () => void
  onOpenDrawer: () => void
  onOpenSettings: () => void
  isSidebarOpen?: boolean
  onToggleSidebar?: () => void
}

export function TopBar({
  title,
  onNewChat,
  onOpenDrawer,
  onOpenSettings,
  isSidebarOpen,
  onToggleSidebar,
}: TopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const isConfigured = isApiKeyConfigured()
  const activeModel = getStoredModel()

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [isMenuOpen])

  return (
    <header className="top-bar">
      <div className="top-bar__left">
        {/* Mobile menu button */}
        <button
          aria-label="Open conversation drawer"
          className="icon-button top-bar__mobile-menu"
          onClick={onOpenDrawer}
          type="button"
        >
          <Icon name="menu" />
        </button>

        {/* Desktop sidebar toggle */}
        {onToggleSidebar ? (
          <button
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="icon-button top-bar__desktop-toggle"
            onClick={onToggleSidebar}
            type="button"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Icon name="menu" />
          </button>
        ) : null}

        <div className="top-bar__brand-mark">
          <LiquidMark />
        </div>

        <div className="top-bar__title">
          <p className="top-bar__eyebrow">Lumina AI Web</p>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="top-bar__center">
        {/* Model status pill on desktop */}
        <button
          className="top-bar__model-pill"
          onClick={onOpenSettings}
          type="button"
          title="Click to configure Gemini API Key in Settings"
        >
          <span className={`status-dot ${isConfigured ? 'status-dot--online' : ''}`} />
          <span className="model-name">
            {isConfigured ? `Gemini ${activeModel}` : 'Local Fallback Engine'}
          </span>
        </button>
      </div>

      <div className="top-bar__actions" ref={menuRef}>
        <a
          className="top-bar__apk-btn"
          href="/LuminaAI-debug.apk"
          download="LuminaAI-debug.apk"
          title="Download Android APK"
        >
          <span>📱 APK</span>
        </a>

        <button
          aria-label="Start new chat"
          className="icon-button icon-button--accent"
          onClick={onNewChat}
          type="button"
          title="New Chat (Ctrl/Cmd + K)"
        >
          <Icon name="plus" />
        </button>

        <button
          aria-label="Open settings"
          className="icon-button"
          onClick={onOpenSettings}
          type="button"
          title="Settings & Environment Keys"
        >
          <Icon name="settings" />
        </button>
      </div>
    </header>
  )
}
