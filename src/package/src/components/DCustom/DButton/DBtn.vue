<script setup lang="ts">
  import { EnumLocation } from '@/utils/MyEnum';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    title?: string | any;
    loading?: boolean;
    icon?: string;
    iconClass?: string;
    loadingClass?: string;
    tooltip?: string;
    locationTooltip?: EnumLocation;
    disabled?: boolean;
  }

  const props = withDefaults(defineProps<IProps>(), {
    title: '',
    loading: false,
    iconClass: 'w-4 h-4',
    loadingClass: 'w-4 h-4',
    locationTooltip: EnumLocation.top,
    disabled: false,
  });

  const title = computed(() => props?.title as string);
  const loading = computed(() => props?.loading as boolean);
  const icon = computed(() => props?.icon as any);
  const iconClass = computed(() => props?.iconClass as string);
  const loadingClass = computed(() => props?.loadingClass as string);
  const tooltip = computed(() => props?.tooltip as string);
  const locationTooltip = computed(() => props?.locationTooltip as EnumLocation);
  const disabled = computed(() => props?.disabled as boolean);

  // Custom tooltip implementation
  const tooltipEl = ref<HTMLDivElement | null>(null);
  const buttonEl = ref<HTMLButtonElement | null>(null);
  const showTooltip = ref(false);

  // Calculate tooltip position based on location
  const getTooltipPosition = () => {
    if (!buttonEl.value || !tooltipEl.value) return {};

    const buttonRect = buttonEl.value.getBoundingClientRect();
    const tooltipRect = tooltipEl.value.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (locationTooltip.value) {
      case EnumLocation.top:
        top = -tooltipRect.height - 8;
        left = (buttonRect.width - tooltipRect.width) / 2;
        break;
      case EnumLocation.bottom:
        top = buttonRect.height + 8;
        left = (buttonRect.width - tooltipRect.width) / 2;
        break;
      case EnumLocation.left:
        top = (buttonRect.height - tooltipRect.height) / 2;
        left = -tooltipRect.width - 8;
        break;
      case EnumLocation.right:
        top = (buttonRect.height - tooltipRect.height) / 2;
        left = buttonRect.width + 8;
        break;
    }

    return { top: `${top}px`, left: `${left}px` };
  };

  const handleMouseEnter = () => {
    if (tooltip.value?.length > 0) {
      showTooltip.value = true;
    }
  };

  const handleMouseLeave = () => {
    showTooltip.value = false;
  };

  onMounted(() => {
    if (buttonEl.value && tooltip.value) {
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
  <button
    ref="buttonEl"
    class="d-btn"
    :class="{
      'd-btn--with-text': title?.length > 0,
      'd-btn--disabled': loading || disabled,
      'gap-1': title?.length > 0,
    }"
    v-bind="$attrs"
    :disabled="loading || disabled">
    <!-- Prepend slot or icon -->
    <span class="d-btn__prepend">
      <template v-if="!$slots.prepend && icon">
        <i v-if="!loading" class="d-btn__icon" :class="icon" />
        <span v-if="loading" :class="['d-btn__loading', loadingClass]">
          <svg class="c-spinner" viewBox="0 0 50 50">
            <circle class="c-spinner__path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
        </span>
      </template>
      <template v-else>
        <slot v-if="$slots.prepend && !loading" name="prepend" />
        <span v-if="loading" :class="['d-btn__loading', loadingClass]">
          <svg class="c-spinner" viewBox="0 0 50 50">
            <circle class="c-spinner__path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
        </span>
      </template>
    </span>

    <!-- Title slot or text -->
    <span v-if="title" class="d-btn__title">{{ title }}</span>
    <slot v-if="$slots.title" name="title" />

    <!-- Default slot -->
    <slot />

    <!-- Append slot -->
    <span v-if="$slots.append" class="d-btn__append">
      <slot name="append" />
    </span>

    <!-- Custom tooltip implementation -->
    <div
      v-if="tooltip?.length > 0 && showTooltip"
      ref="tooltipEl"
      class="d-tooltip"
      :class="`d-tooltip--${locationTooltip}`"
      :style="getTooltipPosition()">
      {{ tooltip }}
    </div>
  </button>
</template>

<style scoped>
  .d-btn__prepend,
  .d-btn__append {
    display: inline-flex;
    align-items: center;
  }

  .d-btn__loading {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* Spinner animation */
  .c-spinner {
    animation: spinner-rotate 2s linear infinite;
    width: 100%;
    height: 100%;
  }

  .c-spinner__path {
    stroke: currentColor;
    stroke-linecap: round;
    animation: spinner-dash 1.5s ease-in-out infinite;
  }

  @keyframes spinner-rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spinner-dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }

  /* Tooltip styles */
  .d-tooltip {
    position: absolute;
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
  }

  .d-tooltip--top::after {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px 5px 0 5px;
    border-color: rgba(97, 97, 97, 0.9) transparent transparent transparent;
  }

  .d-tooltip--bottom::after {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent rgba(97, 97, 97, 0.9) transparent;
  }

  .d-tooltip--left::after {
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    border-width: 5px 0 5px 5px;
    border-color: transparent transparent transparent rgba(97, 97, 97, 0.9);
  }

  .d-tooltip--right::after {
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    border-width: 5px 5px 5px 0;
    border-color: transparent rgba(97, 97, 97, 0.9) transparent transparent;
  }
</style>
