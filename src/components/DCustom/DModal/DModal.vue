<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { defineEmits, defineProps } from 'vue';

  // Define props with TypeScript
  const props = defineProps<{
    modelValue: boolean;
    title?: string;
    maxWidth?: number | string;
    persistent?: boolean;
    fullscreen?: boolean;
  }>();

  // Define emits with TypeScript
  const emit = defineEmits(['update:modelValue', 'close', 'submit']);
  // State to trigger scale animation
  const isScaled = ref(false);
  const isInitialOpen = ref(false);

  // Handle overlay click for persistent mode
  const handleOverlayClick = () => {
    if (props.persistent) {
      isScaled.value = true;
      setTimeout(() => {
        isScaled.value = false;
      }, 200); // Duration matches CSS animation
    } else {
      emit('close');
    }
  };

  // Trigger initial animation on mount
  onMounted(() => {
    if (props.modelValue) {
      isInitialOpen.value = true;
      setTimeout(() => {
        isInitialOpen.value = false; // Remove initial animation after it runs
      }, 300); // Match scaleIn duration
    }
  });
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="d-modal">
      <!-- Overlay -->
      <div
        class="d-modal-overlay"
        :class="{ 'd-modal-overlay--persistent': persistent }"
        @click.stop="handleOverlayClick"></div>

      <!-- Dialog content -->
      <div
        class="d-modal-container"
        :class="{
          'd-modal-container--fullscreen': fullscreen,
          'd-modal-container--scaled': isScaled,
          'd-modal-container--initial': isInitialOpen,
        }"
        :style="{ maxWidth: maxWidth ? (typeof maxWidth === 'string' ? maxWidth : `${maxWidth}px`) : 'none' }"
        role="dialog">
        <div class="d-modal-inner">
          <!-- Header slot -->
          <div class="d-modal-header">
            <slot name="header">
              <h3 class="d-modal-header--text">{{ title }}</h3>
              <d-btn-icon :icon="MdiWebfont['close']" />
            </slot>
          </div>

          <!-- Default content slot -->
          <div class="d-modal-content" :class="{ 'd-modal-content--fullscreen': fullscreen }">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
