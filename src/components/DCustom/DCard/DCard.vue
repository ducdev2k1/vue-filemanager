<script setup lang="ts">
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

<template>
  <div
    class="d-card"
    :class="{
      'd-card--flat': flat,
      'd-card--border': border,
      'd-card--disabled': disabled,
      'd-card--hover': hover && !disabled,
      [`d-card--elevation-${elevation}`]: elevation !== undefined,
      [`theme-${theme}`]: theme,
    }"
    :style="cardStyles"
    :aria-disabled="disabled ? 'true' : undefined">
    <template v-if="loading">
      <div class="d-card--loading">
        <DProgressLinear indeterminate />
      </div>
    </template>

    <slot name="prepend"></slot>

    <slot></slot>

    <slot name="append"></slot>
  </div>
</template>
