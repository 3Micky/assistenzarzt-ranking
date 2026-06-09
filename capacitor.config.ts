import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.assistenzranking.app',
  appName: 'Assistenz-Ranking',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0a0a0a',
    },
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#f5f0e8',
      showSpinner: false,
    },
  },
};

export default config;
