export function ThinkingBubble() {
  return (
    <div className="message-row">
      <div className="thinking-bubble" aria-live="polite">
        <span className="thinking-bubble__label">Thinking</span>
        <span className="thinking-bubble__dots">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  )
}
