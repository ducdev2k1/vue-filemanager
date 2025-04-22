<script setup lang="ts">
  import { MdiWebfont } from '@/components/v1/Icons/mdi-font-icons';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { FileManagerStore } from '@/stores/user/file-manager-store';
  import { FileManagerActionStore } from '@/stores/user/file-manager-action-store';
  import { EnumActionFileManager } from '@/utils/my-enum';
  import { getNestedPropValue, highlightText } from '@/utils/my-function';
  import { myRoute } from '@/utils/my-route';

  interface IProps {
    cellInfo: any;
  }

  const route = useRoute();
  const props = defineProps<IProps>();
  const fileManagerStore = FileManagerStore();
  const fileManagerActionStore = FileManagerActionStore();
  const selectedItems = computed(() => fileManagerStore.selectedItems);
  const cellInfo = computed(() => props.cellInfo);
  const searchQuery = ref('');
  const textShare = computed(() => {
    if (
      route.query?.share === myRoute.shareParamsName.withMe &&
      getNestedPropValue(cellInfo.value, 'data.fileItem.dataItem.share_id')
    ) {
      // return getNestedPropValue(cellInfo.value, 'data.fileItem.dataItem.owner.account');
      return t('locale.share_with_custom');
    } else if (getNestedPropValue(cellInfo.value, 'data.fileItem.dataItem.share_id')) {
      return t('locale.shared');
    }
    return t('locale.private');
  });

  const optionShare = reactive([
    {
      name: EnumActionFileManager.share_user,
      text: computed(() => t('locale.share_user')),
      icon: MdiWebfont['account-plus-outline'],
      visible: true,
    },
    {
      name: EnumActionFileManager.share_group,
      text: computed(() => t('locale.share_group')),
      icon: MdiWebfont['account-multiple-plus-outline'],
      visible: true,
    },
  ]);

  const handleCLickBtnShare = (e: any) => {
    if (e) {
      e.stopPropagation();
    }
    const dataItem: IFileManager = getNestedPropValue(cellInfo.value, 'data.fileItem.dataItem');
    if (dataItem) {
      if (selectedItems.value.length > 1) {
        fileManagerStore.actionSetSelectedItems([...selectedItems.value, dataItem]);
      } else {
        fileManagerStore.actionSetSelectedItems([dataItem]);
      }
    }
  };

  const actionOpenModalShare = (e: any, type: EnumActionFileManager) => {
    fileManagerActionStore.toggleModalShare(type);
  };

  const listAccountShare = computed(() => getNestedPropValue(cellInfo.value, 'data.fileItem.dataItem.share'));
  const convertPermission = (permission: string) => {
    switch (permission) {
      case 'view':
        return t('locale.view');
      case 'edit':
        return t('locale.edit');
      default:
        return '';
    }
  };

  const convertDataListAccountShare = (listAccountShare: any) => {
    console.log('listAccountShare :>> ', listAccountShare);
    return listAccountShare.map((item: any) => {
      return {
        title: item.account,
        descstiption: convertPermission(item.permissions),
      } as { title: string; descstiption: string };
    });
  };
</script>

<template>
  <IDropdown
    v-if="getNestedPropValue(cellInfo, 'data.fileItem.dataItem.share_access_directory')"
    :items="convertDataListAccountShare(listAccountShare)"
    @update:text-search="(data) => (searchQuery = data)">
    <template #dropdown.btn="{ items, props }">
      <BtnBase v-bind="props" class="c-btn-border-primary c-btn-border" :icon-mdi="MdiWebfont['account-multiple']">
        <template #title>
          + (
          <b>{{ items.length }}</b>
          ) {{ t('locale.backend_account') }}
        </template>
      </BtnBase>
    </template>
    <template #dropdown.list.item="{ item }">
      <v-list-item :title="item.title" :subtitle="item.descstiption">
        <template #prepend>
          <Avatar :full-name="item.title" class="mr-2" size="36" />
        </template>
        <template #title>
          <span v-if="searchQuery" v-html="highlightText(item.title, searchQuery)"></span>
          <span v-else>{{ item.title }}</span>
        </template>
      </v-list-item>
    </template>
  </IDropdown>

  <BtnBase
    v-else
    @click.prevent="handleCLickBtnShare"
    class="c-file-manager_shared"
    :title="textShare"
    :icon-mdi="
      MdiWebfont[getNestedPropValue(cellInfo, 'data.fileItem.dataItem.share_id') ? 'account-multiple' : 'security']
    "
    :append-icon="MdiWebfont['menu-down']">
    <template #content>
      <v-menu activator="parent" :close-on-content-click="true" location="bottom left" class="c-menu-down">
        <v-list class="c-menu-down_list">
          <v-list-item
            v-for="(option, index) in optionShare"
            :key="index"
            class="c-menu-down_item"
            :prepend-icon="option.icon"
            @click.prevent="actionOpenModalShare($event, option.name)"
            :title="option.text" />
        </v-list>
      </v-menu>
    </template>
  </BtnBase>
</template>
