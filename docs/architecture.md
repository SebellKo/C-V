# 아키텍처

- 문서 상태: 구현 기준 v1
- 최종 수정일: 2026-08-30
- 적용 대상: C:V Chrome Extension TypeScript 구현

## 1. 문서 목적

이 문서는 C:V를 구현하는 데 필요한 기술 stack, 실행 환경별 책임, module interface, 영속 state schema, runtime message, 오류 처리, build와 검증 구조를 정의합니다.

## 2. 설계 원칙

1. 영속 데이터의 단일 원본은 <code>chrome.storage.local</code>입니다.
2. Background만 영속 state를 읽고 쓰며 Popup과 Content Script는 runtime message를 사용합니다.
3. Popup은 영속 원본이 아니라 화면을 그리기 위한 최신 <code>AppState</code> snapshot만 가집니다.
4. domain 변경 함수는 Chrome과 React에 의존하지 않는 순수 TypeScript로 작성합니다.
5. 외부 message는 구체적인 사용자 의도를 표현하고 범용 mutate interface를 노출하지 않습니다.
6. 하나뿐인 storage 구현을 위해 repository나 adapter 계층을 만들지 않습니다.
7. 현재 필요한 dependency와 module만 추가하고 예상되는 미래 확장용 추상화는 만들지 않습니다.

## 3. 실행 환경과 책임

| 실행 환경 | 책임 | 소유하지 않는 책임 |
| --- | --- | --- |
| Popup | React 화면, 입력 draft, loading·dialog 상태, 최신 <code>AppState</code> snapshot 표시 | 영속 state 직접 접근, 장기 cache, mutation 순서 제어 |
| Content Script | 단축키 감지, 선택 텍스트 읽기, clipboard 쓰기, web toast 표시 | 영속 state 직접 접근, 제품 데이터 cache, React UI |
| Background Service Worker | runtime message 검증과 dispatch, 최신 state 조회, domain 변경, mutation 직렬화, 영속 저장 | DOM 접근, Popup 화면 상태, clipboard와 web toast 표시 |
| Domain | state type, 최소 구조 검사, 순수 변경 함수와 domain 오류 | Chrome API, React, 사용자 메시지 렌더링 |

핵심 데이터 흐름은 다음과 같습니다.

~~~
Popup ───────┐
             ├─ typed runtime request ─> Background ─> Domain
Content ─────┘                               │            │
                                            │            └─ 새 AppState 또는 DomainError
                                            └─ chrome.storage.local
~~~

Popup과 Content Script는 서로 직접 통신하지 않습니다.

## 4. 기술 stack과 dependency

### 4.1 기본 도구

- package manager: npm
- runtime: 현재 로컬 기본 Node.js LTS
- language: TypeScript strict
- extension platform: Chrome Extension Manifest V3
- bundler: Vite
- Popup UI: React 19
- UI source: shadcn/ui CLI로 생성한 source component
- primitive: Base UI
- style preset: Nova
- styling: Tailwind CSS v4와 기존 CSS semantic token
- icon: Lucide React
- DnD: <code>@dnd-kit/react</code>, <code>@dnd-kit/helpers</code>

정확한 설치 version은 <code>package-lock.json</code>에 고정합니다. 문서에는 시간이 지나면 낡는 version number를 복제하지 않습니다.

### 4.2 추가할 runtime dependency

- <code>react</code>
- <code>react-dom</code>
- <code>@base-ui/react</code>
- <code>lucide-react</code>
- <code>class-variance-authority</code>
- <code>clsx</code>
- <code>tailwind-merge</code>
- <code>@dnd-kit/react</code>
- <code>@dnd-kit/helpers</code>

### 4.3 추가할 build dependency

- <code>@vitejs/plugin-react</code>
- <code>@types/react</code>
- <code>@types/react-dom</code>
- <code>tailwindcss</code>
- <code>@tailwindcss/vite</code>
- <code>tw-animate-css</code>
- <code>shadcn</code>

### 4.4 생성할 shadcn/ui component

- Button
- Input
- Textarea
- Label
- Dialog
- Alert Dialog
- Dropdown Menu

리스트 선택 menu에는 일반 선택 항목뿐 아니라 리스트 관리 action도 있으므로 form용 Select 대신 Dropdown Menu를 사용합니다.

### 4.5 사용하지 않는 dependency

