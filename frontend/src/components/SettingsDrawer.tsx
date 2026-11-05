import { useState } from 'react'
import {
  GEMINI_MODEL,
  getStoredApiKey,
  setStoredApiKey,
  getStoredModel,
  setStoredModel,
  isApiKeyConfigured,
} from '../api/gemini.ts'
import { Icon } from './icons.tsx'

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const APP_VERSION = '0.1.0'

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const [apiKey, setApiKey] = useState(() => getStoredApiKey())
  const [model, setModel] = useState(() => getStoredModel())
  const [isConfigured, setIsConfigured] = useState(() => isApiKeyConfigured())
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [showKey, setShowKey] = useState(false)

  const handleSave = () => {
    setStoredApiKey(apiKey)
    setStoredModel(model)
    setIsConfigured(Boolean(apiKey.trim()))
    setSaveStatus('Settings saved successfully!')
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const handleClear = () => {
    setApiKey('')
    setStoredApiKey('')
    setStoredModel(GEMINI_MODEL)
    setModel(GEMINI_MODEL)
    setIsConfigured(false)
    setSaveStatus('Key cleared. Switched to local fallback mode.')
    setTimeout(() => setSaveStatus(null), 3000)
  }

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
            <h2>Settings &amp; info</h2>
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
            An Android-first assistant UI inspired by the Liquid Sanctuary
            design aesthetic, powered by Google Gemini AI with instant offline
            local fallback, persisted conversation history, and zero-backend
            Vercel hosting.
          </p>
        </div>

        <div className="settings-card">
          <p className="settings-card__label">AI Engine Status</p>
          {isConfigured ? (
            <div className="status-pill status-pill--online">
              <Icon name="status" />
              <span>Google Gemini ({model})</span>
            </div>
          ) : (
            <div className="status-pill status-pill--fallback">
              <Icon name="spark" />
              <span>Local Fallback Engine (Active)</span>
            </div>
          )}
          <p className="settings-card__hint">
            {isConfigured
              ? 'Connected to Google Gemini API'
              : 'Zero external backend required. Running via instant local assistant.'}
          </p>
        </div>

        <div className="settings-card">
          <p className="settings-card__label">Google Gemini API Key</p>
          <input
            className="settings-card__input"
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy... (optional)"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
          />
          <div className="settings-card__btn-group">
            <button
              className="settings-card__action"
              onClick={handleSave}
              type="button"
            >
              Save Key
            </button>
            <button
              className="settings-card__action settings-card__action--secondary"
              onClick={() => setShowKey(!showKey)}
              type="button"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
            {apiKey ? (
              <button
                className="settings-card__action settings-card__action--secondary"
                onClick={handleClear}
                type="button"
              >
                Clear
              </button>
            ) : null}
          </div>
          {saveStatus ? (
            <p
              className="settings-card__hint"
              style={{ color: 'var(--primary)', fontWeight: 600 }}
            >
              {saveStatus}
            </p>
          ) : (
            <p className="settings-card__hint">
              Optional: Enter your own Google AI key to chat directly with Gemini.
            </p>
          )}
        </div>

        <div className="settings-card">
          <p className="settings-card__label">Android APK Package</p>
          <p className="settings-card__body">
            Installable debug APK built with Capacitor for real Android devices.
          </p>
          <a
            className="settings-card__action"
            download="LuminaAI-debug.apk"
            href="/LuminaAI-debug.apk"
            style={{
              textDecoration: 'none',
              marginTop: '0.8rem',
            }}
          >
            Download LuminaAI-debug.apk
          </a>
        </div>
      </aside>
    </>
  )
}
