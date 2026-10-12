# QA 절차

- 작업: #78 — 자동 테스트·macOS Chrome 검증·배포 준비
- 상태: 사용자 QA 대기, 출시 검증 미완료

## 1. 환경과 준비

최신 안정 Chrome의 macOS 데스크톱 환경에서 별도 **테스트 프로필**을 만듭니다. 실제 사용 중인 확장 데이터 대신 가짜 문구만 사용합니다. 결과에는 macOS·Chrome 버전, Git commit, 검증 날짜와 수행자를 기록합니다.

1. Node.js 24 LTS에서 `npm ci`, `npm run build`를 실행합니다.
2. `chrome://extensions`에서 개발자 모드를 켜고 `dist/`를 압축 해제된 확장 프로그램으로 로드합니다.
3. C:V를 도구 모음에 고정합니다. `chrome://extensions/shortcuts`에서 popup 열기 단축키를 확인합니다.
4. 일반 HTTP/HTTPS 페이지를 열고 새로고침합니다. 단축키는 최상위 페이지에서 확인합니다.
5. 리스트 이름은 `QA-A`, `QA-B`, `QA-C`, Command 내용은 `첫 문구`, `둘째 문구`, `셋째 문구`처럼 구분해 사용합니다. Command 공백 검증에는 앞뒤 공백과 줄바꿈을 넣습니다.

디자인 보드는 저장소 루트에서 `npm run dev`를 실행한 뒤 터미널에 표시된 주소의 `/design/wireframes/`를 엽니다.

숫자 1~9는 1~9번, 0은 10번입니다. macOS의 Option은 Alt에 해당합니다. 클립보드 결과는 빈 테스트 입력창에서 Command+V로 붙여넣어 확인합니다.

## 2. 사용자 QA

각 행을 실제로 실행한 뒤 통과·실패·미실행 중 하나로 기록합니다. 데이터 삭제 항목은 테스트 프로필에서만 수행합니다.

| ID | 실행 | 통과 기준 |
| --- | --- | --- |
| Q01 | 빈 설치에서 popup 열기, `QA-A` 만들기, 현재 리스트 선택 | 로딩 뒤 빈 상태가 나타나고 리스트 생성·선택 후 Command 추가 가능 |
| Q02 | 세 Command 추가, 공백·줄바꿈이 포함된 내용 수정, popup 다시 열기 | 저장한 원문, 현재 리스트와 순서 유지 |
| Q03 | 공백만 입력, 같은 이름·같은 Command 중복 저장, 이름 100자·101자 입력 | 유효한 100자는 저장, 잘못된 입력은 원인 표시와 draft 유지; 같은 값으로 수정은 성공 |
| Q04 | 리스트 10개, 한 리스트의 Command 10개까지 채우기 | 추가 제한 안내, 번호 0이 10번에 대응, 목록 내부만 스크롤 |
| Q05 | 리스트 A/B/C 중 A를 C 위치에 drag handle로 이동 | B/C/A 순서로 삽입, 현재 리스트는 같은 ID 유지; 이름 변경 후 원래 Command 유지 |
| Q06 | Command 1을 3 위치에 drag handle로 이동; 같은 위치·목록 밖에 drop | 3/2/1로 두 위치만 교환; 같은 위치·목록 밖은 변경 없음 |
| Q07 | 리스트·Command 메뉴의 위로/아래로 이동; handle에서 Space·방향키·Space, Escape 취소 | 리스트는 삽입, Command는 인접 교환; 취소는 변경 없음; 키보드 포커스 유지 |
| Q08 | Command 하나 삭제, 전체 삭제 취소·확인, 현재 리스트 삭제 | 번호가 연속으로 재배치; 전체 삭제는 해당 리스트만 비움; 현재 리스트 삭제 후 선택 해제 |
| Q09 | 페이지 본문에 포커스하고 Shift+숫자로 리스트 선택, Option+숫자로 복사 | 올바른 리스트·번호 toast, 붙여넣기 원문 일치; 자동 붙여넣기 없음 |
| Q10 | 본문 선택 후 Shift+Option+숫자로 기존 위치 교체·바로 다음 위치 추가 | popup에서 선택한 원문 확인; 마지막보다 두 칸 이상 뒤는 변경·성공 toast 없음 |
| Q11 | 선택 없음·공백 선택·중복 문구 저장, 없는 번호 복사·선택 | 기존 데이터 유지; 없는 번호는 성공 toast 없음, 중복은 오류 안내 |
| Q12 | input·textarea·contenteditable에서 일반 입력, Shift/Option+숫자; 텍스트 선택 후 저장 단축키 | 선택·복사 단축키가 입력을 방해하지 않음; 저장은 선택 원문을 기호로 바꾸지 않음; password 필드는 저장하지 않음 |
| Q13 | 성공 단축키 연속 실행, 긴 문구·줄바꿈·`<b>문구</b>` 저장 | toast 하나가 최신 결과로 교체되고 약 2.5초 뒤 사라짐; 미리보기는 최대 60자, HTML은 일반 텍스트 |
| Q14 | 키보드만으로 modal 열기·저장·취소·삭제; 긴 문구 편집 | label·오류·포커스 확인; Escape·취소 뒤 유효한 버튼에 포커스 복원; modal 내부 스크롤과 action 접근 가능 |
| Q15 | popup 300×380과 디자인 보드 비교; OS 모션 감소 켜고 toast·DnD 확인 | 헤더·푸터와 스크롤 영역 유지, 긴 이름·내용이 action을 가리지 않음; 감소된 모션 |
| Q16 | popup 재실행, 확장 새로고침과 웹 페이지 새로고침, Chrome 종료·재시작 | 선택·원문·순서 유지, 단축키 정상; 저장 직후 popup을 닫고 다음 실행에서 결과 확인 |
| Q17 | `chrome://extensions` 같은 제한 페이지에서 단축키 시도 | 페이지 저장·복사·toast 없음; popup 관리 기능은 사용 가능 |

