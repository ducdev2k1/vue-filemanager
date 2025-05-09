<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    loading?: boolean;
    selectedOneItem: IFileManager;
  }
  const props = withDefaults(defineProps<IProps>(), {
    loading: false,
  });

  const emits = defineEmits(['close']);
  const selectedOneItem = computed(() => props.selectedOneItem);
</script>

<template>
  <Modal v-bind="$attrs" class="c-detail-modal" :max-width="580" @close="emits('close')">
    <template #title>File details</template>
    <template #content>
      <div class="c-detail-modal-content">
        <div class="c-detail-content-wrapper">
          <dl class="c-detail-list">
            <div class="c-detail-item">
              <dt class="c-detail-label">Name</dt>
              <dd class="c-detail-value truncate">
                {{ selectedOneItem.name || 'dgaskdgjlkadlkascnkldakdhka a… dq.png' }}
              </dd>
            </div>
            <div class="c-detail-item">
              <dt class="c-detail-label">Uploaded by</dt>
              <dd class="c-detail-value">{{ selectedOneItem.uploadedBy || 'ducdev' }}</dd>
            </div>
            <div class="c-detail-item">
              <dt class="c-detail-label">Location</dt>
              <dd class="c-detail-value">{{ selectedOneItem.location || '/My files' }}</dd>
            </div>
            <div class="c-detail-item">
              <dt class="c-detail-label">Uploaded</dt>
              <dd class="c-detail-value">{{ selectedOneItem.uploadedAt || 'Oct 31, 2024, 16:13' }}</dd>
            </div>
            <div class="c-detail-item">
              <dt class="c-detail-label">Modified</dt>
              <dd class="c-detail-value">{{ selectedOneItem.modifiedAt || 'Oct 30, 2024, 09:05' }}</dd>
            </div>
            <div class="c-detail-item">
              <dt class="c-detail-label">Type</dt>
              <dd class="c-detail-value">{{ selectedOneItem.type || 'Portable Network Graphics (PNG)' }}</dd>
            </div>
            <div class="c-detail-item">
              <dt class="c-detail-label">MIME type</dt>
              <dd class="c-detail-value">{{ selectedOneItem.mimeType || 'image/png' }}</dd>
            </div>
            <div class="c-detail-item c-detail-item-with-icon">
              <dt class="c-detail-label c-detail-label-with-icon">
                Size
                <i class="fas fa-info-circle"></i>
              </dt>
              <dd class="c-detail-value">{{ selectedOneItem.size || '120.71 KB' }}</dd>
            </div>
            <div class="c-detail-item">
              <dt class="c-detail-label">Original size</dt>
              <dd class="c-detail-value">{{ selectedOneItem.originalSize || '101.23 KB' }}</dd>
            </div>
            <div class="c-detail-item">
              <dt class="c-detail-label">Last edited by</dt>
              <dd class="c-detail-value">{{ selectedOneItem.lastEditedBy || 'ducdev2k1@gmail.com' }}</dd>
            </div>
            <div class="c-detail-item">
              <dt class="c-detail-label">Shared</dt>
              <dd class="c-detail-value">{{ selectedOneItem.shared ? 'Yes' : 'No' }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </template>
    <template #actions>
      <DBtn cancel :title="t('locale.close')" :icon="MdiWebfont['close']" @click="() => emits('close')" />
    </template>
  </Modal>
</template>
