# 설치·업데이트·배포 안내

- 대상: C:V 2.0.0 TypeScript 재구현
- 확인일: 2026-10-25
- 상태: 기능 소스와 스토어 자료 포함, 영구 자동 테스트 미포함. 공개 제출·게시 완료 여부는 확인되지 않음

제품 사용법과 제한은 [제품 문서](product.md), 데이터 처리는 [제품의 데이터 안내](product.md#데이터와-개인정보-요약), 검증 근거는 [QA 기록](qa.md)을 참고합니다.

## 1. 빌드와 설치

소스에서 빌드할 때는 Node.js 24 LTS와 npm을 사용합니다. 저장소 루트에서 실행합니다.

```sh
npm ci
npm run build
```

빌드는 strict TypeScript 검사 후 Popup·Background와 단일 IIFE Content Script를 `dist/`에 생성합니다. 개발 서버는 디자인 보드 확인용이며 실제 확장 검증은 production build를 로드해 진행합니다.

1. Chrome에서 별도 QA 프로필을 열고 `chrome://extensions`로 이동합니다.
2. 개발자 모드를 켜고 **압축 해제된 확장 프로그램을 로드**를 누릅니다.
3. `manifest.json`이 바로 들어 있는 `dist/` 폴더를 선택합니다. ZIP을 받았다면 먼저 압축을 풀고 같은 위치를 선택합니다.
4. 확장을 도구 모음에 고정하고 테스트할 HTTP/HTTPS 페이지를 새로고침합니다.
5. popup을 열고 리스트를 만든 뒤 현재 리스트로 선택해 Command를 추가합니다.

## 2. 사용과 단축키

| 동작 | macOS | Windows/Linux |
| --- | --- | --- |
| Popup 열기 | Command+B | Ctrl+B |
| 현재 리스트 선택 | Shift+숫자 | Shift+숫자 |
| Command 복사 | Option+숫자 | Alt+숫자 |
| 선택 텍스트 저장 | Shift+Option+숫자 | Shift+Alt+숫자 |

숫자 0은 10번입니다. 복사한 내용은 원하는 곳에서 시스템 붙여넣기로 사용합니다. 저장은 기존 위치를 교체하거나 마지막 위치 바로 다음에 추가합니다. 일반 입력창·편집기에서는 리스트 선택과 복사 단축키가 실행되지 않습니다. 텍스트 저장은 선택 내용이 있어야 실행되며 편집 중 선택한 원문을 보존합니다.

Popup 열기 단축키는 `chrome://extensions/shortcuts`에서 확인·변경할 수 있습니다. 페이지의 세 가지 숫자 단축키는 고정입니다. 페이지 단축키나 운영체제 입력과 충돌하면 본문에 포커스를 두고 다시 확인합니다. `chrome://`와 Chrome Web Store 등 제한 페이지에서는 페이지 단축키가 동작하지 않습니다.

## 3. 업데이트와 복구

Unpacked 설치는 **같은 폴더 경로**에 새 빌드 파일을 놓고 `chrome://extensions`의 C:V 새로고침 버튼을 누릅니다. 열린 popup을 닫았다 다시 열고, 사용할 웹 페이지도 새로고침해 새 Content Script를 적용합니다. ZIP 업데이트는 기존 설치 폴더의 빌드 파일을 새 ZIP 내용으로 교체합니다.

업데이트 후에는 리스트·Command·현재 선택·순서를 확인합니다. 기존 v1 `cvState` 데이터를 사용하는 TypeScript 버전의 새로고침은 데이터 삭제 절차가 아닙니다. 폴더 경로를 바꿔 재설치하면 별도 확장으로 인식될 수 있으므로 데이터가 옮겨진다고 가정하지 않습니다.

저장 오류는 입력을 유지한 채 다시 시도합니다. 응답을 받지 못했다면 **저장 결과 확인** 또는 **다시 불러오기**로 실제 결과부터 확인합니다. 지원하지 않는 schema나 잘못된 데이터 오류가 나오면 데이터를 지우거나 확장을 제거해 복구하려 하지 말고 사용 버전과 오류를 기록합니다.

## 4. 사용자에게 알릴 데이터 변경

> 2.0.0은 TypeScript로 재구현한 버전입니다. 기존 JavaScript 버전의 IndexedDB에 저장한 리스트와 Command를 자동으로 가져오지 않으며 새 버전은 빈 목록으로 시작할 수 있습니다. 업데이트 전에 필요한 문구를 따로 복사해 보관해주세요.
>
> 저장 내용은 해당 Chrome 프로필의 로컬 확장 저장소에만 보관되며 서버 전송·기기 간 동기화·자체 백업이 없습니다. 데이터를 별도로 암호화하지 않으므로 비밀번호·인증 token 등 민감정보를 저장하지 마세요. 확장 데이터 삭제나 확장 제거 시 저장 내용이 삭제됩니다.

기존 IndexedDB 데이터의 보존·복구를 보장하지 않습니다. 새 구현에 migration과 이전 데이터 cleanup 기능은 포함되어 있지 않습니다. 이 안내는 기존 사용자에게 배포하기 전에 release note에 포함합니다.

## 5. 필요할 때 배포 ZIP 만들기

배포 ZIP은 저장소에 별도로 보관하지 않고 제출할 때 빌드해 생성합니다. ZIP에는 `dist/`의 내용만 넣고 `manifest.json`을 ZIP 루트에 둡니다. `release/`의 이미지·설명은 스토어에 따로 올리는 자료입니다.

macOS에서 저장소 루트의 터미널을 열고 실행합니다. 매번 새로운 임시 폴더에 생성하므로 이전 ZIP의 파일이 섞이지 않습니다.

```sh
npm run build
release_zip_dir=$(mktemp -d)
(cd dist && zip -r -X "$release_zip_dir/c-v-2.0.0.zip" .)
unzip -l "$release_zip_dir/c-v-2.0.0.zip"
shasum -a 256 "$release_zip_dir/c-v-2.0.0.zip"
```

버전 변경 시 `package.json`, lockfile의 root version, manifest와 ZIP 파일명을 함께 맞춥니다.

## 6. 출시 전 확인

아래 완료 표시는 기존 QA 기록에 근거합니다. 이번 문서 변경에서 다시 실행한 결과가 아니므로, 실제 제출할 빌드와 의존성을 기준으로 필요한 항목을 재확인합니다.

- [x] 사용자 QA와 발견된 문제 수정 완료
- [ ] 영구 자동 회귀 테스트 — 사용자 요청으로 PR에서 제거
- [x] 최종 typecheck와 production build 통과
- [x] 일반 macOS Chrome의 핵심 흐름 수동 검증 완료(스토어 촬영·사용자 QA 포함)
- [ ] OS 모션 감소를 켠 실제 검증 — 사용자 요청으로 미실행
- [ ] 스토어 제출 직전 게시 버전·개인정보 선언·공개 방침 URL 확인
- [x] Popup 300×380·CSS token·디자인 보드 비교 완료
- [x] 권한·개인정보 검토와 의존성 취약점 영향·처리 기록 완료
- [ ] 제출할 때 생성한 ZIP의 manifest·entry·asset·icon과 SHA-256 확인
- [x] 기존 사용자 데이터 미이전 안내 준비
- [ ] 공개용 개인정보처리방침 준비

제출 전 남은 확인 항목과 OS 모션 감소 미검증 범위를 검토합니다. Chrome Web Store 제출·공개 배포는 별도 작업입니다.

스토어 자료는 `release/` 아래에 용도별로 보관합니다.

| 폴더 | 내용 |
| --- | --- |
| `release/icons/` | 128×128 스토어 아이콘과 아이콘 원본 |
| `release/promo/` | `promo-en-original.png` 영문 홍보 이미지(440×280) |
| `release/screenshots/` | 한국어 소개 이미지 5장과 제작 기록. `en/`에는 실제 영어 UI로 캡처한 1280×800 이미지 5장 |
| `release/descriptions/` | `description-ko.txt`, `description-en.txt` 스토어 설명 |

위 네 폴더는 Git에서 관리합니다. ZIP과 로컬 QA 산출물은 Git에서 제외합니다.

상위 `release/screenshots/`의 한국어 소개 이미지는 기존 사용 화면을 참고해 AI로 재구성했습니다. 실제 캡처와 글꼴·여백·크기 등 세부 모양이 다를 수 있습니다. 한국어 이미지 순서와 검증 범위는 `release/screenshots/production-notes.txt`에 기록했습니다. 영어 이미지는 `release/screenshots/en/`에서 별도로 관리하며 실제 빌드 UI와 촬영용 예시 페이지를 브라우저로 캡처했습니다. 스토어 등록 시 언어에 맞는 설명과 이미지 5장을 선택합니다.

사용자 요청으로 공개용 개인정보처리방침과 권한 사유 파일은 PR에서 제거했습니다. 제출 시 사용할 공개 방침 URL과 개인정보 선언은 별도로 준비합니다. 자동 테스트와 배포 검사 스크립트는 저장소에 포함하지 않습니다.

## 한국어·영어로 스토어에 등록하기

확장 내부의 언어 지원과 스토어 상세 설명·이미지 등록은 별도입니다. 현재 패키지는 `_locales/en`, `_locales/ko`, `default_locale: "en"`과 번역된 manifest 설명을 포함하므로 다국어 인식을 위한 코드를 더 추가할 필요는 없습니다.

1. 현재 게시 버전보다 높은 버전으로 빌드한 ZIP을 Developer Dashboard의 **Package**에 업로드합니다. ZIP 안의 `_locales/en/messages.json`과 `_locales/ko/messages.json`을 확인합니다.
2. **Store listing** 상단의 언어 선택에서 English와 한국어를 각각 선택합니다. 선택 가능한 번역 언어는 패키지의 `_locales` 폴더와 대응합니다.
3. 영어에는 `release/descriptions/description-en.txt`, 한국어에는 `description-ko.txt`의 상세 설명을 입력합니다. 저장소의 설명 파일이 자동으로 등록되는 것은 아닙니다.
4. 언어별 **Localized screenshots**에 영어는 `release/screenshots/en/`의 5장, 한국어는 `release/screenshots/` 바로 아래의 5장을 등록합니다. 작은 홍보 이미지와 marquee 이미지는 언어별로 등록할 수 없으므로 공용 자료를 사용합니다.
5. **Distribution**의 배포 국가를 확인합니다. 지원 언어를 추가하는 것과 배포 국가를 선택하는 것은 별도 설정입니다.
6. 저장 후 두 언어의 설명·이미지·공통 기능 안내를 대조하고 심사에 제출합니다. 이 절차를 문서에 적는 것으로 업로드나 게시가 실행되지는 않습니다.

근거: [스토어 등록 정보와 언어별 설명·이미지](https://developer.chrome.com/docs/webstore/cws-dashboard-listing#localize_your_listing), [새 패키지와 버전 업데이트](https://developer.chrome.com/docs/webstore/update).

## Chrome 플랫폼 참고

- [Unpacked 설치와 확장·페이지 새로고침](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)
- [로컬 저장소와 확장 제거 시 데이터 삭제](https://developer.chrome.com/docs/extensions/reference/api/storage)
