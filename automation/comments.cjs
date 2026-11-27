const marker = '<!-- ai-agent-workflow-status -->';

async function status(github, context, issueNumber, body) {
  const { owner, repo } = context.repo;
  const comments = await github.paginate(github.rest.issues.listComments, { owner, repo, issue_number: issueNumber, per_page: 100 });
  const prior = comments.find((comment) => comment.user?.login === 'github-actions[bot]' && comment.body?.includes(marker));
  const content = `${marker}\n${body}`;
  if (prior) await github.rest.issues.updateComment({ owner, repo, comment_id: prior.id, body: content });
  else await github.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body: content });
}

module.exports = { status };
