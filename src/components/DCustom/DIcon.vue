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
  <span
    v-bind="$attrs"
    class="d-icon"
    :class="{ 'd-icon--disabled': disabled }"
    :style="{ color, fontSize: props.size ? `${props.size}px` : undefined }"
    @click="emit('click')">
    <i class="mdi" :class="icon" />
  </span>
</template>

<template>
  <i
    v-bind="$attrs"
    class="d-icon mdi"
    :class="[{ 'd-icon--disabled': disabled }, icon]"
    @click="emit('click')"
    :style="{ height: `${size}px`, color, fontSize: size ? `${size}px` : undefined }" />
</template>
