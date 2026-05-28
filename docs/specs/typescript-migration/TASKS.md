# TypeScript 마이그레이션 Tasks

이 문서는 `SPEC.md`를 구현 가능한 리뷰 단위로 나눈 작업 목록입니다.

## Task 1. TypeScript 기본 설정 추가

- TypeScript, React/Node/Chrome 타입, esbuild 의존성을 추가한다.
- CRA 호환 `tsconfig.json`과 `typecheck`, `build:extension` 스크립트를 추가한다.
- 기존 `start`, `test`, `eject` 스크립트는 유지한다.

## Task 2. 공통 도메인/메시지 타입 정의

- `src/types/domain.ts`에 리스트, 커맨드, IndexedDB record 타입을 정의한다.
- `src/types/messages.ts`에 `chrome.runtime.sendMessage` request/response 계약을 정의한다.

## Task 3. Popup API, Store, Hook 계층 TypeScript 전환

- `src/api`, `src/stores`, `src/hooks`를 `.ts`로 전환한다.
- API 계층은 공통 메시지 타입을 사용하는 helper를 통해 `chrome.runtime.sendMessage`를 호출한다.
- Zustand와 TanStack Query 사용부에 state/action/mutation/query 타입을 지정한다.

## Task 4. Popup Component와 Style TypeScript 전환

- `src/index`, `src/App`, `src/components`, `src/styles`를 `.ts`/`.tsx`로 전환한다.
- props, event handler, modal setter, drag-and-drop 관련 타입을 명시한다.
- SVG import 선언을 추가한다.

## Task 5. Extension 원본 구조 분리

- `public/service-worker.js`, `public/modules/**` 로직을 `extension/` TypeScript 원본으로 분리한다.
- `public/contents/*.js`의 전역 함수 순서 의존을 제거하고 `extension/contents/content.ts` 단일 entry로 통합한다.

## Task 6. esbuild 기반 Extension 빌드 추가

- `scripts/build-extension.mjs`를 추가한다.
- `extension/service-worker.ts`를 `build/service-worker.js`로 번들한다.
- `extension/contents/content.ts`를 `build/contents/content.js`로 번들한다.
- `npm run build`가 React Popup과 Extension 런타임을 모두 빌드하도록 연결한다.

## Task 7. Manifest와 public 정리

- `public/manifest.json`의 content script 참조를 `contents/content.js` 단일 파일로 정리한다.
- `public/`에서 런타임 원본 JavaScript를 제거하고 정적 파일만 남긴다.

## Task 8. 검증과 문서 갱신

- `npm run typecheck`, `npm run build`, 가능한 테스트 명령을 실행한다.
- `README.md`, `docs/README.md`, `docs/architecture.md`를 TypeScript/Extension 빌드 구조에 맞게 갱신한다.

## Review Order

1. Task 1-2: 타입 기반과 메시지 계약
2. Task 3-4: Popup TypeScript 전환
3. Task 5-7: Extension 런타임과 빌드 산출 구조
4. Task 8: 최종 검증과 문서
