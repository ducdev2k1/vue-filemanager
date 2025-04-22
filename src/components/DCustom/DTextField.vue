<script setup lang="ts">
  import { computed, ref, watch } from 'vue';

  interface TextFieldProps {
    modelValue?: string | number;
    label?: string;
    placeholder?: string;
    hint?: string;
    type?: string;
    variant?: 'outlined' | 'filled' | 'solo' | 'underlined' | 'plain';
    disabled?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    persistent?: boolean;
    required?: boolean;
    error?: boolean;
    errorMessages?: string | string[];
    successMessages?: string | string[];
    hideDetails?: boolean;
    density?: 'default' | 'comfortable' | 'compact';
    autofocus?: boolean;
    maxlength?: number;
    counter?: boolean | number;
    prefix?: string;
    suffix?: string;
    id?: string;
  }

  const props = withDefaults(defineProps<TextFieldProps>(), {
    modelValue: '',
    type: 'text',
    variant: 'outlined',
    disabled: false,
    readonly: false,
    clearable: false,
    persistent: false,
    required: false,
    error: false,
    hideDetails: false,
    density: 'default',
    autofocus: false,
    counter: false,
  });

  const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'click', 'click:clear']);

  const inputValue = ref(props.modelValue);
  const focused = ref(false);
  const inputRef = ref<HTMLInputElement | null>(null);

  const inputId = computed(() => props.id || `input-${Math.random().toString(36).substring(2, 9)}`);

  // Update local value when prop changes
  watch(
    () => props.modelValue,
    (val) => {
      inputValue.value = val;
    },
  );

  // Update prop when local value changes
  watch(inputValue, (val) => {
    emit('update:modelValue', val);
  });

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    inputValue.value = target.value;
  };

  const onFocus = (event: FocusEvent) => {
    focused.value = true;
    emit('focus', event);
  };

  const onBlur = (event: FocusEvent) => {
    focused.value = false;
    emit('blur', event);
  };

  const onClick = (event: MouseEvent) => {
    emit('click', event);
  };

  const onClear = (event: MouseEvent) => {
    inputValue.value = '';
    emit('click:clear', event);
    if (inputRef.value) {
      inputRef.value.focus();
    }
  };

  // Normalized error and success messages
  const normalizedErrorMessages = computed(() => {
    if (!props.errorMessages) return [];
    return Array.isArray(props.errorMessages) ? props.errorMessages : [props.errorMessages];
  });

  const normalizedSuccessMessages = computed(() => {
    if (!props.successMessages) return [];
    return Array.isArray(props.successMessages) ? props.successMessages : [props.successMessages];
  });

  // Computed classes for styling
  const inputClasses = computed(() => {
    return [
      `c-text-field--${props.variant}`,
      `c-text-field--${props.density}`,
      {
        'c-text-field--focused': focused.value,
        'c-text-field--error': props.error || normalizedErrorMessages.value.length > 0,
        'c-text-field--disabled': props.disabled,
        'c-text-field--readonly': props.readonly,
        'c-text-field--has-label': !!props.label,
        'c-text-field--clearable': props.clearable,
        'c-text-field--has-value': !!inputValue.value,
      },
    ];
  });

  const showLabel = computed(() => {
    return props.label && (!!inputValue.value || focused.value || props.persistent);
  });

  const hasCounter = computed(() => {
    return !!props.counter && !!props.maxlength;
  });

  const characterCount = computed(() => {
    return String(inputValue.value).length;
  });

  const hasMessages = computed(() => {
    return (
      !props.hideDetails &&
      (normalizedErrorMessages.value.length > 0 ||
        normalizedSuccessMessages.value.length > 0 ||
        !!props.hint ||
        hasCounter.value)
    );
  });
</script>

<template>
  <div class="c-text-field-wrapper">
    <div :class="['c-text-field', ...inputClasses]" @click="onClick">
      <!-- Prefix -->
      <div v-if="prefix" class="c-text-field__prefix">
        {{ prefix }}
      </div>

      <div class="c-text-field__input-wrap">
        <!-- Floating label for outlined variant -->
        <label
          v-if="variant === 'outlined' && showLabel"
          :for="inputId"
          class="c-text-field__label c-text-field__label--outlined">
          {{ label }}
          <span v-if="required" class="c-text-field__label-required">*</span>
        </label>

        <!-- Label for other variants -->
        <label v-if="variant !== 'outlined' && showLabel" :for="inputId" class="c-text-field__label">
          {{ label }}
          <span v-if="required" class="c-text-field__label-required">*</span>
        </label>

        <input
          ref="inputRef"
          :id="inputId"
          :type="type"
          :value="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :maxlength="maxlength"
          :autofocus="autofocus"
          class="c-text-field__input"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur" />

        <!-- Clear button -->
        <div v-if="clearable && inputValue && !disabled && !readonly" class="c-text-field__clear" @click.stop="onClear">
          <svg viewBox="0 0 24 24" class="c-text-field__clear-icon">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </div>
      </div>

      <!-- Suffix -->
      <div v-if="suffix" class="c-text-field__suffix">
        {{ suffix }}
      </div>

      <!-- Background and outline elements -->
      <div v-if="variant === 'filled'" class="c-text-field__background"></div>
      <fieldset v-if="variant === 'outlined'" aria-hidden="true" class="c-text-field__outline">
        <legend class="c-text-field__outline-legend">
          <span v-if="label && (!!inputValue || focused)">{{ label }}</span>
        </legend>
      </fieldset>
    </div>

    <!-- Details (errors, hints, counter) -->
    <div v-if="hasMessages" class="c-text-field__details">
      <div v-if="hint && !error && normalizedErrorMessages.length === 0" class="c-text-field__hint">
        {{ hint }}
      </div>

      <div v-if="normalizedErrorMessages.length > 0" class="c-text-field__error-messages">
        <div v-for="(message, i) in normalizedErrorMessages" :key="`error-${i}`" class="c-text-field__error-message">
          {{ message }}
        </div>
      </div>

      <div v-if="normalizedSuccessMessages.length > 0" class="c-text-field__success-messages">
        <div
          v-for="(message, i) in normalizedSuccessMessages"
          :key="`success-${i}`"
          class="c-text-field__success-message">
          {{ message }}
        </div>
      </div>

      <div v-if="hasCounter" class="c-text-field__counter">{{ characterCount }} / {{ maxlength }}</div>
    </div>
  </div>
</template>

<style lang="scss">
  // Variables
  $font-size: 14px;
  $font-size-small: 12px;
  $primary-color: #1976d2;
  $error-color: #f44336;
  $success-color: #4caf50;
  $disabled-color: rgba(0, 0, 0, 0.38);
  $hover-color: rgba(0, 0, 0, 0.05);
  $border-color: rgba(0, 0, 0, 0.23);
  $background-color: #f5f5f5;
  $transition-duration: 0.2s;
</style>
