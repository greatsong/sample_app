# 서울 마을버스 API 키 발급 가이드

중요: 서울 마을버스 도착 정보는 일반 검색창이나 Google Cloud API 목록에서 `버스 API`로 찾는 서비스가 아닙니다. 이 프로젝트에서 쓰는 엔드포인트는 서울시 버스 Open API 계열입니다.

공식 진입점:

- 서울시교통정보과 버스정보 Open API: https://api.bus.go.kr/
- 실제 호출 베이스 URL: `http://ws.bus.go.kr/api/rest`
- 이 프로젝트에서 쓰는 기능: `stationinfo/getStationByUid`

## 왜 “버스 API가 없다”고 보이나요?

자주 생기는 원인은 아래입니다.

1. Google Cloud Console에서 찾고 있음
   - Google Cloud에는 서울 버스 API가 없습니다.
   - Google Cloud는 Apps Script, Drive, Gmail 같은 Google API만 켜는 곳입니다.

2. 공공데이터포털에서 이름이 다르게 보임
   - 서울 버스 Open API는 `api.bus.go.kr` 쪽 안내를 기준으로 보는 편이 안전합니다.
   - 공공데이터포털 검색 결과와 실제 서울 버스 API 운영 페이지가 다르게 보일 수 있습니다.

3. 다른 서비스의 인증키를 사용함
   - `SERVICE KEY IS NOT REGISTERED`는 보통 키가 틀렸거나, 해당 서울 버스 서비스에 승인된 키가 아니라는 뜻입니다.

## 수업 안내용 정리

학생에게는 이렇게 설명하면 덜 헷갈립니다.

```text
날씨 API: Open-Meteo, 키 없음
급식 API: NEIS, 공개 조회 중심
마을버스 API: 서울시 버스 Open API, 키 필요
키 보관: GitHub Pages가 아니라 Apps Script Script Properties
```

## 키 발급 흐름

1. https://api.bus.go.kr/ 접속
2. 회원가입 또는 로그인
3. Open API / 인증키 신청 메뉴 찾기
4. 버스 도착 정보 또는 정류소 정보 조회 관련 서비스 사용 신청
5. 승인 후 인증키 확인
6. Apps Script의 Script Properties에 `BUS_API_KEY`로 저장

## 앱에서 사용하는 값

샘플 기본값:

- 정류소: 연희빌라
- 정류소번호(ARS): `21347`
- 노선명: `관악11`

Apps Script 프록시는 아래 URL을 호출합니다.

```text
http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?serviceKey=키&arsId=21347&resultType=json
```

## 주의

- API 키는 GitHub 코드에 넣지 않습니다.
- API 키는 Slack 공개 채널에 다시 올리지 않습니다.
- 이미 노출된 키는 가능하면 재발급합니다.
- GitHub Pages에서 `http://ws.bus.go.kr`를 직접 호출하면 HTTPS/CORS 문제로 막힐 수 있으므로 Apps Script 프록시를 사용합니다.

## 5분 전 알림

GitHub Pages만으로는 백그라운드 알림을 계속 실행할 수 없습니다. Apps Script 시간 기반 트리거를 사용합니다.

- 실행 함수: `checkBusAndSendMail`
- 이벤트 소스: 시간 기반
- 유형: 분 단위 타이머
- 간격: 1분마다

도착 예정 시간이 5분 이하이면 `MailApp.sendEmail()`로 메일을 보냅니다.
