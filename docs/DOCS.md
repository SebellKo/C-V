### menifest.json
- 프로그램의 메타 정보를 저장하는 필수 파일.

### popup.html
- 우상단 툴바 아이콘을 클랙했을 때 나타나는 팝업.
- 최소한의 필요한 기능만을 포함한 간결한 UI.

---

[ ] 슬롯에 저장된 내역을 확인.
[ ] 슬롯 저장 내역 삭제 버튼.
[ ] 슬롯 저장 버튼.
[ ] 리셋 버튼.

### popup.js
- popup.html 뷰에서 발생하는 이벤트를 제어하기 위한 자바스크립트.
- background.js, contentscript.js와 메세지를 주고받을 수 있다.

---

[ ] 저장 내역 삭제 버튼 이벤트.
[ ] 저장 버튼 이벤트.
[ ] 리셋 버튼 이벤트.


### service-worker.js
- 프로그램의 전체적인 이벤트 핸들러, 이벤트가 발생하면 특정 코드를 수행한다.
- 이벤트가 발생하는 시점에만 수행되고 나머지 시간에는 유휴상태로 있도록 만드는것이 좋음.
- 탭 갯수와 상관없이 백그라운드는 한개만 존재.
- popup.js, contentscript.js와 메세지를 주고받을 수 있다.
- service-worker의 이벤트
  1. chrome.runtime.onInstalled.addListener : 확장 프로그램을 처음 설치할때, 확장 프로그램이 새 버전으로 업데이트 될때, chrome이 새 버전으로 업데이트 될때 실행 된다.
  https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle?hl=ko#oninstalled
  2. chrome.runtime.onStartup : 확장 프로그램 시작시 발생하는 이벤트

---

[ ] 복사 슬롯 초기화 및 할당.
[ ] 슬롯 내용 출력.

### contentscript.js
- 브라우저에 로드된 웹페이지 영역에서 동작하는 자바스크립트.
- DOM을 활용해서 페이지 내의 요소를 추가, 변경, 삭제.
- 각 탭 마다 1회 로드.
- background.js, popup.js와 메세지를 주고 받을 수 있다.

---

[ ] 사용자 키입력 인식.
    [ ] ctrl+c+number
    [ ] ctrl+v+number
    [ ] 초기화 키입력
[ ] 복사된 내역 backgound.js로 전송.



---------------------------------------------

## 버튼 기능

### Add
    [ ] 리스트 요소 추가

### 리스트
    [ ] 페이지 변환

### confirm
    [ ] input value 셋팅
    [ ] 백그라운드로 value 전송

### delete
    [ ] input value 초기화
    [ ] 백그라운드에 해당 value 제거

### plus button
    [ ] input 요소 추가

### delete all
    [ ] input 요소 전부 삭제
    [ ] 백그라운드의 value 전부 제거
    [ ] 리스트 요소 제거

---------------------------------------------

### command
- 명령어 API로 확장 프로그램에서 작업을 트리거 하는 단축키를 추가할 수 있다.
- manifest에 `commands` 키를 선언하여 사용한다.
- `onCommand.addListener`를 사용하여 manifest에 정의된 각 명령어에 핸들러를 결합 할 수 있다.

```javascript
chrome.commands.onCommand.addListener((command) => {
    console.log(`Command: ${command}`);
});
```

### storage
- 사용자 데이터의 변경사항을 저장, 검색, 추적한다.
- manifest에 `storage` 권한을 선언한다.
- `storage.local.set`, `storage.local.get`을 이용해 접근할 수 있다.

```javascript
chrome.storage.local.set({ key: value }).then(() => {
    console.log("Value is set");
  });

chrome.storage.local.get(["key"]).then((result) => {
    console.log("Value is " + result.key);
  });
```

### 메세지 전달

- 확장 프로그램과 콘텐츠 스크립트가 서로 메세지를 수신하기 위해서 사용한다.
- 메세지를 수신하기 위해선 `runtime.onMessage` 이벤트 리스너를 설정한다.

```javascript
// 콘텐츠 스크립트 -> 확장 프로그램

(async () => {
  const response = await chrome.runtime.sendMessage({greeting: "hello"});
  // do something with response here, not outside the function
  console.log(response);
})();
```

```javascript
// 확장 프로그램 -> 콘텐츠 스크립트

(async () => {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
  // do something with response here, not outside the function
  console.log(response);
})();
```

```javascript
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting === "hello")
      sendResponse({farewell: "goodbye"});
  }
);
```

---

### Modal

[ ] Add 버튼 이용 새로운 카테고리 생성.
  [ ] Add 버튼 클릭시 카테고리 create 모달 생성.
  [ ] 생성된 모달의 confirm, cancel 버튼에 이벤트 주입.
  [ ] 확인 버튼 클릭시 input value storage에 저장.
  [ ] header의 categoryList에 categoryTemplate 이용 리스트 추가.

[ ] 카테고리 edit 버튼 이용 카테고리 삭제 및 생성.
  [ ] edit 버튼 클릭시 카테고리 create 모달 생성.
  [ ] 생성된 모달의 confirm, cancel 버튼에 이벤트 주입.
    [ ] 모달 생성시 edit인지 확인.
  [ ] input value에 categoryList 값 가져오기.
  [ ] 생성된 모달의 confirm, cancel 버튼에 이벤트 주입.
  [ ] 확인 버튼 클릭시 input value storage 수정.
  [ ] delete 버튼 클릭시 storage에서 삭제, categoryList에서 해당 리스트 삭제.

[ ] New Command 버튼 이용 새로운 command 생성.
  [ ] New Command 버튼 클릭시 create 모달 생성.
  [ ] 생성된 모달의 confirm, cancel 버튼에 이벤트 주입.
  [ ] confirm 버튼 클릭시 textarea의 value command의 key 값 이용 storage의 해당 category 배열에 set
    [ ] content_list <ul> 태그에 새로 생성된 command <li> 생성.
  [ ] cancel 버튼 클릭시 모달 제거.

[ ] command 눌러서 수정 및 삭제
  [ ] command 클릭시 command edit 모달창 생성.
  [ ] command edit 인지 확인.
    [ ] command value 모달창의 textarea의 value로 삽입
    [ ] delete 버튼 클릭시 storage에서 삭제, 해당하는 category 배열에서 삭제.
      [ ] command의 key 값으로 배열의 index 값 설정.
      [ ] key 값 이용, storage의 배열 요소 삭제.
      [ ] key 값 이용, 해당하는 category 배열에서 삭제.
  [ ] 생성된 모달의 confirm, cancel 버튼에 이벤트 주입.
    [ ] confirm 버튼 클릭시 key 값 이용 해당 배열의 요소 수정.
    [ ] cancel 버튼 클릭시 모달 제거.

[ ] commnad x 버튼 클릭 command 삭제.
  [ ] x 버튼 클릭시 confirm, cancel 모달 생성.
    [ ] confirm 버튼 클릭시 해당 command key 값 이용 storage에서 삭제.
    [ ] content_list <ul> 태그에서 해당 <li> 삭제.
  [ ] cancel 버튼 클릭시 모달 제거.

[ ] delete all 이용 커맨드 전체 삭제.
  [ ] delete all 버튼 클릭시 confirm, cancel 모달 생성.
   [ ] confirm 버튼 클릭, 해당 category 전체 삭제.
    [ ] categoryList에서 해당 category 삭제.
    [ ] storage에서 해당 category 삭제.
  [ ] cancel 버튼 클릭시 모달 제거.
