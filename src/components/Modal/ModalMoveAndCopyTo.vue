<script setup lang="ts">
  import { ITreeFolder } from '@/interfaces';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { EnumModalFM } from '@/utils/MyEnum';
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';


  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    class?: string;
    typeModal: EnumModalFM;
    dataTreeFolder: ITreeFolder[];
    selectedItems: IFileManager[];
    loadChildrenFolder?: (data: ITreeFolder) => void;
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
  const pathSelected = ref('');

  // Computed
  const typeModal = computed(() => props?.typeModal as EnumModalFM);
  const dataTreeFolder = computed(() => props.dataTreeFolder);
  const selectedItems = computed(() => props.selectedItems);

  const actionLoadChildrenFolder = async (data: IFileManager) => {
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
      pathSelected.value = folderSelecteds[0];
    } else {
      pathSelected.value = '';
    }
  };
</script>

<template>
  <Modal v-bind="$attrs" class="!w-[480px] c-modal-move-and-copy" :class="props.class" @close="emit('close')">
    <template #title>
      <h3>
        {{ typeModal === EnumModalFM.moveTo ? t('locale.move_to') : t('locale.copy_to') }}
      </h3>
    </template>
    <template #content>
      <DBtnIcon :icon="MdiWebfont.home" @click="pathSelected = ''" />
      <div v-if="isLoading" class="h-[200px] flex items-center justify-center">
        <CircularLoader :text="t('$vuetify.loading')" />
      </div>
      <!-- <v-treeview
        v-bind="$attrs"
        @update:activated="(value) => handleItemClick(value as string[])"
        class="c-treeview-folder"
        active-class="active"
        density="compact"
        :items="dataTreeFolder"
        :load-children="(item) => actionLoadChildrenFolder(item as IFileManager)"
        max-height="600"
        min-height="240"
        activatable
        :item-props="customItemProps"
        item-title="name"
        item-value="path">
        <template #prepend="{ isOpen, item }">
          <v-icon>{{ MdiWebfont[isOpen ? 'folder-open' : 'folder'] }}</v-icon>
        </template>
      </v-treeview> -->
      <d-treeview
        v-else
        v-bind="$attrs"
        @update:activated="(value: string[]) => handleItemClick(value as string[])"
        class="c-treeview-folder"
        active-class="active"
        density="compact"
        :items="dataTreeFolder"
        :load-children="(item) => actionLoadChildrenFolder(item as IFileManager)"
        max-height="600"
        min-height="240"
        activatable
        :item-props="customItemProps"
        item-title="name"
        item-value="path">
        <template #prepend="{ isOpen, item }">
          <v-icon>{{ MdiWebfont[isOpen ? 'folder-open' : 'folder'] }}</v-icon>
        </template>
      </d-treeview>
    </template>
    <template #actions>
      <DBtn class="c-btn-border" :title="t('locale.cancel')" :icon="MdiWebfont['close']" @click="() => emit('close')" />
      <DBtn
        class="c-btn-primary"
        :title="t('locale.paste')"
        :icon="MdiWebfont['content-paste']"
        :loading="isLoadingBtn"
        :disabled="isDisableBtn"
        @click="handleCopyOrMove" />
    </template>
  </Modal>
</template>
