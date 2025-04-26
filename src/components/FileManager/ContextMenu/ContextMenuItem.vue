<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IActionFM } from '@/interfaces';

  interface IProps {
    listMenus: IActionFM[];
    onClickItem: (menuItem: IActionFM) => void;
  }

  const props = defineProps<IProps>();
  const emits = defineEmits(['clickItem']);

  const actionContextMenuItems = computed(() => props.listMenus);
</script>

<template>
  <d-list class="c-context-menu_list shadow-xl">
    <template v-for="(item, index) in actionContextMenuItems" :key="index">
      <d-list-item
        v-if="item.visible"
        class="c-context-menu_item"
        :prepend-icon="item.icon"
        :title="item.title"
        :append-icon="item.subMenus ? MdiWebfont['menu-right-outline'] : ''"
        :disabled="item?.disabled"
        @click="onClickItem(item)">
        <!-- <template #prepend v-if="item.icon">
          <d-icon class="mr-2 mdi" :icon="MdiWebfont[item.icon] || item.icon" />
        </template> -->
        <d-menu
          class="c-context-menu"
          v-if="item.subMenus && item.subMenus.length > 0"
          submenu
          activator="parent"
          open-on-hover
          :open-on-click="true">
          <d-list class="c-context-menu_list">
            <template v-for="subItem in item.subMenus" :key="subItem.key">
              <d-list-item
                class="c-context-menu_item"
                :title="subItem.title"
                @click="onClickItem(subItem)"
                :disabled="subItem?.disabled">
                <template #prepend v-if="subItem.icon">
                  <d-icon class="c-context-menu_item-icon" :icon="subItem.icon || MdiWebfont[subItem.icon]" />
                </template>
              </d-list-item>
            </template>
          </d-list>
        </d-menu>
      </d-list-item>
    </template>
  </d-list>
</template>
