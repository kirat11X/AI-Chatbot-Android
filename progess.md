# Progress

Note: this file was originally created from `steps.txt` using the misspelled name `progess.md`. The current project status checklist now lives in `progress.md`.

## Phase 1 - Project Setup & Scaffolding

### 1.1 Create your repo structure
Create a single root folder (e.g. `ai-chatbot/`) and inside it create two sub-folders: `frontend/` and `backend/`. Initialize a root `README.md` and a `.gitignore` that covers `node_modules`, `.env`, `dist`, and `android/` build artifacts.

### 1.2 Initialize the frontend
Inside `frontend/`, run `npm create vite@latest . -- --template react-ts`. Then install Tailwind CSS (`npm install -D tailwindcss postcss autoprefixer` and `npx tailwindcss init -p`). Verify you can run `npm run dev` and see the Vite default page in your browser.

### 1.3 Initialize the backend
Inside `backend/`, run `npm init -y`, then install `express cors dotenv`. Install dev dependencies `typescript ts-node nodemon @types/node @types/express`. Create a `tsconfig.json` and a minimal `src/index.ts` with a health endpoint. Verify `npm run dev` starts the server and `GET /api/health` returns `{ status: "ok" }`.

### 1.4 Set up environment files
In `frontend/`, create `.env` with `VITE_API_BASE_URL=http://localhost:3001`. In `backend/`, create `.env` with `PORT=3001`, `AI_API_KEY=`, `AI_MODEL=`, `CORS_ORIGIN=http://localhost:5173`. Add both `.env` files to `.gitignore` immediately.

## Phase 2 - Frontend: Screens & Components

### 2.1 Define your data models and types
Create `frontend/src/types.ts` and define the two core types: `Message` (`id`, `role`, `content`, `status`, `createdAt`) and `Conversation` (`id`, `title`, `createdAt`, `updatedAt`, `messages`). Add a `MessageRole` enum (`user | assistant`) and a `MessageStatus` enum (`sending | sent | error`).

### 2.2 Build the app shell
Create a root `App.tsx` that renders a full-height layout with three zones: a persistent top bar, a slide-in navigation drawer (closed by default), and a main content area. The shell manages which conversation is active and whether the drawer is open. Keep this stateful component lean; extract everything visual into child components.

### 2.3 Build the top bar
Create `components/TopBar.tsx`. It shows a hamburger menu button on the left (opens the drawer), the current conversation title in the centre, and a new-chat icon button on the right. Make it fixed to the top on mobile with `position: sticky`.

### 2.4 Build the navigation drawer
Create `components/Drawer.tsx`. It slides in from the left and lists all stored conversations (title + relative timestamp). Tapping a conversation closes the drawer and switches to that chat. Include a "New chat" button at the top of the list. Use a backdrop overlay that closes the drawer when tapped. Apply the warm "Liquid Sanctuary" palette here.

### 2.5 Build the empty state
Create `components/EmptyState.tsx` for when no conversation is active or the current one has no messages. Show the app logo, a welcoming headline, and 2-3 suggested starter prompts as tappable chips that pre-fill the composer.

### 2.6 Build the message bubble component
Create `components/MessageBubble.tsx`. User messages align right with a warm accent background. Assistant messages align left with a neutral background. Support a `status` prop: `sending` shows a spinner, `error` shows a red tint with a retry icon. Include a subtle timestamp below each bubble.

### 2.7 Build the thinking/loading state
Create `components/ThinkingBubble.tsx`. This renders an animated three-dot typing indicator in an assistant-aligned bubble. It appears immediately after the user sends a message and disappears when the first token of the reply arrives.

### 2.8 Build the chat view
Create `components/ChatView.tsx`. It receives the active conversation and renders a scrollable list of `MessageBubble` components with the `ThinkingBubble` at the bottom when loading. Auto-scroll to the bottom whenever new messages arrive using a `useEffect` + `ref` on the last message.

### 2.9 Build the message composer
Create `components/Composer.tsx`. It's a fixed-to-bottom bar with a multi-line text input (auto-grows up to 5 lines) and a send button. The send button is disabled when the input is empty or a message is in flight. Pressing Enter (without Shift) on desktop sends the message. On mobile, the send button is the primary action.

