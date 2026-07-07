import type { APIRoute } from 'astro';
import { verifySessionCookieValue, SESSION_COOKIE } from '../../lib/auth';
import { slugify, todayISODate } from '../../lib/slugify';
import { publishPostFile } from '../../lib/github';

export const prerender = false;

const MAX_TITLE_LEN = 200;
const MAX_TAG_LEN = 30;
const MAX_TAGS = 10;
const MAX_BODY_LEN = 200_000;

function jsonResponse(status: number, data: unknown) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function deriveDescription(body: string): string {
  const firstLine = body
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0 && !line.startsWith('#'));
  if (!firstLine) return '';
  const stripped = firstLine.replace(/[*_`#>]/g, '');
  return stripped.length > 150 ? `${stripped.slice(0, 150)}…` : stripped;
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionSecret = import.meta.env.SESSION_SECRET;
  const githubToken = import.meta.env.GITHUB_TOKEN;
  const owner = import.meta.env.GITHUB_OWNER;
  const repo = import.meta.env.GITHUB_REPO;
  const branch = import.meta.env.GITHUB_BRANCH || 'main';

  if (!sessionSecret || !githubToken || !owner || !repo) {
    return jsonResponse(500, { error: '서버 환경변수가 올바르게 설정되지 않았습니다.' });
  }

  const sessionCookie = cookies.get(SESSION_COOKIE)?.value;
  if (!verifySessionCookieValue(sessionCookie, sessionSecret)) {
    return jsonResponse(401, { error: '인증이 필요합니다. 다시 로그인해주세요.' });
  }

  let payload: { title?: unknown; tags?: unknown; body?: unknown };
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, { error: '잘못된 요청 형식입니다.' });
  }

  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const rawTags = typeof payload.tags === 'string' ? payload.tags : '';
  const body = typeof payload.body === 'string' ? payload.body : '';

  if (!title || title.length > MAX_TITLE_LEN) {
    return jsonResponse(400, { error: `제목은 1~${MAX_TITLE_LEN}자여야 합니다.` });
  }
  if (!body.trim()) {
    return jsonResponse(400, { error: '본문을 입력해주세요.' });
  }
  if (body.length > MAX_BODY_LEN) {
    return jsonResponse(400, { error: '본문이 너무 깁니다.' });
  }

  const tags = [
    ...new Set(
      rawTags
        .split(',')
        .map((tag) => slugify(tag.trim()))
        .filter((tag) => tag.length > 0 && tag.length <= MAX_TAG_LEN)
    ),
  ].slice(0, MAX_TAGS);

  const date = todayISODate();
  const slug = slugify(title);
  const filename = `${date}-${slug}.md`;
  const path = `src/content/posts/${filename}`;
  const description = deriveDescription(body);

  const frontmatter = [
    '---',
    `title: ${yamlString(title)}`,
    `date: ${date}`,
    `tags: ${JSON.stringify(tags)}`,
    `description: ${yamlString(description)}`,
    '---',
    '',
    body.trim(),
    '',
  ].join('\n');

  try {
    const { commitUrl } = await publishPostFile({
      token: githubToken,
      owner,
      repo,
      branch,
      path,
      content: frontmatter,
      commitMessage: `post: ${title}`,
    });

    return jsonResponse(200, { ok: true, slug, path, commitUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'GitHub 커밋에 실패했습니다.';
    return jsonResponse(502, { error: message });
  }
};
