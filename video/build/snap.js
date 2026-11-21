// usage: node snap.js <expr-to-eval> out.png
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('console', m => console.log('console:', m.text())); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + __dirname + '/index.html'); await p.evaluate(() => window.ready);
  const outs = process.argv.slice(2);
  for (let i = 0; i < outs.length; i += 2) {
    const data = await p.evaluate(e => { eval(e); return document.getElementById('c').toDataURL('image/jpeg', .85); }, outs[i]);
    require('fs').writeFileSync(outs[i + 1], Buffer.from(data.split(',')[1], 'base64'));
  }
  await b.close();
})();
