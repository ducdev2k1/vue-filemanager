import { handleQueryAccessFile } from '@/components/v1/FileManager/partial/HelperFunctionFileManager';
import { IFileManager } from '@/interfaces/IFileManager';
import { ITag } from '@/interfaces/ITag';
import { t } from '@/plugins/i18n';
import { CollaboraStore } from '@/stores/user/collabora-store';
import { FileManagerActionStore } from '@/stores/user/file-manager-action-store';
import { FileManagerStore } from '@/stores/user/file-manager-store';
import { TagStore } from '@/stores/user/tag-store';
import { UploadFileStore } from '@/stores/user/upload-file-store';
import { EnumShareFileType, EnumStatusHttpResponse } from '@/utils/my-enum';
import { fmCheckIsDirectory, getNestedPropValue, showToastMessage } from '@/utils/my-function';
import { myRoute } from '@/utils/my-route';
import { baseUrl, mimeType } from '@/utils/my-variables';

export async function fmActionDownloadFile(selectedItems: IFileManager[]) {
  const generateDownloadByClicked = (downloadUrl: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', ''); // Thuộc tính download sẽ kích hoạt chế độ tải xuống
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Neu selected nhieu hon 1 ===> chi ap dung download private
  if (selectedItems.length > 1) {
    const fileManagerStore = FileManagerStore();
    const response = await fileManagerStore.actionGeneratedDownloadIdMultipleFile(
      selectedItems.map((value) => {
        return {
          path: value.path,
          share_id: value.share_id,
        } as IFileManager;
      }),
    );
    if (response) {
      const downloadUrl = `${window.location.origin}/api/v1/user-fm-download-by-id-multiple-file?download_id=${response}`;
      generateDownloadByClicked(downloadUrl);
    }
  } else {
    selectedItems.forEach((item) => {
      const urlPublic = `${window.location.origin}/api/v1/user-fm-download-share-file-public`;
      const urlPrivate = `${window.location.origin}/api/v1/user-fm-download-file`;
      const downloadUrl = `${handleQueryAccessFile(item.share_type === EnumShareFileType.public ? urlPublic : urlPrivate, item)}`;
      generateDownloadByClicked(downloadUrl);
    });
  }
}

export async function fmActionOpenFile(dataItem: IFileManager, routePath?: string) {
  const collaboraStore = CollaboraStore();
  const fileManagerActionStore = FileManagerActionStore();
  const fileManagerStore = FileManagerStore();

  // Nếu có nhiều hơn 1 mục được chọn thì không thực hiện tiếp
  if (fileManagerStore.selectedItems.length > 1) return;

  const { path, mime_type, isDirectory } = dataItem;

  // Nếu không có path, đang là thư mục hoặc đang ở thùng rác thì dừng thực hiện
  if (!path || isDirectory || routePath === myRoute.trash) return;

  // Kiểm tra xem file có thuộc nhóm mở trực tiếp hay không
  const shouldOpenDirectly =
    mimeType.PDF.includes(mime_type) ||
    mimeType.IMAGE.includes(mime_type) ||
    mimeType.VIDEO.includes(mime_type) ||
    mimeType.AUDIO.includes(mime_type) ||
    mimeType.TEXT_CODE.includes(mime_type);

  if (shouldOpenDirectly) {
    const newUrl = handleQueryAccessFile(`${baseUrl}${myRoute.open}`, dataItem);
    window.open(newUrl, '_blank');
    return;
  }

  // Xử lý mở file Office qua Collabora
  await collaboraStore.actionCollaboraUrlService(path, mime_type, dataItem.share_id);
  if (collaboraStore.collaboraUrl && collaboraStore.collaboraToken) {
    const newUrl = handleQueryAccessFile(`${baseUrl}${myRoute.office}`, dataItem);
    window.open(newUrl, '_blank');
  } else {
    fileManagerActionStore.toggleModalError();
  }
}

export async function fmActionCopyFile(sourceItem: IFileManager, newPath: string) {
  const fileManagerStore = FileManagerStore();
  const oldPath = getNestedPropValue(sourceItem, 'path');
  if (!newPath || !oldPath) {
    showToastMessage(t('locale.backend_object_not_existed'), true);
    return;
  }
  const request = {
    path: `${newPath}${sourceItem.name}`,
    old_path: oldPath,
    size: sourceItem.size,
  } as IFileManager;
  const result = await fileManagerStore.actionCopyFile(request);
  if (result) {
    // success
    showToastMessage(t('locale.copied_success'));
    return EnumStatusHttpResponse.success;
  }
}

export async function fmActionMoveFile(sourceItem: IFileManager, newPath: string) {
  const fileManagerStore = FileManagerStore();
  const oldPath = getNestedPropValue(sourceItem, 'path');
  if (!oldPath) {
    showToastMessage(t('locale.backend_object_not_existed'), true);
    return;
  }
  const destinationPath = fmCheckIsDirectory(sourceItem.path)
    ? `${newPath}${sourceItem.name}/`
    : `${newPath}${sourceItem.name}`;
  const request = {
    path: destinationPath,
    old_path: oldPath,
    size: sourceItem.size,
    force_action: true,
    meta_uuid: sourceItem.meta_uuid,
    lastModified: sourceItem.lastModified,
  } as IFileManager;
  const result = await fileManagerStore.actionMoveFile(request);
  // Check if the file already exists and show a modal if true
  if (result === 'backend_object_existed') {
    showToastMessage(t('locale.backend_object_existed'));
  } else if (result === 'backend_saved_success') {
    showToastMessage(t('locale.backend_moved_success'));
    return EnumStatusHttpResponse.success;
  }
}

export async function fmActionAssignTag(selectedItems: IFileManager[], tag: ITag) {
  const tagStore = TagStore();
  // const fileManagerStore = FileManagerStore();

  if (selectedItems.length > 0) {
    // init request
    const request = {
      paths: selectedItems.map((value) => value.path) as string[],
      tag_id: tag._id,
    } as IFileManager;
    // call request
    const response = await tagStore.actionAssignTag(request);
    if (response) {
      showToastMessage(t('locale.action_success', { action: t('locale.assign_tag_custom') }));
      selectedItems.forEach((value) => (value.tags = [...value.tags, tag]));
    }
  }
}

export async function fmActionRemoveTag(objectSelectedOne: IFileManager, tag: ITag) {
  const tagStore = TagStore();
  if (!objectSelectedOne.path) {
    return;
  }
  const request = {
    path: objectSelectedOne.path,
    tag_id: tag._id,
  } as IFileManager;

  const response = await tagStore.actionRemoveTag(request);
  if (response) {
    showToastMessage(
      t('locale.data_delete', { data: t('locale.tag').toLowerCase() + ' ' + t('locale.success').toLowerCase() }),
    );
    objectSelectedOne.tags = objectSelectedOne.tags.filter((t) => t._id !== tag._id);
  }
}

export async function fmActionRestoreTrash(selectedItems: IFileManager[]) {
  const fileManagerStore = FileManagerStore();
  const uploadFileStore = UploadFileStore();
  // Construct the request object for renaming the file
  const request = selectedItems.map((item) => {
    return {
      path: item.path,
      meta_uuid: item.meta_uuid,
      name: item.name,
      size: item.size,
      lastModified: item.lastModified,
    };
  }) as IFileManager[];

  // Call the file renaming action in the file manager store
  const result = await fileManagerStore.actionRestoreTrashFile(request);
  if (result && result.length > 0) {
    uploadFileStore.actionForceRefreshFileManager();
  }
}

export async function fmActionMoveTrashFile(selectedItems: Ref<IFileManager[]>, emits: any) {
  const fileManagerStore = FileManagerStore();
  const fileManagerActionStore = FileManagerActionStore();
  // Construct the request object for renaming the file
  const request = selectedItems.value.map((item) => {
    return {
      path: item.path,
      meta_uuid: item.meta_uuid,
      name: item.name,
      size: item.size,
      lastModified: item.lastModified,
    };
  }) as IFileManager[];

  // Call the file renaming action in the file manager store
  const result = await fileManagerStore.actionMoveTrashFile(request);
  if (result && result.length > 0) {
    emits('actionCallbackSuccess');
    fileManagerActionStore.toggleModalMoveTrashFile();

    // Set the list of items to be deleted
    fileManagerStore.actionSetListItemDelete(result);
  }
}
