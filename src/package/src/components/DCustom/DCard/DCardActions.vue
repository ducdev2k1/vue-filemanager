<template>
  <div class="d-card-actions" :class="props.class" :style="props.style">
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
  .d-card-actions {
    padding: 8px 16px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;

    .theme-dark & {
      color: #fff;
    }
  }
</style>
