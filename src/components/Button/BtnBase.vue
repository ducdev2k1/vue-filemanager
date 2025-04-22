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
</script>

<template>
  <v-btn
    class="c-btn"
    variant="text"
    :class="{
      'gap-1': title?.length > 0,
    }"
    v-bind="$attrs"
    :disabled="loading || disabled">
    {{ title }}
    <template #prepend>
      <template v-if="!$slots.prepend && icon">
        <v-icon v-if="!loading" :class="iconClass">{{ icon }}</v-icon>
        <v-progress-circular v-if="loading" indeterminate color="primary" width="2" :class="loadingClass" />
      </template>
      <template v-else>
        <slot v-if="$slots.prepend && !loading" name="prepend" />
        <v-progress-circular v-if="loading" indeterminate color="primary" width="2" :class="loadingClass" />
      </template>
    </template>
    <template v-if="$slots.title">
      <slot name="title" />
    </template>
    <slot />
    <template v-if="$slots.append">
      <slot name="append" />
    </template>
    <v-tooltip v-if="tooltip?.length > 0" :location="locationTooltip" :text="tooltip" activator="parent" />
  </v-btn>
</template>
