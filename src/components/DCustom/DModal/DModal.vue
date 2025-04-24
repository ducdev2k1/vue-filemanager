<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';

  // Define props with TypeScript
  const props = defineProps<{
    modelValue: boolean;
    title?: string;
    maxWidth?: number | string;
    persistent?: boolean;
    fullscreen?: boolean;
  }>();

  // Define emits with TypeScript
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'confirm'): void;
  }>();
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="d-modal-wrapper">
      <!-- Overlay -->
      <div
        class="d-modal-overlay"
        :class="{ 'd-modal-overlay--persistent': persistent }"
        @click="!persistent && emit('update:modelValue', false)"></div>

      <!-- Dialog content -->
      <div
        class="d-modal-container"
        :class="{ 'd-modal-container--fullscreen': fullscreen }"
        :style="{ maxWidth: maxWidth ? (typeof maxWidth === 'string' ? maxWidth : `${maxWidth}px`) : 'none' }"
        role="dialog">
        <div class="d-modal-content">
          <!-- Header slot -->
          <slot name="header">
            <div v-if="title" class="d-modal-header">
              <h2>{{ title }}</h2>
            </div>
          </slot>

          <!-- Default content slot -->
          <slot></slot>

          <!-- Actions slot -->
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>
