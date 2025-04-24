<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { actionValidateRequired } from '@/utils/MyValidation';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    loading?: boolean;
    selectedOneItem: IFileManager;
  }

  const emits = defineEmits(['close', 'submit']);
  const props = defineProps<IProps>();

  const objectSelectedOne = computed(() => props.selectedOneItem);
  const isFolder = computed(() => objectSelectedOne.value.isDirectory);
  const textField = ref<any>(null);
  const isSystemFile = computed(() => {
    const splitName = objectSelectedOne.value.name.split('.');
    return splitName.length > 0 && splitName.length <= 2 && !splitName[0];
  });
  const isUnknownFile = computed(() => {
    const findDot = objectSelectedOne.value.name.indexOf('.');
    return findDot < 0;
  });
  const loading = computed(() => props.loading);
  const form = ref();
  const name = ref(objectSelectedOne.value.name);
  const type = ref('');

  const selectText = () => {
    if (textField.value) {
      const inputEl = textField.value.$el.querySelector('input') as HTMLInputElement | null;
      if (inputEl) inputEl.select();
    }
  };

  const handleUpdateName = async () => {
    const isValid = await form.value?.validate();
    if (isValid && name.value) {
      emits('submit', `${name.value}${type.value}`);
    }
  };

  onMounted(() => {
    if (objectSelectedOne.value.name) {
      name.value = objectSelectedOne.value.name;

      // Kiểm tra nếu không phải là thư mục và cũng không phải là file hệ thống
      if (!isFolder.value && !isSystemFile.value && !isUnknownFile.value) {
        name.value = objectSelectedOne.value.name.substring(
          objectSelectedOne.value.name.lastIndexOf('/'),
          objectSelectedOne.value.name.lastIndexOf('.'),
        );
        type.value = objectSelectedOne.value.name.substring(objectSelectedOne.value.name.lastIndexOf('.'));
      }
    }
  });
</script>
<template>
  <Modal class="w-[500px]" v-bind="$attrs" @close="emits('close')">
    <template #title>
      {{ t('locale.rename') + ' ' + t(`locale.${objectSelectedOne.isDirectory ? 'folder' : 'file'}`).toLowerCase() }}
    </template>
    <template #content>
      <v-form ref="form" @submit.prevent="handleUpdateName">
        <div>
          <DTextFieldAddon
            v-model="name"
            ref="textField"
            :error="[actionValidateRequired]"
            autofocus
            @focus="selectText"
            :label="t('locale.data_input', { data: t('locale.backend_data_name').toLowerCase() })">
            <template #append-inner>
              <span class="text-place">{{ type }}</span>
            </template>
          </DTextFieldAddon>
        </div>
        <div class="c-dialog_gr-action">
          <DBtn :title="t('locale.cancel')" :icon="MdiWebfont.close" @click="emits('close')" />
          <DBtn
            :icon="MdiWebfont['send-variant']"
            class="c-btn-primary"
            type="submit"
            :loading="loading"
            :title="t('locale.ok')" />
        </div>
      </v-form>
    </template>
  </Modal>
</template>
