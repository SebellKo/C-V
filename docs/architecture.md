# 아키텍처

- 문서 상태: 설계 예정
- 최종 수정일: 2026-08-25

기존 JavaScript 구현의 아키텍처는 TypeScript 재구현의 기준으로 사용하지 않습니다.

현재 확정된 구현 조건은 다음뿐입니다.

- Chrome Extension Manifest V3
- production source 전체 TypeScript 사용
- `chrome.storage.local` 기반 로컬 영속 저장
- popup, content script, background service worker 실행 환경 필요
- 외부 서버와 원격 동기화 없음

framework, 상태 관리, module 책임, 메시지 계약, 저장 schema, 동시성 처리, 테스트 전략과 build 구성은 실제 구현을 진행하면서 이 문서에 함께 설계합니다.

제품 동작은 [제품 기획 및 범위](./product.md), 데이터 처리는 [데이터 및 개인정보 정책](./data-privacy-policy.md)을 우선합니다.
