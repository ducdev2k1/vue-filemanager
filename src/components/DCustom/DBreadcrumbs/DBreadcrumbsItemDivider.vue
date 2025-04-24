<template>
  <li class="d-breadcrumbs-divider">
    <!-- Divider slot -->
    <slot>
      <DIcon v-if="icon" :icon="icon" :size="size" color="#333" />
      <span v-else>{{ text }}</span>
    </slot>
  </li>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';
  import DIcon from './DIcon.vue'; // Adjust path as needed

  const props = defineProps<{
    text?: string;
    icon?: string;
    size?: number | string;
  }>();
</script>

<style scoped lang="scss">
  $d-breadcrumbs-text: #333;

  .d-breadcrumbs-divider {
    color: $d-breadcrumbs-text;
    margin: 0 8px;
    font-size: 1rem;
    display: flex;
    align-items: center;
  }
</style>
