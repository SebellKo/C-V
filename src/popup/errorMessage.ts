import type { MessageErrorCode } from '../shared/type.d.ts';

export function getErrorMessage(error: MessageErrorCode): string {
  switch (error) {
    case 'LIST_NAME_REQUIRED':
      return '리스트 이름을 입력해주세요.';
    case 'LIST_NAME_TOO_LONG':
      return '앞뒤 공백을 제외한 이름을 100자 이하로 입력해주세요.';
    case 'LIST_NAME_DUPLICATED':
      return '이미 같은 이름의 리스트가 있습니다.';
    case 'LIST_LIMIT_REACHED':
      return '리스트는 최대 10개까지 만들 수 있습니다.';
    case 'INVALID_LIST_METADATA':
    case 'LIST_NOT_FOUND':
      return '리스트가 변경되었거나 삭제되었습니다. 팝업을 다시 열어주세요.';
    case 'INVALID_STATE':
      return '저장된 데이터 형식을 확인할 수 없습니다. 기존 데이터는 변경하지 않았습니다.';
    case 'MESSAGE_UNAVAILABLE':
      return '확장 프로그램에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.';
    case 'STORAGE_ERROR':
      return '저장소에 접근하지 못했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return '요청을 처리하지 못했습니다. 팝업을 다시 열거나 다시 시도해주세요.';
  }
}
