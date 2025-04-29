<script setup lang="ts">
  import { useClickOutside } from '@/composables/clickOutside';

  interface Option {
    value: string;
    label: string;
  }

  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits(['update:modelValue']);

  const props = defineProps<{
    options?: Option[];
    modelValue: string;
    title?: string;
    icon?: string;
    openOnClick?: boolean;
  }>();

  // State
  const isOpen = ref(false);
  const isActive = ref(false);
  const selectedOption = ref((props.options && props.options.find((opt) => opt.value === props.modelValue)) || null);
  const dropdownRef = ref<HTMLElement | null>(null);

  // Computed
  const title = computed(() => props?.title as string);
  const icon = computed(() => props?.icon as string);

  function selectOption(option: Option) {
    selectedOption.value = option;
    emit('update:modelValue', option.value);
    isOpen.value = false;
  }

  function toggleDropdown() {
    isOpen.value = !isOpen.value;
    if (props.openOnClick) {
      isActive.value = !isActive.value;
    }
  }

  useClickOutside(dropdownRef, () => {
    isActive.value = false;
  });
</script>

<template>
  <div ref="dropdownRef" class="d-btn-drop-down" :class="{ 'd-btn-drop-down--open': isActive }">
    <slot name="dropdown.button">
      <template v-if="!$slots['dropdown.button']">
        <DBtn v-if="title" v-bind="$attrs" :title="title" :icon="icon" @click="toggleDropdown" />
        <DBtnIcon v-else v-bind="$attrs" :icon="icon" @click="toggleDropdown" />
      </template>
    </slot>
    <div class="d-btn-drop-down-content" ref="contentRef">
      <template v-if="options && options.length > 0">
        <ul v-if="isOpen" class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          <li
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option)"
            class="px-4 py-2 hover:bg-blue-100 cursor-pointer">
            {{ option.label }}
          </li>
        </ul>
      </template>
      <slot />
    </div>
  </div>
</template>
