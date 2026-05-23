# 서울 마을버스 API 키 발급 가이드

이 프로젝트의 마을버스 기능은 공공데이터포털의 `서울특별시_버스도착정보조회 서비스`를 기준으로 합니다.

공식 페이지:

https://www.data.go.kr/data/15000314/openapi.do

## 발급 절차

1. https://www.data.go.kr 에 접속합니다.
2. 로그인합니다. 계정이 없으면 회원가입을 먼저 합니다.
3. 검색창에 `서울특별시_버스도착정보조회 서비스`를 검색합니다.
4. 데이터 상세 페이지에서 `활용신청`을 누릅니다.
5. 활용 목적은 수업/학습용으로 작성합니다.
6. 신청이 승인되면 `마이페이지 > 오픈API > 개발계정` 또는 해당 API 상세 페이지에서 인증키를 확인합니다.
7. 일반 인증키 또는 디코딩 인증키 중 API 호출에서 정상 동작하는 값을 사용합니다.

## 앱 설정 위치

`js/config.js`에서 아래 값을 채웁니다.

```js
villageBus: {
  enabled: true,
  serviceKey: "발급받은_인증키",
  stationId: "정류소_ID",
  busRouteId: "노선_ID"
}
```

## 필요한 ID

- `stationId`: 정류소 고유 ID입니다.
- `busRouteId`: 버스 노선 ID입니다.

정류소 번호처럼 보이는 `arsId`와 API가 요구하는 `stationId`가 다를 수 있습니다. API 문서의 상세기능 중 정류소/노선 검색 API를 함께 사용해 ID를 확인합니다.

## 5분 전 알림 구현 아이디어

버스도착정보조회 서비스 응답에는 도착 메시지와 도착예정시간 필드가 포함됩니다.

예시 필드:

- `arrmsg1`: 첫 번째 버스 도착 안내 메시지
- `arrmsg2`: 두 번째 버스 도착 안내 메시지
- `exps1`: 첫 번째 버스 도착예정시간, 초 단위
- `exps2`: 두 번째 버스 도착예정시간, 초 단위

5분 전 알림 조건은 대략 아래처럼 판단할 수 있습니다.

```js
const secondsLeft = Number(item.exps1);
const minutesLeft = Math.round(secondsLeft / 60);

if (minutesLeft <= 5) {
  // 이메일, Slack, 브라우저 알림 등을 보냅니다.
}
```

## 알림 방식 추천

### 수업용 추천: Google Apps Script

- 1분마다 버스 API를 조회합니다.
- 5분 이하 조건이면 `MailApp.sendEmail()`로 메일을 보냅니다.
- Google 계정만 있으면 실습하기 쉽습니다.

### 실서비스 추천: Cloudflare Workers Cron 또는 Supabase Edge Function

- 사용자의 정류장/노선/희망 시간을 DB에 저장합니다.
- 주기적으로 API를 조회합니다.
- Resend, SendGrid, Gmail API, Slack webhook 등으로 알림을 보냅니다.

## 주의

- API 키를 GitHub 공개 저장소에 그대로 올리면 안 됩니다.
- GitHub Pages만으로는 페이지를 닫은 뒤에도 계속 확인하는 알림을 만들 수 없습니다.
- 정확히 5분 전을 보장하려면 1분 단위 이상으로 주기 실행하는 백엔드가 필요합니다.
