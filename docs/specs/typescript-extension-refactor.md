# TypeScript Extension Refactor

## Summary

- 현재 CRA(`react-scripts`) 기반의 popup UI는 `src/`에서 React로 동작하고, Chrome extension runtime은 `public/service-worker.js`와 `public/contents/*.js`에서 별도 JS로 동작한다. 이번 리팩토링의 목적은 popup UI, 서비스 워커, 콘텐츠 스크립트, 메시지 계약, IndexedDB 서비스 계층을 하나의 TypeScript 기준으로 재구성하고, 기능 추가 없이 구조적 안정성·타입 안정성·변경 용이성을 높이는 것이다.

## Scope

- `src/index.js`, `src/App.js`, `src/components/**`, `src/hooks/**`, `src/api/**`, `src/stores/**`, `src/styles/**`를 TypeScript 기준 구조로 전환한다.
- popup UI는 기능 기준 구조를 목표로 재배치한다. 기본 대상 경로는 `src/app/**`, `src/features/lists/**`, `src/features/commands/**`, `src/features/modal/**`, `src/shared/**` 이다.
- 현재 `public/service-worker.js`, `public/modules/**`, `public/contents/**`에 있는 extension runtime 로직을 TypeScript 소스 기준 구조로 이동하거나 동일 수준의 타입 체크 대상에 포함시킨다. 결과적으로 background/service worker, content script, popup UI가 동일한 타입 계약을 공유해야 한다.
- `chrome.runtime.sendMessage` 기반 요청/응답 계약을 공통 타입으로 정의한다. 대상 메시지는 현재 구현된 `add-list`, `get-list`, `edit-list`, `get-list-by-name`, `add-new-command`, `edit-commands`, `delete-command`, `edit-command`, `delete-commands`, `get-current-list-name`, `set-current-list-name`, `set-command-by-index`, `get-current-command` 이다.
- 도메인 모델을 명시적으로 선언한다. 최소 대상은 `List`, `CommandItem`, `CurrentList`, `RuntimeMessage`, `MutationResult` 이다. 현재 `commands: string[]` 의 저장 구조는 타입 선언만 덧씌우지 말고, stable identifier를 갖는 구조로 정규화하는 방향을 우선 검토한다.
- React Query 사용부는 query key, query function, invalidate 정책을 중앙화한다. `src/hooks/useGetList.js`, `src/hooks/useGetListByName.js`, `src/hooks/useAddList.js`, `src/hooks/useAddCommand.js`, `src/hooks/useEditList.js`, `src/hooks/useEditCommand.js`, `src/hooks/useEditCommands.js`, `src/hooks/useDeleteCommands.js` 가 정리 대상이다.
- Zustand store는 UI 전역 상태만 남기고 역할을 단순화한다. 현재 `src/stores/ModalStore.js`, `src/stores/ListStore.js`, `src/stores/CommandStore.js` 는 타입 선언과 책임 경계를 다시 정의한다.
- UI 컴포넌트는 presentational/feature/container 책임을 분리한다. 특히 `src/components/header/List.jsx`, `src/components/Main/CommandList.jsx`, `src/components/Modal/EditList/EditInput.jsx` 에 있는 이벤트 관리, DnD id 처리, controlled input 경계를 정리한다.
- 빌드 결과는 기존 extension 동작을 유지해야 한다. popup 진입점, manifest, service worker 등록 방식, content script 주입 결과가 기존과 동일하게 관찰되어야 한다.

## Non-Scope

- 새로운 사용자 기능 추가, UX 재설계, 시각 스타일 개편
- Chrome extension manifest 권한 확대 또는 제품 정책 변경
- 백엔드/API 서버 도입
- 단축키 체계 자체 변경
- 리팩토링과 무관한 문구 수정, 에셋 교체, 브랜딩 작업

## Constraints