### 2.10 Build the settings/about surface
Create a simple `components/SettingsDrawer.tsx` or a settings screen accessible from the top bar overflow menu. Show app version, a brief description, and the backend connectivity status (using the health endpoint).

### 2.11 Wire up with mock data
Before connecting a real API, test every screen with hardcoded mock conversations and messages. Confirm all UI states: empty, loading, success, error, look correct at 390px width (iPhone SE size).

## Phase 3 - Backend: API & AI Integration

### 3.1 Structure the backend cleanly
Organize `backend/src/` into: `index.ts` (server bootstrap), `routes/chat.ts` (route handlers), `services/ai.ts` (AI provider logic), and `middleware/errorHandler.ts`. This service-layer separation means you can swap AI providers without touching route code.

### 3.2 Implement GET /api/health
Return `{ status: "ok", timestamp: new Date().toISOString() }`. The frontend will call this on app launch to determine whether to show a connectivity warning.

### 3.3 Implement POST /api/chat
Accept a JSON body of `{ conversationId: string, messages: { role: string, content: string }[] }`. Validate that `messages` is a non-empty array. Forward the messages to the AI service layer, await the reply, and return `{ reply: { role: "assistant", content: string } }`. Wrap everything in a `try/catch` and return structured errors.

### 3.4 Implement the AI service layer
In `services/ai.ts`, write a function `getAIReply(messages)` that calls your chosen provider (Claude via the Anthropic SDK, or OpenAI). Load the API key from `process.env.AI_API_KEY`. Load the model from `process.env.AI_MODEL` with a sensible default. Never expose the key to any response body. Return just the assistant message content string.

### 3.5 Add CORS and request limits
Configure CORS to only allow origins matching `process.env.CORS_ORIGIN`. Add a body size limit (`express.json({ limit: '50kb' })`). This prevents abuse when the backend is publicly hosted.

### 3.6 Add a global error handler
Create `middleware/errorHandler.ts` that catches anything thrown in route handlers and returns a consistent JSON shape: `{ error: { code: string, message: string } }`. Use HTTP 400 for bad input, 503 for AI provider failures, 500 for everything else.

### 3.7 Test the backend independently
Use `curl` or Postman to verify both endpoints work before touching the frontend. Confirm that a missing API key returns a 503, a malformed body returns a 400, and a valid conversation returns a real AI reply.

## Phase 4 - Frontend to Backend Integration

### 4.1 Create an API client module
Create `frontend/src/api/client.ts`. Export two functions: `checkHealth()` (calls `GET /api/health`) and `sendMessage(conversationId, messages)` (calls `POST /api/chat`). Read the base URL from `import.meta.env.VITE_API_BASE_URL`. Handle fetch errors (network failures, non-2xx responses) and re-throw typed errors your UI can handle.

### 4.2 Create a conversation store with local persistence
Create `frontend/src/store/conversations.ts` using `useState + useEffect` or a lightweight state manager. On mount, load all conversations from `localStorage`. On every change, save back to `localStorage`. Export hooks: `useConversations()`, `useActiveConversation()`, `createConversation()`, `appendMessage()`, `updateMessageStatus()`.

### 4.3 Wire the send flow end to end
In `App.tsx` (or a custom hook `useChat`), implement the full send cycle: user submits composer -> append user message with status `sending` -> show `ThinkingBubble` -> call `sendMessage()` -> on success, append assistant reply and set user message status to `sent` -> on error, set user message status to `error` and show an inline retry option.

### 4.4 Implement error UI states
Handle three distinct failures with clear in-app feedback:

- network offline -> show a banner "No internet connection"
- backend unreachable -> show a banner "AI service unavailable, try again later"
- slow/timeout -> show the thinking bubble for up to 30s then show a timeout error on the message

