# 생활 데이터 웹앱 만들기

완성본을 먼저 체험하고, 날씨 API, NEIS 급식 API, Google Sheets 투표 저장, Apps Script 버스 프록시를 하나씩 붙여 보는 왕초보 웹 교재입니다.

목표는 코드를 외우는 것이 아니라 다음 흐름을 몸에 익히는 것입니다.

1. 완성 화면을 먼저 본다.
2. 오늘 고칠 파일 하나를 정한다.
3. 작은 설정 하나만 바꾼다.
4. 저장하고 새로고침한다.
5. Console 오류와 화면 변화를 확인한다.
6. 막히면 오류 메시지를 AI에게 다시 준다.

완성본 주소:

```text
https://greatsong.github.io/sample_app/
```

## 전체 결과물

수업이 끝나면 학생은 아래 산출물을 갖습니다.

- GitHub Pages로 공개된 생활 데이터 웹앱
- 서울 또는 내 지역 날씨 카드
- 오늘과 내일 급식 카드
- 급식 메뉴 투표와 Google Sheets 저장
- 마을버스 도착 정보 카드
- Apps Script 프록시와 Script Properties 설명 기록
- AI에게 물어본 프롬프트와 검증 기록

## 장별 진행표

0장. 완성본 체험하기

- 목표: 앱이 보여주는 데이터와 흐름을 관찰합니다.
- 산출물: 관찰 기록, 궁금한 점 3개

1장. 파일 구조 이해하기

- 목표: HTML, CSS, JavaScript, config 파일의 역할을 구분합니다.
- 산출물: 파일 역할 표

2장. 날씨 API 붙이기

- 목표: 키가 필요 없는 공개 API를 먼저 성공시킵니다.
- 산출물: 지역 이름과 좌표를 바꾼 날씨 카드

3장. 급식 오늘/내일 표시하기

- 목표: NEIS에서 오늘과 내일 중식을 가져옵니다.
- 산출물: 내 학교 급식 카드

4장. 급식 투표를 Google Sheets에 저장하기

- 목표: 투표가 브라우저 안이 아니라 공용 시트에 저장되는 흐름을 이해합니다.
- 산출물: `meal_votes` 탭에 쌓인 투표 기록

5장. 버스 도착 정보 붙이기

- 목표: 비밀키가 필요한 API를 Apps Script 프록시로 안전하게 호출합니다.
- 산출물: 내 정류소와 노선의 도착 정보 카드

6장. 나만의 학교와 정류소로 바꾸기

- 목표: 샘플 앱을 내 생활권 앱으로 바꿉니다.
- 산출물: 내 GitHub Pages 주소와 최종 점검표

부록. 교사용 확장과 오류 해결

- 목표: 메일 알림, DB 확장, 자주 나는 오류를 분리해서 다룹니다.
- 산출물: 오류 해결 기록과 다음 버전 아이디어

## 수업에서 지켜야 할 원칙

- 한 번에 하나만 바꿉니다.
- 작동하는 상태를 잃지 않도록 원래 값을 메모합니다.
- API 키는 GitHub에 올리지 않습니다.
- Console 빨간 글씨는 실패가 아니라 다음 질문 재료입니다.
- AI 답변은 그대로 붙이지 않고 실행 결과로 검증합니다.

## 개발자 도구 보는 법

Chrome 개발자 도구를 엽니다.

```text
Mac: Command + Option + I
Windows: Ctrl + Shift + I
```

확인할 탭:

- Console: JavaScript 오류 확인
- Network: API 요청 성공/실패 확인
- Application: localStorage에 남은 설정 확인

AI에게 오류를 물어볼 때는 이렇게 씁니다.

```text
브라우저 Console에 아래 오류가 나왔어.
무슨 뜻인지 초보자 기준으로 설명하고,
어느 파일의 어느 설정을 먼저 확인해야 하는지 알려줘.

[오류 메시지 붙여넣기]
```

# 0장. 완성본 체험하기

## 이번 장 목표

코드를 고치기 전에 완성본을 열고 앱이 어떤 데이터를 보여주는지 말로 설명합니다.

## 실습 0-1. 완성본 열기

1. 브라우저에서 `https://greatsong.github.io/sample_app/`을 엽니다.
2. 날씨 카드가 보이는지 확인합니다.
3. 급식 카드가 오늘과 내일로 나뉘는지 확인합니다.
4. 마을버스 카드가 보이는지 확인합니다.
5. 급식 투표 버튼을 눌러 봅니다.

## 관찰 기록