- Zustand와 다른 전역 state store
- TanStack Query와 별도 client cache
- Zod와 범용 runtime schema library
- React Hook Form과 form framework
- CSS Modules, styled-components와 CSS-in-JS
- ScrollArea와 별도 scroll library
- Sonner와 Popup toast library
- legacy <code>@dnd-kit/core</code>, <code>@dnd-kit/sortable</code>, <code>@dnd-kit/utilities</code>
- IndexedDB wrapper와 migration library

## 5. Source 구조와 module 책임

~~~
src/
├── domain/
│   ├── app-state.ts
│   ├── parse-app-state.ts
│   ├── list-operations.ts
│   └── command-operations.ts
├── storage/
│   └── app-state-storage.ts
├── messages/
│   └── runtime-message.ts
├── background/
│   ├── index.ts
│   ├── handle-message.ts
│   └── state.ts
├── content/
│   ├── index.ts
│   ├── shortcuts.ts
│   ├── clipboard.ts
│   └── toast.ts
├── popup/
│   ├── main.tsx
│   ├── App.tsx
│   ├── style.css
│   └── components/
│       ├── ui/
│       └── C:V 화면 component
└── styles/
    └── tokens.css
~~~

처음부터 모든 파일을 만들지는 않습니다. 하나의 파일이 둘 이상의 책임을 가지거나 탐색이 어려워질 때 위 위치로 분리합니다.

<code>popup/components/ui</code>에는 shadcn CLI가 생성한 범용 UI source를 두고 C:V 전용 화면 component도 <code>popup/components</code> 안에서 관리합니다. 최상위 <code>src/components</code> 폴더는 만들지 않습니다.

## 6. 영속 state schema

storage key는 <code>cvState</code> 하나만 사용합니다.

~~~ts
type Command = {
  id: string;
  text: string;
};

type List = {
  id: string;
  name: string;
  commands: Command[];
};

type AppState = {
  schemaVersion: 1;
  currentListId: string | null;
  lists: List[];
};
~~~

- List와 Command ID는 생성 시 <code>crypto.randomUUID()</code>로 만듭니다.
- List 표시 순서는 <code>lists</code> 배열 순서입니다.
- Command 위치는 <code>commands</code> 배열 순서에서 계산합니다.
- <code>order</code>, <code>position</code>, <code>updatedAt</code>처럼 다른 값에서 계산할 수 있는 필드는 저장하지 않습니다.
- Command ID는 React key와 dnd-kit item ID에도 사용합니다.
- 날짜, class instance, <code>Map</code>, <code>Set</code>, 함수처럼 JSON으로 직접 표현되지 않는 값은 저장하지 않습니다.

빈 설치의 초기 state는 다음과 같습니다.

~~~ts
const initialState: AppState = {
  schemaVersion: 1,
  currentListId: null,
  lists: [],
};
~~~

## 7. State 읽기와 최소 구조 검사

범용 schema dependency와 migration framework는 사용하지 않습니다. 대신 storage의 <code>unknown</code> 값에서 다음 구조만 확인하는 작은 <code>parseAppState</code> 함수를 둡니다.

- 객체이며 <code>schemaVersion</code>이 <code>1</code>인지
- <code>currentListId</code>가 문자열 또는 <code>null</code>인지
- <code>lists</code>가 배열인지
- 각 List의 <code>id</code>, <code>name</code>이 문자열이고 <code>commands</code>가 배열인지
- 각 Command의 <code>id</code>, <code>text</code>가 문자열인지

동작 규칙과 입력 제한은 domain 변경 함수가 검사하며 <code>parseAppState</code>가 중복 구현하지 않습니다.

| 저장 값 | 처리 |
| --- | --- |
| <code>cvState</code> key가 없음 | <code>initialState</code>를 반환하고 최초 mutation에서 저장 |
| 정상적인 version 1 state | 구조를 확인한 뒤 반환 |
| 알 수 없는 version | <code>INVALID_STATE</code> 반환, 자동 변경하지 않음 |
| 잘못된 구조 | <code>INVALID_STATE</code> 반환, 자동 초기화하지 않음 |

구조가 정상이어도 <code>currentListId</code>가 실제 List를 가리키지 않으면 읽은 snapshot에서는 <code>null</code>로 정리합니다. 다음 mutation에서 정리된 state가 함께 저장됩니다.

현재 version에서 이전 version migration 함수와 IndexedDB cleanup은 구현하지 않습니다. 실제 schema version이 추가될 때 필요한 변환만 추가합니다.

