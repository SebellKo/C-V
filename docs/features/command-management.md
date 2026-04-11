# 커맨드 관리

## 기능 목적

커맨드 관리는 실제로 복사하고 붙여넣을 문구를 리스트 안에 저장하는 기능입니다.
각 리스트는 여러 개의 커맨드를 가질 수 있고, 사용자는 팝업에서 이 내용을 직접 관리할 수 있습니다.

## 사용자가 할 수 있는 일

- 새 커맨드 추가
- 기존 커맨드 내용 수정
- 개별 커맨드 삭제
- 현재 리스트의 커맨드 전체 삭제

## 화면 기준 동작

### 1. 커맨드 추가

리스트를 선택한 상태에서 `New Command` 버튼을 누르면 새 커맨드 입력 모달이 열립니다.
문구를 입력하고 확인하면 현재 리스트에 커맨드가 추가됩니다.

리스트가 선택되지 않은 상태에서는 버튼이 비활성화됩니다.

### 2. 커맨드 수정

커맨드 카드의 본문 영역을 클릭하면 수정 모달이 열립니다.
현재 커맨드 문자열이 입력창에 채워진 상태로 열리며, 수정 후 확인하면 값이 변경됩니다.

### 3. 개별 커맨드 삭제

각 커맨드 카드 상단 우측의 삭제 아이콘을 누르면 해당 커맨드만 삭제됩니다.

### 4. 전체 삭제

푸터의 `Delete All` 버튼을 누르면 확인 모달이 열립니다.
확인하면 현재 선택된 리스트의 커맨드 배열이 비워집니다.

리스트가 선택되지 않은 상태에서는 버튼이 비활성화됩니다.

## 저장 방식

커맨드는 리스트 객체 안의 `commands` 배열에 문자열 형태로 저장됩니다.

```json
{
  "name": "메일 템플릿",
  "commands": [
    "안녕하세요.",
    "회의 일정 공유드립니다."
  ]
}
```

## 제약 사항

- 한 리스트에는 최대 10개의 커맨드만 저장할 수 있습니다.
- 같은 리스트 안에서는 동일한 커맨드를 중복 저장할 수 없습니다.
- 커맨드 추가, 수정, 삭제 후에는 현재 리스트 조회 캐시를 무효화해 화면을 다시 그립니다.

## 사용자 시나리오

### 자주 쓰는 문구 저장

1. 리스트를 선택한다.
2. `New Command` 버튼을 누른다.
3. 문구를 입력한다.
4. 확인을 누른다.
5. 리스트 안에 새 커맨드가 추가된다.

### 문구 수정

1. 커맨드 카드 본문을 클릭한다.
2. 문구를 수정한다.
3. 확인을 누른다.
4. 기존 커맨드가 새 값으로 교체된다.

### 전체 비우기

1. 리스트를 선택한다.
2. `Delete All` 버튼을 누른다.
3. 확인 모달에서 승인한다.
4. 현재 리스트의 모든 커맨드가 삭제된다.

## 현재 구현 기준 메모

- 개별 커맨드는 문자열 하나를 식별값처럼 사용합니다.
- 개별 삭제와 수정은 "현재 리스트 이름 + 기존 커맨드 문자열" 조합을 기준으로 처리됩니다.
- 커맨드 수정 모달에서 취소하면 선택된 커맨드 상태가 초기화됩니다.

## 관련 코드

- `src/components/Main/CommandList.jsx`
- `src/components/Main/Command.jsx`
- `src/components/Main/NewCommandButton.jsx`
- `src/components/Footer/DeleteAllButton.jsx`
- `src/components/Modal/AddCommandModal.jsx`
- `src/components/Modal/EditCommandModal.jsx`
- `src/components/Modal/DeleteConfirmModal.jsx`
- `src/hooks/useAddCommand.js`
- `src/hooks/useEditCommand.js`
- `src/hooks/useDeleteCommands.js`
- `public/modules/service/addCommand.js`
- `public/modules/service/editCommand.js`
- `public/modules/service/deleteCommand.js`
- `public/modules/service/deleteCommands.js`
