# Sonstory

AI 공부를 기록하는 한국어 기술블로그. Astro 7 + Tailwind 4 정적 사이트.

## 명령어

```
npm run dev              # 개발 서버 (astro dev --background 권장)
npm run build             # 프로덕션 빌드 (Pagefind 인덱싱 포함)
npm run preview           # 빌드 결과 미리보기
npm run new:post -- --category paper-review --slug my-post   # 새 글 스캐폴딩
npm run gen:thumb -- --all   # 썸네일(thumb.png) 일괄 재생성
```

개발 서버는 백그라운드로 띄우고 `astro dev stop` / `astro dev status` / `astro dev logs`로 관리한다.

`dev`/`build`는 `predev`/`prebuild` 훅으로 `gen-thumbnail.mjs --all`을 먼저 돌린다. 즉 **모든 글의 `thumb.png`는 실행할 때마다 frontmatter 기준으로 재생성된다** — 손으로 만들지 않으며, 빌드 후 `git status`에 뜨는 `thumb.png` 변경은 정상이다. `npx astro dev`로 우회 실행하면 훅이 돌지 않으니 그때만 `gen:thumb`을 직접 쓴다.

브라우저에 옛 이미지가 계속 보이면 `node_modules/.astro/assets`(이미지 변환 캐시)를 지우고 서버를 재시작한다.

## 글 작성 규칙

- 발행 글: `src/content/posts/<category>/<slug>/index.md` (`category`는 `paper-review` / `ai-agent` / `machine-learning`, `slug`는 영문 소문자-하이픈)
- 이미지는 글과 같은 폴더에 두고 `./fig1.png` 상대경로로 참조
- **초고는 `src/content/drafts/<category>/<slug>/`에 쓴다** (gitignore, 로컬 전용, posts와 동일하게 카테고리별 하위 폴더). 완성되면 `posts/<category>/`로 폴더째 옮긴다. **drafts 안의 파일을 절대 커밋하지 않는다**
- frontmatter 필수 필드와 문법 예시는 `docs/POSTING.md` 참조. `description`은 검색 스니펫에 쓰이므로 공백 포함 150자 내외로 작성
- `heroImage: "./thumb.png"`는 필수지만 **OG 공유 이미지 전용**이다 (페이지 어디에도 표시하지 않는다). 파일은 위 훅이 자동 생성하므로 직접 만들지 않는다

## 디자인 불변 규칙

- `border-radius: 0` 고정 (각진 박스), 라이트 전용(다크모드 대응 코드 추가 금지). **단 코드블록만 예외로 다크 테마**(`github-dark`)를 쓴다
- 색상은 `src/styles/global.css`의 `@theme` 토큰만 사용
- 둥근 그림자·블러 금지 — 카드 강조는 하드 섀도우(`4px 4px 0 #111`)만 사용
- 카테고리 배지는 **액센트 배경 + 흰 글씨**로 통일한다 (테두리+색글씨 방식으로 되돌리지 말 것)
- 콘텐츠 영역 폭은 `max-w-6xl`, 섹션 구분선도 이 폭 안에 그린다 (화면 끝까지 잇지 않는다)
- 상세 토큰표는 `docs/DESIGN.md` 참조

## 배포

- GitHub `sonstory/sonstory-blog` (public) → push하면 Cloudflare가 자동 빌드·배포한다
- **원격은 SSH를 쓴다** (`git@github.com:...`). 이 환경에서 HTTPS push는 인증 후 응답이 끊겨 실패한다 — HTTPS로 되돌리지 말 것
- 호스팅은 Cloudflare **Workers 정적 자산** 방식이다 (Pages 아님). 루트의 `wrangler.jsonc`가 `./dist`를 배포 대상으로 지정하며, Cloudflare가 `npm run build` → `npx wrangler deploy`를 실행한다
- 진행 상황과 남은 운영 작업은 `docs/BACKLOG.md`, 절차는 `docs/DEPLOY.md`

## 건드리지 말 것

- `src/consts.ts`의 `SITE_URL`, `astro.config.mjs`의 `site`, `robots.txt`의 `Sitemap:` — 지금은 `sonstory.kr` placeholder다. `sonstory.dev` 연결이 끝나는 시점에 **세 곳을 한꺼번에** 바꾼다 (하나만 고치면 sitemap·OG·canonical이 어긋난다)
- `public/ads.txt` (AdSense 승인 후에만 수정)
- `src/consts.ts`의 `GISCUS_CONFIG` / `ADSENSE_*` / `SITE_VERIFICATION` — 빈 값이면 해당 기능이 자동으로 렌더링을 건너뛴다. 운영 단계(`docs/BACKLOG.md`)에서 실제 값이 발급된 뒤에만 채운다

## 재사용할 것

- 글 목록 조회·정렬·태그 집계: `src/lib/posts.ts` (`getPublishedPosts`, `getPostsByCategory`, `getPostsByTag`, `getTagCounts`). 새 페이지에서 직접 `getCollection`을 다시 짜지 않는다
- 구조화 데이터(JSON-LD): `src/components/JsonLd.astro`에 `data` prop으로 넘긴다

## 문서 맵

- 글쓰기 전체 가이드: `docs/POSTING.md`
- 배포·도메인·서치콘솔·AdSense 절차: `docs/DEPLOY.md`
- 디자인 토큰표: `docs/DESIGN.md`
- 글감 아이디어 / 운영 TODO: `docs/BACKLOG.md`

## Astro 7 유의사항

- **기본 마크다운 파이프라인이 remark/rehype이 아니다.** Astro 7 기본값은 자체 Rust 프로세서 `@astrojs/markdown-satteri`다. KaTeX(remark-math/rehype-katex) 같은 remark/rehype 플러그인을 쓰려면 `astro.config.mjs`의 `markdown.processor`를 `@astrojs/markdown-remark`의 `unified({ remarkPlugins, rehypePlugins })`로 명시 전환해야 한다 (이미 설정 완료). `markdown.remarkPlugins`를 최상위에 직접 쓰면 deprecated 경고와 함께 무시된다.
- Content Collections는 `src/content.config.ts` + `glob()` 로더 사용 (legacy 자동 인식 아님)
- Rust 컴파일러 기본 — HTML 태그를 반드시 닫을 것
- Tailwind 4는 `@tailwindcss/vite` 플러그인 + CSS `@theme` 블록으로 설정 (`tailwind.config.js` 없음)

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