- 이 저장소의 실제 런타임은 두 경계로 나뉜다: React popup UI(`src/**`)와 extension runtime(`public/**`). TypeScript 적용은 둘 중 하나만 변환해서는 완료로 보지 않는다.
- 현재 저장 계층은 IndexedDB `CVStore` 를 사용하며 `list`, `currentList` object store를 가진다. 기존 사용자 데이터가 손실되지 않도록 유지하거나, 손실 없는 마이그레이션 경로를 명시적으로 포함해야 한다. 관련 코드는 `public/modules/openDatabase.js`, `public/modules/service/**` 이다.
- `currentListName === 'Select'` 같은 sentinel string, `selectedCommand === ''` 같은 빈 문자열 상태, `commands`의 index/key 의존성은 타입 모델의 약점이다. 새 구조에서는 nullable/union/state object로 대체한다.
- DnD는 `@dnd-kit` 를 사용하고 있으며 현재 `src/components/Main/CommandList.jsx` 는 문자열 값을 그대로 item id로 사용한다. 새 구조에서는 reorder와 edit/delete가 안정적으로 동작하도록 고유 id를 가진 command 모델을 사용해야 한다.
- `src/App.js` 에서 `./components/Header/Header` 를 import 하고 실제 디렉터리는 `src/components/header/**` 이다. case-insensitive 환경에서만 우연히 통과하는 import는 모두 제거해야 한다.
- `public/modules/service/editList.js` 의 `forEach(async ...)` 같은 비동기 저장 패턴과 `src/components/header/List.jsx` 의 이벤트 리스너 cleanup 오류는 구조 개편 시 반드시 해소되어야 한다.
- 브랜치 생성이 필요할 경우 기본 prefix는 `sebellko/` 를 따른다.

## Parallelization Notes

- popup UI TypeScript 전환과 extension runtime TypeScript 전환은 병렬로 진행할 수 있지만, 공통 도메인 타입(`src/shared/types/**`)과 메시지 계약이 먼저 고정되어야 한다.
- UI 컴포넌트 분리와 styled-components 정리는 메시지/저장 계층과 병렬 진행 가능하다.
- IndexedDB 모델 정규화와 React Query/Zustand 책임 정리는 서로 강하게 연결되므로 동일 단계에서 검토한다.
- 테스트 추가는 각 경계가 타입 안정화된 뒤 병렬 진행 가능하다. 우선순위는 runtime adapter, IndexedDB service, query hook, 핵심 UI interaction 순이다.

## Notes

- 목표 구조는 기능 기준 정리다. 예시 경로는 `src/app/providers`, `src/features/lists/{api,hooks,model,ui}`, `src/features/commands/{api,hooks,model,ui}`, `src/features/modal/{model,ui}`, `src/shared/{types,lib,ui,constants}` 이다.
- popup UI 비동기 상태는 TanStack Query가 소유하고, Zustand는 선택된 리스트, 열린 모달, 선택된 command 같은 UI 상태만 담당한다.
- `chrome.runtime.sendMessage` 는 직접 호출을 흩뿌리지 않고 typed wrapper로 통합한다.
- 서비스 워커 분기는 문자열 `if` 체인 대신 메시지 타입별 handler map 구조를 목표로 한다.
- 저장 모델을 `CommandItem[]` 으로 전환하면 `set-command-by-index` 와 콘텐츠 스크립트 단축키 흐름도 함께 조정되어야 한다. 인덱스 기반 단축키는 유지하되 내부 저장 모델은 id와 order를 사용해도 된다.
- 테스트 도구는 현재 CRA 기본 테스트 스택을 유지해도 되지만, 빌드 전환 시 테스트 실행 방식이 바뀌는 경우 `npm test` 와 동등한 로컬 검증 명령을 문서화해야 한다.

## Completion Criteria

- popup UI, service worker, content script, 메시지 adapter, 주요 domain/service 계층이 TypeScript 파일로 관리되고 strict 타입 검사 대상에 포함된다.
- `src/` 와 extension runtime 경계가 공통 타입을 공유하며, 메시지 요청/응답 payload가 문자열 임의 객체가 아닌 선언된 타입으로 제한된다.
- 리스트 조회/선택/추가/수정, 커맨드 조회/추가/수정/삭제/순서 변경, 현재 리스트 저장/조회, 단축키 기반 command 저장/붙여넣기 흐름이 기존과 동일하게 관찰된다.
- import casing, 이벤트 cleanup, uncontrolled/controlled 혼합 입력, async 저장 누락 가능성 등 현재 구조적 결함이 제거된다.
- React Query query key 와 invalidate 정책이 공통화되어 리스트/커맨드 갱신 후 popup UI가 일관되게 최신 상태를 반영한다.
- `docs/specs/typescript-extension-refactor.md` 만 읽어도 다음 작업자가 구현 범위와 제약을 이해하고 작업을 분할할 수 있다.
