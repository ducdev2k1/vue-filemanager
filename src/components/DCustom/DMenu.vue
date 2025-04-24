<template>
  <div class="d-menu" :class="{ 'd-menu--disabled': disabled }">
    <!-- Activator slot -->
    <slot name="activator" :on="activatorEvents" :attrs="activatorAttrs">
      <DBtn v-if="!absolute" class="d-menu-activator" v-bind="activatorAttrs" v-on="activatorEvents">Menu</DBtn>
    </slot>

    <!-- Menu content -->
    <teleport :to="attach || 'body'">
      <transition :name="transition">
        <div
          v-if="modelValue"
          class="d-menu-content"
          :class="{ 'd-menu-content--absolute': absolute }"
          :style="menuStyles"
          ref="menuRef"
          @mouseleave="openOnHover && close()">
          <slot />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { useClickOutside } from '@/composables/clickOutside';

  const props = defineProps<{
    modelValue?: boolean;
    absolute?: boolean;
    positionX?: number;
    positionY?: number;
    offsetX?: number;
    offsetY?: number;
    openOnHover?: boolean;
    disabled?: boolean;
    attach?: string | Element;
    transition?: string;
    closeOnContentClick?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'click', event: Event): void;
  }>();

  const menuRef = ref<HTMLElement | null>(null);
  const modelValueInternal = ref(props.modelValue);

  // Sync internal model with prop
  watch(
    () => props.modelValue,
    (val) => {
      modelValueInternal.value = val;
    },
  );

  // Click outside to close
  useClickOutside(menuRef, () => {
    if (!props.openOnHover && modelValueInternal.value) {
      close();
    }
  });

  // Activator events
  const activatorEvents = computed(() => ({
    click: (e: Event) => {
      if (!props.disabled) {
        emit('click', e);
        toggle();
      }
    },
    mouseenter: () => {
      if (props.openOnHover && !props.disabled) {
        modelValueInternal.value = true;
      }
    },
  }));

  const activatorAttrs = computed(() => ({
    'aria-haspopup': 'menu',
    'aria-expanded': modelValueInternal.value,
  }));

  // Menu styles
  const menuStyles = computed(() => {
    const styles: Record<string, string> = {};
    if (props.absolute && props.positionX !== undefined && props.positionY !== undefined) {
      styles.position = 'absolute';
      styles.left = `${props.positionX + (props.offsetX || 0)}px`;
      styles.top = `${props.positionY + (props.offsetY || 0)}px`;
    } else if (props.offsetX || props.offsetY) {
      styles.transform = `translate(${props.offsetX || 0}px, ${props.offsetY || 0}px)`;
    }
    return styles;
  });

  // Toggle menu
  const toggle = () => {
    modelValueInternal.value = !modelValueInternal.value;
    emit('update:modelValue', modelValueInternal.value);
  };

  // Close menu
  const close = () => {
    modelValueInternal.value = false;
    emit('update:modelValue', false);
  };

  // Handle content click
  const handleContentClick = (e: Event) => {
    if (props.closeOnContentClick) {
      close();
    }
    emit('click', e);
  };
</script>

<style scoped lang="scss">
  $d-menu-bg: #fff;
  $d-menu-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  $d-menu-border-radius: 4px;

  .d-menu {
    display: inline-block;

    &--disabled {
      pointer-events: none;
      opacity: 0.5;
    }

    .d-menu-activator {
      padding: 8px 16px;
      border: none;
      background: #1976d2;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        opacity: 0.9;
      }
    }

    .d-menu-content {
      background: $d-menu-bg;
      border-radius: $d-menu-border-radius;
      box-shadow: $d-menu-shadow;
      position: absolute;
      z-index: 1000;
      min-width: 160px;
      max-height: 300px;
      overflow-y: auto;

      &--absolute {
        position: fixed;
      }
    }
  }

  /* Transitions */
  .scale-enter-active,
  .scale-leave-active {
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }
  .scale-enter-from,
  .scale-leave-to {
    transform: scale(0);
    opacity: 0;
  }

  .slide-x-enter-active,
  .slide-x-leave-active {
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }
  .slide-x-enter-from,
  .slide-x-leave-to {
    transform: translateX(-10px);
    opacity: 0;
  }

  .slide-y-enter-active,
  .slide-y-leave-active {
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }
  .slide-y-enter-from,
  .slide-y-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }
</style>
