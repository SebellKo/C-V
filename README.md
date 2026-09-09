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

`npm run build` 후 Chrome의 `chrome://extensions`에서 개발자 모드를 켜고 `dist/`를 압축 해제된 확장 프로그램으로 로드합니다.

## 기술 구성

- Chrome Extension Manifest V3
- production source 전체 TypeScript 사용
- `chrome.storage.local` 기반 로컬 영속 저장
- 외부 서버, 계정, 원격 동기화, 분석 SDK 없음
- 최신 Chrome 데스크톱을 대상으로 하며 macOS를 우선 검증 환경으로 사용
