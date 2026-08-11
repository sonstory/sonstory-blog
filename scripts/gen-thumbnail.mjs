#!/usr/bin/env node
// 카테고리 공통 템플릿 + 글마다 다른 제목/설명을 합성해 썸네일(thumb.png)을 생성한다.
// 사용법:
//   node scripts/gen-thumbnail.mjs <포스트 폴더> [<포스트 폴더> ...]
//   node scripts/gen-thumbnail.mjs --all   (posts/ + drafts/ 전체 재생성)
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// src/consts.ts와 동일하게 유지할 것 (카테고리 추가/변경 시 함께 수정)
const CATEGORIES = {
  'paper-review': { label: 'Paper Review', accent: '#2452B8' },
  'ai-agent': { label: 'AI Agent', accent: '#C2410C' },
  'machine-learning': { label: 'Machine Learning', accent: '#15803D' },
};

const WIDTH = 1200;
const HEIGHT = 630;
const SHADOW = 16;
const CARD_W = WIDTH - SHADOW;
const CARD_H = HEIGHT - SHADOW;
const FONT_FAMILY = "'Apple SD Gothic Neo', 'Pretendard', 'Noto Sans KR', sans-serif";

function escapeXml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
}

// 폰트 메트릭 없이 대략적인 글자폭을 추정한다 (한글/전각은 넓게, 영문/숫자는 좁게).
function charWidth(ch, fontSize) {
  const code = ch.codePointAt(0);
  const isWide = code > 0x2e80;
  return isWide ? fontSize * 0.98 : fontSize * 0.56;
}

function measureWidth(str, fontSize) {
  let w = 0;
  for (const ch of str) w += charWidth(ch, fontSize);
  return w;
}

function wrapText(text, fontSize, maxWidth, maxLines) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  const pushWord = (word) => {
    if (measureWidth(word, fontSize) <= maxWidth) {
      if (current) lines.push(current);
      current = word;
      return;
    }
    // 공백 없이도 넘치는 단어는 글자 단위로 쪼갠다.
    if (current) lines.push(current);
    let chunk = '';
    for (const ch of word) {
      if (measureWidth(chunk + ch, fontSize) > maxWidth && chunk) {
        lines.push(chunk);
        chunk = ch;
      } else {
        chunk += ch;
      }
    }
    current = chunk;
  };

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (measureWidth(candidate, fontSize) <= maxWidth) {
      current = candidate;
    } else {
      pushWord(word);
    }
  }
  if (current) lines.push(current);

  if (lines.length > maxLines) {
    const truncated = lines.slice(0, maxLines);
    let last = truncated[maxLines - 1];
    while (last.length > 1 && measureWidth(`${last}…`, fontSize) > maxWidth) {
      last = last.slice(0, -1);
    }
    truncated[maxLines - 1] = `${last}…`;
    return truncated;
  }
  return lines;
}

