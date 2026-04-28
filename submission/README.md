# Submission Bundle

## Files

- `app-debug.apk`
- `app-release.apk`
- `source-archive.zip`

## Install

1. Transfer the APK to an Android device.
2. Allow installs from unknown sources if Android prompts for it.
3. Install either `app-debug.apk` or `app-release.apk`.

## Important Note

The app code is ready for a real hosted backend, but the final release should be rebuilt after setting `VITE_API_BASE_URL` to your deployed HTTPS backend URL.

If you leave the frontend environment pointed at localhost, the APK will package successfully but it will not be able to reach the backend on another device.

## Stack

- React + TypeScript frontend
- Express + TypeScript backend
- Gemini-backed `/api/chat` service
- Capacitor Android packaging
