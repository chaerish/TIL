import type { APIRoute } from 'astro';
import { verifySessionCookieValue, SESSION_COOKIE } from '../../lib/auth';
import { commitFile } from '../../lib/github';
import { slugify, todayISODate } from '../../lib/slugify';

export const prerender = false;

const ALLOWED_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

const MAX_BYTES = 4 * 1024 * 1024; // 4MB

function jsonResponse(status: number, data: unknown) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
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

  let payload: { filename?: unknown; contentBase64?: unknown; contentType?: unknown };
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, { error: '잘못된 요청 형식입니다.' });
  }

  const contentType = typeof payload.contentType === 'string' ? payload.contentType : '';
  const ext = ALLOWED_EXTENSIONS[contentType];
  if (!ext) {
    return jsonResponse(400, { error: '지원하지 않는 이미지 형식입니다. (png, jpg, gif, webp, svg만 가능)' });
  }

  const contentBase64 = typeof payload.contentBase64 === 'string' ? payload.contentBase64 : '';
  if (!contentBase64) {
    return jsonResponse(400, { error: '이미지 데이터가 없습니다.' });
  }
  if (contentBase64.length * 0.75 > MAX_BYTES) {
    return jsonResponse(400, { error: '이미지 크기는 4MB를 넘을 수 없습니다.' });
  }

  const rawFilename = typeof payload.filename === 'string' ? payload.filename : 'image';
  const baseName = slugify(rawFilename.replace(/\.[^.]+$/, '')) || 'image';
  const filename = `${todayISODate()}-${Date.now()}-${baseName}.${ext}`;
  const path = `public/images/uploads/${filename}`;

  try {
    await commitFile({
      token: githubToken,
      owner,
      repo,
      branch,
      path,
      contentBase64,
      commitMessage: `image: ${filename}`,
    });

    return jsonResponse(200, { url: `/images/uploads/${filename}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'GitHub 업로드에 실패했습니다.';
    return jsonResponse(502, { error: message });
  }
};
