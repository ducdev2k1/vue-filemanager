<script setup lang="ts">
  // Props

  interface IProps {
    items: any[];
    itemHeight?: number | string;
    height?: number | string;
    bench?: number;
  }

  const props = withDefaults(defineProps<IProps>(), {
    items: () => [],
    itemHeight: 0,
    height: 400,
    bench: 0,
  });

  // Emits
  const emits = defineEmits(['scroll', 'scrollend']);

  // Refs
  const scrollContainer = ref<HTMLElement | null>(null);
  const scrollTop = ref(0);
  const isScrollEnd = ref(false);

  // Computed properties
  const containerHeight = computed(() => {
    return typeof props.height === 'string' ? parseInt(props.height) : props.height;
  });

  const itemHeight = computed(() => {
    return typeof props.itemHeight === 'string' ? parseInt(props.itemHeight) : props.itemHeight;
  });

  const totalHeight = computed(() => {
    if (itemHeight.value) {
      return props.items.length * itemHeight.value;
    }
    return props.items.length * 50; // Giả định 50px nếu không có itemHeight
  });

  const startIndex = computed(() => {
    if (itemHeight.value) {
      return Math.max(0, Math.floor(scrollTop.value / itemHeight.value) - props.bench);
    }
    return 0;
  });

  const visibleCount = computed(() => {
    if (itemHeight.value) {
      return Math.ceil(containerHeight.value / itemHeight.value) + 2 * props.bench;
    }
    return Math.ceil(containerHeight.value / 50) + 2 * props.bench;
  });

  const visibleItems = computed(() => {
    const endIndex = Math.min(props.items.length, startIndex.value + visibleCount.value);
    return props.items.slice(startIndex.value, endIndex);
  });

  const offset = computed(() => {
    if (itemHeight.value) {
      return startIndex.value * itemHeight.value;
    }
    return 0;
  });

  // Methods
  const handleScroll = () => {
    if (scrollContainer.value) {
      scrollTop.value = scrollContainer.value.scrollTop;
      emits('scroll');

      // Kiểm tra scrollend
      const scrollHeight = scrollContainer.value.scrollHeight;
      const clientHeight = scrollContainer.value.clientHeight;
      if (scrollTop.value + clientHeight >= scrollHeight - 10) {
        // Buffer 10px
        if (!isScrollEnd.value) {
          isScrollEnd.value = true;
          emits('scrollend');
        }
      } else {
        isScrollEnd.value = false;
      }
    }
  };

  // Khởi tạo và dọn dẹp
  onMounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', handleScroll);
    }
  });

  onUnmounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.removeEventListener('scroll', handleScroll);
    }
  });
</script>

<template>
  <div class="d-virtual-scroll" ref="scrollContainer" @scroll="handleScroll">
    <div class="d-virtual-scroll__spacer" :style="{ height: totalHeight + 'px' }">
      <div class="d-virtual-scroll__content" :style="{ transform: `translateY(${offset}px)` }">
        <div v-for="(group, index) in visibleItems" :key="index" class="d-virtual-scroll__item">
          <!-- :style="{ height: itemHeight ? itemHeight + 'px' : 'auto' }" -->
          <slot :item="group" :index="startIndex + index"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .d-virtual-scroll {
    height: v-bind('height + "px"');
  }
</style>
