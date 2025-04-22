<script setup lang="ts">
  import { getNearestFolder } from '@/components/v1/FileManager/partial/HelperFunctionFileManager';
  import { MdiWebfont } from '@/components/v1/Icons/mdi-font-icons';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { AccountStore } from '@/stores/user/account-store';
  import { getNestedPropValue } from '@/utils/my-function';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    dataRow?: IFileManager;
    path?: string;
  }

  const accountStore = AccountStore();
  const inforUser = computed(() => accountStore.account);
  const props = defineProps<IProps>();
  const dataRow = computed(() => props.dataRow);
  const path = computed(() => {
    if (props.path) {
      return props.path;
    } else {
      return getNestedPropValue(dataRow.value, 'path') || '';
    }
  });

  const owner = computed(() => {
    const getOwner = getNestedPropValue(dataRow.value, 'owner');
    if (getOwner && getOwner.account) {
      return getOwner.account === inforUser.value.account ? t('locale.my_files') : t('locale.shared_with_me');
    }
    return t('locale.my_files');
  });

  const textRender = computed(() => {
    if (path.value.includes('/') && !path.value.endsWith('/')) {
      return getNearestFolder(path.value);
    }
    return owner.value;
  });

  const listBreadCrumb = computed(() => {
    if (path.value.includes('/') && !path.value.endsWith('/')) {
      return path.value.split('/').slice(0, -1);
    }
    return [];
  });

  const isFolder = computed(() => path.value.includes('/') && !path.value.endsWith('/'));
</script>

<template>
  <div class="c-file-manager_path c-btn cursor-pointer inline-flex px-3" v-bind="$attrs">
    <img v-if="isFolder" src="/assets/icons/office/folder.svg" :alt="textRender" width="20" height="20" />
    <v-icon v-else class="text-xl">{{ MdiWebfont['folder-account-outline'] }}</v-icon>

    <span class="w-full line-clamp-1 whitespace-normal">
      {{ textRender }}
      <v-tooltip
        v-if="listBreadCrumb.length"
        activator="parent"
        location="bottom left"
        content-class="breadcrumb-tooltip">
        <template #default>
          <nav class="flex items-center space-x-2 p-2 rounded-lg">
            <span class="flex items-center hover:text-yellow-400 transition-colors">
              <v-icon class="breadcrumb_icon mr-1">{{ MdiWebfont['folder-account-outline'] }}</v-icon>
              {{ t('locale.my_files') }}
            </span>
            <!-- Dấu "›" sau "Tệp của tôi" nếu có thư mục con -->
            <v-icon class="breadcrumb_icon" v-if="listBreadCrumb.length">{{ MdiWebfont['chevron-right'] }}</v-icon>
            <template v-for="(item, index) in listBreadCrumb" :key="index">
              <span class="flex items-center hover:text-yellow-400 transition-colors">
                <img class="mr-1" src="/assets/icons/office/folder.svg" :alt="item" width="20" height="20" />
                {{ item }}
              </span>
              <!-- Thêm dấu "›" trừ phần tử cuối cùng -->
              <v-icon class="breadcrumb_icon" v-if="index !== listBreadCrumb.length - 1">
                {{ MdiWebfont['chevron-right'] }}
              </v-icon>
            </template>
          </nav>
        </template>
      </v-tooltip>
    </span>
  </div>
</template>

<style lang="scss" scoped>
  html.light {
    .breadcrumb {
      &_icon {
        &::before {
          color: rgba(255, 255, 255, 0.6) !important;
        }
      }
    }
  }
</style>
