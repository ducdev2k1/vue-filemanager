<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { t } from '@/plugins/i18n';

  defineOptions({
    inheritAttrs: false,
  });
</script>

<template>
  <v-overlay class="align-center justify-center c-effect-drop-upload" contained v-bind="$attrs">
    <div class="content">
      <v-img :src="`/assets/gif/upload.gif`" alt="drop upload" height="80" width="80" />
      <div class="content-text">
        <p>{{ t('locale.drop_files_to_upload_files') }}</p>
        <p>
          <span :class="MdiWebfont['folder-account-outline']" />
          {{ t('locale.my_files') }}
        </p>
      </div>
    </div>
  </v-overlay>
</template>
