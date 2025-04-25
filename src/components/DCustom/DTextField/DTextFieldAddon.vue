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
    rules?: ((value: string) => boolean | string)[];
    modelValue?: string;
    counter?: number | boolean;
    validateOn?: 'input' | 'blur';
  }

  const props = withDefaults(defineProps<TextFieldType>(), {
    variant: 'outlined',
    addonWith: '80px',
    modelValue: '',
    validateOn: 'input',
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
        return 'd-input--filled';
      case 'underlined':
        return 'd-input--underlined';
      case 'plain':
        return 'd-input--plain';
      case 'solo':
        return 'd-input--solo';
      case 'solo-inverted':
        return 'd-input--solo-inverted';
      case 'solo-filled':
        return 'd-input--solo-filled';
      default:
        return 'd-input--outlined';
    }
  });
  // Validation logic
  const inputValue = ref(props.modelValue);
  const errorMessage = ref<string | null>(null);
  const isFocused = ref(false);

  const validate = (value: string) => {
    errorMessage.value = null;
    if (props.rules) {
      for (const rule of props.rules) {
        const result = rule(value);
        if (typeof result === 'string') {
          errorMessage.value = result;
          break; // Stop at first error, Vuetify style
        }
      }
    }
  };

  // Validate on input or blur based on validateOn prop
  watch(inputValue, (newValue) => {
    emit('update:modelValue', newValue);
    if (props.validateOn === 'input' || isFocused.value) {
      validate(newValue);
    }
  });

  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue !== inputValue.value) {
        inputValue.value = newValue;
        if (props.validateOn === 'input' || isFocused.value) {
          validate(newValue);
        }
      }
    },
  );

  // Handle blur validation
  const onBlur = () => {
    isFocused.value = false;
    validate(inputValue.value);
  };

  // Counter logic
  const counterText = computed(() => {
    if (!props.counter) return '';
    const length = inputValue.value.length;
    return typeof props.counter === 'number' ? `${length}/${props.counter}` : `${length}`;
  });

  // Compute error state
  const hasError = computed(() => !!errorMessage.value);
</script>

<template>
  <div class="d-input-addon">
    <template v-if="addonBeforeValue">
      <div :style="`width: ${addonWith ? addonWith : addonBeforeWith}`" class="d-input-addon_left">
        <div class="d-input disabled" :class="variantClass">
          <input type="text" :value="addonBeforeValue" disabled />
        </div>
      </div>
    </template>
    <template v-if="$slots.addonBefore">
      <slot name="addonBefore" />
    </template>

    <div class="d-input-addon_center">
      <div class="d-input" :class="[variantClass, { 'd-input--error': hasError, 'd-input--focused': isFocused }]">
        <div v-if="$slots['prepend-inner']" class="d-input__prepend-inner">
          <slot name="prepend-inner" />
        </div>

        <div class="d-input__field-wrapper">
          <label
            v-if="$slots.label"
            class="d-input__label"
            :class="{ 'd-input__label--active': isFocused || inputValue }">
            <slot name="label" />
          </label>
          <input class="d-input__field" v-bind="$attrs" v-model="inputValue" @focus="isFocused = true" @blur="onBlur" />
        </div>

        <div v-if="$slots['append-inner']" class="d-input__append-inner">
          <slot name="append-inner" />
        </div>
      </div>
    </div>

    <template v-if="addonAfterValue">
      <div :style="`width: ${addonWith ? addonWith : addonAfterWith}`" class="d-input-addon_right">
        <div class="d-input disabled" :class="variantClass">
          <input type="text" :value="addonAfterValue" disabled />
        </div>
      </div>
    </template>
    <template v-if="$slots.addonAfter">
      <slot name="addonAfter" />
    </template>
  </div>

  <div v-if="hasError || counterText" class="d-input__details">
    <div v-if="hasError" class="d-input__error-message">
      {{ errorMessage }}
    </div>
    <div v-if="counterText" class="d-input__counter">
      {{ counterText }}
    </div>
  </div>
</template>

<style scoped>
  .d-input-addon {
    display: flex;
    align-items: stretch;
    width: 100%;
  }

  .d-input-addon_left,
  .d-input-addon_right,
  .d-input-addon_center {
    display: flex;
    align-items: center;
  }

  .d-input-addon_center {
    flex: 1;
  }

  .d-input {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 4px;
    font-family: inherit;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .d-input__field-wrapper {
    position: relative;
    flex: 1;
  }

  .d-input__field {
    width: 100%;
    border: none;
    background: none;
    padding: 8px 12px;
    font-size: inherit;
    font-family: inherit;
    outline: none;
  }

  .d-input__label {
    display: block;
    font-size: 12px;
    margin-bottom: 4px;
    color: #666;
    padding: 0 12px;
  }

  .d-input__prepend-inner,
  .d-input__append-inner {
    display: flex;
    align-items: center;
    padding: 0 8px;
  }

  /* Variant styles */
  .d-input--outlined {
    border: 1px solid #ddd;
  }

  .d-input--filled {
    background-color: #f5f5f5;
  }

  .d-input--underlined {
    border-bottom: 1px solid #ddd;
    border-radius: 0;
  }

  .d-input--plain {
    /* No styling */
  }

  .d-input--solo {
    box-shadow:
      0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12);
  }

  .d-input--solo-inverted {
    background-color: #424242;
    color: white;
  }

  .d-input--solo-filled {
    background-color: #f5f5f5;
    box-shadow:
      0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12);
  }

  /* Disabled style */
  .d-input.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .d-input.disabled input {
    color: #999;
  }

  .d-input__details {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
  }

  .d-input__error-message {
    color: #d32f2f;
  }

  .d-input__counter {
    color: rgba(0, 0, 0, 0.6);
  }

  /* Error styles */
  .d-input--error {
    border-color: #d32f2f !important;
  }

  .d-input--error .d-input__label {
    color: #d32f2f !important;
  }

  .d-input__field--error {
    color: #d32f2f;
  }

  .d-input--focused .d-input__label {
    color: #1976d2; /* Vuetify primary color */
  }
</style>
