# 아키텍처

- 확인일: 2026-10-25
- 기준: `main`의 `605dfa4` 소스

## 구조와 책임

C:V는 Chrome Extension Manifest V3 확장 프로그램입니다. 팝업은 React로 작성하고, background service worker가 저장 데이터를 관리하며, content script가 페이지 단축키·클립보드·알림을 처리합니다.

| 파일·영역 | 책임 |
| --- | --- |
| `src/popup/main.tsx`, `Popup.tsx` | React 시작점과 목록·관리 화면·대화상자 연결 |
| `src/popup/hooks/usePopupState.ts` | 조회·저장 요청, 스냅샷과 중복 제출 방지 |
| `src/popup/components/` | 리스트·문장·대화상자·UI 기본 컴포넌트 |
| `src/background/index.ts`, `dispatcher.ts`, `parseRequest.ts` | 저장소 접근 설정, 메시지 수신·검사·응답 |
| `src/background/stateCoordinator.ts` | 조회·변경 직렬화 |
| `src/background/stateRules.ts`, `storage.ts`, `stateError.ts` | 순수 데이터 규칙, 저장소 읽기·쓰기, 오류 코드 |
| `src/shared/type.d.ts`, `messageClient.ts` | 공유 타입과 메시지 요청·응답 처리 |
| `src/content/` | 키 입력·선택·복사·웹 알림 |
| `src/styles/` | 공유 토큰과 팝업 CSS |
| `src/utils/isRecord.ts` | 객체 입력 검사 |

데이터 규칙은 background 안에 모여 있지만 Chrome·React API에 의존하지 않는 순수 함수입니다. 별도의 최상위 domain·messages 디렉터리는 없습니다. 파일 위치보다 실제 책임 경계를 기준으로 코드를 탐색합니다.

## 기술과 의존성

| 영역 | 현재 사용 기술 |
| --- | --- |
| 언어 | strict TypeScript, TSX. `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` 사용 |
| 팝업 | React 19, Base UI, Lucide React |
| 스타일 | Tailwind CSS v4, 공유 CSS 토큰 |
| 드래그 | `@dnd-kit/react`, `@dnd-kit/dom`, `@dnd-kit/collision`, `@dnd-kit/helpers` |
| UI 생성 설정 | `components.json`의 shadcn `base-nova`. 생성한 UI 코드는 저장소에서 관리 |
| 빌드·패키지 관리 | Vite, npm, `package-lock.json` |
| 테스트·CI | 영구 자동 테스트·테스트 명령·GitHub Actions 없음 |

정확한 의존성 버전은 `package.json`과 lockfile을 따릅니다. 사용하지 않는 shadcn CLI는 제거되어 있으며 UI 소스가 이를 런타임에 요구하지 않습니다. 외부 상태 관리나 서버는 사용하지 않습니다.

## 빌드와 manifest

`npm run build`는 타입 검사 후 두 번의 Vite 빌드를 실행합니다.

| 설정·입력 | 출력 |
| --- | --- |
| `vite.config.ts`: `index.html` | `dist/index.html`과 해시가 붙은 팝업 JS·CSS |
| `vite.config.ts`: `src/background/index.ts` | `dist/background.js`와 필요한 공용 청크 |
| `vite.content.config.ts`: `src/content/index.ts` | 의존성을 포함한 단일 IIFE `dist/content.js` |

정적 content script는 module이 아니므로 독립된 IIFE로 만듭니다. 두 번째 빌드는 `emptyOutDir: false`, `copyPublicDir: false`로 앞선 출력을 보존합니다. 첫 번째 빌드에서 `public/`의 manifest와 아이콘을 복사합니다. 디자인 보드는 production 진입점이 아닙니다.

manifest는 `storage`, `clipboardWrite`를 요청합니다. HTTP/HTTPS 페이지에 `document_idle` 시점의 content script를 선언하고, 팝업 기본 단축키로 `Ctrl+B`와 Mac의 `Command+B`를 제안합니다. TypeScript 검사 대상은 `src/`이며 디자인 보드의 동작이나 실제 확장 환경을 검증하지는 않습니다.

## 실행 흐름

이하 내용은 현재 소스에서 확인한 데이터 흐름과 경계입니다. 실행 검증 결과는 [QA 문서](qa.md)에서 별도로 관리합니다.

```text
팝업 ────────┐
             ├─ runtime 메시지 → background → 데이터 규칙 → storage.local
웹 페이지 코드 ┘                    │
             ← 결과 또는 오류 ──────┘
웹 페이지 코드 → 클립보드 쓰기 / 웹 알림
```

| 실행 영역 | 책임 |
| --- | --- |
| 팝업 | 목록·선택 표시, 입력 초안, 대화상자, 저장 진행·오류 상태 |
| Content script | 키 입력 조건 확인, 선택 텍스트 읽기, 메시지 요청, 클립보드 쓰기, 웹 알림 |
| Background | 요청 검사, UUID 생성, 최신 상태 조회, 변경 직렬화, 저장, 결과 응답 |
| 데이터 규칙 | 이름·중복·개수·위치 검사, 리스트와 문장의 순수한 상태 변경 |

