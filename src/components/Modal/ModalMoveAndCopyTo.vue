<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { demoDateTreeFolder } from '@/data/DemoDataFilemanager';
  import { ITreeFolder, ITreeNodeData } from '@/interfaces';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { EnumModalFM } from '@/utils/MyEnum';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    class?: string;
    typeModal: EnumModalFM;
    dataTreeFolder?: ITreeFolder[];
    selectedItems: IFileManager[];
    loadChildrenFolder?: (data: ITreeNodeData) => Promise<void>;
    paste?: (data: ITreeFolder) => void;
  }

  const emit = defineEmits(['close', 'createNew', 'submit']);

  const props = withDefaults(defineProps<IProps>(), {
    typeModal: EnumModalFM.copyTo,
  });

  // Refs
  const isDisableBtn = ref(false);
  const isLoading = ref(false);
  const isLoadingBtn = ref(false);
  const pathSelected = ref([] as string[]);
  const searchFolder = ref('');

  // Computed
  const typeModal = computed(() => props?.typeModal as EnumModalFM);
  const dataTreeFolder = computed(() => props.dataTreeFolder || demoDateTreeFolder);
  const selectedItems = computed(() => props.selectedItems);

  const actionLoadChildrenFolder = async (data: ITreeNodeData) => {
    props.loadChildrenFolder && props.loadChildrenFolder(data);
  };

  const customItemProps = (item: any) => {
    return {
      disabled: selectedItems.value.some((value) => value.path === item.path),
    };
  };

  const handleCopyOrMove = async () => {
    if (props.paste && selectedItems.value.length > 0) {
      props.paste(selectedItems.value[0]);
    }
  };

  const handleItemClick = (folderSelecteds: string[]) => {
    // Vi thu vien tra kieu array ===> luon lay phan tu index = 0
    if (Array.isArray(folderSelecteds) && folderSelecteds.length === 1) {
      pathSelected.value = folderSelecteds;
    } else {
      pathSelected.value = [];
    }
  };
</script>

<template>
  <Modal v-bind="$attrs" class="c-modal-move-and-copy" :class="props.class" @close="emit('close')">
    <template #title>
      <h3>
        {{ typeModal === EnumModalFM.moveTo ? t('locale.move_to') : t('locale.copy_to') }}
      </h3>
    </template>
    <template #content>
      <div class="c-modal-move-and-copy_header">
        <DBtn :border="true" :icon="MdiWebfont['home-outline']" @click="pathSelected = []" />
        <DTextField v-model="searchFolder" :placeholder="t('locale.search')" />
      </div>

      <div v-if="isLoading" class="h-[200px] flex items-center justify-center">
        <CircularLoader :text="t('$vuetify.loading')" />
      </div>
      <d-treeview
        v-else
        v-bind="$attrs"
        :item-props="customItemProps"
        :model-value="pathSelected"
        :items="dataTreeFolder"
        :load-children="actionLoadChildrenFolder"
        :search="searchFolder"
        @update:activated="(value: string[]) => handleItemClick(value as string[])"
        class="c-treeview-folder"
        active-class="active"
        density="compact"
        max-height="600"
        min-height="240"
        activatable
        item-title="name"
        item-value="path">
        <template #prepend="{ isOpen, item }">
          <span>
            <DIcon :icon="MdiWebfont[isOpen ? 'folder-open-outline' : 'folder-outline']" size="22" />
          </span>
        </template>
      </d-treeview>
    </template>
    <template #actions>
      <DBtn
        :border="true"
        :title="t('locale.create_new')"
        :icon="MdiWebfont['folder-plus-outline']"
        @click="emit('createNew')" />
      <div class="c-modal-move-and-copy_actions">
        <DBtn cancel :title="t('locale.cancel')" :icon="MdiWebfont['close']" @click="() => emit('close')" />
        <DBtn
          class="d-btn-primary"
          :title="t('locale.paste')"
          :icon="MdiWebfont['content-paste']"
          :loading="isLoadingBtn"
          :disabled="isDisableBtn"
          @click="handleCopyOrMove" />
      </div>
    </template>
  </Modal>
</template>
