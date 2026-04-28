# Lumina AI Chatbot

Lumina AI is a mobile-first AI chat app built with a React + TypeScript frontend, an Express + TypeScript backend, Gemini integration, and Capacitor Android packaging.

Current status: the codebase builds and APK artifacts exist, but the app is not final demo-ready until the backend is deployed with a real API key and the Android build is rebuilt against that deployed HTTPS backend URL. See [progress.md](progress.md) for the full checklist.

## Stack

- Frontend: Vite, React 19, TypeScript
- Backend: Express, TypeScript, Gemini SDK
- Persistence: browser/local WebView `localStorage`
- Android packaging: Capacitor 8
- UI direction: warm Liquid Sanctuary palette

## Project Structure

```text
.
├── backend/             Express API and Gemini service layer
├── frontend/            Vite React app and Capacitor Android project
├── frontend_design/     Provided design reference material
├── submission/          APKs, source archive, and submission README
├── progress.md          Current build and readiness checklist
├── progess.md           Original step list kept for compatibility
├── plan.md              Project plan
└── steps.txt            Original assignment steps
```

## Environment

Create local `.env` files from the examples:

- [backend/env.example](backend/env.example)
- [frontend/env.example](frontend/env.example)
- [frontend/env.production.example](frontend/env.production.example)

Backend variables:

```bash
PORT=3001
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash-lite
CORS_ORIGIN=http://localhost:5173,capacitor://localhost
```

Frontend variables:

```bash
VITE_API_BASE_URL=http://localhost:3001
```

For a release APK, set `VITE_API_BASE_URL` to the deployed HTTPS backend URL before building.

## Local Development

Start the backend:

```bash
cd backend
npm install
npm run dev
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The backend exposes:

- `GET /api/health`
- `POST /api/chat`

Example health check:

```bash
curl http://localhost:3001/api/health
```

## Verification

Run backend checks:

```bash
cd backend
npm run check
npm run build
```

Run frontend checks:

```bash
cd frontend
npm run lint
npm run build
```

Already verified in this workspace:

- Backend TypeScript check passes.
- Backend production build passes.
- Frontend lint passes.
- Frontend production build passes.
- `GET /api/health` works locally.
- Malformed `POST /api/chat` returns HTTP 400.
- Missing `GEMINI_API_KEY` returns HTTP 503.
- Debug and release APKs build successfully.

Not yet verified:

- Real AI reply with a valid `GEMINI_API_KEY`.
- Hosted HTTPS backend from a phone.
- Final release APK rebuilt against the hosted backend URL.
- APK install and full chat test on an Android device or emulator.

## Android

Sync web assets into the Android project:

```bash
cd frontend
npm run android:sync
```

Build the debug APK:

```bash
cd frontend
JAVA_HOME="$HOME/.local/temurin-21" \
ANDROID_HOME="$HOME/Android/Sdk" \
ANDROID_SDK_ROOT="$HOME/Android/Sdk" \
npm run android:build:debug
```

Build the signed release APK:

```bash
cd frontend/android
JAVA_HOME="$HOME/.local/temurin-21" \
PATH="$HOME/.local/temurin-21/bin:$PATH" \
ANDROID_HOME="$HOME/Android/Sdk" \
ANDROID_SDK_ROOT="$HOME/Android/Sdk" \
./gradlew --no-daemon -Dorg.gradle.java.home="$HOME/.local/temurin-21" assembleRelease
```

APK outputs:

- Debug: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `frontend/android/app/build/outputs/apk/release/app-release.apk`

Release signing is configured through:

- [frontend/android/keystore.properties.example](frontend/android/keystore.properties.example)

Keep real keystores and `keystore.properties` private. They are intentionally ignored by git.

## Backend Deployment

The backend is ready to deploy to a Node-compatible HTTPS host such as Railway, Render, or Fly.io.

Deployment files:

- [backend/Dockerfile](backend/Dockerfile)
- [backend/.dockerignore](backend/.dockerignore)

Required production environment:

```bash
GEMINI_API_KEY=your-real-key
GEMINI_MODEL=gemini-2.5-flash-lite
CORS_ORIGIN=capacitor://localhost,https://your-frontend-preview.example
PORT=3001
```

Before building the final APK, confirm the deployed backend health endpoint works over HTTPS:

```bash
curl https://your-backend.example.com/api/health
```

## Submission Bundle

The `submission/` folder currently contains:

- `app-debug.apk`
- `app-release.apk`
- `source-archive.zip`
- `README.md`

Before handing in, rebuild and refresh these artifacts after setting the final production backend URL. Also confirm no API keys are present in frontend source, APK contents, or the source archive.

## Phone Test Export

For manual install testing, use:

- `phone-export/Lumina-AI-phone-test.zip`
- `phone-export/Lumina-AI-release.apk`

This export is good for opening the app and checking the UI on a phone. It is not expected to complete live AI chat until the backend is deployed over HTTPS and the APK is rebuilt with that backend URL.
