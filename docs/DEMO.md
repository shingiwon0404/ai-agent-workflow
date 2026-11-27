# 시연 기록

실제로 확인한 값만 기입한다. 실행 링크는 이슈 댓글과 PR에 기록된다.

| 항목 | 결과 |
| --- | --- |
| 초기 구성 이슈 / PR | [이슈 #1](https://github.com/shingiwon0404/ai-agent-workflow/issues/1) / [봇 PR #4](https://github.com/shingiwon0404/ai-agent-workflow/pull/4), 사람 승인 후 병합 |
| 완료 표시 이슈 / PR | [이슈 #3](https://github.com/shingiwon0404/ai-agent-workflow/issues/3) / [봇 PR #5](https://github.com/shingiwon0404/ai-agent-workflow/pull/5), 사람 리뷰 대기 |
| 이슈 생성 → PR 생성 시간 | 1시간 37분 27초. 초기 구성·인증·승인을 기다린 시간이 포함됨 |
| 자동 실행 시작 → PR 생성 시간 | 최초 실행에서 2분 5초. 전체 자동 실행 완료까지 2분 12초 |
| Jest / Playwright 결과 및 실행 링크 | [최초 자동 실행](https://github.com/shingiwon0404/ai-agent-workflow/actions/runs/45951559414), [재실행](https://github.com/shingiwon0404/ai-agent-workflow/actions/runs/45951938971), [재실행 후 독립 CI](https://github.com/shingiwon0404/ai-agent-workflow/actions/runs/45952118009) 모두 통과 |
| 정보 부족 → 보완 후 재실행 | [진단 이슈 #6](https://github.com/shingiwon0404/ai-agent-workflow/issues/6): [보완 요청](https://github.com/shingiwon0404/ai-agent-workflow/actions/runs/45951966159) 후 [재처리 성공](https://github.com/shingiwon0404/ai-agent-workflow/actions/runs/45952082965). 진단 PR #9와 이슈는 닫음 |
| 테스트 실패 시 draft PR | [진단 이슈 #7](https://github.com/shingiwon0404/ai-agent-workflow/issues/7)의 [실패 실행](https://github.com/shingiwon0404/ai-agent-workflow/actions/runs/45951999459)에서 [초안 PR #8](https://github.com/shingiwon0404/ai-agent-workflow/pull/8) 생성 확인 후 둘 다 닫음 |
| 재실행 시 기존 브랜치 / PR 재사용 | [재실행](https://github.com/shingiwon0404/ai-agent-workflow/actions/runs/45951938971) 후 `ai/issue-3` 브랜치와 PR #5 각각 한 개 확인 |
| 브랜치 보호, 사람 리뷰 및 병합 | main에 두 검사와 승인 1개가 필수이며 관리자에도 적용됨. 승인 전 PR #5의 병합 차단을 확인했고, PR #5의 사람 리뷰와 병합은 대기 중 |
| 사람의 개입 지점 | OpenAI 비밀값 등록, 초기 PR 리뷰·병합, 미리 생성한 이슈 #3의 수동 실행, 최종 PR 리뷰·병합 |

GitHub의 봇 PR 이벤트 검사 중 일부는 별도의 실행 승인을 요구할 수 있다. 위 독립 CI는 워크플로가 별도로 실행한 검사 결과다.
