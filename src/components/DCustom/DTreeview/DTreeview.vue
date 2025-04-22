<template>
  <ul class="d-treeview">
    <DTreeviewNode
      v-for="item in items"
      :key="getValue(item)"
      :node="item"
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
</template>

<script setup lang="ts">
  export interface TreeNodeData {
    [key: string]: any;
  }

  const props = defineProps<{
    items: TreeNodeData[];
    itemTitle?: string;
    itemValue?: string;
    itemProps?: (item: TreeNodeData) => Record<string, any>;
    activatable?: boolean;
    activeClass?: string;
    loadChildren?: (item: TreeNodeData) => Promise<TreeNodeData[]>;
    modelValue?: string[]; // v-model:activated
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void;
  }>();

  const openNodes = ref<Set<string>>(new Set());

  const activated = ref<string[]>(props.modelValue ?? []);

  watch(
    () => props.modelValue,
    (val) => {
      if (val) activated.value = val;
    },
  );

  const getValue = (item: TreeNodeData): string => (props.itemValue ? item[props.itemValue] : item.id);

  const toggleNode = (id: string) => {
    if (openNodes.value.has(id)) {
      openNodes.value.delete(id);
    } else {
      openNodes.value.add(id);
    }
  };

  const handleActivate = (id: string) => {
    activated.value = [id];
    emit('update:modelValue', activated.value);
  };
</script>

<style scoped lang="scss">
  .d-treeview {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
    max-height: 600px;
    min-height: 240px;
    overflow-y: auto;

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
  }
</style>
