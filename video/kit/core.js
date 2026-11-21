// ─────────────────────────────────────────────────────────────
//  CORE — scene registry, render loop, shared story systems
//  (episode files define T[], DUR and call scene(a, b, fn))
// ─────────────────────────────────────────────────────────────
const SCENES = []; // {a,b,fn}
function scene(a, b, fn) { SCENES.push({ a, b, fn }); }

function blinkAt(t, seed = 0) { const p = (t + seed * 1.7) % 3.3; return p < .12 ? Math.sin(p / .12 * Math.PI) : 0; }
function talkMouth(t, a, b) { if (t < a || t > b) return 0; return Math.abs(Math.sin((t - a) * 17)) * .8; }

// deterministic particles
function confetti(t, t0, x, y, n, seed, o = {}) {
  if (t < t0) return; const r = rng(seed), cols = o.cols || [C.gold, C.terracotta, C.goldSoft, C.cream, C.sage];
  const lt = t - t0, g = o.g ?? 900;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (r() - .5) * (o.spread ?? 2.4), sp = 500 + r() * 900, drag = 1.6;
    const vx = Math.cos(a) * sp, vy = Math.sin(a) * sp;
    const k = (1 - Math.exp(-drag * lt)) / drag;
    let px = x + vx * k + Math.sin(lt * 3 + i) * 30 * lt, py = y + vy * k + g * .5 * lt * lt * .55;
    const floor = o.floor ?? 99999; if (py > floor) py = floor;
    const rot = lt * (4 + r() * 8) + i, s = 10 + r() * 14;
    ctx.save(); ctx.translate(px, py); ctx.rotate(rot); ctx.scale(1, Math.cos(lt * 9 + i)); ctx.fillStyle = cols[i % cols.length]; ctx.globalAlpha *= o.alpha ?? 1;
    ctx.fillRect(-s / 2, -s / 4, s, s / 2); ctx.restore();
  }
}

