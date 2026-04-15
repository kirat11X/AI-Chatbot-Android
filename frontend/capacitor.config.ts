import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.kirat.luminaai',
  appName: 'Lumina AI',
  // Keep the packaged app on local web assets; API calls use VITE_API_BASE_URL.
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      androidScaleType: 'CENTER_CROP',
      backgroundColor: '#faf9f5',
      launchAutoHide: true,
    },
  },
}

export default config
