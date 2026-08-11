# Sonstory

AI 공부(논문 리뷰 / AI Agent / 머신러닝)를 기록하는 한국어 기술블로그.

## 스택

- [Astro 7](https://astro.build) — 정적 사이트 생성, 콘텐츠 페이지는 JS 0KB
- [Tailwind CSS 4](https://tailwindcss.com) — `@tailwindcss/vite` + `@theme` 토큰
- [Expressive Code](https://expressive-code.com) — 코드 하이라이팅 + 복사 버튼
- [KaTeX](https://katex.org) (`remark-math` + `rehype-katex`) — 수식 렌더링
- [Pagefind](https://pagefind.app) — 사이트 내 정적 검색
- [giscus](https://giscus.app) — GitHub Discussions 기반 댓글
- 호스팅: [Cloudflare Pages](https://pages.cloudflare.com) (무료 티어, 상업적 사용 허용)

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

`category`는 `paper-review` / `ai-agent` / `machine-learning` 중 하나. 자세한 규칙은 [`docs/POSTING.md`](docs/POSTING.md) 참고.

## 프로젝트 구조

```
src/
├── content/
│   ├── posts/<category>/<slug>/index.md   # 발행 글 (이미지 동봉)
│   └── drafts/                            # 초고, git 추적 안 함
├── components/   # Header, Footer, PostCard, TableOfContents, Comments, AdSlot ...
├── layouts/      # BaseLayout, PostLayout
├── pages/        # 라우트
└── styles/global.css   # 디자인 토큰 (@theme)
```

## 문서

- [`docs/POSTING.md`](docs/POSTING.md) — frontmatter 레퍼런스, 문법 예시, 발행 체크리스트
- [`docs/DESIGN.md`](docs/DESIGN.md) — 색상·간격 토큰, 컴포넌트 규칙
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — 배포·도메인·서치콘솔·AdSense 절차
- [`docs/BACKLOG.md`](docs/BACKLOG.md) — 글감 아이디어 / 운영 TODO
