# C:V

![C:V](https://github.com/user-attachments/assets/d4241dd9-6cd9-4e9e-bbf5-35884586fa03)

C:V는 자주 사용하는 여러 텍스트를 리스트별로 저장하고, Chrome에서 숫자 단축키로 빠르게 클립보드에 복사하는 데스크톱 확장 프로그램입니다.

## 제품 목표

- 여러 페이지를 오가며 같은 문장이나 양식을 반복해서 복사하는 작업을 줄입니다.
- 최대 10개의 리스트와 리스트별 10개의 command 위치를 단순하게 관리합니다.
- 계정이나 외부 서버 없이 사용자의 Chrome 프로필 안에 데이터를 보관합니다.
- popup과 단축키에서 동일한 리스트와 command를 일관되게 사용합니다.

## 기준 문서

문서별 목적, 범위와 상태는 [C:V 문서 안내](./docs/README.md)에서 관리합니다.

## 디자인 보드 확인

저장소 안의 CSS token과 HTML 와이어프레임을 디자인 원본으로 사용합니다. 개발 서버를 실행하고 `/design/wireframes/`를 열면 10개 popup 상태와 3개 web toast 상태를 확인할 수 있습니다.

```sh
npm run dev
```

## 로컬 설치

Node.js 24 LTS와 npm을 사용합니다. 저장소 루트에서 실행합니다.

```sh
npm ci
npm test
npm run build
npm run check:release
```

Chrome의 `chrome://extensions`에서 개발자 모드를 켜고 **압축 해제된 확장 프로그램을 로드**로 `dist/`를 선택합니다. 확장을 고정하고 테스트할 웹 페이지를 새로고침한 뒤 popup을 엽니다.

기존 JavaScript 버전의 IndexedDB 데이터는 이전되지 않습니다. 업데이트 전에 필요한 문구를 따로 복사해 보관해주세요. 확장을 제거하면 로컬 저장 데이터가 삭제됩니다.

설치·업데이트·배포 절차와 사용자 QA 체크리스트는 [문서 안내](./docs/README.md)에서 확인할 수 있습니다.

`npm test`는 상태·동시성·메시지·클립보드·알림·팝업의 회귀 테스트를 실행합니다. `npm run check:release`는 빌드 파일과 스토어 이미지 규격을 검사합니다. 실제 Chrome 단축키와 시스템 붙여넣기는 수동 QA로 확인합니다.

## 기술 구성

- Chrome Extension Manifest V3
- production source 전체 TypeScript 사용
- `chrome.storage.local` 기반 로컬 영속 저장
- 외부 서버, 계정, 원격 동기화, 분석 SDK 없음
- 최신 Chrome 데스크톱을 대상으로 하며 macOS를 우선 검증 환경으로 사용
