# 데이터 및 개인정보 정책

- 문서 상태: TypeScript 재구현 기준 v1
- 최종 수정일: 2026-08-26
- 적용 대상: C:V Chrome Extension production 기능

## 1. 목적

이 문서는 C:V가 어떤 데이터를 처리하고, 어디에 저장하며, 언제 삭제하는지 정의합니다. 또한 새 구현이 따라야 하는 권한과 보안 원칙을 명시합니다.

이 문서는 구현 기준입니다. Chrome Web Store 배포 시 요구되는 외부 공개용 개인정보처리방침의 문구와 법적 검토는 배포 단계에서 별도로 확인합니다.

## 2. 핵심 정책

1. C:V는 계정 없이 동작합니다.
2. 사용자 데이터는 `chrome.storage.local`에만 저장합니다.
3. 사용자 데이터와 사용 기록을 외부 서버로 전송하지 않습니다.
4. 분석, 광고, 추적, 원격 오류 수집 SDK를 사용하지 않습니다.
5. 웹 페이지 텍스트는 사용자가 명시적으로 저장 단축키를 누른 경우에만 처리합니다.
6. 사용자가 삭제한 데이터는 로컬 저장소에서 제거하며 서버 사본은 존재하지 않습니다.
7. 오류가 발생하면 정상 데이터를 빈 상태로 덮어쓰지 않습니다.

## 3. 처리하는 데이터

### 3.1 영속 저장 데이터

| 데이터 | 목적 | 저장 위치 | 보존 기간 |
| --- | --- | --- | --- |
| schema version | 저장 형식 검증과 향후 호환성 판단 | `chrome.storage.local` | 확장 데이터 삭제 시까지 |
| 리스트 ID | 이름 변경과 순서 변경에도 같은 리스트 식별 | `chrome.storage.local` | 리스트 삭제 시까지 |
| 리스트 이름 | popup 표시와 사용자 분류 | `chrome.storage.local` | 리스트 삭제 시까지 |
| 리스트 순서 | popup과 리스트 선택 단축키 번호 결정 | `chrome.storage.local` | 순서 변경 또는 리스트 삭제 시까지 |
| command 텍스트 | 사용자가 다시 clipboard로 복사할 내용 | `chrome.storage.local` | command 또는 리스트 삭제 시까지 |
| command 순서 | 연속된 목록 순서로 1~10번 단축키와 command 연결 | `chrome.storage.local` | 순서 변경 또는 command 삭제 시까지 |
| 현재 리스트 ID | 웹 페이지 단축키의 대상 결정 | `chrome.storage.local` | 선택 해제, 리스트 삭제 또는 확장 데이터 삭제 시까지 |

### 3.2 일시적으로 처리하는 데이터

| 데이터 | 처리 방식 |
| --- | --- |
| 현재 웹 페이지의 선택 텍스트 | `Shift+Alt+숫자`를 누른 시점에만 읽고 저장 요청에 사용 |
| 단축키와 숫자 위치 | 해당 동작을 실행하는 동안만 메모리에서 처리 |
| popup 입력 draft | modal이 열려 있는 동안만 popup 메모리에 유지 |
| 오류 정보 | 사용자 콘텐츠를 제외한 오류 code와 일반 메시지만 현재 실행 환경에서 처리 |

선택 텍스트를 `selectionchange` 이벤트로 계속 수집하거나 마지막 선택 내용을 장기간 메모리에 보관하지 않습니다. 단축키를 누른 시점에 현재 선택 영역을 읽고 요청이 끝나면 별도로 유지하지 않는 것을 기본 정책으로 합니다.

### 3.3 수집하지 않는 데이터

- 사용자 계정, 이름, 이메일, 연락처
- 방문 기록과 페이지 탐색 이력
- 현재 페이지 URL과 전체 본문
- C:V 단축키 이외의 일반 키 입력
- clipboard의 기존 내용
- IP 주소와 기기 식별자
- 광고 식별자와 분석 event
- 원격 crash report와 사용자 행동 telemetry

## 4. 외부 전송과 동기화

- C:V는 사용자 리스트, command, 선택 텍스트를 외부 서버로 전송하지 않습니다.
- `chrome.storage.sync`를 사용하지 않으며 다른 기기로 데이터를 동기화하지 않습니다.
- popup, content script, service worker 사이의 `chrome.runtime` 메시지는 같은 확장 프로그램 내부 처리에만 사용합니다.
- 기능 실행에 외부 API나 인터넷 연결이 필요하지 않습니다.
- 향후 외부 전송이나 동기화 기능을 추가하려면 구현 전에 이 문서와 제품 범위를 변경하고 사용자의 명시적 동의 방식을 정의해야 합니다.

## 5. Chrome 권한 정책

