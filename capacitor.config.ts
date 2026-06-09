import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.assistenzranking.app',
  appName: 'Assistenz-Ranking',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
