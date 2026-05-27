# 생활 데이터 웹앱 만들기

GitHub Pages에 배포하는 정적 웹앱에서 시작해 날씨, NEIS 급식, Google Sheets 투표 저장, Apps Script 버스 프록시까지 단계별로 확장하는 고등학생용 웹교재입니다.

배포 주소: https://greatsong.github.io/sample_app/textbook.html

## 교재 구조

- `textbook.html`: 전체 목차와 수업 흐름
- `textbook/00.html` ~ `textbook/07.html`: 장별 수업 페이지
- `textbook/appendix.html`: Apps Script, API 키, 오류 해결
- `textbook/finish.html`: 발표와 자기평가
- `index.html`: 완성 샘플 앱

## 수업 설계

기능별 설명서가 아니라 앱이 단계별로 강해지는 흐름입니다.

1. 완성본 체험
2. GitHub Pages 배포
3. 바이브코딩 작업법
4. 공개 데이터 붙이기
5. 사용자 행동 저장하기
6. 비밀키 숨기는 프록시 만들기
7. 내 생활권 앱으로 리디자인하기
8. 발표와 갤러리

## 보안 원칙

- API 키는 GitHub에 올리지 않습니다.
- Apps Script Script Properties에 비밀값을 저장합니다.
- AI가 만든 코드는 실행 결과로 검증합니다.
