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

액센트 컬러는 **배지·보더 등 최소한의 강조에만** 쓴다. 배경 전체를 채우거나 본문 텍스트에 쓰지 않는다 (라이트 전용 흑백 기조 유지). 각 카테고리의 메타데이터(`label`, `accent`, `description`)는 `src/consts.ts`의 `CATEGORIES`에서 가져온다 — 색을 바꾸려면 이 파일 한 곳만 수정하면 된다.

## 불변 규칙

1. **`border-radius: 0` 전역 고정.** `global.css`에 `* { border-radius: 0 !important; }`로 강제되어 있다. 둥근 모서리를 쓰는 서드파티 컴포넌트(예: Pagefind UI)가 들어오면 이 규칙이 자동으로 덮어쓴다.
2. **라이트 전용.** `prefers-color-scheme: dark` 대응 코드를 추가하지 않는다. Expressive Code도 `useDarkModeMediaQuery: false`로 고정했다 (`astro.config.mjs`).
3. **둥근 그림자·블러 금지.** 카드 강조는 `.hard-card` 클래스(하드 섀도우 `4px 4px 0 #111`)만 쓴다. `shadow-*` 계열의 Tailwind 기본 블러 그림자 유틸리티는 쓰지 않는다.
4. **대제목 구분선은 CSS로 자동 적용된다.** `.prose h1`, `.prose h2`에 `border-bottom`이 걸려 있어 마크다운 원문에 별도 구분선 문법을 넣지 않아도 된다.

## 타이포그래피

- 폰트: Pretendard Variable, `public/fonts/pretendard/`에 다이나믹 서브셋(woff2, 92개 파일)으로 self-host. 필요한 유니코드 범위만 온디맨드로 로드되어 2MB 풀 변량 폰트를 통째로 받는 것보다 초기 로딩이 가볍다.
- 본문 스타일은 `@tailwindcss/typography`의 `.prose` 클래스 기반. `global.css`에서 `--tw-prose-*` 변수를 브랜드 토큰으로 오버라이드했다.

## 컴포넌트

| 컴포넌트 | 역할 |
|---|---|
| `BaseHead.astro` | meta, OG/Twitter 카드, canonical, 사이트 인증 메타태그 |
| `Header.astro` | 상단 네비 (카테고리 3개 + About + 검색), 640px 미만에서 햄버거 메뉴로 전환 |
| `Footer.astro` | 카테고리·사이트 링크, 저작권 |
| `BaseLayout.astro` | Header + `<main>` + Footer 공통 레이아웃 |

## 반응형 기준

Tailwind 기본 브레이크포인트를 그대로 쓴다. 헤더는 `sm`(640px) 기준으로 데스크톱 네비 ↔ 모바일 메뉴 버튼을 전환한다.
