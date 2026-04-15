import type { HealthState } from '../hooks/useChat.ts'
import { Icon } from './icons.tsx'

interface SettingsDrawerProps {
  apiBaseUrl: string
  health: HealthState
  isOpen: boolean
  onClose: () => void
  onRefreshHealth: () => void
}

const APP_VERSION = '0.1.0'

export function SettingsDrawer({
  apiBaseUrl,
  health,
  isOpen,
  onClose,
  onRefreshHealth,
}: SettingsDrawerProps) {
  return (
    <>
      <button
        aria-label="Close settings drawer"
        className={`sheet-backdrop ${isOpen ? 'sheet-backdrop--visible' : ''}`}
        onClick={onClose}
        type="button"
      />

      <aside
        aria-hidden={!isOpen}
        className={`settings-drawer ${isOpen ? 'settings-drawer--open' : ''}`}
      >
        <div className="settings-drawer__header">
          <div>
            <p className="settings-drawer__eyebrow">About this build</p>
            <h2>Settings &amp; status</h2>
          </div>

          <button
            aria-label="Close settings"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="settings-card">
          <p className="settings-card__label">App version</p>
          <p className="settings-card__value">{APP_VERSION}</p>
        </div>

        <div className="settings-card">
          <p className="settings-card__label">Description</p>
          <p className="settings-card__body">
            An Android-first assistant UI inspired by the provided Liquid
            Sanctuary screens, now wired to a real backend with persisted
            local conversation history and production-focused error handling.
          </p>
        </div>

        <div className="settings-card">
          <p className="settings-card__label">Backend connectivity</p>
          <div className={`status-pill status-pill--${health.type}`}>
            <Icon name="status" />
            <span>{health.detail}</span>
          </div>
          <button
            className="settings-card__action"
            onClick={onRefreshHealth}
            type="button"
          >
            Refresh status
          </button>
          <p className="settings-card__hint">{apiBaseUrl}/api/health</p>
        </div>
      </aside>
    </>
  )
}
