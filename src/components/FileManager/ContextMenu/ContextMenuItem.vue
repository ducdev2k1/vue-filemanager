<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IToolbarActions } from '@/interfaces';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    listAction: IToolbarActions[];
    onClickAction: (menuItem: IToolbarActions, removeTag?: ITag) => void;
  }

  const props = defineProps<IProps>();

  const actionContextMenuItems = computed(() => props.listAction);

  const handleClickItem = (menuItem: IToolbarActions, removeTag?: ITag) => {
    props.onClickAction(menuItem, removeTag);
  };
</script>

<template>
  <v-list class="c-menu-down_list shadow-xl">
    <template v-for="(item, index) in actionContextMenuItems" :key="index">
      <v-list-item
        v-if="item.visible"
        class="c-menu-down_item"
        :prepend-icon="item.icon"
        :title="item.text"
        :append-icon="item.items ? MdiWebfont['menu-right-outline'] : ''"
        @click="handleClickItem(item)">
        <template #prepend>
          <v-icon class="mr-2" :class="MdiWebfont[item.icon]" />
        </template>
        <v-menu
          class="c-menu-down"
          v-if="item.items && item.items.length > 0"
          submenu
          activator="parent"
          open-on-hover
          :open-on-click="true">
          <v-list class="c-menu-down_list">
            <template v-for="subItem in item.items as IToolbarActions[] | ITag[]" :key="subItem.text">
              <v-list-item
                class="c-menu-down_item"
                :title="subItem.text"
                @click="handleClickItem(subItem as IToolbarActions, subItem as ITag)">
                <template #prepend>
                  <v-icon class="c-context-menu_item-icon">{{ subItem.icon }}</v-icon>
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </v-list-item>
    </template>
  </v-list>
</template>
