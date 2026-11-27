const { inspect, canWrite } = require('../../automation/issue-policy.cjs');

test('requests details for an empty issue or empty template', () => {
  expect(inspect('').ok).toBe(false);
  expect(inspect('### Goal\n_No response_\n\n### Acceptance criteria\n- [ ] ').missing).toHaveLength(2);
});

test('accepts a concrete goal and a criterion in either standard heading level', () => {
  const issue = '## Goal\n사용자가 완료한 할 일을 표시할 수 있다.\n\n## Acceptance criteria\n- [ ] 체크 상태가 새로고침 후에도 유지된다.\n\n## Notes\n추가 정보';
  expect(inspect(issue)).toEqual({ ok: true, missing: [] });
});

test('only repository writers can trigger the agent', () => {
  for (const permission of ['admin', 'maintain', 'write']) expect(canWrite(permission)).toBe(true);
  for (const permission of ['triage', 'read', 'none', null]) expect(canWrite(permission)).toBe(false);
});
