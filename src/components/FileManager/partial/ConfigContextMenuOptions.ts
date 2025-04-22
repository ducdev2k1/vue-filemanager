import {
  fmActionAssignTag,
  fmActionDownloadFile,
  fmActionOpenFile,
  fmActionRemoveTag,
  fmActionRestoreTrash,
} from '@/components/v1/FileManager/partial/ConfigActionFileManager';
import { hasPermissionByAction, openFileWithTool } from '@/components/v1/FileManager/partial/HelperFunctionFileManager';
import { MdiWebfont } from '@/components/v1/Icons/mdi-font-icons';
import { IToolbarActions } from '@/interfaces';
import { ITag } from '@/interfaces/ITag';
import { t } from '@/plugins/i18n';
import { DetailFileStore } from '@/stores/user/detail-file-store';
import { FileManagerActionStore } from '@/stores/user/file-manager-action-store';
import { FileManagerStore } from '@/stores/user/file-manager-store';
import { TagStore } from '@/stores/user/tag-store';
import { EnumActionFileManager, EnumOpenTool } from '@/utils/my-enum';
import { myRoute } from '@/utils/my-route';

export const configContextMenuOptions = (path: string, params: string, typeContext: boolean) => {
  const fileManagerStore = FileManagerStore();
  const detailFileStore = DetailFileStore();
  const fileManagerActionStore = FileManagerActionStore();
  const tagStore = TagStore();
  const tagList = computed(() => tagStore.tagList as ITag[]);

  const onItemSelectionDetailFile = () => {
    fileManagerStore.actionSetObjectSelectedOne(fileManagerStore.objectSelectedOne);
    detailFileStore.ShowDetailFile();
  };

  // Helper to create "open_with" submenu
  const createOpenWithItems = () => [
    {
      visible: computed(() =>
        fileManagerStore.selectedItems.every((item) =>
          hasPermissionByAction(EnumActionFileManager.open_with_new_tab, item.permission),
        ),
      ).value,
      name: EnumActionFileManager.open_with_new_tab,
      text: computed(() => t('locale.open_with_new_tab')).value,
      icon: MdiWebfont['open-in-new'],
      onClick: () => fmActionOpenFile(fileManagerStore.objectSelectedOne),
    },
    {
      visible: computed(() =>
        fileManagerStore.selectedItems.every((item) =>
          hasPermissionByAction(EnumActionFileManager.open_with_image, item.permission),
        ),
      ).value,
      name: EnumActionFileManager.open_with_image,
      text: computed(() => t('locale.photo')).value,
      icon: MdiWebfont['image-outline'],
      onClick: () => openFileWithTool(EnumOpenTool.image, fileManagerStore.objectSelectedOne),
    },
    {
      visible: computed(() =>
        fileManagerStore.selectedItems.every((item) =>
          hasPermissionByAction(EnumActionFileManager.open_with_pdf, item.permission),
        ),
      ).value,
      name: EnumActionFileManager.open_with_pdf,
      text: 'PDF',
      icon: MdiWebfont['file-pdf-box'],
      onClick: () => openFileWithTool(EnumOpenTool.pdf, fileManagerStore.objectSelectedOne),
    },
    {
      visible: computed(() =>
        fileManagerStore.selectedItems.every((item) =>
          hasPermissionByAction(EnumActionFileManager.open_with_video, item.permission),
        ),
      ).value,
      name: EnumActionFileManager.open_with_video,
      text: computed(() => t('locale.video')).value,
      icon: MdiWebfont['video-wireless-outline'],
      onClick: () => openFileWithTool(EnumOpenTool.video, fileManagerStore.objectSelectedOne),
    },
    {
      visible: computed(() =>
        fileManagerStore.selectedItems.every((item) =>
          hasPermissionByAction(EnumActionFileManager.open_with_office, item.permission),
        ),
      ).value,
      name: EnumActionFileManager.open_with_office,
      text: computed(() => t('locale.office')).value,
      icon: MdiWebfont['file-word-outline'],
      onClick: () => openFileWithTool(EnumOpenTool.office, fileManagerStore.objectSelectedOne),
    },
    {
      visible: computed(() =>
        fileManagerStore.selectedItems.every((item) =>
          hasPermissionByAction(EnumActionFileManager.open_with_word, item.permission),
        ),
      ).value,
      name: EnumActionFileManager.open_with_word,
      text: computed(() => t('locale.text_document')).value,
      icon: MdiWebfont['text-box-outline'],
      onClick: () => openFileWithTool(EnumOpenTool.text, fileManagerStore.objectSelectedOne),
    },
  ];

  // Helper to create "remove tag" submenu
  const createRemoveTagItems = () =>
    Array.isArray(fileManagerStore.objectSelectedOne.tags)
      ? fileManagerStore.objectSelectedOne.tags.map((tag: ITag) => ({
          _id: tag._id,
          name: EnumActionFileManager.remove_tag_custom,
          text: tag.name,
          rgb: tag.rgb,
          onClick: () => fmActionRemoveTag(fileManagerStore.objectSelectedOne, tag),
        }))
      : undefined;

  // Helper to create "assign tag" submenu
  const createAssignTagItems = () =>
    tagList.value.length > 0
      ? tagList.value.map((tag: ITag) => ({
          _id: tag._id,
          name: EnumActionFileManager.assign_tag_custom,
          text: tag.name,
          rgb: tag.rgb,
          onClick: () => fmActionAssignTag(fileManagerStore.selectedItems, tag),
        }))
      : undefined;

  // Helper to public items
  const createPublicItems = {
    items: [
      {
        name: EnumActionFileManager.download_custom,
        visible: true,
        text: computed(() => t('locale.download_custom')).value,
        icon: MdiWebfont['cloud-download-outline'],
        onClick: () => fmActionDownloadFile([fileManagerStore.objectSelectedOne]),
        hiddenOrder: 1,
      },
      {
        name: EnumActionFileManager.detail,
        visible: true,
        text: computed(() => t('locale.detail')).value,
        icon: MdiWebfont['information-outline'],
        onClick: () => onItemSelectionDetailFile(),
        hiddenOrder: 2,
      },
    ],
  };

  if (path === myRoute.sharePublic) return createPublicItems;

  // Base items
  const baseItems = [
    {
      name: EnumActionFileManager.detail,
      visible: computed(
        () =>
          fileManagerStore.selectedItems.length === 1 &&
          fileManagerStore.selectedItems.every((item) =>
            hasPermissionByAction(EnumActionFileManager.detail, item.permission),
          ),
      ).value,
      text: computed(() => t('locale.detail')).value,
      icon: MdiWebfont['information-outline'],
      hiddenOrder: 12,
      onClick: () => onItemSelectionDetailFile(),
    },
  ] as IToolbarActions[];

  // Context menu items
  const contextMenuItems = [
    {
      name: EnumActionFileManager.preview,
      visible: computed(
        () =>
          fileManagerStore.selectedItems.length === 1 &&
          fileManagerStore.selectedItems.every(
            (item) => !item.isDirectory && hasPermissionByAction(EnumActionFileManager.preview, item.permission),
          ),
      ).value,
      text: computed(() => t('locale.preview')).value,
      icon: MdiWebfont['crop-free'],
      onClick: () => fileManagerActionStore.toggleModalPreview(),
      hiddenOrder: 1,
    },
    {
      name: EnumActionFileManager.open_custom,
      visible: computed(
        () =>
          fileManagerStore.selectedItems.length === 1 &&
          !fileManagerStore.objectSelectedOne.isDirectory &&
          fileManagerStore.selectedItems.every((item) =>
            hasPermissionByAction(EnumActionFileManager.open_custom, item.permission),
          ),
      ).value,
      text: computed(() => t('$vuetify.open')).value,
      icon: MdiWebfont['open-in-new'],
      onClick: () => fmActionOpenFile(fileManagerStore.objectSelectedOne),
      hiddenOrder: 2,
    },
    {
      name: EnumActionFileManager.open_with,
      visible: computed(
        () =>
          fileManagerStore.selectedItems.length === 1 &&
          !fileManagerStore.objectSelectedOne.isDirectory &&
          fileManagerStore.selectedItems.every((item) =>
            hasPermissionByAction(EnumActionFileManager.open_with, item.permission),
          ),
      ).value,
      text: computed(() => t('locale.open_with')).value,
      icon: MdiWebfont['eye-settings-outline'],
      items: createOpenWithItems(),
      hiddenOrder: 3,
    },
  ] as IToolbarActions[];

  const contextShareItems = [
    {
      name: EnumActionFileManager.share_with_custom,
      visible: computed(
        () =>
          fileManagerStore.selectedItems.every(
            (item) =>
              !item.share_access_directory &&
              hasPermissionByAction(EnumActionFileManager.share_with_custom, item.permission),
          ) &&
          path === myRoute.myFiles &&
          !params,
      ).value,
      text: computed(() => t('locale.share_with_custom')).value,
      icon: MdiWebfont['share-variant-outline'],
      hiddenOrder: 7,
      items: [
        {
          name: EnumActionFileManager.share_user,
          text: computed(() => t('locale.share_user')).value,
          icon: MdiWebfont['account-plus-outline'],
          visible: true,
          onClick: () => fileManagerActionStore.toggleModalShare(EnumActionFileManager.share_user),
        },
        {
          name: EnumActionFileManager.share_group,
          text: computed(() => t('locale.share_group')).value,
          icon: MdiWebfont['account-multiple-plus-outline'],
          visible: true,
          onClick: () => fileManagerActionStore.toggleModalShare(EnumActionFileManager.share_group),
        },
      ],
    },
  ];

  // Share menu items

  const contextTagItems = [
    {
      name: EnumActionFileManager.assign_tag_custom,
      icon: MdiWebfont['tag-outline'],
      text: computed(() => t('locale.assign_tag_custom')).value,
      visible: computed(() =>
        fileManagerStore.selectedItems.every(
          (item) =>
            !item.isDirectory && hasPermissionByAction(EnumActionFileManager.assign_tag_custom, item.permission),
        ),
      ).value,
      items: computed(() => createAssignTagItems()).value,
      hiddenOrder: 10,
    },
    {
      name: EnumActionFileManager.remove_tag_custom,
      visible: computed(() =>
        fileManagerStore.selectedItems.every(
          (item: any) =>
            Array.isArray(item.tags) &&
            item.tags.length > 0 &&
            fileManagerStore.selectedItems.every((item) =>
              hasPermissionByAction(EnumActionFileManager.remove_tag_custom, item.permission),
            ),
        ),
      ).value,
      text: computed(() => t('locale.remove_current_tag')).value,
      icon: MdiWebfont['tag-off-outline'],
      items: computed(() => createRemoveTagItems()).value,
      hiddenOrder: 11,
    },
  ];

  // Show context move trash items
  const contextMoveTrashItems = [
    {
      name: EnumActionFileManager.move_trash_custom,
      visible: computed(
        () =>
          fileManagerStore.selectedItems.every((item) =>
            hasPermissionByAction(EnumActionFileManager.move_trash_custom, item.permission),
          ) && path === myRoute.myFiles,
      ).value,
      text: computed(() => t('locale.trash')).value,
      icon: MdiWebfont['delete-outline'],
      onClick: () => fileManagerActionStore.toggleModalMoveTrashFile(),
      hiddenOrder: 11,
    },
  ];

  // General items
  const generalItems = [
    {
      name: EnumActionFileManager.download_custom,
      visible: computed(() =>
        fileManagerStore.selectedItems.every((item) =>
          hasPermissionByAction(EnumActionFileManager.download_custom, item.permission),
        ),
      ).value,
      text: computed(() => t('locale.download_custom')).value,
      icon: MdiWebfont['cloud-download-outline'],
      onClick: () => fmActionDownloadFile(fileManagerStore.selectedItems),
      hiddenOrder: 4,
    },
    {
      name: EnumActionFileManager.copy_to_custom,
      visible: computed(
        () =>
          fileManagerStore.selectedItems.every((item) =>
            hasPermissionByAction(EnumActionFileManager.copy_to_custom, item.permission),
          ) && path === myRoute.myFiles,
      ).value,
      text: computed(() => t('locale.copy_to_custom')).value,
      icon: MdiWebfont['content-copy'],
      onClick: () => fileManagerActionStore.toggleModalCopyFile(),
      hiddenOrder: 5,
    },
    {
      name: EnumActionFileManager.move_to_custom,
      visible: computed(
        () =>
          fileManagerStore.selectedItems.every((item) =>
            hasPermissionByAction(EnumActionFileManager.move_to_custom, item.permission),
          ) && path === myRoute.myFiles,
      ).value,
      text: computed(() => t('locale.move_to_custom')).value,
      icon: MdiWebfont['folder-move-outline'],
      onClick: () => fileManagerActionStore.toggleModalMoveFile(),
      hiddenOrder: 6,
    },
    {
      name: EnumActionFileManager.rename_custom,
      visible: computed(
        () =>
          fileManagerStore.selectedItems.length === 1 &&
          fileManagerStore.selectedItems.every((item) =>
            hasPermissionByAction(EnumActionFileManager.rename_custom, item.permission),
          ),
      ).value,
      text: computed(() => t('locale.rename_custom')).value,
      icon: MdiWebfont['pencil-outline'],
      onClick: () => fileManagerActionStore.toggleModalRenameFile(),
      hiddenOrder: 7,
    },
    {
      name: EnumActionFileManager.remove_share_custom,
      visible: computed(
        () =>
          fileManagerStore.selectedItems.every((item) => !item.share_access_directory) &&
          params === myRoute.shareParamsName.withMe,
      ).value,
      text: computed(() => t('locale.delete_custom')).value,
      icon: MdiWebfont['delete-outline'],
      onClick: () => fileManagerActionStore.toggleModalConfirmRemoveShareWithMe(),
      hiddenOrder: 8,
    },
  ] as IToolbarActions[];

  // Trash-specific items
  const trashItems = [
    {
      name: EnumActionFileManager.restore_trash_custom,
      visible: computed(() =>
        fileManagerStore.selectedItems.every((item) =>
          hasPermissionByAction(EnumActionFileManager.restore_trash_custom, item.permission),
        ),
      ).value,
      text: computed(() => t('locale.restore_trash_custom')).value,
      icon: MdiWebfont['reply-outline'],
      hiddenOrder: 1,
      onClick: () => fmActionRestoreTrash(fileManagerStore.selectedItems),
    },
    {
      name: EnumActionFileManager.delete_custom,
      visible: computed(() =>
        fileManagerStore.selectedItems.every((item) =>
          hasPermissionByAction(EnumActionFileManager.delete_custom, item.permission),
        ),
      ).value,
      text: computed(() => t('locale.permanently_delete')).value,
      icon: MdiWebfont['delete-forever-outline'],
      hiddenOrder: 2,
      onClick: () => fileManagerActionStore.toggleModalDeleteTrashFile(),
    },
  ] as IToolbarActions[];
  // Select and return the appropriate item set
  if (path === myRoute.trash) {
    return {
      items: [...trashItems, ...baseItems],
    };
  } else if (typeContext) {
    return {
      items: [
        ...contextMenuItems,
        ...generalItems,
        ...contextShareItems,
        ...contextTagItems,
        ...contextMoveTrashItems,
        ...baseItems,
      ],
    };
  } else {
    return {
      items: [...generalItems, ...contextShareItems, ...contextTagItems, ...contextMoveTrashItems, ...baseItems],
    };
  }
};
