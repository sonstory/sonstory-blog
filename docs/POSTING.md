# 글쓰기 가이드

## 새 글 시작하기

```sh
npm run new:post -- --category paper-review --slug my-post-slug
```

기본은 초고 모드다 — `src/content/drafts/<category>/my-post-slug/index.md`가 생성되고, 이 폴더는 git이 추적하지 않는다. `posts/`와 동일하게 카테고리별 하위 폴더로 관리된다. 완성되면 폴더째 `src/content/posts/<category>/`로 옮기고 push한다.

바로 발행 폴더에 만들고 싶다면 `--draft false`를 추가한다.

```sh
npm run new:post -- --category ai-agent --slug my-post-slug --draft false
```

`category`는 `paper-review` / `ai-agent` / `machine-learning` 중 하나. `slug`는 영문 소문자와 하이픈만 허용한다 (예: `attention-is-all-you-need`). 슬러그가 곧 URL이 되므로 (`/paper-review/attention-is-all-you-need`) 한번 발행한 뒤에는 바꾸지 않는 것을 권장한다.

## frontmatter 레퍼런스

`src/content.config.ts`의 zod 스키마가 강제하는 필드다. 필수 필드가 비어 있거나 타입이 틀리면 빌드가 실패한다.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `title` | string | ✅ | 글 제목 |
| `description` | string (최대 160자) | ✅ | 검색 결과 스니펫, OG 설명에 쓰인다. 공백 포함 150자 내외 권장 |
| `pubDate` | date (`YYYY-MM-DD`) | ✅ | 발행일. 목록 정렬 기준 |
| `updatedDate` | date | — | 내용을 크게 수정했을 때만 추가 |
| `category` | `paper-review` \| `ai-agent` \| `machine-learning` | ✅ | 폴더 구조와 일치해야 한다 |
| `tags` | string 배열 | — | `/tags/[tag]` 페이지와 메인 키워드 클라우드에 쓰인다. 기본값 `[]` |
| `heroImage` | 이미지 상대경로 (예: `"./fig1.png"`) | ✅ | 목록 카드(홈·카테고리·태그·전체 글)에 표시되는 썸네일이자 OG 공유 이미지 |
| `draft` | boolean | — | `true`면 `posts/`에 있어도 빌드에서 제외된다. 기본값 `false` |

### heroImage 정하기

두 가지 방법이 있다.

1. **본문에 쓴 이미지 중 하나를 재사용한다.** 가장 쉬운 방법. `heroImage: "./fig1.png"`처럼 이미 글에 넣은 그림/도식을 그대로 대표 이미지로 지정한다. 세 샘플 글이 모두 이 방식이다.
2. **직접 이미지를 만든다.** 사진이 없으면 `npm run gen:thumb -- <포스트 폴더>`로 카테고리 액센트 컬러 기반의 템플릿 썸네일(제목·설명 자동 합성)을 생성할 수 있다. `npm run new:post`로 글을 스캐폴딩하면 이 명령이 자동으로 한 번 실행되어 `thumb.png`가 임시로 만들어진다 — 이후 1번 방식으로 교체하거나, `title`/`description`을 수정한 뒤 같은 명령을 다시 실행해 갱신한다.

**자동으로 재생성되지 않는다.** `title`/`description`을 고친 뒤 템플릿 썸네일을 계속 쓰고 싶다면 `gen:thumb`을 직접 다시 실행해야 한다.

## 마크다운 문법

### 대제목 구분선

`#`(`h1`), `##`(`h2`)에는 구분선이 **자동으로** 붙는다 (`global.css`의 `.prose h1/h2` 규칙). 마크다운에 별도로 `---` 구분선을 넣을 필요 없다.

### 이미지

글과 같은 폴더에 이미지를 두고 상대경로로 참조한다.

```markdown
![대체 텍스트](./fig1.png)
```

빌드 시 자동으로 WebP로 변환·압축되고 `width`/`height`가 부여되어 CLS를 방지한다. 원본 파일 용량이 크더라도 걱정할 필요는 없지만, 커밋 이력에는 원본이 그대로 남으므로 커밋 전에 적당히 압축해두는 것이 좋다.

### 수식 (KaTeX)

```markdown
인라인 수식: $E = mc^2$

디스플레이 수식:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$
```

### 코드 블록

언어를 명시하면 신택스 하이라이팅과 복사 버튼이 자동으로 붙는다.

````markdown
```python
def hello():
    print("world")
```
````

### 표

```markdown
| 컬럼 A | 컬럼 B |
|---|---|
| 값 1 | 값 2 |
```

## 실제 예시가 필요하다면

`src/content/posts/paper-review/attention-is-all-you-need/`, `ai-agent/langgraph-multi-agent-intro/`, `machine-learning/gradient-boosting-basics/` 세 편이 수식·코드·이미지·표를 모두 포함한 실제 예시다. frontmatter와 문법을 그대로 복사해서 쓰면 된다.

## 발행 전 체크리스트

1. `npm run dev`로 로컬에서 렌더링 확인 (수식·이미지·코드블록·표)
2. `description`이 150자 내외인지 확인
3. `pubDate`가 오늘 이후 미래 날짜로 잘못 들어가지 않았는지 확인
4. `draft: false`인지 확인 (기본값이라 필드를 아예 생략해도 됨)
5. `npm run build`가 에러 없이 통과하는지 확인
6. `git add`, `git commit`, `git push` — Cloudflare가 자동으로 재배포한다
