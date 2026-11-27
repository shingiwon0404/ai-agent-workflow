# 기술 설계

- Node.js HTTP 서버가 정적 HTML, CSS와 바닐라 JavaScript를 제공한다. 배포나 데이터베이스는 필수가 아니다.
- `public/tasks.js`는 순수한 목록 연산과 저장 데이터 파싱을 담당하고 `public/app.js`가 DOM과 localStorage를 연결한다.
- 사용자 텍스트는 `textContent`로 렌더링한다. 저장소를 사용할 수 없으면 메모리에서 계속 동작하고 경고한다.
- Jest는 목록과 이슈 입력 정책을 검증하고, Playwright Chromium은 실제 브라우저에서 추가·새로고침·삭제를 검증한다.
- GitHub Actions는 이슈를 검증하고 Codex 변경을 제한한다. 별도 잡이 브랜치를 게시하고 테스트한 뒤 GitHub Actions 봇이 PR을 생성하고 독립 CI를 실행한다.
