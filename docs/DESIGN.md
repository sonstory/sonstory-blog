# 디자인 토큰 & 컴포넌트 규칙

모든 토큰은 `src/styles/global.css`의 `@theme` 블록에 정의된다. Tailwind 4는 여기 정의한 `--color-*` 등의 커스텀 프로퍼티에서 유틸리티 클래스(`bg-ink`, `text-muted` 등)를 자동 생성하므로, **컴포넌트에서 임의의 hex 값을 직접 쓰지 않는다.**

## 색상

| 토큰 | 값 | 유틸리티 클래스 | 용도 |
|---|---|---|---|
| `--color-bg` | `#ffffff` | `bg-bg` | 기본 배경 |
| `--color-bg-sub` | `#f5f5f5` | `bg-bg-sub` | 카드 서브 배경, 인라인 코드 배경 |
| `--color-ink` | `#111111` | `text-ink` / `bg-ink` / `border-ink` | 본문 텍스트, 보더, 강조 배경 |
| `--color-muted` | `#6b6b6b` | `text-muted` | 보조 텍스트, 메타 정보 |
| `--color-border` | `#111111` | — (CSS 변수로만 참조) | `.hard-card`, prose 오버라이드 등 non-utility 컨텍스트 |

`--color-ink`와 `--color-border`는 값이 같다. 유틸리티 클래스(`border-ink` 등)를 쓸 수 있는 곳에서는 `border-ink`를 쓰고, `global.css` 내부의 순수 CSS 규칙에서만 `var(--color-border)`를 쓴다.

### 카테고리 액센트

| 카테고리 | 토큰 | 값 |
|---|---|---|
| Paper Review | `--color-accent-paper-review` | `#2452b8` (블루) |
| AI Agent | `--color-accent-ai-agent` | `#c2410c` (오렌지) |
| Machine Learning | `--color-accent-machine-learning` | `#15803d` (그린) |

액센트 컬러는 **카테고리를 식별시키는 좁은 면적에만** 쓴다. 페이지 배경이나 본문 텍스트에는 쓰지 않는다 (흑백 기조 유지). 각 카테고리의 메타데이터(`label`, `accent`, `description`)는 `src/consts.ts`의 `CATEGORIES`에서 가져온다 — 색을 바꾸려면 이 파일 한 곳만 수정하면 된다.

허용되는 용법은 세 가지다.

| 위치 | 방식 |
|---|---|
| 카테고리 배지 (`PostCard`, `PostHero`, 홈 카테고리 섹션 제목) | **액센트 배경 + 흰 글씨.** 테두리+색글씨 방식은 쓰지 않는다 |
| 홈 카테고리 박스 상단 띠 | 액센트 배경, 높이 `h-1.5` |
| 템플릿 썸네일 (`scripts/gen-thumbnail.mjs`, 선택적으로만 사용) | 하드 섀도우·배지·장식 아이콘에 사용 |

## 불변 규칙

1. **`border-radius: 0` 전역 고정.** `global.css`에 `* { border-radius: 0 !important; }`로 강제되어 있다. 둥근 모서리를 쓰는 서드파티 컴포넌트(예: Pagefind UI)가 들어오면 이 규칙이 자동으로 덮어쓴다.
2. **라이트 전용.** `prefers-color-scheme: dark` 대응 코드를 추가하지 않는다. 사용자가 전환할 다크모드 토글도 만들지 않는다. **유일한 예외는 코드블록** — Expressive Code를 `themes: ['github-dark']`로 고정해 코드창만 다크로 띄운다 (`useDarkModeMediaQuery: false`이므로 OS 설정과 무관하게 항상 이 테마다).
3. **둥근 그림자·블러 금지.** 카드 강조는 `.hard-card` 클래스(테두리 `3px`, 하드 섀도우 `4px 4px 0 #111`)만 쓴다. `shadow-*` 계열의 Tailwind 기본 블러 그림자 유틸리티는 쓰지 않는다.
4. **대제목 구분선은 CSS로 자동 적용된다.** `.prose h1`, `.prose h2`에 `border-bottom`이 걸려 있어 마크다운 원문에 별도 구분선 문법을 넣지 않아도 된다.
5. **테두리 두께는 `3px`(`border-[3px]`)이 기본.** 카드·포스트 히어로·콘텐츠 박스 등 주요 박스에 쓴다. 태그 칩처럼 작은 요소만 `1px`/`2px`를 쓴다.
6. **배경은 순백 단색.** 장식 패턴을 넣었다가(`/textures/bg-pattern.svg`) 가독성 문제로 뺀 이력이 있다 — 텍스처·그라디언트 등을 다시 시도하지 않는다.

