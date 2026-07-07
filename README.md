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

이 레포는 Astro 기반 블랙 앤 화이트 정적 블로그이기도 합니다. `src/content/posts/`의 마크다운 파일이
곧 블로그 글이며, 배포 주소는 **https://chaerishtil.vercel.app** 입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

`http://localhost:4321`에서 확인합니다. `/write` 기능까지 로컬에서 테스트하려면 아래 환경변수 섹션을
참고해 `.env` 파일을 만들어두세요 (`.env`는 `.gitignore`에 포함되어 커밋되지 않습니다).

## 페이지 구성

| 경로 | 설명 |
| --- | --- |
| `/` | 글 목록 |
| `/posts/[slug]` | 글 상세 |
| `/tags`, `/tags/[tag]` | 태그 전체 목록 / 태그별 필터링 |
| `/rss.xml` | RSS 피드 |
| `/about` | 프로필 소개 (`src/data/profile.ts` 편집) |
| `/portfolio` | 포트폴리오 프로젝트 목록 (`src/data/portfolio.ts` 편집) |
| `/write` | 관리자 전용 글쓰기 웹 에디터 |

## 새 글 쓰는 법 (파일로 직접 작성)

`src/content/posts/` 아래에 `YYYY-MM-DD-slug.md` 형식으로 마크다운 파일을 추가하면 됩니다.

```markdown
---
title: 글 제목
date: 2026-07-07
tags: [astro, blog]
description: 한 줄 요약
---

본문 내용을 마크다운으로 작성합니다. 코드 블록은 \`\`\`언어 로 감싸면 자동으로
문법 강조(syntax highlighting)가 적용됩니다.

이미지는 `public/images/` 아래에 파일을 두고 `![설명](/images/파일명.png)`으로 참조하세요.
```

파일을 추가하고 `main` 브랜치에 push하면 Vercel이 자동으로 빌드/배포합니다.

## 새 글 쓰는 법 (웹 에디터, `/write`)

배포된 사이트의 `/write` 경로에서 관리자 아이디/비밀번호를 입력하면 제목/태그/마크다운 본문을 작성하는
에디터가 나타납니다 (실시간 미리보기 포함, 회원가입 기능은 없고 단일 관리자 계정만 존재).

- **이미지 첨부**: 에디터의 "이미지 첨부" 버튼으로 파일을 선택하면 `/api/upload-image`가 GitHub API로
  `public/images/uploads/`에 이미지를 커밋하고, 본문 커서 위치에 `![](경로)` 마크다운이 자동 삽입됩니다.
  (png, jpg, gif, webp, svg / 4MB 이하)
- **코드 블록**: 마크다운에 \`\`\` 코드 펜스로 작성하면 실제 글 페이지에서 Shiki로 자동 하이라이팅됩니다.
- **발행**: "발행" 버튼을 누르면 서버(`/api/publish`)가 GitHub API로
  `src/content/posts/YYYY-MM-DD-slug.md` 파일을 생성해 `main` 브랜치에 직접 커밋합니다.

커밋이 푸시되면 Vercel이 자동으로 재배포하므로 잠시 후 블로그에 반영됩니다.

> 발행/이미지 업로드 직후 바로 이동하거나 참조하지만, Vercel 재배포가 끝나기 전까지는 잠깐 404가
> 보일 수 있습니다 (보통 1~2분 이내).

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

이 값들은 **절대 코드에 직접 넣거나 커밋하지 마세요.** 이 레포는 GitHub에서 public이라, 코드에
하드코딩하면 전 세계 누구나 관리자 계정과 토큰을 볼 수 있게 됩니다. 반드시 Vercel 환경변수로만 관리하세요.

**로그인이 계속 401로 실패한다면** Vercel에 등록한 `WRITE_USERNAME`/`WRITE_PASSWORD` 값에 오타나
공백이 없는지, 그리고 값을 추가/수정한 뒤 **재배포(Redeploy)** 를 했는지 확인하세요. Vercel은 환경변수를
바꿔도 기존 배포에는 소급 적용되지 않고, 다음 배포부터 반영됩니다.

### GitHub Personal Access Token 발급 방법

1. GitHub → 우측 상단 프로필 → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. **Generate new token** 클릭
3. **Repository access**: "Only select repositories"를 선택하고 이 블로그 저장소만 선택 (토큰 권한을 최소 범위로 제한)
4. **Permissions → Repository permissions → Contents**: **Read and write**로 설정 (글/이미지 파일을 커밋하는 데 필요한 유일한 권한)
5. 토큰 생성 후 값을 복사해 Vercel의 `GITHUB_TOKEN` 환경변수에 등록

토큰은 클라이언트에 절대 노출되지 않고 서버리스 함수 안에서만 사용됩니다.

## 배포 (Vercel)

1. Vercel 대시보드에서 **Add New → Project**로 이 GitHub 저장소를 연결합니다.
2. Framework Preset은 자동으로 Astro로 인식됩니다 (`vercel.json`에 명시되어 있음).
3. 위 환경변수를 등록한 뒤 배포합니다.
4. 이후 `main` 브랜치에 push(직접 push든 `/write`를 통한 커밋이든)할 때마다 자동으로 재배포됩니다.

## 프로필 / 포트폴리오 수정하기

- `src/data/profile.ts`: 이름, 역할, 소개 문구, 링크(GitHub/이메일 등) 수정
- `src/data/portfolio.ts`: 프로젝트 배열에 `{ title, description, period, tags, link }` 형태로 추가/수정

두 파일 다 일반 TypeScript 파일이라 값만 바꿔서 커밋하면 됩니다.

## 프로젝트 구조

```
src/
  content.config.ts        콘텐츠 컬렉션 스키마 정의
  content/posts/*.md       블로그 글
  data/profile.ts          /about 페이지 데이터
  data/portfolio.ts        /portfolio 페이지 데이터
  layouts/                 BaseLayout, PostLayout
  components/              Header, ThemeToggle, PostCard
  pages/
    index.astro            글 목록
    posts/[slug].astro     글 상세
    tags/index.astro       태그 전체 목록
    tags/[tag].astro       태그별 필터링
    rss.xml.js             RSS 피드
    about.astro            프로필 소개
    portfolio.astro        포트폴리오
    write.astro            글쓰기 웹 UI (관리자 전용)
    api/login.ts           아이디/비밀번호 검증 + 세션 쿠키 발급
    api/publish.ts         GitHub API로 글 파일 커밋
    api/upload-image.ts    GitHub API로 이미지 파일 커밋
  lib/                      auth, github, slugify 헬퍼
```
