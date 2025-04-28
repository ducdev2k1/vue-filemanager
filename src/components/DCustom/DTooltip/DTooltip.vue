<template>
  <div class="d-tooltip-wrapper" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <slot />
    <span v-if="isVisible" ref="tooltipRef" class="d-tooltip">
      {{ content }}
    </span>
  </div>
</template>

<script setup lang="ts">
  // Định nghĩa props với TypeScript
  interface Props {
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    delay?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    position: 'top',
    delay: 0,
  });

  // Trạng thái hiển thị tooltip
  const isVisible = ref(false);
  const tooltipRef = ref<HTMLElement | null>(null);
  let timeout: ReturnType<typeof setTimeout> | null = null;

  // Cập nhật vị trí của tooltip
  const updatePosition = () => {
    if (!tooltipRef.value || !isVisible.value) return;
    const parent = tooltipRef.value.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const tooltipRect = tooltipRef.value.getBoundingClientRect();

    tooltipRef.value.style.position = 'fixed';

    switch (props.position) {
      case 'top':
        tooltipRef.value.style.top = `${rect.top - tooltipRect.height - 5}px`;
        tooltipRef.value.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
        break;
      case 'bottom':
        tooltipRef.value.style.top = `${rect.bottom + 5}px`;
        tooltipRef.value.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
        break;
      case 'left':
        tooltipRef.value.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
        tooltipRef.value.style.left = `${rect.left - tooltipRect.width - 5}px`;
        break;
      case 'right':
        tooltipRef.value.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
        tooltipRef.value.style.left = `${rect.right + 5}px`;
        break;
      case 'center':
        tooltipRef.value.style.top = `${rect.top - tooltipRect.height + 5}px`;
        tooltipRef.value.style.left = `${(rect.right + rect.left) / 2}px`;
    }
  };

  // Hiển thị tooltip
  const showTooltip = () => {
    console.log('hover :>> ');
    if (props.delay) {
      timeout = setTimeout(() => {
        isVisible.value = true;
        setTimeout(updatePosition, 0);
      }, props.delay);
    } else {
      isVisible.value = true;
      setTimeout(updatePosition, 0);
    }
  };

  // Ẩn tooltip
  const hideTooltip = () => {
    if (timeout) clearTimeout(timeout);
    isVisible.value = false;
  };

  // Thêm sự kiện scroll và resize
  onMounted(() => {
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
  });

  // Dọn dẹp sự kiện
  onUnmounted(() => {
    window.removeEventListener('scroll', updatePosition);
    window.removeEventListener('resize', updatePosition);
    if (timeout) clearTimeout(timeout);
  });
</script>
