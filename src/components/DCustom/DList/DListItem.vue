<template>
  <div
    class="d-list-item"
    :class="{ 'd-list-item--selectable': selectable, 'd-list-item--active': active }"
    @click="emit('click')">
    <slot v-if="$slots['prepend']" name="prepend"></slot>
    <d-icon v-else :icon="prependIcon" />

    <div class="d-list-item-content">
      <slot v-if="$slots['title']" name="title" />
      <span v-else-if="title" class="d-list-item_title">{{ title }}</span>
      <slot></slot>
    </div>

    <slot v-if="$slots['append']" name="append"></slot>
    <d-icon v-else :icon="prependIcon" />
  </div>
</template>

<script setup lang="ts">
  import { defineEmits, defineProps } from 'vue';

  const props = defineProps<{
    selectable?: boolean;
    active?: boolean;
    title?: string;
    prependIcon?: string;
    appendIcon?: string;
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
    gap: 0.25rem;

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
