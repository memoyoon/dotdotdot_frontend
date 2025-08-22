# 📝 Memo Timetable

“메모 타임테이블 서비스” 

 순간의 메모를 자동 저장하고, 시간대별로 직관적으로 확인할 수 있는 미니멀 웹앱.

# 📂 프로젝트 구조
frontend

# 🚀 실행 방법
1. 의존성 설치

- npm install

2. 개발 서버 실행

- npm run dev http://localhost:5173

3. 프로덕션 빌드
- npm run build

- npm run preview


# ✨ 주요 기능

1. 노트 작성 & 자동 저장

- NoteEditor에서 입력 → debounce → API 호출

- 오프라인 시 큐잉/재시도 예정

2. 타임테이블 뷰

- 하루 메모를 시간 단위로 정리해 직관적으로 표시

- 캘린더 뷰

- 날짜 선택 시 해당 날짜의 타임테이블 확인

3. 홈 화면 추가 (PWA: Add to Home Screen)

- vite-plugin-pwa 기반 자동 manifest/service worker 생성

- 안드로이드/Chrome: 설치 버튼 지원

- iOS/Safari: 수동으로 홈 화면에 추가 (안내 배너 예정)

- 인앱 브라우저(Naver, Kakao 등): 외부 브라우저 열기 안내

4. 📱 모바일 지원

- index.html <meta name="viewport">로 반응형 기본 설정

- 홈 화면 실행 시 앱처럼 전체화면 동작


# 🛠 기술 스택

- Frontend: React + TypeScript + Vite

- Styling: TailwindCSS (예정)

- State: React hooks (필요 시 Zustand/Redux 예정)

PWA: vite-plugin-pwa (자동 manifest / service worker 관리)

- Backend (별도 repo): FastAPI

# 📌 TO DO

 - 오프라인 큐/재시도 처리

 - 다크 모드 자동 적용

 - 태그 기능 추가

 - PWA 오프라인 캐싱 강화