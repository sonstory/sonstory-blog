export const SITE_TITLE = 'Sonstory';
export const SITE_DESCRIPTION = '퇴근 후 AI를 공부하며 저만의 언어로 정리합니다.';

/**
 * 도메인 확정 전까지의 placeholder. 실제 도메인을 구매하면 이 값과
 * astro.config.mjs의 `site` 필드를 함께 갱신한다. (docs/DEPLOY.md 참조)
 */
export const SITE_URL = 'https://sonstory.kr';

export type CategorySlug = 'paper-review' | 'ai-agent' | 'machine-learning';

export interface Category {
  slug: CategorySlug;
  label: string;
  description: string;
  /** 배지·보더 등 최소한의 강조에만 쓰는 액센트 컬러 */
  accent: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'paper-review',
    label: 'Paper Review',
    description: 'AI 관련 논문 리뷰 및 코드 구현',
    accent: '#2452B8',
  },
  {
    slug: 'ai-agent',
    label: 'AI Agent',
    description: 'LangGraph 기반 AI Agent 프로젝트',
    accent: '#C2410C',
  },
  {
    slug: 'machine-learning',
    label: 'Machine Learning',
    description: '머신러닝 개념 공부 및 관련 프로젝트',
    accent: '#15803D',
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** About 페이지 및 글 작성자 표기(JSON-LD)에 함께 쓰인다. */
export const AUTHOR_NAME = '이름을 입력하세요';

/** About 페이지 소셜 링크. 6단계(About 페이지)에서 실제 값으로 채운다. */
export const SOCIAL_LINKS = {
  github: '',
  linkedin: '',
  email: '',
};

/** giscus 댓글 설정. 9단계(배포)에서 저장소 생성 후 https://giscus.app 에서 발급받아 채운다. */
export const GISCUS_CONFIG = {
  repo: '',
  repoId: '',
  category: 'Comments',
  categoryId: '',
};

/** AdSense 승인 후 채운다. 빈 문자열이면 AdSlot이 아무것도 렌더링하지 않는다. */
export const ADSENSE_CLIENT_ID = '';

/**
 * AdSense 대시보드에서 광고 단위를 만든 뒤 슬롯 ID를 채운다.
 * 글 본문 중간 삽입은 현재 .md 파이프라인에서 지원하지 않는다 — 마크다운 안에
 * 컴포넌트를 끼워 넣으려면 .mdx 전환이 필요하다 (docs/BACKLOG.md 참조).
 */
export const ADSENSE_AD_SLOTS = {
  postTop: '',
  postBottom: '',
};

/** 구글 서치콘솔 / 네이버 서치어드바이저 소유확인. 9단계에서 채운다. */
export const SITE_VERIFICATION = {
  google: '',
  naver: '',
};
