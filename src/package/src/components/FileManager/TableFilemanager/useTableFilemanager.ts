import { IFileManager } from '@/interfaces/IFileManager';
import { debounce } from '@/utils/MyFunction';
import { breakPoint } from '@/utils/MyVariables';
import { useWindowSize } from '@vueuse/core';
import { computed, ComputedRef, ref, watch } from 'vue';

interface IEmitFunctions {
  loadMoreItem: () => void;
  doubleClick: (file: IFileManager) => void;
  clickRow: (file: IFileManager) => void;
  toglleContextMenu: (e: MouseEvent, bool: boolean) => void;
}

interface IProps {
  updateSelected: (data: IFileManager[]) => void;
  updateSelectedOne: (data: IFileManager) => void;
}

export const useTableFilemanager = (dataTable: ComputedRef<IFileManager[]>, emits: IEmitFunctions, props: IProps) => {
  const { width } = useWindowSize();

  // Refs
  const selectedItems = ref([] as IFileManager[]);
  const objectSelectedOne = ref({} as IFileManager);
  const previousScrollTop = ref(0);
  const isLoading = ref(false);
  const isSelecting = ref(false);
  const selectionStartIndex = ref<number | null>(null);
  const selectionEndIndex = ref<number | null>(null);
  const lastSelectedItem = ref<IFileManager | null>(null);
  const touchStartTimer = ref<number>(0);
  const touchStartPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTapTime = ref<number>(0);
  const hoveredRowIndex = ref<number | null>(null);
  const wrapperRef = ref<HTMLElement | null>(null);

  // For custom virtual scroller
  const rowHeight = ref(48); // Height of each row in pixels
  const startIndexVirtual = ref(0); // Start index for the visible items
  const endIndexVirtual = ref(0); // End index for the visible items
  const visibleItemCount = ref(0); // Number of items visible in the viewport
  const bufferSize = 3; // Number of items to keep in the buffer above and below the viewport
  const scrollTop = ref(0); // Current scroll position
  const totalHeightVirtual = computed(() => dataTable.value.length * rowHeight.value); // Total height of the list

  // Constants
  const DOUBLE_TAP_DELAY = 300; // Time threshold for double tap (ms)
  const SCROLL_THRESHOLD = 0.5; // Percentage of scroll before loading more (50%)
  const DEBOUNCE_DELAY = 100; // Debounce delay for scroll handling

  // Computed
  const isMobile = computed(() => width.value <= breakPoint.brSpLandscape);

  const heightTable = computed(() => {
    if (wrapperRef.value) {
      // Calculate the available height
      const selectedHeaderHeight = selectedItems.value.length > 0 ? 48 : 0;
      const tableHeaderHeight = 48;
      const wrapperHeight = wrapperRef.value.clientHeight || 0;
      const availableHeight = wrapperHeight - selectedHeaderHeight - tableHeaderHeight;
      return `${Math.max(100, availableHeight)}px`;
    }
    return '100%';
  });

  // Watches for selectedItems and objectSelectedOne
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

  const selectAllItems = () => {
    selectedItems.value = [...dataTable.value];
    return [...dataTable.value];
  };

  const handleClearSelected = () => {
    selectedItems.value = [] as IFileManager[];
    objectSelectedOne.value = {} as IFileManager;
  };

  // Get index of file in data array
  const getFileIndex = (file: IFileManager) => {
    return dataTable.value.findIndex((item) => item.key === file.key);
  };

  const isItemSelected = (file: IFileManager): boolean => {
    return selectedItems.value.some((selectedItem: IFileManager) => selectedItem.key === file.key);
  };

  const isItemSelectedOne = (file: IFileManager): boolean => {
    return objectSelectedOne.value?.key === file.key;
  };

  const mouseEnterHandler = (index: number) => {
    hoveredRowIndex.value = index;
  };

  const mouseLeaveHandler = () => {
    hoveredRowIndex.value = null;
  };

  const rowDoubleClickHandler = (event: MouseEvent | TouchEvent, file: IFileManager) => {
    // Skip if clicking checkbox in mobile view
    if (isMobile.value && (event.target as HTMLElement).closest('.v-checkbox')) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    emits.doubleClick(file);
  };

  const rowClickHandler = (event: MouseEvent | TouchEvent, file: IFileManager) => {
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
    emits.clickRow(file);
  };

  const rightClickHandler = (event: MouseEvent, file: IFileManager) => {
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

  const handleShiftClick = (file: IFileManager, lastSelectedItem: IFileManager) => {
    const startIndex = getFileIndex(lastSelectedItem);
    const endIndex = getFileIndex(file);
    if (startIndex !== -1 && endIndex !== -1) {
      const minIndex = Math.min(startIndex, endIndex);
      const maxIndex = Math.max(startIndex, endIndex);
      selectedItems.value = dataTable.value.slice(minIndex, maxIndex + 1);
      return selectedItems;
    }
    return [];
  };

  const handleCtrlClick = (file: IFileManager) => {
    const existingIndex = selectedItems.value.findIndex((item: IFileManager) => item.key === file.key);

    if (existingIndex !== -1) {
      // Remove item if already selected
      selectedItems.value = [...selectedItems.value];
      selectedItems.value.splice(existingIndex, 1);
    } else {
      // Add item to selection
      selectedItems.value = [...selectedItems.value, file];
    }
  };

  // Modified scroll handler for the custom virtual scroller
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
        emits.loadMoreItem();

        // Reset loading state after a delay
        setTimeout(() => {
          isLoading.value = false;
        }, 300);
      }
    }

    previousScrollTop.value = scrollTop;
  }, DEBOUNCE_DELAY);

  // Handle checkbox click
  const handleCheckboxClick = (event: Event, file: IFileManager) => {
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

  // Handle keyboard shortcuts
  const keydownHandler = async (event: KeyboardEvent) => {
    event.stopPropagation();

    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      // Ctrl/Cmd + A: Select all
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
    return selectedItems;
  };

  // Start multi-selection
  const startSelection = (event: MouseEvent, file: IFileManager) => {
    if (event.button !== 0) return; // Only handle left mouse button
    if (event.ctrlKey || event.metaKey || event.shiftKey) return; // Don't interfere with modifier keys

    event.preventDefault();
    isSelecting.value = true;
    selectionStartIndex.value = getFileIndex(file);
    selectionEndIndex.value = selectionStartIndex.value;
    selectedItems.value = [file];
    objectSelectedOne.value = file;
  };

  // Update multi-selection during mouse move
  const updateSelection = (event: MouseEvent, file: IFileManager) => {
    if (!isSelecting.value) return;

    selectionEndIndex.value = getFileIndex(file);

    if (selectionStartIndex.value !== null && selectionEndIndex.value !== null) {
      const minIndex = Math.min(selectionStartIndex.value, selectionEndIndex.value);
      const maxIndex = Math.max(selectionStartIndex.value, selectionEndIndex.value);
      selectedItems.value = dataTable.value.slice(minIndex, maxIndex + 1);
      props.updateSelected(dataTable.value.slice(minIndex, maxIndex + 1));
    }
  };

  // End multi-selection
  const stopSelection = () => {
    isSelecting.value = false;
  };

  // Touch events for mobile support
  const touchStartHandler = (event: TouchEvent) => {
    touchStartTimer.value = Date.now();
    if (event.touches.length > 0) {
      touchStartPosition.value = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
  };

  const touchEndHandler = (event: TouchEvent, item: IFileManager) => {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTimer.value;

    // Handle tap vs. swipe
    if (touchDuration < 500) {
      const currentTime = Date.now();
      const timeSinceLastTap = currentTime - lastTapTime.value;

      if (timeSinceLastTap < DOUBLE_TAP_DELAY && lastTapTime.value > 0) {
        // Double tap
        event.preventDefault();
        rowDoubleClickHandler(event, item);
        lastTapTime.value = 0;
      } else {
        // Single tap
        event.preventDefault();
        rowClickHandler(event, item);
        lastTapTime.value = currentTime;
      }
    }
  };

  return {
    // Refs
    selectedItems,
    objectSelectedOne,
    previousScrollTop,
    isLoading,
    endIndex: selectionEndIndex,
    startIndex: selectionStartIndex,
    isSelecting,
    lastSelectedItem,
    touchStartTimer,
    touchStartPosition,
    lastTapTime,
    hoveredRowIndex,
    wrapperRef,
    startIndexVirtual,
    endIndexVirtual,
    visibleItemCount,
    bufferSize,
    scrollTop,

    // Constants
    DOUBLE_TAP_DELAY,
    SCROLL_THRESHOLD,
    DEBOUNCE_DELAY,

    // Computed
    isMobile,
    heightTable,
    totalHeightVirtual,

    // Functions
    selectAllItems,
    getFileIndex,
    isItemSelected,
    isItemSelectedOne,
    rightClickHandler,
    handleShiftClick,
    handleCtrlClick,
    handleScroll,
    handleCheckboxClick,
    keydownHandler,
    startSelection,
    updateSelection,
    stopSelection,
    touchStartHandler,
    touchEndHandler,
    rowDoubleClickHandler,
    rowClickHandler,
    mouseEnterHandler,
    mouseLeaveHandler,
    handleClearSelected,
  };
};
