import DBtn from '@/components/DCustom/DButton/DBtn.vue';
import DCard from '@/components/DCustom/DCard/DCard.vue';
import DCheckbox from '@/components/DCustom/DCheckbox.vue';
import DIcon from '@/components/DCustom/DIcon.vue';
import DSkeletonLoader from '@/components/DCustom/DSkeletonLoader/DSkeletonLoader.vue';
import DVirtualScroll from '@/components/DCustom/DVirtualScroll.vue';
import Empty from '@/components/Empty/Empty.vue';
import { useGridItem } from '@/components/FileManager/GridItem/useGridItem';
import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
import CircularLoader from '@/components/Loader/CircularLoader.vue';
import { IFileManager } from '@/interfaces/IFileManager';
import { t } from '@/plugins/i18n';
import { EnumEmpty } from '@/utils/MyEnum';
import { addEventKeyDown, formatDate } from '@/utils/MyFunction';

interface Props {
  listData: IFileManager[];
  loading: boolean;
  showCheckBox?: boolean;
  isLoadingMore?: boolean;
  virtualScrollHeightItem?: number | string;
  updateSelected: (data: IFileManager[]) => void;
  updateSelectedOne: (data: IFileManager) => void;
}

export default defineComponent({
  name: 'GridItem',
  props: {
    listData: {
      type: Array as () => IFileManager[],
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isLoadingMore: {
      type: Boolean,
      default: false,
    },
    virtualScrollHeightItem: {
      type: [Number, String],
      default: 224,
    },
    updateSelected: {
      type: (data: IFileManager[]) => void,
      required: true,
    },
    updateSelectedOne: {
      type: (data: IFileManager) => void,
      required: true,
    },
    showCheckBox: {
      type: Boolean,
      default: false
    }
  },
  emits: ['loadMoreItem', 'doubleClick', 'download', 'toglleContextMenu'],
  setup(props, { emit, slots }) {
    const propsFunctions = {
      updateSelected: (file: IFileManager[]) => props.updateSelected(file),
      updateSelectedOne: (file: IFileManager) => props.updateSelectedOne(file),
    };

    const emitFunctions = {
      loadMoreItem: () => emit('loadMoreItem'),
      doubleClick: (file: IFileManager) => emit('doubleClick', file),
      toglleContextMenu: (event: MouseEvent, bool: boolean) => emit('toglleContextMenu', event, bool),
    };

    const listData = computed(() => props.listData as IFileManager[]);
    const loading = computed(() => props.loading);
    const isLoadingMore = computed(() => props.isLoadingMore);
    const showCheckbox = computed(() => props.showCheckBox || false);

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

    return () => {
      if (loading.value) {
        return (
          <div class="c-grid_wrap">
            {Array.from({ length: 10 }).map((_, i) => (
              <DSkeletonLoader key={i} type="table-heading, image, list-item-avatar" />
            ))}
          </div>
        );
      }

      return (
        <div class="c-grid noselect" ref={gridRef}>
          <div class="c-grid_header">
            {selectedItems.value.length > 0 && (
              <>
                {showCheckbox.value && (
                  <DCheckbox
                    onClick={(e: Event) => {
                      e.stopPropagation();
                      selectAllItems();
                    }}
                    modelValue={selectedItems.value.length === dataTable.value.length}
                    indeterminate={dataTable.value.includes(selectedItems.value)}
                  />
                )}
                <DBtn
                  icon={MdiWebfont['close']}
                  onClick={handleClearSelected}
                  title={`${selectedItems.value.length} ${t('locale.selected')}`}
                />
              </>
            )}
          </div>

          {groupedListData.value.length > 0 ? (
            <DVirtualScroll
              height={offsetHeight.value}
              items={groupedListData.value}
              itemHeight={isMobile.value ? 194 : props.virtualScrollHeightItem}
              onScroll={createHandleScroll}
              onScrollend={handleLoadMoreItem}
              v-slots={{
                default: ({ item }: { item: IFileManager[] }) => (
                  <div class="c-grid_wrap">
                    {item.map((file, idx) => (
                      <DCard
                        key={idx}
                        class={[
                          'c-grid_card noselect',
                          selectedItems.value.includes(file) || objectSelectedOne.value === file ? 'bg-selected' : '',
                        ]}
                        onContextmenu={(e: Event) => {
                          e.preventDefault();
                          rightClickHandler(e as MouseEvent, file);
                        }}
                        onDblclick={(e: Event) => {
                          e.preventDefault();
                          handleDBClick(e as MouseEvent, file);
                        }}
                        onClick={(e: Event) => {
                          e.preventDefault();
                          toggleItem(e as MouseEvent, file);
                        }}
                        onTouchstart={(e: Event) => {
                          e.preventDefault();
                          handleTouchStart(file);
                        }}
                        onTouchend={(e: Event) => {
                          e.preventDefault();
                          handleTouchEnd(file);
                        }}
                        onMousedown={(e: MouseEvent) => startSelection(e, file)}
                        onMousemove={(e: MouseEvent) => updateSelection(e, file)}
                        onMouseup={stopSelection}
                        onTouchmove={(e: Event) => e.preventDefault()}>
                        {slots.contentGidItem ? (
                          slots.contentGidItem()
                        ) : (
                          <>
                            <div class="c-grid_box_head">
                              <DIcon icon={getThumbnailIcon(file)} size="32" />
                              <p class="c-grid_box_head_name-file text-three-dots" title={file.name}>
                                {file.name}
                              </p>
                              <span title={t('locale.other_operations')}>
                                <DBtn
                                  icon={MdiWebfont['dots-vertical']}
                                  onClick={(e: Event) => rightClickHandler(e as MouseEvent, file)}
                                  disabled={selectedItems.value.length > 1}
                                />
                              </span>
                            </div>
                            <div class="c-grid_box_thumbnail">
                              <DIcon icon={getThumbnailIcon(file)} size={isMobile.value ? 110 : 152} />
                            </div>
                            <div class="c-grid_box_footer">
                              <p class="line-clamp-1">
                                {`${t('locale.you')} ${t('locale.have')} ${t('locale.' + file.action).toLowerCase()}`} •
                                {formatDate(file.lastModified, 'DD/MM/YYYY')}
                              </p>
                            </div>
                          </>
                        )}
                      </DCard>
                    ))}
                  </div>
                ),
              }}
            />
          ) : (
            <Empty typeEmpty={EnumEmpty.no_data} hideButton />
          )}

          {isLoadingMore.value && <CircularLoader />}
        </div>
      );
    };
  },
});
