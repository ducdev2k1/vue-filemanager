<script setup lang="ts">
  import { ITreeNodeData } from '@/interfaces';

  export interface ITreeViewProps {
    itemTitle?: string;
    itemValue?: string;
    itemProps?: (item: ITreeNodeData) => Record<string, any>;
    loadChildren?: (item: ITreeNodeData) => Promise<void>;
    activatable?: boolean;
    activeClass?: string;
    modelValue?: string[];
    items?: ITreeNodeData[];
    multiple?: boolean;
  }

  const props = withDefaults(defineProps<ITreeViewProps>(), {
    itemTitle: 'name',
    itemValue: 'path',
    multiple: false,
  });

  const emit = defineEmits(['update:activated', 'toggle']);

  const openNodes = ref<Set<string>>(new Set());
  const activated = ref<string[]>(props.modelValue ?? []);

  watch(
    () => props.modelValue,
    (val) => {
      if (val) activated.value = val;
    },
  );

  const getValue = (item: ITreeNodeData): string => (props.itemValue ? item[props.itemValue] : item.id);

  const toggleNode = (id: string) => {
    if (openNodes.value.has(id)) {
      openNodes.value.delete(id);
    } else {
      openNodes.value.add(id);
    }
  };

  const handleActivate = (item: string) => {
    if (props.multiple) {
      // Chế độ chọn nhiều: Thêm hoặc xóa item khỏi activated
      const index = activated.value.indexOf(item);
      index === -1
        ? (activated.value = [...activated.value, item])
        : (activated.value = activated.value.filter((id) => id !== item));
    } else {
      item === activated.value[0] ? (activated.value = []) : (activated.value = [item]);
    }
    emit('update:activated', activated.value);
  };
</script>

<template>
  <div class="d-treeview">
    <ul class="d-treeview-list">
      <DTreeviewNode
        v-for="item in items"
        :key="getValue(item)"
        :node="item"
        :multiple="multiple"
        :item-title="itemTitle"
        :item-value="itemValue"
        :item-props="itemProps"
        :load-children="loadChildren"
        :open-nodes="openNodes"
        :active-node="activated"
        :activatable="activatable"
        :active-class="activeClass"
        @toggle="toggleNode"
        @activate="handleActivate">
        <template #prepend="slotProps">
          <slot name="prepend" v-bind="slotProps" />
        </template>
      </DTreeviewNode>
    </ul>
  </div>
</template>
