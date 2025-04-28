<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
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
    dataTreeFolder: ITreeFolder[];
    selectedItems: IFileManager[];
    loadChildrenFolder?: (data: ITreeNodeData) => Promise<void>;
    paste?: (data: ITreeFolder) => void;
  }

  const emit = defineEmits(['close']);

  const props = withDefaults(defineProps<IProps>(), {
    typeModal: EnumModalFM.copyTo,
  });

  // Refs
  const isDisableBtn = ref(false);
  const isLoading = ref(false);
  const isLoadingBtn = ref(false);
  const pathSelected = ref([] as string[]);

  // Computed
  const typeModal = computed(() => props?.typeModal as EnumModalFM);
  const dataTreeFolder = computed(() => props.dataTreeFolder);
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
      <DBtnIcon :icon="MdiWebfont.home" @click="pathSelected = []" />
      <div v-if="isLoading" class="h-[200px] flex items-center justify-center">
        <CircularLoader :text="t('$vuetify.loading')" />
      </div>
      <d-treeview
        v-else
        v-bind="$attrs"
        :model-value="pathSelected"
        @update:activated="(value: string[]) => handleItemClick(value as string[])"
        class="c-treeview-folder"
        active-class="active"
        density="compact"
        :items="dataTreeFolder"
        :load-children="actionLoadChildrenFolder"
        max-height="600"
        min-height="240"
        activatable
        :item-props="customItemProps"
        item-title="name"
        item-value="path">
        <template #prepend="{ isOpen, item }">
          <span>
            {{ isOpen ? '📂' : '📁' }}
          </span>
        </template>
      </d-treeview>
    </template>
    <template #actions>
      <DBtn class="d-btn-cancel" :title="t('locale.cancel')" :icon="MdiWebfont['close']" @click="() => emit('close')" />
      <DBtn
        class="d-btn-primary"
        :title="t('locale.paste')"
        :icon="MdiWebfont['content-paste']"
        :loading="isLoadingBtn"
        :disabled="isDisableBtn"
        @click="handleCopyOrMove" />
    </template>
  </Modal>
</template>
