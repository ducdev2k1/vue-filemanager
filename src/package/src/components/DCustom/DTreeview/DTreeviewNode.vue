<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { ITreeNodeData } from '@/interfaces';
  import { ITreeViewProps } from './DTreeview.vue';

  interface ITreeviewNodeProps extends ITreeViewProps {
    node: ITreeNodeData;
    openNodes: Set<string>;
    activeNode: string[];
  }

  const props = withDefaults(defineProps<ITreeviewNodeProps>(), {
    itemTitle: 'name',
    itemValue: 'path',
    multiple: false,
  });

  const emit = defineEmits(['toggle', 'activate']);
  const isLoading = ref(false);

  const getValue = (item: ITreeNodeData): string => (props.itemValue ? item[props.itemValue] : item[props.itemTitle]);

  const isOpen = computed(() => props.openNodes.has(getValue(props.node)));
  const isActive = computed(() => props.activeNode.length > 0 && props.activeNode.includes(getValue(props.node)));
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

  const handleClick = (node: ITreeNodeData) => {
    if (props.activatable) {
      emit('activate', getValue(node));
    }
  };

  const nodeProps = computed(() => (props.itemProps ? props.itemProps(props.node) : {}));
</script>

<template>
  <li class="d-treeview-item">
    <div
      class="d-treeview-item-content"
      :class="[{ [activeClass || 'active']: isActive }]"
      @click="handleClick(node)"
      v-bind="nodeProps">
      <div class="d-treeview-item--prepend">
        <!-- Checkbox cho chế độ chọn nhiều -->
        <input
          v-if="multiple"
          type="checkbox"
          :checked="isActive"
          @click.stop="handleClick(node)"
          class="d-treeview-checkbox" />
        <CircularLoader v-if="isLoading" :strokeWidth="2" width="20px" />
        <DBtnIcon v-else :icon="isOpen ? MdiWebfont['menu-down'] : MdiWebfont['menu-right']" @click.stop="toggle" />
        <slot name="prepend" :item="node" :isOpen="isOpen">
          <span v-if="!$slots.prepend" @click.stop="toggle">
            {{ isOpen ? '📂' : '📁' }}
          </span>
        </slot>
      </div>

      <span>{{ node[itemTitle] }}</span>
    </div>

    <ul v-if="isOpen && hasChildren" class="d-treeview-list">
      <DTreeviewNode
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
        <template #prepend="slotProps: any">
          <slot name="prepend" v-bind="slotProps" />
        </template>
      </DTreeviewNode>
    </ul>
  </li>
</template>
