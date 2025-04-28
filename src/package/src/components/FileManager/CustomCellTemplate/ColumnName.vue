<script setup lang="ts">
  import { getThumbnailIcon } from '@/components/FileManager/partial/HelperFunctionFileManager';
  import { IFileManager } from '@/interfaces/IFileManager';
  // import { calculateRemainingTime, convertBytes, formatDate, formatGradient } from '@/utils/MyFunction';
  // import { myRoute } from '@/utils/my-route';
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { breakPoint } from '@/utils/MyVariables';
  import { useWindowSize } from '@vueuse/core';

  interface IProps {
    dataRow: IFileManager;
  }

  const props = defineProps<IProps>();
  const dataFile = computed(() => props.dataRow);
  const { width } = useWindowSize();
  const isDesktopView = computed(() => width.value > breakPoint.brSpLandscape);

  const iconThumnail = computed(() => {
    if (dataFile.value.isDirectory) {
      return MdiWebfont['folder-outline'];
    }
    return getThumbnailIcon(dataFile.value);
  });

  const isImage = computed(() => {
    const value = iconThumnail.value.toLowerCase();
    return (
      value.endsWith('.png') ||
      value.endsWith('.jpg') ||
      value.endsWith('.jpeg') ||
      value.endsWith('.gif') ||
      value.endsWith('.svg') ||
      value.endsWith('.webp')
    );
  });
</script>

<template>
  <div class="c-file-manager_name-file">
    <div class="c-file-manager_name-file_left">
      <i v-if="!isImage" style="font-size: 32px" :class="iconThumnail" />
      <img
        v-else
        class="object-contain"
        :src="iconThumnail"
        :alt="dataFile.type"
        width="32"
        height="32"
        max-width="32"
        max-height="32"
        loading="lazy" />
      <!-- <IconTag :color="formatGradient(dataRow.tags)" v-if="dataFile.tags.length > 0 && isDesktopView" /> -->
      <div class="content line-clamp-2">
        <span class="text-three-dots">{{ dataFile.name }}</span>
      </div>
      <!-- <div class="content line-clamp-2">
        <p v-if="!isDesktopView && dataFile.lastModified && !isTrash && !isHome">
          <span>{{ formatDate(dataFile.lastModified) }}</span>
          <template v-if="dataFile.size > 0">
            <span class="mx-1">•</span>
            <span>{{ convertBytes(dataFile.size) }}</span>
          </template>
        </p>
        <p v-else-if="!isDesktopView && dataFile.time_deleted && isTrash">
          <span>
            {{
              `${formatDate(dataFile.time_deleted, dateFormat)}  (${t('locale.still')} ${calculateRemainingTime(
                dataRow.time_deleted as unknown as string,
              )})`
            }}
          </span>
        </p>
        <p v-else-if="!isDesktopView && isHome">
          <span class="line-clamp-1">
            {{ `${t('locale.you')} ${t('locale.have')} ${t(`locale.` + dataFile.action).toLowerCase()}` }}
          </span>
        </p>
      </div> -->
    </div>
  </div>
</template>
