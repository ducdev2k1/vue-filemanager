<template>
  <li class="d-breadcrumbs-item" :class="{ 'd-breadcrumbs-item--disabled': disabled }">
    <!-- Item slot -->
    <slot name="item">
      <component :is="href && !disabled ? 'a' : 'span'" :href="href" class="d-breadcrumbs-link" @click="emit('click')">
        <!-- Prepend slot for icon or custom content -->
        <slot name="prepend">
          <DIcon v-if="icon" :icon="icon" :size="size" :color="color" class="d-breadcrumbs-icon" />
        </slot>
        <!-- Default content -->
        <slot>{{ text }}</slot>
      </component>
    </slot>
  </li>
</template>

<script setup lang="ts">
  const props = defineProps<{
    text?: string;
    href?: string;
    icon?: string;
    size?: number | string;
    color?: string;
    disabled?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'click'): void;
  }>();
</script>

<style scoped lang="scss">
  $d-breadcrumbs-color: #1976d2;
  $d-breadcrumbs-text: #333;
  $d-breadcrumbs-disabled: rgba(0, 0, 0, 0.38);
  $d-breadcrumbs-hover: rgba(0, 0, 0, 0.08);

  .d-breadcrumbs-item {
    display: flex;
    align-items: center;

    .d-breadcrumbs-link {
      color: $d-breadcrumbs-text;
      text-decoration: none;
      display: flex;
      align-items: center;
      transition: all 0.2s ease;

      &:hover {
        background: $d-breadcrumbs-hover;
        border-radius: 4px;
      }

      &[href] {
        color: $d-breadcrumbs-color;
        cursor: pointer;
      }
    }

    &--disabled {
      .d-breadcrumbs-link {
        color: $d-breadcrumbs-disabled;
        cursor: not-allowed;
        pointer-events: none;
      }
    }

    .d-breadcrumbs-icon {
      margin-right: 8px;
    }
  }
</style>
