/**
 * Runewarden Icon Generator (ESM)
 * SVG → PNG 512×512 → ICO (multi-size Windows) + icon@2x.png (macOS)
 *
 * Usage: node scripts/generate-icons.mjs
 */

import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'assets');
const svgPath   = path.join(assetsDir, 'icon.svg');
const tmpDir    = path.join(assetsDir, '_tmp');

// ── sharp (CJS via require) ────────────────────────────
const require = createRequire(import.meta.url);
const sharp   = require('sharp');

// ── png-to-ico (ESM) ──────────────────────────────────
const pngToIco = (await import('png-to-ico')).default;

async function main() {
  fs.mkdirSync(tmpDir, { recursive: true });

  const svgBuffer = fs.readFileSync(svgPath);

  // ── PNG 512×512 (Linux / Electron default) ──────────
  const png512Path = path.join(assetsDir, 'icon.png');
  await sharp(svgBuffer).resize(512, 512).png().toFile(png512Path);
  console.log('✅ icon.png (512×512)');

  // ── PNG 1024×1024 (macOS Retina) ────────────────────
  const png1024Path = path.join(assetsDir, 'icon@2x.png');
  await sharp(svgBuffer).resize(1024, 1024).png().toFile(png1024Path);
  console.log('✅ icon@2x.png (1024×1024, macOS)');

  // ── ICO: 임시 PNG 파일 여러 크기로 생성 ─────────────
  const icoSizes = [256, 128, 64, 48, 32, 16];
  const tmpPaths = [];
  for (const size of icoSizes) {
    const p = path.join(tmpDir, `icon_${size}.png`);
    await sharp(svgBuffer).resize(size, size).png().toFile(p);
    tmpPaths.push(p);
    process.stdout.write(`  ↳ ${size}px `);
  }
  console.log('');

  // ── png-to-ico: 경로 배열 전달 ─────────────────────
  const icoBuffer = await pngToIco(tmpPaths);
  const icoPath = path.join(assetsDir, 'icon.ico');
  fs.writeFileSync(icoPath, icoBuffer);
  console.log('✅ icon.ico (Windows — 256/128/64/48/32/16px)');

  // ── 임시 파일 정리 ──────────────────────────────────
  fs.rmSync(tmpDir, { recursive: true, force: true });

  // ── 결과 요약 ───────────────────────────────────────
  console.log('\n🎨 생성된 아이콘 파일:');
  const files = ['icon.svg', 'icon.png', 'icon.ico', 'icon@2x.png'];
  for (const f of files) {
    const fp = path.join(assetsDir, f);
    if (fs.existsSync(fp)) {
      const kb = (fs.statSync(fp).size / 1024).toFixed(1);
      console.log(`  ${f.padEnd(16)} ${kb.padStart(7)} KB`);
    }
  }
  console.log('\n✓ 완료! electron-builder 빌드 시 자동으로 사용됩니다.');
}

main().catch(err => {
  console.error('\n❌ 아이콘 생성 실패:', err.message);
  process.exit(1);
});
