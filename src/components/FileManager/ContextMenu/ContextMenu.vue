<script setup lang="ts">
  import { getThumbnailIcon } from '@/components/FileManager/partial/HelperFunctionFileManager';
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  // import { IToolbarActions } from '@/interfaces';
  import { t } from '@/plugins/i18n';
  import { FilemanagerActionStore } from '@/stores/FileManagerActionStore';
  import { FileManagerStore } from '@/stores/FileManagerStore';
  // import { EnumActionFileManager } from '@/utils/MyEnum';
  import { breakPoint } from '@/utils/MyVariables';
  import { useWindowSize } from '@vueuse/core';

  interface IContextMenu {
    [key: string]: string;
  }

  const props = defineProps({
    actionContextMenuItems: {
      type: Object as PropType<IContextMenu>,
      default: [],
    },
    positionContextMenu: {
      type: Object as PropType<{ x: number; y: number }>,
      default: () => ({}),
    },
  });

  const { width } = useWindowSize();
  const fileManagerStore = FileManagerStore();
  const fileManagerActionStore = FilemanagerActionStore();
  const showContextMenu = computed(() => fileManagerActionStore.showContextMenu || false);
  const positionContextMenu = computed(() => fileManagerActionStore.positionContextMenu);
  const actionContextMenuItems = computed(() => props.actionContextMenuItems);
  const innerWidth = ref(window.innerWidth);
  const innerHeight = ref(window.innerHeight);
  const contextMenuDesktop = ref<HTMLElement | null>(null);
  const objectSelectedOne = computed(() => fileManagerStore.objectSelectedOne);

  const handleClickItem = async (menuItem: IToolbarActions) => {
    if (typeof menuItem.onClick === 'function') {
      menuItem.onClick();
      //close
      fileManagerActionStore.toggleContextMenu();
    }
  };

  const widthContextMenuDesktop = computed(() => {
    if (contextMenuDesktop.value) {
      return contextMenuDesktop.value.offsetWidth + 50;
    }
    return 350;
  });

  const heightContextMenuDesktop = computed(() => {
    if (contextMenuDesktop.value) {
      return contextMenuDesktop.value.offsetHeight + 50;
    }
    return 0;
  });

  const isMobile = computed(() => width.value <= breakPoint.brSpLandscape);
</script>

<template>
  <div
    v-if="showContextMenu && !isMobile"
    ref="contextMenuDesktop"
    class="fixed z-50"
    :style="{
      top: Math.min(positionContextMenu?.y, innerHeight - heightContextMenuDesktop) + 'px',
      left: Math.min(positionContextMenu?.x, innerWidth - widthContextMenuDesktop) + 'px',
    }">
    <ContextMenuItem :list-action="actionContextMenuItems" :onClickAction="handleClickItem" />
  </div>

  <section v-if="showContextMenu && isMobile" class="c-context-menu" :class="{ show: showContextMenu }">
    <div class="c-context-menu_overlay" @click="() => fileManagerActionStore.toggleContextMenu()"></div>
    <div class="c-context-menu_inner">
      <div class="c-context-menu_close cursor-pointer" @click="() => fileManagerActionStore.toggleContextMenu()">
        <v-icon>{{ MdiWebfont.minus }}</v-icon>
      </div>
      <div class="c-context-menu_option name-file">
        <img :src="getThumbnailIcon(objectSelectedOne)" height="46" width="46" :alt="objectSelectedOne.name" />
        <h3>{{ objectSelectedOne.name }}</h3>
      </div>
      <div class="c-context-menu_option folder-actions">
        <h4 class="c-context-menu_option-name">{{ t('locale.folder_actions') }}</h4>

        <v-list class="c-context-menu_list">
          <template
            v-for="item in actionContextMenuItems.filter(
              (action: IToolbarActions) => action.name !== EnumActionFileManager.detail,
            )">
            <!-- B: RENDER SUB MENU -->
            <template v-if="item.items && item.items.length > 0">
              <v-list-group v-if="item.visible" :key="item.name" :title="item.text" class="c-context-menu_group">
                <template #activator="{ props }">
                  <v-list-item class="c-context-menu_item" v-bind="props">
                    <template #prepend>
                      <v-icon class="c-context-menu_item-icon">{{ item.icon }}</v-icon>
                    </template>
                  </v-list-item>
                </template>
                <v-list-item
                  v-for="(subItem, index) in item.items"
                  :key="index"
                  class="c-context-menu_item"
                  :title="subItem.text"
                  @click="handleClickItem(subItem as IToolbarActions)">
                  <template #prepend>
                    <!-- <IconTag
                      v-if="
                        item.name === EnumActionFileManager.remove_tag_custom ||
                        item.name === EnumActionFileManager.assign_tag_custom
                      "
                      class="c-context-menu_item-icon"
                      :icon="item.name === EnumActionFileManager.remove_tag_custom ? 'tag-off' : 'tag'"
                      :color="(subItem as ITag).rgb" /> -->
                    <v-icon class="c-context-menu_item-icon">{{ subItem.icon }}</v-icon>
                  </template>
                </v-list-item>
              </v-list-group>
            </template>
            <!-- E: RENDER SUB MENU -->
            <template v-else>
              <v-list-item
                :key="item.name"
                v-if="item.visible"
                class="c-context-menu_item"
                :title="item.text"
                @click="handleClickItem(item)">
                <template #prepend>
                  <v-icon class="c-context-menu_item-icon">{{ item.icon }}</v-icon>
                </template>
              </v-list-item>
            </template>
          </template>
        </v-list>
      </div>
      <div class="c-context-menu_option more">
        <h4 class="c-context-menu_option-name">{{ t('locale.more') }}</h4>
        <v-list class="c-context-menu_list">
          <v-list-item
            class="c-context-menu_item"
            v-for="item in actionContextMenuItems.filter((action) => action.name === EnumActionFileManager.detail)"
            :key="item.name"
            :title="item.text"
            @click="handleClickItem(item as IToolbarActions)">
            <template #prepend>
              <v-icon class="c-context-menu_item-icon">{{ item.icon }}</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </section>
</template>
