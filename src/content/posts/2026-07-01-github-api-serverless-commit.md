---
title: 서버리스 함수에서 GitHub API로 커밋 생성하기
date: 2026-07-01
tags: [github, serverless, api]
description: Vercel serverless function에서 Octokit으로 레포에 파일을 직접 커밋하는 방법.
---

## Contents API로 충분하다

Git의 blob/tree/commit 오브젝트를 직접 다룰 필요 없이, GitHub REST API의
Contents API(`PUT /repos/{owner}/{repo}/contents/{path}`) 하나로 파일 생성과 커밋을
동시에 처리할 수 있다. Octokit에서는 `createOrUpdateFileContents` 메서드다.

```ts
await octokit.rest.repos.createOrUpdateFileContents({
  owner,
  repo,
  path: `src/content/posts/${filename}`,
  message: `post: ${title}`,
  content: Buffer.from(markdown).toString('base64'),
  branch,
});
```

## 토큰 관리

- Personal Access Token은 절대 클라이언트로 내려보내지 않고, 서버리스 함수 안에서만 사용한다.
- 최소 권한 원칙에 따라 fine-grained token이면 대상 레포의 Contents: Read and write 권한만 부여한다.

## 정리

- 커밋 하나로 파일을 추가하는 간단한 워크플로우에는 Contents API가 Git Data API보다 훨씬 간단하다.
- 인증은 반드시 서버 사이드에서 검증하고, 실패 시 401을 반환하도록 방어적으로 작성했다.
