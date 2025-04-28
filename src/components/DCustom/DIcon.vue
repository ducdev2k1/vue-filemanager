<script setup lang="ts">
  defineOptions({
    inheritAttrs: false,
  });

  const props = defineProps<{
    icon?: string;
    size?: number | string;
    color?: string;
    disabled?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'click'): void;
  }>();
</script>

<template>
  <i
    v-bind="$attrs"
    class="d-icon mdi"
    :class="[{ 'd-icon--disabled': disabled }, icon]"
    @click="emit('click')"
    :style="{ height: `${size}px`, color, fontSize: size ? `${size}px` : undefined }" />
</template>

<style scoped lang="scss">
  $d-icon-hover: rgba(0, 0, 0, 0.08);

  .d-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;

    &:hover {
      background: $d-icon-hover;
      border-radius: 50%;
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .material-icons {
      font-family: 'Material Icons', sans-serif;
      font-size: inherit;
      line-height: 1;
    }
  }
</style>
