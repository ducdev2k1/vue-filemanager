/// <reference types="vite/client" />

declare module '*.vue | *.tsx' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
