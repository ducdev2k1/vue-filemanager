import { App } from 'vue';

// import styles
import './assets/scss/filemanager.scss';

// Import Components
import BtnBase from './components/Button/BtnBase.vue';
import BtnBaseIcon from './components/Button/BtnBaseIcon.vue';
import BtnSwicthView from './components/Button/BtnSwicthView.vue';
import FileManager from './components/FileManager/FileManager.vue';
import Modal from './components/Modal/Modal.vue';
import ModalConfirm from './components/Modal/ModalConfirm.vue';

export default {
  install(app: App) {
    app.component('BtnBase', BtnBase);
    app.component('BtnBaseIcon', BtnBaseIcon);
    app.component('BtnSwicthView', BtnSwicthView);
    app.component('FileManager', FileManager);
    app.component('ModalConfirm', ModalConfirm);
    app.component('Modal', Modal);
  },
};

export { BtnBase, BtnBaseIcon, BtnSwicthView, FileManager, Modal, ModalConfirm };
