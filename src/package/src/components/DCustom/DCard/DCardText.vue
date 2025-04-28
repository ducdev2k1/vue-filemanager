<template>
  <div class="d-card-text" :class="props.class" :style="props.style">
    <slot />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    class?: string | string[] | object;
    style?: string;
  }>();
</script>

<style scoped lang="scss">
  .d-card-text {
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.87);
    padding: 16px;

    .theme-dark & {
      color: rgba(255, 255, 255, 0.7);
    }
  }
</style>
