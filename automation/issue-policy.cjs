// The issue body is data, never a shell command or workflow expression.
function section(body, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = String(body || '').match(new RegExp(`^#{2,3}\\s+${escaped}\\s*\\r?\\n([\\s\\S]*?)(?=^#{2,3}\\s|$(?![\\s\\S]))`, 'im'));
  return match ? match[1].replace(/<!--[^]*?-->/g, '').trim() : '';
}

function inspect(body) {
  const goal = section(body, 'Goal');
  const criteria = section(body, 'Acceptance criteria');
  const missing = [];
  if (goal.replace(/\s/g, '').length < 10 || /^_No response_$/i.test(goal)) missing.push('a specific Goal (at least 10 non-space characters)');
  const bullets = criteria.split(/\r?\n/).map((line) => line.match(/^\s*[-*]\s+(?:\[[ xX]\]\s*)?(.+)$/)).filter(Boolean);
  if (!bullets.some((match) => match[1].trim().replace(/\s/g, '').length >= 10 && !/^_No response_$/i.test(match[1].trim()))) {
    missing.push('at least one specific Acceptance criteria bullet (at least 10 non-space characters)');
  }
  return { ok: missing.length === 0, missing };
}

function canWrite(permission) {
  return ['write', 'maintain', 'admin'].includes(permission);
}

module.exports = { inspect, canWrite };
