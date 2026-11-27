# GitHub 운영 안내

## 최초 설정

1. 이 프로젝트를 공개 저장소의 기본 브랜치 `main`에 올리고 Actions와 Issues를 활성화한다. 최초 구성은 자동화가 아직 없으므로 사람이 부트스트랩 이슈와 최초 커밋을 연결한다.
2. GitHub App을 만들고 이 저장소에 설치한다. 저장소 권한은 **Contents: read and write**, **Issues: read and write**, **Pull requests: read and write**, **Metadata: read**다. 저장소에 필요한 범위만 설치한다. App ID와 개인 키를 준비한다.
3. 저장소의 Settings → Secrets and variables → Actions에 `APP_ID`, `APP_PRIVATE_KEY`, `OPENAI_API_KEY`를 등록한다. 키는 파일이나 이슈에 기록하지 않는다. OpenAI API 사용은 비용이 발생할 수 있다.
4. Settings → Actions → General에서 Actions를 허용한다. PR은 GitHub App 설치 토큰이 생성하므로 기본 `GITHUB_TOKEN`으로 만든 PR의 이벤트 억제에 의존하지 않는다.
5. `main`의 branch protection 또는 이에 상응하는 ruleset에서 PR을 필수로 하고, 승인 리뷰 1개 이상, `Unit tests`와 `E2E tests` 통과, 최신 기준 브랜치 확인을 요구한다. 관리자 우회도 제한한다. 규칙은 실제 검사 이름과 함께 저장소 설정에서 확인한다.

## 실행과 재시도

- 이슈 작성자와 실행을 유발한 사람이 모두 저장소의 write, maintain 또는 admin 권한을 가져야 한다. 공개 저장소의 외부 이슈는 Codex를 실행하지 않는다.
- feature 템플릿의 `Goal`에는 10자 이상의 구체적인 목표를, `Acceptance criteria`에는 10자 이상의 검증 가능한 Markdown 목록 항목을 적는다(공백 제외). 이 검사는 형식 검사이므로 요구사항의 완전성을 사람이 검토해야 한다.
- 열린 이슈의 생성·수정·재열기에서 현재 본문을 다시 읽는다. 이슈별 동시 실행을 직렬화한다. GitHub Actions는 대기 중인 중간 실행을 최신 실행으로 대체할 수 있으므로 최신 본문이 기준이다.
- Actions → Issue agent → Run workflow에서 이슈 번호를 지정해 재시도할 수 있다. 실패 후 기존 `ai/issue-N` 브랜치를 가져와 최신 기본 브랜치를 병합하고 기존 PR을 갱신한다. 이미 병합된 PR의 추가 작업은 새 이슈로 요청한다.
- 이슈 상태 댓글과 PR의 Actions 링크에서 실행 및 테스트 결과를 확인한다. 테스트 실패는 draft PR, 변경이 없는 경우 이슈 댓글로 보고한다. PR 생성 후 `CI` 검사까지 별도로 확인한다.
- 최초 설정, GitHub App 인증, 정책, Actions 정의와 `automation/`은 사람의 별도 PR로 변경한다. 비밀값을 Codex 프롬프트 또는 실행 로그에 넣지 않는다.

## 확인 시나리오

1. 빈 Goal 또는 Acceptance criteria로 이슈를 만들면 보완 댓글이 생기고 브랜치가 생기지 않는지 확인한다. 본문을 채워 수정한 다음 실행되는지 확인한다.
2. 완료 표시 기능을 요청한다. 설계 문서가 함께 바뀌고, 브랜치 하나와 PR 하나, 두 테스트 결과와 실행 링크가 있는지 확인한다.
3. 같은 이슈에 대해 Actions의 수동 실행을 두 번 요청하고 브랜치와 PR이 중복되지 않는지 확인한다.
4. 안전한 테스트용 변경으로 테스트 실패를 유도하여 PR이 draft가 되는지 확인한다. 변경을 수정해 재실행한 후 검사와 PR 상태를 다시 확인한다.
5. CI가 실패하거나 승인 리뷰가 없을 때 main 병합이 차단되는지 확인한 뒤 사람 리뷰와 병합을 수행한다. 테스트용 실패는 실제 보호 브랜치가 아닌 이슈 브랜치에서만 유도한다.

## 신뢰 경계

쓰기 권한이 있는 이슈 작성자는 Codex가 코드와 테스트를 실행하게 할 수 있다. App 토큰은 Codex 실행 후 생성하며 검증 잡은 비밀값 없이 별도 러너에서 실행한다. 이슈 텍스트는 요구사항 데이터로 취급하고 설정 파일 변경은 자동 PR에서 거부한다. 이 장치는 팀원의 코드 리뷰나 GitHub 조직 정책을 대체하지 않는다.
