<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue';

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

  // Custom tooltip implementation
  const tooltipEl = ref<HTMLDivElement | null>(null);
  const buttonEl = ref<HTMLButtonElement | null>(null);
  const showTooltip = ref(false);

  const handleMouseEnter = () => {
    if (props.tooltip) {
      showTooltip.value = true;
    }
  };

  const handleMouseLeave = () => {
    showTooltip.value = false;
  };

  onMounted(() => {
    if (buttonEl.value && props.tooltip) {
      buttonEl.value.addEventListener('mouseenter', handleMouseEnter);
      buttonEl.value.addEventListener('mouseleave', handleMouseLeave);
    }
  });

  onBeforeUnmount(() => {
    if (buttonEl.value) {
      buttonEl.value.removeEventListener('mouseenter', handleMouseEnter);
      buttonEl.value.removeEventListener('mouseleave', handleMouseLeave);
    }
  });
</script>

<template>
  <button ref="buttonEl" class="d-btn-icon" v-bind="$attrs" type="button">
    <i class="d-btn-icon__icon" :class="icon" />

    <!-- Custom tooltip implementation -->
    <div v-if="tooltip && showTooltip" ref="tooltipEl" class="d-tooltip">
      {{ tooltip }}
    </div>
  </button>
</template>

<style scoped>
  /* Tooltip styles */
  .d-tooltip {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(97, 97, 97, 0.9);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 999;
    pointer-events: none;
  }

  .d-tooltip::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
    border-width: 5px 5px 0 5px;
    border-color: rgba(97, 97, 97, 0.9) transparent transparent transparent;
  }
</style>
