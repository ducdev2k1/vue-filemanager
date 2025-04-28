<script setup lang="ts">
  import { useGridItem } from '@/components/FileManager/GridItem/useGridItem';
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { addEventKeyDown, formatDate } from '@/utils/MyFunction';
  import { AvatarInitials } from '@ducdev2k1/avatar-initials';

  interface IProps {
    listData: IFileManager[];
    loading: boolean;
    isLoadingMore?: boolean;
    virtualScrollHeightItem?: number | string;
  }

  const props = withDefaults(defineProps<IProps>(), {
    loading: false,
    isLoadingMore: false,
    virtualScrollHeightItem: 266,
  });

  // const route = useRoute();
  const emits = defineEmits(['load', 'doubleClick', 'download']);
  const listData = computed(() => props.listData as IFileManager[]);
  const loading = computed(() => props.loading);
  const isLoadingMore = computed(() => props.isLoadingMore);

  const emitFunctions = {
    load: () => emits('load'),
    doubleClick: (file: IFileManager) => emits('doubleClick', file),
  };

  const {
    gridRef,
    offsetHeight,
    groupedListData,
    selectedItems,
    objectSelectedOne,
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
  } = useGridItem(listData, emitFunctions);

  const flatListData = computed(() => {
    return groupedListData.value.flat();
  });

  onMounted(() => {
    console.log('flatListData.value :>> ', flatListData.value);
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
      <DSkeletonLoader v-for="i in 10" :key="i" type="table-heading, image, list-item-avatar" />
    </div>
  </template>

  <div v-else class="c-grid noselect" ref="gridRef">
    <d-virtual-scroll
      v-if="groupedListData.length > 0"
      :height="offsetHeight"
      :items="groupedListData"
      :item-height="virtualScrollHeightItem"
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
                <!-- <d-tooltip location="top" :text="file.name">
                  <template #activator="{ props }">
                    <p v-bind="props" class="truncate text-left grow line-clamp-1">
                      {{ file.name }}
                    </p>
                  </template>
                </d-tooltip> -->
                <span :title="t('locale.other_operations')">
                  <DBtn
                    :icon-mdi="MdiWebfont['dots-vertical']"
                    @click.passive="rightClickHandler($event, file)"
                    :disabled="selectedItems.length > 1"></DBtn>
                </span>
              </div>
              <div class="c-grid_box_thumbnail">
                <d-icon :icon="getThumbnailIcon(file)" size="152" />
              </div>

              <div class="c-grid_box_footer">
                <AvatarInitials :full-name="file.owner.account" size="32" />
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

    <!-- <Empty v-else :type-empty="EnumEmpty.no_data" hide-button /> -->

    <CircularLoader v-if="isLoadingMore" />
  </div>
</template>

<style scoped></style>
