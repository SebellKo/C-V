# 단축키 기반 복사/붙여넣기

## 기능 목적

이 기능은 팝업을 열지 않고도 웹 페이지에서 빠르게 리스트를 선택하고, 선택한 텍스트를 슬롯에 저장하고, 저장된 문구를 다시 클립보드로 가져오기 위한 기능입니다.

핵심은 "웹 페이지 위에서 바로 슬롯 단위로 문구를 다루는 경험"입니다.

## 제공되는 단축키

- `Shift + 0~9`: 현재 리스트 선택
- `Shift + Alt + 0~9`: 현재 선택한 텍스트를 해당 슬롯에 저장
- `Alt + 0~9`: 해당 슬롯의 커맨드를 클립보드로 복사
- `Ctrl + B` / `Command + B`: 확장 팝업 열기

현재 구현에서 숫자 `0`은 10번째 위치를 의미합니다.

## 동작 방식

### 1. 현재 리스트 선택

웹 페이지에서 `Shift + 숫자`를 누르면, 저장된 리스트 배열에서 해당 인덱스의 리스트 이름을 현재 리스트로 기록합니다.
이 값은 콘텐츠 스크립트가 아니라 서비스 워커를 통해 `IndexedDB`의 `currentList` 스토어에 저장됩니다.

### 2. 선택 텍스트를 슬롯에 저장

사용자가 웹 페이지에서 텍스트를 드래그해 선택하면, 콘텐츠 스크립트가 마지막 선택 문자열을 메모리에 보관합니다.
이후 `Shift + Alt + 숫자`를 누르면 현재 선택된 리스트의 해당 슬롯 인덱스에 문자열을 저장합니다.

### 3. 슬롯의 문구를 다시 사용

`Alt + 숫자`를 누르면 현재 리스트의 해당 슬롯 값을 읽어서 클립보드에 씁니다.
그 다음 실제 붙여넣기는 사용자가 일반 `Ctrl + V` 또는 `Command + V`로 수행합니다.

즉, 현재 구현은 웹 페이지의 입력창에 직접 삽입하는 방식이 아니라 "클립보드에 올려 두는 방식"입니다.

## 사용자 시나리오

### 웹 페이지에서 문장 저장

1. `Shift + 숫자`로 현재 사용할 리스트를 고른다.
2. 웹 페이지에서 문장을 드래그한다.
3. `Shift + Alt + 숫자`를 눌러 원하는 슬롯에 저장한다.

### 저장된 문장 불러오기

1. `Alt + 숫자`를 눌러 슬롯의 문장을 클립보드로 복사한다.
2. 붙여넣을 위치에서 일반 붙여넣기를 수행한다.

## 현재 구현 기준 메모

- 단축키 처리는 `content.js`의 `keydown` 이벤트에서 시작됩니다.
- 복사 대상 문자열은 `selectionchange` 이벤트에서 갱신됩니다.
- 현재 리스트 선택 상태는 팝업의 `zustand` 상태와 별개로 관리됩니다.
- 단축키 흐름은 서비스 워커 메시지를 통해 저장/조회가 수행됩니다.

## 주의할 점

- 단축키 기반 저장과 조회는 먼저 현재 리스트가 선택되어 있어야 의미 있게 동작합니다.
- 빈 슬롯이나 미선택 상태에 대한 별도 사용자 안내 UI는 현재 코드에서 확인되지 않습니다.
- 같은 문자열을 이미 가진 슬롯이 있으면 저장이 무시됩니다.

## 관련 코드

- `public/manifest.json`
- `public/contents/content.js`
- `public/contents/setCurrentListName.js`
- `public/contents/setCopyText.js`
- `public/contents/setCurrentCommand.js`
- `public/contents/getCurrentListName.js`
- `public/service-worker.js`
- `public/modules/service/setCurrentListName.js`
- `public/modules/service/setCommandByIndex.js`
- `public/modules/service/getCommandByIndex.js`
- `public/modules/service/getCurrentListName.js`
