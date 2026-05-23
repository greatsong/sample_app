# Google Apps Script 버스 프록시 만들기

GitHub Pages는 정적 파일 호스팅이라 서울 버스 API 키를 안전하게 숨길 수 없습니다. 그래서 버스 API 키는 Google Apps Script의 Script Properties에 저장하고, GitHub Pages는 Apps Script Web App URL만 호출합니다.

## 구조

```text
GitHub Pages 샘플 앱
  -> Apps Script Web App URL
      -> Script Properties의 BUS_API_KEY 사용
      -> 서울 버스 API 호출
      -> JSON 결과 반환
```

## 1. Apps Script 만들기

1. https://script.google.com 접속
2. `새 프로젝트` 클릭
3. 프로젝트 이름을 `bus-arrival-proxy`처럼 변경
4. `Code.gs`에 아래 코드를 붙여넣기

```js
const BUS_API_BASE = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid';

function doGet(e) {
  const props = PropertiesService.getScriptProperties();
  const serviceKey = props.getProperty('BUS_API_KEY');
  const arsId = e.parameter.arsId || '21347';
  const routeName = e.parameter.routeName || '관악11';

  if (!serviceKey) {
    return jsonOutput({ error: 'NO_BUS_API_KEY', message: 'Script Properties에 BUS_API_KEY가 없습니다.' });
  }

  const url = BUS_API_BASE
    + '?serviceKey=' + encodeURIComponent(serviceKey)
    + '&arsId=' + encodeURIComponent(arsId)
    + '&resultType=json';

  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const payload = JSON.parse(response.getContentText());
  const header = payload.msgHeader || {};

  if (header.headerCd && header.headerCd !== '0') {
    return jsonOutput({ error: 'BUS_API_ERROR', message: header.headerMsg, raw: payload });
  }

  const list = normalizeList(payload.msgBody && payload.msgBody.itemList);
  const filtered = list.filter(function (item) {
    const name = String(item.rtNm || item.busRouteAbrv || '');
    return !routeName || name.indexOf(routeName) !== -1;
  });
  const item = filtered[0] || list[0] || null;

  return jsonOutput({
    ok: true,
    arsId: arsId,
    routeName: routeName,
    item: item,
    arrmsg1: item && item.arrmsg1,
    arrmsg2: item && item.arrmsg2,
    secondsLeft: item && Number(item.exps1 || item.traTime1 || 0),
    raw: payload
  });
}

function normalizeList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 2. 키를 Script Properties에 저장

1. Apps Script 왼쪽의 `프로젝트 설정` 클릭
2. `스크립트 속성` 또는 `Script Properties` 섹션 찾기
3. `속성 추가` 클릭
4. 속성 이름: `BUS_API_KEY`
5. 값: 공공데이터포털 `일반 인증키 (Decoding)` 값
6. 저장

이 값은 GitHub 저장소에 올라가지 않습니다.

## 3. Web App으로 배포

1. 오른쪽 위 `배포` 클릭
2. `새 배포` 클릭
3. 유형에서 `웹 앱` 선택
4. 실행 사용자: `나`
5. 액세스 권한: `모든 사용자`
6. `배포` 클릭
7. 권한 승인 진행
8. 생성된 Web App URL 복사

URL은 보통 아래처럼 생겼습니다.

```text
https://script.google.com/macros/s/긴문자열/exec
```

## 4. 샘플 앱에 입력

샘플 앱으로 이동합니다.

https://greatsong.github.io/sample_app/

`마을버스 프록시 설정`에 입력합니다.

- Apps Script Web App URL: 방금 복사한 URL
- 정류소번호(ARS): `21347`
- 노선명: `관악11`

`저장하고 조회`를 누릅니다.

## 5. 5분 전 메일 알림으로 확장

Apps Script에 시간 기반 트리거를 추가하면 1분마다 버스 도착 정보를 확인하고 메일을 보낼 수 있습니다.

```js
function checkBusAndSendMail() {
  const email = 'your-email@example.com';
  const fakeEvent = { parameter: { arsId: '21347', routeName: '관악11' } };
  const text = doGet(fakeEvent).getContent();
  const data = JSON.parse(text);
  const secondsLeft = Number(data.secondsLeft || 0);

  if (secondsLeft > 0 && secondsLeft <= 300) {
    MailApp.sendEmail(email, '관악11 도착 알림', '관악11이 약 5분 이내 도착합니다: ' + data.arrmsg1);
  }
}
```

트리거 설정:

1. Apps Script 왼쪽 `트리거` 클릭
2. `트리거 추가` 클릭
3. 실행 함수: `checkBusAndSendMail`
4. 이벤트 소스: `시간 기반`
5. 유형: `분 단위 타이머`
6. 간격: `1분마다`

## 자주 나는 오류

- `NO_BUS_API_KEY`: Script Properties에 `BUS_API_KEY`가 없습니다.
- `SERVICE KEY IS NOT REGISTERED`: 공공데이터포털 키 승인/반영이 안 되었거나 다른 API 키입니다.
- Web App URL이 403: 배포 권한이 `모든 사용자`가 아닐 수 있습니다.
- 앱에서 CORS 오류: Apps Script 응답이 아니라 서울 버스 API를 직접 호출하고 있는지 확인합니다.
