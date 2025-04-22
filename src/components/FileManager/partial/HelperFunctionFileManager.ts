// Utility Functions
import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
import { IFileManager } from '@/interfaces/IFileManager';
import { actionGetMimeType } from '@/utils/MyFunction';
import { FileExtensions, mimeType } from '@/utils/MyVariables';

export function fileManagerGenerateNewPath(
  isDirectory: boolean,
  originalName: string,
  currentPath: string,
  newName: string,
): string {
  // Loại bỏ dấu "/" ở cuối nếu có
  const trimmedPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;

  // Nếu `originalName` trùng với `trimmedPath`, trả về `newName` với định dạng tùy thuộc vào loại
  if (originalName === trimmedPath) {
    return isDirectory ? `${newName}/` : newName;
  }

  // Tìm `newPath` bằng cách cắt `currentPath` đến dấu "/" cuối cùng
  const lastSlashIndex = trimmedPath.lastIndexOf('/');
  const newPath = trimmedPath.slice(0, lastSlashIndex);

  // Trả về đường dẫn mới với định dạng tùy thuộc vào loại (thư mục hoặc tệp)
  return `${newPath}/${newName}${isDirectory ? '/' : ''}`;
}

export function getThumbnailIcon(item: IFileManager) {
  const type = item.type;
  const mimeTypeValue = actionGetMimeType(item.type);

  // Hàm phụ trợ để trả về đường dẫn icon
  const getIconPath = (iconName: string) => MdiWebfont[iconName] || MdiWebfont['file-outline'];

  // Trường hợp thư mục hoặc type không xác định
  if (item.isDirectory) {
    return getIconPath('folder-outline');
  }

  // Bản đồ icon mở rộng
  const iconMap: Record<string, string> = {
    svg: 'svg.svg',
    doc: 'file-document-outline',
    docx: 'file-document-outline',
    slx: 'file-excel-outline',
    xlsx: 'file-excel-outline',
    csv: 'file-excel-outline',
    xml: 'file-xml-box',
    html: 'language-html5',
    one: 'microsoft-onenote',
    sql: 'database-outline',
    log: 'log.svg',
    iso: 'iso.svg',
    apk: 'android',
    dmg: 'dmg.svg',
    exe: 'exe.svg',
    pdf: 'file-pdf-box',
    pptx: 'file-powerpoint-outline',
    accdb: 'accdb.svg',
    cmd: 'console',
    jar: 'folder-zip-outline',
    json: 'code-json',
    ovpn: 'ovpn.svg',
    psd: 'psd.svg',
    // Thêm các nhóm mở rộng vào iconMap
    ...FileExtensions.IMAGE.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'file-image-outline',
      }),
      {},
    ),
    ...FileExtensions.ZIP.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'folder-zip-outline',
      }),
      {},
    ),
    ...FileExtensions.AUDIO.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'file-music-outline',
      }),
      {},
    ),
    ...FileExtensions.CODE.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'file-code-outline',
      }),
      {},
    ),
    ...FileExtensions.VISIO.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'vsdx.svg',
      }),
      {},
    ),
    ...FileExtensions.TXT.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: MdiWebfont['file-document-outline'],
      }),
      {},
    ),
    ...FileExtensions.MSPUBLISHER.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'pub.svg',
      }),
      {},
    ),
    ...FileExtensions.MSPROJECT.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'mpp.svg',
      }),
      {},
    ),
  };

  // Kiểm tra mime type cho video trước, sau đó kiểm tra iconMap
  if (mimeType.VIDEO.includes(mimeTypeValue) || FileExtensions.VIDEO.includes(type)) {
    return getIconPath('file-video-outline');
  }

  // Nếu type có trong iconMap, trả về icon tương ứng
  if (iconMap[type]) {
    return getIconPath(iconMap[type]);
  }

  // Mặc định cho file không xác định
  return getIconPath('file-outline');
}

export const getNearestFolder = (path: string): string => {
  // Tách chuỗi theo dấu '/' và loại bỏ các phần rỗng
  const parts = path.split('/').filter((part) => part.trim() !== '');
  return parts.length > 1 ? parts[parts.length - 2] : '';
};
