// ─────────────────────────────────────────────────────────────
//  FODA "MAHMOUD" FILM — core engine (deterministic, frame-based)
//  Everything is drawn procedurally on a 1080×1920 canvas so the
//  same frame time always produces the same image.
// ─────────────────────────────────────────────────────────────
const W = 1080, H = 1920, FPS = 30;

// ── palette ─────────────────────────────────────────────────
const C = {
  paper: '#EFE9DD', paper2: '#E4DCCB', graphite: '#2E2D2B', pencil: '#55524C',
  ink: '#0B0B0D', coal: '#141417', night: '#0E1220', navy: '#1E2A47', navy2: '#16203A',
  gold: '#C9A35B', goldSoft: '#E6C98E', goldDeep: '#8A6A2F', bone: '#ECE8E1',
  skin: '#C98E62', skinShade: '#A9714B', hair: '#1C1715', shirt: '#F4F1EA',
  trouser: '#34343C', shoe: '#5A3B26',
  wood: '#B07A4A', woodDark: '#7E5332', fabric: '#5E7F7A', fabric2: '#3F5E59',
  terracotta: '#C8684A', sage: '#8FA58A', cream: '#E9DFC9', red: '#D8573F', blue: '#4C7FD1',
  mute: '#8D8A84',
};

// ── math ────────────────────────────────────────────────────
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  lin: t => t,
  inQ: t => t * t, outQ: t => 1 - (1 - t) * (1 - t),
  inOutQ: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  outC: t => 1 - Math.pow(1 - t, 3), inC: t => t * t * t,
  inOutC: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  inExpo: t => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
  inOutExpo: t => t === 0 ? 0 : t === 1 ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outElastic: t => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI) / 3) + 1,
  outBounce: t => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; },
};
const ease = (t, a, b, fn = E.inOutC) => fn(seg(t, a, b));
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return (s % 100000) / 100000; }; }
function noise1(x) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; }
function mixColor(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(lerp(pa >> 16, pb >> 16, t)), g = Math.round(lerp((pa >> 8) & 255, (pb >> 8) & 255, t)), bl = Math.round(lerp(pa & 255, pb & 255, t));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
}
function rgba(hex, a) { const p = parseInt(hex.slice(1), 16); return `rgba(${p >> 16},${(p >> 8) & 255},${p & 255},${a})`; }

// ── canvas & assets ─────────────────────────────────────────
let cv, ctx, ASSETS = {};
function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function buildTextures() {
  // paper fibre texture
  const p = makeCanvas(W, H), g = p.getContext('2d');
  g.fillStyle = C.paper; g.fillRect(0, 0, W, H);
  const r = rng(7);
  const id = g.getImageData(0, 0, W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n * .9; }
  g.putImageData(id, 0, 0);
  g.globalAlpha = .05; g.strokeStyle = '#7a6f5c';
  for (let i = 0; i < 900; i++) { g.lineWidth = r() * 1.2; g.beginPath(); const x = r() * W, y = r() * H, a = r() * 6.28, l = 6 + r() * 30; g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * .5 + 4, y + Math.sin(a) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  // soft blotches
  for (let i = 0; i < 30; i++) { const x = r() * W, y = r() * H, rr = 80 + r() * 260; const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(160,140,110,0.05)'); gr.addColorStop(1, 'rgba(160,140,110,0)'); g.globalAlpha = 1; g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  ASSETS.paper = p;
  // film grain tiles (several, rotated each frame)
  ASSETS.grain = [];
  for (let k = 0; k < 6; k++) {
    const gc = makeCanvas(540, 960), gg = gc.getContext('2d'), gd = gg.createImageData(540, 960), r2 = rng(100 + k);
    for (let i = 0; i < gd.data.length; i += 4) { const v = r2() * 255; gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = v; gd.data[i + 3] = 255; }
    gg.putImageData(gd, 0, 0); ASSETS.grain.push(gc);
  }
}

function loadImage(src) { return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; }); }

// ── drawing helpers ─────────────────────────────────────────
function txt(s, x, y, o = {}) {
  const { size = 60, font = 'Alexandria', weight = 700, color = C.ink, align = 'center', base = 'middle', alpha = 1, spacing = 0, stroke = null, strokeW = 0, shadow = null, dir = 'rtl' } = o;
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.font = `${weight} ${size}px "${font}"`; ctx.textAlign = align; ctx.textBaseline = base; ctx.direction = dir;
  if (spacing) ctx.letterSpacing = spacing + 'px';
  if (shadow) { ctx.shadowColor = shadow.c; ctx.shadowBlur = shadow.b; ctx.shadowOffsetY = shadow.y || 0; }
  if (stroke) { ctx.lineJoin = 'round'; ctx.strokeStyle = stroke; ctx.lineWidth = strokeW; ctx.strokeText(s, x, y); }
  ctx.fillStyle = color; ctx.fillText(s, x, y);
  ctx.restore();
}
function measure(s, size, font = 'Alexandria', weight = 700) { ctx.save(); ctx.font = `${weight} ${size}px "${font}"`; const w = ctx.measureText(s).width; ctx.restore(); return w; }

