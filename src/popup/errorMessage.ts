import { t } from '../shared/i18n.ts';
import type { MessageErrorCode } from '../shared/type.d.ts';

export function getErrorMessage(error: MessageErrorCode): string {
  switch (error) {
    case 'LIST_NAME_REQUIRED':
      return t('popupListNameRequired');
    case 'LIST_NAME_TOO_LONG':
      return t('popupListNameTooLong');
    case 'LIST_NAME_DUPLICATED':
      return t('popupListNameDuplicated');
    case 'LIST_LIMIT_REACHED':
      return t('popupListLimitReached');
    case 'COMMAND_REQUIRED':
      return t('popupCommandRequired');
    case 'COMMAND_DUPLICATED':
      return t('popupCommandDuplicated');
    case 'COMMAND_LIMIT_REACHED':
      return t('popupCommandLimitReached');
    case 'COMMAND_NOT_FOUND':
      return t('popupCommandNotFound');
    case 'INVALID_LIST_METADATA':
    case 'LIST_NOT_FOUND':
      return t('popupListNotFound');
    case 'LIST_METADATA_CONFLICT':
      return t('popupListMetadataConflict');
    case 'UNSUPPORTED_SCHEMA_VERSION':
      return t('popupUnsupportedSchema');
    case 'STORAGE_READ_ERROR':
      return t('popupStorageRead');
    case 'STORAGE_WRITE_ERROR':
      return t('popupStorageWrite');
    case 'STORAGE_QUOTA_EXCEEDED':
      return t('popupStorageQuota');
    case 'INVALID_STATE':
      return t('popupInvalidState');
    case 'MESSAGE_UNAVAILABLE':
      return t('popupMessageUnavailable');
    case 'STORAGE_ERROR':
      return t('popupStorageError');
    default:
      return t('popupRequestFailed');
  }
}
