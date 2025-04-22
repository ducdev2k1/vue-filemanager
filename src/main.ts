// Plugins
import { registerPlugins } from '@/plugins';
// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';

// style
import './assets/scss/filemanager.scss';

const app = createApp(App);

registerPlugins(app);

app.mount('#app');