| 권한 또는 접근 | 사용 목적 | 제한 원칙 |
| --- | --- | --- |
| `storage` | 리스트, command, 현재 리스트의 로컬 영속 저장 | `chrome.storage.local`만 사용하고 direct access는 신뢰 가능한 extension context로 제한 |
| `http://*/*`, `https://*/*` content script | 웹 페이지에서 C:V 단축키와 명시적으로 선택된 텍스트 처리 | 전체 페이지 내용, URL, 일반 키 입력을 저장하거나 전송하지 않음 |
| clipboard 쓰기 | 사용자가 `Alt+숫자`를 누른 command를 clipboard에 기록 | clipboard를 읽지 않고 사용자 동작이 있을 때만 씀 |
| extension command | popup 열기 단축키 제공 | Chrome이 제공하는 command 범위 안에서만 사용 |

모든 페이지에 적용되는 content script match pattern은 설치 또는 업데이트 시 권한 경고를 만들 수 있습니다. 사용자에게 접근 목적을 설명하고, 사용자가 특정 사이트로 접근을 제한하면 해당 사이트에서는 C:V 단축키가 동작하지 않을 수 있음을 안내합니다.

MVP는 `unlimitedStorage` 권한을 요청하지 않습니다. Chrome이 `storage.local`에 제공하는 기본 한도 안에서 동작하고, 한도 초과를 기존 데이터가 유지되는 저장 실패로 처리합니다.

권한을 추가하거나 host 접근 범위를 확대할 때는 다음 조건을 모두 만족해야 합니다.

1. MVP 기능에 실제로 필요합니다.
2. 더 좁은 권한으로 같은 기능을 구현할 수 없습니다.
3. 이 문서에 목적과 처리 데이터를 기록합니다.
4. 사용자에게 보이는 설명과 Chrome Web Store 선언을 함께 갱신합니다.

## 6. 저장소 접근 정책

- 영속 데이터의 단일 원본은 service worker가 관리하는 `chrome.storage.local`입니다.
- content script는 저장소를 직접 읽거나 쓰지 않고 검증된 extension 내부 메시지를 사용합니다.
- popup은 영속 데이터의 임시 화면 스냅샷만 가집니다.
- popup 상태를 별도의 영속 원본이나 장기 cache로 취급하지 않습니다.
- 저장소에서 읽은 데이터와 저장 직전 데이터의 최소 schema를 런타임에서 검사합니다.
- 잘못된 schema를 발견하면 자동으로 빈 상태를 저장하지 않습니다.
- 사용자 콘텐츠가 포함된 전체 state를 console log나 오류 메시지로 출력하지 않습니다.

## 7. 사용자 동작별 데이터 처리

### 리스트 또는 command 생성·수정

1. 사용자가 popup에서 확인을 누릅니다.
2. 입력을 검증합니다.
3. 영속 저장소 변경이 성공해야 성공으로 처리합니다.
4. 실패하면 기존 영속 데이터와 입력 draft를 유지합니다.

### 웹 페이지 선택 텍스트 저장

1. 사용자가 텍스트를 선택합니다.
2. 사용자가 `Shift+Alt+숫자`를 누릅니다.
3. 그 시점의 선택 텍스트만 읽습니다.
4. 현재 리스트와 command 위치를 검증합니다.
5. 저장 성공 후에만 변경을 확정합니다.

### command clipboard 복사

1. 사용자가 `Alt+숫자`를 누릅니다.
2. 현재 리스트의 해당 command를 읽습니다.
3. command가 존재할 때만 clipboard에 씁니다.
4. 기존 clipboard 내용을 읽거나 별도로 보관하지 않습니다.

### 삭제

- command 삭제는 해당 위치의 텍스트를 로컬 저장소에서 제거합니다.
- 리스트 삭제는 리스트 이름과 그 안의 모든 command를 제거합니다.
- 현재 리스트를 삭제하면 현재 리스트 ID도 함께 제거합니다.
- C:V는 삭제된 데이터의 서버 사본이나 자체 휴지통을 보관하지 않습니다.

## 8. 보존과 전체 삭제

사용자 데이터는 다음 중 하나가 발생할 때까지 Chrome 프로필의 확장 저장소에 남습니다.

- 사용자가 C:V 안에서 command 또는 리스트를 삭제
- 사용자가 Chrome 설정에서 C:V 확장 데이터를 삭제
- 사용자가 확장 프로그램을 제거
- Chrome 프로필 자체를 삭제

일반적인 브라우저 cache와 방문 기록 삭제는 `storage.local` 데이터를 제거하지 않습니다. Chrome 공식 동작상 확장 프로그램을 제거하면 해당 로컬 저장 데이터가 삭제되며, 사용자가 개발자 도구나 확장 데이터 관리 기능에서 직접 지울 수도 있습니다.

MVP에는 별도 서버 백업이나 복구 기능이 없습니다. 사용자는 개인정보, 비밀번호, 인증 token, 비밀 key, 민감한 고객 정보처럼 유출 시 피해가 큰 값을 C:V에 저장하지 않아야 합니다.

