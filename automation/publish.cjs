module.exports = async ({ github, context, core }) => {
  const { owner, repo } = context.repo;
  const number = Number(process.env.ISSUE_NUMBER);
  const branch = process.env.BRANCH;
  const unit = process.env.UNIT_RESULT;
  const e2e = process.env.E2E_RESULT;
  const passed = unit === 'success' && e2e === 'success';
  const runUrl = `${context.serverUrl}/${owner}/${repo}/actions/runs/${context.runId}`;
  const { data: issue } = await github.rest.issues.get({ owner, repo, issue_number: number });
  const body = [
    `Closes #${number}`,
    '',
    '## Automated validation',
    `- Unit tests: **${unit}**`,
    `- E2E tests: **${e2e}**`,
    `- [Workflow run and test logs](${runUrl})`,
    '',
    passed ? 'Please review the design, implementation and tests before merging.' : 'This PR is a draft because at least one test job did not pass.',
  ].join('\n');
  const matches = await github.paginate(github.rest.pulls.list, { owner, repo, state: 'all', head: `${owner}:${branch}`, base: context.payload.repository.default_branch, per_page: 100 });
  let pull = matches.find((item) => !item.merged_at);
  if (pull) {
    pull = (await github.rest.pulls.update({ owner, repo, pull_number: pull.number, title: `AI: ${issue.title}`.slice(0, 256), body, state: 'open' })).data;
    if (!passed && !pull.draft) {
      await github.graphql('mutation($id: ID!) { convertPullRequestToDraft(input: {pullRequestId: $id}) { pullRequest { id } } }', { id: pull.node_id });
    } else if (passed && pull.draft) {
      await github.graphql('mutation($id: ID!) { markPullRequestReadyForReview(input: {pullRequestId: $id}) { pullRequest { id } } }', { id: pull.node_id });
    }
  } else {
    pull = (await github.rest.pulls.create({ owner, repo, title: `AI: ${issue.title}`.slice(0, 256), body, head: branch, base: context.payload.repository.default_branch, draft: !passed })).data;
  }
  core.setOutput('url', pull.html_url);
};
