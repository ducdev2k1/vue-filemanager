import { App } from 'vue';

// import styles
import './assets/css/materialdesignicons.min.css';
import './assets/scss/filemanager.scss';

// Import Components

import DCustom from './components/DCustom';
import FileManager from './components/FileManager/FileManager.vue';
import Modal from './components/Modal/Modal.vue';
import ModalConfirm from './components/Modal/ModalConfirm.vue';

// Components to export individually
const componentsToExport = {
  FileManager,
  Modal,
  ModalConfirm,
  ...DCustom, // Spread all components from DCustom
};

export default {
  install(app: App) {
    // Register all components dynamically
    Object.entries(componentsToExport).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
};

// Export individual components for direct usage
export { componentsToExport };