// VHS/tape rewind look
function rewindFX(amount, t) {
  if (amount <= 0) return;
  ctx.save();
  const r = rng(Math.floor(t * 30));
  for (let i = 0; i < 7; i++) {
    const y = r() * H, h = 6 + r() * 60, off = (r() - .5) * 120 * amount;
    ctx.globalAlpha = .9 * amount; ctx.drawImage(cv, 0, y, W, h, off, y, W, h);
  }
  ctx.globalAlpha = .25 * amount; ctx.fillStyle = '#fff';
  for (let i = 0; i < 40; i++) ctx.fillRect(0, r() * H, W, 1 + r() * 2);
  ctx.restore();
  // ◀◀ glyph
  ctx.save(); ctx.globalAlpha = amount; ctx.fillStyle = '#fff';
  for (const dx of [0, 46]) { ctx.beginPath(); ctx.moveTo(130 + dx, 150); ctx.lineTo(176 + dx, 122); ctx.lineTo(176 + dx, 178); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}

// ── the city (top-down), shared by problem / trust / funnel / reveal ──
const CITY = (() => {
  const r = rng(42), blocks = [], vx = [60, 330, 750, 1020], hy = [120, 480, 860, 1240, 1600, 1900];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) {
    const x0 = vx[i] + 40, x1 = vx[i + 1] - 40, y0 = hy[j] + 40, y1 = hy[j + 1] - 40;
    const bs = []; const nx = 2 + Math.floor(r() * 2), ny = 2 + Math.floor(r() * 2);
    for (let a = 0; a < nx; a++) for (let b = 0; b < ny; b++) {
      const bw = (x1 - x0) / nx, bh = (y1 - y0) / ny;
      bs.push({ x: x0 + a * bw + 8, y: y0 + b * bh + 8, w: bw - 16, h: bh - 16, c: ['#1C2236', '#232A42', '#1A1F30', '#262E48'][Math.floor(r() * 4)], lit: r() });
    }
    blocks.push({ x0, x1, y0, y1, bs, i, j });
  }
  const shop = { x: 540, y: 1050 };
  const walkers = [];
  for (let k = 0; k < 150; k++) {
    const vert = r() < .5;
    walkers.push(vert ? { vert, c: vx[Math.floor(r() * 4)], sp: (40 + r() * 80) * (r() < .5 ? -1 : 1), off: r() * 2400, lane: (r() - .5) * 28 }
      : { vert, c: hy[Math.floor(r() * 6)], sp: (40 + r() * 80) * (r() < .5 ? -1 : 1), off: r() * 1400, lane: (r() - .5) * 28 });
  }
  return { blocks, vx, hy, shop, walkers };
})();
// shop sits inside central block (i=1, j=2): replace one building
function drawCity(t, o = {}) {
  const { visible = 0, attract = 0, glow = 0, dim = 0, sketch = 0 } = o;
  ctx.save();
  ctx.fillStyle = mixColor('#0D1120', C.paper, sketch); ctx.fillRect(-400, -400, W + 800, H + 800);
  // streets
  ctx.strokeStyle = sketch ? rgba(C.graphite, .5) : '#2C3550'; ctx.lineWidth = 56;
  for (const x of CITY.vx) { ctx.beginPath(); ctx.moveTo(x, -400); ctx.lineTo(x, H + 400); ctx.stroke(); }
  for (const y of CITY.hy) { ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(W + 400, y); ctx.stroke(); }
  ctx.strokeStyle = sketch ? rgba(C.graphite, .4) : 'rgba(236,232,225,.12)'; ctx.lineWidth = 2; ctx.setLineDash([18, 18]);
  for (const x of CITY.vx) { ctx.beginPath(); ctx.moveTo(x, -400); ctx.lineTo(x, H + 400); ctx.stroke(); }
  for (const y of CITY.hy) { ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(W + 400, y); ctx.stroke(); }
  ctx.setLineDash([]);
  // buildings
  for (const b of CITY.blocks) for (const k of b.bs) {
    if (Math.abs(k.x + k.w / 2 - CITY.shop.x) < 60 && Math.abs(k.y + k.h / 2 - CITY.shop.y) < 120) continue;
    ctx.fillStyle = sketch ? 'rgba(0,0,0,0)' : k.c; ctx.strokeStyle = sketch ? C.graphite : 'rgba(255,255,255,.06)'; ctx.lineWidth = sketch ? 3 : 2;
    ctx.beginPath(); ctx.roundRect(k.x, k.y, k.w, k.h, 8); ctx.fill(); ctx.stroke();
    if (!sketch && k.lit > .45) { ctx.fillStyle = `rgba(255,214,150,${.25 + .25 * Math.sin(t * .7 + k.lit * 20) ** 2})`; ctx.fillRect(k.x + 10, k.y + 10, k.w * .3, 8); }
  }
  // walkers
  const S = CITY.shop;
  for (let n = 0; n < CITY.walkers.length; n++) {
    const w = CITY.walkers[n];
    const span = w.vert ? H + 400 : W + 400;
    let s = ((w.off + w.sp * t) % span + span) % span - 200;
    let x = w.vert ? w.c + w.lane : s, y = w.vert ? s : w.c + w.lane;
    let col = sketch ? C.graphite : '#D9D4C7', rad = 7;
    // attraction: nearby walkers bend into the shop
    if (attract > 0 && n % 3 !== 0) {
      const d = Math.hypot(x - S.x, y - S.y);
      const pull = clamp(attract * (1 - d / 900)) * E.inOutQ(clamp((Math.sin(n * 1.3 + t * .9) + 1) / 2));
      x = lerp(x, S.x, pull * .85); y = lerp(y, S.y + 40, pull * .85);
      if (pull > .3) { col = mixColor('#D9D4C7', C.gold, clamp((pull - .3) * 2)); rad = 7 + pull * 3; }
    } else if (visible <= 0 && dim === 0) {
      // repelled: they curve away around the invisible shop
      const d = Math.hypot(x - S.x, y - S.y);
      if (d < 170) { const a = Math.atan2(y - S.y, x - S.x); x = S.x + Math.cos(a) * 170; y = S.y + Math.sin(a) * 170; }
    }
    ctx.globalAlpha = (1 - dim) * (o.walkAlpha ?? 1); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.28); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // the shop (top view)
  ctx.save(); ctx.translate(S.x, S.y);
  if (glow > 0) { ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = radial(0, 0, 420 * glow + 60, rgba(C.gold, .55 * glow), 'rgba(0,0,0,0)'); ctx.fillRect(-600, -600, 1200, 1200); ctx.globalCompositeOperation = 'source-over'; }
  ctx.fillStyle = sketch ? 'rgba(0,0,0,0)' : mixColor('#3A4260', C.gold, glow); ctx.strokeStyle = sketch ? C.graphite : mixColor('#5C6688', C.goldSoft, glow); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(-70, -95, 140, 190, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = sketch ? C.graphite : (glow > .5 ? C.ink : '#EBDDBD'); ctx.globalAlpha = sketch ? .8 : 1;
  ctx.font = '800 34px Alexandria'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl'; ctx.fillText(glow > .5 ? 'م' : 'م', 0, 4);
  ctx.restore();
  ctx.restore();
}

// ── time warp: final (VO) clock → authored clock ─────────────
let WARP = null;
function setWarp(newT, oldT) { WARP = newT.map((n, i) => [n, oldT[i]]); }
function toOld(t) {
  if (!WARP) return t;
  if (t <= WARP[0][0]) return WARP[0][1] + (t - WARP[0][0]);
  for (let i = 1; i < WARP.length; i++) if (t <= WARP[i][0]) { const [n0, o0] = WARP[i - 1], [n1, o1] = WARP[i]; return o0 + (o1 - o0) * (t - n0) / (n1 - n0); }
  const [n, o] = WARP[WARP.length - 1]; return o + (t - n);
}
// ── variants (full / cut-downs) ─────────────────────────────
// edl segments {a, b, vshift?, fade?} are in VO clock; vshift moves the picture
// (and SFX/music) against the voice, fade = cross-dissolve into the segment.
function variantOf(name) { return (window.VARIANTS && VARIANTS[name]) || { dur: DUR }; }
function variantDur(name) { const v = variantOf(name); return v.edl ? v.edl.reduce((s, e) => s + e.b - e.a, 0) : v.dur; }
function edlLocate(v, t) {
  if (!v.edl) return { tv: t, ta: t, k: -1, lt: t };
  let acc = 0;
  for (let k = 0; k < v.edl.length; k++) { const e = v.edl[k], d = e.b - e.a; if (t < acc + d || k === v.edl.length - 1) { const lt = t - acc; return { tv: e.a + lt + (e.vshift || 0), ta: e.a + lt, k, lt }; } acc += d; }
}
let XF = null;
function renderFinal(t, name = 'full', captions = true) {
  const v = variantOf(name), L = edlLocate(v, t);
  const e = v.edl ? v.edl[L.k] : null;
  if (e && e.fade && L.lt < e.fade && L.k > 0) {
    // cross-dissolve from the end of the previous segment
    const p = v.edl[L.k - 1];
    if (!XF) XF = makeCanvas(W, H);
    renderAt(toOld(p.b + (p.vshift || 0) + L.lt)); XF.getContext('2d').drawImage(cv, 0, 0);
    renderAt(toOld(L.tv));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - L.lt / e.fade; ctx.drawImage(XF, 0, 0); ctx.restore();
  } else renderAt(toOld(L.tv));
  if (captions && typeof CAPTIONS !== 'undefined') drawCaptions(L.ta, e ? e.a - .1 : -1e9, e ? e.b : 1e9);
}

// Rendering entry
function initFilm() { }
function renderAt(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  for (const s of SCENES) if (t >= s.a && t < s.b) { ctx.save(); s.fn(t, t - s.a, (t - s.a) / (s.b - s.a)); ctx.restore(); }
  grain(t, .035);
}
