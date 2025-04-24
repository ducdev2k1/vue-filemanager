<template>
  <div class="d-card-title" :class="props.class" :style="props.style">
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
  .d-card-title {
    font-size: 1.25rem;
    font-weight: 500;
    padding: 16px;
    margin-bottom: 8px;

    .theme-dark & {
      color: #fff;
    }
    @apply flex items-center justify-between gap-2;
  }
</style>
