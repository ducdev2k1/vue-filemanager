<script setup lang="ts">
  import { IFileManager } from '@/interfaces/IFileManager';
import { t } from '@/plugins/i18n';
import { getNestedPropValue } from '@/utils/my-function';

  interface IProps {
    dataRow: IFileManager;
  }

  const props = defineProps<IProps>();
  const dataRow = computed(() => props.dataRow);
  const permission = computed(() => getNestedPropValue(dataRow.value, 'permission'));
</script>

<template>
  <span class="c-file-manager_permission">{{ t(`locale.${permission}`) }}</span>
</template>
