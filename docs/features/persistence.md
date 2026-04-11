# 저장과 영속성

## 기능 목적

이 문서는 사용자 기능을 받쳐 주는 저장 구조를 설명합니다.
`C:V`는 확장 프로그램이 꺼져도 리스트와 커맨드를 유지하기 위해 브라우저의 `IndexedDB`를 사용합니다.

## 저장소 구조

데이터베이스 이름은 `CVStore`입니다.

여기에는 두 개의 오브젝트 스토어가 있습니다.

- `list`: 리스트와 커맨드 본문 저장
- `currentList`: 단축키 흐름에서 사용하는 현재 리스트 이름 저장

## `list` 스토어

리스트 데이터는 다음 정보를 가집니다.

- `id`
- `name`
- `commands`

`commands`는 문자열 배열입니다.

## `currentList` 스토어

이 스토어는 단축키 흐름에서 현재 선택된 리스트 이름을 저장합니다.
웹 페이지에서 `Shift + 숫자`를 눌렀을 때 이 값이 갱신됩니다.

즉, 팝업 UI에서 화면에 어떤 리스트를 보고 있는지와, 콘텐츠 스크립트가 어떤 리스트를 대상으로 삼는지는 구현상 분리되어 있습니다.

## 데이터 흐름

### 팝업 UI에서 저장/조회할 때

1. React 컴포넌트가 훅을 호출한다.
2. 훅이 `src/api`의 메시지 래퍼를 사용한다.
3. `chrome.runtime.sendMessage`로 서비스 워커에 요청한다.
4. 서비스 워커가 `public/modules/service` 함수를 호출한다.
5. 서비스 함수가 `IndexedDB`를 읽거나 수정한다.

### 웹 페이지 단축키에서 저장/조회할 때

1. 콘텐츠 스크립트가 키 입력 또는 선택 텍스트를 감지한다.
2. 서비스 워커에 메시지를 보낸다.
3. 서비스 워커가 저장 또는 조회를 수행한다.
4. 필요한 결과를 콘텐츠 스크립트에 돌려준다.

## 영속성 특성

- 브라우저를 다시 열어도 데이터는 유지됩니다.
- 브라우저 데이터 삭제 시 리스트와 커맨드가 사라질 수 있습니다.
- 설치 직후 서비스 워커가 데이터베이스를 열어 초기 스토어를 준비합니다.

## 현재 구현 기준 메모

- `list` 스토어는 `name` 인덱스를 사용해 리스트를 조회합니다.
- 리스트 편집 저장은 스토어를 비우고 전체 배열을 다시 추가하는 방식입니다.
- 커맨드 추가/수정/삭제는 특정 리스트 객체를 가져와 `commands` 배열만 수정한 뒤 다시 저장합니다.
- 단축키로 인덱스 기반 저장을 할 때 중간 빈 자리는 `dummy0`, `dummy1` 같은 문자열로 채우는 구현이 들어 있습니다.

## 관련 코드

- `public/modules/openDatabase.js`
- `public/modules/getListStore.js`
- `public/modules/getCurrentListStore.js`
- `public/modules/getListByName.js`
- `public/modules/getPrimaryKey.js`
- `public/service-worker.js`
- `public/modules/service/addList.js`
- `public/modules/service/editList.js`
- `public/modules/service/addCommand.js`
- `public/modules/service/editCommand.js`
- `public/modules/service/editCommands.js`
- `public/modules/service/deleteCommand.js`
- `public/modules/service/deleteCommands.js`
- `public/modules/service/getList.js`
- `public/modules/service/getCurrentListName.js`
- `public/modules/service/setCurrentListName.js`
- `public/modules/service/setCommandByIndex.js`
- `public/modules/service/getCommandByIndex.js`