```text
날씨 카드에서 본 정보:
급식 카드에서 본 정보:
버스 카드에서 본 정보:
투표 버튼을 눌렀을 때 변화:
궁금한 점 1:
궁금한 점 2:
궁금한 점 3:
```

## 체크리스트

- [ ] 완성본 주소를 열 수 있다.
- [ ] 날씨, 급식, 버스, 투표 영역을 구분할 수 있다.
- [ ] API가 외부 데이터를 가져오는 통로라는 말을 이해했다.
- [ ] 비밀키는 공개 웹페이지에 넣으면 안 된다는 점을 안다.

## 자주 나는 오류

- 화면이 예전처럼 보임: 강력 새로고침을 합니다.
- 급식이 비어 있음: 주말, 방학, NEIS 데이터 공백일 수 있습니다.
- 버스가 설정 필요로 보임: 프록시 URL 또는 localStorage 설정을 확인합니다.

## AI에게 줄 프롬프트

```text
생활 데이터 웹앱 완성본을 관찰했어.
날씨, 급식, 버스, 투표 기능이 각각 어떤 데이터를 보여주는지
초보자 눈높이로 한 문장씩 설명해줘.
```

# 1장. 파일 구조 이해하기

## 이번 장 목표

앱을 구성하는 파일 역할을 구분합니다. 초보자는 전체 코드를 읽기보다 먼저 어느 파일을 왜 여는지 알아야 합니다.

## 파일 역할

```text
index.html
  화면의 큰 구조입니다.

css/style.css
  색상, 카드, 버튼, 모바일 배치를 담당합니다.

js/config.js
  학교, 정류소, 프록시 URL 같은 설정값을 모아 둔 설정판입니다.

js/adapters/api-services.js
  날씨, 급식, 버스 API를 호출하고 화면용 데이터로 바꿉니다.

js/adapters/vote-store.js
  급식 투표를 Apps Script에 보내고 투표 수를 가져옵니다.

js/app.js
  버튼 클릭, 카드 그리기, 설정 저장, 투표 처리를 담당합니다.

apps-script/Code.gs
  버스 API 키와 Google Sheets 저장을 대신 처리합니다.
```

## 실습 1-1. 파일 찾기

1. GitHub 저장소를 엽니다.
2. 위 파일을 하나씩 찾습니다.
3. 파일 이름 옆에 `화면`, `디자인`, `설정`, `API`, `동작`, `프록시` 중 하나를 적습니다.
4. 화면에 보이는 문구 하나가 어느 파일에서 오는지 찾아봅니다.

## 활동 기록

```text
HTML 파일:
CSS 파일:
설정 파일:
API 호출 파일:
투표 저장 파일:
Apps Script 파일:
내가 찾은 화면 문구:
그 문구가 들어 있던 파일:
```

## 체크리스트

- [ ] `index.html`을 찾았다.
- [ ] `js/config.js`가 설정판이라는 점을 설명할 수 있다.
- [ ] `apps-script/Code.gs`는 GitHub Pages가 아니라 Apps Script에 붙여넣는 코드라는 점을 안다.

## 자주 나는 오류

- `config.js`를 고쳤는데 화면이 안 바뀜: 저장 후 새로고침합니다.
- 파일 이름 대소문자가 다름: GitHub Pages에서는 대소문자가 중요합니다.
- Apps Script 코드를 HTML에 붙임: `Code.gs`는 Google Apps Script 프로젝트에 넣습니다.

## AI에게 줄 프롬프트

```text
아래 파일 목록을 보고 초보자에게 각 파일 역할을 설명해줘.
HTML은 뼈대, CSS는 디자인, config.js는 설정판이라는 비유를 사용해줘.

index.html
css/style.css
js/config.js
js/adapters/api-services.js
js/adapters/vote-store.js
js/app.js
apps-script/Code.gs
```

# 2장. 날씨 API 붙이기

## 이번 장 목표

키가 필요 없는 Open-Meteo 날씨 API를 먼저 성공시킵니다. 첫 API 실습은 인증키가 없어야 실패 지점이 줄어듭니다.

## 실습 2-1. 설정 확인하기

`js/config.js`에서 아래 부분을 찾습니다.

```js
weather: {
  enabled: true,
  label: "서울",
  latitude: 37.5665,
  longitude: 126.9780
}
```

확인할 것:

- `enabled`가 `true`인지
- `label`이 화면의 지역 이름과 연결되는지
- 위도와 경도가 숫자로 들어 있는지

## 실습 2-2. 지역 바꾸기

부산으로 바꾸려면 이렇게 수정합니다.

