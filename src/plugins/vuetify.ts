/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { i18n } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import { VTreeview } from 'vuetify/labs/VTreeview';

import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VTreeview,
  },
  locale: {
    adapter: createVueI18nAdapter({
      i18n,
      useI18n,
    }),
  },
  date: {
    locale: {
      en: 'vi-VN',
    },
  },
});
