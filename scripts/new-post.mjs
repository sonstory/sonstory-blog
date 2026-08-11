#!/usr/bin/env node
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateOne } from './gen-thumbnail.mjs';

const VALID_CATEGORIES = ['paper-review', 'ai-agent', 'machine-learning'];

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const value = argv[i + 1];
      args[key] = value;
      i += 1;
    }
  }
  return args;
}

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { category, slug, draft } = args;

  if (!category || !VALID_CATEGORIES.includes(category)) {
    console.error(`--category는 다음 중 하나여야 합니다: ${VALID_CATEGORIES.join(', ')}`);
    process.exit(1);
  }

  if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    console.error('--slug는 영문 소문자와 하이픈만 사용합니다 (예: my-new-post)');
    process.exit(1);
  }

  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const isDraft = draft !== 'false';
  const baseDir = path.join(isDraft ? 'drafts' : 'posts', category);
  const targetDir = path.join(projectRoot, 'src', 'content', baseDir, slug);

  try {
    await access(targetDir);
    console.error(`이미 존재하는 폴더입니다: ${targetDir}`);
    process.exit(1);
  } catch {
    // 존재하지 않으면 정상 진행
  }

  await mkdir(targetDir, { recursive: true });

  const frontmatter = `---
title: "제목을 입력하세요"
description: "검색 결과 스니펫에 쓰입니다. 공백 포함 150자 내외로 작성하세요."
pubDate: ${todayISODate()}
category: ${category}
tags: []
heroImage: "./thumb.png"
draft: ${isDraft}
---

여기에 본문을 작성하세요.

## 첫 번째 섹션

이미지는 같은 폴더에 두고 상대경로로 참조합니다: \`![설명](./fig1.png)\`

수식은 KaTeX 문법을 씁니다: $E = mc^2$

\`\`\`python
print("코드 블록은 자동으로 복사 버튼이 붙습니다")
\`\`\`
`;

  await writeFile(path.join(targetDir, 'index.md'), frontmatter, 'utf-8');
  await generateOne(targetDir);

  console.log(`생성됨: ${path.relative(projectRoot, targetDir)}/index.md`);
  console.log('제목/설명을 수정한 뒤에는 `npm run gen:thumb -- <폴더 경로>`로 썸네일을 다시 생성하세요.');
  if (isDraft) {
    console.log('초고 폴더(drafts/)는 git에 커밋되지 않습니다. 완성되면 posts/로 옮기세요.');
  }
}

main();
