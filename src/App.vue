<script setup lang="ts">
  import { IActionFM, ITreeNodeData } from '@/interfaces';
  import { EnumModalFM, EnumTypeConfirm } from '@/utils/MyEnum';
  import { DemoActionFM } from './data/DemoActionFm';
  import { IFileManager } from './interfaces/IFileManager';
  import { useFileManagerStore } from './stores';

  const fileManagerStore = useFileManagerStore();
  const selectedItems = ref<IFileManager[]>([]);
  const selectedOneItem = ref({} as IFileManager);
  const listBreadcrumb = ref<IFileManager[]>([]);
  const loading = ref(false);
  const showModalCopyTo = ref(false);
  const typeModalMoveAndCopyTo = ref(EnumModalFM.copyTo);
  const showModalConfirmDelete = ref(false);
  const showModalRename = ref(false);
  const showModalDetail = ref(false);
  const isModalCreate = computed(() => fileManagerStore.isModalCreate);

  const getThumbnailIcon = (item: any) => {
    console.log('item :>> ', item);
  };

  const handleScroll = () => {
    console.log('handleScroll :>> ');
  };

  const onClickActionFm = (action: IActionFM) => {
    if (action.key === 'coppy') {
      showModalCopyTo.value = true;
    } else if (action.key === 'move_to') {
      showModalCopyTo.value = true;
      typeModalMoveAndCopyTo.value = EnumModalFM.moveTo;
    } else if (action.key === 'delete') {
      showModalConfirmDelete.value = true;
    } else if (action.key === 'rename') {
      showModalRename.value = true;
    } else if (action.key === 'detail') {
      showModalDetail.value = true;
    }
  };

  const handleRefresh = () => {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 2000);
  };

  const handleClickRow = (item: any) => {
    // console.log('handleClickRow :>> ', item);
  };

  const handleDoubleClickRow = (item: IFileManager) => {
    if (item.isDirectory) {
      listBreadcrumb.value.push(item);
      console.log('listBreadcrumb.value :>> ', listBreadcrumb.value);
    } else {
      console.log('handleDoubleClickRow :>> ', item);
    }
  };

  const handleClickBreadCrumb = ({ data, refresh }: { data?: IFileManager; refresh?: boolean } = {}) => {
    if (refresh) {
      window.location.reload();
    } else {
      console.log('handleClickBreadCrumb :>> ', data);
    }
  };

  const handlePaste = (folder: ITreeNodeData) => {
    console.log('handlePaste :>> ', folder);
  };
  const loadChildrenFolder = async (folder: ITreeNodeData) => {
    console.log('loadChildrenFolder :>> ', folder);
  };

  // debug selectedItems and selectedOneItem
  watch(
    () => selectedItems.value,
    (newVal) => {
      console.log(' debug selectedItems :>> ', newVal);
    },
  );

  watch(
    () => selectedOneItem.value,
    (newVal) => {
      console.log(' debug selectedOneItem :>> ', newVal);
    },
  );
</script>

<template>
  <div class="h-screen">
    <FileManager
      text-bread="Demo"
      currentPath=""
      return-object
      fixed-header
      height="100vh"
      :breadcrumb="listBreadcrumb"
      :action-toolbar="DemoActionFM"
      :item-height="46"
      :loading="loading"
      :theme="'dark'"
      :show-checkbox="false"
      :update-selected="(data) => (selectedItems = data)"
      :update-selected-one="(data) => (selectedOneItem = data)"
      :custom-thumbnail-icon="getThumbnailIcon"
      :context-menu-click="onClickActionFm"
      :toolbar-click="onClickActionFm"
      :on-click-row="handleClickRow"
      :on-click-breadcrumb="handleClickBreadCrumb"
      :double-click-row="handleDoubleClickRow"
      @scroll="handleScroll"
      @refresh="handleRefresh" />

    <ModalCreateFolderOrFile
      v-if="isModalCreate"
      :update-model="isModalCreate"
      @close="fileManagerStore.toggleModalCreate()" />

    <ModalRename
      v-if="showModalRename"
      v-model="showModalRename"
      :selectedOneItem="selectedOneItem"
      @close="showModalRename = false" />

    <ModalDetail
      v-if="showModalDetail"
      v-model="showModalDetail"
      :selectedOneItem="selectedOneItem"
      @close="showModalDetail = false" />

    <ModalMoveAndCopyTo
      v-if="showModalCopyTo"
      v-model="showModalCopyTo"
      :selectedItems="selectedItems"
      :type-modal="typeModalMoveAndCopyTo"
      :paste="handlePaste"
      :loadChildrenFolder="loadChildrenFolder"
      @close="showModalCopyTo = false" />

    <ModalConfirm
      v-if="showModalConfirmDelete"
      permanently
      v-model="showModalConfirmDelete"
      :selectedItems="selectedItems"
      @close="showModalConfirmDelete = false"
      :type-modal="EnumTypeConfirm.delete" />
  </div>
</template>
