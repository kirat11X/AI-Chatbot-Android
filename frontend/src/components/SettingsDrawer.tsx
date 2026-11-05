import { useState } from 'react'
import {
  DEFAULT_MODEL,
  getStoredApiKey,
  getStoredModel,
  isApiKeyConfigured,
  setStoredApiKey,
  setStoredModel,
} from '../api/gemini.ts'
import { Icon } from './icons.tsx'

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const AVAILABLE_MODELS = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Fast & Free)', tag: 'Recommended' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Next-Gen)', tag: 'Fast' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', tag: 'Preview' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Deep Reasoning)', tag: 'Pro' },
]

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const [apiKey, setApiKey] = useState(() => getStoredApiKey())
  const [model, setModel] = useState(() => getStoredModel())
  const [isConfigured, setIsConfigured] = useState(() => isApiKeyConfigured())
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [copiedKeyName, setCopiedKeyName] = useState<string | null>(null)
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
    setStoredModel(DEFAULT_MODEL)
    setModel(DEFAULT_MODEL)
    setIsConfigured(false)
    setSaveStatus('Key cleared. Switched to local fallback mode.')
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const handleCopyEnvKey = (keyName: string) => {
    navigator.clipboard.writeText(keyName).then(() => {
      setCopiedKeyName(keyName)
      setTimeout(() => setCopiedKeyName(null), 2000)
    })
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
            <h2 className="settings-drawer__title">Lumina Settings</h2>
            <p className="settings-drawer__subtitle">
              Web &amp; Mobile Configuration
            </p>
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

        {/* Live Engine Status */}
        <div className="settings-card">
          <p className="settings-card__label">Active AI Engine</p>
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
              ? 'Connected to Google Gemini API for live generative responses.'
              : 'Zero-configuration mode active. All queries receive thoughtful local offline responses without external API calls.'}
          </p>
        </div>

        {/* Vercel Environment Variables Guide */}
        <div className="settings-card settings-card--highlight">
          <div className="settings-card__badge">Vercel Environment Keys</div>
          <p className="settings-card__body">
            To host Lumina AI on <strong>Vercel (Free Tier)</strong>, add this private secret in your Vercel Project Dashboard (<strong>Settings &rarr; Environment Variables</strong>):
          </p>

          <div className="env-key-row">
            <div className="env-key-info">
              <code className="env-key-name">GEMINI_API_KEY</code>
              <span className="env-key-desc">Private Secret &bull; Recommended &bull; Zero Vercel warnings</span>
            </div>
            <button
              className="env-key-copy-btn"
              onClick={() => handleCopyEnvKey('GEMINI_API_KEY')}
              type="button"
            >
              {copiedKeyName === 'GEMINI_API_KEY' ? 'Copied!' : 'Copy Key'}
            </button>
          </div>

          <div className="env-key-row">
            <div className="env-key-info">
              <code className="env-key-name">VITE_GEMINI_API_KEY</code>
              <span className="env-key-desc">Client Config &bull; If using this, set type to &quot;Config&quot; in Vercel</span>
            </div>
            <button
              className="env-key-copy-btn"
              onClick={() => handleCopyEnvKey('VITE_GEMINI_API_KEY')}
              type="button"
            >
              {copiedKeyName === 'VITE_GEMINI_API_KEY' ? 'Copied!' : 'Copy Key'}
            </button>
          </div>

          <div className="env-key-row">
            <div className="env-key-info">
              <code className="env-key-name">GEMINI_MODEL</code>
              <span className="env-key-desc">Optional (default: gemini-1.5-flash)</span>
            </div>
            <button
              className="env-key-copy-btn"
              onClick={() => handleCopyEnvKey('GEMINI_MODEL')}
              type="button"
            >
              {copiedKeyName === 'GEMINI_MODEL' ? 'Copied!' : 'Copy Key'}
            </button>
          </div>

          <a
            className="settings-card__link"
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get a free Gemini API key at Google AI Studio &rarr;
          </a>
        </div>

        {/* Browser In-Memory / LocalStorage Key Override */}
        <div className="settings-card">
          <p className="settings-card__label">Browser / Client API Key</p>
          <p className="settings-card__body">
            You can also paste a key directly below. It is stored securely only in your browser&apos;s <code>localStorage</code>.
          </p>
          <input
            className="settings-card__input"
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy... (optional for testing)"
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
          ) : null}
        </div>

        {/* Model Selection */}
        <div className="settings-card">
          <p className="settings-card__label">Gemini Model Selection</p>
          <div className="model-select-group">
            {AVAILABLE_MODELS.map((m) => (
              <label
                key={m.id}
                className={`model-option ${model === m.id ? 'model-option--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="model"
                  value={m.id}
                  checked={model === m.id}
                  onChange={(e) => {
                    setModel(e.target.value)
                    setStoredModel(e.target.value)
                  }}
                />
                <div className="model-option__info">
                  <span className="model-option__name">{m.name}</span>
                  <span className="model-option__tag">{m.tag}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Android APK Download Card */}
        <div className="settings-card">
          <p className="settings-card__label">Android Mobile App</p>
          <p className="settings-card__body">
            Download and install the native Android APK directly on your phone:
          </p>
          <a
            className="settings-card__action"
            download="LuminaAI-debug.apk"
            href="/LuminaAI-debug.apk"
            style={{
              textDecoration: 'none',
              marginTop: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span>📱 Download LuminaAI-debug.apk (5.9 MB)</span>
          </a>
        </div>
      </aside>
    </>
  )
}
