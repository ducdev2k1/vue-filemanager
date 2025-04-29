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
    autofocus?: boolean;
    autoSelect?: boolean;
  }

  const props = withDefaults(defineProps<TextFieldType>(), {
    variant: 'outlined',
    addonWith: '80px',
    modelValue: '',
    validateOn: 'input',
    autofocus: false,
    autoSelect: false,
  });

  const emit = defineEmits(['update:modelValue']);

  const addonBeforeValue = computed(() => props.addonBeforeValue);
  const addonAfterValue = computed(() => props.addonAfterValue);
  const addonAfterWith = computed(() => props.addonAfterWith);
  const addonBeforeWith = computed(() => props.addonBeforeWith);
  const addonWith = computed(() => props.addonWith);
  const autofocus = computed(() => props.autofocus);
  const autoSelect = computed(() => props.autoSelect);

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
  const inputWrapper = ref<HTMLElement | null>(null);
  const inputElement = ref<HTMLInputElement | null>(null);

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

  onMounted(() => {
    // Use setTimeout to ensure the DOM is fully rendered before accessing the input element
    setTimeout(() => {
      if (inputElement.value) {
        if (autoSelect.value) {
          inputElement.value.select();
        } else if (autofocus.value) {
          inputElement.value.focus();
        }
      }
    }, 100);
  });

  defineExpose({
    inputWrapper,
    inputElement,
  });
</script>

<template>
  <div class="d-input-addon" ref="inputWrapper">
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
          <input
            ref="inputElement"
            class="d-input__field"
            v-bind="$attrs"
            v-model="inputValue"
            @focus="isFocused = true"
            @blur="onBlur" />
        </div>

        <div v-if="$slots['append-inner']" class="d-input__append-inner">
          <slot name="append-inner" />
        </div>
      </div>
    </div>

    <!-- <template v-if="addonAfterValue">
      <div :style="`width: ${addonWith ? addonWith : addonAfterWith}`" class="d-input-addon_right">
        <div class="d-input disabled" :class="variantClass">
          <input type="text" :value="addonAfterValue" disabled />
        </div>
      </div>
    </template> -->
    <slot name="addonAfter">
      <div
        v-if="!$slots.addonAfter && addonAfterValue"
        :style="`width: ${addonWith ? addonWith : addonAfterWith}`"
        class="d-input-addon_right">
        <div class="d-input disabled" :class="variantClass">
          <input class="d-input__field" type="text" :value="addonAfterValue" disabled />
        </div>
      </div>
    </slot>
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
