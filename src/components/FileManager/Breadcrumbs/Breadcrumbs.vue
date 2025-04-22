<script setup lang="ts">
  import BtnBase from '@/components/Button/BtnBase.vue';
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { breakPoint } from '@/utils/MyVariables';
  import { useWindowSize } from '@vueuse/core';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    data: IFileManager[];
    textDefault?: string;

    callBackFolderSelected: ({}) => void;
  }

  const { width } = useWindowSize();
  const props = defineProps<IProps>();
  const listBreadcrumb = computed(() => props.data);
  const textDefault = computed(() => props.textDefault);
  const numberShowDrop = computed(() => (width.value > breakPoint.brSpLandscape ? 4 : 2));
  const showDropdown = computed(() => listBreadcrumb.value.length > numberShowDrop.value);

  const visibleBreadcrumbs = computed(() => {
    if (!showDropdown.value) return listBreadcrumb.value;
    return [
      listBreadcrumb.value[0], // Luôn giữ breadcrumb đầu tiên
      {
        name: '...',
        path: '',
      }, // Hiển thị menu dropdown
      listBreadcrumb.value[listBreadcrumb.value.length - 1], // Hiển thị breadcrumb cuối cùng
    ] as IFileManager[];
  });

  const hiddenBreadcrumbs = computed(() => listBreadcrumb.value.slice(1, -1));

  // click go to folder
  const actionBreadCrumbClick = (folder: IFileManager) => {
    console.log('actionBreadCrumbClick :>> ', folder);
    props.callBackFolderSelected({ data: folder });
  };

  // reload page
  const actionReloadPage = () => {
    props.callBackFolderSelected({ refresh: true });
  };
</script>

<template>
  <v-breadcrumbs class="text-white c-breadcrumbs" v-bind="$attrs">
    <v-breadcrumbs-item>
      <BtnBase :disabled="listBreadcrumb.length <= 0" :title="textDefault" @click="actionReloadPage" />
    </v-breadcrumbs-item>
    <v-breadcrumbs-divider v-if="visibleBreadcrumbs.length > 0">
      <v-icon>{{ MdiWebfont['chevron-right'] }}</v-icon>
    </v-breadcrumbs-divider>
    <template v-for="(item, index) in visibleBreadcrumbs" :key="index">
      <v-menu v-if="!item.path" open-on-hover class="c-menu-down">
        <template #activator="{ props }">
          <BtnBaseIcon v-bind="props" :icon="MdiWebfont['dots-horizontal']" />
        </template>
        <v-list class="c-menu-down_list">
          <v-list-item
            class="c-menu-down_item"
            v-for="(hiddenItem, i) in hiddenBreadcrumbs"
            :key="i"
            @click="actionBreadCrumbClick(hiddenItem)">
            <span class="text-three-dots">{{ hiddenItem.name }}</span>
            <template #prepend>
              <v-icon>{{ MdiWebfont['folder-outline'] }}</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-breadcrumbs-item v-else>
        <BtnBase
          :icon="MdiWebfont['folder-outline']"
          :class="{ active: index === visibleBreadcrumbs.length - 1 }"
          @click="actionBreadCrumbClick(item)">
          <template #title>
            <span class="text-three-dots">{{ item.name }}</span>
          </template>
        </BtnBase>
      </v-breadcrumbs-item>
      <v-breadcrumbs-divider v-if="index < visibleBreadcrumbs.length - 1">
        <v-icon>{{ MdiWebfont['chevron-right'] }}</v-icon>
      </v-breadcrumbs-divider>
    </template>
  </v-breadcrumbs>
</template>
