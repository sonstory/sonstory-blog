# Sonstory

AI 공부(논문 리뷰 / AI Agent / 머신러닝)를 기록하는 한국어 기술블로그.

## 스택

- [Astro 7](https://astro.build) — 정적 사이트 생성, 콘텐츠 페이지는 JS 0KB
- [Tailwind CSS 4](https://tailwindcss.com) — `@tailwindcss/vite` + `@theme` 토큰
- [Expressive Code](https://expressive-code.com) — 코드 하이라이팅 + 복사 버튼
- [KaTeX](https://katex.org) (`remark-math` + `rehype-katex`) — 수식 렌더링
- [Pagefind](https://pagefind.app) — 사이트 내 정적 검색
- [giscus](https://giscus.app) — GitHub Discussions 기반 댓글
- 호스팅: [Cloudflare Workers 정적 자산](https://developers.cloudflare.com/workers/static-assets/) (무료 티어, 상업적 사용 허용). `main`에 push하면 자동 빌드·배포된다

## 로컬 실행

```sh
npm install
npm run dev       # http://localhost:4321
```

```sh
npm run build      # ./dist/ 로 프로덕션 빌드 (Pagefind 인덱싱 포함)
npm run preview    # 빌드 결과 미리보기
```

## 글 작성

```sh
npm run new:post -- --category paper-review --slug my-post-slug
```

`category`는 `paper-review` / `ai-agent` / `machine-learning` 중 하나. 초고는 `src/content/drafts/`에 만들어지며 git이 추적하지 않는다 — 완성되면 `src/content/posts/`로 옮겨 push하면 자동 배포된다. 자세한 규칙은 [`docs/POSTING.md`](docs/POSTING.md) 참고.

## 프로젝트 구조

```
├── wrangler.jsonc    # Cloudflare Workers 배포 설정 (./dist를 정적 자산으로)
├── scripts/
│   ├── new-post.mjs        # 새 글 스캐폴딩
│   └── gen-thumbnail.mjs   # frontmatter로 OG 썸네일 자동 생성 (pre-dev/build 훅)
└── src/
    ├── content/
    │   ├── posts/<category>/<slug>/index.md   # 발행 글 (이미지 동봉)
    │   └── drafts/                            # 초고, git 추적 안 함
    ├── components/   # Header, Footer, PostCard, PostHero, TableOfContents, Comments, AdSlot ...
    ├── layouts/      # BaseLayout, PostLayout
    ├── lib/posts.ts  # 글 조회·정렬·태그 집계 (재사용)
    ├── pages/        # 홈, /posts(전체 글), /[category], /[category]/[slug], /tags/[tag], about, privacy, search, rss.xml
    └── styles/global.css   # 디자인 토큰 (@theme)
```

## 문서

- [`docs/POSTING.md`](docs/POSTING.md) — frontmatter 레퍼런스, 문법 예시, 발행 체크리스트
- [`docs/DESIGN.md`](docs/DESIGN.md) — 색상·간격 토큰, 컴포넌트 규칙
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — 배포·도메인·서치콘솔·AdSense 절차
- [`docs/BACKLOG.md`](docs/BACKLOG.md) — 글감 아이디어 / 운영 TODO
