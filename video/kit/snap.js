// node kit/snap.js <episodeDir> "<js to eval>" out.jpg ["<js>" out2.jpg …]
// e.g. node kit/snap.js episodes/ep01-mahmoud-furniture "renderAt(61.5)" /tmp/f.jpg
//      node kit/snap.js episodes/ep01-mahmoud-furniture "drawSheet()" sheet.jpg
const { chromium } = require('playwright'); const path = require('path'); const { buildPage } = require('./page');
(async () => {
  const page = buildPage(path.resolve(process.argv[2]));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('console', m => console.log('console:', m.text())); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + page); await p.evaluate(() => window.ready);
  const outs = process.argv.slice(3);
  for (let i = 0; i < outs.length; i += 2) {
    const data = await p.evaluate(e => { eval(e); return document.getElementById('c').toDataURL('image/jpeg', .85); }, outs[i]);
    require('fs').writeFileSync(outs[i + 1], Buffer.from(data.split(',')[1], 'base64'));
  }
  await b.close();
})();
