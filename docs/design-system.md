# 디자인 시스템과 와이어프레임

- 문서 상태: v1 기준 확정
- 최종 수정일: 2026-08-29
- 대상: C:V Chrome Extension popup과 web toast

## 1. 문서 목적

C:V는 Figma 파일 대신 저장소 안의 CSS와 HTML을 디자인 원본으로 사용합니다. 이 문서는 토큰과 컴포넌트의 의도를 설명하고, 정확한 값은 [`src/styles/tokens.css`](../src/styles/tokens.css), 화면 계약은 [`design/wireframes/index.html`](../design/wireframes/index.html)에서 관리합니다.

원본의 책임은 다음처럼 나눕니다.

1. `product.md`: 사용자 동작과 제품 정책
2. `tokens.css`: 색상, 간격, typography와 크기의 정확한 값
3. `design/wireframes`: 300×380px 화면 구성과 상태별 표현
4. React와 shadcn/ui 구현: 승인된 화면을 실제 동작으로 구현

Markdown에 같은 값을 별도로 복제해 새로운 원본을 만들지 않습니다. 이 문서의 표는 토큰의 역할을 설명하며 값이 충돌하면 CSS를 따릅니다.

DnD 결과, 단축키 동작, 저장 성공 조건과 toast 표시 시점처럼 사용자 동작을 결정하는 규칙은 [`product.md`](./product.md)에서만 관리합니다.

## 2. 참고 디자인 시스템

시각 언어와 컴포넌트 구조는 **Obra shadcn/ui Kit Community Edition 2.2.0**을 참고해 C:V의 작은 popup 환경에 맞게 수정했습니다.

- 원본: <https://www.figma.com/design/E0f9DLgBIrBDSQP9pjgwZY/Obra-shadcn-ui-kit-community-edition--2.2.0---Community->
- 제작자: Obra Studio BV
- 라이선스: Creative Commons Attribution 4.0 International
- 변경 사항: 접근 가능한 blue primary와 cool gray 적용, system font 적용, 300×380px 밀도 조정, C:V 전용 command/list row 추가
- 사용하지 않는 범위: Pro Blocks와 Obra Custom components

실제 React 구현에서는 shadcn/ui의 API와 접근성 패턴을 따르되, Obra Figma 파일 자체를 runtime dependency로 사용하지 않습니다.

## 3. 토큰 구조

### Primitive

Primitive는 브랜드와 중립 색상의 원시 값입니다. 컴포넌트가 직접 참조하지 않습니다.

| 계열 | 토큰 | 용도 |
| --- | --- | --- |
| Cool neutral | `--cv-neutral-0`~`--cv-neutral-900` | 흰 surface, 글자, border와 비활성 상태 |
| Blue | `--cv-blue-50`~`--cv-blue-800` | primary, 선택 상태와 focus |
| Red | `--cv-red-50`, `--cv-red-600` | 오류와 destructive action |

### Semantic

Semantic token은 UI의 역할을 나타냅니다. 컴포넌트는 이 계층만 사용합니다.

| 역할 | 토큰 |
| --- | --- |
| 기본 화면 | `--background`, `--foreground` |
| 카드와 목록 | `--card`, `--card-foreground`, `--border` |
| 보조 정보 | `--muted`, `--muted-foreground` |
| 주요 action | `--primary`, `--primary-foreground` |
| 선택·강조 | `--accent`, `--accent-foreground` |
| 삭제·오류 | `--destructive`, `--destructive-foreground`, `--destructive-muted` |
| keyboard focus | `--ring`, `--focus-ring` |

Dark mode는 MVP 범위에 포함하지 않습니다. 필요해질 때 semantic token 값만 새 theme에서 교체하고 컴포넌트 구조는 유지합니다.

### 시각 방향

- 파스텔 색상을 넓은 면적에 사용하지 않고 흰 surface와 cool gray 배경을 기본으로 합니다.
- Blue는 primary action, 선택 상태, focus처럼 의미가 있는 위치에만 사용합니다.
- Primary button은 흰색 작은 글자도 읽을 수 있도록 밝은 system blue보다 어두운 `--cv-blue-700`을 사용합니다.
- 선명한 system blue인 `--cv-blue-600`은 focus ring처럼 면적이 작은 강조에 사용합니다.
- shadow와 radius는 hierarchy를 구분하는 데 필요한 수준으로만 사용합니다.

## 4. Popup 레이아웃 계약

