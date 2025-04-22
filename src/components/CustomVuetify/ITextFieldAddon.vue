<script lang="ts" setup>
  defineOptions({
    inheritAttrs: false,
  });

  interface TextFieldType {
    variant?: 'outlined' | 'filled' | 'underlined' | 'plain' | 'solo' | 'solo-inverted' | 'solo-filled';
    addonBeforeValue?: string;
    addonAfterValue?: string;
    addonBeforeWith?: string;
    addonAfterWith?: string;
    addonWith?: string;
  }

  const props = withDefaults(defineProps<TextFieldType>(), {
    variant: 'outlined',
    addonWith: '80px',
  });

  const addonBeforeValue = computed(() => props?.addonBeforeValue);
  const addonAfterValue = computed(() => props?.addonAfterValue);
  const addonAfterWith = computed(() => props?.addonAfterWith);
  const addonBeforeWith = computed(() => props?.addonBeforeWith);
  const addonWith = computed(() => props?.addonWith);
</script>

<template>
  <div class="c-input-addon">
    <template v-if="addonBeforeValue">
      <div :style="`width: ${addonWith ? addonWith : addonBeforeWith}`" class="c-input-addon_left">
        <v-text-field v-model="addonBeforeValue" :variant="variant" hide-details="auto" disabled />
      </div>
    </template>
    <template v-if="$slots.addonBefore">
      <slot name="addonBefore" v-if="$slots.addonBefore" />
    </template>
    <v-text-field v-bind="$attrs" :variant="variant" class="c-input-addon_center" hide-details="auto">
      <template v-if="$slots.label" #label>
        <slot name="label" />
      </template>
      <template v-if="$slots['append-inner']" #append-inner>
        <slot name="append-inner" />
      </template>
      <template v-if="$slots['prepend-inner']" #prepend-inner>
        <slot name="prepend-inner" />
      </template>
    </v-text-field>
    <template v-if="addonAfterValue">
      <div :style="`width: ${addonWith ? addonWith : addonAfterWith}`" class="c-input-addon_right">
        <v-text-field v-model="addonAfterValue" :variant="variant" hide-details="auto" disabled />
      </div>
    </template>
    <template v-if="$slots.addonAfter">
      <slot name="addonAfter" />
    </template>
  </div>
</template>
