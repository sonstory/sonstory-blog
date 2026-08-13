# 글감 아이디어 / 운영 TODO

## 글감 아이디어

카테고리별로 생각나는 대로 추가한다. 형식은 자유.

### Paper Review

- (예시) BERT: Pre-training of Deep Bidirectional Transformers
- (예시) GPT 계열 논문 비교

### AI Agent

- (예시) LangGraph 체크포인트·재시도 패턴
- (예시) 멀티 에이전트 간 메시지 전달 설계

### Machine Learning

- (예시) 정규화(L1/L2) 비교
- (예시) 교차 검증 전략

## 현재 진행 상황

사이트는 **이미 인터넷에 떠 있다.** 로컬 구현(디자인·콘텐츠 파이프라인·SEO 뼈대·샘플 글 3편·글쓰기 도구)은 완료 상태다.

| 단계 | 상태 |
|---|---|
| 1. GitHub public 저장소 (`sonstory/sonstory-blog`, SSH 원격) | ✅ 완료 |
| 2. Cloudflare Workers 자동 배포 (`sonstory-blog.junyoung5448.workers.dev`) | ✅ 완료 |
| 3. 커스텀 도메인 `sonstory.dev` (Cloudflare Registrar) | 🔄 구매 진행 중 |
| 4~7. 서치콘솔 / 서치어드바이저 / giscus / AdSense | ⬜ 도메인 연결 후 |

**바로 다음에 할 일**: `sonstory.dev` 구매가 끝나면 워커에 커스텀 도메인을 붙이고, 아래 "도메인 연결 마무리" 항목의 세 파일을 교체한다.

절차 상세는 `docs/DEPLOY.md`.

## 운영 TODO

구현 단계에서 의도적으로 미룬 항목들이다. 완료하면 지운다.

- [ ] **도메인 연결 마무리** — `sonstory.dev`를 워커에 연결한 뒤, 아직 `https://sonstory.kr` placeholder로 남아 있는 세 곳을 함께 갱신한다: `src/consts.ts`의 `SITE_URL`, `astro.config.mjs`의 `site`, `public/robots.txt`의 `Sitemap:` 줄
- [ ] **About 페이지 실제 프로필** — `AUTHOR_NAME`(손준영)과 `SOCIAL_LINKS`(GitHub/LinkedIn/Email)는 채워졌다. 남은 건 `src/pages/about.astro`의 placeholder(한 줄 소개, 자기소개 문단, 논문, 경력, 프로젝트)를 실제 내용으로 교체하는 것
- [ ] **giscus 댓글 활성화** — 저장소는 이미 있으므로 Settings → Discussions를 켜고 [giscus.app](https://giscus.app)에서 값을 발급받아 `src/consts.ts`의 `GISCUS_CONFIG`에 입력
- [ ] **AdSense 신청·승인** — 승인 후 `src/consts.ts`의 `ADSENSE_CLIENT_ID`, `ADSENSE_AD_SLOTS`, `public/ads.txt`를 채운다
- [ ] **서치콘솔 / 서치어드바이저 등록** — 소유확인 메타태그를 `src/consts.ts`의 `SITE_VERIFICATION`에 입력
- [ ] **프로필 사진** — `public/`에 실제 사진을 넣고 About 페이지의 이니셜 아바타를 이미지로 교체
- [ ] **본문 중간(mid-content) 광고 슬롯** — 현재 `.md` 파이프라인은 마크다운 본문 중간에 컴포넌트를 끼워 넣을 수 없다. 필요해지면 `.mdx`로 전환해서 `<AdSlot />`을 본문에 직접 삽입하는 방식을 검토한다
- [ ] **뉴스레터** — 수익화가 자리 잡으면 검토 (인터뷰 단계에서는 보류 결정)

## 검토한 기능 아이디어

당장은 넣지 않았지만 필요해지면 꺼내 쓸 것들. ([chan9yu.dev](https://chan9yu.dev) 참고)

- **시리즈(연재)** — 여러 편으로 이어지는 글을 묶고, 글 하단에 "이전 글 / 다음 글 / 시리즈 전체 보기"를 붙이는 구조. 지금은 카테고리(고정 3개) + 태그(자유)만 있다. 논문 리뷰를 여러 편으로 쪼개거나 튜토리얼을 단계별로 쓰게 되면 그때 추가한다
- **읽는 시간 표시** — 본문 글자 수 기반으로 빌드 타임에 계산 가능. 비용이 거의 없다
- **목록 뷰 전환(리스트/그리드 토글)**
- **조회수** — 별도 분석 인프라 필요 (Cloudflare Web Analytics 무료 티어로 가능)
