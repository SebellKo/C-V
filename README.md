# C:V

![C:V](https://github.com/user-attachments/assets/d4241dd9-6cd9-4e9e-bbf5-35884586fa03)

> 현재 저장소는 TypeScript 기반 최소 bootstrap 상태입니다. 기존 JavaScript 구현은 `legacy-js-final` Git 태그에 보존되어 있으며, 새 구현의 제품 기준은 `docs/` 문서입니다.

C:V는 자주 사용하는 여러 텍스트를 리스트별로 저장하고, Chrome에서 숫자 단축키로 빠르게 클립보드에 복사하는 데스크톱 확장 프로그램입니다.

## 제품 목표

- 여러 페이지를 오가며 같은 문장이나 양식을 반복해서 복사하는 작업을 줄입니다.
- 최대 10개의 리스트와 리스트별 10개의 command 위치를 단순하게 관리합니다.
- 계정이나 외부 서버 없이 사용자의 Chrome 프로필 안에 데이터를 보관합니다.
- popup과 단축키에서 동일한 리스트와 command를 일관되게 사용합니다.

## 기준 문서

- [제품 기획 및 범위](./docs/product.md): 사용자 문제, MVP 기능, 기능 계약, 예외 동작, 완료 조건
- [데이터 및 개인정보 정책](./docs/data-privacy-policy.md): 저장 데이터, 권한, 보존·삭제, 기존 데이터 호환 범위, 보안 원칙
- `docs/architecture.md`: TypeScript 구현을 진행하면서 다시 설계할 예정이며 현재 재구현의 기준으로 사용하지 않습니다.

## 재구현 기본 조건

- Chrome Extension Manifest V3
- production source 전체 TypeScript 사용
- `chrome.storage.local` 기반 로컬 영속 저장
- 외부 서버, 계정, 원격 동기화, 분석 SDK 없음
- 최신 Chrome 데스크톱을 대상으로 하며 macOS를 우선 검증 환경으로 사용

구체적인 framework, 상태 관리 방식, module 구조, 테스트 전략은 architecture 설계 단계에서 결정합니다.