## 3. 개발자 후속 검증 범위: 오류와 동시성

D01~D09는 사용자 QA 뒤 추가할 테스트의 검증 범위입니다. 아래 표는 판정 기준이며 오류 주입 harness와 구체적인 실행 절차는 아직 준비되지 않았습니다. 현재 결과는 모두 미실행으로 기록합니다. 실제 검증은 테스트 프로필에서 실행합니다. 임시 오류 주입은 제품 코드에 남기지 않습니다. `chrome://extensions`의 C:V Service Worker 검사에서 영속 state를 확인할 수 있습니다. Console·스크린샷에는 가짜 문구만 남깁니다.

| ID | 실행 | 통과 기준 |
| --- | --- | --- |
| D01 | 임시 Chrome API stub으로 storage get 실패 후 재시도 | 오류와 재시도 UI; 빈 state로 자동 저장하지 않음 |
| D02 | set 실패·quota 초과 주입 후 생성/수정/정렬/삭제; 실패 해제 후 재시도 | 성공 UI 없음, 기존 state·입력 draft 유지, 후속 요청 정상 처리 |
| D03 | 응답 유실 주입 후 `저장 결과 확인` 또는 `다시 불러오기` | 같은 변경을 즉시 재전송하지 않고 최신 저장 결과 확인; 지연된 저장 응답 전에 popup을 닫아도 전달된 요청 완료 |
| D04 | 같은 프로필의 extension 페이지 두 개에서 metadata 변경과 Command 추가를 겹쳐 실행 | 최신 Command 보존; 리스트 이름·순서 충돌은 재조회 안내; 잘못된 데이터 덮어쓰기 없음 |
| D05 | 순차 처리 중 하나를 실패시킨 뒤 다음 변경·조회를 요청 | 실패 뒤에도 queue 진행, 조회는 앞선 변경 완료 후 최신 결과 반환 |
| D06 | 테스트 state의 schemaVersion·필수 구조를 잘못 바꾸고 popup 열기; 원래 state 복원 | 오류를 표시하고 자동 초기화하지 않음; 없는 currentListId는 선택 없음으로 읽음 |
| D07 | 잘못된 type·payload의 runtime message 보내기 | 오류 code 반환, storage 변경 없음, 응답·log에 입력 원문·stack trace 없음 |
| D08 | clipboard write 실패 주입·Content Script에서 storage 접근 시도 | 복사 실패 안내와 성공 toast 없음; trusted context storage 제한 |
| D09 | popup·Background·Content Script DevTools와 빌드 결과 확인 | 불필요한 네트워크·원격 SDK·clipboard 읽기·사용자 원문 log 없음; manifest 권한은 storage/clipboardWrite와 HTTP/HTTPS 페이지 접근 |

