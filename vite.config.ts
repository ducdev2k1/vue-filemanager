import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// Utilities
import { fileURLToPath, URL } from 'node:url';
import path from 'path';
import { loadEnv } from 'vite';

// Read all environment variable configuration files to process.env
function wrapperEnv(envConf: any) {
  const ret: any = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n');
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;

    if (envName === 'VITE_PORT') {
      realName = Number(realName);
    }
    if (envName === 'VITE_PROXY' && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'));
      } catch (e: unknown) {
        console.error(e);
        realName = '';
      }
    }
    ret[envName] = realName;
    if (typeof realName === 'string') {
      process.env[envName] = realName;
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName);
    }
  }
  return ret;
}

const root = process.cwd();

const env = loadEnv(process.env.NODE_ENV, root);

// The boolean type read by loadEnv is a string. This function can be converted to boolean type
const viteEnv = wrapperEnv(env);

const { VITE_PORT, VITE_PUBLIC_PATH, VITE_DROP_CONSOLE, VITE_SERVER_URL } = viteEnv;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    dts({ insertTypesEntry: true }),
    vuetify({
      autoImport: true,
    }),
    VueI18nPlugin({
      include: [path.resolve(__dirname, './src/locales/**')],
    }),
    VueRouter({
      dts: 'src/typed-router.d.ts',
    }),
    AutoImport({
      imports: [
        'vue',
        {
          'vue-router/auto': ['useRoute', 'useRouter'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    Components({
      dts: 'src/components.d.ts',
    }),
  ],

  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'tailwind-config': path.resolve(__dirname, './tailwind.config.js'),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  base: VITE_PUBLIC_PATH,
  root,
  server: {
    host: true,
    port: VITE_PORT,
    //disable warning socket
    strictPort: true,
    allowedHosts: true,
    hmr: { clientPort: VITE_PORT },
    proxy: {
      // '/api': {
      //   target: VITE_SERVER_URL,
      //   changeOrigin: true,
      // },
    },
  },
  esbuild: {
    pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'], // Tắt warning cho legacy JS API
      },
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'FileManager',
      formats: ['es', 'umd'],
      fileName: (format) => `file-manager.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'pinia'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    cssCodeSplit: true, // tách riêng CSS
  },
});
