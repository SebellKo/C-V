# 아키텍처

- 문서 상태: 구현 기준 v1
- 최종 수정일: 2026-08-30
- 적용 대상: C:V Chrome Extension TypeScript 구현

## 1. 문서 목적

이 문서는 C:V를 구현하고 리뷰할 때 유지해야 하는 기술 선택과 책임 경계를 정의합니다.

주요 범위는 실행 환경, module 책임, 영속 데이터 계약, 상태 변경 방식, runtime 통신, 권한, build와 검증 구조입니다. 구체적인 파일명, 함수 signature와 component 내부 구조는 이 계약을 지키는 범위에서 실제 코드가 기준이 됩니다.

## 2. 설계 원칙

1. 영속 데이터의 단일 원본은 `chrome.storage.local`입니다.
2. Background만 영속 state를 변경합니다.
3. Popup은 화면을 위한 최신 snapshot과 일시적인 입력 상태만 가집니다.
4. Content Script는 웹 페이지에서만 가능한 기능을 담당합니다.
5. domain 규칙은 Chrome API와 React에 의존하지 않습니다.
6. 실행 환경 사이에는 구체적인 사용자 의도를 message로 전달합니다.
7. 하나뿐인 구현을 위한 교체 가능성이나 미래 확장용 추상화는 만들지 않습니다.

## 3. 실행 환경과 데이터 흐름

| 실행 환경 | 책임 |
| --- | --- |
| Popup | React UI, 입력 draft, dialog와 loading 상태, 최신 state snapshot 표시 |
| Content Script | 페이지 단축키, 선택 텍스트 읽기, clipboard 쓰기, web toast 표시 |
| Background Service Worker | message 검증과 전달, 최신 state 조회, 변경 직렬화와 영속 저장 |
| Domain | 영속 type, 최소 구조 검사, 순수한 제품 규칙과 오류 표현 |

데이터 흐름은 다음 한 방향을 따릅니다.

~~~
Popup ───────┐
             ├─ runtime message ─> Background ─> Domain
Content ─────┘                         │             │
                                      │             └─ 변경 결과 또는 오류
                                      └─ chrome.storage.local
~~~

Popup과 Content Script는 storage에 직접 접근하거나 서로 직접 통신하지 않습니다.

## 4. 기술 stack

| 영역 | 선택 |
| --- | --- |
| package manager | npm |
| runtime | Node.js LTS |
| language | strict TypeScript |
| extension | Chrome Extension Manifest V3 |
| build | Vite |
| Popup UI | React 19 |
| UI source | shadcn/ui, Base UI, Nova preset |
| styling | Tailwind CSS v4와 semantic CSS token |
| icon | Lucide React |
| drag and drop | `@dnd-kit/react`, `@dnd-kit/helpers` |

정확한 package version과 shadcn이 생성하는 보조 dependency는 `package.json`과 `package-lock.json`을 기준으로 합니다. architecture에는 직접 선택한 핵심 기술만 기록합니다.

## 5. Module 경계

| 영역 | 책임 |
| --- | --- |
| `domain` | state type, 구조 검사와 순수 변경 규칙 |
| `storage` | `chrome.storage.local` 읽기와 쓰기 |
| `messages` | 실행 환경이 공유하는 request와 response 계약 |
| `background` | message dispatch와 state 변경 조정 |
| `content` | 페이지 단축키, clipboard와 web toast |
| `popup` | React 화면과 Popup 전용 component |
| `styles` | 여러 UI에서 공유하는 semantic token |

shadcn이 생성한 UI source와 C:V 전용 component는 모두 Popup 영역 안에서 관리합니다. 별도의 최상위 공용 component 영역은 만들지 않습니다.

module은 처음부터 세분화하지 않습니다. 책임이 실제로 둘 이상이 되거나 탐색이 어려워질 때 같은 영역 안에서 분리합니다.

## 6. 영속 데이터 계약

storage key는 `cvState` 하나만 사용합니다.

~~~ts
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
~~~

빈 설치는 다음 state에서 시작합니다.

~~~ts
const initialState: AppState = {
  schemaVersion: 1,
  currentListId: null,
  lists: [],
};
~~~

