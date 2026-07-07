export interface PortfolioItem {
  title: string;
  description: string;
  period?: string;
  tags: string[];
  link?: string;
}

export const portfolio: PortfolioItem[] = [
  {
    title: 'TIL Blog',
    description: '이 블로그. Astro로 만든 블랙 앤 화이트 개인 기술 블로그로, 웹 에디터에서 글을 쓰면 GitHub API로 자동 커밋된다.',
    period: '2026',
    tags: ['Astro', 'Vercel', 'GitHub API'],
    link: 'https://github.com/chaerish/TIL',
  },
];
