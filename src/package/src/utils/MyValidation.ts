import { t } from '@/plugins/i18n';

export function actionValidateRequired(input: string) {
  if (input) return true;
  return t('locale.required');
}
