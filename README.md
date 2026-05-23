# 범용 바이브 코딩 웹앱 샘플

GitHub Pages에 배포하는 정적 웹앱에서 시작해 날씨, 마을버스, NEIS 급식 API와 급식 메뉴 투표 기능까지 확장하는 왕초보용 샘플 프로젝트입니다.

## 배포 주소

https://greatsong.github.io/sample_app/

## 완성 교재

- HTML 교재: https://greatsong.github.io/sample_app/textbook.html
- Markdown 교재: [생활 데이터 웹앱 만들기](docs/TEXTBOOK.md)
- 버스 프록시 가이드: [BUS_PROXY_GUIDE.md](docs/BUS_PROXY_GUIDE.md)
- 버스 API 키 발급 가이드: [BUS_API_KEY_GUIDE.md](docs/BUS_API_KEY_GUIDE.md)

## 챕터

1. `chapters/01-github-pages`: GitHub Pages 배포
2. `chapters/02-vibe-coding`: 바이브 코딩 작업 흐름
3. `chapters/03-google-sheets`: Google Sheets 연동
4. `chapters/04-open-api`: 날씨, 마을버스, NEIS 급식 API와 투표
5. `chapters/05-database`: DB 연동과 투표 저장 확장
6. `chapters/06-final-project`: 최종 프로젝트

## 현재 포함 기능

- Open-Meteo 서울 현재 날씨: 키 없이 바로 동작
- 마을버스 도착 정보: Apps Script 프록시 URL 입력 후 활성화
- NEIS 급식식단정보: 당곡고 샘플 설정, 오늘 기준 가장 가까운 급식일 자동 선택
- 급식 메뉴 투표: 브라우저 localStorage 저장
