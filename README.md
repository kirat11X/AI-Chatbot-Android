# 3️⃣ Lumina AI — Android & Web Chatbot

> **Experiment #3 of 6**: *Can you build production-ready Android apps with React instead of writing traditional Java / Kotlin?*  
> An intelligent mobile and web conversational assistant powered by Google Gemini, featuring a zero-crash offline fallback engine and native Android packaging with React 19, TypeScript, and Capacitor 8.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8E75FF.svg)](https://ai.google.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-blueviolet.svg)](https://capacitorjs.com/)
[![Android](https://img.shields.io/badge/Platform-Android%20%7C%20Web-green.svg)](https://developer.android.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📱 Pre-Compiled Android APK

A pre-compiled, installable Android debug APK is bundled directly in the root of this repository:
👉 **[`LuminaAI-debug.apk`](./LuminaAI-debug.apk)**

Download and install it directly on your Android phone to test the conversation flow, mobile keyboard handling, and conversational offline recovery.

---

## 💡 The Experiment: Resilient Mobile AI Without Native Kotlin

Mobile AI chat apps frequently suffer from network drops during cellular handoffs, token streaming timeouts, and heavy client memory overhead. **Lumina AI** investigates whether modern React running in a Capacitor WebView can deliver a crash-resilient conversational agent on Android:

1. **Google Gemini Client Integration**: Direct, lightweight connectivity to Gemini models (`gemini-2.5-flash-lite`) tuned for rapid token turnarounds and sub-second first-byte responses.
2. **Zero-Crash Offline Fallback Engine**: Engineered with an automated network-detection and heuristic response synthesizer. If connectivity drops mid-conversation, the client seamlessly falls back to local contextual assistance without crashing the chat session or losing conversational memory.
3. **Optimistic Thread Serialization**: All chat threads, role states (`system`, `user`, `assistant`), and prompt histories are serialized in real-time to sandboxed local storage, surviving background process kills.
4. **Liquid Sanctuary Design Language**: A high-contrast, distraction-free aesthetic with fluid bubble transitions, auto-scrolling message feeds, and native soft-keyboard layout adjustments.
5. **Universal Portability**: Identical code powers both the web application (hosted on Vercel) and the native Android APK.

---

## ⚡ Key Features

- **Multi-Turn Chat Interface**: Context-aware dialogue history with markdown rendering, code block formatting, and copy actions.
- **Dynamic API Switching**: Seamless configuration between local development gateways, cloud endpoints, or direct client modes.
- **Fail-Safe Offline Synthesis**: Automatic fallback responses when offline, keeping the user engaged until network recovery.
- **Persistent Local History**: Multi-session management with rename and delete options stored safely in WebView storage.
- **Optimized Mobile Touch Targets**: Ergonomic thumb-zone controls, haptic-ready buttons, and sticky input bars that adapt to Android Virtual Keyboard (IME) state changes.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Mobile Runtime**: Capacitor 8 (Android container)
- **AI Engine**: Google Gemini API SDK
- **Backend Gateway**: Express, Node.js, TypeScript (for server-mediated keys and proxying)
- **Styling**: Tailwind CSS + Custom Liquid Sanctuary design system
- **Storage**: LocalStorage with state schemas

---

## 📂 Project Structure

```text
├── backend/                  # Optional Node/Express proxy and Gemini service layer
├── frontend/                 # Vite React application and Capacitor Android project
│   ├── android/              # Native Android project configuration and source
│   ├── src/                  # React components, chat hooks, and Gemini integration
│   └── package.json          # Frontend dependencies
├── LuminaAI-debug.apk        # Pre-compiled Android APK ready to download and test
├── submission/               # Build records and submission bundles
├── plan.md                   # Architecture plan and design specs
├── progress.md               # Milestones and verification checklists
└── vercel.json               # Web hosting configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- npm
- [Google Gemini API Key](https://aistudio.google.com/)
- [Android Studio](https://developer.android.com/studio) (for building the Android APK locally)

### 1. Clone the Repository

```bash
git clone https://github.com/kirat11X/AI-Chatbot-Android.git
cd AI-Chatbot-Android
```

### 2. Configure Environment

Create environment files in `backend/` and `frontend/`:

**`backend/.env`**:
```bash
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
CORS_ORIGIN=http://localhost:5173,capacitor://localhost
```

**`frontend/.env`**:
```bash
VITE_API_BASE_URL=http://localhost:3001
```

### 3. Run Locally (Development)

Start the backend:
```bash
cd backend
npm install
npm run dev
```

In a separate terminal, start the frontend:
```bash
cd frontend
npm install
npm run dev
```

### 4. Build Android Debug APK

```bash
cd frontend
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

---

## 🔬 The 6 React + Capacitor Android Experiments

This application is part of a 6-part research series exploring cross-platform mobile engineering with React & Capacitor:

1. 🏃‍♂️ **[Kinetic — Physical & Mental Fitness Tracker](https://github.com/kirat11X/mental-and-fitness)**: Real-time hardware pedometer sensor fusion & offline wellness.
2. 💰 **[Vault — Offline-First Expense Manager](https://github.com/kirat11X/expense-tracker)**: Zero-cloud encrypted finance, SVG charts & in-memory CSV export.
3. 🤖 **[Lumina AI — Android & Web Chatbot](https://github.com/kirat11X/AI-Chatbot-Android)**: On-device Gemini client with zero-crash offline fallback engine.
4. 🛒 **[Pulse Store — Modern E-Commerce Storefront](https://github.com/kirat11X/E-commerce)**: React 19 shopping app with variant pickers & cart calculations.
5. 🎵 **[Vector — Broad Filesystem Audio Player](https://github.com/kirat11X/Music_player)**: Storage Access Framework & deep scoped storage music crawler.
6. 🎬 **[Personal Stream — Hybrid Movie Streaming & Cinema](https://github.com/kirat11X/Movie_streaming)**: Dual-engine local media player & cloud streaming hub.

---

## 📄 License

MIT © [Kritansh (kirat11X)](https://github.com/kirat11X)
