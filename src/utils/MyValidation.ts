import { t } from '@/plugins/i18n';

export function actionValidateRequired(input: string) {
  if (input.trim()) return true;
  return t('locale.required');
}
