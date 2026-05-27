# 아키텍처

## 전체 구조

```text
.
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   ├── contents/
│   └── modules/
├── src/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   ├── styles/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 런타임 구성

- Popup UI: `src/`의 React 앱입니다. `public/index.html`을 통해 확장 프로그램 팝업으로 실행됩니다.
- Background Service Worker: `public/service-worker.js`입니다. IndexedDB 작업을 담당합니다.
- Content Scripts: `public/contents/` 아래 스크립트입니다. 모든 `http`, `https` 페이지에 주입되어 단축키와 선택 텍스트를 처리합니다.
- IndexedDB 모듈: `public/modules/` 아래에 DB 연결, store 접근, CRUD 서비스가 있습니다.

## Manifest

`public/manifest.json`은 Manifest V3 설정입니다.

- `background.service_worker`: `service-worker.js`
- `content_scripts`: `contents/content.js`와 보조 스크립트들을 모든 HTTP/HTTPS 페이지에 주입
- `action.default_popup`: `index.html`
- `_execute_action`: `Ctrl+B` 또는 `Command+B`로 팝업 열기

## 메시지 흐름

Popup UI와 Content Script는 직접 IndexedDB를 다루지 않고 `chrome.runtime.sendMessage`로 Service Worker에 요청합니다.

```mermaid
flowchart LR
  A["Popup UI (React)"] -->|"chrome.runtime.sendMessage"| B["Service Worker"]
  C["Content Script"] -->|"chrome.runtime.sendMessage"| B
  B --> D["IndexedDB: CVStore"]
  D --> B
  B --> A
  B --> C
```

## Popup UI 계층

- `src/components/header`: 현재 리스트 선택, 리스트 추가/수정 버튼
- `src/components/Main`: 커맨드 목록, 새 커맨드 버튼, 모달 렌더링
- `src/components/Footer`: 전체 커맨드 삭제 버튼
- `src/components/Modal`: 리스트/커맨드 추가, 수정, 삭제 확인 모달
- `src/styles`: 전역 스타일과 공통 styled-components

## 상태 관리

`src/stores/`는 Zustand를 사용합니다.

- `ListStore.js`: 현재 선택된 리스트 이름
- `CommandStore.js`: 현재 선택된 커맨드
- `ModalStore.js`: 각 모달의 열림/닫힘 상태

서버 상태에 가까운 IndexedDB 데이터는 TanStack Query 훅으로 가져오고 변경 후 invalidate합니다.

## API와 Hook 계층

`src/api/`는 `chrome.runtime.sendMessage` 호출을 감싼 함수입니다.

- `getList`: 전체 리스트 조회
- `getListByName`: 특정 리스트 조회
- `postList`: 리스트 추가
- `postCommand`: 커맨드 추가
- `putEditList`: 리스트 목록 수정
- `putEditCommand`: 단일 커맨드 수정
- `putEditCommands`: 커맨드 목록 수정
- `deleteCommand`: 단일 커맨드 삭제
- `deleteCommands`: 현재 리스트의 커맨드 전체 삭제

`src/hooks/`는 TanStack Query의 `useQuery`, `useMutation`과 모달/스토어 상태를 조합합니다.

## IndexedDB 구조

DB 이름은 `CVStore`, 버전은 `1`입니다.

### `list` object store

리스트와 커맨드를 저장합니다.

```js
{
  id: "uuid",
  name: "리스트 이름",
  commands: ["커맨드 텍스트"]
}
```

- `autoIncrement: true`
- `name` index 보유
- 리스트는 최대 10개
- 각 리스트의 커맨드는 최대 10개

### `currentList` object store

단축키 동작에서 사용하는 현재 리스트 이름을 저장합니다.

```js
{
  name: "현재 리스트 이름"
}
```

현재 구현에서는 key `1`에 현재 리스트 이름을 저장합니다.

## Content Script 흐름

`public/contents/content.js`는 키보드 이벤트와 선택 영역 변경을 감지합니다.

- `selectionchange`: 현재 선택된 텍스트를 `currentSelection`에 저장
- `Shift + 숫자`: 현재 리스트 선택
- `Alt + 숫자`: 현재 리스트의 특정 커맨드를 클립보드에 복사
- `Shift + Alt + 숫자`: 현재 선택 텍스트를 현재 리스트의 특정 인덱스에 저장

숫자 `0`은 10번째 항목으로 처리됩니다.