API stub·응답 유실·동시 요청을 재현하는 harness와 영구 회귀 테스트는 사용자 QA를 마친 뒤 함께 작성합니다. 오류 주입 결과도 실제 수행 전에는 통과로 기록하지 않습니다.

## 4. 결과 기록과 출시 판정

아래 양식을 QA 결과에 사용하고 로컬 `release/qa-result.md`에 저장합니다. 검토를 요청할 때 해당 파일과 재현 화면을 공유합니다. 아직 실행하지 않은 항목은 `미실행`으로 남깁니다. 실패는 항목 ID, 번호·순서, 조작 단계, 기대/실제 결과와 재현 화면을 함께 남깁니다.

```text
날짜 / 수행자:
Git commit:
macOS / Chrome 버전:
설치 방식 / 확장 버전:
Q01~Q17: 각각 통과 / 실패 / 미실행
D01~D09: 각각 통과 / 실패 / 미실행
재현 단계와 기대 / 실제 결과:
스크린샷 또는 녹화:
```

완료 순서는 사용자 QA → 발견된 문제 수정 → state·message·popup·DnD의 영구 자동 테스트 → 최종 typecheck·자동 테스트·production build → 최신 안정 macOS Chrome 재검증입니다. 출시 전에는 데이터·권한 검토, 의존성 취약점 검토와 배포 ZIP 확인도 마칩니다. 검증이 남아 있으면 #78과 상위 로드맵을 열어 둡니다.

## 5. 2026-10-12 QA 준비 검증 기록

- Production source 기준: `4568be2446e9f4c32382b5860b36aa7ae2662bbc` (PR #91 병합)
- 수행: Codex, macOS 26.6.2, Node.js 24.19.0, npm 11.17.0
- 브라우저: 격리 프로필의 Chrome for Testing 155.0.8059.39, headless
- Popup은 extension origin의 일반 탭에서 열었습니다. 도구 모음 popup 생명주기와 실제 macOS 키보드 입력 검증을 대신하지 않습니다.

| 검사 | 결과 |
| --- | --- |
| lockfile 기준 `npm ci`, `npm run build`의 typecheck와 두 Vite build | 통과 |
| Manifest version·최소 권한·entry/icon·HTML asset 경로, Content Script의 classic script 구문 | 임시 assert 통과 |
| 문서 상대 링크와 `git diff --check` | 통과 |
| 빈 state → 리스트 생성·선택 → 공백·줄바꿈 Command 저장 → 재조회 | smoke 통과 |
| 중복 Command 오류, modal과 원문 draft 유지 | smoke 통과 |
| Popup shell 크기 | 300×380 확인 |
| HTTP 페이지의 Shift+1 선택, Shift+Option+2 선택 텍스트 추가 | smoke 통과, 재조회에서 새 문구 확인 |
| Option+1 복사 성공 toast | 화면 확인; 시스템 붙여넣기 원문 일치는 미검증 |
| 관찰한 extension 페이지의 JavaScript 오류 | 발견 없음 |
| ZIP 압축 무결성과 루트 manifest, dist 내용만 포함 | 통과 |
| 최신 안정 macOS Chrome 전체 사용자 QA, DnD·오류 주입·동시성, 영구 자동 테스트 | 미실행 |

위 smoke는 Q01~Q17 전체 통과 판정이 아닙니다. 일부 경로만 확인했으며 사용자 QA 양식의 미실행 항목을 자동으로 통과로 바꾸지 않습니다.

`npm audit` 결과는 15건(critical 1, high 11, moderate 3)입니다. shadcn CLI의 전이 dependency와 빌드 도구가 포함돼 있으며 전체 영향 검토와 조치는 미완료입니다. 자동 `--force` 수정·다운그레이드는 수행하지 않았습니다. 공개 배포 전 각 advisory의 사용 경로와 build 결과 포함 여부를 판정하고 조치 결과를 기록해야 합니다.

QA ZIP: `release/c-v-2.0.0.zip` (Git 제외)

```text
SHA-256: 46275eefdcab1f68ee3871da8efff4bfeb6ba9ea95cf33c9d308a822ae00e4d6
```

가짜 문구 화면 증거는 로컬 `release/qa-screenshots/`에 보관합니다. 이 ZIP과 증거는 QA 준비 산출물이며 공개 배포물이 아닙니다.
