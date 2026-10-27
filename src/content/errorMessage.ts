import { t } from '../shared/i18n.ts';
import type { MessageErrorCode } from '../shared/type.d.ts';

// 확장 갱신 뒤에는 i18n도 끊기므로 새로고침 안내를 미리 읽는다.
const refreshPageMessage = t('contentMessageUnavailable');

export function getErrorMessage(error: MessageErrorCode): string | undefined {
  switch (error) {
    case 'CURRENT_LIST_NOT_SELECTED':
    case 'POSITION_NOT_FOUND':
    case 'COMMAND_REQUIRED':
      return undefined;
    case 'COMMAND_DUPLICATED':
      return t('contentCommandDuplicated');
    case 'STORAGE_READ_ERROR':
      return t('contentStorageRead');
    case 'STORAGE_WRITE_ERROR':
      return t('contentStorageWrite');
    case 'STORAGE_QUOTA_EXCEEDED':
      return t('contentStorageQuota');
    case 'UNSUPPORTED_SCHEMA_VERSION':
      return t('contentUnsupportedSchema');
    case 'STORAGE_ERROR':
      return t('contentStorageError');
    case 'INVALID_STATE':
      return t('contentInvalidState');
    case 'MESSAGE_UNAVAILABLE':
      return refreshPageMessage;
    default:
      return t('contentRequestFailed');
  }
}
