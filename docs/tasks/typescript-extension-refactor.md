# Task

Source Spec: [docs/specs/typescript-extension-refactor.md](/Users/maegmini/.codex/worktrees/9aaf/c-v/docs/specs/typescript-extension-refactor.md)

## Rules

- Middle tasks should be as independent as possible.
- Small tasks must stay small enough to review by diff.
- One session should usually handle one middle task.
- Implement only one small task at a time.
- After completing a small task, do not continue automatically. Wait for user review.

## Middle Tasks

### [Todo] MT1. TypeScript entry and shared contract baseline

- Goal: popup UI와 extension runtime을 함께 타입 검사 대상으로 만들고, 이후 작업의 기준이 되는 공통 타입 계약을 먼저 고정한다.
- Dependency: 없음
- Parallel Safe: 부분 가능. MT2, MT3는 이 middle task의 공통 타입과 엔트리 구조가 먼저 정리된 뒤 진행해야 한다.
- Notes: 대상은 `package.json`, `tsconfig.json`, `src/index.tsx`, `src/App.tsx`, `public/manifest.json`, `src/extension/**`, `src/shared/types/**`, `src/shared/constants/**`, `src/shared/lib/**` 이다. 기존 popup, service worker, content script의 산출물 이름과 manifest 연결 방식은 유지한다. 메시지 type 문자열은 유지하고, 암묵적 payload shape만 공통 타입으로 끌어올린다. 이 단계에서는 사용자 데이터 손실을 유발하는 저장 구조 변경을 하지 않는다.

#### Small Tasks

- [Todo] ST1. TypeScript 기준 엔트리와 빌드 설정 추가
  - Output: popup UI와 extension runtime을 함께 다룰 수 있는 TypeScript 엔트리 구조와 기본 설정이 추가된다.
  - Files: `package.json`, `tsconfig.json`, `src/index.tsx`, `src/App.tsx`, `public/manifest.json`, `src/extension/**`
  - Notes: 현재 CRA 기반 진입 구조와 extension 산출물 연결은 유지한다. 기능 변경이나 권한 변경은 하지 않는다.

- [Todo] ST2. 공통 domain and runtime message 타입 선언
  - Output: 리스트, 커맨드, 현재 선택 상태, 메시지 요청/응답을 공통 타입으로 선언하고 재사용 가능한 위치에 정리한다.
  - Files: `src/shared/types/**`, `src/shared/constants/**`, `src/shared/lib/**`
  - Notes: 기존 메시지 타입 문자열은 유지한다. 현재 IndexedDB 저장 의미는 유지한 채 타입 계약만 먼저 고정한다.

---

### [Todo] MT2. Typed extension runtime and IndexedDB service layer

- Goal: 서비스 워커, 콘텐츠 스크립트, IndexedDB 서비스 계층을 typed runtime 구조로 재구성한다.
- Dependency: MT1
- Parallel Safe: 제한적 가능. MT3, MT4와 병렬 진행하려면 MT1의 공통 타입 계약이 먼저 확정되어야 한다.
- Notes: 대상은 `public/service-worker.js`, `public/contents/**`, `public/modules/**`, `src/extension/background/**`, `src/extension/content/**` 이다. `CVStore`, `list`, `currentList` 의 의미는 유지하거나 손실 없는 마이그레이션 경로를 포함해야 한다. `forEach(async ...)` 저장 패턴과 문자열 `if` 체인 기반 메시지 분기를 제거한다.

#### Small Tasks

- [Todo] ST1. IndexedDB open/store/service 로직을 typed 모듈로 정리
  - Output: DB 초기화, store 접근, list/currentList 저장 서비스가 타입을 가지며 비동기 저장 누락 가능 패턴이 제거된다.
  - Files: `public/modules/openDatabase.js`, `public/modules/getListStore.js`, `public/modules/getCurrentListStore.js`, `public/modules/getPrimaryKey.js`, `public/modules/service/**`, `src/extension/background/db/**`, `src/extension/background/services/**`
  - Notes: 기존 `CVStore`, `list`, `currentList` 저장 의미를 유지한다. 데이터 마이그레이션이 필요하면 손실 없는 경로를 명시한다.