## 8. Domain 변경 함수

Domain 함수는 <code>AppState</code>와 명시적인 입력을 받아 새로운 <code>AppState</code>를 반환합니다. 입력 state를 직접 수정하지 않습니다.

~~~ts
type StateOperation<Input> = (
  state: AppState,
  input: Input,
) => AppState;

type ListMetadataPatch = {
  renamed: Array<{ listId: string; name: string }>;
  orderedIds: string[];
  deletedIds: string[];
};
~~~

함수 이름은 사용자 의도를 그대로 드러냅니다.

- <code>createList</code>
- <code>selectList</code>
- <code>applyListMetadataPatch</code>
- <code>createCommand</code>
- <code>updateCommand</code>
- <code>swapCommands</code>
- <code>deleteCommand</code>
- <code>deleteAllCommands</code>
- <code>saveSelectedText</code>

Domain은 Chrome API와 UI 문구를 import하지 않습니다. 실패는 <code>DomainError</code>와 안정적인 <code>ErrorCode</code>로 표현합니다.

## 9. Storage와 mutation 직렬화

### 9.1 Storage module

<code>app-state-storage.ts</code>는 Chrome Storage 호출과 <code>parseAppState</code> 연결만 숨깁니다.

~~~ts
readState(): Promise<AppState>
writeState(state: AppState): Promise<void>
~~~

다른 storage 구현을 가정한 repository interface는 만들지 않습니다. 테스트에서는 Chrome API를 직접 stub합니다.

Background 시작 시 <code>chrome.storage.local.setAccessLevel({ accessLevel: "TRUSTED_CONTEXTS" })</code>을 설정해 Content Script의 직접 storage 접근을 막습니다.

### 9.2 Background state module

외부 message에는 범용 mutation을 노출하지 않지만 Background 내부에서는 다음 두 함수로 저장 절차를 통합합니다.

~~~ts
getState(): Promise<AppState>

mutateState(
  update: (current: AppState) => AppState,
): Promise<AppState>
~~~

<code>mutateState</code>는 다음 과정을 하나의 깊은 module 뒤에 숨깁니다.

1. 이전 mutation 완료 대기
2. 최신 state 읽기
3. domain 변경 함수 실행
4. 새 state 최소 구조 확인
5. storage 저장 완료 대기
6. 저장된 새 state 반환

### 9.3 Queue

Background가 유일한 writer이므로 process 안의 Promise queue 하나로 mutation을 직렬화합니다. queue는 영속 데이터가 아니며 service worker가 다시 시작되면 빈 상태로 시작합니다.

- 각 작업 구현은 <code>async/await</code>를 사용합니다.
- queue는 작업 시작 순서만 제어합니다.
- 작업 하나가 실패해도 다음 작업을 실행할 수 있게 queue tail의 rejection을 복구합니다.
- state를 전역 변수에 cache하지 않고 각 mutation 시작 시 storage에서 다시 읽습니다.
- <code>getState</code>는 queue tail을 기다린 뒤 storage를 읽어 먼저 접수된 mutation까지 반영된 값을 반환합니다.

## 10. Runtime message interface

Chrome의 일회성 <code>runtime.sendMessage</code>만 사용합니다. long-lived Port와 외부 extension message는 사용하지 않습니다.

### 10.1 공통 응답

~~~ts
type RuntimeResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: ErrorCode };
~~~

raw <code>Error</code>, stack trace와 사용자 콘텐츠는 실행 환경 사이에 전달하지 않습니다.

### 10.2 Popup request

~~~ts
type PopupRequest =
  | { type: "state/get" }
  | { type: "list/create"; name: string }
  | { type: "list/select"; listId: string }
  | {
      type: "list/apply-metadata";
      renamed: Array<{ listId: string; name: string }>;
      orderedIds: string[];
      deletedIds: string[];
    }
  | { type: "command/create"; listId: string; text: string }
  | {
      type: "command/update";
      listId: string;
      commandId: string;
      text: string;
    }
  | {
      type: "command/swap";
      listId: string;
      sourceId: string;
      targetId: string;
    }
  | { type: "command/delete"; listId: string; commandId: string }
  | { type: "command/delete-all"; listId: string };
~~~

<code>state/get</code>과 모든 성공한 Popup mutation은 최신 <code>AppState</code>를 반환합니다. Popup은 응답 state로 기존 snapshot을 교체합니다.

