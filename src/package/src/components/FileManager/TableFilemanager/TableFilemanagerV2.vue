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
    updateSelected: (data: IFileManager[]) => void;
    updateSelectedOne: (data: IFileManager) => void;
  }

  const viewFM = useStorage(EnumLocalStorageKey.viewFM, EnumViewModeFm.details, localStorage, {
    listenToStorageChanges: true,
  });

  const props = defineProps<ITableFilemanagerProps>();
  const emits = defineEmits(['loadMore', 'doubleClickRow', 'clickRow', 'toglleContextMenu']);

  const emitFunctions = {
    loadMoreItem: () => emits('loadMore'),
    doubleClick: (file: IFileManager) => emits('doubleClickRow', file),
    clickRow: (file: IFileManager) => emits('clickRow', file),
    toglleContextMenu: (event: MouseEvent, bool: boolean) => emits('toglleContextMenu', event, bool),
  };

  const propsFunctions = {
    updateSelected: (file: IFileManager[]) => props.updateSelected(file),
    updateSelectedOne: (file: IFileManager) => props.updateSelectedOne(file),
  };

  const tableRef = ref<HTMLElement | null>(null);
  const tableBodyRef = ref<HTMLElement | null>(null);
  const rowHeight = computed(() => props.itemHeight || 48);

  // const startIndex = ref(0);
  // const endIndex = ref(0);
  // const visibleItemCount = ref(0);
  // const bufferSize = 3;
  // const scrollTop = ref(0);
  // const totalHeight = computed(() => props.dataTable.length * rowHeight.value);

  const headerTable = computed(() => props.headerTable);
  const dataTable = computed(() => props.dataTable);
  const showCheckbox = computed(() => props.showCheckbox || false);

  const {
    selectedItems,
    wrapperRef,
    heightTable,
    hoveredRowIndex,
    startIndexVirtual,
    endIndexVirtual,
    visibleItemCount,
    bufferSize,
    scrollTop,
    totalHeightVirtual,
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

  const updateVisibleItems = () => {
    if (!tableBodyRef.value) return;

    const containerHeight = tableBodyRef.value.clientHeight;
    visibleItemCount.value = Math.ceil(containerHeight / rowHeight.value);

    startIndexVirtual.value = Math.max(0, Math.floor(scrollTop.value / rowHeight.value) - bufferSize);
    endIndexVirtual.value = Math.min(
      dataTable.value.length - 1,
      startIndexVirtual.value + visibleItemCount.value + bufferSize,
    );
  };

  const visibleItems = computed(() => {
    if (dataTable.value.length === 0) return [];
    return dataTable.value.slice(startIndexVirtual.value, endIndexVirtual.value + 1);
  });

  const offsetY = computed(() => startIndexVirtual.value * rowHeight.value);

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    scrollTop.value = target.scrollTop;
    updateVisibleItems();
    originalHandleScroll(event);
  };

  watch(
    () => dataTable.value.length,
    () => {
      updateVisibleItems();
    },
  );

  onMounted(() => {
    if (tableRef.value && viewFM.value === EnumViewModeFm.details) {
      addEventKeyDown(keydownHandler);
      nextTick(() => {
        if (tableBodyRef.value) {
          updateVisibleItems();
        }
      });
    }
  });

  const scrollToIndex = (index: number) => {
    if (tableBodyRef.value) {
      tableBodyRef.value.scrollTop = index * rowHeight.value;
    }
  };

  const getRowStyle = (index: number) => {
    return {
      position: 'absolute',
      top: `${(startIndexVirtual.value + index) * rowHeight.value}px`,
      height: `${rowHeight.value}px`,
      width: '100%',
    };
  };

  onUnmounted(() => {
    // Cleanup if needed
  });
</script>

<template>
  <div ref="wrapperRef" class="d-table-virtual_wrapper">
    <template v-if="selectedItems.length > 0">
      <div class="d-table-virtual_header-selected" :style="{ minHeight: `${rowHeight}px` }">
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

    <div ref="tableRef" class="d-table-virtual">
      <!-- Table header -->
      <div class="d-table-virtual__header">
        <table style="table-layout: fixed; width: 100%">
          <thead>
            <tr>
              <th v-if="showCheckbox" class="text-center" style="width: 50px">
                <DCheckbox @click.stop="selectAllItems" :model-value="selectedItems.length === dataTable.length" />
              </th>
              <th
                v-for="header in headerTable"
                :key="header.key"
                :width="header.width"
                :height="rowHeight"
                :class="header.align">
                {{ header.title }}
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <!-- Table body with virtual scrolling -->
      <div ref="tableBodyRef" class="d-table-virtual__body" :style="{ height: heightTable }" @scroll="handleScroll">
        <!-- Spacer for virtual scrolling -->
        <div class="d-table-virtual__spacer" :style="{ height: `${totalHeightVirtual}px` }"></div>

        <!-- Visible rows -->
        <div class="d-table-virtual__visible-rows" :style="{ transform: `translateY(${offsetY}px)` }">
          <table class="w-full" style="table-layout: fixed">
            <tbody>
              <tr
                v-for="(item, localIndex) in visibleItems"
                :key="item.key"
                class="d-table-virtual__row"
                :class="{
                  'd-table-virtual__hovered': hoveredRowIndex === startIndexVirtual + localIndex,
                  'd-table-virtual__selected': isItemSelected(item),
                  'd-table-virtual__selected-one': isItemSelectedOne(item),
                }"
                :height="rowHeight"
                @contextmenu="rightClickHandler($event, item)"
                @click="rowClickHandler($event, item)"
                @dblclick="rowDoubleClickHandler($event, item)"
                @touchstart="touchStartHandler($event)"
                @touchend="touchEndHandler($event, item)"
                @mouseenter="mouseEnterHandler(startIndexVirtual + localIndex)"
                @mouseleave="mouseLeaveHandler"
                @mousedown="startSelection($event, item)"
                @mousemove="updateSelection($event, item)"
                @mouseup="stopSelection">
                <!-- Checkbox -->
                <td v-if="showCheckbox" class="d-table-virtual__cell text-center" style="width: 50px">
                  <DCheckbox
                    hide-details
                    @click.stop="handleCheckboxClick($event, item)"
                    :model-value="isItemSelected(item)" />
                </td>
                <!-- Data cells -->
                <td
                  v-for="header in headerTable"
                  :key="header.key"
                  class="d-table-virtual__cell"
                  :class="header.align"
                  :width="header.width">
                  <slot
                    v-if="$slots[`item.${header.key}`]"
                    :name="`item.${header.key}`"
                    v-bind="{ item, index: startIndexVirtual + localIndex, value: item[header.key] }" />
                  <span v-else>{{ item[header.key] }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- No data content -->
        <div v-if="dataTable.length === 0 && $slots['no-data.table']" class="d-table-virtual__no-data">
          <slot name="no-data.table" />
        </div>
      </div>
    </div>
  </div>
</template>
