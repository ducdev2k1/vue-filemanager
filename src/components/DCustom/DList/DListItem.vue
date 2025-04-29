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

<template>
  <div
    class="d-list-item"
    :class="{ 'd-list-item--selectable': selectable, 'd-list-item--active': active }"
    @click="emit('click')">
    <slot name="prepend">
      <d-icon v-if="prependIcon" :icon="prependIcon" />
    </slot>

    <div class="d-list-item-content">
      <slot v-if="$slots['title']" name="title" />
      <span v-else-if="title" class="d-list-item_title">{{ title }}</span>
      <slot></slot>
    </div>

    <slot name="append">
      <d-icon v-if="appendIcon" :icon="appendIcon" />
    </slot>
  </div>
</template>