### 4.5 Implement conversation lifecycle
Tapping "New chat" creates a new `Conversation` object, switches to it, and shows the empty state. Sending the first message in a new conversation auto-generates a title (use the first ~40 chars of the user's message). Tapping a conversation in the drawer switches to it and loads its history from local storage.

### 4.6 Verify everything in the browser
Test the complete flow at 390px width in Chrome DevTools mobile emulation. Confirm history survives a hard refresh. Confirm the drawer lists multiple conversations correctly. Confirm offline behavior by toggling the network off in DevTools.

## Phase 5 - Capacitor & Android Packaging

### 5.1 Install Capacitor in the frontend
Inside `frontend/`, run `npm install @capacitor/core @capacitor/cli @capacitor/android`. Run `npx cap init` and set your app name (e.g. "AI Chat") and app ID (e.g. `com.yourname.aichat`).

### 5.2 Configure Capacitor
In `capacitor.config.ts`, set `webDir: "dist"` and `server.url` to your production backend base URL for release builds. Set `server.androidScheme: "https"`. This ensures the production APK calls your hosted backend, not localhost.

### 5.3 Build the web app and add Android
Run `npm run build` to produce `frontend/dist/`. Then run `npx cap add android` to generate the `android/` folder. Run `npx cap sync` to copy the web build into the Android project.

### 5.4 Configure the Android manifest
In `android/app/src/main/AndroidManifest.xml`, confirm `INTERNET` permission is present. Add `usesCleartextTraffic="false"` since your backend is HTTPS. Set your app's label and icon references.

### 5.5 Add app icons and splash screen
Install `@capacitor/splash-screen` and use Capacitor's asset generation tool (`npx @capacitor/assets generate`) to produce all required icon and splash screen sizes from a single 1024x1024 source PNG. Place your icon in `resources/icon.png` and your splash in `resources/splash.png`.

### 5.6 Build the debug APK
Open the `android/` folder in Android Studio (or use the Gradle wrapper). Run `./gradlew assembleDebug` from the `android/` directory. The output APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`. Install it on an emulator with `adb install app-debug.apk` and test the full chat flow on the device.

### 5.7 Build the signed release APK
Generate a keystore with `keytool -genkey -v -keystore release.keystore -alias aiChat -keyalg RSA -keysize 2048 -validity 10000`. Configure signing in `android/app/build.gradle` under `signingConfigs`. Run `./gradlew assembleRelease`. The output will be at `android/app/build/outputs/apk/release/app-release.apk`. Install and verify it works on a physical Android device and can reach your hosted backend.

### 5.8 Deploy the backend publicly
Deploy `backend/` to a hosting platform (Railway, Render, or Fly.io all work well for free tier). Set your environment variables (`AI_API_KEY`, `CORS_ORIGIN` set to `capacitor://localhost` and your dev URL). Confirm `GET /api/health` is reachable over HTTPS from your phone's browser before building the final APK.

## Phase 6 - Testing & Submission

### 6.1 Run through all acceptance criteria
Install the release APK on a physical Android device (not just the emulator). Walk through: app opens to empty state -> send a prompt -> receive a live AI reply -> open the drawer -> see the conversation listed -> reopen the app cold -> confirm the conversation is still there -> start a second conversation -> confirm both appear in the drawer.

### 6.2 Test failure scenarios
Turn on airplane mode and try to send a message; confirm the error state shows correctly and the app doesn't crash. Turn airplane mode off and retry; confirm the message sends successfully. Test with the backend URL deliberately wrong to simulate backend downtime.

### 6.3 Verify UI on multiple screen sizes
Test on at least two screen sizes in DevTools and on the physical device: a compact phone (390px) and a larger device (430px+). Confirm the composer stays above the keyboard, the drawer doesn't overflow, and message bubbles wrap correctly.

### 6.4 Assemble the submission bundle
Create a `submission/` folder containing: `app-release.apk`, `app-debug.apk`, a zipped source archive (excluding `node_modules`, `android/build`, and `.env` files), and a `README.md` with install instructions (enable unknown sources, install APK), run instructions (backend URL already baked in), and a brief description of the stack and architecture.

### 6.5 Final checks before handing in
Confirm the release APK was built against the production backend URL, not localhost. Confirm no API keys appear anywhere in the frontend source or the APK. Confirm the `README` is clear enough that the professor can install and demo the app without asking you anything.
