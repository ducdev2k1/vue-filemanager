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

  const emit = defineEmits(['update:modelValue']);

  const addonBeforeValue = computed(() => props?.addonBeforeValue);
  const addonAfterValue = computed(() => props?.addonAfterValue);
  const addonAfterWith = computed(() => props?.addonAfterWith);
  const addonBeforeWith = computed(() => props?.addonBeforeWith);
  const addonWith = computed(() => props?.addonWith);

  // Get variant class
  const variantClass = computed(() => {
    switch (props.variant) {
      case 'filled':
        return 'c-input--filled';
      case 'underlined':
        return 'c-input--underlined';
      case 'plain':
        return 'c-input--plain';
      case 'solo':
        return 'c-input--solo';
      case 'solo-inverted':
        return 'c-input--solo-inverted';
      case 'solo-filled':
        return 'c-input--solo-filled';
      default:
        return 'c-input--outlined';
    }
  });
</script>

<template>
  <div class="c-input-addon">
    <template v-if="addonBeforeValue">
      <div :style="`width: ${addonWith ? addonWith : addonBeforeWith}`" class="c-input-addon_left">
        <div class="c-input disabled" :class="variantClass">
          <input type="text" :value="addonBeforeValue" disabled />
        </div>
      </div>
    </template>
    <template v-if="$slots.addonBefore">
      <slot name="addonBefore" />
    </template>

    <div class="c-input-addon_center">
      <div class="c-input" :class="variantClass">
        <div v-if="$slots['prepend-inner']" class="c-input__prepend-inner">
          <slot name="prepend-inner" />
        </div>

        <div class="c-input__field-wrapper">
          <label v-if="$slots.label" class="c-input__label">
            <slot name="label" />
          </label>
          <input v-bind="$attrs" class="c-input__field" />
        </div>

        <div v-if="$slots['append-inner']" class="c-input__append-inner">
          <slot name="append-inner" />
        </div>
      </div>
    </div>

    <template v-if="addonAfterValue">
      <div :style="`width: ${addonWith ? addonWith : addonAfterWith}`" class="c-input-addon_right">
        <div class="c-input disabled" :class="variantClass">
          <input type="text" :value="addonAfterValue" disabled />
        </div>
      </div>
    </template>
    <template v-if="$slots.addonAfter">
      <slot name="addonAfter" />
    </template>
  </div>
</template>

<style scoped>
  .c-input-addon {
    display: flex;
    align-items: stretch;
    width: 100%;
  }

  .c-input-addon_left,
  .c-input-addon_right,
  .c-input-addon_center {
    display: flex;
    align-items: center;
  }

  .c-input-addon_center {
    flex: 1;
  }

  .c-input {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 4px;
    font-family: inherit;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .c-input__field-wrapper {
    position: relative;
    flex: 1;
  }

  .c-input__field {
    width: 100%;
    border: none;
    background: none;
    padding: 8px 12px;
    font-size: inherit;
    font-family: inherit;
    outline: none;
  }

  .c-input__label {
    display: block;
    font-size: 12px;
    margin-bottom: 4px;
    color: #666;
    padding: 0 12px;
  }

  .c-input__prepend-inner,
  .c-input__append-inner {
    display: flex;
    align-items: center;
    padding: 0 8px;
  }

  /* Variant styles */
  .c-input--outlined {
    border: 1px solid #ddd;
  }

  .c-input--filled {
    background-color: #f5f5f5;
  }

  .c-input--underlined {
    border-bottom: 1px solid #ddd;
    border-radius: 0;
  }

  .c-input--plain {
    /* No styling */
  }

  .c-input--solo {
    box-shadow:
      0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12);
  }

  .c-input--solo-inverted {
    background-color: #424242;
    color: white;
  }

  .c-input--solo-filled {
    background-color: #f5f5f5;
    box-shadow:
      0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12);
  }

  /* Disabled style */
  .c-input.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .c-input.disabled input {
    color: #999;
  }
</style>
