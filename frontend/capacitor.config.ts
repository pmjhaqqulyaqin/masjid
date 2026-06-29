import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'id.sch.mandualotim.masjid',
  appName: 'Masjid Haqqul Yaqin',
  webDir: 'dist',
  server: {
    // Load dari server produksi — API calls same-origin (tanpa CORS)
    url: 'https://masjid.mandualotim.sch.id',
    androidScheme: 'https',
    allowNavigation: ['masjid.mandualotim.sch.id', '*.mandualotim.sch.id'],
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    allowMixedContent: false,
    // Warna emerald-deep sesuai tema masjid
    backgroundColor: '#064E3B',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#064E3B',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
