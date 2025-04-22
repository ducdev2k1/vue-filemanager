<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { t } from '@/plugins/i18n';
  import { EnumLocalStorageKey, EnumViewModeFm } from '@/utils/MyEnum';
  import { useStorage } from '@vueuse/core';

  defineOptions({
    inheritAttrs: false,
  });

  const currentView = useStorage(EnumLocalStorageKey.viewFileMamager, EnumViewModeFm.details);

  const toggleView = () => {
    currentView.value =
      currentView.value === EnumViewModeFm.details ? EnumViewModeFm.thumbnails : EnumViewModeFm.details;
  };
</script>

<template>
  <DBtnIcon
    v-bind="$attrs"
    :tooltip="t('locale.change_layout')"
    :icon="currentView === EnumViewModeFm.details ? MdiWebfont['dots-grid'] : MdiWebfont['format-list-bulleted']"
    @click="toggleView" />
</template>