리스트 관리 화면은 이름, 순서와 삭제를 local draft로 편집합니다. 확인 시 <code>list/apply-metadata</code> 하나만 보내며 Background는 저장 직전 최신 state에 다음 순서로 patch를 적용합니다.

1. <code>deletedIds</code>에 있는 기존 List 삭제
2. 남아 있는 List에 <code>renamed</code> 적용
3. <code>orderedIds</code>의 ID 순서 적용
4. draft에 없던 최신 List가 있다면 기존 상대 순서를 유지한 채 뒤에 보존

따라서 오래된 Popup snapshot으로 전체 List를 덮어쓰지 않으며 그 사이 최신 state에 저장된 Command도 보존합니다.

### 10.3 Content Script request

~~~ts
type ContentRequest =
  | { type: "shortcut/select-list"; position: number }
  | { type: "shortcut/resolve-command"; position: number }
  | {
      type: "shortcut/save-selection";
      position: number;
      text: string;
    };
~~~

숫자 key는 Content Script에서 사용자 위치 값으로 변환한 뒤 전달합니다. <code>"0"</code>은 위치 <code>10</code>으로 변환합니다.

~~~ts
type SelectedListReceipt = {
  listName: string;
};

type ResolvedCommand = {
  listName: string;
  position: number;
  text: string;
};

type SavedCommandReceipt = {
  listName: string;
  position: number;
  preview: string;
};
~~~

Background는 clipboard에 직접 쓰거나 한국어 toast 문장을 만들지 않습니다. receipt의 <code>preview</code>는 줄바꿈을 공백으로 바꾸고 60자로 제한한 일반 텍스트입니다.

### 10.4 Message 검증

Background handler는 message를 <code>unknown</code>으로 받아 다음을 확인한 뒤 dispatch합니다.

- 객체인지
- 알려진 <code>type</code>인지
- 해당 type에 필요한 field가 올바른 primitive type인지
- 알 수 없는 추가 동작을 유도하지 않는지

지원하지 않는 message는 <code>INVALID_REQUEST</code>를 반환합니다. message type과 response type의 대응은 하나의 <code>RuntimeRequestMap</code> type으로 관리해 sender와 handler가 같은 계약을 사용합니다.

## 11. Popup 구조와 상태 소유권

Popup은 <code>createRoot</code>로 하나의 React root를 만듭니다.

<code>App</code>이 소유하는 상태는 다음뿐입니다.

- 최신 <code>AppState | null</code>
- 초기 조회 상태 <code>loading | ready | error</code>
- 현재 화면 <code>commands | manage-lists</code>

Dialog open 상태, 입력 draft, validation message와 pending 상태는 해당 기능 component가 소유합니다. Popup 전체 Context, reducer와 전역 store는 만들지 않습니다.

Popup 흐름은 다음과 같습니다.

1. mount 후 <code>state/get</code> 요청
2. 성공하면 받은 snapshot으로 화면 구성
3. 사용자가 변경 action 실행
4. 해당 action만 pending 처리하고 중복 요청 방지
5. 성공하면 응답 <code>AppState</code>로 snapshot 교체
6. 실패하면 기존 snapshot과 입력 draft 유지

optimistic update와 background refetch loop는 사용하지 않습니다.

## 12. shadcn/ui와 style 구성

