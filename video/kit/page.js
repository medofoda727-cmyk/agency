// Builds the render page for an episode: kit scripts + fonts + the episode's own files.
// Episode files loaded in order: episode.js, then scenes_*.js (alphabetical).
const fs = require('fs'), path = require('path');
const KIT = __dirname;
function buildPage(epDir) {
  epDir = path.resolve(epDir);
  const rel = p => path.relative(epDir, path.join(KIT, p)).split(path.sep).join('/');
  const F = rel('node_modules/@fontsource');
  const AR = 'unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200E,U+060C,U+061B,U+061F,U+0640,U+066A-066D';
  const LA = 'unicode-range:U+0000-00FF,U+2000-206F,U+20AC';
  const face = (fam, w, file, range = '') => `@font-face{font-family:"${fam}";font-weight:${w};src:url(${F}/${file}) format("woff2");${range}}`;
  const fonts = [400, 600, 800, 900].flatMap(w => [face('Alexandria', w, `alexandria/files/alexandria-arabic-${w}-normal.woff2`, AR), face('Alexandria', w, `alexandria/files/alexandria-latin-${w}-normal.woff2`, LA)])
    .concat([face('Ruqaa', 700, 'aref-ruqaa/files/aref-ruqaa-arabic-700-normal.woff2'), face('Inter Tight', 500, 'inter-tight/files/inter-tight-latin-500-normal.woff2'),
      face('Inter Tight', 800, 'inter-tight/files/inter-tight-latin-800-normal.woff2'), face('Inter Tight', 900, 'inter-tight/files/inter-tight-latin-900-normal.woff2'),
      face('Caveat', 700, 'caveat/files/caveat-latin-700-normal.woff2')]).join('\n');
  const kitJs = ['logos.js', 'lib.js', 'character.js', 'props.js', 'core.js', 'fx.js', 'sheet.js'].map(rel);
  const epJs = fs.existsSync(path.join(epDir, 'episode.js')) ? ['episode.js'] : [];
  epJs.push(...fs.readdirSync(epDir).filter(f => /^scenes_.*\.js$/.test(f)).sort());
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>\n${fonts}\nhtml,body{margin:0;background:#000}canvas{display:block}\n</style></head><body>
<canvas id="c" width="1080" height="1920"></canvas>
${kitJs.concat(epJs).map(s => `<script src="${s}"></script>`).join('\n')}
<script>
window.ready=(async()=>{
  cv=document.getElementById('c'); ctx=cv.getContext('2d');
  for(const f of ['400 20px Alexandria','600 20px Alexandria','800 20px Alexandria','900 20px Alexandria','700 20px Ruqaa','500 20px "Inter Tight"','800 20px "Inter Tight"','900 20px "Inter Tight"','700 20px Caveat']) await document.fonts.load(f,'محمود abc 123');
  buildTextures();
  ASSETS.logo=await loadImage(LOGO_DATA.logo); ASSETS.logoFull=await loadImage(LOGO_DATA.logoFull);
  if(window.initFilm) initFilm();
  return true;
})();
</script></body></html>`;
  const out = path.join(epDir, '.page.html'); fs.writeFileSync(out, html); return out;
}
module.exports = { buildPage };