```js
weather: {
  enabled: true,
  label: "부산",
  latitude: 35.1796,
  longitude: 129.0756
}
```

저장 후 새로고침하고 날씨 카드의 지역 이름이 바뀌는지 확인합니다.

## 체크리스트

- [ ] 지역 이름을 바꿀 수 있다.
- [ ] 위도와 경도 값 사이 쉼표가 유지되어 있다.
- [ ] Console 오류가 없다.
- [ ] 키가 없는 API와 키가 필요한 API의 차이를 말할 수 있다.

## 자주 나는 오류

- 쉼표를 지움: JavaScript 객체는 항목 사이 쉼표가 필요합니다.
- 따옴표를 지움: 글자는 `"부산"`처럼 따옴표로 감쌉니다.
- 저장하지 않음: 파일 저장 후 브라우저 새로고침이 필요합니다.

## AI에게 줄 프롬프트

```text
아래 config.js의 weather 설정을 제주도로 바꾸고 싶어.
JavaScript 문법이 깨지지 않게 수정 예시를 보여줘.

weather: {
  enabled: true,
  label: "서울",
  latitude: 37.5665,
  longitude: 126.9780
}
```

# 3장. 급식 오늘과 내일 표시하기

## 이번 장 목표

NEIS 급식 API에서 오늘과 내일 중식 메뉴를 가져와 화면에 표시합니다.

## 실습 3-1. 급식 설정 찾기

`js/config.js`에서 아래 부분을 찾습니다.

```js
schoolMeal: {
  enabled: true,
  educationOfficeCode: "B10",
  schoolCode: "7010073",
  schoolName: "당곡고등학교",
  mealCode: "2",
  mealDate: ""
}
```

`mealCode: "2"`는 중식입니다. `mealDate`가 비어 있으면 한국 시간 기준 오늘과 내일을 자동 조회합니다.

## 실습 3-2. 날짜 실험하기

특정 날짜부터 이틀을 보고 싶으면 아래처럼 넣습니다.

```js
mealDate: "20260526"
```

실험이 끝나면 다시 비워 둡니다.

```js
mealDate: ""
```

## 체크리스트

- [ ] 급식 카드가 오늘과 내일로 나뉜다.
- [ ] `mealCode: "2"`가 중식이라는 점을 설명할 수 있다.
- [ ] `mealDate`를 비우면 자동 날짜가 사용된다.
- [ ] 학교를 바꾸려면 교육청 코드와 학교 코드가 함께 필요하다는 점을 안다.

## 자주 나는 오류

- 급식 날짜가 이상함: `mealDate`에 특정 날짜가 남아 있는지 확인합니다.
- 메뉴가 없음: 휴일, 방학, NEIS 데이터 공백일 수 있습니다.
- 학교가 바뀌지 않음: 교육청 코드와 학교 코드를 함께 바꿔야 합니다.

## AI에게 줄 프롬프트

```text
NEIS 급식 API 설정에서 educationOfficeCode, schoolCode, schoolName,
mealCode, mealDate가 각각 무슨 뜻인지 초보자에게 설명해줘.
중식 mealCode가 "2"라는 점도 포함해줘.
```

# 4장. 급식 투표를 Google Sheets에 저장하기

## 이번 장 목표

급식 메뉴 투표가 내 브라우저 안에만 남지 않고 Google Sheets에 쌓이도록 연결합니다.

## 전체 흐름

```text
투표 버튼 클릭
  -> js/app.js가 투표 정보를 만듭니다.
  -> js/adapters/vote-store.js가 Apps Script Web App URL로 보냅니다.
  -> Apps Script가 Google Sheets에 한 줄을 추가합니다.
  -> Apps Script가 전체 투표 수를 다시 계산해 돌려줍니다.
  -> 화면의 투표 수가 업데이트됩니다.
```

## 실습 4-1. 시트 준비하기

1. Google Sheets에서 새 스프레드시트를 만듭니다.
2. 주소에서 Sheet ID를 복사합니다.
3. Apps Script 프로젝트 설정을 엽니다.
4. Script Properties에 `MEAL_VOTE_SHEET_ID`를 추가합니다.
5. 값에 Sheet ID를 붙여넣습니다.

## 실습 4-2. Apps Script 배포하기

1. `apps-script/Code.gs` 내용을 Apps Script에 붙여넣습니다.
2. 저장합니다.
3. 새 배포에서 웹 앱을 선택합니다.
4. 실행 사용자는 `나`, 액세스 권한은 `모든 사용자`로 설정합니다.
5. 권한 승인을 진행합니다.
6. Web App URL을 복사합니다.

## 저장되는 열

