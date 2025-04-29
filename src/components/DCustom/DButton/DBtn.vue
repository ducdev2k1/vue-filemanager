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
 
</style>
