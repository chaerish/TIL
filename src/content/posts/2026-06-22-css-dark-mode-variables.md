---
title: CSS 변수만으로 다크모드 토글 구현하기
date: 2026-06-22
tags: [css, design]
description: JS 프레임워크 없이 CSS 커스텀 프로퍼티와 data 속성으로 다크모드를 구현한 기록.
---

## 핵심 아이디어

`:root`에 라이트 모드 색상을 정의하고, `:root[data-theme="dark"]`에서 값을 덮어쓴다.
버튼 클릭 시 `document.documentElement`의 `data-theme` 속성만 토글하면 된다.

```css
:root {
  --bg: #ffffff;
  --fg: #111111;
}

:root[data-theme='dark'] {
  --bg: #111111;
  --fg: #f5f5f5;
}

body {
  background: var(--bg);
  color: var(--fg);
}
```

## 시스템 설정 존중하기

사용자가 아직 토글을 누르지 않았다면 `prefers-color-scheme` 미디어 쿼리로 시스템 설정을 따르고,
토글을 누른 이후에는 `localStorage`에 선택을 저장해서 다음 방문에도 유지되게 했다.

## 정리

- 별도 상태 관리 라이브러리 없이 속성 하나로 테마 전환이 가능하다.
- 초기 로딩 시 깜빡임(FOUC)을 막으려면 테마 결정 스크립트를 `<head>`에서 최대한 빨리 실행해야 한다.
