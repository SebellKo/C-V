import type { MessageErrorCode } from '../shared/type.d.ts';

export function getErrorMessage(error: MessageErrorCode): string | undefined {
  switch (error) {
    case 'CURRENT_LIST_NOT_SELECTED':
    case 'POSITION_NOT_FOUND':
    case 'COMMAND_REQUIRED':
      return undefined;
    case 'COMMAND_DUPLICATED':
      return '현재 리스트의 다른 위치에 같은 내용이 있습니다.';
    case 'STORAGE_READ_ERROR':
      return '저장된 데이터를 읽지 못했습니다. 다시 시도해주세요.';
    case 'STORAGE_WRITE_ERROR':
      return '변경 내용을 저장하지 못했습니다. 기존 데이터는 유지됩니다. 다시 시도해주세요.';
    case 'STORAGE_QUOTA_EXCEEDED':
      return '저장 공간이 부족합니다. Popup에서 데이터를 정리한 뒤 다시 시도해주세요.';
    case 'UNSUPPORTED_SCHEMA_VERSION':
      return '지원하지 않는 저장 형식입니다. 기존 데이터는 유지됩니다. 확장 프로그램 버전을 확인해주세요.';
    case 'STORAGE_ERROR':
      return '저장소에 접근하지 못했습니다. 저장 공간을 확인하고 다시 시도해주세요.';
    case 'INVALID_STATE':
      return '저장된 데이터 형식을 확인할 수 없습니다. 기존 데이터는 유지됩니다.';
    case 'MESSAGE_UNAVAILABLE':
      return '확장 프로그램에 연결하지 못했습니다. 페이지를 새로고침해주세요.';
    default:
      return '요청을 처리하지 못했습니다. Popup에서 저장 상태를 확인해주세요.';
  }
}