- shadcn CLI의 Base UI + Nova 구성을 <code>components.json</code>에 고정합니다.
- import alias는 <code>@/*</code> → <code>src/*</code>로 설정합니다.
- shadcn 생성 source는 <code>src/popup/components/ui</code>에 둡니다.
- C:V 전용 component는 같은 <code>src/popup/components</code> 아래에 둡니다.
- Tailwind utility는 Popup React source에서 사용합니다.
- 색상, spacing, radius와 typography의 정확한 값은 <code>src/styles/tokens.css</code>에만 둡니다.
- Tailwind <code>@theme inline</code>에는 기존 semantic CSS variable을 연결하고 색상 값을 복제하지 않습니다.
- Popup content scroll은 native <code>overflow-y: auto</code>를 사용합니다.
- web toast는 Tailwind와 shadcn component를 사용하지 않습니다.

## 13. DnD 구현

List와 Command row는 <code>@dnd-kit/react</code>의 <code>DragDropProvider</code>와 <code>useSortable</code>을 사용합니다. List 삽입 순서는 <code>arrayMove</code>, Command 교환은 <code>arraySwap</code>을 사용합니다.

- drag는 row 전체가 아니라 전용 handle에서 시작합니다.
- List와 Command는 서로 다른 sortable type을 사용합니다.
- domain state는 drag 중 변경하지 않습니다.
- Command의 유효한 drag end에서 ID 기반 <code>command/swap</code> message를 한 번 전송합니다.
- Command는 저장 성공 응답을 받은 뒤 Popup snapshot을 교체합니다.
- List drag는 리스트 관리 화면의 local draft 순서만 바꾸며 확인 시 다른 metadata 변경과 함께 한 번 저장합니다.
- 취소, 같은 대상과 목록 밖 drop은 영속 message를 보내지 않습니다.
- 위·아래 이동 action은 pointer DnD와 같은 domain operation을 호출합니다.
- keyboard sensor와 screen reader announcement는 작은 prototype에서 확인한 구성을 그대로 사용합니다.

DnD prototype이 현재 package에서 요구 동작을 만족하지 못할 때만 legacy package를 재검토하며 두 세대를 함께 설치하지 않습니다.

React 19와 strict TypeScript를 사용한 임시 prototype에서 <code>DragDropProvider</code>, <code>useSortable</code>, 전용 <code>handleRef</code>, <code>arrayMove</code>와 <code>arraySwap</code> 조합의 typecheck를 확인했습니다. 검증용 prototype은 production source에 포함하지 않습니다.

## 14. Content Script, clipboard와 web toast

Content Script는 React를 사용하지 않는 vanilla TypeScript입니다. 최상위 frame에서 단축키, 선택 텍스트, clipboard와 web toast만 처리합니다.

### 14.1 리스트 선택

1. 위치를 <code>shortcut/select-list</code>로 전달
2. Background 저장 성공 응답 대기
3. <code>listName</code>으로 성공 toast 표시

### 14.2 Command 복사

1. 위치를 <code>shortcut/resolve-command</code>로 전달
2. Background가 현재 List와 Command를 확인해 <code>ResolvedCommand</code> 반환
3. Content Script가 <code>navigator.clipboard.writeText(text)</code> 실행
4. clipboard 성공 후 List와 Command 정보를 toast로 표시
5. clipboard 실패 시 성공 toast를 표시하지 않음

clipboard 쓰기의 안정성을 위해 manifest에 <code>clipboardWrite</code> 권한을 포함합니다. <code>clipboardRead</code> 권한은 포함하지 않습니다.

### 14.3 선택 텍스트 저장

1. 단축키 event 시점의 <code>window.getSelection()</code>만 읽기
2. 위치와 텍스트를 <code>shortcut/save-selection</code>으로 전달
3. Background 저장 성공 응답 대기
4. 반환된 receipt로 성공 toast 표시

### 14.4 Web toast

- Content Script가 하나의 host element를 현재 document에 생성합니다.
- <code>attachShadow({ mode: "closed" })</code>로 style과 markup을 격리합니다.
- 사용자 콘텐츠는 <code>textContent</code>로만 렌더링합니다.
- action과 닫기 버튼이 없는 <code>role="status"</code>, <code>aria-live="polite"</code> 상태입니다.
- 새 결과가 오면 기존 host를 재사용하고 표시 timer를 다시 시작합니다.
- timer 완료 시 host element를 DOM에서 제거합니다.
- <code>chrome.notifications</code>와 운영체제 알림은 사용하지 않습니다.

## 15. Error contract와 UI mapping

~~~ts
type ErrorCode =
  | "INVALID_REQUEST"
  | "INVALID_STATE"
  | "INVALID_INPUT"
  | "STORAGE_READ_FAILED"
  | "STORAGE_WRITE_FAILED"
  | "LIST_NOT_FOUND"
  | "COMMAND_NOT_FOUND"
  | "DUPLICATE_LIST_NAME"
  | "DUPLICATE_COMMAND"
  | "LIST_LIMIT_REACHED"
  | "COMMAND_LIMIT_REACHED"
  | "NO_CURRENT_LIST"
  | "INVALID_POSITION"
  | "EMPTY_SELECTION"
  | "CLIPBOARD_WRITE_FAILED";
~~~

| 오류 분류 | 표시 위치와 처리 |
| --- | --- |
| 입력, 중복, 최대 개수 | 관련 Field 또는 열린 Dialog에 표시하고 draft 유지 |
| storage 초기 조회 | Popup 오류 화면과 다시 시도 action 표시 |
| storage mutation | 현재 화면과 draft를 유지하고 action 근처에 실패 표시 |
| 잘못된 저장 state | 자동 초기화하지 않고 Popup 오류 화면 표시 |
| 존재하지 않는 단축키 대상 | 페이지 동작을 방해하지 않고 성공 toast 미표시 |
| clipboard 실패 | 성공 toast 미표시, 실패 feedback 표시 |
| 알 수 없는 runtime request | 사용자에게 노출하지 않고 실패 응답 |

Background는 code만 반환하고 Popup과 Content Script가 실행 환경에 맞는 한국어 문구로 변환합니다. 같은 code의 사용자 문구 mapping은 각 실행 환경에서 한 곳에만 둡니다.

## 16. Manifest와 권한

필수 manifest 구성은 다음과 같습니다.

- <code>manifest_version: 3</code>
- module Background Service Worker
- <code>http://*/*</code>, <code>https://*/*</code>의 정적 Content Script
- Popup action
- Popup 열기 command
- <code>storage</code> permission
- <code>clipboardWrite</code> permission

