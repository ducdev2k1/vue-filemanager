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