팝업과 content script는 영속 데이터를 직접 수정하지 않고 background에 사용자 의도를 보냅니다. 콘텐츠를 복사하는 작업은 웹 페이지 쪽에서 수행합니다. background service worker는 DOM을 사용하지 않습니다.

## 저장 형식

현재 구현은 `chrome.storage.local`의 `cvState` 키 하나에 다음 구조를 저장합니다. 타입은 `src/shared/type.d.ts`, 읽기·쓰기는 `src/background/storage.ts`에서 관리합니다.

```ts
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
```

빈 저장소는 메모리에서 `{ schemaVersion: 1, currentListId: null, lists: [] }`로 읽습니다. 최초 실제 변경 전에는 빈 상태를 저장하지 않습니다.

- 리스트와 문장 ID는 생성 요청을 처리할 때 `crypto.randomUUID()`로 만듭니다.
- 배열 순서가 표시 순서입니다. 별도 순번 필드를 저장하지 않습니다.
- 단축키의 위치는 1~10이며 데이터 규칙에 넘길 때 0부터 시작하는 인덱스로 바꿉니다.
- 현재 리스트는 ID로 참조하며 없으면 `null`입니다.
- `schemaVersion`을 바꿀 때는 기존 저장 내용 처리도 함께 결정해야 합니다. 현재 구현에는 일반 마이그레이션 기능이나 이전 IndexedDB 데이터 가져오기가 없습니다.

### 읽을 때 확인하는 것

저장 값은 신뢰하지 않고 객체·배열·필수 필드·버전·ID 중복을 검사합니다. 존재하지 않는 현재 리스트 ID는 읽은 스냅샷에서 `null`로 정리합니다. 이것만으로 즉시 저장소를 다시 쓰지는 않습니다.

알 수 없는 양의 정수 버전은 `UNSUPPORTED_SCHEMA_VERSION`, 그 외 잘못된 구조는 `INVALID_STATE` 오류로 처리합니다. 자동 초기화하지 않습니다.

이 구조 검사는 리스트 10개·이름 100자·텍스트 중복 등 모든 제품 규칙을 전수 검사하지 않습니다. 해당 규칙은 변경 작업에서 검사합니다. 현재 구현은 저장 직전에 전체 상태 검사 함수를 다시 호출하지 않습니다. 따라서 ‘모든 기존 데이터가 제품 규칙까지 검증됐다’고 설명하면 안 됩니다.

background는 저장소 직접 접근을 `TRUSTED_CONTEXTS`로 제한하도록 요청합니다. 설정 실패는 잡아서 무시하므로 제한 설정 성공을 코드가 보장하지는 않습니다. 사용자 원문은 로그나 오류 응답에 넣지 않고 일반 텍스트로 렌더링합니다.

## 변경 순서와 충돌 처리

background는 하나의 Promise 대기열로 조회와 변경을 접수 순서대로 실행합니다.

1. 앞선 요청이 끝날 때까지 기다립니다.
2. 저장소에서 최신 상태를 읽습니다.
3. 데이터 규칙으로 변경 결과를 계산합니다.
4. 바뀐 경우 저장 완료를 기다립니다. 변경이 없으면 쓰기를 생략합니다.
5. 성공 결과 또는 오류 코드를 돌려줍니다.

실패한 요청이 대기열을 계속 막지 않도록 성공·실패 모두 다음 요청으로 연결합니다. service worker 메모리는 실행 순서만 관리하고 영속 상태의 캐시로 사용하지 않습니다. worker 재시작 시 대기열은 다시 만들어지며, 중단된 요청을 복원하는 별도 영속 작업 큐는 없습니다.

리스트 이름·순서·삭제는 `lists.updateMetadata`로 처리합니다. 요청에는 변경할 `{ id, name }[]`와 편집 기준인 `expectedLists`를 함께 보냅니다. 현재 저장된 리스트의 ID·이름·순서가 기준과 다르면 `LIST_METADATA_CONFLICT`로 거부합니다. 일치하면 최신 리스트의 문장은 유지하면서 메타데이터만 바꿉니다. 목록에서 빠진 ID는 삭제로 처리합니다.

이 방식은 오래된 팝업이 다른 창의 리스트 변경을 덮어쓰는 일을 막고, 편집 중 추가된 문장을 보존합니다. 문장 자체의 동시 수정에는 같은 버전 충돌 검사가 없으며 접수 순서대로 반영합니다.

## 메시지 계약

Chrome의 일회성 `runtime.sendMessage`와 `runtime.onMessage`를 사용합니다. 장기 연결이나 외부 확장 프로그램용 메시지 API는 사용하지 않습니다.

