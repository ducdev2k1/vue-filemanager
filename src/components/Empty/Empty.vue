<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { t } from '@/plugins/i18n';
  import { EnumEmpty } from '@/utils/MyEnum';
  import { svg_no_data, svg_search } from './EmptyImage';

  defineOptions({
    inheritAttrs: false,
  });

  interface IEmpty {
    typeEmpty: EnumEmpty;
    hideButton?: boolean | string;
    title?: string;
    description?: string;
  }

  const emits = defineEmits(['callBack']);
  const props = withDefaults(defineProps<IEmpty>(), {
    typeEmpty: EnumEmpty.no_data,
    hideButton: false,
  });
  const hideButton = computed(() => props.hideButton);
  const typeEmpty = computed(() => props.typeEmpty);
  const title = computed(() => props.title);
  const description = computed(() => props.description);

  const icon = computed(() => {
    let svg = svg_no_data;
    switch (typeEmpty.value) {
      case EnumEmpty.no_data:
        svg = svg_no_data;
        break;
      case EnumEmpty.search:
        svg = svg_search;
        break;
    }
    return svg;
  });

  const contentEmpty = computed(() => {
    if (typeEmpty.value === EnumEmpty.search) {
      return {
        title: title.value || t('locale.no_data_search'),
        description: description.value || t('locale.no_data_search_desc'),
        titleBtn: t('locale.select_add_new_button'),
        iconBtn: MdiWebfont.magnify,
      };
    }
    return {
      title: title.value || t('locale.noDataText'),
      description: description.value || t('locale.no_data_desc'),
      titleBtn: t('locale.select_add_new_button'),
      iconBtn: MdiWebfont['cloud-upload-outline'],
    };
  });
</script>

<template>
  <div class="c-empty" v-bind="$attrs">
    <img :src="icon" :alt="typeEmpty" width="250" height="200" draggable="false" />
    <slot name="title">
      <h3 class="c-empty_title">
        {{ contentEmpty.title }}
      </h3>
    </slot>
    <slot name="description">
      <p class="c-empty_desc">{{ contentEmpty.description }}</p>
    </slot>
    <DBtn
      v-if="!hideButton && !$slots['empty.btn']"
      class="c-empty_button"
      @click.prevent="emits('callBack')"
      :title="contentEmpty.titleBtn"
      :icon-mdi="contentEmpty.iconBtn" />

    <slot v-if="$slots['empty.btn']" name="empty.btn" />
  </div>
</template>
