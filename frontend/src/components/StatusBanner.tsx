import { Icon } from './icons.tsx'

export interface BannerState {
  id: number
  message: string
  tone: 'info' | 'warning' | 'error'
}

interface StatusBannerProps {
  banner: BannerState
  onDismiss: () => void
}

export function StatusBanner({ banner, onDismiss }: StatusBannerProps) {
  return (
    <section className={`status-banner status-banner--${banner.tone}`}>
      <div className="status-banner__copy">
        <Icon name="status" />
        <p>{banner.message}</p>
      </div>

      <button
        aria-label="Dismiss status banner"
        className="status-banner__dismiss"
        onClick={onDismiss}
        type="button"
      >
        <Icon name="close" />
      </button>
    </section>
  )
}
