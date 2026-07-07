import type { APIRoute } from 'astro';
import { checkCredentials, createSessionCookieValue, SESSION_COOKIE } from '../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const writeUsername = import.meta.env.WRITE_USERNAME;
  const writePassword = import.meta.env.WRITE_PASSWORD;
  const sessionSecret = import.meta.env.SESSION_SECRET;

  if (!writeUsername || !writePassword || !sessionSecret) {
    return new Response(
      JSON.stringify({ error: '서버에 WRITE_USERNAME/WRITE_PASSWORD/SESSION_SECRET이 설정되지 않았습니다.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let username = '';
  let password = '';
  try {
    const body = await request.json();
    username = typeof body.username === 'string' ? body.username : '';
    password = typeof body.password === 'string' ? body.password : '';
  } catch {
    return new Response(JSON.stringify({ error: '잘못된 요청입니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!checkCredentials(username, password, writeUsername, writePassword)) {
    return new Response(JSON.stringify({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  cookies.set(SESSION_COOKIE, createSessionCookieValue(sessionSecret), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
