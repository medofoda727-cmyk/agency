// node kit/render.js <episodeDir> [workers=4] [from=0] [to=DUR]  → <episodeDir>/frames/f00000.jpg …
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const { buildPage } = require('./page');
const EP = path.resolve(process.argv[2] || '.'), N = +process.argv[3] || 4, FPS = 30, OUT = path.join(EP, 'frames');
(async () => {
  const page = buildPage(EP); fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const probe = await b.newPage(); await probe.goto('file://' + page); await probe.evaluate(() => window.ready);
  const dur = await probe.evaluate(() => DUR); await probe.close();
  const from = +(process.argv[4] || 0), to = +(process.argv[5] || dur);
  const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS);
  await Promise.all(Array.from({ length: N }, async (_, w) => {
    const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
    p.on('pageerror', e => console.log('ERR', e.message));
    await p.goto('file://' + page); await p.evaluate(() => window.ready);
    for (let f = f0 + w; f < f1; f += N) {
      const fn = `${OUT}/f${String(f).padStart(5, '0')}.jpg`; if (fs.existsSync(fn)) continue;
      const d = await p.evaluate(t => { renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', .93); }, f / FPS);
      fs.writeFileSync(fn, Buffer.from(d.split(',')[1], 'base64'));
      if (f % 300 === 0) console.log('frame', f);
    }
  }));
  await b.close();
})();
