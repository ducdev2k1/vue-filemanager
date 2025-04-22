<script setup lang="ts">
  import { myRoute } from '@/utils/my-route';
  import { env } from '@/utils/my-variables';
  import { t } from '@/plugins/i18n';

  const route = useRoute();
  const currentPath = computed(() => route.fullPath);
  const query = computed(() => route.query);
  const showDragDrop = computed(() => currentPath.value === myRoute.home || currentPath.value === myRoute.myFiles);
  const showNoData = computed(() => !showDragDrop.value);
</script>

<template>
  <div class="c-fm-empty" :class="{ 'my-files': showDragDrop }">
    <template v-if="showDragDrop">
      <v-img :src="`${env.publicPath}/assets/gif/empty.gif`" alt="empty" height="264" />
      <div class="c-fm-empty_content">
        <p>{{ t('locale.drag_drop_file_here') }}</p>
        <p>--- {{ t('locale.or') }} ---</p>
        <p>{{ t('locale.select_add_new_button') }}</p>
      </div>
    </template>
    <template v-else-if="showNoData">
      <template v-if="myRoute.shareParamsName.byMe === currentPath">
        <div class="c-fm-empty_content">
          <p>{{ t('$vuetify.noDataText') }}</p>
        </div>
        <v-img :src="`${env.publicPath}/assets/gif/empty-trash.gif`" alt="empty" height="150" />
      </template>
      <template
        v-else-if="query.share === myRoute.shareParamsName.byMe || query.share === myRoute.shareParamsName.withMe">
        <div class="c-fm-empty_content">
          <p>{{ t('locale.empty_share_desc') }}</p>
        </div>
        <v-img :src="`${env.publicPath}/assets/gif/empty-share.gif`" alt="empty" height="276" />
      </template>
      <template v-else>
        <div class="c-fm-empty_content">
          <p>{{ t('$vuetify.noDataText') }}</p>
        </div>
        <v-img :src="`${env.publicPath}/assets/gif/empty-trash.gif`" alt="empty" height="150" />
      </template>
    </template>
  </div>
</template>
