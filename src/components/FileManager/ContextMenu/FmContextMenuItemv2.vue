<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IContextMenu } from '@/interfaces/IAction';

  interface IProps {
    listMenus?: IContextMenu[];
    onClickItem: (menuItem: IContextMenu) => void;
    title: string;
    icon?: string;
    key: string;
    visible?: boolean;
    subMenus?: IContextMenu[];
  }

  const props = defineProps<IProps>();
  const emits = defineEmits(['clickItem']);

  const actionContextMenuItems = computed(() => props.listMenus);
</script>

<template>
  <v-list class="c-menu-down_list shadow-xl">
    <v-list-item class="c-menu-down_item">
      <template #prepend v-if="props.icon">
        <v-icon class="mr-2">{{ MdiWebfont[props.icon] || props.icon }}</v-icon>
      </template>
      <span>{{ props.title }}</span>
      <v-icon class="ml-auto" v-if="props.subMenus && props.subMenus.length > 0">
        {{ MdiWebfont['menu-right-outline'] }}
      </v-icon>
      <v-menu
        class="c-menu-down"
        submenu
        activator="parent"
        open-on-hover
        :open-on-click="true"
        v-if="props.subMenus && props.subMenus.length > 0">
        <slot v-if="$slots['subMenuItem']" name="subMenuItem" />
        <!-- <v-list class="c-menu-down_list">
          <template v-for="subItem in item.subMenus" :key="subItem.key">
            <v-list-item class="c-menu-down_item" :title="subItem.title" @click="onClickItem(subItem)">
              <template #prepend v-if="subItem.icon">
                <v-icon class="c-context-menu_item-icon">{{ subItem.icon || MdiWebfont[subItem.icon] }}</v-icon>
              </template>
            </v-list-item>
          </template>
        </v-list> -->
      </v-menu>
    </v-list-item>

    <!-- <template v-for="(item, index) in actionContextMenuItems" :key="index">
      <v-list-item
        v-if="item.visible"
        class="c-menu-down_item"
        :prepend-icon="item.icon"
        :title="item.title"
        :append-icon="item.subMenus ? MdiWebfont['menu-right-outline'] : ''"
        @click="onClickItem(item)">
        <template #prepend v-if="item.icon">
          <v-icon class="mr-2">{{ MdiWebfont[item.icon] || item.icon }}</v-icon>
        </template>
        <v-menu
          class="c-menu-down"
          v-if="item.subMenus && item.subMenus.length > 0"
          submenu
          activator="parent"
          open-on-hover
          :open-on-click="true">
          <v-list class="c-menu-down_list">
            <template v-for="subItem in item.subMenus" :key="subItem.key">
              <v-list-item class="c-menu-down_item" :title="subItem.title" @click="onClickItem(subItem)">
                <template #prepend v-if="subItem.icon">
                  <v-icon class="c-context-menu_item-icon">{{ subItem.icon || MdiWebfont[subItem.icon] }}</v-icon>
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </v-list-item>
    </template> -->
  </v-list>
</template>
