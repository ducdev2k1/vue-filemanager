import { fmActionRestoreTrash } from '@/components/v1/FileManager/partial/ConfigActionFileManager';
import { getThumbnailIcon } from '@/components/v1/FileManager/partial/HelperFunctionFileManager';
import { IFileManager } from '@/interfaces/IFileManager';
import { FileManagerActionStore } from '@/stores/user/file-manager-action-store';
import { FileManagerStore } from '@/stores/user/file-manager-store';
import { myRoute } from '@/utils/my-route';
import { breakPoint } from '@/utils/my-variables';
import { useWindowSize } from '@vueuse/core';

interface IEmitFunctions {
  load: () => void;
  doubleClick: (file: IFileManager) => void;
  [key: string]: (...args: any[]) => void;
}

export const useGridItem = (listData: ComputedRef<IFileManager[]>, emits: IEmitFunctions) => {
  const route = useRoute();
  const fileManagerStore = FileManagerStore();
  const fileManagerActionStore = FileManagerActionStore();
  const { width } = useWindowSize();

  // Grid layout related refs
  const gridRef = ref<HTMLElement | null>(null);
  const offsetWidth = ref(0);
  const offsetHeight = ref('57vh');
  const CARD_WIDTH = computed(() => (width.value > breakPoint.brTablet ? 304 : 150));
  const resizeObserver = ref<ResizeObserver | null>(null);

  // Selection related refs
  const lastSelectedItem = ref<IFileManager | null>(null);
  const isSelecting = ref(false);
  const startIndex = ref<number | null>(null);
  const endIndex = ref<number | null>(null);

  // Long press variables (only mobile)
  const longPressTimer = ref<number | null>(null);
  const isLongPress = ref(false);
  const multiSelectMode = ref(false);
  const previousScrollTop = ref(0);

  // Computed
  const isHomePage = computed(() => myRoute.home === route.path);
  const selectedItems = computed({
    get: () => fileManagerStore.selectedItems,
    set: (value: IFileManager[]) => fileManagerStore.actionSetSelectedItems(value),
  });
  const objectSelectedOne = computed({
    get: () => fileManagerStore.objectSelectedOne,
    set: (value: IFileManager) => fileManagerStore.actionSetObjectSelectedOne(value),
  });
  const listItemDelete = computed(() => fileManagerStore.listItemDelete);

  // Update grid dimensions
  const updateOffsetWidth = () => {
    if (gridRef.value) {
      offsetWidth.value = gridRef.value.offsetWidth;
      offsetHeight.value = (gridRef.value.offsetHeight - 100) as unknown as string;
    }
  };

  // Create grouped data for virtual scroll
  const groupedListData = computed(() => {
    if (!gridRef.value) return [];

    const itemsPerRow = Math.max(1, Math.floor(offsetWidth.value / CARD_WIDTH.value));
    const grouped: IFileManager[][] = [];

    if (listData.value) {
      for (let i = 0; i < listData.value.length; i += itemsPerRow) {
        grouped.push(listData.value.slice(i, i + itemsPerRow));
      }
    }

    return grouped;
  });

  // Hàm lấy index của file trong listData
  const getFileIndex = (file: IFileManager) => {
    return listData.value.findIndex((item) => item.key === file.key);
  };

  const handleSelectAll = () => {
    selectedItems.value = [...listData.value];
  };

  // Hàm xử lý khi click chọn item
  const toggleItem = (event: MouseEvent | TouchEvent, file: IFileManager) => {
    if (event instanceof MouseEvent && event.shiftKey && lastSelectedItem.value) {
      // Shift + Click: Chọn khoảng giữa lastSelectedItem và file hiện tại
      const startIndex = getFileIndex(lastSelectedItem.value);
      const endIndex = getFileIndex(file);
      if (startIndex !== -1 && endIndex !== -1) {
        const minIndex = Math.min(startIndex, endIndex);
        const maxIndex = Math.max(startIndex, endIndex);
        selectedItems.value = listData.value.slice(minIndex, maxIndex + 1);
      }
    } else if (event instanceof MouseEvent && (event.ctrlKey || event.metaKey)) {
      // Ctrl + Click: Thêm hoặc xóa item
      const index = selectedItems.value.findIndex((item) => item === file);
      if (index > -1) {
        selectedItems.value.splice(index, 1);
      } else {
        selectedItems.value.push(file);
      }
      lastSelectedItem.value = file; // Cập nhật item cuối cùng được chọn
    } else {
      // Click thường: Chọn một item duy nhất
      selectedItems.value = [file];
      lastSelectedItem.value = file; // Cập nhật item cuối cùng được chọn
    }
    objectSelectedOne.value = file;
  };

  const handleDBClick = (event: MouseEvent | TouchEvent, file: IFileManager) => {
    // Xử lý sự kiện doubleClick
    if (emits.doubleClick) {
      emits.doubleClick(file);
    }
  };

  const handleLoadMoreItem = () => {
    // Gọi emit load
    emits.load();
  };

  const rightClickHandler = (event: any, file: IFileManager) => {
    event.stopPropagation();
    if (isHomePage.value) return;
    const position = { x: event.clientX, y: event.clientY };
    // open context menu
    fileManagerActionStore.openContextMenu(position);
    // update item
    objectSelectedOne.value = file;
    // update selected items
    const findIndex = selectedItems.value.some((value) => value.key === file.key);
    if (!findIndex) {
      selectedItems.value = [file];
    }
  };

  // Handle keydown event for selecting all items with Ctrl + A
  const keydownHandler = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      handleSelectAll();
    } else if (event.key === 'Delete' && selectedItems.value.length > 0) {
      fileManagerActionStore.toggleModalMoveTrashFile();
    } else if (event.ctrlKey && event.key && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      fmActionRestoreTrash(listItemDelete.value);
    }
  };

  // B: Xử lý sự kiện Long press and Tap trên mobile
  const handleTouchStart = (file: IFileManager) => {
    longPressTimer.value = setTimeout(() => {
      isLongPress.value = true;
      multiSelectMode.value = true;
      if (!selectedItems.value.includes(file)) {
        selectedItems.value = [...selectedItems.value, file];
      }
      objectSelectedOne.value = file;
      console.log('Chế độ chọn nhiều đã được kích hoạt! :>> ');
    }, 1000); // 1 giây
  };

  const handleTouchEnd = (file: IFileManager) => {
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value);
    }
    if (!isLongPress.value && !multiSelectMode.value) {
      // Xử lý click thường (nếu không phải tap hoặc long press)
      toggleItem(new TouchEvent('touchend'), file);
      handleDBClick(new TouchEvent('touchend'), file);
    } else if (multiSelectMode.value) {
      // Xử lý chọn nhiều trong multi-select mode
      const index = selectedItems.value.findIndex((item) => item.key === file.key);
      if (index > -1) {
        selectedItems.value.splice(index, 1);
      } else {
        selectedItems.value.push(file);
      }
      objectSelectedOne.value = file;
    }

    isLongPress.value = false;
    longPressTimer.value = null;
  };

  // Lifecycle methods for component setup
  const setupGridItem = () => {
    if (gridRef.value) {
      updateOffsetWidth();
      resizeObserver.value = new ResizeObserver(updateOffsetWidth);
      resizeObserver.value.observe(gridRef.value);
    }
  };

  const cleanupGridItem = () => {
    resizeObserver.value?.disconnect();
  };

  const startSelection = (event: MouseEvent, file: IFileManager) => {
    if (event.button !== 0) return; // Only handle left mouse button
    if (event.ctrlKey || event.metaKey || event.shiftKey) return; // Don't interfere with modifier keys

    event.preventDefault();
    isSelecting.value = true;
    startIndex.value = getFileIndex(file);
    endIndex.value = startIndex.value;
    selectedItems.value = [file];
  };

  const updateSelection = (event: MouseEvent, file: IFileManager) => {
    if (!isSelecting.value) return;

    endIndex.value = getFileIndex(file);

    if (startIndex.value !== null && endIndex.value !== null) {
      const minIndex = Math.min(startIndex.value, endIndex.value);
      const maxIndex = Math.max(startIndex.value, endIndex.value);
      selectedItems.value = listData.value.slice(minIndex, maxIndex + 1);
    }
  };

  const stopSelection = () => {
    isSelecting.value = false;
  };

  const createHandleScroll = (event: any) => {
    const { scrollTop } = event.target as HTMLElement;
    const html = document.querySelector('html');

    // Handle scroll direction UI class
    if (scrollTop > previousScrollTop.value) {
      html?.classList.add('scrolling-down');
    } else if (scrollTop < previousScrollTop.value) {
      html?.classList.remove('scrolling-down');
    }
    previousScrollTop.value = scrollTop;
  };

  return {
    // Refs
    gridRef,
    offsetWidth,
    offsetHeight,
    CARD_WIDTH,
    isLongPress,
    multiSelectMode,

    // Computed
    groupedListData,
    selectedItems,
    objectSelectedOne,
    listItemDelete,
    isHomePage,

    // Methods
    handleTouchStart,
    getFileIndex,
    handleSelectAll,
    rightClickHandler,
    keydownHandler,
    handleTouchEnd,
    toggleItem,
    handleDBClick,
    updateOffsetWidth,
    setupGridItem,
    cleanupGridItem,
    handleLoadMoreItem,
    startSelection,
    updateSelection,
    stopSelection,
    createHandleScroll,
    getThumbnailIcon,
  };
};
