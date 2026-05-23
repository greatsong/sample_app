# Google Apps Script 버스 프록시 만들기

GitHub Pages는 정적 파일 호스팅이라 서울 버스 API 키를 안전하게 숨길 수 없습니다. 브라우저에서 서울 버스 API를 직접 호출하면 HTTP/CORS 문제도 생길 수 있습니다.

그래서 이 프로젝트는 아래 구조를 사용합니다.

```text
GitHub Pages 샘플 앱
  -> Apps Script Web App URL
      -> Script Properties의 BUS_API_KEY 사용
      -> 서울 버스 API 호출
      -> JSON 결과 반환
```

## 완성 코드 위치

리포에 Apps Script 원본을 따로 넣어 두었습니다.

- `apps-script/Code.gs`
- `apps-script/appsscript.json`

Apps Script 화면에서 `Code.gs`에는 `apps-script/Code.gs` 내용을 붙여넣으면 됩니다.

## 1. Apps Script 만들기

1. https://script.google.com 접속
2. `새 프로젝트` 클릭
3. 프로젝트 이름을 `bus-arrival-proxy`처럼 변경
4. `Code.gs` 파일을 열기
5. GitHub 리포의 `apps-script/Code.gs` 내용을 전체 복사해서 붙여넣기
6. 저장

## 2. 키를 Script Properties에 저장

1. Apps Script 왼쪽의 `프로젝트 설정` 클릭
2. `스크립트 속성` 또는 `Script Properties` 섹션 찾기
3. `속성 추가` 클릭
4. 속성 이름: `BUS_API_KEY`
5. 값: 공공데이터포털 버스 API 인증키
6. 저장

### Encoding 키와 Decoding 키

공공데이터포털은 보통 두 가지 키를 보여줍니다.

- `Encoding`: `%2F`, `%2B`, `%3D` 같은 문자가 들어간 값
- `Decoding`: `/`, `+`, `=` 같은 문자가 들어간 값

이번 프록시 코드는 둘 중 어느 쪽을 넣어도 동작하도록 처리했습니다. 그래도 수업에서는 `Decoding` 키를 넣는 방식으로 설명하는 것이 덜 헷갈립니다.

주의: API 키는 GitHub, Slack, 교재 화면에 다시 붙여넣지 않는 것이 좋습니다.

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

`apps-script/Code.gs`에는 `checkBusAndSendMail` 함수도 들어 있습니다.

메일 알림을 쓰려면 Script Properties에 아래 값을 추가합니다.

- `BUS_ALERT_EMAIL`: 알림 받을 이메일
- `BUS_ALERT_ARS_ID`: `21347`
- `BUS_ALERT_ROUTE_NAME`: `관악11`
- `BUS_ALERT_COOLDOWN_MINUTES`: `10`

트리거 설정:

1. Apps Script 왼쪽 `트리거` 클릭
2. `트리거 추가` 클릭
3. 실행 함수: `checkBusAndSendMail`
4. 이벤트 소스: `시간 기반`
5. 유형: `분 단위 타이머`
6. 간격: `1분마다`

같은 버스가 계속 5분 이내로 잡힐 때 메일이 반복 발송되지 않도록 기본 10분 쿨다운을 넣었습니다.

## 자주 나는 오류

- `NO_BUS_API_KEY`: Script Properties에 `BUS_API_KEY`가 없습니다.
- `SERVICE KEY IS NOT REGISTERED`: 키 승인 반영이 아직 안 됐거나, 서비스가 다른 API 키일 수 있습니다.
- Encoding 키를 넣었더니 실패: 최신 코드는 자동 처리하지만, 이전 코드를 쓰고 있으면 키가 이중 인코딩될 수 있습니다. `apps-script/Code.gs` 최신 코드로 바꾸세요.
- Web App URL이 403: 배포 권한이 `모든 사용자`가 아닐 수 있습니다.
- 앱에서 CORS 오류: GitHub Pages가 서울 버스 API를 직접 호출하고 있는지 확인하세요. 앱에는 Apps Script Web App URL만 넣어야 합니다.
- 수정했는데 반영 안 됨: Apps Script는 코드를 바꾼 뒤 `배포 > 배포 관리 > 새 버전`으로 다시 배포해야 합니다.