- [Todo] ST2. 서비스 워커 메시지 처리를 typed handler map 구조로 전환
  - Output: 요청 type별 분기와 response shape가 선언적으로 연결되고, background entry가 직접 서비스 함수를 호출하는 구조가 단순화된다.
  - Files: `public/service-worker.js`, `src/extension/background/index.ts`, `src/extension/background/handlers/**`, `src/shared/types/**`
  - Notes: 현재 지원하는 메시지 목록은 모두 유지한다. 실패 응답 shape는 popup 로직이 깨지지 않도록 호환성을 지킨다.

- [Todo] ST3. 콘텐츠 스크립트와 단축키 흐름의 typed runtime adapter 정리
  - Output: 키 입력, 현재 리스트 선택, 현재 커맨드 저장/붙여넣기 흐름이 타입을 갖고 background 계약과 직접 연결된다.
  - Files: `public/contents/content.js`, `public/contents/*.js`, `src/extension/content/**`, `src/shared/types/**`
  - Notes: `Shift + 숫자`, `Alt + 숫자`, `Alt + Shift + 숫자` 동작은 바꾸지 않는다. DOM 이벤트 처리 범위와 사용자 체감 동작은 유지한다.

---

### [Todo] MT3. Typed popup data flow and UI state boundaries

- Goal: popup의 메시지 adapter, React Query, Zustand 책임을 타입 기준으로 재정리한다.
- Dependency: MT1, MT2
- Parallel Safe: MT4와 일부 병렬 가능. 단, query key 정책과 UI state shape가 먼저 정해져야 컴포넌트 분리가 안정적이다.
- Notes: 대상은 `src/api/**`, `src/hooks/**`, `src/stores/**`, `src/app/query/**`, `src/features/lists/hooks/**`, `src/features/commands/hooks/**`, `src/features/modal/model/**` 이다. React Query가 비동기 상태를 소유하고, Zustand는 선택된 리스트, 열린 모달, 선택된 command 같은 UI 상태만 담당한다.

#### Small Tasks

- [Todo] ST1. popup sendMessage 호출을 typed API adapter로 통합
  - Output: `src/api/**` 가 공통 sendMessage wrapper를 사용하고, request/response 타입이 훅과 UI로 전달된다.
  - Files: `src/api/**`, `src/shared/lib/**`, `src/shared/types/**`
  - Notes: query/mutation의 실제 동작 의미는 유지한다. API wrapper가 UI store를 직접 건드리지 않도록 한다.

- [Todo] ST2. React Query query key와 invalidate 정책 공통화
  - Output: list/command 관련 query key 정의가 한 곳에 모이고, mutation 이후 필요한 query만 일관되게 갱신된다.
  - Files: `src/hooks/**`, `src/app/query/**`, `src/features/lists/hooks/**`, `src/features/commands/hooks/**`
  - Notes: 기존 조회/추가/수정/삭제 흐름은 유지한다. `['list']`, `['list', currentListName]` 같은 흩어진 key는 제거하되 observable behavior는 바꾸지 않는다.

- [Todo] ST3. Zustand store를 typed UI state로 축소
  - Output: modal/list/command 선택 상태가 명시적 타입을 가진 store 또는 state object로 정리된다.
  - Files: `src/stores/ModalStore.js`, `src/stores/ListStore.js`, `src/stores/CommandStore.js`, `src/features/modal/model/**`, `src/features/lists/model/**`, `src/features/commands/model/**`
  - Notes: React Query가 소유해야 할 비동기 서버 상태는 store로 옮기지 않는다. `'Select'`, `''` 같은 sentinel 사용은 제거하되 표시 문자열은 view layer에서만 처리한다.

---

### [Todo] MT4. Feature-oriented popup UI refactor

