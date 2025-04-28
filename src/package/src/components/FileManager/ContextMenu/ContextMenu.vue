<script setup lang="ts">
  import { useClickOutside } from '@/composables/clickOutside';
  import { IActionFM } from '@/interfaces';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    items: IActionFM[];
    positionContextMenu: { x: number; y: number };
    onClickItem?: (menuItem: IActionFM) => void;
  }

  const emit = defineEmits(['close']);

  const props = defineProps<IProps>();

  // Refs
  const innerWidth = ref(window.innerWidth);
  const innerHeight = ref(window.innerHeight);
  const contextMenuDesktop = ref<HTMLElement | null>(null);
  // Computed
  const listMenu = computed(() => props.items);
  const positionContextMenu = computed(() => props.positionContextMenu);
  const widthContextMenuDesktop = computed(() => {
    if (contextMenuDesktop.value) {
      return contextMenuDesktop.value.offsetWidth + 50;
    }
    return 350;
  });
  const heightContextMenuDesktop = computed(() => {
    if (contextMenuDesktop.value) {
      return contextMenuDesktop.value.offsetHeight + 50;
    }
    return 0;
  });

  const handleClickItem = (menuItem: IActionFM) => {
    if (props.onClickItem) {
      props.onClickItem(menuItem);
    }
    // close context menu
    emit('close');
  };
  useClickOutside(contextMenuDesktop, () => emit('close'));
</script>

<template>
  <div
    v-bind="$attrs"
    class="c-context-menu fixed z-50"
    ref="contextMenuDesktop"
    :style="{
      top: Math.min(positionContextMenu?.y, innerHeight - heightContextMenuDesktop) + 'px',
      left: Math.min(positionContextMenu?.x, innerWidth - widthContextMenuDesktop) + 'px',
    }">
    <slot v-if="$slots['context-menu-item']" name="context-menu-item" />
    <template v-else>
      <ContextMenuItem :list-menus="listMenu" :on-click-item="handleClickItem" />
    </template>
  </div>
</template>
