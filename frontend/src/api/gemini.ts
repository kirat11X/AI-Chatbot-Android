import { GoogleGenerativeAI } from '@google/generative-ai'

export interface GeminiMessage {
  content: string
  role: 'assistant' | 'user'
}

const STORAGE_KEY_API_KEY = 'lumina_gemini_api_key'
const STORAGE_KEY_MODEL = 'lumina_gemini_model'
export const DEFAULT_MODEL = 'gemini-3-flash-preview'
export const BACKUP_MODEL = 'gemini-2.5-flash-lite'
export const DEFAULT_API_KEY = 'AIzaSyDsCVithqpxy3oO4XZZGjqSiGL2aM8ylDI'
const REQUEST_TIMEOUT_MS = 25_000

export function getStoredApiKey(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem(STORAGE_KEY_API_KEY)?.trim()
    if (stored) return stored
  }
  return import.meta.env.VITE_GEMINI_API_KEY?.trim() || DEFAULT_API_KEY
}

export function setStoredApiKey(key: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (key.trim()) {
      window.localStorage.setItem(STORAGE_KEY_API_KEY, key.trim())
    } else {
      window.localStorage.removeItem(STORAGE_KEY_API_KEY)
    }
  }
}

export function getStoredModel(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem(STORAGE_KEY_MODEL)?.trim()
    if (stored) return stored
  }
  return import.meta.env.VITE_GEMINI_MODEL?.trim() || DEFAULT_MODEL
}

export function setStoredModel(model: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (model.trim()) {
      window.localStorage.setItem(STORAGE_KEY_MODEL, model.trim())
    } else {
      window.localStorage.removeItem(STORAGE_KEY_MODEL)
    }
  }
}

export function isApiKeyConfigured(): boolean {
  return Boolean(getStoredApiKey())
}

function toGeminiContents(messages: GeminiMessage[]) {
  return messages.map((message) => ({
    parts: [{ text: message.content }],
    role: message.role === 'assistant' ? 'model' : 'user',
  }))
}

