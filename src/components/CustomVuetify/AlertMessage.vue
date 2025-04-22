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
</script>

<template>
  <v-alert v-bind="$attrs" class="c-alert-message" :text="text" :title="title" :type="type">
    <slot />
    <template #prepend>
      <v-icon class="w-5 h-5" :class="MdiWebfont[prependIcon]" />
    </template>
    <template #close v-if="btnClose">
      <BtnBaseIcon :icon="MdiWebfont.close" @click="emits('close')" />
    </template>
  </v-alert>
</template>
