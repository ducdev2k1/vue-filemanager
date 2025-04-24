<script setup lang="ts">
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
  <DBreadcrumbs class="text-white c-breadcrumbs" v-bind="$attrs" :items="visibleBreadcrumbs">
    <d-breadcrumbs-item>
      <DBtn :disabled="listBreadcrumb.length <= 0" :title="textDefault" @click="actionReloadPage" />
    </d-breadcrumbs-item>
    <d-breadcrumbs-divider v-if="visibleBreadcrumbs.length > 0">
      <d-icon :icon="MdiWebfont['chevron-right']" />
    </d-breadcrumbs-divider>
    <template v-for="(item, index) in visibleBreadcrumbs" :key="index">
      <v-menu v-if="!item.path" open-on-hover class="c-menu-down">
        <template #activator="{ props }">
          <DBtnIcon v-bind="props" :icon="MdiWebfont['dots-horizontal']" />
        </template>
        <d-list class="c-menu-down_list">
          <d-list-item
            class="c-menu-down_item"
            v-for="(hiddenItem, i) in hiddenBreadcrumbs"
            :key="i"
            @click="actionBreadCrumbClick(hiddenItem)">
            <span class="text-three-dots">{{ hiddenItem.name }}</span>
            <template #prepend>
              <d-icon :icon="MdiWebfont['folder-outline']" />
            </template>
          </d-list-item>
        </d-list>
      </v-menu>
      <d-breadcrumbs-item v-else>
        <DBtn
          :icon="MdiWebfont['folder-outline']"
          :class="{ active: index === visibleBreadcrumbs.length - 1 }"
          @click="actionBreadCrumbClick(item)">
          <template #title>
            <span class="text-three-dots">{{ item.name }}</span>
          </template>
        </DBtn>
      </d-breadcrumbs-item>
      <d-breadcrumbs-divider v-if="index < visibleBreadcrumbs.length - 1">
        <d-icon :icon="MdiWebfont['chevron-right']" />
      </d-breadcrumbs-divider>
    </template>
  </DBreadcrumbs>
</template>