```text
createdAt | mealDate | mealTitle | menuName | voteKey | userAgent
```

`voteKey`는 날짜와 메뉴를 합친 값입니다.

```text
20260526:칼슘강화기장밥
```

날짜를 붙이지 않으면 오늘의 김치와 내일의 김치가 같은 항목처럼 합쳐질 수 있습니다.

## 체크리스트

- [ ] Apps Script에 `MEAL_VOTE_SHEET_ID`가 있다.
- [ ] Apps Script가 새 버전으로 배포되었다.
- [ ] 투표 후 Google Sheets에 행이 추가된다.
- [ ] 새로고침 후에도 투표 수가 유지된다.

## 자주 나는 오류

- `MEAL_VOTE_SHEET_ID가 없습니다`: Script Properties에 시트 ID가 없습니다.
- 권한 오류: Google Sheets 권한 승인을 해야 합니다.
- 투표 수가 안 올라감: Apps Script를 수정한 뒤 새 버전으로 배포했는지 확인합니다.

## AI에게 줄 프롬프트

```text
급식 투표를 Google Sheets에 저장하는 흐름을
"버튼 클릭 -> Apps Script -> Google Sheets -> 화면 업데이트" 순서로 설명해줘.
비밀키를 브라우저에 넣으면 안 된다는 점도 포함해줘.
```

# 5장. 버스 도착 정보 붙이기

## 이번 장 목표

마을버스 도착 정보를 화면에 붙입니다. 버스 API는 키와 CORS 문제가 있으므로 브라우저가 직접 호출하지 않고 Apps Script 프록시를 사용합니다.

## 왜 프록시가 필요한가요

GitHub Pages는 공개 웹사이트입니다. 여기에 버스 API 키를 넣으면 다른 사람이 볼 수 있습니다.

```text
브라우저 앱
  -> Apps Script Web App URL
  -> Script Properties의 BUS_API_KEY 읽기
  -> 서울 버스 API 호출
  -> 필요한 정보만 브라우저에 반환
```

## 실습 5-1. 버스 API 키 넣기

1. 서울 버스 API 키를 준비합니다.
2. Apps Script 프로젝트 설정을 엽니다.
3. Script Properties에 `BUS_API_KEY`를 추가합니다.
4. 값에 API 키를 넣습니다.

## 실습 5-2. 앱에 프록시 URL 넣기

샘플 앱의 마을버스 프록시 설정에 아래 값을 입력합니다.

- Apps Script Web App URL
- 정류소번호: `21347`
- 노선명: `관악11`

코드 기본값으로 넣으려면 `js/config.js`의 `villageBus`를 바꿉니다.

```js
villageBus: {
  enabled: true,
  proxyUrl: "https://script.google.com/macros/s/.../exec",
  arsId: "21347",
  routeName: "관악11"
}
```

## 체크리스트

- [ ] `BUS_API_KEY`가 Apps Script Script Properties에 있다.
- [ ] Web App URL이 `/exec`로 끝난다.
- [ ] 정류소번호와 노선명을 설명할 수 있다.
- [ ] 버스 카드가 실시간 연결 상태다.

## 자주 나는 오류

- 버스 API를 Google Cloud에서 찾음: 서울 버스 API는 Google API가 아닙니다. `https://api.bus.go.kr/`에서 확인합니다.
- `NO_BUS_API_KEY`: Script Properties에 `BUS_API_KEY`가 없습니다.
- Web App URL 403: 배포 권한이 모든 사용자가 아니거나 첫 실행 권한 승인이 안 되었을 수 있습니다.
- 예전 설정이 남음: 화면의 설정 삭제를 누르고 새로고침합니다.

## AI에게 줄 프롬프트

```text
GitHub Pages에서 버스 API 키를 직접 넣지 않고 Apps Script 프록시를 사용하는 이유를
초보자에게 설명해줘. CORS, HTTP, 비밀키 노출 문제를 쉬운 말로 풀어줘.
```

# 6장. 나만의 학교와 정류소로 바꾸기

## 이번 장 목표

샘플 앱을 내 생활권에 맞게 바꿉니다. 작동하는 앱을 유지하면서 설정값만 하나씩 바꿉니다.

## 바꿀 값 정리

```text
날씨:
- label
- latitude
- longitude

급식:
- educationOfficeCode
- schoolCode
- schoolName
- mealCode
- mealDate

버스:
- proxyUrl
- arsId
- routeName
```

## 실습 6-1. 안전한 수정 순서

