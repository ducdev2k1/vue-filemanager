<template>
  <div
    class="d-card"
    :class="{
      'd-card--flat': flat,
      'd-card--border': border,
      'd-card--disabled': disabled,
      'd-card--hover': hover && !disabled,
      'd-card--loading': loading,
      [`d-card--elevation-${elevation}`]: elevation !== undefined,
      [`theme-${theme}`]: theme,
    }"
    :style="cardStyles"
    :aria-disabled="disabled ? 'true' : undefined">
    <!-- Loading overlay -->
    <div v-if="loading" class="d-card-loading-overlay">
      <div class="d-card-loading-spinner"></div>
    </div>

    <!-- Prepend slot -->
    <slot name="prepend"></slot>

    <!-- Default slot (includes sub-components) -->
    <slot></slot>

    <!-- Append slot -->
    <slot name="append"></slot>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    flat?: boolean;
    border?: boolean;
    elevation?: number | string;
    disabled?: boolean;
    hover?: boolean;
    loading?: boolean;
    theme?: string;
    class?: string | string[] | object;
    style?: string | object;
  }>();

  const style = computed(() => props.style || '');
  const cardStyles = computed(() => ({
    ...(typeof style.value === 'object' ? style.value : {}),
    pointerEvents: props.disabled ? ('none' as any['pointerEvents']) : undefined,
  }));
</script>


