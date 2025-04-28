<script setup lang="ts">
  defineOptions({
    inheritAttrs: false,
  });

  const props = defineProps<{
    icon?: string;
    size?: number | string;
    color?: string;
    disabled?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'click'): void;
  }>();
</script>

<template>
  <i
    v-bind="$attrs"
    class="d-icon mdi"
    :class="[{ 'd-icon--disabled': disabled }, icon]"
    @click="emit('click')"
    :style="{ height: `${size}px`, color, fontSize: size ? `${size}px` : undefined }" />
</template>
