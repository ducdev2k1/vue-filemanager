import { IFileManager } from '@/interfaces/IFileManager';
import { debounce } from '@/utils/MyFunction';
import { breakPoint } from '@/utils/MyVariables';
import { useWindowSize } from '@vueuse/core';
import { computed, ComputedRef, ref, watch } from 'vue';

interface IEmitFunctions {
  load?: () => void;
  loadMoreItem?: () => void;
  doubleClick?: (file: IFileManager) => void;
  clickRow?: (file: IFileManager) => void;
  toglleContextMenu: (e: MouseEvent, bool: boolean) => void;
  [key: string]: ((...args: any[]) => void) | undefined;
}

interface IFileManagerConfig {
  // View type - 'grid' or 'table'
  viewType: 'grid' | 'table';
  // Optional debounce delay for scroll in ms
  scrollDebounceDelay?: number;
  // Double tap delay for mobile in ms
  doubleTapDelay?: number;
  // Long press time in ms
  longPressDelay?: number;
  // Scroll threshold percentage (0-1)
  scrollThreshold?: number;
}

interface IFileManagerProps {
  updateSelected: (data: IFileManager[]) => void;
  updateSelectedOne: (data: IFileManager) => void;
}

export const useFileManager = (
  fileData: ComputedRef<IFileManager[]>,
  emits: IEmitFunctions,
  props: IFileManagerProps,
  config: IFileManagerConfig,
) => {
  const { width } = useWindowSize();

  // Configuration with defaults
  const viewType = config.viewType;
  const SCROLL_DEBOUNCE_DELAY = config.scrollDebounceDelay || 100;
  const DOUBLE_TAP_DELAY = config.doubleTapDelay || 300;
  const LONG_PRESS_DELAY = config.longPressDelay || 1000;
  const SCROLL_THRESHOLD = config.scrollThreshold || 0.5;

  // Common refs
  const containerRef = ref<HTMLElement | null>(null);
  const selectedItems = ref([] as IFileManager[]);
  const objectSelectedOne = ref({} as IFileManager);
  const lastSelectedItem = ref<IFileManager | null>(null);
  const previousScrollTop = ref(0);
  const isLoading = ref(false);
  const hoveredItemIndex = ref<number | null>(null);

  // Selection refs
  const isSelecting = ref(false);
  const selectionStartIndex = ref<number | null>(null);
  const selectionEndIndex = ref<number | null>(null);

  // Mobile interaction refs
  const touchStartTimer = ref<number | null>(null);
  const touchStartPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTapTime = ref<number>(0);
  const isLongPress = ref(false);
  const multiSelectMode = ref(false);

  // Computed values
  const isMobile = computed(() => width.value <= breakPoint.brSpLandscape);

  // Watch for selection changes and emit updates
  watch(
    () => selectedItems.value,
    (newValue) => {
      // Update objectSelectedOne (last item of selectedItems)
      if (newValue.length > 0) {
        objectSelectedOne.value = newValue[newValue.length - 1];
      } else {
        objectSelectedOne.value = {} as IFileManager;
      }
      props.updateSelected(newValue || ([] as IFileManager[]));
    },
  );

  watch(
    () => objectSelectedOne.value,
    (newValue) => {
      props.updateSelectedOne(newValue || ({} as IFileManager));
    },
  );

  // Helper functions
  const getFileIndex = (file: IFileManager): number => {
    return fileData.value.findIndex((item) => item.key === file.key);
  };

  const isItemSelected = (file: IFileManager): boolean => {
    return selectedItems.value.some((selectedItem: IFileManager) => selectedItem.key === file.key);
  };

  const isItemSelectedOne = (file: IFileManager): boolean => {
    return objectSelectedOne.value?.key === file.key;
  };

  // Selection functions
  const selectAllItems = (): IFileManager[] => {
    selectedItems.value = [...fileData.value];
    return selectedItems.value;
  };

  const handleClearSelected = (): void => {
    selectedItems.value = [] as IFileManager[];
    objectSelectedOne.value = {} as IFileManager;
  };

  const handleShiftClick = (file: IFileManager, lastItem: IFileManager): IFileManager[] => {
    const startIndex = getFileIndex(lastItem);
    const endIndex = getFileIndex(file);

    if (startIndex !== -1 && endIndex !== -1) {
      const minIndex = Math.min(startIndex, endIndex);
      const maxIndex = Math.max(startIndex, endIndex);
      selectedItems.value = fileData.value.slice(minIndex, maxIndex + 1);
    }

    return selectedItems.value;
  };

  const handleCtrlClick = (file: IFileManager): IFileManager[] => {
    const existingIndex = selectedItems.value.findIndex((item: IFileManager) => item.key === file.key);

    if (existingIndex !== -1) {
      // Remove item if already selected
      selectedItems.value = [...selectedItems.value];
      selectedItems.value.splice(existingIndex, 1);
    } else {
      // Add item to selection
      selectedItems.value = [...selectedItems.value, file];
    }

    return selectedItems.value;
  };

  // Click handlers
  const clickHandler = (event: MouseEvent | TouchEvent, file: IFileManager): void => {
    // Skip if clicking checkbox in mobile view
    if (isMobile.value && (event.target as HTMLElement).closest('.v-checkbox')) {
      if (selectedItems.value.some((item) => item.key === file.key)) {
        selectedItems.value = selectedItems.value.filter((item: IFileManager) => item.key !== file.key);
      } else {
        selectedItems.value = [...selectedItems.value, file];
      }
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    // Close any open context menu
    emits.toglleContextMenu(event as MouseEvent, false);

    // Handle different selection modes
    if ((event as MouseEvent).shiftKey && lastSelectedItem.value) {
      // Shift + Click: Range selection
      handleShiftClick(file, lastSelectedItem.value);
    } else if ((event as MouseEvent).ctrlKey || (event as MouseEvent).metaKey) {
      // Ctrl/Cmd + Click: Toggle selection
      handleCtrlClick(file);
    } else {
      // Normal click: Single selection
      selectedItems.value = [file];
      lastSelectedItem.value = file;
    }

    // Update store and emit event
    objectSelectedOne.value = file;
    if (emits.clickRow) {
      emits.clickRow(file);
    }
  };

  const doubleClickHandler = (event: MouseEvent | TouchEvent, file: IFileManager): void => {
    // Skip if clicking checkbox in mobile view
    if (isMobile.value && (event.target as HTMLElement).closest('.v-checkbox')) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (emits.doubleClick) {
      emits.doubleClick(file);
    }
  };

  const rightClickHandler = (event: MouseEvent, file: IFileManager): void => {
    event.preventDefault();
    event.stopPropagation();

    // Open context menu at click position
    emits.toglleContextMenu(event, true);

    // Update selected item state
    objectSelectedOne.value = file;

    // Ensure item is in selection
    if (!isItemSelected(file)) {
      selectedItems.value = [file];
    }
  };

  const handleCheckboxClick = (event: Event, file: IFileManager): void => {
    event.stopPropagation();

    const isSelected = selectedItems.value.some((selectedItem: IFileManager) => selectedItem.key === file.key);

    if (isSelected) {
      // Remove from selection
      selectedItems.value = selectedItems.value.filter((selectedItem: IFileManager) => selectedItem.key !== file.key);
    } else {
      // Add to selection
      selectedItems.value = [...selectedItems.value, file];
    }

    objectSelectedOne.value = file;
  };

  // Hover handlers
  const mouseEnterHandler = (index: number): void => {
    hoveredItemIndex.value = index;
  };

  const mouseLeaveHandler = (): void => {
    hoveredItemIndex.value = null;
  };

  // Multi-selection drag
  const startSelection = (event: MouseEvent, file: IFileManager): void => {
    if (event.button !== 0) return; // Only handle left mouse button
    if (event.ctrlKey || event.metaKey || event.shiftKey) return; // Don't interfere with modifier keys

    event.preventDefault();
    isSelecting.value = true;
    selectionStartIndex.value = getFileIndex(file);
    selectionEndIndex.value = selectionStartIndex.value;
    selectedItems.value = [file];
    objectSelectedOne.value = file;
  };

  const updateSelection = (event: MouseEvent, file: IFileManager): void => {
    if (!isSelecting.value) return;

    selectionEndIndex.value = getFileIndex(file);

    if (selectionStartIndex.value !== null && selectionEndIndex.value !== null) {
      const minIndex = Math.min(selectionStartIndex.value, selectionEndIndex.value);
      const maxIndex = Math.max(selectionStartIndex.value, selectionEndIndex.value);
      selectedItems.value = fileData.value.slice(minIndex, maxIndex + 1);
      props.updateSelected(fileData.value.slice(minIndex, maxIndex + 1));
    }
  };

  const stopSelection = (): void => {
    isSelecting.value = false;
  };

  // Scroll handler
  const handleScroll = debounce((event: Event) => {
    const target = event.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const html = document.querySelector('html');

    // Handle scroll direction CSS
    if (scrollTop > previousScrollTop.value) {
      html?.classList.add('scrolling-down');
    } else if (scrollTop < previousScrollTop.value) {
      html?.classList.remove('scrolling-down');
    }

    // Load more data when scrolled to threshold
    if (scrollTop > previousScrollTop.value && !isLoading.value) {
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      if (scrollPercentage >= SCROLL_THRESHOLD) {
        isLoading.value = true;

        // Call appropriate load function based on viewType
        if (viewType === 'grid' && emits.load) {
          emits.load();
        } else if (viewType === 'table' && emits.loadMoreItem) {
          emits.loadMoreItem();
        }

        // Reset loading state after a delay
        setTimeout(() => {
          isLoading.value = false;
        }, 300);
      }
    }

    previousScrollTop.value = scrollTop;
  }, SCROLL_DEBOUNCE_DELAY);

  // Keyboard event handler
  const keydownHandler = (event: KeyboardEvent): IFileManager[] => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      // Ctrl/Cmd + A: Select all
      event.preventDefault();
      return selectAllItems();
    } else if (event.key === 'Delete' && selectedItems.value.length > 0) {
      // Delete: Delete files
      console.log('show modal confirm delete :>> ');
    } else if ((event.ctrlKey || event.metaKey) && event.altKey && event.key.toLowerCase() === 'e') {
      // Ctrl/Cmd + Alt + E: Rename file
      if (objectSelectedOne.value && selectedItems.value.length === 1) {
        console.log('show modal rename file :>> ');
      }
    }
    return selectedItems.value;
  };

  // Mobile touch handlers
  const touchStartHandler = (event: TouchEvent, file: IFileManager): void => {
    touchStartTimer.value = setTimeout(() => {
      isLongPress.value = true;
      multiSelectMode.value = true;
      if (!selectedItems.value.includes(file)) {
        selectedItems.value = [...selectedItems.value, file];
      }
      objectSelectedOne.value = file;
      console.log('Chế độ chọn nhiều đã được kích hoạt! :>> ');
    }, LONG_PRESS_DELAY) as unknown as number;

    if (event.touches.length > 0) {
      touchStartPosition.value = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
  };

  const touchEndHandler = (event: TouchEvent, file: IFileManager): void => {
    if (touchStartTimer.value) {
      clearTimeout(touchStartTimer.value);
      touchStartTimer.value = null;
    }

    const touchEndTime = Date.now();

    if (!isLongPress.value && !multiSelectMode.value) {
      // Handle tap vs double-tap
      const currentTime = Date.now();
      const timeSinceLastTap = currentTime - lastTapTime.value;

      if (timeSinceLastTap < DOUBLE_TAP_DELAY && lastTapTime.value > 0) {
        // Double tap
        event.preventDefault();
        doubleClickHandler(event, file);
        lastTapTime.value = 0;
      } else {
        // Single tap
        event.preventDefault();
        clickHandler(event, file);
        lastTapTime.value = currentTime;
      }
    } else if (multiSelectMode.value) {
      // Handle multiselect mode tap
      const index = selectedItems.value.findIndex((item) => item.key === file.key);
      if (index > -1) {
        selectedItems.value.splice(index, 1);
      } else {
        selectedItems.value.push(file);
      }
      objectSelectedOne.value = file;
    }

    isLongPress.value = false;
  };

  // View-specific functions (can be extended per view type)
  const viewSpecificFunctions = computed(() => {
    if (viewType === 'grid') {
      return {
        // Grid-specific properties and functions
        CARD_WIDTH: computed(() => (width.value > breakPoint.brTablet ? 305 : 150)),
        offsetWidth: ref(0),
        offsetHeight: ref('57vh'),
        resizeObserver: ref<ResizeObserver | null>(null),

        updateOffsetWidth: () => {
          if (containerRef.value) {
            viewSpecificFunctions.value.offsetWidth.value = containerRef.value.offsetWidth;
            viewSpecificFunctions.value.offsetHeight.value = (containerRef.value.offsetHeight -
              47) as unknown as string;
          }
        },

        setupContainer: () => {
          if (containerRef.value) {
            viewSpecificFunctions.value.updateOffsetWidth();
            viewSpecificFunctions.value.resizeObserver.value = new ResizeObserver(
              viewSpecificFunctions.value.updateOffsetWidth,
            );
            viewSpecificFunctions.value.resizeObserver.value.observe(containerRef.value);
          }
        },

        cleanupContainer: () => {
          viewSpecificFunctions.value.resizeObserver.value?.disconnect();
        },

        // Create grouped data for virtual scroll in grid view
        groupedData: computed(() => {
          if (!containerRef.value) return [];

          const itemsPerRow = Math.max(
            1,
            Math.floor(viewSpecificFunctions.value.offsetWidth.value / viewSpecificFunctions.value.CARD_WIDTH.value),
          );
          const grouped: IFileManager[][] = [];

          if (fileData.value) {
            for (let i = 0; i < fileData.value.length; i += itemsPerRow) {
              grouped.push(fileData.value.slice(i, i + itemsPerRow));
            }
          }

          return grouped;
        }),
      };
    } else if (viewType === 'table') {
      return {
        // Table-specific properties and functions
        rowHeight: ref(48),
        startIndexVirtual: ref(0),
        endIndexVirtual: ref(0),
        visibleItemCount: ref(0),
        bufferSize: 3,
        scrollTop: ref(0),

        totalHeightVirtual: computed(() => fileData.value.length * viewSpecificFunctions.value.rowHeight.value),

        heightTable: computed(() => {
          if (containerRef.value) {
            // Calculate the available height
            const selectedHeaderHeight = selectedItems.value.length > 0 ? 48 : 0;
            const tableHeaderHeight = 48;
            const containerHeight = containerRef.value.clientHeight || 0;
            const availableHeight = containerHeight - selectedHeaderHeight - tableHeaderHeight;
            return `${Math.max(100, availableHeight)}px`;
          }
          return '100%';
        }),

        updateVisibleRange: (scrollTop: number, containerHeight: number) => {
          const rowHeight = viewSpecificFunctions.value.rowHeight.value;
          const bufferSize = viewSpecificFunctions.value.bufferSize;

          // Calculate the visible range
          const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - bufferSize);
          const visibleCount = Math.ceil(containerHeight / rowHeight) + bufferSize * 2;
          const endIndex = Math.min(fileData.value.length - 1, startIndex + visibleCount);

          viewSpecificFunctions.value.startIndexVirtual.value = startIndex;
          viewSpecificFunctions.value.endIndexVirtual.value = endIndex;
          viewSpecificFunctions.value.visibleItemCount.value = visibleCount;
        },
      };
    }

    return {};
  });

  return {
    // Common refs
    containerRef,
    selectedItems,
    objectSelectedOne,
    lastSelectedItem,
    isSelecting,
    isLoading,
    hoveredItemIndex,
    previousScrollTop,
    selectionStartIndex,
    selectionEndIndex,
    isMobile,
    isLongPress,
    multiSelectMode,

    // Selection functions
    getFileIndex,
    isItemSelected,
    isItemSelectedOne,
    selectAllItems,
    handleClearSelected,
    handleShiftClick,
    handleCtrlClick,

    // Event handlers
    clickHandler,
    doubleClickHandler,
    rightClickHandler,
    handleCheckboxClick,
    mouseEnterHandler,
    mouseLeaveHandler,
    handleScroll,
    keydownHandler,

    // Selection drag functions
    startSelection,
    updateSelection,
    stopSelection,

    // Mobile touch handlers
    touchStartHandler,
    touchEndHandler,

    // View-specific functions and properties
    ...viewSpecificFunctions.value,
  };
};
