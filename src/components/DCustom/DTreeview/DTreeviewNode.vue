<template>
  <li>
    <div
      class="flex items-center gap-1 cursor-pointer"
      :class="[{ [activeClass || 'active']: isActive }]"
      @click="handleClick"
      v-bind="nodeProps">
      <span v-if="hasChildren" @click.stop="toggle">
        {{ isOpen ? '📂' : '📁' }}
      </span>
      <span v-else>📄</span>

      <slot name="prepend" :item="node" :isOpen="isOpen" />

      <span>{{ node[itemTitle] }}</span>
    </div>

    <ul v-if="isOpen && node.children?.length" class="pl-4">
      <TreeNode
        v-for="child in node.children"
        :key="getValue(child)"
        :node="child"
        :item-title="itemTitle"
        :item-value="itemValue"
        :item-props="itemProps"
        :load-children="loadChildren"
        :open-nodes="openNodes"
        :active-node="activeNode"
        :activatable="activatable"
        :active-class="activeClass"
        @toggle="$emit('toggle', $event)"
        @activate="$emit('activate', $event)">
        <template #prepend="slotProps">
          <slot name="prepend" v-bind="slotProps" />
        </template>
      </TreeNode>
    </ul>
  </li>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { TreeNodeData } from './CustomTreeView.vue';

  const props = defineProps<{
    node: TreeNodeData;
    itemTitle?: string;
    itemValue?: string;
    itemProps?: (item: TreeNodeData) => Record<string, any>;
    loadChildren?: (item: TreeNodeData) => Promise<TreeNodeData[]>;
    openNodes: Set<string>;
    activeNode: string[];
    activatable?: boolean;
    activeClass?: string;
  }>();

  const emit = defineEmits<{
    (e: 'toggle', id: string): void;
    (e: 'activate', id: string): void;
  }>();

  const isLoading = ref(false);

  const getValue = (item: TreeNodeData): string => (props.itemValue ? item[props.itemValue] : item.id);

  const isOpen = computed(() => props.openNodes.has(getValue(props.node)));
  const isActive = computed(() => props.activeNode.includes(getValue(props.node)));
  const hasChildren = computed(() => props.node.children?.length || props.node.hasChildren);

  const toggle = async () => {
    const id = getValue(props.node);
    if (!isOpen.value && props.loadChildren && !props.node.children) {
      isLoading.value = true;
      const children = await props.loadChildren(props.node);
      props.node.children = children;
      isLoading.value = false;
    }
    emit('toggle', id);
  };

  const handleClick = () => {
    if (props.activatable) {
      emit('activate', getValue(props.node));
    }
  };

  const nodeProps = computed(() => (props.itemProps ? props.itemProps(props.node) : {}));
</script>

<style scoped lang="scss">
  li {
    padding-left: 20px;
    display: flex;
    flex-direction: column;

    &.active {
      background-color: #e0f7fa;
    }

    .flex {
      display: flex;
      align-items: center;
    }

    .cursor-pointer {
      cursor: pointer;
    }

    .hover\:bg-gray-100 {
      &:hover {
        background-color: #f7fafc;
      }
    }

    .rounded {
      border-radius: 4px;
    }

    .pl-4 {
      padding-left: 16px;
    }

    .px-1 {
      padding-left: 4px;
      padding-right: 4px;
    }

    .gap-1 {
      gap: 4px;
    }

    .items-center {
      justify-content: center;
    }

    .active {
      background-color: #d3f9f7;
    }
  }
</style>
