/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
// import pinia from '../stores';
// import vuetify from './vuetify';

// Types
import { i18n } from '@/plugins/i18n';
import type { App } from 'vue';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export function registerPlugins(app: App) {
  app
    // .use(vuetify)
    // .use(router)
    // .use(pinia)
    .use(i18n)
    .use(Vue3Toastify, {
      autoClose: 3000,
      theme: 'auto',
      limit: 1,
    } as any); // global options type definition --> ToastContainerOptions;
}