- List와 Command ID는 생성 시 UUID로 만듭니다.
- List와 Command 순서는 배열 순서로 표현합니다.
- 위치와 순서를 나타내는 별도 숫자 필드는 저장하지 않습니다.
- 현재 List는 ID로 참조하며 없을 수 있습니다.
- JSON으로 직접 표현할 수 있는 값만 저장합니다.
- 이전 IndexedDB 데이터는 가져오지 않습니다.

이 schema는 저장 데이터 호환성에 영향을 주는 계약입니다. 변경할 때는 `schemaVersion`과 기존 데이터 처리 방식을 함께 결정합니다.

## 7. State 읽기와 검증

storage에서 읽은 값은 `unknown`으로 취급하고 작은 수동 검사로 `AppState`의 version과 필수 구조를 확인합니다. 별도의 범용 schema 또는 migration framework는 두지 않습니다.

| 저장 상태 | 처리 |
| --- | --- |
| `cvState` 없음 | 메모리에서 `initialState` 사용, 최초 변경 시 저장 |
| 정상적인 version 1 | 검사한 state 반환 |
| 알 수 없는 version 또는 잘못된 구조 | 자동 초기화하지 않고 오류 반환 |
| 존재하지 않는 현재 List ID | 읽은 snapshot에서 `null`로 정리 |

이 검사는 저장 형식의 안전만 보장합니다. 이름, 중복, 최대 개수와 위치 같은 제품 규칙은 domain 변경 과정에서 검사합니다.

## 8. State 소유권과 변경 직렬화

Background는 영속 state의 유일한 writer입니다. Content Script의 직접 접근은 Chrome Storage의 trusted context 설정으로 제한합니다.

모든 변경은 하나의 직렬 실행 흐름에서 접수 순서대로 처리하며 다음 계약을 지킵니다.

1. 앞선 변경 완료 대기
2. storage에서 최신 state 읽기
3. domain 규칙 적용
4. 새 state 검사와 저장 완료 대기
5. 저장된 결과 반환

작업 하나가 실패해도 다음 작업을 처리할 수 있어야 합니다. 조회는 먼저 접수된 변경이 끝난 뒤 storage를 읽어 최신 값을 반환합니다.

service worker 메모리는 언제든 사라질 수 있으므로 state cache로 사용하지 않습니다. 직렬화 장치는 실행 순서만 제어하며 실제 데이터는 매 변경 시 storage에서 다시 읽습니다.

리스트 관리 화면의 이름·순서·삭제는 전체 snapshot 교체가 아니라 metadata 변경 의도로 전달합니다. Background는 이를 최신 state에 적용해 Popup이 열린 뒤 추가되거나 수정된 Command를 보존합니다.

## 9. Runtime message 계약

실행 환경 통신은 Chrome의 일회성 runtime message를 사용합니다. 장기 연결과 외부 extension message는 사용하지 않습니다.

| 요청 주체 | 요청 범위 | 성공 결과 |
| --- | --- | --- |
| Popup | state 조회, List와 Command 관리 | 최신 `AppState` |
| Content Script | 위치 기반 List 선택 | 선택된 List 정보 |
| Content Script | 위치 기반 Command 조회 | clipboard에 쓸 Command 정보 |
| Content Script | 선택 텍스트 저장 | 저장된 위치와 toast 요약 정보 |

message는 범용 state patch가 아니라 생성, 선택, 이름 변경, 순서 변경, 삭제처럼 구체적인 의도를 표현합니다. 단, 리스트 관리의 여러 metadata 변경은 최신 Command 보존을 위해 하나의 요청으로 묶습니다.

Background는 모든 message를 `unknown`으로 받아 알려진 동작과 필요한 primitive 값을 검사한 뒤 처리합니다. 성공 응답은 필요한 결과만 반환하고 실패 응답은 안정적인 오류 code만 반환합니다.

사용자 콘텐츠, raw Error와 stack trace는 오류 응답이나 log에 포함하지 않습니다.

## 10. Popup 상태 소유권

Popup은 React 내장 상태로 다음 범주의 값만 관리합니다.

- Background에서 받은 최신 `AppState` snapshot
- 초기 조회와 저장 요청의 진행 상태
- 현재 화면, dialog, 입력 draft와 validation message

영속 변경은 성공 응답으로 받은 최신 state를 기준으로 화면에 확정합니다. 실패하면 기존 snapshot과 사용자의 입력 draft를 유지합니다.

