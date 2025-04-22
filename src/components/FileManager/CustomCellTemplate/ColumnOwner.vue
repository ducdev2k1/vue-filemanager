<script setup lang="ts">
  import { t } from '@/plugins/i18n';
  import { AvatarInitials } from '@ducdev2k1/avatar-initials';

  interface IProps {
    dataOwner: IFileManagerSharedWith;
  }

  const props = defineProps<IProps>();
  const dataOwner = computed(() => props.dataOwner);
</script>

<template>
  <div class="flex items-center gap-2" v-bind="$attrs">
    <AvatarInitials :fullName="dataOwner.account" size="26" />
    <span class="line-clamp-1">
      {{ isByMe(dataOwner.account) ? t('locale.me') : dataOwner.account }}
      <v-tooltip
        v-if="dataOwner.account.length > 20 || isByMe(dataOwner.account)"
        activator="parent"
        location="bottom center">
        {{ dataOwner.account }}
      </v-tooltip>
    </span>
  </div>
</template>
