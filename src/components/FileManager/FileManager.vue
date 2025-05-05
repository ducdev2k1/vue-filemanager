<script setup lang="ts">
  import { columnsDefault } from '@/components/FileManager/partial/ConfigFileManager';
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { demoDataFilemanager } from '@/data/DemoDataFilemanager';
  import { IActionFM, IColumnFileManger } from '@/interfaces';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { EnumLocalStorageKey, EnumViewModeFm } from '@/utils/MyEnum';
  import { convertBytes } from '@/utils/MyFunction';
  import { useStorage } from '@vueuse/core';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    theme?: 'dark' | 'light';
    titlePage?: string;
    customColumns?: IColumnFileManger[];
    toolbarShowActionRight?: boolean;
    dataFilemanger?: IFileManager[];
    currentPath: string;
    loading?: boolean;
    dateFormat?: string;
    breadcrumb?: IFileManager[];
    actionToolbar?: IActionFM[];

    // props data table vuetify
    showCheckbox?: boolean;
    fixedHeader?: boolean;
    itemHeight?: number;
    height?: number | string;
    singleModeSelect?: boolean;
    hideDefaultHeader?: boolean;
    contextMenuOptions?: IActionFM[];
    textBread?: string;

    // void
    toolbarClick?: (item: IActionFM) => void;
    updateSelected: (item: IFileManager[]) => void;
    updateSelectedOne: (item: IFileManager) => void;
    customThumbnailIcon?: (item: IFileManager) => void;
    updateSelectedItems?: (item: IFileManager[]) => void;
    contextMenuClick?: (item: IActionFM) => void;
    onClickRow?: (item: IFileManager) => void;
    doubleClickRow?: (item: IFileManager) => void;
    clickContextMenu?: (item: IActionFM) => void;
    onClickBreadcrumb?: ({ data, refresh }: { data?: IFileManager; refresh?: boolean }) => void;
  }

  const emits = defineEmits(['scroll', 'refresh']);

  const props = withDefaults(defineProps<IProps>(), {
    toolbarShowActionRight: true,
    loading: false,
    singleModeSelect: false,
    hideDefaultHeader: false,
    height: '100%',
    theme: 'light',
    itemHeight: 46,
    fixedHeader: false,
    showCheckbox: false,
    dateFormat: 'DD/MM/YYYY',
    textBread: 'Demo',
  });

  // localStorage
  const viewFM = useStorage(EnumLocalStorageKey.viewFileMamager, EnumViewModeFm.details, localStorage, {
    listenToStorageChanges: true,
  });

  // Refs
  const showContextMenu = ref(false);
  const selectedItems = ref<IFileManager[]>([]);
  const selectedOneItem = ref<IFileManager>({} as IFileManager);
  const positionContextMenu = ref({ x: 0, y: 0 });

  // Computed
  const customColumns = computed(() => props.customColumns || columnsDefault);
  const dataFilemanger = computed(() => props.dataFilemanger || demoDataFilemanager);
  const breadcrumb = computed(() => props.breadcrumb ?? []);
  const textBread = computed(() => props.textBread);

  const contextMenuOptions = reactive<IActionFM[]>([
    {
      key: 'download',
      title: 'Tải xuống',
      icon: 'mdi-download',
      visible: true,
      disabled: true,
    },
    {
      key: 'delete',
      title: 'Xóa',
      icon: 'mdi-delete',
      visible: true,
    },
  ]);

  const actionClickContextMenu = (item: IActionFM) => {
    props.contextMenuClick && props.contextMenuClick(item);
    // close context menu
    showContextMenu.value = false;
  };

  // Show context-menu
  const handleShowContextMenu = (event: MouseEvent, bool: boolean) => {
    event.preventDefault();
    event.stopPropagation();
    showContextMenu.value = bool;
    positionContextMenu.value = { x: event.clientX, y: event.clientY };
  };

  const actionClickBtnShowContextMenu = (event: MouseEvent, item: IFileManager) => {
    selectedOneItem.value = item;
    handleShowContextMenu(event, true);
  };

  const actionBreadCrumbClick = ({ data, refresh }: { data?: IFileManager; refresh?: boolean }) => {
    if (refresh) {
      props.onClickBreadcrumb && props.onClickBreadcrumb({ refresh: true });
    } else {
      props.onClickBreadcrumb && props.onClickBreadcrumb({ data });
    }
  };

  watch(
    () => props.theme,
    (newVal) => {
      const html = document.querySelector('html') as HTMLElement;
      html.classList.add('fm_base');
      if (newVal === 'dark') {
        html.classList.add('fm_dark');
      } else {
        html.classList.add('fm_light');
      }
    },
    {
      immediate: true,
    },
  );
