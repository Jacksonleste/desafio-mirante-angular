import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';

import localePt from '@angular/common/locales/pt';

// Registra os dados de formatação para o português do Brasil
registerLocaleData(localePt, 'pt-BR');

const PetroleoPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef7f6',
      100: '#d2ece8',
      200: '#a7d8d1',
      300: '#74bfb5',
      400: '#479e93',
      500: '#2c8177',
      600: '#226a62',
      700: '#1e544e',
      800: '#1b433f',
      900: '#17302d',
      950: '#0c1c1a',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: PetroleoPreset,
        options: {
          darkModeSelector: '',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
  ],
};
