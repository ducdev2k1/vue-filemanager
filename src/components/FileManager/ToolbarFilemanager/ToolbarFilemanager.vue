<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { DemoActionFM } from '@/data/DemoActionFm';
  import { IActionFM } from '@/interfaces';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    loading?: boolean;
    showSwitchView?: boolean;
    actionToolbar?: IActionFM[];

    toolbarClick?: (item: IActionFM) => void;
  }

  const props = withDefaults(defineProps<IProps>(), {
    loading: false,
    showSwitchView: true,
  });

  const emits = defineEmits(['refresh']);

  const onClick = (item: IActionFM) => {
    props.toolbarClick && props.toolbarClick(item);
  };
  const actionToolbar = computed(() => props.actionToolbar ?? DemoActionFM);
</script>

<template>
  <section class="c-file-manager_toolbar" v-bind="$attrs">
    <div class="c-file-manager_toolbar_group group_left">
      <slot name="fmToolbarLeft" />
    </div>
    <div class="c-file-manager_toolbar_group group_right">
      <div class="c-file-manager_toolbar_group_block left">
        <template v-for="action in actionToolbar" :key="action.key">
          <DBtnIcon :icon="action.icon as string" @click="onClick(action)" :disabled="action.disabled" />
        </template>
      </div>
      <div class="c-file-manager_toolbar_group_block right">
        <DBtnIcon :disabled="loading" :icon="MdiWebfont.reload" @click="emits('refresh')" />
        <DBtnSwicthView v-if="showSwitchView" />
      </div>
    </div>
  </section>
</template>
