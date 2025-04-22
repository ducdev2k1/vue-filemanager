import { t } from '@/plugins/i18n';
import { dateTimeFormat, typeUnknown } from '@/utils/MyVariables';
import mime from 'mime';
import moment from 'moment';
import { toast, ToastActions } from 'vue3-toastify';

export function addEventKeyDown(keydownHandler: (event: KeyboardEvent) => void) {
  window.addEventListener('keydown', (event) => {
    const editableElements = ['INPUT', 'TEXTAREA'];
    const activeElement = document.activeElement as HTMLElement;

    if (activeElement && (editableElements.includes(activeElement.tagName) || activeElement.isContentEditable)) {
      return;
    }
    keydownHandler(event);
  });
}

// Lấy chữ cái đầu từ làm text avatar
export function initialsByFullName(data: string) {
  let name: string;
  const nameParts = data.trim().split(' ');
  if (nameParts.length > 2) {
    name = nameParts[1][0] + nameParts[2][0];
  } else if (nameParts.length > 1) {
    name = nameParts[0][0] + nameParts[1][0];
  } else {
    name = nameParts[0].substring(0, 2);
  }

  return name.toUpperCase();
}

// convert bytes to KB, MB, GB
export function convertBytes(num: number): string | number {
  if (num === -1 || num === undefined) {
    return -1;
  } else if (num < 1024) {
    return `${num.toFixed(2)} bytes`;
  } else if (num === 0) {
    return 0;
  }

  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;
  const terabyte = gigabyte * 1024;

  if (num >= terabyte) {
    const result = num / terabyte;
    return Number.isInteger(result) ? `${result} TB` : `${result.toFixed(2)} TB`;
  } else if (num >= gigabyte) {
    const result = num / gigabyte;
    return Number.isInteger(result) ? `${result} GB` : `${result.toFixed(2)} GB`;
  } else if (num >= megabyte) {
    const result = num / megabyte;
    return Number.isInteger(result) ? `${result} MB` : `${result.toFixed(2)} MB`;
  } else if (num >= kilobyte) {
    const result = num / kilobyte;
    return Number.isInteger(result) ? `${result} KB` : `${result.toFixed(2)} KB`;
  }

  return `${num} bytes`;
}

export const formatDate = (date: string | Date, format?: string): string => {
  return moment(date).format(format || dateTimeFormat);
};

export function debounce<T extends any[]>(func: (...args: T) => void, delay?: number): (...args: T) => void {
  let timeoutId: any;

  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => func(...args), delay || 500);
  };
}

let toastId: any = '';
export function showToastMessage(content?: any, error?: boolean) {
  if (toastId) ToastActions.remove(toastId);
  // Set giá trị thông báo
  if (error) {
    toastId = toast.error(content || t('locale.data_has_been_loaded'));
  } else {
    toastId = toast.success(content || t('locale.data_has_been_loaded'));
  }
}

export function getNestedPropValue(obj: any, propPath: string): any {
  if (typeof obj !== 'object' || obj === null) {
    return undefined;
  }

  const props = propPath.split('.');

  const getValue = (source: any, props: string[]): any => {
    if (!source || !props.length) {
      return source;
    }

    const [prop, ...rest] = props;
    if (Array.isArray(source)) {
      return getValue(source[0], rest);
    }

    return getValue(source[prop], rest);
  };

  return getValue(obj, props);
}

export function handleErrorResponse(e: any) {
  // message co dang string va { msg: string, path: string field }
  let message = t('locale.backend_error_unknown');
  if (typeof getNestedPropValue(e, 'response.data.values') === 'string') {
    message = getNestedPropValue(e, 'response.data.values')?.startsWith('backend_')
      ? t(`locale.${getNestedPropValue(e, 'response.data.values')}`)
      : getNestedPropValue(e, 'response.data.values');
  } else if (typeof getNestedPropValue(e, 'response.data.values') === 'object') {
    message = `${t(`locale.${getNestedPropValue(e, 'response.data.values.path')}`)}: ${t(
      `locale.${getNestedPropValue(e, 'response.data.values.msg')}`,
    )}`;
  }
  return message;
}

export function actionGetMimeType(path: string) {
  const result = mime.getType(path);
  if (!result) {
    return typeUnknown;
  } else if (Array.isArray(result) && result.length > 0) {
    return result[0];
  } else {
    return result as string;
  }
}

export function getIconPath(fileName: string): string {
  return new URL(`../assets/icons/${fileName}`, import.meta.url).href;
}
