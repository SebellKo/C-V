# C:V 개인정보처리방침 / Privacy Policy

최종 수정: 2026-10-21 · 대상: C:V 2.0.0

## 한국어

C:V는 자주 쓰는 문장을 Chrome에 저장하고 단축키로 복사하는 확장 프로그램입니다. 계정 없이 사용할 수 있습니다.

### 어떤 정보를 처리하나요?

사용자가 입력한 리스트 이름, 문장, 순서와 현재 선택한 리스트를 해당 Chrome 프로필의 `chrome.storage.local`에 저장합니다. 웹 페이지에서는 사용자가 저장 단축키를 누른 순간의 선택 텍스트만 저장 요청에 사용합니다. 방문 기록, 페이지 URL, 전체 본문, 일반 키 입력이나 기존 클립보드 내용은 수집하지 않습니다.

복사·저장 결과를 알릴 때 리스트 이름과 문장의 최대 60자 미리보기를 현재 페이지 위에 잠시 표시합니다. 화면을 함께 보는 사람에게 문장 일부가 보일 수 있습니다.

### 권한은 왜 필요한가요?

- `storage`: 리스트·문장·순서·현재 선택을 기기에 보관하고, 브라우저를 다시 열어도 이어서 사용하기 위해 필요합니다.
- `clipboardWrite`: 사용자가 복사 단축키를 실행했을 때 선택한 저장 문장을 시스템 클립보드에 쓰기 위해 필요합니다. 기존 클립보드는 읽지 않습니다.
- HTTP/HTTPS 페이지 접근: 웹 페이지에서 단축키를 감지하고, 명시적으로 선택한 텍스트를 저장하며, 처리 결과를 보여주기 위해 필요합니다.

### 외부로 보내거나 공유하나요?

C:V는 사용자 데이터를 개발자나 외부 서버로 보내지 않습니다. 광고·분석·추적 SDK, 기기 간 동기화, 서버 백업을 사용하지 않으며 데이터를 판매하거나 제3자에게 제공하지 않습니다. 데이터는 문장 저장·관리·복사 기능을 위해서만 처리합니다.

### 보관·삭제와 주의사항

저장 내용은 사용자가 문장이나 리스트를 삭제하거나 Chrome에서 확장 데이터·프로필을 삭제하거나 확장을 제거할 때까지 해당 프로필에 보관됩니다. 일반적인 캐시·방문 기록 삭제만으로 확장 데이터가 지워지지는 않습니다. 삭제한 데이터의 자체 백업이나 복구 기능은 없습니다.

**C:V는 저장 내용을 별도로 암호화하지 않습니다. 개인정보, 비밀번호, 인증 토큰이나 민감한 고객 정보를 저장하지 마세요.** 보호 수준은 Chrome 프로필과 운영체제 계정에 의존합니다. 기존 JavaScript 버전의 IndexedDB 데이터는 2.0.0으로 자동 이전되지 않으므로 업데이트 전에 필요한 문장을 따로 보관해 주세요.

### 문의와 변경

문의는 [C:V GitHub Issues](https://github.com/SebellKo/C-V/issues)에 남겨주세요. 공개 게시판이므로 저장 문장이나 개인정보를 첨부하지 마세요. 데이터 처리 방식이 바뀌면 이 방침과 최종 수정일을 갱신합니다.

## English

Last updated: October 21, 2026 · Applies to C:V 2.0.0

C:V stores reusable snippets in Chrome and copies them with keyboard shortcuts. No account is required.

### Information we process

List names, snippets, their order, and the currently selected list are stored in `chrome.storage.local` for your Chrome profile. On a web page, only the text selected when you invoke the save shortcut is used for that save request. C:V does not collect browsing history, page URLs, full page contents, ordinary keystrokes, or existing clipboard contents.

Copy and save notifications briefly show the list name and a preview of up to 60 characters over the current page. People viewing your screen may see that preview.

### Permissions

- `storage` keeps lists, snippets, order, and the current selection on your device between browser sessions.
- `clipboardWrite` writes a saved snippet to the system clipboard when you invoke the copy shortcut. C:V does not read your clipboard.
- HTTP/HTTPS page access enables shortcuts, saving explicitly selected text, and displaying the result on web pages.

### Transfers and sharing

C:V does not send user data to the developer or external servers. It has no advertising, analytics, tracking SDKs, cross-device sync, or server backups. We do not sell or share user data with third parties. Data is processed only to save, manage, and copy snippets.

### Retention, deletion, and precautions

Data stays in your Chrome profile until you delete the relevant snippets or lists, clear extension data, delete the profile, or uninstall C:V. Clearing ordinary browsing history or cache alone does not remove extension data. C:V has no backup or recovery feature for deleted data.

**C:V does not separately encrypt stored text. Do not store personal information, passwords, authentication tokens, or sensitive customer information.** Protection depends on your Chrome profile and operating-system account. Data from the legacy JavaScript version's IndexedDB is not automatically migrated to 2.0.0. Keep a separate copy of important snippets before updating.

### Contact and updates

Contact us through [C:V GitHub Issues](https://github.com/SebellKo/C-V/issues). This is a public forum: do not include saved snippets or personal information. We will update this policy and its revision date when our data practices change.