- Goal: popup UI를 기능 기준 구조로 옮기고 현재 컴포넌트 경계 문제를 해결한다.
- Dependency: MT1, MT3
- Parallel Safe: 제한적 가능. MT5와는 병렬 가치가 낮고, MT3의 state/query shape가 먼저 안정화되어야 한다.
- Notes: 대상은 `src/components/**`, `src/styles/components/**`, `src/features/lists/ui/**`, `src/features/commands/ui/**`, `src/features/modal/ui/**`, `src/shared/ui/**` 이다. 특히 `src/components/header/List.jsx`, `src/components/Main/CommandList.jsx`, `src/components/Modal/EditList/EditInput.jsx`, `src/App.js` 의 현재 결함을 제거해야 한다.

#### Small Tasks

- [Todo] ST1. list 선택 UI의 구조, 이벤트 cleanup, import casing 정리
  - Output: header/list 관련 컴포넌트가 typed props와 명확한 책임으로 분리되고, outside click cleanup과 import casing 문제가 제거된다.
  - Files: `src/App.tsx`, `src/components/header/**`, `src/components/Header/**`, `src/features/lists/ui/**`, `src/shared/ui/**`
  - Notes: popup header의 사용자 동작과 선택 흐름은 유지한다. macOS에서만 통과하는 import 경로에 의존하지 않는다.

- [Todo] ST2. command 목록과 정렬 UI를 `CommandItem` 모델 기준으로 재구성
  - Output: DnD item id, React key, edit/delete 대상 식별자가 문자열 값이 아니라 안정적인 command id를 사용하게 된다.
  - Files: `src/components/Main/**`, `src/features/commands/ui/**`, `src/features/commands/model/**`, `src/hooks/useEditCommands.*`, `src/hooks/useEditCommand.*`, `src/hooks/useDeleteCommands.*`
  - Notes: 순서 변경, 단건 수정, 단건 삭제, 전체 삭제의 관찰 가능한 동작은 유지한다. 문자열 값 중복 여부 검사는 기존 규칙을 임의로 바꾸지 않는다.

- [Todo] ST3. modal 입력과 공통 styled UI의 책임 분리
  - Output: 입력 컴포넌트가 props 기반으로 일관되게 동작하고, modal 관련 UI 파일이 기능/공통 경계에 맞게 정리된다.
  - Files: `src/components/Modal/**`, `src/styles/components/**`, `src/features/modal/ui/**`, `src/shared/ui/**`
  - Notes: modal open/close 트리거와 validation 메시지 흐름은 유지한다. styled-components theme나 스타일 토큰을 임의로 대규모 변경하지 않는다.

---

### [Todo] MT5. Validation and documentation close-out

- Goal: 타입 검사, 빌드, 핵심 동작 검증, 관련 문서 정리를 마무리한다.
- Dependency: MT2, MT3, MT4
- Parallel Safe: 낮음. 구현이 완료된 뒤 마지막에 정리하는 단계로 유지한다.
- Notes: 대상은 `package.json`, `docs/specs/typescript-extension-refactor.md`, `docs/tasks/typescript-extension-refactor.md`, `docs/README.md`, `docs/features/**` 이다. 자동화가 어려운 extension 시나리오는 수동 검증 항목으로 남겨야 한다.

#### Small Tasks

- [Todo] ST1. 타입 검사와 빌드 검증 명령 정리
  - Output: 재현 가능한 타입 검사와 빌드 검증 명령이 정리되고 실패 시 원인이 문서화된다.
  - Files: `package.json`, `docs/README.md`
  - Notes: 빌드 전환으로 실행 방식이 바뀌면 `npm test` 와 동등한 검증 명령을 명시한다. 검증 단계에서 발견된 이슈를 숨기지 않는다.

- [Todo] ST2. 핵심 extension 시나리오 수동 검증 항목 정리
  - Output: 리스트 조회/선택/추가/수정, 커맨드 조회/추가/수정/삭제/정렬, 단축키 기반 저장/붙여넣기 검증 항목이 문서화된다.
  - Files: `docs/README.md`, `docs/features/**`, `docs/tasks/typescript-extension-refactor.md`
  - Notes: service worker, content script, popup 간 경계 동작이 유지되는지 기준을 명확히 적는다.