</script>

<template>
  <section class="c-file-manager">
    <ToolbarFilemanager
      @refresh="emits('refresh')"
      :loading="loading"
      :action-toolbar="actionToolbar"
      :selectedItems="selectedItems"
      :toolbar-click="toolbarClick">
      <template #fmToolbarLeft>
        <slot v-if="$slots['fm-breadcrumbs']" name="fm-breadcrumbs" />
        <template v-else>
          <Breadcrumbs
            :text-default="textBread"
            :data="breadcrumb"
            :call-back-folder-selected="actionBreadCrumbClick" />
        </template>
      </template>
    </ToolbarFilemanager>

    <slot v-if="$slots['toolbar-bottom']" name="toolbar-bottom" v-bind="{ data: dataFilemanger }"></slot>

    <TableFilemanager
      v-bind="$attrs"
      v-model="selectedItems"
      v-model:selectedOneItem="selectedOneItem"
      v-if="viewFM === EnumViewModeFm.details"
      :update-selected="updateSelected"
      :update-selected-one="updateSelectedOne"
      :header-table="customColumns"
      :data-table="dataFilemanger"
      :fixed-header="fixedHeader"
      :loading="loading"
      :item-height="itemHeight"
      :height="height"
      :select-strategy="singleModeSelect ? 'single' : 'page'"
      :hide-default-header="hideDefaultHeader"
      :show-checkbox="showCheckbox"
      @toglle-context-menu="(e: MouseEvent, bool: boolean) => handleShowContextMenu(e, bool)"
      @double-click-row="(data: IFileManager) => doubleClickRow && doubleClickRow(data)"
      @click-row="(data: IFileManager) => onClickRow && onClickRow(data)"
      @load-more="emits('scroll')">
      <template v-if="customColumns.length > 0">
        <slot
          v-for="item in customColumns"
          :key="item.key"
          :name="`item.${item.key}`"
          v-bind="{ item, value: item.key }" />
      </template>
      <template #item.name="{ item }" v-if="!$slots['item.name']">
        <ColumnName :data-row="item" />
      </template>
      <template #item.size="{ value }" v-if="!$slots['item.size']">
        <span class="c-file-manager_size">{{ value > 0 ? convertBytes(value) : '--' }}</span>
      </template>
      <template #item.lastModified="{ value }" v-if="!$slots['item.lastModified']">
        <ColumnDateModified :data-row="value" :format="dateFormat" />
      </template>

      <template #item.groupActions="{ item }" v-if="!$slots['item.groupActions']">
        <DBtnIcon :icon="MdiWebfont['dots-vertical']" @click="actionClickBtnShowContextMenu($event, item)" />
      </template>

      <template #no-data.table v-if="$slots['no-data']">
        <slot name="no-data" />
      </template>
    </TableFilemanager>

    <template v-else-if="viewFM === EnumViewModeFm.thumbnails">
      <GridItem
        :show-checkbox="showCheckbox"
        :update-selected="updateSelected"
        :update-selected-one="updateSelectedOne"
        :loading="loading"
        :list-data="dataFilemanger"
        @toglle-context-menu="(e: MouseEvent, bool: boolean) => handleShowContextMenu(e, bool)"
        @load="emits('scroll')"
        @double-click="props.doubleClickRow" />
    </template>

    <ContextMenu
      v-if="showContextMenu"
      :items="contextMenuOptions"
      @close="showContextMenu = false"
      :on-click-item="actionClickContextMenu"
      :positionContextMenu="positionContextMenu" />
    <!---E: ContextMenu MOBILE--->
  </section>
</template>
