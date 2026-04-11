# 리스트 관리

## 기능 목적

리스트 관리는 여러 문구 묶음을 주제별로 나눠 관리하기 위한 기능입니다.
사용자는 리스트를 만들고, 팝업에서 원하는 리스트를 선택한 뒤 그 안의 커맨드를 관리할 수 있습니다.

## 사용자가 할 수 있는 일

- 새 리스트 생성
- 리스트 선택
- 리스트 이름 수정
- 리스트 삭제
- 리스트 순서 변경

## 화면 기준 동작

### 1. 리스트 선택

팝업 상단의 선택 버튼을 클릭하면 현재 저장된 리스트 목록이 펼쳐집니다.
목록에서 항목을 클릭하면 해당 리스트가 현재 팝업의 활성 리스트가 됩니다.

이 선택은 팝업 UI 기준으로 현재 보고 편집할 리스트를 바꾸는 역할을 합니다.

### 2. 리스트 생성

상단의 `Add` 버튼을 누르면 리스트 생성 모달이 열립니다.
리스트 이름을 입력하고 확인하면 새 리스트가 추가됩니다.

### 3. 리스트 편집

상단의 `Edit` 버튼을 누르면 리스트 편집 모달이 열립니다.
이 화면에서는 다음 작업을 한 번에 처리할 수 있습니다.

- 리스트 이름 변경
- 리스트 삭제
- 리스트 순서 변경

편집 모달 안에서 바꾼 내용은 `확인` 버튼을 눌렀을 때 저장됩니다.

## 저장 방식

리스트는 다음 형태로 저장됩니다.

```json
{
  "id": "uuid",
  "name": "리스트 이름",
  "commands": []
}
```

리스트 편집 저장은 개별 항목만 부분 수정하는 방식이 아니라, 편집된 전체 리스트 배열을 다시 저장하는 방식입니다.

## 제약 사항

- 리스트는 최대 10개까지 생성할 수 있습니다.
- 리스트 이름은 중복될 수 없습니다.
- 팝업이 처음 열렸을 때 선택값은 `Select`입니다.
- 편집 모달에서 삭제/이름 변경/순서 변경을 여러 건 수행한 뒤 마지막에 한 번 저장합니다.

## 사용자 시나리오

### 새 분류 만들기

1. 팝업을 연다.
2. `Add` 버튼을 누른다.
3. 리스트 이름을 입력한다.
4. 확인을 누른다.
5. 새 리스트가 생성된다.

### 기존 분류 정리하기

1. `Edit` 버튼을 누른다.
2. 리스트 이름을 수정하거나 필요 없는 리스트를 삭제한다.
3. 드래그로 순서를 바꾼다.
4. 확인을 눌러 변경사항을 반영한다.

## 현재 구현 기준 메모

- 팝업 안에서의 리스트 선택은 `zustand` 스토어의 `currentListName`으로 관리됩니다.
- 리스트 편집 저장 시 현재 선택 리스트는 다시 `Select`로 초기화됩니다.
- 리스트 편집 저장은 `list` 스토어를 비운 뒤 수정된 리스트 배열을 다시 넣는 방식입니다.

## 관련 코드

- `src/components/header/SelectButton.jsx`
- `src/components/header/List.jsx`
- `src/components/header/ModifyButtons.jsx`
- `src/components/Modal/AddListModal.jsx`
- `src/components/Modal/EditListModal.jsx`
- `src/components/Modal/EditList/EditList.jsx`
- `src/components/Modal/EditList/EditListItem.jsx`
- `src/hooks/useAddList.js`
- `src/hooks/useEditList.js`
- `public/modules/service/addList.js`
- `public/modules/service/editList.js`
- `public/modules/service/getList.js`
