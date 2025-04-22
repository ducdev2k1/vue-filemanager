import { App } from 'vue';

// import styles
import './assets/scss/filemanager.scss';

// Import Components
import DBtn from './components/DCustom/DButton/DBtn.vue';
import DBtnIcon from './components/DCustom/DButton/DBtnIcon.vue';
import DBtnSwicthView from './components/DCustom/DButton/DBtnSwicthView.vue';
import FileManager from './components/FileManager/FileManager.vue';
import Modal from './components/Modal/Modal.vue';
import ModalConfirm from './components/Modal/ModalConfirm.vue';

export default {
  install(app: App) {
    app.component('DBtn', DBtn);
    app.component('DBtnIcon', DBtnIcon);
    app.component('DBtnSwicthView', DBtnSwicthView);
    app.component('FileManager', FileManager);
    app.component('ModalConfirm', ModalConfirm);
    app.component('Modal', Modal);
  },
};

export { DBtn, DBtnIcon, DBtnSwicthView, FileManager, Modal, ModalConfirm };
