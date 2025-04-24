<script setup lang="ts">
  import { useTableFilemanager } from '@/components/FileManager/TableFilemanager/useTableFilemanager';
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { EnumLocalStorageKey, EnumViewModeFm } from '@/utils/MyEnum';
  import { addEventKeyDown } from '@/utils/MyFunction';
  import { useStorage } from '@vueuse/core';

  defineOptions({
    inheritAttrs: false,
  });

  interface ITableFilemanagerProps {
    headerTable: any[];
    dataTable: any[];
    showCheckbox?: boolean;
    itemHeight?: number;
    // void
    updateSelected: (data: IFileManager[]) => void;
    updateSelectedOne: (data: IFileManager) => void;
  }

  // Composables and stores
  const viewFM = useStorage(EnumLocalStorageKey.viewFM, EnumViewModeFm.details, localStorage, {
    listenToStorageChanges: true,
  });

  // Props and emits
  const props = defineProps<ITableFilemanagerProps>();
  const emits = defineEmits(['loadMore', 'doubleClickRow', 'clickRow', 'toglleContextMenu']);

  // Tạo đối tượng Emits để truyền vào useGridItem
  const emitFunctions = {
    loadMoreItem: () => emits('loadMore'),
    doubleClick: (file: IFileManager) => emits('doubleClickRow', file),
    clickRow: (file: IFileManager) => emits('clickRow', file),
    toglleContextMenu: (event: MouseEvent, bool: boolean) => emits('toglleContextMenu', event, bool),
  };

  // Tạo đối tượng Props để truyền vào useTableFilemanager
  const propsFunctions = {
    updateSelected: (file: IFileManager[]) => props.updateSelected(file),
    updateSelectedOne: (file: IFileManager) => props.updateSelectedOne(file),
  };

  // Refs
  const tableRef = ref<HTMLElement | null>(null);
  const tableBodyRef = ref<HTMLElement | null>(null);
  const rowHeight = computed(() => props.itemHeight || 48);

  // Virtual scrolling state
  const startIndex = ref(0);
  const endIndex = ref(0);
  const visibleItemCount = ref(0);
  const bufferSize = 5; // Extra items to render above and below visible area
  const scrollTop = ref(0);
  const totalHeight = computed(() => props.dataTable.length * rowHeight.value);

  // Computed properties
  const headerTable = computed(() => props.headerTable);
  const dataTable = computed(() => props.dataTable);
  const showCheckbox = computed(() => props.showCheckbox || false);

  const {
    selectedItems,
    wrapperRef,
    heightTable,
    hoveredRowIndex,
    isItemSelected,
    selectAllItems,
    handleCheckboxClick,
    mouseLeaveHandler,
    isItemSelectedOne,
    rightClickHandler,
    rowClickHandler,
    rowDoubleClickHandler,
    touchEndHandler,
    keydownHandler,
    touchStartHandler,
    mouseEnterHandler,
    startSelection,
    updateSelection,
    stopSelection,
    handleScroll: originalHandleScroll,
    handleClearSelected,
  } = useTableFilemanager(dataTable, emitFunctions, propsFunctions);

  // Virtual scrolling implementation
  const updateVisibleItems = () => {
    if (!tableBodyRef.value) return;

    const containerHeight = tableBodyRef.value.clientHeight;
    visibleItemCount.value = Math.ceil(containerHeight / rowHeight.value);

    startIndex.value = Math.max(0, Math.floor(scrollTop.value / rowHeight.value) - bufferSize);
    endIndex.value = Math.min(dataTable.value.length - 1, startIndex.value + visibleItemCount.value + bufferSize * 2);
  };

  const visibleItems = computed(() => {
    if (dataTable.value.length === 0) return [];
    return dataTable.value.slice(startIndex.value, endIndex.value + 1);
  });

  const offsetY = computed(() => startIndex.value * rowHeight.value);

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    scrollTop.value = target.scrollTop;
    updateVisibleItems();
    originalHandleScroll(event);
  };

  // Update visible items when data changes
  watch(
    () => dataTable.value.length,
    () => {
      updateVisibleItems();
    },
  );

  // Lifecycle hooks
  onMounted(() => {
    if (tableRef.value && viewFM.value === EnumViewModeFm.details) {
      // Add event listeners
      addEventKeyDown(keydownHandler);

      // Initialize visible items calculation
      nextTick(() => {
        if (tableBodyRef.value) {
          updateVisibleItems();
        }
      });
    }
    console.log('headerTable', headerTable.value);
  });

  // Method to scroll to a specific item by index
  const scrollToIndex = (index: number) => {
    if (tableBodyRef.value) {
      tableBodyRef.value.scrollTop = index * rowHeight.value;
    }
  };

  // Method to get row style based on item index in the virtual list
  const getRowStyle = (index: number) => {
    return {
      position: 'absolute',
      top: `${(startIndex.value + index) * rowHeight.value}px`,
      height: `${rowHeight.value}px`,
      width: '100%',
    };
  };

  // Clean up event listeners if needed
  onUnmounted(() => {
    // Cleanup if needed
  });