## 9. 기존 데이터 호환 범위

- TypeScript 재구현은 기존 JavaScript 버전의 IndexedDB 데이터를 읽거나 이전하지 않습니다.
- 기존 버전에서 저장한 리스트와 command의 보존을 보장하지 않으며 새 버전은 빈 상태로 시작할 수 있습니다.
- production 코드에 IndexedDB migration 또는 cleanup 코드를 포함하지 않습니다.
- 기존 사용자에게 배포한다면 업데이트 전에 데이터가 초기화될 수 있다는 사실을 release note로 안내합니다.
- 새 TypeScript 버전에서 정의한 `chrome.storage.local` schema 이후의 호환성은 schema version 정책으로 관리합니다.

## 10. 동시 변경과 무결성

- 여러 변경 요청이 동시에 도착해도 마지막 저장이 이전 변경을 유실하면 안 됩니다.
- read-modify-write 변경은 최신 영속 state를 기준으로 순서대로 처리합니다.
- 저장 완료 전에 성공 응답을 반환하지 않습니다.
- 실패한 변경 뒤에도 다음 변경을 처리할 수 있어야 합니다.
- 현재 리스트 ID는 실제 존재하는 리스트를 가리키거나 `null`이어야 합니다.
- 리스트와 command의 최대 개수, 중복, 빈 값 규칙은 popup과 단축키 경로에 동일하게 적용합니다.

## 11. 보안 원칙

- extension 내부 메시지의 type과 payload를 런타임에서 검증합니다.
- 알 수 없는 메시지와 잘못된 payload는 저장 작업을 실행하지 않습니다.
- 사용자 command를 HTML로 해석하지 않고 일반 텍스트로 렌더링합니다.
- 사용자 콘텐츠를 오류 응답, console log, 분석 event에 포함하지 않습니다.
- content script는 C:V 단축키에 필요한 event만 처리합니다.
- 가능한 경우 storage direct access를 service worker 등 trusted extension context로 제한합니다.
- dependency를 추가할 때 사용자 데이터 접근과 외부 전송 가능성을 검토합니다.

`chrome.storage.local` 데이터는 C:V가 별도로 암호화하지 않습니다. 보안은 Chrome 프로필과 운영체제 사용자 계정의 보호 수준에 의존하므로 C:V를 비밀정보 저장소로 사용하면 안 됩니다.

## 12. 오류와 복구 정책

| 오류 | 정책 |
| --- | --- |
| 저장소 조회 실패 | 빈 state를 자동 저장하지 않고 오류 표시 및 재시도 |
| 저장소 쓰기 실패 | 성공 처리하지 않고 기존 데이터와 UI draft 유지 |
| quota 초과 | 기존 데이터 유지, 저장 공간 오류 안내 |
| schema version 불일치 | 지원하지 않는 데이터로 처리하고 자동 삭제 금지 |
| 잘못된 currentListId | 최신 리스트를 확인한 뒤 안전하게 `null`로 정리 |

## 13. 사용자 안내 기준

popup 또는 배포 설명에서 최소한 다음 사실을 알립니다.

- 모든 데이터는 사용자의 Chrome 로컬 확장 저장소에 저장됩니다.
- 서버 전송과 기기 간 동기화 기능은 없습니다.
- 확장 데이터 삭제 또는 확장 제거 시 저장 내용이 사라질 수 있습니다.
- C:V는 데이터를 별도로 암호화하지 않으므로 민감정보를 저장하면 안 됩니다.
- 웹 페이지 선택 텍스트는 사용자가 저장 단축키를 실행한 경우에만 저장됩니다.

## 14. 구현 및 리뷰 체크리스트

- [ ] 새 저장 데이터가 이 문서의 데이터 목록을 벗어나지 않는가
- [ ] 네트워크 요청이나 외부 SDK가 추가되지 않았는가
- [ ] content script가 일반 키 입력, URL, 페이지 본문을 수집하지 않는가
- [ ] 선택 텍스트는 명시적 단축키 동작에서만 처리하는가
- [ ] clipboard를 읽지 않고 필요한 경우에만 쓰는가
- [ ] 사용자 콘텐츠가 log와 오류 응답에 포함되지 않는가
- [ ] storage와 runtime message 입력을 검증하는가
- [ ] 저장 실패 전에 기존 데이터를 덮어쓰거나 삭제하지 않는가
- [ ] 생성·수정·삭제와 저장 실패 동작이 자동 테스트로 검증되는가
- [ ] 권한 변경이 문서와 Chrome Web Store 설명에 반영됐는가

## 15. Chrome 플랫폼 참고 자료

- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage): `storage.local`의 로컬 보존, 용량, content script 접근 수준
- [Chrome Commands API](https://developer.chrome.com/docs/extensions/reference/api/commands): platform별 단축키와 사용자 재설정
- [Chrome 권한 선언](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions): content script match pattern과 최소 권한 원칙
