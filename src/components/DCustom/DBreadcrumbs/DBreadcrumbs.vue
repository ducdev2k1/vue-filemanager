<template>
  <nav class="d-breadcrumbs" :class="{ 'd-breadcrumbs--large': large }" aria-label="breadcrumb">
    <ol class="d-breadcrumbs-list">
      <!-- Prepend slot -->
      <slot name="prepend"></slot>

      <!-- Default slot for items and dividers -->
      <slot></slot>

      <!-- Append slot -->
      <slot name="append"></slot>
    </ol>
  </nav>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';

  const props = defineProps<{
    large?: boolean;
  }>();
</script>

<style scoped lang="scss">
  $d-breadcrumbs-text: #333;

  .d-breadcrumbs {
    display: inline-flex;
    align-items: center;
    font-size: 0.875rem;
    color: $d-breadcrumbs-text;

    &--large {
      font-size: 1rem;
    }

    .d-breadcrumbs-list {
      display: flex;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }
</style>
