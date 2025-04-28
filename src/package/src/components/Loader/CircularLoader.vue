<script setup lang="ts">
  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    color?: string;
    text?: string;
    strokeWidth?: number;
    width?: string;
  }

  const props = defineProps<IProps>();
  const text = computed(() => props.text);

  const style = computed(() => {
    return {
      width: props.width ?? '4rem',
      height: props.width ?? '4rem',
      borderTop: `${props.strokeWidth ?? 8}px solid #fff`,
      borderLeft: `${props.strokeWidth ?? 8}px solid #fff`,
      borderRight: `${props.strokeWidth ?? 8}px solid #ff00`,
    };
  });
</script>
<template>
  <div class="d-circular-loader">
    <div class="d-circular-loader__loader" :style="style"></div>
    <p v-if="text && text.length > 0">{{ text }}...</p>
  </div>
</template>
