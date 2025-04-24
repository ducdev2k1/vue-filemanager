<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { t } from '@/plugins/i18n';
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
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'confirm'): void;
  }>();
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="d-modal">
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
              <strong class="d-modal-header--text">{{ title }}</strong>
              <d-btn-icon :icon="MdiWebfont['close']" />
            </div>
          </slot>

          <!-- Default content slot -->
          <slot></slot>

          <!-- Actions slot -->
          <slot name="actions">
            <div v-if="!$slots['actions']" class="d-modal-footer">
              <d-btn
                class="d-modal-footer--btn d-btn-cancel"
                :icon="MdiWebfont.close"
                :disabled="!modelValue"
                :title="t('locale.cancel')" />
              <d-btn
                class="d-modal-footer--btn d-btn-primary"
                :icon="MdiWebfont['send-variant']"
                :disabled="!modelValue"
                :title="t('locale.ok')" />
            </div>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>
