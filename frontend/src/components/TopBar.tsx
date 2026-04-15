import { useEffect, useRef, useState } from 'react'
import { Icon } from './icons.tsx'

interface TopBarProps {
  title: string
  onNewChat: () => void
  onOpenDrawer: () => void
  onOpenSettings: () => void
}

export function TopBar({
  title,
  onNewChat,
  onOpenDrawer,
  onOpenSettings,
}: TopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

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
      <button
        aria-label="Open conversation drawer"
        className="icon-button"
        onClick={onOpenDrawer}
        type="button"
      >
        <Icon name="menu" />
      </button>

      <div className="top-bar__title">
        <p className="top-bar__eyebrow">Liquid Sanctuary</p>
        <h1>{title}</h1>
      </div>

      <div className="top-bar__actions" ref={menuRef}>
        <button
          aria-label="Start new chat"
          className="icon-button icon-button--accent"
          onClick={onNewChat}
          type="button"
        >
          <Icon name="plus" />
        </button>

        <button
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          aria-label="Open more options"
          className="icon-button"
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          <Icon name="more" />
        </button>

        {isMenuOpen ? (
          <div className="top-bar__menu" role="menu">
            <button
              className="top-bar__menu-item"
              onClick={() => {
                setIsMenuOpen(false)
                onOpenSettings()
              }}
              role="menuitem"
              type="button"
            >
              <Icon name="settings" />
              <span>Settings &amp; about</span>
            </button>
          </div>
        ) : null}
      </div>
    </header>
  )
}
