<script setup lang="ts">
  // import { fmActionDownloadFile } from '@/components/ConfigActionFileManager';
  // import { useGridItem } from '@/components/FileManager/GridItem/useGridItem';
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  // import { helperActionRecommendDetailFile } from '@/components/v1/RecommendFileAndFolder/partial/HelperActionRecommendFile';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  // import { EnumEmpty } from '@/utils/MyEnum';
  // import { addEventKeyDown, formatDate } from '@/utils/MyFunction';
  // import { myRoute } from '@/utils/my-route';
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
    virtualScrollHeightItem: '266',
  });

  const route = useRoute();
  const emits = defineEmits(['load', 'doubleClick', 'download']);
  const listData = computed(() => props.listData);
  const loading = computed(() => props.loading);
  const isLoadingMore = computed(() => props.isLoadingMore);
  const isPathPublic = computed(() => route.path === myRoute.sharePublic || route.query?.public);

  // Tạo đối tượng emits để truyền vào useGridItem
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
    isHomePage,
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

  onMounted(() => {
    setupGridItem();
    // Thêm event listener cho grid
    addEventKeyDown(keydownHandler);
  });

  onUnmounted(() => {
    cleanupGridItem();
  });
</script>

<template>
  <template v-if="loading">
    <div class="c-grid_wrap">
      <SkeletonLoader v-for="i in 10" :key="i" type="table-heading, image, list-item-avatar" />
    </div>
  </template>

  <div v-else class="c-grid noselect" ref="gridRef">
    <v-virtual-scroll
      v-if="groupedListData.length > 0"
      :height="offsetHeight"
      :items="groupedListData"
      :item-height="virtualScrollHeightItem"
      @scroll="createHandleScroll"
      @scrollend="handleLoadMoreItem">
      <template v-slot:default="{ item }">
        <div class="c-grid_wrap">
          <v-card
            v-for="(file, idx) in item"
            :key="idx"
            :color="selectedItems.includes(file) || objectSelectedOne === file ? 'selected' : ''"
            @contextmenu.prevent="rightClickHandler($event, file)"
            @dblclick.prevent="handleDBClick($event, file)"
            @click.prevent="toggleItem($event, file)"
            @touchstart.prevent="handleTouchStart(file)"
            @touchend.prevent="handleTouchEnd(file)"
            @mousedown="startSelection($event, file)"
            @mousemove="updateSelection($event, file)"
            @mouseup="stopSelection"
            @touchmove.prevent
            class="c-grid_card pa-3 d-flex flex-column align-center text-center noselect">
            <slot v-if="$slots['contentGidItem']" name="contentGidItem" />
            <template v-else>
              <div class="c-grid_box_head">
                <img :src="getThumbnailIcon(file)" :alt="file.name" width="32" height="32" />
                <v-tooltip location="top" :text="file.name">
                  <template #activator="{ props }">
                    <p v-bind="props" class="truncate text-left grow line-clamp-1">
                      {{ file.name }}
                    </p>
                  </template>
                </v-tooltip>
                <span :title="t('locale.other_operations')">
                  <BtnBase
                    :icon-mdi="MdiWebfont['dots-vertical']"
                    @click.passive="rightClickHandler($event, file)"
                    :disabled="selectedItems.length > 1">
                    <template #content v-if="isHomePage">
                      <v-menu :open-on-click="true" class="c-menu-down" activator="parent">
                        <v-list class="c-menu-down_list">
                          <v-list-item
                            class="c-menu-down_item"
                            @click="emits('download', file)"
                            :title="t('locale.download_custom')"
                            :prepend-icon="MdiWebfont['cloud-download-outline']" />
                          <v-list-item
                            class="c-menu-down_item"
                            @click="emits('detail', file)"
                            :title="t('locale.detail')"
                            :prepend-icon="MdiWebfont['information-slab-circle-outline']" />
                        </v-list>
                      </v-menu>
                    </template>
                  </BtnBase>
                </span>
              </div>

              <v-img
                class="object-contain min-h-[152px] max-h-[152px] p-1 rounded-2xl"
                :src="publicPathImage(isPathPublic, file)"
                height="152"
                width="100%"
                draggable="false"
                :alt="file.name" />

              <div class="c-grid_box_footer">
                <AvatarInitials :full-name="file.owner.account" size="32" :only-color="isByMe(file.owner.account)" />
                <template v-if="route.path === myRoute.home">
                  <p class="line-clamp-1">
                    {{ `${t('locale.you')} ${t('locale.have')} ${t('locale.' + file.action).toLowerCase()}` }} •
                    {{ formatDate(file.lastModified, 'DD/MM/YYYY') }}
                  </p>
                </template>
                <template v-else>
                  <p class="line-clamp-1">
                    {{ isByMe(file.owner.account) ? t('locale.me') : file.owner.account }}
                  </p>
                </template>
              </div>
            </template>
          </v-card>
        </div>
      </template>
    </v-virtual-scroll>

    <Empty v-else :type-empty="EnumEmpty.no_data" hide-button />

    <CircularLoader v-if="isLoadingMore" />
  </div>
</template>
