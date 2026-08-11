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

## 운영 TODO

구현 단계에서 의도적으로 미룬 항목들이다. 완료하면 지운다.

- [ ] **도메인 확정** — 구매 후 `src/consts.ts`의 `SITE_URL`, `astro.config.mjs`의 `site`, `public/robots.txt`의 `Sitemap:` 줄, 세 곳을 함께 갱신한다 (`docs/DEPLOY.md` 참조)
- [ ] **About 페이지 실제 프로필** — `src/pages/about.astro`의 placeholder(이름, 소개, 논문, 경력, 프로젝트)를 실제 내용으로 교체. `src/consts.ts`의 `AUTHOR_NAME`, `SOCIAL_LINKS`도 함께 채운다
- [ ] **giscus 댓글 활성화** — 저장소 생성 후 [giscus.app](https://giscus.app)에서 값을 발급받아 `src/consts.ts`의 `GISCUS_CONFIG`에 입력
- [ ] **AdSense 신청·승인** — 승인 후 `src/consts.ts`의 `ADSENSE_CLIENT_ID`, `ADSENSE_AD_SLOTS`, `public/ads.txt`를 채운다
- [ ] **서치콘솔 / 서치어드바이저 등록** — 소유확인 메타태그를 `src/consts.ts`의 `SITE_VERIFICATION`에 입력
- [ ] **프로필 사진** — `public/`에 실제 사진을 넣고 About 페이지의 이니셜 아바타를 이미지로 교체
- [ ] **본문 중간(mid-content) 광고 슬롯** — 현재 `.md` 파이프라인은 마크다운 본문 중간에 컴포넌트를 끼워 넣을 수 없다. 필요해지면 `.mdx`로 전환해서 `<AdSlot />`을 본문에 직접 삽입하는 방식을 검토한다
- [ ] **뉴스레터** — 수익화가 자리 잡으면 검토 (인터뷰 단계에서는 보류 결정)
