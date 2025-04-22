<script setup lang="ts">
  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    color?: string;
    text?: string;
  }

  const props = defineProps<IProps>();
  const text = computed(() => props.text);
</script>
<template>
  <div class="flex-center flex-col">
    <v-progress-circular v-bind="$attrs" indeterminate />
    <p v-if="text && text.length > 0">{{ text }}...</p>
  </div>
</template>