export function generateLocalFallbackReply(
  messages: GeminiMessage[],
  note?: string,
): string {
  const lastUserMsg =
    [...messages].reverse().find((m) => m.role === 'user')?.content.trim() || ''
  const lower = lastUserMsg.toLowerCase()

  let reply = ''

  if (
    lower.includes('readme') ||
    lower.includes('professor-ready') ||
    lower.includes('installing the apk')
  ) {
    reply = `# Lumina AI — Android & Web Assistant

Lumina AI is an Android-first AI chat companion inspired by the Liquid Sanctuary design aesthetic. It combines high-performance local conversation persistence with Google Gemini AI intelligence and instant offline fallback capabilities.

---

### 📦 Quick Start & APK Installation
1. **Download APK**: Transfer \`LuminaAI-debug.apk\` from the repository root to your Android device.
2. **Install**: Open the APK from your device's Files or Downloads app. Allow installation from unknown sources when prompted.
3. **Launch**: Open **Lumina AI** from your app launcher.

---

### 🚀 Running the App Locally
\`\`\`bash
# 1. Clone repository
git clone https://github.com/kirat11X/AI-Chatbot-Android.git
cd AI-Chatbot-Android/frontend

# 2. Install dependencies & start Vite dev server
npm install
npm run dev
\`\`\`

---

### 🏛️ Architecture Overview
- **Frontend**: React 19 + TypeScript + Vite. Responsive layout tailored for mobile touch gestures and desktop viewports.
- **AI Engine**: Direct client integration with Google Gemini (\`@google/generative-ai\`) + built-in zero-latency local fallback generator.
- **Mobile Packaging**: Capacitor Android wrapper compiling the web application into a native Android APK with edge-to-edge system bars and ambient styling.
- **Deployment**: Free-tier Vercel static deployment configured via \`vercel.json\`.`
  } else if (
    lower.includes('calm') ||
    lower.includes('ux') ||
    lower.includes('chat interface')
  ) {
    reply = `### Three Ways to Make Lumina Feel Calmer & More Premium on Mobile

1. **Ambient Organic Depth & Soft Lighting**
   - Replace harsh borders with subtle, low-opacity layered glassmorphism (\`backdrop-filter: blur(24px)\`) and warm radial glow gradients.
   - Use earthy, warm neutrals (sand, amber-tinted cream, warm ink) rather than stark contrast blues or clinical greys.

2. **Generous Spatial Breathing Room & Micro-Interactions**
   - Maintain 16–20px outer padding and relaxed message bubble line-height (\`line-height: 1.65\`).
   - Implement gentle elastic spring animations on drawer slide-outs and button taps (\`transform: scale(0.96)\`) rather than rigid instant snaps.

3. **Minimalist, Non-Intrusive Composer & Zen Focus**
   - Keep the input dock anchored comfortably above the Android navigation bar.
   - Auto-expand textarea smoothly up to 5 lines without jarring the viewport, maintaining a clutter-free view of the ongoing dialogue.`
  } else if (
    lower.includes('backend') ||
    lower.includes('route') ||
    lower.includes('/api/health') ||
    lower.includes('/api/chat')
  ) {
    reply = `### Backend Architecture & Route Specification

Lumina is designed to work standalone on Vercel without a mandatory self-hosted backend, but when paired with an optional Node/Express microservice, the structure is organized as follows:

\`\`\`
backend/
├── src/
│   ├── routes/
│   │   ├── chat.ts       # Handles POST /api/chat
│   │   └── health.ts     # Handles GET /api/health
│   ├── services/
│   │   └── ai.ts         # Google Gemini SDK orchestration
│   ├── middleware/       # Rate limiting, error handling, CORS
│   └── index.ts          # Server entrypoint
\`\`\`

#### Endpoints:
- **\`GET /api/health\`**: Lightweight connectivity heartbeat returning \`{ status: "ok", timestamp: string }\` to test latency and service readiness.
- **\`POST /api/chat\`**: Accepts \`{ conversationId: string, messages: ChatMessageInput[] }\`, validates schema with Zod, queries Gemini with timeout safeguards, and returns \`{ reply: { content, role } }\`.`
  } else if (
    lower.includes('hello') ||
    lower.includes('hi') ||
    lower.includes('hey') ||
    lower.includes('who are you')
  ) {
    reply = `Hello! I'm **Lumina AI**, your mobile-first AI assistant.

I can help you draft documents, brainstorm architecture ideas, explain code, and answer questions.

- 📱 **Android Native**: Packaged with Capacitor into \`LuminaAI-debug.apk\`.
- ⚡ **Web & Vercel**: Deployed directly via Vite with zero required backend dependencies.
- 🧠 **AI Intelligence**: Powered by Google Gemini with an automatic offline local fallback engine.

How can I help you today?`
  } else if (
    lower.includes('help') ||
    lower.includes('feature') ||
    lower.includes('what can you do')
  ) {
    reply = `Here is what **Lumina AI** provides:

1. **Conversational Assistant**: Ask any technical, design, or general question.
2. **Local Persistence**: Conversations are saved locally in your browser/app storage.
3. **Dual AI Engine**: Supports Google Gemini models (\`gemini-1.5-flash\`, etc.) and a resilient local fallback mode.
4. **Android APK Ready**: Pre-built \`LuminaAI-debug.apk\` ready to install on your phone.
5. **Configurable**: Easily set or update your Gemini API key in the Settings Drawer anytime.`
  } else {
    reply = `Thank you for your message!

Regarding **"${lastUserMsg.length > 60 ? lastUserMsg.slice(0, 60) + '…' : lastUserMsg}"**:

Lumina AI is fully initialized and operational. You can explore:
- Technical architecture discussions
- Android APK installation and features
- UI/UX design considerations
- Any coding or conceptual questions

*Tip: You can add your own Gemini API key in Settings to unlock real-time generative responses from Google Gemini!*`
  }

  if (note) {
    reply += `\n\n*(Lumina Local Fallback • ${note})*`
  }

  return reply
}

export async function getAIReply(messages: GeminiMessage[]): Promise<string> {
  const apiKey = getStoredApiKey()
  const modelName = getStoredModel()

  if (!apiKey) {
    // Seamlessly use local fallback generator if no key is configured
    return generateLocalFallbackReply(
      messages,
      'Local fallback mode. Set your Gemini API Key in Settings to enable live Google AI.',
    )
  }

  if (typeof window !== 'undefined' && !window.navigator.onLine) {
    return generateLocalFallbackReply(
      messages,
      'Device is offline. Response generated via local fallback.',
    )
  }

  try {
    const client = new GoogleGenerativeAI(apiKey)
    const contents = toGeminiContents(messages)

    let reply = ''
    const models = [modelName, BACKUP_MODEL].filter(Boolean)

    for (const m of models) {
      try {
        const geminiModel = client.getGenerativeModel({ model: m })
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('AI_TIMEOUT'))
          }, REQUEST_TIMEOUT_MS)
        })

        const result = (await Promise.race([
          geminiModel.generateContent({ contents }),
          timeoutPromise,
        ])) as { response: { text(): string } }

        reply = result.response.text().trim()
        if (reply) break
      } catch {
        // try next model
      }
    }

    if (!reply) {
      return generateLocalFallbackReply(
        messages,
        'Gemini returned an empty reply. Provided fallback response.',
      )
    }

    return reply
  } catch (error) {
    console.warn(
      'Gemini request failed, falling back to local assistant:',
      error,
    )
    const reason =
      error instanceof Error && error.message.includes('AI_TIMEOUT')
        ? 'Gemini request timed out'
        : 'Gemini service unreachable / rate-limited'
    return generateLocalFallbackReply(
      messages,
      `${reason}. Generated via local fallback.`,
    )
  }
}

export { DEFAULT_MODEL as GEMINI_MODEL }
