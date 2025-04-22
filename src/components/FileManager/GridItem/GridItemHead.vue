<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { fmActionDownloadFile } from '@/components/v1/FileManager/partial/ConfigActionFileManager';
  import { getThumbnailIcon } from '@/components/v1/FileManager/partial/HelperFunctionFileManager';
  import { helperActionRecommendDetailFile } from '@/components/v1/RecommendFileAndFolder/partial/HelperActionRecommendFile';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    dataFile: IFileManager;
    selectedItems: IFileManager[];
    isHomePage: boolean;
    rightClickHandler: (event: MouseEvent, file: IFileManager) => void;
  }

  const props = defineProps<IProps>();

  const file = computed(() => props.dataFile);
  const selectedItems = computed(() => props.selectedItems);
  const isHomePage = computed(() => props.isHomePage);
</script>

<template>
  <div class="c-grid_box_head" v-bind="$attrs">
    <img :src="getThumbnailIcon(file)" :alt="file.name" width="32" height="32" />
    <v-tooltip location="top" :text="file.name">
      <template #activator="{ props }">
        <p v-bind="props" class="text-three-dots flex-1 text-left">
          {{ file.name }}
        </p>
      </template>
    </v-tooltip>
    <span :title="t('locale.other_operations')">
      <BtnBase
        :icon-mdi="MdiWebfont['dots-vertical']"
        @click.prevent="rightClickHandler($event, file)"
        @touchend.prevent="rightClickHandler($event, file)"
        :disabled="selectedItems.length > 1">
        <template #content v-if="isHomePage">
          <v-menu :open-on-click="true" class="c-menu-down" activator="parent">
            <v-list class="c-menu-down_list">
              <v-list-item
                class="c-menu-down_item"
                @click="fmActionDownloadFile([file])"
                :title="t('locale.download_custom')"
                :prepend-icon="MdiWebfont['cloud-download-outline']" />
              <v-list-item
                class="c-menu-down_item"
                @click="helperActionRecommendDetailFile(file)"
                :title="t('locale.detail')"
                :prepend-icon="MdiWebfont['information-slab-circle-outline']" />
            </v-list>
          </v-menu>
        </template>
      </BtnBase>
    </span>
  </div>
</template>
