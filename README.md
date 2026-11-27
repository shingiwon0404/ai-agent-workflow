# 한 걸음 · AI issue workflow

작은 할 일 앱과 GitHub 이슈에서 설계·구현·테스트·PR까지 이어지는 Codex 자동화 예제다. 계정 없이 할 일을 추가하고 삭제할 수 있으며 목록은 같은 브라우저에 저장된다.

## 실행

Node.js 24가 필요하다.

```sh
npm ci
npm start
```

브라우저에서 http://127.0.0.1:3000 을 연다. 테스트는 다음과 같다.

```sh
npm test
npx playwright install chromium
npm run test:e2e
```

## 자동화 사용

OpenAI 인증과 GitHub Actions의 PR 생성 권한, 브랜치 보호를 [운영 안내](docs/OPERATIONS.md)에 따라 먼저 설정한다. 쓰기 권한이 있는 팀원이 feature 이슈에 **Goal**과 **Acceptance criteria**를 작성하면 자동화가 시작된다. 정보가 부족하면 이슈에 보완할 내용을 남긴다. 본문을 수정하면 최신 내용으로 다시 실행된다.

Codex는 `ai/issue-N` 브랜치에서 관련 `docs/` 문서와 테스트, 구현을 변경한다. GitHub Actions 봇이 PR을 생성하고 별도 잡의 테스트 결과를 기록하며 실패하면 draft로 남긴다. 다시 실행할 때 기존 브랜치와 PR을 사용한다. `.github/`와 `automation/`의 수정은 사람이 별도 PR로 처리한다. PR 생성 후 별도 CI가 실행되며, 두 검사와 사람 리뷰를 거친 후 병합한다.

제품·기술 문서는 [docs](docs/)에 있으며, 발표 기록은 [시연 기록](docs/DEMO.md)에 남긴다.
