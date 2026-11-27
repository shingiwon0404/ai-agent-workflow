const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
jest.mock('../../automation/comments.cjs', () => ({ status: jest.fn() }));
const { status } = require('../../automation/comments.cjs');
const prepare = require('../../automation/prepare.cjs');
const publish = require('../../automation/publish.cjs');

const context = {
  repo: { owner: 'team', repo: 'example' },
  actor: 'writer',
  payload: { issue: { number: 3 }, repository: { default_branch: 'main' } },
  serverUrl: 'https://github.com',
  runId: 100,
};
const validBody = '### Goal\nLet users mark a task complete.\n\n### Acceptance criteria\n- The completed state remains after reload.';
let core;

beforeEach(() => {
  jest.clearAllMocks();
  core = { setOutput: jest.fn(), notice: jest.fn() };
});

function prepareGithub(body, permission = 'write') {
  return {
    rest: {
      issues: { get: jest.fn().mockResolvedValue({ data: { state: 'open', user: { login: 'writer' }, title: 'Test', body } }) },
      repos: { getCollaboratorPermissionLevel: jest.fn().mockResolvedValue({ data: { permission } }) },
      pulls: { list: jest.fn() },
    },
    paginate: jest.fn().mockResolvedValue([]),
  };
}

test('incomplete requirements get a request for information and never start the agent', async () => {
  const github = prepareGithub('### Goal\nshort');
  await prepare({ github, context, core });
  expect(status).toHaveBeenCalledWith(github, context, 3, expect.stringContaining('More information'));
  expect(core.setOutput).not.toHaveBeenCalledWith('ready', 'true');
});

test('an issue without write access cannot start the agent', async () => {
  const github = prepareGithub(validBody, 'read');
  await prepare({ github, context, core });
  expect(core.setOutput).not.toHaveBeenCalledWith('ready', 'true');
  expect(status).not.toHaveBeenCalled();
});

test('complete requirements prepare a predictable branch and prompt', async () => {
  const github = prepareGithub(validBody);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'issue-prompt-'));
  const previous = process.env.RUNNER_TEMP;
  process.env.RUNNER_TEMP = temp;
  try {
    await prepare({ github, context, core });
    expect(core.setOutput).toHaveBeenCalledWith('branch', 'ai/issue-3');
    expect(core.setOutput).toHaveBeenCalledWith('ready', 'true');
    expect(fs.readFileSync(path.join(temp, 'issue-prompt.txt'), 'utf8')).toContain(validBody);
  } finally {
    if (previous === undefined) delete process.env.RUNNER_TEMP; else process.env.RUNNER_TEMP = previous;
    const prompt = path.join(temp, 'issue-prompt.txt');
    if (fs.existsSync(prompt)) fs.unlinkSync(prompt);
    fs.rmdirSync(temp);
  }
});

test('a failed test creates a draft PR', async () => {
  const create = jest.fn().mockResolvedValue({ data: { html_url: 'https://github.com/team/example/pull/4' } });
  const github = {
    rest: { issues: { get: jest.fn().mockResolvedValue({ data: { title: 'Feature' } }) }, pulls: { list: jest.fn(), create } },
    paginate: jest.fn().mockResolvedValue([]),
  };
  process.env.ISSUE_NUMBER = '3'; process.env.BRANCH = 'ai/issue-3';
  process.env.UNIT_RESULT = 'failure'; process.env.E2E_RESULT = 'success';
  await publish({ github, context, core });
  expect(create).toHaveBeenCalledWith(expect.objectContaining({ head: 'ai/issue-3', draft: true, body: expect.stringContaining('Unit tests: **failure**') }));
});

test('a retry updates the existing PR and marks it ready after tests pass', async () => {
  const update = jest.fn().mockResolvedValue({ data: { number: 4, node_id: 'node', draft: true, html_url: 'https://github.com/team/example/pull/4' } });
  const create = jest.fn();
  const github = {
    rest: { issues: { get: jest.fn().mockResolvedValue({ data: { title: 'Feature' } }) }, pulls: { list: jest.fn(), update, create } },
    paginate: jest.fn().mockResolvedValue([{ number: 4, merged_at: null }]),
    graphql: jest.fn().mockResolvedValue({}),
  };
  process.env.ISSUE_NUMBER = '3'; process.env.BRANCH = 'ai/issue-3';
  process.env.UNIT_RESULT = 'success'; process.env.E2E_RESULT = 'success';
  await publish({ github, context, core });
  expect(create).not.toHaveBeenCalled();
  expect(update).toHaveBeenCalledWith(expect.objectContaining({ pull_number: 4 }));
  expect(github.graphql).toHaveBeenCalledWith(expect.stringContaining('markPullRequestReadyForReview'), { id: 'node' });
});
