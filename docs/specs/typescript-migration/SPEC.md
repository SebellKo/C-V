# Spec

## Summary

- C:V 프로젝트를 JavaScript 기반 React/Chrome Extension 코드베이스에서 TypeScript 기반 코드베이스로 점진적으로 마이그레이션한다.
- 작성 당시 프로젝트는 `react-scripts` 기반 CRA 앱이며, Popup UI는 `src/`, Chrome Extension Manifest V3 런타임 스크립트는 `public/service-worker.js`, `public/contents/`, `public/modules/`에 있다.

## Scope

- TypeScript 설정을 추가한다: `tsconfig.json`, 필요한 TypeScript 및 타입 패키지, CRA와 호환되는 빌드/테스트 설정.
- `src/`의 React Popup UI 파일을 `.js`/`.jsx`에서 `.ts`/`.tsx`로 전환한다. 주요 대상은 `src/index.js`, `src/App.js`, `src/api/`, `src/hooks/`, `src/stores/`, `src/components/`, `src/styles/`이다.
- Chrome Extension API, IndexedDB 데이터, 리스트/커맨드 도메인 모델의 공통 타입을 정의하고 Popup UI, Extension Script, API, Hook, Store, Component 계층에서 재사용한다.
- 확장 프로그램 런타임 스크립트 원본을 `extension/` 아래 TypeScript 파일로 분리한다. 주요 대상은 현재 `public/service-worker.js`, `public/contents/**/*.js`, `public/modules/**/*.js`에 있는 로직이다.
- `esbuild` 기반 별도 빌드 스크립트를 추가해 `extension/**/*.ts`를 Chrome이 실행 가능한 JavaScript 산출물로 컴파일하고, `public/` 또는 최종 `build/` 산출 위치에 배치한다.
- 기존 npm 스크립트 `start`, `build`, `test`가 TypeScript 전환 후에도 동작하도록 유지한다.
- 마이그레이션 중에도 Chrome Extension 동작을 보존한다: 팝업 UI, 단축키 처리, `chrome.runtime.sendMessage`, IndexedDB CRUD, 리스트/커맨드 최대 10개 제한.

## Non-scope

- C:V의 신규 기능 추가, UX/디자인 개편, 컴포넌트 구조 대규모 재설계는 포함하지 않는다.
- `react-scripts`에서 Vite, Next.js 등 다른 빌드 도구로 이전하는 작업은 포함하지 않는다. 확장 스크립트 컴파일은 CRA를 커스터마이징하거나 eject하지 않고 별도 `esbuild` 파이프라인으로 처리한다.
- IndexedDB 스키마 변경, 저장 데이터 마이그레이션, Manifest V3 권한/단축키 정책 변경은 포함하지 않는다.
- 테스트 프레임워크 교체나 E2E 테스트 도입은 포함하지 않는다.

## Constraints

- 기존 기술 스택을 유지한다: React 18, CRA `react-scripts`, Chrome Extension Manifest V3, IndexedDB, TanStack Query, Zustand, styled-components, dnd-kit.
- `public/manifest.json`의 확장 프로그램 진입점은 브라우저가 실행 가능한 JavaScript 산출물을 참조해야 한다. TypeScript 파일을 직접 참조하면 안 된다.
- `public/`은 TypeScript 원본 소스 위치로 사용하지 않는다. `public/`에는 `manifest.json`, 정적 자산, Chrome이 실행할 JavaScript 산출물만 둔다.
- 확장 스크립트 TypeScript 원본은 `extension/` 아래에 둔다. 예: `extension/service-worker.ts`, `extension/contents/content.ts`, `extension/modules/**`.
- 확장 스크립트 빌드는 `esbuild`를 사용한다. CRA 설정 변경, `react-scripts eject`, Webpack 설정 오버라이드는 기본 전략에서 제외한다.
- `public/contents/content.js`는 웹 페이지 컨텍스트에 주입되므로 브라우저 호환성과 전역 스코프 오염에 주의한다.
- `src/api/`는 `chrome.runtime.sendMessage` 응답 형태를 타입으로 고정하되, 실제 런타임에서 `chrome` 객체가 없는 개발/테스트 환경을 고려해야 한다.
- 현재 `src`에는 JavaScript/JSX 파일 47개가 있으며, `public/modules`와 `public/contents`에도 확장 프로그램 런타임 JavaScript가 존재한다.
- 작업 중 기존 사용자 변경을 되돌리지 말고, 파일명 변경 시 import 경로와 대소문자를 함께 검증한다.

## Notes

- TypeScript strictness 수준은 별도 확인이 필요하다. 초기 전환은 `allowJs`/완화된 strict 설정으로 시작하고, 후속 작업에서 `strict`를 강화하는 단계적 접근이 현실적일 수 있다.
- `styled-components` v6 타입, Zustand store 타입, TanStack Query mutation/query 타입을 먼저 정리하면 컴포넌트 전환 비용이 줄어든다.
- `extension/` 원본과 `public/` 산출물의 경계를 명확히 유지해야 한다. 개발자는 `extension/**/*.ts`를 수정하고, Chrome Extension은 빌드된 `.js`만 실행한다.
- `esbuild` entry point는 service worker와 content script를 중심으로 정의한다. `public/modules/**`의 기존 파일들이 런타임에 직접 import/참조되는 방식은 마이그레이션 전에 확인해야 한다.
- 빌드 산출물을 `public/`에 생성할지, CRA `build/` 후처리 단계에서 배치할지는 구현 시 결정할 수 있다. 단, 최종 패키징 결과의 `manifest.json` 참조 경로와 실제 `.js` 파일 위치가 일치해야 한다.
- Chrome Extension API 타입을 위해 `@types/chrome` 또는 호환 타입 패키지 도입 여부를 확인해야 한다.
- 현재 README와 docs는 프로젝트를 JavaScript 기술 스택으로 설명한다. 실제 마이그레이션 완료 후 문서 갱신이 필요할 수 있다.

## Completion Criteria

- TypeScript 마이그레이션 작업 범위와 제외 범위가 이 Spec에 따라 공유되고, 다음 작업자가 원 대화 없이도 전환 대상을 이해할 수 있다.
- `package.json`에 TypeScript 관련 의존성과 검증 스크립트가 반영되어 있다.
- `tsconfig.json`이 추가되고 CRA 기반 개발 서버와 빌드가 TypeScript 파일을 처리한다.
- `src/`의 React Popup UI가 `.ts`/`.tsx`로 전환되고 타입 오류 없이 빌드된다.
- Chrome Extension 런타임 스크립트 원본이 `extension/**/*.ts`로 분리되고, `esbuild` 빌드로 Chrome이 실행 가능한 JavaScript 산출물이 생성된다.
- `public/manifest.json` 또는 최종 패키징 산출물의 manifest가 TypeScript 원본이 아니라 빌드된 JavaScript 파일을 참조한다.
- `npm run build`가 성공하고, 가능하면 `npm test` 또는 TypeScript 타입 체크가 성공한다.
- 팝업 UI, 리스트/커맨드 CRUD, 단축키 기반 복사/붙여넣기, IndexedDB 영속성이 기존과 동일하게 동작한다.
