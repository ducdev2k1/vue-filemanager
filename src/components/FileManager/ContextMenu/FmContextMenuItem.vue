<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IContextMenu } from '@/interfaces/IAction';

  interface IProps {
    listMenus: IContextMenu[];
    onClickItem: (menuItem: IContextMenu) => void;
  }

  const props = defineProps<IProps>();
  const emits = defineEmits(['clickItem']);

  const actionContextMenuItems = computed(() => props.listMenus);
</script>

<template>
  <v-list class="c-context-menu_list shadow-xl">
    <template v-for="(item, index) in actionContextMenuItems" :key="index">
      <v-list-item
        v-if="item.visible"
        class="c-context-menu_item"
        :prepend-icon="item.icon"
        :title="item.title"
        :append-icon="item.subMenus ? MdiWebfont['menu-right-outline'] : ''"
        :disabled="item?.disabled"
        @click="onClickItem(item)">
        <template #prepend v-if="item.icon">
          <v-icon class="mr-2">{{ MdiWebfont[item.icon] || item.icon }}</v-icon>
        </template>
        <v-menu
          class="c-context-menu"
          v-if="item.subMenus && item.subMenus.length > 0"
          submenu
          activator="parent"
          open-on-hover
          :open-on-click="true">
          <v-list class="c-context-menu_list">
            <template v-for="subItem in item.subMenus" :key="subItem.key">
              <v-list-item
                class="c-context-menu_item"
                :title="subItem.title"
                @click="onClickItem(subItem)"
                :disabled="subItem?.disabled">
                <template #prepend v-if="subItem.icon">
                  <v-icon class="c-context-menu_item-icon">{{ subItem.icon || MdiWebfont[subItem.icon] }}</v-icon>
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </v-list-item>
    </template>
  </v-list>
</template>