요청하지 않는 권한은 다음과 같습니다.

- <code>clipboardRead</code>
- <code>notifications</code>
- <code>unlimitedStorage</code>
- <code>scripting</code>
- <code>tabs</code>
- 외부 network host permission

Content Script match pattern 자체가 사이트 접근 경고를 만들 수 있으므로 실제 기능에 필요한 HTTP와 HTTPS만 유지합니다.

## 17. Build 구성

Vite는 하나의 project에서 세 entry를 build합니다.

| entry | output |
| --- | --- |
| Popup HTML과 React | <code>index.html</code>, hashed asset |
| Background | <code>background.js</code> |
| Content Script | <code>content.js</code> |

- <code>public/manifest.json</code>과 icon은 Vite public asset으로 복사합니다.
- Background와 Content Script entry filename은 manifest와 일치하도록 고정합니다.
- 공통 chunk는 hashed asset으로 출력합니다.
- <code>npm run typecheck</code>는 <code>tsc --noEmit</code>을 실행합니다.
- <code>npm run build</code>는 typecheck 성공 후 Vite production build를 실행합니다.
- 배포 zip은 <code>dist</code> 내용만 포함합니다.

## 18. 테스트와 release 검증

이번 architecture 작업에서는 테스트 dependency를 설치하지 않습니다. 최종 검증 작업에서 다음 범위를 추가합니다.

### Unit

- Vitest
- state 구조 검사
- List와 Command 순수 변경 함수
- 단축키 숫자와 위치 변환
- error mapping

### Integration

- Chrome Storage stub을 사용한 read, write와 mutation queue
- runtime request 검증과 response mapping
- storage 실패와 손상 state 처리
- clipboard 성공·실패에 따른 toast 조건

### Extension E2E

- Playwright의 Chrome Extension 실행
- 빈 설치부터 List와 Command 생성
- Popup 재실행 뒤 영속 state 확인
- List와 Command DnD
- 웹페이지 단축키, clipboard와 web toast

GitHub Actions workflow는 만들지 않습니다. merge와 release 전 gate는 다음과 같습니다.

1. <code>npm run typecheck</code>
2. <code>npm run build</code>
3. 자동 테스트
4. macOS 최신 안정 Chrome에서 unpacked extension 수동 검증
5. <code>dist</code>만 포함한 배포 artifact 확인

## 19. 확정 사항 요약

- npm, React 19, Base UI, Tailwind CSS v4, shadcn Nova와 Lucide React를 사용합니다.
- 필요한 shadcn component와 dnd-kit package만 설치합니다.
- Popup은 React 내장 상태만 사용하고 Content Script는 vanilla TypeScript로 유지합니다.
- <code>cvState</code> 단일 key와 <code>schemaVersion: 1</code>을 사용합니다.
- migration framework 없이 최소 구조 검사만 수행합니다.
- Background가 유일한 writer이며 Promise queue로 mutation을 직렬화합니다.
- 외부에는 구체적인 typed runtime request만 노출합니다.
- C:V 전용 component와 shadcn source는 모두 <code>src/popup/components</code> 아래에 둡니다.
- web toast는 페이지 내부 Shadow DOM overlay이며 Chrome 시스템 알림이 아닙니다.
- 테스트 dependency와 테스트 코드는 최종 검증 작업에서 추가합니다.
