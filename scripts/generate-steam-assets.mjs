/**
 * Steam 스토어 이미지 생성기
 * SVG → PNG (Steam 규격 5종)
 *
 * Steam 이미지 규격:
 * - Header Capsule : 460×215  (스토어 페이지 상단)
 * - Small Capsule  : 231×87   (검색 결과)
 * - Main Capsule   : 616×353  (추천 영역)
 * - Library Capsule: 600×900  (라이브러리)
 * - Library Hero   : 3840×1240 (라이브러리 히어로, 고해상도)
 *
 * Usage: node scripts/generate-steam-assets.mjs
 */

import { createRequire } from 'module';
import path from 'path';
import fs   from 'fs';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const assetsDir  = path.join(__dirname, '..', 'assets', 'steam');
const require    = createRequire(import.meta.url);
const sharp      = require('sharp');

fs.mkdirSync(assetsDir, { recursive: true });

// ── 헤더 캡슐 SVG 읽기 ──────────────────────────────
const headerSvg = fs.readFileSync(path.join(assetsDir, 'capsule_header.svg'));

// ── 각 규격 생성 ────────────────────────────────────
const sizes = [
  { name: 'header_capsule',  w: 460,  h: 215,  label: 'Header Capsule' },
  { name: 'small_capsule',   w: 231,  h: 87,   label: 'Small Capsule' },
  { name: 'main_capsule',    w: 616,  h: 353,  label: 'Main Capsule' },
  { name: 'library_capsule', w: 600,  h: 900,  label: 'Library Capsule' },
  { name: 'library_hero',    w: 3840, h: 1240, label: 'Library Hero' },
];

console.log('🎨 Steam 스토어 이미지 생성 중...\n');

for (const { name, w, h, label } of sizes) {
  const outPath = path.join(assetsDir, `${name}.png`);

  if (w > 1000 || h > 1000) {
    // 대형 이미지: 헤더 SVG를 확대 후 배경으로 활용
    // 실제로는 별도 디자인이 필요하지만, 일단 scaled version 생성
    const scaled = await sharp(headerSvg)
      .resize(w, h, { fit: 'fill' })
      .png()
      .toBuffer();

    // 다크 오버레이 합성으로 library 느낌 연출
    const overlay = Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="rgba(10,10,24,0.35)"/>
        <text x="${w/2}" y="${h * 0.52}" text-anchor="middle"
              font-family="Georgia,serif" font-size="${Math.round(h*0.16)}"
              font-weight="bold" letter-spacing="${Math.round(h*0.03)}"
              fill="#D4AF37">RUNEWARDEN</text>
        <text x="${w/2}" y="${h * 0.65}" text-anchor="middle"
              font-family="Georgia,serif" font-size="${Math.round(h*0.04)}"
              fill="#B0A060" letter-spacing="${Math.round(h*0.008)}">
          BUILD YOUR DECK · PLACE YOUR TOWERS · SURVIVE
        </text>
      </svg>`
    );

    await sharp(scaled)
      .composite([{ input: overlay, blend: 'over' }])
      .png()
      .toFile(outPath);
  } else {
    await sharp(headerSvg)
      .resize(w, h, { fit: 'fill' })
      .png()
      .toFile(outPath);
  }

  const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
  console.log(`  ✅ ${label.padEnd(20)} ${String(w+'×'+h).padEnd(12)} → ${kb} KB`);
}

console.log('\n✓ Steam 이미지 생성 완료!');
console.log(`📁 위치: ${assetsDir}`);
console.log('\n⚠️  참고: library_capsule(600×900), library_hero(3840×1240)는');
console.log('   실제 출시 전 전문 그래픽 디자이너의 작업이 권장됩니다.');
