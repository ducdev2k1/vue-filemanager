<script setup lang="ts">
  import { computed } from 'vue';

  interface CheckboxProps {
    modelValue?: boolean | string[] | any;
    label?: string;
    value?: any;
    color?: string;
    disabled?: boolean;
    error?: boolean;
    errorMessages?: string | string[];
    hideDetails?: boolean;
    id?: string;
    indeterminate?: boolean;
    falseValue?: any;
    trueValue?: any;
    readonly?: boolean;
    required?: boolean;
    density?: 'default' | 'comfortable' | 'compact';
  }

  const props = withDefaults(defineProps<CheckboxProps>(), {
    modelValue: false,
    color: 'primary',
    disabled: false,
    error: false,
    hideDetails: false,
    falseValue: false,
    trueValue: true,
    readonly: false,
    required: false,
    density: 'default',
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  const checkboxId = computed(() => props.id || `checkbox-${Math.random().toString(36).substring(2, 9)}`);

  const isChecked = computed(() => {
    if (Array.isArray(props.modelValue)) {
      return props.modelValue.includes(props.value);
    }
    return props.modelValue === props.trueValue;
  });

  const isIndeterminate = computed(() => props.indeterminate === true);

  const densityClass = computed(() => {
    switch (props.density) {
      case 'comfortable':
        return 'c-checkbox--comfortable';
      case 'compact':
        return 'c-checkbox--compact';
      default:
        return 'c-checkbox--default';
    }
  });

  const colorClass = computed(() => {
    if (props.error) return 'c-checkbox--error';
    return `c-checkbox--${props.color}`;
  });

  const handleChange = (event: Event) => {
    if (props.readonly || props.disabled) return;

    const target = event.target as HTMLInputElement;
    let newValue;

    if (Array.isArray(props.modelValue)) {
      newValue = [...props.modelValue];

      if (target.checked) {
        if (!newValue.includes(props.value)) {
          newValue.push(props.value);
        }
      } else {
        const index = newValue.indexOf(props.value);
        if (index !== -1) {
          newValue.splice(index, 1);
        }
      }
    } else {
      newValue = target.checked ? props.trueValue : props.falseValue;
    }

    emit('update:modelValue', newValue);
    emit('change', newValue);
  };

  // Convert error messages to array
  const normalizedErrorMessages = computed(() => {
    if (!props.errorMessages) return [];
    return Array.isArray(props.errorMessages) ? props.errorMessages : [props.errorMessages];
  });
</script>

<template>
  <div :class="['c-checkbox-wrapper', densityClass, { 'c-checkbox--disabled': disabled }]">
    <div class="c-checkbox-container">
      <input
        :id="checkboxId"
        type="checkbox"
        class="c-checkbox-input"
        :checked="isChecked"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :value="value"
        :aria-checked="isIndeterminate ? 'mixed' : isChecked"
        @change="handleChange" />
      <div
        :class="[
          'c-checkbox',
          colorClass,
          { 'c-checkbox--checked': isChecked, 'c-checkbox--indeterminate': isIndeterminate },
        ]">
        <!-- Checkmark icon -->
        <svg v-if="isChecked && !isIndeterminate" class="c-checkbox-icon" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
        <!-- Indeterminate icon -->
        <svg v-if="isIndeterminate" class="c-checkbox-icon" viewBox="0 0 24 24">
          <path d="M19 13H5v-2h14v2z" />
        </svg>
      </div>
      <label v-if="label" :for="checkboxId" class="c-checkbox-label">{{ label }}</label>
    </div>

    <div v-if="!hideDetails && normalizedErrorMessages.length > 0" class="c-checkbox-details c-checkbox-details--error">
      <div v-for="(message, i) in normalizedErrorMessages" :key="i" class="c-checkbox-error-message">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .c-checkbox-wrapper {
    display: flex;
    flex-direction: column;

    &--disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }

  .c-checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
  }

  .c-checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;

    &:focus + .c-checkbox {
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
    }
  }

  .c-checkbox {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: 2px solid #9e9e9e;
    border-radius: 2px;
    transition: all 0.2s ease;
    cursor: pointer;

    &--checked {
      border-color: transparent;
      background-color: currentColor;
    }

    &--indeterminate {
      border-color: transparent;
      background-color: currentColor;
    }

    &--disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }

  .c-checkbox-icon {
    width: 16px;
    height: 16px;
    fill: white;
  }

  .c-checkbox-label {
    margin-left: 8px;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
  }

  // Colors
  .c-checkbox {
    &--primary {
      color: #1976d2;
    }

    &--secondary {
      color: #26a69a;
    }

    &--success {
      color: #4caf50;
    }

    &--error {
      color: #f44336;
    }

    &--warning {
      color: #ff9800;
    }

    &--info {
      color: #2196f3;
    }
  }

  // Density
  .c-checkbox {
    &--default {
      width: 18px;
      height: 18px;
    }

    &--comfortable {
      width: 16px;
      height: 16px;
    }

    &--compact {
      width: 14px;
      height: 14px;
    }
  }

  // Error messages
  .c-checkbox-details {
    padding-left: 26px;
    margin-top: 4px;
    font-size: 12px;

    &--error {
      color: #f44336;
    }
  }

  .c-checkbox-error-message {
    line-height: 1.2;
  }
</style>
