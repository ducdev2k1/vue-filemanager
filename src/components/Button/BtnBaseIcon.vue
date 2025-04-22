<script setup lang="ts">
  interface IProps {
    icon: string;
    iconClass?: string;
    loadingClass?: string;
    tooltip?: string;
  }

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(defineProps<IProps>(), {
    iconClass: 'w-4 h-4',
    loadingClass: 'w-4 h-4',
    tooltip: '',
  });
  const icon = computed(() => props.icon as string);
</script>

<template>
  <v-fab v-if="tooltip" class="c-btn-icon" :icon="icon" variant="text" v-tooltip="tooltip" v-bind="$attrs" />
  <v-fab v-else class="c-btn-icon" :icon="icon" variant="text" v-bind="$attrs" />
</template>