## 타이포그래피

- 폰트: Pretendard Variable, `public/fonts/pretendard/`에 다이나믹 서브셋(woff2, 92개 파일)으로 self-host. 필요한 유니코드 범위만 온디맨드로 로드되어 2MB 풀 변량 폰트를 통째로 받는 것보다 초기 로딩이 가볍다.
- 본문 스타일은 `@tailwindcss/typography`의 `.prose` 클래스 기반. `global.css`에서 `--tw-prose-*` 변수를 브랜드 토큰으로 오버라이드했다.
- **기준 글자 크기는 `html { font-size: 112.5% }`(16px → 18px)로 키워져 있다.** rem 기반인 Tailwind 텍스트 유틸리티 전체가 여기에 비례하므로, 전역 크기를 조정할 일이 생기면 개별 컴포넌트를 고치지 말고 이 값 하나만 바꾼다.

## 컴포넌트

| 컴포넌트 | 역할 |
|---|---|
| `BaseHead.astro` | meta, OG/Twitter 카드, canonical, 사이트 인증 메타태그, AdSense 로더 |
| `Header.astro` | 상단 네비 (Home + 카테고리 3개 + About + 검색), 640px 미만에서 햄버거 메뉴로 전환 |
| `Footer.astro` | 카테고리·사이트 링크, 저작권 |
| `BaseLayout.astro` | Header + `<main>` + Footer 공통 레이아웃 |
| `PostLayout.astro` | 글 상세. `PostHero` + (본문 · TOC)를 감싼 박스 구조 |
| `PostHero.astro` | 글 상단 제목 박스 (카테고리 배지 · 제목 · 설명 · 날짜 · 태그). **썸네일 이미지는 넣지 않는다** (본문 상세는 텍스트 위주 유지) |
| `PostCard.astro` | 목록 카드. `heroImage` 썸네일 + 카테고리 배지 + 제목/설명/날짜/태그. 홈 "카테고리별" 섹션은 이 컴포넌트 대신 제목·날짜만 있는 간단한 리스트를 쓴다 (박스가 좁아 카드가 안 맞는다) |
| `TableOfContents.astro` | 우측 스티키 목차 + 스크롤 위치 하이라이트 (`lg` 이상에서만 표시) |
| `TagList.astro` | 태그 칩 목록 |
| `Comments.astro` | giscus. `GISCUS_CONFIG`가 비면 안내 문구만 렌더 |
| `AdSlot.astro` | 광고 자리. `ADSENSE_CLIENT_ID`가 비면 아무것도 렌더하지 않는다. prop 이름은 `adSlotId` — `slot`은 Astro 예약어라 쓸 수 없다 |
| `JsonLd.astro` | 구조화 데이터. `data` prop으로 객체를 넘긴다 |

## 레이아웃 · 반응형

- 콘텐츠 최대 폭은 **`max-w-6xl`**(헤더·푸터·모든 페이지 공통). 새 페이지를 만들 때도 이 폭을 따른다.
- **홈페이지 섹션 사이에는 구분선을 넣지 않는다.** 세로 padding(`pt-10`/`pb-10` 정도)만으로 구획을 나눈다 — 굵은 가로선으로 나누던 이전 방식은 폐기했다.
- 홈 "카테고리별"은 카테고리 개수에 맞춰 자동으로 줄바꿈되는 3열 그리드(`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)다. 카테고리가 늘어나도 이 그리드만 유지하면 된다.
- Tailwind 기본 브레이크포인트를 그대로 쓴다. 헤더는 `sm`(640px) 기준으로 데스크톱 네비 ↔ 모바일 메뉴 버튼을 전환한다.
