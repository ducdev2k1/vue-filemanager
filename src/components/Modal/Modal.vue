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
  <v-dialog class="c-dialog" v-model="dialogModel" v-bind="$attrs" :persistent="persistent">
    <v-card class="c-dialog_card">
      <v-card-title v-if="!hiddenHeader">
        <h3 class="text-three-dots">
          <slot name="title" />
        </h3>
        <BtnBase :icon="MdiWebfont.close" class="" @click="closeModal" />
      </v-card-title>

      <template v-if="$slots.content">
        <v-card-text v-if="$slots.content">
          <slot name="content" />
        </v-card-text>
        <v-card-actions v-if="$slots.actions">
          <div class="c-dialog_gr-action">
            <slot name="actions" />
          </div>
        </v-card-actions>
      </template>
      <slot />
    </v-card>
  </v-dialog>
</template>