Popup viewport는 항상 `300×380px`입니다.

| 영역 | 높이 | 동작 |
| --- | ---: | --- |
| Header | 52px | 현재 리스트와 화면 제목을 표시하며 고정 |
| Content | 276px | 데이터가 많으면 이 영역만 세로 scroll |
| Footer | 52px | 현재 화면의 primary action을 표시하며 고정 |

- Header와 Footer는 목록 scroll에 따라 움직이지 않습니다.
- dialog는 popup 전체에 overlay로 표시합니다.
- dialog가 길면 dialog body만 scroll하고 action 영역은 유지합니다.
- 리스트 관리는 좁은 dialog가 아니라 popup 전체를 사용하는 별도 화면입니다.

## 5. Typography와 밀도

- 글꼴은 네트워크 요청이 없는 system font stack을 사용합니다.
- 제목은 `16/24px`, 본문은 `14/20px`, label은 `12/16px`, caption은 `11/16px`입니다.
- 기본 control 높이는 36px입니다.
- icon-only action은 의미 있는 `aria-label`과 focus 표시를 가져야 합니다.
- 긴 command는 목록에서 두 줄까지 미리 표시하고 원문은 자르지 않습니다.

## 6. 컴포넌트 계약

| 컴포넌트 | 책임 |
| --- | --- |
| Popup shell | 300×380px 영역과 고정 Header/Content/Footer 경계 |
| Button | primary, secondary, ghost, destructive action |
| Icon button | 설정, 닫기, 뒤로가기와 이동 action의 icon 표현 |
| List selector | 현재 리스트와 펼쳐진 선택 menu 표현 |
| Command row | 번호, 미리보기, drag handle과 DnD 상태 표현 |
| List row | 이름, 현재 여부, drag handle과 편집 action 표현 |
| Field | label, input/textarea, 설명과 오류 메시지 |
| Dialog | 생성·수정 입력과 삭제 확인 |
| Empty state | 다음 행동이 명확한 초기/빈 상태 |
| Error state | 원인을 숨기지 않고 재시도 제공 |
| Skeleton/Spinner | 조회 전 상태를 실제 빈 데이터와 구분 |
| Web toast | icon, 결과 제목과 대상 요약을 담는 페이지 overlay 표현 |

## 7. 상태별 와이어프레임

와이어프레임 보드는 다음 상태를 모두 실제 크기로 제공합니다.

1. 초기 조회 중
2. 리스트 없음
3. 현재 리스트에 command 없음
4. 일반 command 목록
5. 리스트 선택 menu 열림
6. 리스트 관리와 순서 변경
7. 리스트 생성·이름 변경 dialog
8. command 생성·수정 dialog
9. 삭제 확인 dialog
10. 저장소 오류와 재시도

Command row의 default, dragging과 swap target 표현은 별도 popup 화면을 늘리지 않고 컴포넌트 예시에 포함합니다. 실제 위치 변경 규칙은 `product.md`를 따릅니다.

### Web toast 상태

1. 리스트 선택 완료
2. command clipboard 복사 완료
3. 선택 텍스트를 command에 저장 완료

- viewport 하단 중앙에 16px 여백을 두고 표시합니다.
- 최대 너비는 360px이며 좁은 viewport에서는 좌우 16px을 남깁니다.
- 결과 제목과 대상 요약을 각각 한 줄로 표시하고 긴 내용은 말줄임 처리합니다.
- icon은 결과를 보조하며 텍스트 없이 의미를 전달하는 유일한 수단으로 사용하지 않습니다.

## 8. 접근성과 시각 검토 기준

- focus는 색상 변화만으로 표시하지 않고 ring을 함께 사용합니다.
- 삭제 dialog는 대상과 영향을 한국어로 명시합니다.
- loading, empty, error 상태를 같은 화면처럼 표현하지 않습니다.
- web toast의 비긴급 상태는 `role="status"`, `aria-live="polite"`로 표현합니다.
- 모션 감소 설정에서는 toast의 이동 animation을 제거합니다.
- 200% 확대에서도 핵심 action에 접근할 수 있도록 scroll 경계를 유지합니다.

## 9. 로컬 확인

저장소 루트에서 다음 명령을 실행한 뒤 브라우저에서 `/design/wireframes/`를 엽니다.

```sh
npm run dev
```

와이어프레임은 runtime 데이터와 연결되지 않은 정적 디자인 산출물입니다. 실제 동작 검증은 구현 단계에서 진행합니다.