| 요청 type | 주요 입력 | 성공 결과 |
| --- | --- | --- |
| `state.get` | 없음 | `AppState` |
| `list.create` | `name` | `AppState`. ID는 background 생성 |
| `list.select` | `listId: string \| null` | `AppState` |
| `lists.updateMetadata` | `lists`, `expectedLists`: `{ id, name }[]` | `AppState` |
| `command.create` | `listId`, `text` | `AppState`. ID는 background 생성 |
| `command.update` | `listId`, `commandId`, `text` | `AppState` |
| `command.delete` | `listId`, `commandId` | `AppState` |
| `command.clear` | `listId` | `AppState` |
| `command.swap` | `listId`, `sourceId`, `targetId` | `AppState` |
| `shortcut.list.select` | `position`: 정수 1~10 | `listId`, `listName`, `position` |
| `shortcut.command.get` | `position`: 정수 1~10 | 위 위치 정보와 `commandId`, `text` |
| `shortcut.command.set` | `position`, `text` | 저장된 문장과 위치 정보 |

응답은 `{ ok: true, data: ... }` 또는 `{ ok: false, error: '오류 코드' }`입니다. 요청은 `unknown`에 해당하는 외부 값으로 취급하고 알려진 type과 필수 값의 자료형·위치 범위를 확인합니다. 사용자 콘텐츠나 원본 Error 객체를 오류 응답에 싣지 않습니다.

background는 메시지 발신자 객체를 추가 검사하지 않습니다. 요청 형태를 검사한다는 사실과 발신 환경별 권한 검사를 한다는 주장을 구분해야 합니다.

오류 범주는 입력·중복·개수, 없는 대상, 리스트 변경 충돌, 저장소 읽기·쓰기·용량, 저장 형식입니다. UI가 오류 코드를 한국어 문장으로 바꿉니다. content script가 연결 실패를 만나면 `MESSAGE_UNAVAILABLE`로 다루고 새로고침을 안내합니다.

## 팝업과 웹 페이지 처리

팝업은 조회한 스냅샷, 현재 화면, 대화상자, 초안, 요청 진행·오류 상태를 가집니다. 저장 성공 응답으로 화면을 확정하고 실패 시 초안을 유지하는 흐름입니다. 팝업을 다시 열면 상태를 조회합니다. 열린 팝업이 다른 실행 환경의 모든 변경을 실시간 구독한다고 보장하지 않습니다.

웹 페이지 코드는 다음 순서로 동작합니다.

1. 최상위 HTTP/HTTPS 페이지에서 실제 사용자 `keydown`을 받습니다.
2. 숫자 코드와 modifier를 확인합니다. 반복 입력·입력 조합 중·추가 Ctrl/Meta/AltGraph 조합은 제외합니다.
3. 입력창에서는 저장 조합만 허용합니다. 선택은 그 시점에 읽고 비밀번호 필드는 제외합니다.
4. background에 선택·조회·저장을 요청합니다.
5. 복사는 페이지가 활성 상태일 때 수행합니다. `navigator.clipboard`가 있으면 `writeText`를 사용하고, 없을 때는 copy 이벤트와 `document.execCommand('copy')` 경로를 사용합니다. `writeText` 실패 후 이 경로로 재시도하지는 않습니다.
6. 실제 성공한 경우에만 성공 알림을 표시합니다.

웹 알림은 닫힌 Shadow DOM 안에 `textContent`로 렌더링합니다. 성공 1.5초·오류 5초 뒤 host를 제거하고, 새 알림이 오면 이전 host와 타이머를 교체합니다. 미리보기는 공백 정리 후 `slice(0, 60)`을 적용하므로 이모지 단위 보존까지 보장하지 않습니다.

## 변경할 때 유지할 경계

- 팝업은 초안과 저장된 스냅샷을 관리하며 영속 저장소의 별도 원본이 되지 않습니다.
- 데이터 변경은 background의 대기열과 순수 규칙을 통합니다. 드래그 결과도 ID 기반 요청으로 보냅니다.
- 저장소·메시지 입력 검증, 오류 코드, 실패 후 재시도와 데이터 보존 처리를 유지합니다.
- `usePopupState`는 ref로 연속 제출을 막고, 닫힌 팝업이나 취소된 조회의 늦은 응답을 화면에 적용하지 않습니다.
- 메시지 응답이 유실되면 저장 자체가 실패했다고 단정하지 않습니다. UI는 결과를 다시 조회하도록 안내합니다.
- 필요한 책임이 생길 때 파일을 나누며, 교체 가능성만을 위한 추상화나 범용 마이그레이션 틀은 추가하지 않습니다.

## 검증과 근거

검증 명령과 이번 작업 범위는 [개발 안내](development.md), 날짜별 실제 브라우저 기록은 [QA 절차](qa.md)를 참고합니다. 현재 영구 자동 회귀 테스트는 없습니다.

- 저장·메시지: [데이터 규칙](../src/background/stateRules.ts), [저장소](../src/background/storage.ts), [대기열](../src/background/stateCoordinator.ts), [요청 검사](../src/background/parseRequest.ts), [처리기](../src/background/dispatcher.ts)
- UI: [팝업](../src/popup/Popup.tsx), [상태 훅](../src/popup/hooks/usePopupState.ts)
- 페이지: [단축키](../src/content/shortcut.ts), [클립보드](../src/content/clipboard.ts), [알림](../src/content/toast.ts)
- 설정: [패키지](../package.json), [팝업·background 빌드](../vite.config.ts), [content 빌드](../vite.content.config.ts), [manifest](../public/manifest.json)
