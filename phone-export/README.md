# Lumina AI Phone Test Export

This package contains rebuilt Android APKs for installing on a phone.

## Important Status

This build is installable, but it is not connected to a deployed AI backend yet.

The app currently uses:

```text
http://localhost:3001
```

On a real phone, `localhost` means the phone itself, not your laptop. Because the production Android manifest blocks cleartext HTTP traffic, this APK will open and show the UI, but live AI chat will not work on the phone until the app is rebuilt with an HTTPS backend URL.

## Files

- `Lumina-AI-release.apk` - preferred APK to install on your phone.
- `Lumina-AI-debug.apk` - debug APK if you want a development build.

## Install

1. Transfer `Lumina-AI-release.apk` to your Android phone.
2. Open it from Files or Downloads.
3. Allow installation from unknown sources if Android asks.
4. Launch Lumina AI.

## Expected Result

- The app should open to the Lumina AI chat UI.
- The drawer, composer, empty state, and settings surface should be visible.
- Sending a message will likely show an AI service unavailable/offline state until the backend is deployed and the APK is rebuilt.

## To Make The Phone Build Fully Live

1. Deploy `backend/` to a public HTTPS host.
2. Set `GEMINI_API_KEY`, `GEMINI_MODEL`, and `CORS_ORIGIN` on the hosted backend.
3. Set `VITE_API_BASE_URL=https://your-backend.example.com` in `frontend/.env`.
4. Run `npm run android:sync` from `frontend/`.
5. Rebuild the release APK.
6. Install the rebuilt APK on your phone.
