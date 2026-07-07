export interface ProfileLink {
  label: string;
  url: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export const profile = {
  name: '김채연',
  role: 'Backend / Server Developer',
  bio: '문제의 표면보다 구조적 원인을 먼저 파고드는 백엔드 개발자입니다. "동작하는 코드"와 "실패 상황에서도 데이터가 일관되게 유지되는 시스템"은 다르다는 생각으로, 트랜잭션 경계와 실패 지점을 먼저 고민하며 안정적인 백엔드 서비스를 만듭니다.',
  links: [
    { label: 'GitHub', url: 'https://github.com/chaerish' },
    { label: 'Tistory', url: 'https://vecherish.tistory.com' },
    { label: 'Email', url: 'mailto:ccyy8432@naver.com' },
  ] satisfies ProfileLink[],
  skills: [
    {
      category: 'Language / Framework',
      items: ['Java', 'Spring Boot', 'Spring MVC', 'Spring WebFlux', 'JPA/Hibernate', 'MyBatis'],
    },
    {
      category: 'Database / Cache',
      items: ['Oracle', 'MySQL', 'MariaDB', 'PostgreSQL', 'MongoDB', 'Redis'],
    },
    {
      category: 'Infra / DevOps',
      items: ['Kubernetes (EKS)', 'ArgoCD', 'Jenkins', 'Docker', 'AWS EC2/S3/RDS', 'Nginx'],
    },
    {
      category: '기타',
      items: ['Quartz Scheduler', 'LangChain', 'Linux (Ubuntu)', 'Git'],
    },
  ] satisfies SkillGroup[],
};
