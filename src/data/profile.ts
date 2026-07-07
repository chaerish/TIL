export interface ProfileLink {
  label: string;
  url: string;
}

export const profile = {
  name: 'cy8432',
  role: '개발자',
  bio: '꾸준히 배우고 기록하는 것을 좋아합니다. 이 블로그는 배운 내용과 만든 것들을 정리하는 공간입니다.',
  links: [
    { label: 'GitHub', url: 'https://github.com/chaerish' },
    { label: 'Email', url: 'mailto:example@example.com' },
  ] satisfies ProfileLink[],
};