1. 현재 앱이 정상 작동하는지 확인합니다.
2. `js/config.js`의 원래 값을 메모합니다.
3. 날씨 지역만 바꾸고 새로고침합니다.
4. 급식 학교 설정만 바꾸고 새로고침합니다.
5. 버스 정류소번호와 노선명만 바꾸고 새로고침합니다.
6. 투표가 Google Sheets에 저장되는지 확인합니다.
7. GitHub Pages 주소에서 같은 화면이 열리는지 확인합니다.

## 체크리스트

- [ ] 날씨 지역 이름이 바뀌었다.
- [ ] 급식 학교 이름이 바뀌었다.
- [ ] 급식 날짜가 오늘과 내일 기준이다.
- [ ] 버스 정류소번호와 노선명이 바뀌었다.
- [ ] 투표가 Google Sheets에 저장된다.
- [ ] GitHub Pages 주소에서 앱이 열린다.

## 자주 나는 오류

- 한 번에 많이 바꿈: 날씨, 급식, 버스를 따로 하나씩 바꿉니다.
- GitHub Pages에서 이전 화면이 보임: 배포가 끝날 때까지 기다리고 새로고침합니다.
- 급식이 안 나옴: 교육청 코드와 학교 코드를 확인합니다.
- 버스가 안 나옴: 샘플 값으로 되돌려 먼저 확인합니다.

## AI에게 줄 프롬프트

```text
아래 config.js 설정을 내 학교와 정류소에 맞게 바꾸려고 해.
한 번에 다 고치지 말고, 안전한 수정 순서를 알려줘.
각 단계마다 확인할 화면도 같이 말해줘.
```

# 부록 A. 교사용 확장: 5분 전 메일 알림

메일 알림은 학생 본문이 아니라 교사용 운영 또는 확장 활동입니다. 권한 승인, 시간 기반 트리거, 이메일 발송이 들어가므로 본문 실습과 분리합니다.

Script Properties:

```text
BUS_ALERT_EMAIL
BUS_ALERT_ARS_ID
BUS_ALERT_ROUTE_NAME
BUS_ALERT_COOLDOWN_MINUTES
```

트리거 설정:

1. Apps Script 왼쪽에서 트리거를 엽니다.
2. 실행 함수로 `checkBusAndSendMail`을 고릅니다.
3. 이벤트 소스는 시간 기반으로 고릅니다.
4. 분 단위 타이머, 1분마다 실행으로 설정합니다.

# 부록 B. 문제 해결

## 화면이 안 열릴 때

- GitHub Pages 주소가 맞는지 확인합니다.
- `index.html`이 저장소 루트에 있는지 확인합니다.
- 배포가 끝날 때까지 기다립니다.

## 날씨가 안 나올 때

- `weather.enabled`가 `true`인지 확인합니다.
- 위도와 경도 값 사이 쉼표가 있는지 확인합니다.

## 급식이 안 나올 때

- 교육청 코드와 학교 코드를 확인합니다.
- `mealCode`가 `"2"`인지 확인합니다.
- `mealDate`를 비우고 오늘/내일 자동 조회로 돌려봅니다.

## 투표가 저장되지 않을 때

- `MEAL_VOTE_SHEET_ID`가 Apps Script에 있는지 확인합니다.
- Apps Script를 새 버전으로 배포했는지 확인합니다.
- Google Sheets 권한 승인을 했는지 확인합니다.

## 버스가 안 나올 때

- `BUS_API_KEY`가 Apps Script에 있는지 확인합니다.
- Web App URL이 `/exec`로 끝나는지 확인합니다.
- localStorage에 예전 설정이 남아 있으면 설정 삭제를 누릅니다.

# 마무리 활동

## 1분 발표 구조

```text
1. 우리가 만든 앱은 ___입니다.
2. 날씨 데이터는 ___ API에서 가져왔습니다.
3. 급식 데이터는 ___ API에서 가져왔습니다.
4. 투표 데이터는 ___에 저장했습니다.
5. 버스 API 키는 ___에 숨겼습니다.
6. AI는 ___에 사용했고, 우리는 ___로 검증했습니다.
7. 다음 버전에서는 ___를 개선하고 싶습니다.
```

## 자기 평가

- [ ] 파일 역할을 설명할 수 있다.
- [ ] API 키를 GitHub에 올리면 안 되는 이유를 설명할 수 있다.
- [ ] 날씨, 급식, 버스 데이터가 어디서 오는지 설명할 수 있다.
- [ ] 투표 데이터가 Google Sheets에 저장되는 흐름을 설명할 수 있다.
- [ ] AI 답변을 그대로 붙이지 않고 실행 결과로 확인했다.
