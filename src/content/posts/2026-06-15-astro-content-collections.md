---
title: Astro Content Collections로 블로그 콘텐츠 관리하기
date: 2026-06-15
tags: [astro, blog]
description: 마크다운 파일만으로 타입 안전한 블로그 콘텐츠를 관리하는 방법을 정리했다.
---

## 왜 Content Collections인가

Astro의 Content Collections는 `src/content/` 아래에 마크다운(또는 MDX) 파일을 두고,
`zod` 스키마로 프론트매터를 검증해주는 기능이다. 블로그처럼 구조화된 글 목록을 다룰 때
파일 시스템 기반 라우팅보다 훨씬 다루기 쉽다.

```ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
```

## 정리

- 프론트매터 오타를 빌드 타임에 잡아준다.
- `getCollection('posts')`로 전체 글 목록을 가져와 날짜순 정렬, 태그 필터링을 쉽게 구현할 수 있다.
- 새 글은 마크다운 파일 하나만 추가하면 끝이라 커밋 기반 글쓰기 워크플로우와 잘 맞는다.
