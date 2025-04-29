import { App } from 'vue';

// import styles
import './assets/css/materialdesignicons.min.css';
import './assets/scss/filemanager.scss';

// Import Components
import DBtn from '@/components/DCustom/DButton/DBtn.vue';
import DBtnDropDown from '@/components/DCustom/DButton/DBtnDropDown.vue';
import DBtnIcon from '@/components/DCustom/DButton/DBtnIcon.vue';
import DBtnSwicthView from '@/components/DCustom/DButton/DBtnSwicthView.vue';
import DCard from '@/components/DCustom/DCard/DCard.vue';
import DCardActions from '@/components/DCustom/DCard/DCardActions.vue';
import DCardText from '@/components/DCustom/DCard/DCardText.vue';
import DList from '@/components/DCustom/DList/DList.vue';
import DListItem from '@/components/DCustom/DList/DListItem.vue';
import DModal from '@/components/DCustom/DModal/DModal.vue';
import FileManager from '@/components/FileManager/FileManager.vue';
import CircularLoader from '@/components/Loader/CircularLoader.vue';
import Modal from '@/components/Modal/Modal.vue';
import ModalConfirm from '@/components/Modal/ModalConfirm.vue';
import ModalDetail from '@/components/Modal/ModalDetail.vue';
import ModalMoveAndCopyTo from '@/components/Modal/ModalMoveAndCopyTo.vue';
import ModalRename from '@/components/Modal/ModalRename.vue';

export default {
  install(app: App) {
    app.component('DBtn', DBtn);
    app.component('DBtnIcon', DBtnIcon);
    app.component('DBtnSwicthView', DBtnSwicthView);
    app.component('DBtnDropDown', DBtnDropDown);
    app.component('FileManager', FileManager);
    app.component('ModalConfirm', ModalConfirm);
    app.component('ModalDetail', ModalDetail);
    app.component('Modal', Modal);
    app.component('DList', DList);
    app.component('DListItem', DListItem);
    app.component('DCard', DCard);
    app.component('DCardActions', DCardActions);
    app.component('DCardText', DCardText);
    app.component('CircularLoader', CircularLoader);
    app.component('ModalRename', ModalRename);
    app.component('ModalMoveAndCopyTo', ModalMoveAndCopyTo);
  },
};

export {
  CircularLoader,
  DBtn,
  DBtnDropDown,
  DBtnIcon,
  DBtnSwicthView,
  DCard,
  DCardActions,
  DCardText,
  DList,
  DListItem,
  DModal,
  FileManager,
  Modal,
  ModalConfirm,
  ModalDetail,
  ModalMoveAndCopyTo,
  ModalRename,
};
