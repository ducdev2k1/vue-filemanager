<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue';

  // Props
  const props = defineProps<{
    items: any[];
    itemWidth: number;
    itemHeight: number;
    columns: number;
  }>();

  // Refs
  const container = ref<HTMLElement | null>(null);
  const scrollTop = ref(0);
  const scrollLeft = ref(0);
  const virtualGridRef = ref<HTMLElement | null>(null);

  // Grid calculations
  const totalWidth = computed(() => {
    return virtualGridRef.value?.clientWidth;
  });

  const totalHeight = computed(() => {
    const rows = Math.ceil(props.items.length / props.columns);
    return rows * props.itemHeight;
  });

  // Visible items calculation
  const visibleItems = computed(() => {
    if (!virtualGridRef.value) return [];

    const containerHeight = virtualGridRef.value.clientHeight;
    const containerWidth = virtualGridRef.value.clientWidth;

    const startRow = Math.floor(scrollTop.value / props.itemHeight);
    const endRow = Math.ceil((scrollTop.value + containerHeight) / props.itemHeight);
    const startCol = Math.floor(scrollLeft.value / props.itemWidth);
    const endCol = Math.ceil((scrollLeft.value + containerWidth) / props.itemWidth);

    const result = [];
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const index = row * props.columns + col;
        if (index < props.items.length) {
          result.push({
            ...props.items[index],
            x: col * props.itemWidth,
            y: row * props.itemHeight,
          });
        }
      }
    }
    return result;
  });

  // Scroll handler
  const handleScroll = () => {
    if (virtualGridRef.value) {
      scrollTop.value = virtualGridRef.value.scrollTop;
      scrollLeft.value = virtualGridRef.value.scrollLeft;
    }
  };

  // Handle resize
  const handleResize = () => {
    if (virtualGridRef.value) {
      scrollTop.value = virtualGridRef.value.scrollTop;
      scrollLeft.value = virtualGridRef.value.scrollLeft;
    }
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
    console.log('visibleItems.value :>> ', visibleItems.value);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
</script>

<template>
  <div class="d-virtual-grid" ref="virtualGridRef" @scroll="handleScroll">
    <div class="d-virtual-grid-content" :style="{ height: totalHeight + 'px', width: totalWidth + 'px' }">
      <div class="d-virtual-grid-item">
        <template v-for="(item, index) in visibleItems" :key="index">
          <slot name="item" v-bind="{ item: item.data, index: item.index }" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .d-virtual-grid {
    @apply relative w-full h-full;
    &-content {
      @apply relative;
    }
    &-item {
      position: absolute;
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
  }
</style>
