<script setup lang="ts">
  import { t } from '@/plugins/i18n';
  import { calculateRemainingTime, formatDate } from '@/utils/my-function';
  import { dateFormat } from '@/utils/my-variables';

  interface IProps {
    dataRow: string | Date;
  }

  const props = defineProps<IProps>();
  const dataRow = computed(() => props.dataRow);
</script>

<template>
  <span class="c-file-manager_title">
    {{
      `${formatDate(dataRow, dateFormat)}  (${t('locale.still')} ${calculateRemainingTime(dataRow as unknown as string)})`
    }}
  </span>
</template>
