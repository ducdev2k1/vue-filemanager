<script setup lang="ts">
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { MdiWebfont } from '../Icons/mdi-font-icons';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    loading?: boolean;
    selectedOneItem: IFileManager;
  }

  const emits = defineEmits(['close']);
</script>

<template>
  <Modal v-bind="$attrs" class="c-modal-detail w-[780px]" @close="emits('close')">
    <template #title>File details</template>
    <template #content>
      <div class="text-white flex items-center justify-center p-4">
        <div class="w-full rounded-md relative">
          <dl class="grid grid-cols-1 gap-y-4">
            <div class="flex justify-between">
              <dt class="text-white text-sm font-normal">Name</dt>
              <dd class="text-white text-sm font-extrabold truncate max-w-[180px] text-right">
                dgaskdgjlkadlkascnkldakdhka a… dq.png
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-white text-sm font-normal">Uploaded by</dt>
              <dd class="text-white text-sm font-extrabold text-right">ducdev</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-white text-sm font-normal">Location</dt>
              <dd class="text-white text-sm font-extrabold text-right">/My files</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-white text-sm font-normal">Uploaded</dt>
              <dd class="text-white text-sm font-extrabold text-right">Oct 31, 2024, 16:13</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-white text-sm font-normal">Modified</dt>
              <dd class="text-white text-sm font-extrabold text-right">Oct 30, 2024, 09:05</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-white text-sm font-normal">Type</dt>
              <dd class="text-white text-sm font-extrabold text-right">Portable Network Graphics (PNG)</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-white text-sm font-normal">MIME type</dt>
              <dd class="text-white text-sm font-extrabold text-right">image/png</dd>
            </div>
            <div class="flex justify-between items-center">
              <dt class="text-white text-sm font-normal flex items-center gap-1">
                Size
                <i class="fas fa-info-circle text-white text-[10px]"></i>
              </dt>
              <dd class="text-white text-sm font-extrabold text-right">120.71 KB</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-white text-sm font-normal">Original size</dt>
              <dd class="text-white text-sm font-extrabold text-right">101.23 KB</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-white text-sm font-normal">Last edited by</dt>
              <dd class="text-white text-sm font-extrabold text-right">ducdev2k1@gmail.com</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-white text-sm font-normal">Shared</dt>
              <dd class="text-white text-sm font-extrabold text-right">No</dd>
            </div>
          </dl>
        </div>
      </div>
    </template>
    <template #actions>
      <BtnBase :title="t('locale.close')" :icon="MdiWebfont['close']" @click="() => emits('close')" />
    </template>
  </Modal>
</template>
