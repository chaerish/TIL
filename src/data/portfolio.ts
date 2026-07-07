export interface PortfolioItem {
  title: string;
  description: string;
  period?: string;
  tags: string[];
  link?: string;
}

export const portfolio: PortfolioItem[] = [
  {
    title: '카카오뱅크 백엔드 인턴 — IFLEX 시스템 배치 성능 개선',
    description:
      '외부 금융기관 채권·금융상품 시장가 데이터 배치의 성능 병목을 코드 흐름 추적으로 진단. 반복 SELECT 조회를 사전 캐싱으로, 건 단위 INSERT를 1,000건 단위 Bulk INSERT로 전환하고 전체를 단일 트랜잭션으로 묶어 정합성을 보장했다. 배치 처리 시간 30분 → 9초(99.5% 단축), 상품별 하드코딩 로직을 DB 설정 기반 구조로 전환해 신규 상품 연동 기간을 2~3주에서 수분으로 단축했다.',
    period: '2026.01 - 2026.03',
    tags: ['Java', 'Spring Boot', 'Quartz', 'Oracle', 'MyBatis', 'React'],
  },
  {
    title: 'FitPass — 헬스장 일회용 패스 코인 결제 플랫폼',
    description:
      '외부 결제 API 호출과 내부 데이터 반영을 Spring Event(옵저버 패턴) 기반으로 분리해, 코인 지급·결제내역 저장·연관관계 반영을 단일 트랜잭션으로 재설계. 결제 승인 후 일부 데이터만 저장되던 정합성 오류를 제거해 구매내역 조회 500 오류를 해결했고, Redis TTL 기반 TID 캐싱으로 중복 결제를 방지했다. 백엔드 팀장으로 5명을 리드했으며 UMC 7기 Demoday에서 수상했다.',
    period: '2025.01 - 2025.05',
    tags: ['Spring Boot', 'JPA', 'Redis', 'Spring Event', 'Docker', 'AWS EC2'],
  },
];
