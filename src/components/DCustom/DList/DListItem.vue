<template>
  <div
    class="d-list-item"
    :class="{ 'd-list-item--selectable': selectable, 'd-list-item--active': active }"
    @click="emit('click')">
    <!-- Prepend slot -->
    <slot name="prepend"></slot>

    <!-- Default slot for main content -->
    <div class="d-list-item-content">
      <slot></slot>
    </div>

    <!-- Append slot -->
    <slot name="append"></slot>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps<{
    selectable?: boolean;
    active?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'click'): void;
  }>();
</script>

<style scoped lang="scss">
  $list-item-hover: rgba(0, 0, 0, 0.08);
  $list-item-active: rgba(0, 0, 0, 0.12);
  $primary-color: #1976d2;

  .d-list-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: $list-item-hover;
    }

    &--selectable {
      &.d-list-item--active {
        background: $list-item-active;
        color: $primary-color;
      }
    }

    .d-list-item-content {
      flex: 1;
      display: flex;
      align-items: center;
    }
  }
</style>
