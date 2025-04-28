<script setup lang="ts">
  import { configContextMenuOptions } from '@/components/v1/FileManager/partial/ConfigContextMenuOptions';
  import { MdiWebfont } from '@/components/v1/Icons/mdi-font-icons';
  import { IToolbarActions } from '@/interfaces';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { FileManagerStore } from '@/stores/user/file-manager-store';
  import { EnumActionFileManager } from '@/utils/my-enum';
  import { myRoute } from '@/utils/my-route';
  import { breakPoint } from '@/utils/my-variables';
  import { useWindowSize } from '@vueuse/core';

  interface IProps {
    dataFile: IFileManager;
  }

  const { width } = useWindowSize();
  const props = defineProps<IProps>();
  const route = useRoute();
  const dataFile = computed(() => props.dataFile);
  const fileManagerStore = FileManagerStore();
  const selectedItems = computed(() => fileManagerStore.selectedItems);

  const contextMenuOptions = computed(
    () =>
      configContextMenuOptions(route.path, route.query?.share as string, true) as {
        items: IToolbarActions[];
      },
  );

  const optionActionShare = computed(() =>
    contextMenuOptions.value.items.find((action: any) => action.name === EnumActionFileManager.share_with_custom),
  );

  function handleClickChildAction(action: IToolbarActions) {
    if (action) {
      fileManagerStore.actionSetSelectedItems([dataFile.value]);
      fileManagerStore.actionSetObjectSelectedOne(dataFile.value);
      if (typeof action.onClick === 'function') action.onClick();
    }
  }

  const handleShowContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    // Ngăn sự kiện lan truyền lên các phần tử cha
    event.stopPropagation();
    fileManagerStore.actionSetSelectedItems([dataFile.value]);
    const container = event.currentTarget as HTMLElement;
    if (container) {
      container.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: event.clientX,
          clientY: event.clientY,
        }),
      );
    }
  };

  const getFilteredActions = (routeActionsMap: { [key: string]: any[] }) => {
    const actionsForCurrentRoute = routeActionsMap[route.path] || [];
    return contextMenuOptions.value.items.filter(
      (item) => (actionsForCurrentRoute.length === 0 || actionsForCurrentRoute.includes(item.name)) && item.visible,
    );
  };

  const myActions = computed(() => {
    return getFilteredActions({
      [myRoute.myFiles]: [
        EnumActionFileManager.share_with_custom,
        EnumActionFileManager.download_custom,
        EnumActionFileManager.rename_custom,
      ],
      [myRoute.search]: [EnumActionFileManager.download_custom, EnumActionFileManager.rename_custom],
      [myRoute.trash]: [EnumActionFileManager.restore_trash_custom, EnumActionFileManager.delete_custom],
      [myRoute.manageStorage]: [
        EnumActionFileManager.preview,
        EnumActionFileManager.download_custom,
        EnumActionFileManager.detail,
        EnumActionFileManager.restore_trash_custom,
      ],
    });
  });
</script>

<template>
  <div class="c-data-table-virtual__group-actions">
    <template v-for="action in myActions" :key="action.name">
      <BtnBase
        v-if="width > breakPoint.brSpLandscape"
        @click.prevent="handleClickChildAction(action as IToolbarActions)"
        :icon-mdi="action.icon"
        :tooltip="action.text">
        <template #content>
          <v-menu
            v-if="action.items && action.items.length > 0"
            activator="parent"
            :close-on-content-click="true"
            location="bottom left"
            class="c-menu-down">
            <v-list class="c-menu-down_list">
              <template v-if="optionActionShare">
                <v-list-item
                  v-for="action in optionActionShare.items"
                  :key="action.name"
                  class="c-menu-down_item"
                  :title="action.text"
                  :prepend-icon="action.icon"
                  @click="handleClickChildAction(action as IToolbarActions)" />
              </template>
            </v-list>
          </v-menu>
        </template>
      </BtnBase>
    </template>
    <span :title="t('locale.other_operations')" v-if="route.path !== myRoute.sharePublic">
      <BtnBase
        class="actions_more"
        :class="selectedItems.length > 1 ? 'disabled' : ''"
        :disabled="selectedItems.length > 1"
        :icon-mdi="MdiWebfont['dots-vertical']"
        @click.prevent="handleShowContextMenu($event)"
        @touchend.prevent="handleShowContextMenu($event)" />
    </span>
  </div>
</template>
