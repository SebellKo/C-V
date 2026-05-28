# C:V Documentation

이 폴더는 C:V 프로젝트를 이해하고 유지보수하기 위한 개발 문서입니다.

C:V는 Chrome Extension 기반의 멀티 복사/붙여넣기 도구입니다. 사용자는 팝업 UI에서 리스트와 커맨드를 관리하고, 웹 페이지에서는 단축키로 현재 리스트를 선택하거나 커맨드를 클립보드에 복사할 수 있습니다.

## 문서 목록

- [아키텍처](./architecture.md): 폴더 구조, 런타임 구성, 메시지 흐름, IndexedDB 구조
- [기능 명세](./features.md): 리스트/커맨드 관리, 단축키, 데이터 제한
- [Specs](./specs/README.md): 구현 전 검토용 Spec과 task 문서

## 기술 스택

- React 18
- TypeScript
- Chrome Extension Manifest V3
- IndexedDB
- TanStack Query
- Zustand
- styled-components
- dnd-kit
- esbuild

## 핵심 개념

- 리스트: 커맨드를 담는 그룹입니다. 최대 10개까지 저장합니다.
- 커맨드: 사용자가 저장해두고 복사/붙여넣기에 활용하는 텍스트입니다. 리스트당 최대 10개까지 저장합니다.
- 현재 리스트: 단축키 동작의 기준이 되는 리스트입니다.
- 팝업 UI: 리스트와 커맨드를 생성, 수정, 삭제, 정렬하는 React 화면입니다.
- Content Script: 웹 페이지에서 단축키와 선택 텍스트를 감지합니다.
- Service Worker: 팝업과 Content Script의 요청을 받아 IndexedDB를 읽고 씁니다.

## 빌드 기준

- TypeScript 원본은 `src/`와 `extension/`에 있습니다.
- `public/`은 manifest, HTML, icon 같은 정적 파일만 관리합니다.
- `npm run build`는 React Popup과 Chrome Extension 런타임 스크립트를 모두 빌드합니다.
- Chrome에 로드할 unpacked extension 대상은 `build/` 디렉토리입니다.
