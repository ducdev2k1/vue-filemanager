<script setup lang="ts">
  import { useGridItem } from '@/components/FileManager/GridItem/useGridItem';
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { EnumEmpty } from '@/utils/MyEnum';
  import { addEventKeyDown, formatDate } from '@/utils/MyFunction';

  interface IProps {
    listData: IFileManager[];
    loading: boolean;
    isLoadingMore?: boolean;
    virtualScrollHeightItem?: number | string;
    showCheckbox?: boolean;
    updateSelected: (data: IFileManager[]) => void;
    updateSelectedOne: (data: IFileManager) => void;
  }

  const props = withDefaults(defineProps<IProps>(), {
    loading: false,
    isLoadingMore: false,
    virtualScrollHeightItem: 224,
  });

  const propsFunctions = {
    updateSelected: (file: IFileManager[]) => props.updateSelected(file),
    updateSelectedOne: (file: IFileManager) => props.updateSelectedOne(file),
  };

  // const route = useRoute();
  const emits = defineEmits(['loadMoreItem', 'doubleClick', 'download', 'toglleContextMenu']);
  const listData = computed(() => props.listData as IFileManager[]);
  const loading = computed(() => props.loading);
  const isLoadingMore = computed(() => props.isLoadingMore);
  const showCheckbox = computed(() => props.showCheckbox || false);

  const emitFunctions = {
    loadMoreItem: () => emits('loadMoreItem'),
    doubleClick: (file: IFileManager) => emits('doubleClick', file),
    toglleContextMenu: (event: MouseEvent, bool: boolean) => emits('toglleContextMenu', event, bool),
  };

  const {
    gridRef,
    offsetHeight,
    groupedListData,
    selectedItems,
    objectSelectedOne,
    isMobile,
    rightClickHandler,
    handleTouchStart,
    handleTouchEnd,
    toggleItem,
    keydownHandler,
    setupGridItem,
    cleanupGridItem,
    handleLoadMoreItem,
    handleDBClick,
    startSelection,
    updateSelection,
    stopSelection,
    createHandleScroll,
    getThumbnailIcon,
    handleClearSelected,
  } = useGridItem(listData, emitFunctions, propsFunctions);

  onMounted(() => {
    setupGridItem();
    addEventKeyDown(keydownHandler);
  });

  onUnmounted(() => {
    cleanupGridItem();
  });
</script>

<template>
  <template v-if="loading">
    <div class="c-grid_wrap">
      <DSkeletonLoader v-for="i in 18" :key="i" type="card" />
    </div>
  </template>

  <div v-else class="c-grid noselect" ref="gridRef">
    <div class="c-grid_header">
      <template v-if="selectedItems.length > 0">
        <DCheckbox
          v-if="showCheckbox"
          @click.stop="selectAllItems"
          :model-value="selectedItems.length === dataTable.length"
          :indeterminate="dataTable.includes(selectedItems)" />
        <DBtn
          :icon="MdiWebfont['close']"
          @click="handleClearSelected"
          :title="`${selectedItems.length} ${t('locale.selected')}`" />
      </template>
    </div>
    <d-virtual-scroll
      v-if="groupedListData.length > 0"
      :height="offsetHeight"
      :items="groupedListData"
      :item-height="isMobile ? 194 : virtualScrollHeightItem"
      :scroll="createHandleScroll"
      @scrollend="handleLoadMoreItem">
      <template v-slot="{ item }">
        <div class="c-grid_wrap">
          <d-card
            v-for="(file, idx) in item"
            :key="idx"
            class="c-grid_card noselect"
            :class="[selectedItems.includes(file) || objectSelectedOne === file ? 'bg-selected' : '']"
            @contextmenu.prevent="rightClickHandler($event, file)"
            @dblclick.prevent="handleDBClick($event, file)"
            @click.prevent="toggleItem($event, file)"
            @touchstart.prevent="handleTouchStart(file)"
            @touchend.prevent="handleTouchEnd(file)"
            @mousedown="startSelection($event, file)"
            @mousemove="updateSelection($event, file)"
            @mouseup="stopSelection"
            @touchmove.prevent>
            <slot v-if="$slots['contentGidItem']" name="contentGidItem" />
            <template v-else>
              <div class="c-grid_box_head">
                <d-icon :icon="getThumbnailIcon(file)" size="32" />
                <p class="c-grid_box_head_name-file text-three-dots" :title="file.name">
                  {{ file.name }}
                </p>
                <span :title="t('locale.other_operations')">
                  <DBtn
                    :icon="MdiWebfont['dots-vertical']"
                    @click.passive="rightClickHandler($event, file)"
                    :disabled="selectedItems.length > 1" />
                </span>
              </div>
              <div class="c-grid_box_thumbnail">
                <d-icon :icon="getThumbnailIcon(file)" :size="isMobile ? 110 : 152" />
              </div>

              <div class="c-grid_box_footer">
                <p class="line-clamp-1">
                  {{ `${t('locale.you')} ${t('locale.have')} ${t('locale.' + file.action).toLowerCase()}` }} •
                  {{ formatDate(file.lastModified, 'DD/MM/YYYY') }}
                </p>
              </div>
            </template>
          </d-card>
        </div>
      </template>
    </d-virtual-scroll>

    <Empty v-else :type-empty="EnumEmpty.no_data" hide-button />

    <CircularLoader v-if="isLoadingMore" />
  </div>
</template>
