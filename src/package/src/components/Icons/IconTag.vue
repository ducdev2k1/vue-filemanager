<script setup lang="ts">
  import { MdiWebfont } from './mdi-font-icons';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    color: string;
    icon?: string;
  }

  const props = withDefaults(defineProps<IProps>(), {
    color: '',
    icon: 'tag',
  });

  const color = computed(() => props.color);
  const icon = computed(() => props.icon);
</script>

<template>
  <v-icon
    class="c-icon-tag"
    v-bind="$attrs"
    :style="{ background: color, '-webkit-background-clip': 'text', color: 'transparent' }">
    {{ MdiWebfont[icon] }}
  </v-icon>
</template>
