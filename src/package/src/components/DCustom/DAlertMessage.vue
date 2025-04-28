<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';

  defineOptions({
    inheritAttrs: false,
  });

  interface Iprops {
    text?: string;
    title?: string;
    type: 'success' | 'warning' | 'error' | 'info';
    btnClose?: boolean;
  }

  const props = withDefaults(defineProps<Iprops>(), {
    btnClose: true,
  });
  const emits = defineEmits(['close']);

  const title = computed(() => props?.title);
  const text = computed(() => props?.text);
  const type = computed(() => props?.type);
  const btnClose = computed(() => props?.btnClose);
  const prependIcon = computed(() => {
    let icon = '';
    switch (type.value) {
      case 'success':
        icon = 'check-circle-outline';
        break;
      case 'warning':
        icon = 'alert-outline';
        break;
      case 'error':
        icon = 'alert-circle-outline';
        break;
      case 'info':
        icon = 'information-outline';
        break;
    }
    return icon;
  });

  // Computed for alert color classes
  const alertClasses = computed(() => {
    const classes = ['c-alert-message'];

    switch (type.value) {
      case 'success':
        classes.push('c-alert--success');
        break;
      case 'warning':
        classes.push('c-alert--warning');
        break;
      case 'error':
        classes.push('c-alert--error');
        break;
      case 'info':
        classes.push('c-alert--info');
        break;
    }

    return classes;
  });
</script>

<template>
  <div v-bind="$attrs" :class="alertClasses" role="alert">
    <div class="c-alert__prepend">
      <span class="c-alert__icon" :class="MdiWebfont[prependIcon]"></span>
    </div>

    <div class="c-alert__content">
      <div v-if="title" class="c-alert__title">{{ title }}</div>
      <div v-if="text" class="c-alert__text">{{ text }}</div>
      <slot></slot>
    </div>

    <div v-if="btnClose" class="c-alert__close">
      <DBtnIcon :icon="MdiWebfont.close" @click="emits('close')" />
    </div>
  </div>
</template>

<style scoped>
  .c-alert-message {
    display: flex;
    position: relative;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 16px;
    border-left: 4px solid;
  }

  .c-alert__prepend {
    display: flex;
    align-items: flex-start;
    margin-right: 16px;
  }

  .c-alert__icon {
    font-size: 20px;
  }

  .c-alert__content {
    flex: 1;
  }

  .c-alert__title {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 16px;
  }

  .c-alert__text {
    font-size: 14px;
  }

  .c-alert__close {
    display: flex;
    align-items: flex-start;
    margin-left: 16px;
  }

  /* Type-specific styles */
  .c-alert--success {
    background-color: rgba(76, 175, 80, 0.1);
    border-left-color: #4caf50;
    color: #2e7d32;
  }

  .c-alert--success .c-alert__icon {
    color: #4caf50;
  }

  .c-alert--warning {
    background-color: rgba(255, 152, 0, 0.1);
    border-left-color: #ff9800;
    color: #e65100;
  }

  .c-alert--warning .c-alert__icon {
    color: #ff9800;
  }

  .c-alert--error {
    background-color: rgba(244, 67, 54, 0.1);
    border-left-color: #f44336;
    color: #c62828;
  }

  .c-alert--error .c-alert__icon {
    color: #f44336;
  }

  .c-alert--info {
    background-color: rgba(33, 150, 243, 0.1);
    border-left-color: #2196f3;
    color: #0d47a1;
  }

  .c-alert--info .c-alert__icon {
    color: #2196f3;
  }
</style>
