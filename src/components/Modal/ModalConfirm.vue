<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { EnumTypeConfirm } from '@/utils/MyEnum';
  import { getThumbnailIcon } from '../FileManager/partial/HelperFunctionFileManager';
  // import { FileManagerStore } from '@/stores/user/file-manager-store';
  // import { EnumTypeConfirm } from '@/utils/my-enum';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    typeModal: EnumTypeConfirm;
    selectedItems: IFileManager[];
    description?: string;
    title?: string;
    loading?: boolean;
    permanently?: boolean;
    textBtnSubmit?: string;
  }

  const props = defineProps<IProps>();
  const emits = defineEmits(['close', 'submit']);
  const selectedItems = computed(() => props.selectedItems);
  const typeConfirm = computed(() => props.typeModal || EnumTypeConfirm.info);
  const descriptionModal = computed(() => (props.description as string) || '');
  const loading = computed(() => props.loading as boolean);
  const permanently = computed(() => props.permanently as boolean);
  const classModal = ref<string>('');
  const title = computed(() => props.title as string);
  const titleModal = ref<string>('');
  const iconModal = ref<string>('');
  const textBtnSubmit = computed(() => props.textBtnSubmit as string);
  const countRemainingFile = computed(() => {
    let count = 0;
    if (selectedItems.value.length > 5) {
      selectedItems.value.forEach((file, index) => {
        if (index > 4) {
          count += 1;
        }
      });
    }
    return count;
  });
  const visibleFiles = computed(() => {
    return countRemainingFile.value > 0 ? selectedItems.value.slice(0, 5) : selectedItems.value;
  });

  const hasRemainingFiles = computed(() => countRemainingFile.value > 0);

  const titleButtonSubmit = computed(() =>
    typeConfirm.value === EnumTypeConfirm.delete
      ? permanently.value
        ? t('locale.permanently_delete')
        : t('locale.remove')
      : t('locale.ok'),
  );
  const CheckModal = () => {
    switch (typeConfirm.value) {
      case EnumTypeConfirm.create:
        titleModal.value = 'locale.create_object_custom';
        iconModal.value = 'FilePlus2';
        classModal.value = 'success';
        break;
      case EnumTypeConfirm.info:
        titleModal.value = 'locale.data_infor';
        iconModal.value = 'Info';
        classModal.value = 'primary';
        break;
      case EnumTypeConfirm.error:
        titleModal.value = 'locale.error';
        iconModal.value = 'AlertOctagon';
        classModal.value = 'error';
        break;
      case EnumTypeConfirm.success:
        titleModal.value = 'locale.success';
        iconModal.value = 'CheckCircle';
        classModal.value = 'success';
        break;
      case EnumTypeConfirm.warning:
        titleModal.value = 'locale.warning';
        iconModal.value = 'AlertTriangle';
        classModal.value = 'warning';
        break;
      case EnumTypeConfirm.delete:
        titleModal.value = 'locale.delete';
        iconModal.value = 'Trash';
        classModal.value = 'error';
        break;
      case EnumTypeConfirm.confirm:
        titleModal.value = 'locale.confirm';
        iconModal.value = 'AlertCircle';
        classModal.value = 'warning';
        break;
    }
  };

  onMounted(() => {
    CheckModal();
  });
</script>
<template>
  <Modal v-bind="$attrs" class="c-modal-confirm" @close="emits('close')">
    <template #title>
      <template v-if="!$slots.title">
        <template v-if="typeConfirm == EnumTypeConfirm.delete">
          {{ permanently ? t('locale.permanently_delete') : t('locale.trash') }}
        </template>
        <h3 v-else class="c-modal-confirm_title">{{ title || t(titleModal) }}</h3>
      </template>
      <template v-else>
        <slot name="title" />
      </template>
    </template>

    <template #content>
      <div>
        <template v-if="!$slots.description">
          <template v-if="typeConfirm !== EnumTypeConfirm.delete">
            <div class="flex items-start gap-4">
              <div class="c-modal-confirm_content">
                <p class="desc whitespace-pre-wrap">{{ descriptionModal }}</p>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="c-modal-confirm_delete">
              <template v-if="selectedItems.length > 0">
                <div class="c-modal-confirm_delete-content">
                  <d-alert-message
                    type="error"
                    :text="permanently ? t('locale.permanently_delete_content') : t('locale.delete_object_and_share')"
                    :btn-close="false" />
                  <d-list class="mt-3">
                    <d-list-item v-for="(file, index) in visibleFiles" :key="index" :title="file.name">
                      <template #prepend>
                        <d-icon :icon="getThumbnailIcon(file)" />
                      </template>
                    </d-list-item>
                    <d-list-item
                      v-if="hasRemainingFiles"
                      :title="`...${t('locale.data_remaining_file', { data: countRemainingFile })}`" />
                  </d-list>
                </div>
              </template>
            </div>
          </template>
        </template>
        <template v-else>
          <slot name="description" />
        </template>
      </div>
    </template>
    <template #actions>
      <template v-if="!$slots.actions">
        <template v-if="typeConfirm === EnumTypeConfirm.cancel">
          <DBtn
            class="d-btn-primary mr-4"
            :title="t('locale.data_resume', { data: t('locale.upload_custom').toLowerCase() })"
            :icon-mdi="MdiWebfont['cloud-upload-outline']"
            @click="emits('close')" />

          <DBtn class="d-btn-danger" :title="t('locale.cancel_upload')" icon="X" @click="emits('submit')" />
        </template>
        <template v-else>
          <DBtn cancel :title="t('locale.cancel')" :icon="MdiWebfont.close" @click="emits('close')" />
          <DBtn
            :danger="typeConfirm === EnumTypeConfirm.delete"
            :primary="typeConfirm !== EnumTypeConfirm.delete"
            :title="textBtnSubmit || titleButtonSubmit"
            :icon="
              MdiWebfont[
                typeConfirm === EnumTypeConfirm.delete
                  ? permanently
                    ? 'delete-forever-outline'
                    : 'delete'
                  : 'send-variant-outline'
              ]
            "
            :loading="loading"
            :disabled="loading"
            @click="emits('submit')" />
        </template>
      </template>
      <template v-else>
        <slot name="actions" />
      </template>
    </template>
  </Modal>
</template>
