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
    search?: string;
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

  // Search functionality: Filter nodes based on search query
  const filteredItems = computed(() => {
    if (!props.search || !props.items) return props.items;

    const searchTerm = props.search.toLowerCase();

    const filterNodes = (nodes: ITreeNodeData[]): ITreeNodeData[] => {
      return nodes
        .map((node) => {
          const nodeCopy = { ...node };
          const title = node[props.itemTitle || 'name']?.toString().toLowerCase() || '';
          const matchesSearch = title.includes(searchTerm);
          let filteredChildren: ITreeNodeData[] = [];

          if (node.children) {
            filteredChildren = filterNodes(node.children);
          }

          const hasMatchingChildren = filteredChildren.length > 0;

          if (matchesSearch || hasMatchingChildren) {
            if (hasMatchingChildren) {
              nodeCopy.children = filteredChildren;
              openNodes.value.add(getValue(nodeCopy)); // Auto-expand parent of matching children
            }
            return nodeCopy;
          }
          return null;
        })
        .filter((node): node is ITreeNodeData => node !== null);
    };

    return filterNodes(props.items);
  });

  // Watch for search changes to reset open nodes if needed
  watch(
    () => props.search,
    (newSearch) => {
      if (!newSearch) {
        openNodes.value.clear(); // Clear open nodes when search is cleared
      }
    },
  );
</script>

<template>
  <div class="d-treeview">
    <ul class="d-treeview-list">
      <DTreeviewNode
        v-for="item in filteredItems"
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
