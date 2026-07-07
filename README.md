# 📝 Today I Learned (TIL)
> **🚀 꾸준한 기록이 성장으로**
## 📌 소개
- 이 레포지토리는 하루 동안 학습한 내용을 정리하고 기록하는 공간입니다.
- 짧은 글이라도 꾸준히 작성하여 성장의 흔적을 남기고, 필요할 때 쉽게 찾아볼 수 있도록 관리합니다.

## 💡 작성 규칙

- 하루에 최소 한 개의 학습 내용을 정리합니다.
- 핵심 개념, 문제 해결 과정, 코드 샘플 등을 포함합니다.
- 가능하면 실습 코드와 함께 정리하여 활용도를 높입니다.
- 꾸준함이 가장 중요합니다!

## 🎯 목표

- 하루 한 걸음, 작은 학습이라도 기록하기
- 배운 내용을 정리하며 깊이 있게 이해하기
- 필요할 때 빠르게 찾아볼 수 있는 나만의 지식 저장소 만들기

---

# 블로그 (Astro)

이 레포는 Astro 기반 정적 블로그이기도 합니다. `src/content/posts/`의 마크다운 파일이 곧 블로그 글입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

`http://localhost:4321`에서 확인합니다.

## 새 글 쓰는 법 (파일로 직접 작성)

`src/content/posts/` 아래에 `YYYY-MM-DD-slug.md` 형식으로 마크다운 파일을 추가하면 됩니다.

```markdown
---
title: 글 제목
date: 2026-07-07
tags: [astro, blog]
description: 한 줄 요약
---

본문 내용을 마크다운으로 작성합니다.
```

파일을 추가하고 `main` 브랜치에 push하면 Vercel이 자동으로 빌드/배포합니다.

## 새 글 쓰는 법 (웹 에디터, `/write`)

배포된 사이트의 `/write` 경로에서 관리자 아이디/비밀번호를 입력하면 제목/태그/마크다운 본문을 작성하는
에디터가 나타납니다. "발행"을 누르면 서버(`/api/publish`)가 GitHub API로
`src/content/posts/YYYY-MM-DD-slug.md` 파일을 생성해 `main` 브랜치에 직접 커밋합니다.
커밋이 푸시되면 Vercel이 자동으로 재배포하므로 잠시 후 블로그에 새 글이 반영됩니다.

> 커밋 후 바로 새 글 페이지로 이동하지만, Vercel 재배포가 끝나기 전까지는 잠깐 404가 보일 수 있습니다.

### 환경변수 설정 (Vercel 대시보드)

Vercel 프로젝트 → **Settings → Environment Variables**에서 아래 값을 등록합니다. (`.env.example` 참고)

| 이름 | 설명 |
| --- | --- |
| `WRITE_USERNAME` | `/write` 페이지 관리자 아이디 (회원가입 없이 단일 관리자 계정) |
| `WRITE_PASSWORD` | `/write` 페이지 관리자 비밀번호 |
| `SESSION_SECRET` | 로그인 세션 쿠키 서명용 비밀 키. 무작위 긴 문자열 (예: `openssl rand -hex 32`) |
| `GITHUB_TOKEN` | 아래 방법으로 발급한 Personal Access Token |
| `GITHUB_OWNER` | 저장소 소유자 (예: `chaerish`) |
| `GITHUB_REPO` | 저장소 이름 (예: `TIL`) |
| `GITHUB_BRANCH` | 커밋할 브랜치 (기본값 `main`) |

로컬에서 `/write` 기능까지 테스트하려면 위 값들을 `.env` 파일에 넣고 `npm run dev`로 실행하세요
(`.env`는 `.gitignore`에 포함되어 커밋되지 않습니다).

### GitHub Personal Access Token 발급 방법

1. GitHub → 우측 상단 프로필 → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. **Generate new token** 클릭
3. **Repository access**: "Only select repositories"를 선택하고 이 블로그 저장소만 선택 (토큰 권한을 최소 범위로 제한)
4. **Permissions → Repository permissions → Contents**: **Read and write**로 설정 (글 파일을 커밋하는 데 필요한 유일한 권한)
5. 토큰 생성 후 값을 복사해 Vercel의 `GITHUB_TOKEN` 환경변수에 등록

토큰은 클라이언트에 절대 노출되지 않고 `/api/publish` 서버리스 함수 안에서만 사용됩니다.

## 배포 (Vercel)

1. Vercel 대시보드에서 **Add New → Project**로 이 GitHub 저장소를 연결합니다.
2. Framework Preset은 자동으로 Astro로 인식됩니다 (`vercel.json`에 명시되어 있음).
3. 위 환경변수를 등록한 뒤 배포합니다.
4. 이후 `main` 브랜치에 push(직접 push든 `/write`를 통한 커밋이든)할 때마다 자동으로 재배포됩니다.

## 프로젝트 구조

```
src/
  content.config.ts       콘텐츠 컬렉션 스키마 정의
  content/posts/*.md      블로그 글
  layouts/                BaseLayout, PostLayout
  components/             Header, ThemeToggle, PostCard
  pages/
    index.astro           글 목록
    posts/[slug].astro    글 상세
    tags/index.astro      태그 전체 목록
    tags/[tag].astro      태그별 필터링
    rss.xml.js            RSS 피드
    write.astro           글쓰기 웹 UI (비밀번호 보호)
    api/login.ts          비밀번호 검증 + 세션 쿠키 발급
    api/publish.ts        GitHub API로 글 파일 커밋
  lib/                     auth, github, slugify 헬퍼
```
