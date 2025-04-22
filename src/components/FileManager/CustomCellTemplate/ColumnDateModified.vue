<script setup lang="ts">
  import { formatDate } from '@/utils/MyFunction';

  interface IProps {
    dataRow: string | Date;
    format?: string;
  }

  const props = defineProps<IProps>();
  const dataRow = computed(() => props.dataRow);
  const format = computed(() => props.format || 'DD/MM/YYYY');
</script>

<template>
  <span class="c-file-manager_date">{{ formatDate(dataRow, format) }}</span>
</template>
