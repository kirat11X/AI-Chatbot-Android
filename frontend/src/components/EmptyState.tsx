import { LiquidMark } from './LiquidMark.tsx'
import { Icon } from './icons.tsx'

interface PromptChip {
  id: string
  label: string
  prompt: string
}

interface EmptyStateProps {
  prompts: PromptChip[]
  onSelectPrompt: (prompt: string) => void
}

export function EmptyState({ prompts, onSelectPrompt }: EmptyStateProps) {
  return (
    <section className="empty-state">
      <div className="empty-state__glow" />
      <LiquidMark />

      <div className="empty-state__copy">
        <p className="empty-state__eyebrow">Editorial calm, AI-first</p>
        <h2>Start a conversation that feels thoughtful.</h2>
        <p>
          Ask for ideas, planning help, writing support, or a quiet second
          brain. Your conversations are stored locally on this device and sent
          to the backend only when you choose to message the assistant.
        </p>
      </div>

      <div className="empty-state__prompts">
        {prompts.map((prompt) => (
          <button
            className="prompt-chip"
            key={prompt.id}
            onClick={() => onSelectPrompt(prompt.prompt)}
            type="button"
          >
            <Icon name="spark" />
            <span>{prompt.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