Popup을 별도 장기 cache로 사용하지 않습니다. Popup을 다시 열면 Background에서 최신 state를 다시 읽습니다.

## 11. Content Script와 페이지 기능

Content Script는 React를 사용하지 않는 vanilla TypeScript로 유지합니다. 최상위 frame에서 다음 기능만 담당합니다.

- C:V 단축키 감지
- 단축키 시점의 선택 텍스트 읽기
- Web Clipboard API를 사용한 쓰기
- 성공 결과를 현재 페이지의 web toast로 표시

clipboard 작업은 사용자 단축키에서만 실행하며 읽기 기능은 사용하지 않습니다. clipboard 쓰기가 성공한 뒤에만 성공 toast를 표시합니다.

web toast는 닫힌 Shadow DOM으로 페이지 style과 분리하고 사용자 값을 일반 텍스트로 렌더링합니다. Chrome 시스템 알림이나 운영체제 알림은 사용하지 않습니다.

## 12. Popup UI와 DnD

Popup은 shadcn/ui source component와 C:V 전용 component를 조합합니다. Base UI를 primitive로 사용하고 Nova preset을 기준으로 생성합니다.

색상, spacing, radius와 typography 값은 semantic CSS token을 단일 원본으로 사용합니다. Tailwind는 해당 token을 소비하며 같은 값을 별도로 복제하지 않습니다.

List와 Command DnD는 현재 dnd-kit React package를 사용합니다. DnD 계층은 drag 결과의 ID만 domain 변경으로 전달하며 제품 데이터 규칙을 직접 구현하지 않습니다.

drag 중 영속 state를 변경하지 않고 유효한 drop의 저장이 성공한 뒤 결과를 확정합니다. pointer 외에도 keyboard와 위·아래 이동 action이 같은 domain 규칙을 사용해야 합니다.

## 13. 오류와 보안 경계

오류는 다음 범주를 구분할 수 있는 안정적인 code로 표현합니다.

- 잘못된 request와 입력
- 존재하지 않는 List, Command 또는 위치
- 중복과 최대 개수
- storage 읽기와 쓰기 실패
- 지원하지 않는 저장 schema
- clipboard 쓰기 실패

Background와 domain은 사용자에게 표시할 한국어 문장을 만들지 않습니다. Popup과 Content Script가 각 실행 환경의 한 곳에서 오류 code를 사용자 문구로 변환합니다.

잘못된 state나 저장 실패를 빈 데이터로 복구하지 않습니다. 사용자 콘텐츠는 HTML로 해석하거나 console log, 오류 응답과 외부 서비스로 전달하지 않습니다.

## 14. Manifest와 build

Manifest V3 구성에는 다음 기능에 필요한 선언만 포함합니다.

- Popup action과 Popup 열기 command
- module Background Service Worker
- HTTP와 HTTPS 페이지의 정적 Content Script
- `storage` permission
- `clipboardWrite` permission

Content Script의 페이지 접근 범위와 clipboard 쓰기 권한은 사용자에게 보이는 Chrome 경고에 영향을 줄 수 있으므로 기능 범위를 넓힐 때 함께 검토합니다.

Vite는 Popup, Background와 Content Script를 하나의 project에서 build합니다. Manifest가 직접 참조하는 Background와 Content Script entry는 안정적인 output 이름을 사용하고 나머지 asset은 Vite가 관리합니다.

production source는 TypeScript로 작성하며 typecheck가 성공해야 production build를 생성합니다. 배포 artifact에는 build 결과물만 포함합니다.

## 15. 검증 전략

검증은 다음 세 수준으로 구성합니다.

| 수준 | 검증 대상 |
| --- | --- |
| Unit | domain 규칙과 state 구조 검사 |
| Integration | Chrome Storage, mutation 직렬화와 runtime message 경계 |
| Extension E2E | Popup, 단축키, clipboard와 web toast의 사용자 흐름 |

테스트 dependency와 테스트 코드는 기능 구현이 완료된 뒤 추가합니다. GitHub Actions workflow는 만들지 않습니다.

merge와 release 전에는 typecheck, production build, 자동 테스트와 macOS 최신 안정 Chrome의 unpacked extension 수동 검증을 통과해야 합니다.