function buildSvg({ category, title, description }) {
  const { label, accent } = CATEGORIES[category];
  const badgeLabel = label.toUpperCase();
  const badgeFontSize = 22;
  const badgePaddingX = 24;
  const badgeW = measureWidth(badgeLabel, badgeFontSize) * 1.04 + badgePaddingX * 2;
  const badgeH = 48;
  const badgeY = 44;

  const textLeft = 48;
  const textMaxWidth = 680;

  const titleFontSize = 54;
  const titleLineHeight = 66;
  const titleLines = wrapText(title, titleFontSize, textMaxWidth, 2);
  const titleStartY = badgeY + badgeH + 76;

  const descFontSize = 26;
  const descLineHeight = 36;
  const descLines = wrapText(description, descFontSize, textMaxWidth, 2);
  const descStartY = titleStartY + (titleLines.length - 1) * titleLineHeight + 52;

  const titleTspans = titleLines
    .map((line, i) => `<text x="${textLeft}" y="${titleStartY + i * titleLineHeight}" font-family="${FONT_FAMILY}" font-size="${titleFontSize}" font-weight="800" fill="#111111">${escapeXml(line)}</text>`)
    .join('\n    ');

  const descTspans = descLines
    .map((line, i) => `<text x="${textLeft}" y="${descStartY + i * descLineHeight}" font-family="${FONT_FAMILY}" font-size="${descFontSize}" font-weight="400" fill="#6b6b6b">${escapeXml(line)}</text>`)
    .join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff"/>

  <!-- 하드 섀도우 -->
  <rect x="${SHADOW}" y="${SHADOW}" width="${CARD_W}" height="${CARD_H}" fill="${accent}"/>

  <!-- 카드 -->
  <rect x="0" y="0" width="${CARD_W}" height="${CARD_H}" fill="#ffffff" stroke="#111111" stroke-width="6"/>
  <rect x="3" y="3" width="${CARD_W - 6}" height="9" fill="${accent}"/>

  <!-- 장식 아이콘: 노트북 + 코드 브래킷 -->
  <g opacity="0.16" stroke="${accent}" fill="none">
    <g transform="translate(850,150) rotate(-6)">
      <rect x="20" y="0" width="220" height="128" stroke-width="9"/>
      <rect x="0" y="128" width="260" height="18" stroke-width="9"/>
    </g>
    <g transform="translate(900,340) rotate(5)" stroke-linecap="square">
      <path d="M40 8 L0 78 L40 148" stroke-width="11"/>
      <path d="M100 8 L140 78 L100 148" stroke-width="11"/>
      <line x1="80" y1="0" x2="60" y2="156" stroke-width="11"/>
    </g>
  </g>

  <!-- 카테고리 배지 -->
  <rect x="${textLeft}" y="${badgeY}" width="${badgeW}" height="${badgeH}" fill="${accent}"/>
  <text x="${textLeft + badgeW / 2}" y="${badgeY + badgeH / 2 + 8}" text-anchor="middle" font-family="${FONT_FAMILY}" font-size="${badgeFontSize}" font-weight="700" fill="#ffffff">${escapeXml(badgeLabel)}</text>

  <!-- 제목 -->
  ${titleTspans}

  <!-- 설명 -->
  ${descTspans}

  <!-- 워드마크 -->
  <line x1="${textLeft}" y1="546" x2="${textLeft + 92}" y2="546" stroke="#111111" stroke-width="3"/>
  <text x="${textLeft}" y="580" font-family="${FONT_FAMILY}" font-size="24" font-weight="700" fill="#6b6b6b">Sonstory</text>
</svg>`;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error('frontmatter를 찾을 수 없습니다.');
  const data = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    let [, key, value] = m;
    value = value.trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    data[key] = value;
  }
  return data;
}

async function generateOne(postDir) {
  const mdPath = path.join(postDir, 'index.md');
  const content = await readFile(mdPath, 'utf-8');
  const { title, description, category } = parseFrontmatter(content);

  if (!title || !description || !category || !CATEGORIES[category]) {
    console.error(`건너뜀 (title/description/category 확인 필요): ${mdPath}`);
    return;
  }

  const svg = buildSvg({ category, title, description });
  const outPath = path.join(postDir, 'thumb.png');
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`생성됨: ${path.relative(process.cwd(), outPath)}`);
}

async function findPostDirs(root) {
  const dirs = [];
  for (const base of ['src/content/posts', 'src/content/drafts']) {
    const baseDir = path.join(root, base);
    let categories;
    try {
      categories = await readdir(baseDir);
    } catch {
      continue;
    }
    for (const category of categories) {
      const categoryDir = path.join(baseDir, category);
      if (!(await stat(categoryDir)).isDirectory()) continue;
      for (const slug of await readdir(categoryDir)) {
        const postDir = path.join(categoryDir, slug);
        if ((await stat(postDir)).isDirectory()) dirs.push(postDir);
      }
    }
  }
  return dirs;
}

async function main() {
  const args = process.argv.slice(2);
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

  let targets;
  if (args.includes('--all')) {
    targets = await findPostDirs(projectRoot);
  } else if (args.length > 0) {
    targets = args.map((p) => path.resolve(projectRoot, p));
  } else {
    console.error('사용법: node scripts/gen-thumbnail.mjs <포스트 폴더> [...] 또는 --all');
    process.exit(1);
  }

  for (const dir of targets) {
    await generateOne(dir);
  }
}

export { generateOne };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
