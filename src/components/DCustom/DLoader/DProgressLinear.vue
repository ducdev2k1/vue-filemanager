<script setup lang="ts">
  import { computed } from 'vue';

  interface Props {
    value?: number;
    color?: string;
    backgroundColor?: string;
    height?: number | string;
    indeterminate?: boolean;
    rounded?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    value: 0,
    color: 'primary',
    backgroundColor: 'grey lighten-2',
    height: 2,
    indeterminate: false,
    rounded: false,
  });

  // Validate value prop
  if (props.value < 0 || props.value > 100) {
    console.warn('DProgressLinear: value must be between 0 and 100');
  }

  const containerStyles = computed(
    () =>
      ({
        height: `${props.height}px`,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: props.rounded ? `${Number(props.height) / 2}px` : '0',
      }) as Record<string, string>,
  );

  const backgroundStyles = computed(
    () =>
      ({
        backgroundColor: props.backgroundColor,
        height: '100%',
        width: '100%',
        position: 'absolute',
      }) as Record<string, string>,
  );

  const barStyles = computed(
    () =>
      ({
        width: props.indeterminate ? '0' : `${props.value}%`,
        backgroundColor: props.color,
        height: '100%',
        transition: 'width 0.3s ease',
        position: 'absolute',
      }) as Record<string, string>,
  );

  const indeterminateStyles = computed(
    () =>
      ({
        backgroundColor: props.color,
        height: '100%',
        position: 'absolute',
        animation: 'indeterminate 2s infinite linear',
      }) as Record<string, string>,
  );
</script>
<template>
  <div class="d-progress-linear" :style="containerStyles">
    <div class="d-progress-linear__background" :style="backgroundStyles"></div>
    <div class="d-progress-linear__bar" :style="barStyles"></div>
    <div v-if="indeterminate" class="d-progress-linear__indeterminate" :style="indeterminateStyles"></div>
  </div>
</template>
