// node render.js <workers> <outdir> [from] [to]
const { chromium } = require('playwright'); const fs = require('fs');
const N = +process.argv[2] || 4, OUT = process.argv[3], FPS = 30;
const from = +(process.argv[4] || 0), to = +(process.argv[5] || 143);
fs.mkdirSync(OUT, { recursive: true });
const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS);
(async () => {
  const b = await chromium.launch();
  const jobs = [];
  for (let w = 0; w < N; w++) jobs.push((async () => {
    const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
    p.on('pageerror', e => console.log('ERR', e.message));
    await p.goto('file://' + __dirname + '/index.html'); await p.evaluate(() => window.ready);
    for (let f = f0 + w; f < f1; f += N) {
      const fn = `${OUT}/f${String(f).padStart(5, '0')}.jpg`; if (fs.existsSync(fn)) continue;
      const d = await p.evaluate(t => { renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', .93); }, f / FPS);
      fs.writeFileSync(fn, Buffer.from(d.split(',')[1], 'base64'));
      if (f % 300 === 0) console.log('frame', f, new Date().toISOString().slice(11, 19));
    }
  })());
  await Promise.all(jobs); await b.close();
})();
