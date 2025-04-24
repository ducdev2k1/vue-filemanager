<script setup lang="ts">
  import { MdiWebfont } from '../Icons/mdi-font-icons';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    persistent?: boolean;
    hiddenHeader?: boolean;
  }

  const props = withDefaults(defineProps<IProps>(), {
    persistent: true,
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
  <DModal class="c-dialog" v-model="dialogModel" v-bind="$attrs" :persistent="persistent" max-width="600px">
    <d-card class="c-dialog_card">
      <d-card-title v-if="!hiddenHeader">
        <h3 class="text-three-dots">
          <slot name="title" />
        </h3>
        <DBtnIcon :icon="MdiWebfont.close" class="" @click="closeModal" />
      </d-card-title>

      <template v-if="$slots.content">
        <d-card-text v-if="$slots.content">
          <slot name="content" />
        </d-card-text>
        <d-card-actions v-if="$slots.actions">
          <div class="c-dialog_gr-action">
            <slot name="actions" />
          </div>
        </d-card-actions>
      </template>
      <slot />
    </d-card>
  </DModal>
</template>
