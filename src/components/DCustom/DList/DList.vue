<template>
  <div class="d-list" :class="{ 'd-list--dense': dense, 'd-list--nav': nav }">
    <!-- Header slot -->
    <slot name="header"></slot>

    <!-- Default slot for list items -->
    <slot></slot>

    <!-- Footer slot -->
    <slot name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';

  const props = defineProps<{
    dense?: boolean;
    nav?: boolean;
    selectable?: boolean;
  }>();
</script>

<style scoped lang="scss">
  $list-bg: #fff;
  $list-item-hover: rgba(0, 0, 0, 0.08);
  $list-item-active: rgba(0, 0, 0, 0.12);
  $primary-color: #1976d2;

  .d-list {
    background: $list-bg;
    border-radius: 4px;
    overflow: hidden;

    &--dense {
      .d-list-item {
        padding: 8px 16px;
        font-size: 0.875rem;
      }
    }

    &--nav {
      .d-list-item {
        padding: 8px 12px;
        border-radius: 4px;
        margin: 4px 8px;
        &:hover {
          background: $list-item-hover;
        }
      }
    }
  }
</style>
