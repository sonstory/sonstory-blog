# 배포 절차

이 문서는 로컬 개발까지 끝난 뒤, 실제로 사이트를 인터넷에 올리는 9단계(계정 생성·도메인 구매 등 직접 해야 하는 작업)를 다룬다. 몇 달에 한 번만 하는 작업이라 그때 가서 기억나지 않는 부분이 많다 — 실제로 진행하면서 이 문서에 절차를 채워 넣는다.

## 1. GitHub 저장소 생성

- **public** 저장소로 생성한다 (이유: `docs/DESIGN.md` 옆 저장소 전략 참고 — 개발자 포트폴리오 겸용, 초고는 `src/content/drafts/`가 gitignore로 보호하므로 public이어도 안전)
- 로컬 저장소를 이 원격에 연결하고 push

```sh
git remote add origin <저장소 URL>
git push -u origin main
```

## 2. Cloudflare Pages 연결

- Vercel이 아닌 **Cloudflare Pages**를 쓰는 이유: Vercel Hobby(무료) 플랜은 AdSense 게재를 상업적 사용으로 분류해 금지한다. Cloudflare Pages 무료 티어는 상업적 사용을 허용하고 대역폭도 무제한이다
- Cloudflare 대시보드 → Workers & Pages → Create → Pages → GitHub 연결 → 이 저장소 선택
- 빌드 설정
  - Build command: `npm run build`
  - Build output directory: `dist`
- 첫 배포 후 `*.pages.dev` 임시 URL로 정상 동작 확인

## 3. 커스텀 도메인 연결

- 도메인 구매처(가비아, Cloudflare Registrar 등)에서 도메인 구매
- Cloudflare Pages 프로젝트 → Custom domains → 도메인 추가 → 안내에 따라 DNS 레코드 설정
- 도메인이 확정되면 **다음 세 곳을 함께 갱신**해야 한다 (하나라도 빠지면 sitemap·OG·canonical URL이 어긋난다)
  1. `src/consts.ts`의 `SITE_URL`
  2. `astro.config.mjs`의 `site`
  3. `public/robots.txt`의 `Sitemap:` 줄

## 4. 구글 서치콘솔

- [Google Search Console](https://search.google.com/search-console)에서 속성 추가 (도메인 전체 권장)
- 소유확인: HTML 메타태그 방식 선택 → 발급된 값을 `src/consts.ts`의 `SITE_VERIFICATION.google`에 입력 → 재배포 후 확인
- 확인 완료 후 사이트맵 제출: `https://<도메인>/sitemap-index.xml`

## 5. 네이버 서치어드바이저

- [네이버 서치어드바이저](https://searchadvisor.naver.com)에서 사이트 등록
- 소유확인: HTML 메타태그 방식 → 발급된 값을 `src/consts.ts`의 `SITE_VERIFICATION.naver`에 입력 → 재배포 후 확인
- `robots.txt`에 이미 `Yeti`/`NaverBot`을 허용해뒀으므로 별도 조치 불필요
- 사이트맵 제출

## 6. giscus 댓글 활성화

- 이 저장소(1단계에서 만든 public 저장소)의 **Settings → General → Features → Discussions**를 켠다
- [giscus.app](https://giscus.app)에서 저장소 주소를 입력하고 안내에 따라 giscus 앱을 설치
- 발급된 `repo`, `repo-id`, `category`, `category-id` 값을 `src/consts.ts`의 `GISCUS_CONFIG`에 입력 → 재배포

## 7. Google AdSense 신청

- 신청 전 확인: 개인정보처리방침 페이지(`/privacy`) 존재 ✅, 실제 콘텐츠 여러 편 발행 여부 확인 (승인 심사에서 콘텐츠 양·품질을 본다)
- [Google AdSense](https://www.google.com/adsense)에서 사이트 추가 및 심사 신청
- 승인 후
  1. `public/ads.txt`에 발급된 한 줄을 채운다
  2. `src/consts.ts`의 `ADSENSE_CLIENT_ID`를 채운다
  3. AdSense 대시보드에서 광고 단위(슬롯)를 만들고 `src/consts.ts`의 `ADSENSE_AD_SLOTS.postTop` / `postBottom`을 채운다
- 재배포 후 실제 광고가 레이아웃 시프트 없이 노출되는지 확인

## 8. 최종 점검

- [PageSpeed Insights](https://pagespeed.web.dev)로 모바일 점수 확인 (목표 90+)
- [리치 결과 테스트](https://search.google.com/test/rich-results)로 JSON-LD(BlogPosting, BreadcrumbList, Person) 정상 인식 확인
- 대표 URL 몇 개를 직접 방문해 이미지·수식·코드 복사 버튼·댓글이 실제 도메인에서도 동작하는지 확인