// hand-drawn polyline revealed by progress p (0..1). pts in local coords.
function sketchPath(pts, p = 1, o = {}) {
  const { color = C.graphite, width = 4, seed = 1, wobble = 1.6, passes = 2, closed = false, alpha = 1 } = o;
  if (p <= 0 || alpha <= 0) return;
  const P = closed ? pts.concat([pts[0]]) : pts;
  let L = 0; const segL = [];
  for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); segL.push(l); L += l; }
  const target = L * clamp(p);
  ctx.save(); ctx.globalAlpha *= alpha; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = color;
  for (let pass = 0; pass < passes; pass++) {
    const r = rng(seed * 31 + pass * 7 + 3);
    ctx.lineWidth = width * (pass ? .55 : 1); ctx.globalAlpha = alpha * (pass ? .55 : 1);
    ctx.beginPath(); let acc = 0;
    const jx = () => (r() - .5) * wobble * (pass ? 2.2 : 1);
    ctx.moveTo(P[0][0] + jx(), P[0][1] + jx());
    for (let i = 1; i < P.length; i++) {
      const l = segL[i - 1];
      if (acc + l >= target) { const f = (target - acc) / l; ctx.lineTo(lerp(P[i - 1][0], P[i][0], f) + jx(), lerp(P[i - 1][1], P[i][1], f) + jx()); break; }
      ctx.lineTo(P[i][0] + jx(), P[i][1] + jx()); acc += l;
    }
    ctx.stroke();
  }
  ctx.restore();
}
function rectPts(x, y, w, h) { return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
function ellipsePts(cx, cy, rx, ry, n = 40, a0 = 0, a1 = Math.PI * 2) { const o = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; }
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

// write-on pen/pencil tip (the gold nib motif)
function drawNib(x, y, s = 1, ang = -0.6, gold = true, alpha = 1) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  // nib pointing at (0,0), body going up
  const g = ctx.createLinearGradient(-40, -200, 40, 0);
  if (gold) { g.addColorStop(0, '#F3DCA4'); g.addColorStop(.45, C.gold); g.addColorStop(1, C.goldDeep); }
  else { g.addColorStop(0, '#666'); g.addColorStop(1, '#222'); }
  ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 10;
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-26, -40, -38, -90, -30, -130); ctx.lineTo(30, -130); ctx.bezierCurveTo(38, -90, 26, -40, 0, 0); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = C.coal; ctx.fillRect(-30, -260, 60, 132);
  ctx.fillStyle = gold ? C.goldDeep : '#111'; ctx.fillRect(-30, -142, 60, 14);
  ctx.strokeStyle = gold ? '#5c451c' : '#000'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(0, -70); ctx.stroke();
  ctx.fillStyle = gold ? '#5c451c' : '#000'; ctx.beginPath(); ctx.arc(0, -78, 7, 0, 6.28); ctx.fill();
  ctx.restore();
}

// ── camera ──────────────────────────────────────────────────
// cam = {x,y,z,r}: world point at screen centre, zoom, rotation
function withCam(cam, fn) {
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(cam.r || 0); ctx.scale(cam.z || 1, cam.z || 1); ctx.translate(-(cam.x || 0), -(cam.y || 0)); fn(); ctx.restore();
}
function shake(t, amt, freq = 18) { return { x: noise1(t * freq) * amt, y: noise1(t * freq + 99) * amt, r: noise1(t * freq * .7 + 50) * amt * .0006 }; }

function paperBG(alpha = 1, ox = 0, oy = 0) { ctx.save(); ctx.globalAlpha = alpha; ctx.drawImage(ASSETS.paper, ox % W - (ox > 0 ? W : 0), 0); ctx.drawImage(ASSETS.paper, ox % W - (ox > 0 ? W : 0) + W, 0); ctx.restore(); }
function fill(c, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore(); }
function radial(x, y, r, c0, c1) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, c0); g.addColorStop(1, c1); return g; }
function vignette(a = .55, col = '0,0,0') { ctx.save(); const g = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .78); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function grain(t, a = .06) { ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'overlay'; const k = Math.floor(t * 12) % 6; ctx.drawImage(ASSETS.grain[k], 0, 0, W, H); ctx.restore(); }
function lightLeak(x, y, r, col, a) { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = a; ctx.fillStyle = radial(x, y, r, col, 'rgba(0,0,0,0)'); ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
function shadowEllipse(x, y, rx, ry, a = .22) { ctx.save(); ctx.fillStyle = `rgba(20,15,10,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.28); ctx.fill(); ctx.restore(); }
