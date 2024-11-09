# C:V

![Group 1437256055](https://github.com/user-attachments/assets/d4241dd9-6cd9-4e9e-bbf5-35884586fa03)
<br/>
<br/>
<br/>
## About
> C:V를 이용해서 보다 빠르게 문서를 작성해 보세요.<br/>
C:V는 멀티 복사 / 붙여넣기 기능을 10개의 리스트, 10개의 커맨드 최대 100개의 커맨드 복사를 제공합니다.<br/>
여러 문장 복사를 위해 여러 탭을 번갈아 서핑하던 지난날은 잊으세요 !

### 기획배경

블로그 및 이메일을 쓰기위해 여러 페이지 탭을 번갈아가며 스크롤하던 모습을 발견.<br/>
한번에 여러개를 복사하거나 고정된 양식이 있다면 미리 저장해 바로바로 사용할 수 있으면 어떨까.

### 효과

최소한의 탭전환, 최소한의 마우스 사용, 형식적인 문서들을 딸깍딸깍 몇번의 단축키로 완성 !
<br/>
<br/>
<br/>
## Feature

- 크롬 익스텐션 팝업을 활용한 리스트, 커맨드 확인 및 추가 수정
- 단축키를 사용한 커맨드 복사, 리스트 및 커맨드 변경
- indexedDB를 활용한 리스트, 커맨드 영속성 유지
<br/>
<br/>

## Skils

- React
- Javascript
- indexedDB
- tanstack-query, dnd-kit, styled-components, zustand
<br/>
<br/>

## C:V 사용 가이드 라인

### 1. 팝업창에서 작업하기

- 리스트 추가: 상단 “Add” 버튼 클릭 → 새로운 리스트 생성
- 커맨드 추가: 생성한 리스트 클릭 → “NewCommand” 버튼 클릭
- 리스트 수정: 상단 “Edit” 버튼 클릭
- 커맨드 수정:
  - 내용 수정: 커맨드 클릭
  - 삭제/순서 변경: 커맨드 상단 아이콘 클릭 및 드래그&드랍
  - 리스트의 커맨드 전체 삭제: “Delete All” 버튼 클릭

### 2. 단축키로 작업하기

붙여넣기

- 리스트 선택: Shift + 0~9 (0은 10번째 리스트)
- 커맨드 선택: 리스트 선택 후 Alt + 0~9
- 붙여넣기: Ctrl / Command + V

복사하기

- 리스트 선택: Shift + 0~9
- 커맨드 복사: 리스트 선택 후 Shift + Alt + 0~9

### 한번에 따라하기

1. 팝업 열기 → 리스트 생성
2. 웹 페이지에서 Shift + 0~9 → 리스트 선택
3. 복사할 텍스트 선택 후 Shift + Alt + 0~9 → 커맨드 복사
4. 붙여넣을 커맨드 Alt + 0~9로 선택
5. Ctrl / Command + V로 붙여넣기

### 단축키 요약

- 리스트 선택: Shift + 0~9
- 커맨드 선택: Alt + 0~9
- 커맨드 복사: Shift + Alt + 0~9
- 붙여넣기: Ctrl / Command + V
- 팝업 열기/닫기: Ctrl / Command + B

### 주의사항

1. 개인정보 및 민감한 정보는 저장하지 마세요.
2. 쿠키 및 캐시,데이터 삭제시 저장된 커맨드가 삭제될 수 있습니다.