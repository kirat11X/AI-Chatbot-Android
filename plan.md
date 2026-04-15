# AI Chatbot Android Project Plan

## Summary
- Build the app as a React + TypeScript web frontend in `frontend/`, then package it into an Android APK with Capacitor.
- Build a hosted Node + Express backend in `backend/` so the APK can call a real AI API without exposing secrets.
- Target both outputs: an installable debug APK for testing and a signed release APK for professor submission.
- Keep v1 focused on a polished Android chat experience: empty state, main chat, conversation drawer/history, loading/thinking state, and real AI replies.

## Implementation Steps
1. Initialize the frontend in `frontend/` with Vite, React, TypeScript, and Tailwind, using the existing warm “Liquid Sanctuary” mockup style instead of default Material styling.
2. Turn the mockups into reusable screens and components: app shell, top bar, navigation drawer, chat list, message bubbles, composer, thinking state, and settings/about surface.
3. Keep the app single-user and chat-first for v1, with no login flow.
4. Store conversation history locally on the device so previous chats remain visible in the drawer after reopening the app.
5. Initialize the backend in `backend/` with Express, CORS, environment-based config, and a clean service layer for the AI provider.
6. Add `GET /api/health` for connectivity checks and `POST /api/chat` for sending user messages and receiving assistant replies.
7. Keep the AI key only on the backend; the frontend must never contain provider secrets.
8. Make the backend stateless for v1 and skip database work; the frontend owns local conversation persistence.
9. Add clear error handling for no internet, backend downtime, invalid responses, and slow AI replies.
10. Add Capacitor to the frontend, generate the Android project in `android/`, and configure app id, app name, icon, splash screen, and network permissions.
11. Use a production API base URL that points to the hosted backend so the APK works on the professor’s device without your laptop.
12. Use this build pipeline for delivery: web build, Capacitor sync, Android debug build, then signed Android release build.
13. Prepare a short submission bundle with the release APK, debug APK, source code, and brief install/run notes.

## Public APIs And Types
- `GET /api/health` returns backend status so the app can show whether the AI service is reachable.
- `POST /api/chat` accepts a conversation id plus an ordered message list and returns the assistant reply.
- Frontend conversation model: `Conversation { id, title, createdAt, updatedAt, messages[] }`.
- Frontend message model: `Message { id, role, content, status, createdAt }`.
- Frontend config: `VITE_API_BASE_URL`.
- Backend config: `PORT`, `AI_API_KEY`, optional `AI_MODEL`, and `CORS_ORIGIN`.

## Test Plan
- Verify the empty state, main chat view, navigation drawer, and thinking/loading view match the existing mockup direction on mobile sizes.
- Verify a user can send a prompt and receive a real AI response through the hosted backend.
- Verify app behavior when the backend is unreachable, the AI provider is slow, or the network is offline.
- Verify local conversation history survives app restart and multiple chats can be reopened from the drawer.
- Verify the debug APK installs and runs on an emulator or Android phone.
- Verify the signed release APK installs cleanly on a physical Android device and can still reach the hosted backend.
- Acceptance criterion: the professor can install the APK, open the app, send a prompt, receive a live AI response, and browse saved local conversations.

## Assumptions And Defaults
- React + Capacitor is the chosen delivery path.
- Node + Express is the chosen backend stack.
- The backend will be hosted publicly over HTTPS.
- No authentication is included in v1.
- No cloud database is included in v1.
- Android is the only required platform for the first submission.
