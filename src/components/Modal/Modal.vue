<script setup lang="ts">
  import { MdiWebfont } from '../Icons/mdi-font-icons';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    persistent?: boolean;
    hiddenHeader?: boolean;
    maxWidth?: number | string;
  }

  const props = withDefaults(defineProps<IProps>(), {
    persistent: true,
    maxWidth: 600,
  });

  const persistent = computed(() => props.persistent);
  const hiddenHeader = computed(() => props.hiddenHeader || false);
  const dialogModel = defineModel({
    default: false,
    type: Boolean,
  });
  const emits = defineEmits(['close']);

  const closeModal = () => {
    dialogModel.value = false;
    // emits('resetValue');
    emits('close');
  };

  onMounted(() => {
    if (dialogModel.value) {
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      });
    }
  });
</script>

<template>
  <DModal
    class="c-dialog"
    v-model="dialogModel"
    v-bind="$attrs"
    :maxWidth="maxWidth"
    :persistent="persistent"
    @close="closeModal">
    <template #header v-if="!hiddenHeader">
      <h3 class="text-three-dots">
        <slot name="title" />
      </h3>
      <DBtnIcon :icon="MdiWebfont.close" class="" @click="closeModal" />
    </template>
    <slot v-if="$slots.content">
      <slot name="content" />
    </slot>
    <template #footer v-if="$slots.actions">
      <slot name="actions" />
    </template>
  </DModal>
</template>
