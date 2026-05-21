/**
 * Runewarden Icon Generator
 * SVG → PNG (512×512, 256×256, 128×128, 64×64, 48×48, 32×32, 16×16)
 *      → ICO (Windows multi-size)
 *      → PNG 512 (Linux / Electron default)
 *
 * Usage: node scripts/generate-icons.js
 */

const path = require('path');
const fs   = require('fs');

const assetsDir = path.join(__dirname, '..', 'assets');
const svgPath   = path.join(assetsDir, 'icon.svg');

async function main() {
  // ── sharp 로드 ──────────────────────────────────────
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('sharp 모듈이 없습니다. npm install --save-dev sharp 실행 후 재시도하세요.');
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(svgPath);

  // ── PNG 512×512 (Linux / 기본 아이콘) ──────────────
  const png512 = path.join(assetsDir, 'icon.png');
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(png512);
  console.log('✅ icon.png (512×512)');

  // ── 멀티 사이즈 PNG 생성 (ICO용) ───────────────────
  const icoSizes = [256, 128, 64, 48, 32, 16];
  const pngBuffers = [];

  for (const size of icoSizes) {
    const buf = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    pngBuffers.push({ size, buf });
    console.log(`  ↳ ${size}×${size} PNG (for ICO)`);
  }

  // ── ICO 생성 (png-to-ico) ──────────────────────────
  let pngToIco;
  try {
    pngToIco = require('png-to-ico');
  } catch (e) {
    console.error('png-to-ico 모듈이 없습니다. npm install --save-dev png-to-ico 실행 후 재시도하세요.');
    process.exit(1);
  }

  const icoPath = path.join(assetsDir, 'icon.ico');
  // png-to-ico API: { imagesToIco } 또는 default export
  const imagesToIco = pngToIco.imagesToIco ?? pngToIco.default ?? pngToIco;
  const icoBuffer = await imagesToIco(pngBuffers.map(p => p.buf));
  fs.writeFileSync(icoPath, icoBuffer);
  console.log('✅ icon.ico (Windows — 256/128/64/48/32/16px)');

  // ── ICNS 생성 (macOS) ──────────────────────────────
  // electron-builder가 macOS에서 PNG를 직접 사용할 수 있으므로
  // PNG 1024를 icns용으로 별도 저장
  const png1024 = path.join(assetsDir, 'icon@2x.png');
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(png1024);
  console.log('✅ icon@2x.png (1024×1024, macOS 참고용)');

  // ── 결과 요약 ──────────────────────────────────────
  console.log('\n🎨 아이콘 생성 완료:');
  const files = ['icon.svg', 'icon.png', 'icon.ico', 'icon@2x.png'];
  for (const f of files) {
    const fp = path.join(assetsDir, f);
    if (fs.existsSync(fp)) {
      const kb = (fs.statSync(fp).size / 1024).toFixed(1);
      console.log(`  ${f.padEnd(16)} ${kb} KB`);
    }
  }
}

main().catch(err => {
  console.error('아이콘 생성 실패:', err.message);
  process.exit(1);
});
