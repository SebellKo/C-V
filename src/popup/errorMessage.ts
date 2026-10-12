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
    case 'COMMAND_REQUIRED':
      return 'Command 내용을 입력해주세요. 공백만 저장할 수는 없습니다.';
    case 'COMMAND_DUPLICATED':
      return '이 리스트에 같은 내용의 Command가 있습니다.';
    case 'COMMAND_LIMIT_REACHED':
      return 'Command는 리스트마다 최대 10개까지 저장할 수 있습니다.';
    case 'COMMAND_NOT_FOUND':
      return 'Command가 삭제되었습니다. 팝업을 다시 열어주세요.';
    case 'INVALID_LIST_METADATA':
    case 'LIST_NOT_FOUND':
      return '리스트가 변경되었거나 삭제되었습니다. 팝업을 다시 열어주세요.';
    case 'LIST_METADATA_CONFLICT':
      return '다른 창에서 리스트가 변경되었습니다. 최신 목록을 불러온 뒤 다시 확인해주세요.';
    case 'UNSUPPORTED_SCHEMA_VERSION':
      return '지원하지 않는 저장 형식입니다. 기존 데이터는 유지됩니다. 확장 프로그램 버전을 확인해주세요.';
    case 'STORAGE_READ_ERROR':
      return '저장된 데이터를 읽지 못했습니다. 잠시 후 다시 시도해주세요.';
    case 'STORAGE_WRITE_ERROR':
      return '변경 내용을 저장하지 못했습니다. 입력과 기존 데이터는 유지됩니다. 다시 시도해주세요.';
    case 'STORAGE_QUOTA_EXCEEDED':
      return '저장 공간이 부족합니다. 기존 데이터를 정리하거나 입력을 줄인 뒤 다시 시도해주세요.';
    case 'INVALID_STATE':
      return '저장된 데이터 형식을 확인할 수 없습니다. 기존 데이터는 변경하지 않았습니다.';
    case 'MESSAGE_UNAVAILABLE':
      return '확장 프로그램의 응답을 받지 못했습니다. 저장 요청을 보냈다면 최신 목록에서 결과를 확인해주세요.';
    case 'STORAGE_ERROR':
      return '저장소에 접근하지 못했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return '요청을 처리하지 못했습니다. 팝업을 다시 열거나 다시 시도해주세요.';
  }
}