</script>

<template>
  <div ref="wrapperRef" class="d-data-table-virtual_wrapper">
    <template v-if="selectedItems.length > 0">
      <div class="d-data-table-virtual_header-selected" :style="{ minHeight: `${rowHeight}px` }">
        <DCheckbox
          v-if="showCheckbox"
          @click.stop="selectAllItems"
          :model-value="selectedItems.length === dataTable.length"
          :indeterminate="dataTable.includes(selectedItems)" />
        <DBtn
          :icon="MdiWebfont['close']"
          @click="handleClearSelected"
          :title="`${selectedItems.length} ${t('locale.selected')}`" />
      </div>
    </template>

    <div ref="tableRef" class="d-data-table-virtual">
      <!-- Table header -->
      <div class="d-data-table-virtual__header">
        <table class="w-full">
          <thead>
            <tr>
              <th v-if="showCheckbox" class="text-center" style="width: 50px">
                <DCheckbox @click.stop="selectAllItems" :model-value="selectedItems.length === dataTable.length" />
              </th>
              <th v-for="header in headerTable" :key="header.key" :width="header.width">
                {{ header.title }}
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <!-- Table body with virtual scrolling -->
      <div
        ref="tableBodyRef"
        class="d-data-table-virtual__body"
        :style="{ height: heightTable }"
        @scroll="handleScroll">
        <!-- Spacer for virtual scrolling -->
        <div class="d-data-table-virtual__spacer" :style="{ height: `${totalHeight}px` }"></div>

        <!-- Visible rows -->
        <div class="d-data-table-virtual__visible-rows" :style="{ transform: `translateY(${offsetY}px)` }">
          <template v-for="(item, localIndex) in visibleItems" :key="item.key">
            <div
              class="d-data-table-virtual__row"
              :class="{
                'd-data-table-virtual__hovered': hoveredRowIndex === startIndex + localIndex,
                'd-data-table-virtual__selected': isItemSelected(item),
                'd-data-table-virtual__selected-one': isItemSelectedOne(item),
              }"
              :style="{ height: `${rowHeight}px` }"
              @contextmenu="rightClickHandler($event, item)"
              @click="rowClickHandler($event, item)"
              @dblclick="rowDoubleClickHandler($event, item)"
              @touchstart="touchStartHandler($event)"
              @touchend="touchEndHandler($event, item)"
              @mouseenter="mouseEnterHandler(startIndex + localIndex)"
              @mouseleave="mouseLeaveHandler"
              @mousedown="startSelection($event, item)"
              @mousemove="updateSelection($event, item)"
              @mouseup="stopSelection">
              <!-- Checkbox -->
              <div v-if="showCheckbox" class="d-data-table-virtual__cell text-center" style="width: 50px">
                <DCheckbox
                  hide-details
                  @click.stop="handleCheckboxClick($event, item)"
                  :model-value="isItemSelected(item)" />
              </div>

              <!-- Data cells -->
              <template v-for="header in headerTable" :key="header.key">
                <div
                  class="d-data-table-virtual__cell"
                  :style="{ width: typeof header.width === 'number' ? `${header.width}px` : header.width }">
                  <slot
                    v-if="$slots[`item.${header.key}`]"
                    :name="`item.${header.key}`"
                    v-bind="{ item, index: startIndex + localIndex, value: item[header.key] }" />
                  <span v-else>{{ item[header.key] }}</span>
                </div>
              </template>
            </div>
          </template>
        </div>

        <!-- No data content -->
        <div v-if="dataTable.length === 0 && $slots['no-data.table']" class="d-data-table-virtual__no-data">
          <slot name="no-data.table" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .d-data-table-virtual_wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .d-data-table-virtual_header-selected {
    display: flex;
    align-items: center;
    padding: 0 12px;
    /* background-color: var(--v-primary-base, #1976d2); */
    color: white;
  }

  .d-data-table-virtual {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .d-data-table-virtual__header {
    /* background-color: var(--v-surface-variant, #f5f5f5);
    border-bottom: 1px solid var(--v-border-color, #e0e0e0); */
  }

  .d-data-table-virtual__header table {
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
  }

  .d-data-table-virtual__header th {
    font-weight: 500;
    text-align: left;
    padding: 0 16px;
    height: 48px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .d-data-table-virtual__body {
    flex: 1;
    overflow-y: auto;
    position: relative;
  }

  .d-data-table-virtual__spacer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    pointer-events: none;
  }

  .d-data-table-virtual__visible-rows {
    position: absolute;
    width: 100%;
    left: 0;
  }

  .d-data-table-virtual__row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--v-border-color, #e0e0e0);
    transition: background-color 0.2s;
  }

  .d-data-table-virtual__cell {
    padding: 0 16px;
    display: flex;
    align-items: center;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .d-data-table-virtual__no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    height: 100%;
  }
</style>
