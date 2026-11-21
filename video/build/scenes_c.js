// ─────────────────────────────────────────────────────────────
//  ACT III — Turning point · 3 steps · funnel · Foda · two paths
//  · closing · START   (68.81 → 143s)
// ─────────────────────────────────────────────────────────────
function navyBG(a = 1) {
  ctx.save(); ctx.globalAlpha = a; const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0B1020'); g.addColorStop(1, '#141C33'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function goldGrid(p, a = .12, off = 0) {
  if (p <= 0) return; ctx.save(); ctx.strokeStyle = rgba(C.gold, a); ctx.lineWidth = 1.5;
  for (let x = 60; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H * p); ctx.stroke(); }
  for (let y = 60 + (off % 120); y < H; y += 120) { ctx.beginPath(); ctx.moveTo(W, y); ctx.lineTo(W - W * p, y); ctx.stroke(); }
  ctx.restore();
}
function goldText(s, x, y, size, o = {}) {
  ctx.save(); ctx.font = `${o.weight || 700} ${size}px "${o.font || 'Ruqaa'}"`; const w = ctx.measureText(s).width; ctx.restore();
  const p = o.p ?? 1; if (p <= 0) return;
  ctx.save();
  // right-to-left write-on wipe for Arabic
  ctx.beginPath(); if (o.ltr) ctx.rect(x - w / 2 - 40, y - size, (w + 80) * p, size * 2); else ctx.rect(x + w / 2 + 40 - (w + 80) * p, y - size, (w + 80) * p, size * 2); ctx.clip();
  const g = ctx.createLinearGradient(0, y - size / 2, 0, y + size / 2); g.addColorStop(0, '#F6E2AE'); g.addColorStop(.5, C.gold); g.addColorStop(1, C.goldDeep);
  txt(s, x, y, { size, font: o.font || 'Ruqaa', weight: o.weight || 700, color: g, shadow: { c: 'rgba(201,163,91,.45)', b: 30 }, dir: o.ltr ? 'ltr' : 'rtl', spacing: o.spacing || 0, alpha: o.alpha ?? 1 });
  ctx.restore();
}

// the chaos inventory reused for the turn
const CHAOS = (() => { const r = rng(5), a = []; for (let i = 0; i < 16; i++) a.push({ x: 80 + r() * 920, y: 220 + r() * 1480, r: (r() - .5) * 1.6, k: i % 4, v: r() }); return a; })();
function chaosItem(it, i, s = 1) {
  if (it.k === 0) logoVariant(i, 0, 0, .7 * s);
  else if (it.k === 1) postCard(0, 0, { s: .42 * s, color: [C.terracotta, C.fabric, '#8E7CC3', '#D9B36A'][i % 4], icon: [sofaIcon, pctIcon, priceIcon, qIcon][i % 4] });
  else if (it.k === 2) coin(0, 0, .9 * s, i);
  else chip(0, 0, ['عروض', 'أسعار', 'منتجات', 'إعلان'][i % 4], { col: C.bone, fg: C.ink, size: 30 * s });
}

// ── SC11: the turn — chaos becomes order (68.81 → 75.74) ────
scene(68.81, 76.0, (t) => {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const night = E.inOutQ(seg(t, 70.0, 72.0));
  navyBG(night);
  goldGrid(E.inOutC(seg(t, 71.8, 73.4)), .1);
  // the single gold point — the nib touches the page
  const dot = seg(t, 68.9, 69.4);
  const lineP = E.inOutExpo(seg(t, 69.6, 70.8));
  if (lineP <= 0) { ctx.save(); ctx.fillStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(540, 960, 10 * dot * (1 + Math.sin(t * 6) * .15), 0, 6.28); ctx.fill(); ctx.restore(); }
  else {
    // the horizontal line… which then folds into stairs
    const fold = E.inOutC(seg(t, 73.45, 74.6));
    const pts = [[lerp(540, 60, lineP), 960], [lerp(540, 1020, lineP), 960]];
    const stair = [[60, 1600], [300, 1600], [300, 1380], [540, 1380], [540, 1160], [780, 1160], [780, 940], [1020, 940]];
    ctx.save(); ctx.strokeStyle = C.gold; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = C.gold; ctx.shadowBlur = 24;
    ctx.beginPath();
    if (fold <= 0) { ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); }
    else stair.forEach(([x, y], i) => { const fx = lerp(60, 1020, i / (stair.length - 1)); const X = lerp(fx, x, fold), Y = lerp(960, y, fold); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
    ctx.stroke(); ctx.restore();
    if (lineP < 1) drawNib(pts[1][0], 960, .8, -.5);
  }
  // frozen chaos → snapped into order → into two lanes
  const fin = seg(t, 70.2, 70.9), order = E.inOutExpo(seg(t, 71.6, 72.6)), lanes = E.inOutExpo(seg(t, 72.6, 73.4)), out = seg(t, 73.3, 73.8);
  if (fin > 0 && out < 1) CHAOS.forEach((it, i) => {
    const gx = 200 + (i % 4) * 227, gy = 520 + Math.floor(i / 4) * 200;
    const lx = i % 2 ? 760 : 320, ly = 300 + (i >> 1) * 170;
    let x = lerp(it.x + Math.sin(t * .5 + i) * 20, gx, order), y = lerp(it.y + Math.cos(t * .4 + i) * 20, gy, order);
    x = lerp(x, lx, lanes); y = lerp(y, ly, lanes);
    ctx.save(); ctx.globalAlpha = fin * (1 - out) * lerp(.75, 1, order); ctx.translate(x, y + out * 300); ctx.rotate(it.r * (1 - order) + t * .05 * (1 - order) * (it.v - .5)); chaosItem(it, i, lerp(1, .8, order)); ctx.restore();
  });
  if (lanes > 0 && out < 1) for (const lx of [320, 760]) { ctx.save(); ctx.globalAlpha = lanes * (1 - out); ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.setLineDash([2, 14]); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lx, 220); ctx.lineTo(lx, 1700); ctx.stroke(); ctx.restore(); }
  // Mahmoud gets it
  const mi = E.outBack(seg(t, 73.6, 74.1));
  if (mi > 0) drawMahmoud(180, 1600, { s: .62 * mi, expr: 'aha', sparkle: seg(t, 74.0, 74.6), blink: blinkAt(t, 7), armL: [.3, .2], armR: [2.2, .6] });
  goldText('ابدأ صح', 540, 420, 190, { p: E.inOutQ(seg(t, 74.0, 74.9)) });
  vignette(.5);
});

// ── SC12: three steps up (75.74 → 87.25) ────────────────────
const STEPS = [[60, 1600], [300, 1380], [540, 1160], [780, 940]];
function stairs(t, lit) {
  for (let i = 0; i < 4; i++) {
    const [x, y] = STEPS[i];
    const on = i === 0 ? 1 : seg(lit, i - 1, i - .6);
    ctx.save();
    const g = ctx.createLinearGradient(0, y, 0, 2200); g.addColorStop(0, mixColor('#1E2A47', '#2B3A63', on)); g.addColorStop(1, '#0B1020');
    ctx.fillStyle = g; ctx.fillRect(x, y, 240, 2200 - y);
    ctx.strokeStyle = mixColor('#3A4670', C.gold, on); ctx.lineWidth = 6; ctx.shadowColor = C.gold; ctx.shadowBlur = 30 * on;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 240, y); ctx.stroke();
    ctx.restore();
    if (i > 0) txt(['١', '٢', '٣'][i - 1], x + 120, y + 110, { size: 110, weight: 900, color: rgba(C.gold, .25 + .6 * on) });
  }
}
scene(75.74, 87.5, (t) => {
  navyBG(1); goldGrid(1, .07, t * 20);
  const lit = t < 79.39 ? seg(t, 75.74, 76.3) : t < 84.87 ? 1 + seg(t, 79.39, 79.9) : 2 + seg(t, 84.87, 85.3);
  const step = Math.min(2, Math.floor(lit - .001)) + 1; // 1..3
  const cam = { x: lerp(540, 700, seg(t, 75.74, 86)), y: lerp(1180, 980, seg(t, 75.74, 86)), z: .95 };
  withCam(cam, () => {
    stairs(t, lit);
    // Mahmoud hops step to step
    const hopT = [75.9, 79.5, 85.0];
    let sx = STEPS[0][0] + 120, sy = STEPS[0][1], hop = 0;
    for (let i = 0; i < 3; i++) { const k = seg(t, hopT[i], hopT[i] + .45); if (k > 0) { sx = lerp(STEPS[i][0] + 120, STEPS[i + 1][0] + 120, E.inOutQ(k)); sy = lerp(STEPS[i][1], STEPS[i + 1][1], E.inOutQ(k)); hop = Math.sin(k * Math.PI) * 140; } }
    drawMahmoud(sx, sy - hop, { s: .62, expr: hop > 20 ? 'excited' : 'proud', blink: blinkAt(t, 8), armL: hop > 20 ? [2.3, .3] : [.3, .2], armR: hop > 20 ? [2.3, .3] : [.3, .2] });
  });
  // concept panel (screen space, top)
  const pan = (a, b) => t < a ? 0 : E.outBack(seg(t, a, a + .4)) * (1 - seg(t, b - .25, b));
  // 1) IDENTITY: six mismatched logos merge into one mark
  const p1 = pan(75.9, 79.6);
  if (p1 > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(1, p1);
    const merge = E.inOutExpo(seg(t, 76.4, 77.5));
    for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28 + t * .3, r = lerp(300, 0, merge); ctx.save(); ctx.globalAlpha *= 1 - merge * .95; logoVariant(i, 540 + Math.cos(a) * r, 560 + Math.sin(a) * r * .6, .8 * (1 - merge * .7)); ctx.restore(); }
    const mk = E.outBack(seg(t, 77.3, 77.8));
    if (mk > 0) {
      ctx.save(); ctx.translate(540, 560); ctx.scale(mk, mk);
      ctx.fillStyle = C.navy; ctx.strokeStyle = C.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, 130, 0, 6.28); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 112, 0, 6.28); ctx.lineWidth = 2; ctx.stroke();
      txt('م', 0, 10, { size: 150, weight: 900, color: C.gold });
      ctx.restore();
      ['#1E2A47', C.gold, C.cream, C.terracotta].forEach((c, i) => { const k = E.outBack(seg(t, 77.7 + i * .1, 78.0 + i * .1)); ctx.save(); ctx.translate(390 + i * 100, 790); ctx.scale(k, k); ctx.fillStyle = c; ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-36, -36, 72, 72, 16); ctx.fill(); ctx.stroke(); ctx.restore(); });
    }
    ctx.restore();
    txt('IDENTITY', 540, 230, { size: 40, font: 'Inter Tight', weight: 800, color: rgba(C.gold, .8), dir: 'ltr', spacing: 12, alpha: Math.min(1, p1) });
    txt('هوية تفتكرها الناس', 540, 300, { size: 58, weight: 800, color: C.bone, alpha: Math.min(1, p1) });
  }
  // 2) CONTENT: a consistent carousel
  const p2 = pan(79.5, 85.0);
  if (p2 > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(1, p2);
    const icons = [sofaIcon, chairIcon, lampIcon, sofaIcon, chairIcon];
    const slide = (t - 79.5) * 160;
    for (let i = 0; i < 7; i++) {
      let x = 540 + (i - 3) * 290 - (slide % 290); const d = Math.abs(x - 540) / 290;
      ctx.save(); ctx.translate(x, 600); const s = 1 - d * .18; ctx.scale(s, s); ctx.globalAlpha *= clamp(1.4 - d * .5);
      ctx.fillStyle = C.navy; ctx.strokeStyle = C.gold; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-120, -190, 240, 380, 22); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.cream; ctx.beginPath(); ctx.roundRect(-100, -170, 200, 230, 14); ctx.fill();
      ctx.save(); ctx.translate(0, -60); icons[((i + Math.floor(slide / 290)) % 5 + 5) % 5]({ sketch: 0 }); ctx.restore();
      ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(-80, 100, 18, 0, 6.28); ctx.fill(); txt('م', -80, 102, { size: 22, weight: 900, color: C.navy });
      ctx.fillStyle = 'rgba(236,232,225,.6)'; ctx.fillRect(-50, 92, 130, 12); ctx.fillRect(-100, 136, 180, 12);
      ctx.restore();
    }
    ctx.restore();
    txt('CONTENT', 540, 230, { size: 40, font: 'Inter Tight', weight: 800, color: rgba(C.gold, .8), dir: 'ltr', spacing: 12, alpha: Math.min(1, p2) });
    txt('محتوى يعرّف بيك', 540, 300, { size: 58, weight: 800, color: C.bone, alpha: Math.min(1, p2) });
  }
  // 3) TRUST: question marks turn into hearts and checks
  const p3 = pan(84.95, 87.5);
  if (p3 > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(1, p3);
    for (let i = 0; i < 7; i++) {
      const x = 240 + i * 100, y = 680 + (i % 2) * 40; personToken(x, y, 1.6, C.bone);
      const turn = seg(t, 85.3 + i * .12, 85.6 + i * .12);
      if (turn < 1) txt('؟', x, y - 120, { size: 54, weight: 900, color: C.mute, alpha: 1 - turn });
      if (turn > 0) { ctx.save(); ctx.translate(x, y - 120 - turn * 20); ctx.scale(E.outBack(turn), E.outBack(turn)); ctx.fillStyle = i % 2 ? C.gold : C.terracotta; ctx.beginPath(); ctx.moveTo(0, 16); ctx.bezierCurveTo(-34, -8, -18, -34, 0, -16); ctx.bezierCurveTo(18, -34, 34, -8, 0, 16); ctx.fill(); ctx.restore(); }
    }
    ctx.restore();
    txt('TRUST', 540, 230, { size: 40, font: 'Inter Tight', weight: 800, color: rgba(C.gold, .8), dir: 'ltr', spacing: 12, alpha: Math.min(1, p3) });
    txt('ثقة… مش فيديوهات وخلاص', 540, 300, { size: 54, weight: 800, color: C.bone, alpha: Math.min(1, p3) });
  }
  vignette(.45);
});

// ── SC13: the funnel — people find him (87.25 → 96.95) ──────
scene(87.25, 97.6, (t) => {
  const z = lerp(2.6, 1.0, E.inOutC(seg(t, 87.25, 89.6)));
  const attract = E.inOutQ(seg(t, 88.4, 92));
  const glow = E.outC(seg(t, 87.5, 88.6));
  const toPaper = E.inOutQ(seg(t, 96.6, 97.6));
  withCam({ x: 540, y: 1050, z: z * lerp(1, .85, seg(t, 89.6, 97)), r: lerp(-.08, 0, E.outC(seg(t, 87.25, 89.6))) }, () => {
    drawCity(t, { attract, glow, sketch: 0 });
    // beacons orbiting the shop: offers + ads
    const S = CITY.shop;
    [['عروض', 89.6, 0], ['إعلانات', 90.4, Math.PI]].forEach(([l, a, ph]) => {
      const k = E.outBack(seg(t, a, a + .4)); if (k <= 0) return;
      const ang = t * .9 + ph, x = S.x + Math.cos(ang) * 260, y = S.y + Math.sin(ang) * 200;
      ctx.save(); ctx.strokeStyle = rgba(C.gold, .4); ctx.lineWidth = 3; ctx.setLineDash([6, 10]); ctx.beginPath(); ctx.moveTo(S.x, S.y); ctx.lineTo(x, y); ctx.stroke(); ctx.restore();
      chip(x, y, l, { col: C.gold, fg: C.ink, size: 36, scale: k });
    });
    // funnel ring at the door
    const fr = seg(t, 91.5, 92.2);
    if (fr > 0) { ctx.save(); ctx.strokeStyle = rgba(C.goldSoft, fr * .8); ctx.lineWidth = 6; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(S.x, S.y + 40, 150 - i * 40, 40 - i * 10, 0, 0, 6.28); ctx.stroke(); } ctx.restore(); }
  });
  vignette(.5);
  // kinetic: من مهتم → لعميل
  const k1 = E.outBack(seg(t, 93.4, 93.8)), k2 = E.outBack(seg(t, 94.4, 94.8)), o = 1 - seg(t, 96.4, 96.8);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(1, k1) * o; ctx.fillStyle = 'rgba(8,10,18,.82)'; ctx.beginPath(); ctx.roundRect(110, 210, 860, 250, 40); ctx.fill(); ctx.restore();
    txt('مهتم', 800, 335, { size: 96, weight: 900, color: C.bone, alpha: Math.min(1, k1) * o });
    ctx.save(); ctx.globalAlpha = Math.min(1, k2) * o; arrowHead(lerp(640, 560, k2), 335, Math.PI, 50, C.gold); ctx.strokeStyle = C.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(660, 335); ctx.lineTo(lerp(650, 560, k2), 335); ctx.stroke(); ctx.restore();
    txt('عميل حقيقي', 330, 335, { size: 84, weight: 900, color: C.gold, alpha: Math.min(1, k2) * o });
  }
  if (toPaper > 0) { ctx.save(); ctx.globalAlpha = toPaper; paperBG(1); ctx.restore(); }
});

// ── SC14: it was drawn by Foda (96.95 → 99.53) ──────────────
scene(96.95, 99.9, (t) => {
  const lift = E.inOutC(seg(t, 97.0, 97.9));
  const dark = E.inOutC(seg(t, 97.7, 98.3));
  paperBG(1);
  withCam({ x: 540, y: 1050, z: lerp(.85, .45, lift) }, () => {
    drawCity(t, { attract: 1, glow: 1, sketch: 1, walkAlpha: .6 });
    sketchPath([[300, 1050], [460, 1050]], seg(t, 96.95, 97.3), { color: C.gold, width: 10, seed: 3 });
  });
  // the nib rises from the page
  const nx = lerp(470, 540, lift), ny = lerp(1060, 860, lift);
  if (dark < 1) drawNib(nx, ny, lerp(.7, 1.7, lift), lerp(-.5, 0, lift), true, 1 - dark);
  if (dark > 0) {
    ctx.save(); ctx.globalAlpha = dark; ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
    lightLeak(540, 860, 700, 'rgba(201,163,91,.35)', 1);
    const s = lerp(1.6, 1.25, E.outC(seg(t, 97.8, 99.4)));
    const im = ASSETS.logoFull, w = im.width * s, h = im.height * s;
    ctx.globalAlpha = dark * E.inOutQ(seg(t, 97.85, 98.4));
    ctx.shadowColor = 'rgba(201,163,91,.6)'; ctx.shadowBlur = 60;
    ctx.drawImage(im, 540 - w / 2, 860 - h / 2, w, h);
    ctx.restore();
    txt('FODA AGENCY', 540, 1340, { size: 54, font: 'Inter Tight', weight: 800, color: C.bone, dir: 'ltr', spacing: 18, alpha: dark * seg(t, 98.5, 98.9) });
    sketchPath([[340, 1410], [740, 1410]], seg(t, 98.7, 99.2), { color: C.gold, width: 3, seed: 9, passes: 1, wobble: 0 });
  }
  vignette(.4);
});

// ── SC15: path A — content production (99.53 → 110.76) ──────
function reel(x, y, s, i, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a;
  ctx.fillStyle = C.navy; ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-54, -96, 108, 192, 14); ctx.fill(); ctx.stroke();
  ctx.fillStyle = [C.cream, '#E6D3B3', '#DCCDB5'][i % 3]; ctx.beginPath(); ctx.roundRect(-44, -84, 88, 120, 8); ctx.fill();
  ctx.save(); ctx.translate(0, -30); ctx.scale(.42, .42); [sofaIcon, chairIcon, lampIcon][i % 3]({ sketch: 0 }); ctx.restore();
  ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(-8, 52); ctx.lineTo(10, 62); ctx.lineTo(-8, 72); ctx.fill();
  ctx.restore();
}
scene(99.53, 111.0, (t) => {
  navyBG(1); goldGrid(1, .06, -t * 30);
  // fork
  const fork = E.inOutExpo(seg(t, 99.6, 100.5)), push = E.inOutExpo(seg(t, 100.9, 101.6));
  if (push < 1) {
    ctx.save(); ctx.globalAlpha = 1 - push;
    withCam({ x: lerp(540, 300, push), y: lerp(960, 700, push), z: lerp(1, 2.2, push) }, () => {
      ctx.save(); ctx.strokeStyle = C.gold; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.shadowColor = C.gold; ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.moveTo(540, 1900); ctx.lineTo(540, 1250); ctx.stroke();
      for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(540, 1250); ctx.bezierCurveTo(540, 1000, 540 + d * 300 * fork, 1000, 540 + d * 300 * fork, 700 - 200 * fork); ctx.stroke(); }
      ctx.restore();
      chip(240, 430, 'إنتاج محتوى', { col: C.gold, fg: C.ink, size: 40, scale: E.outBack(seg(t, 100.0, 100.4)) });
      chip(840, 430, 'إدارة متكاملة', { col: C.bone, fg: C.ink, size: 40, scale: E.outBack(seg(t, 100.2, 100.6)), alpha: 1 - push });
      drawMahmoud(540, 1850, { s: .5, expr: 'think', look: [-1, -1], armL: [.4, 2.2], armR: [.2, .1], blink: blinkAt(t) });
    });
    ctx.restore();
  }
  if (push > 0) {
    ctx.save(); ctx.globalAlpha = push;
    // production line
    const lt = t - 101.4;
    ctx.fillStyle = '#0A0D18'; ctx.fillRect(0, 1380, W, 120);
    ctx.strokeStyle = rgba(C.gold, .6); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 1380); ctx.lineTo(W, 1380); ctx.stroke();
    for (let i = 0; i < 14; i++) { const x = ((i * 90 - lt * 300) % 1260 + 1260) % 1260 - 90; ctx.fillStyle = '#20283F'; ctx.beginPath(); ctx.arc(x, 1440, 26, 0, 6.28); ctx.fill(); }
    const wall = E.inOutExpo(seg(t, 106.3, 107.0));
    cameraIcon(860, 1130, { s: .9 * (1 - wall), rec: Math.floor(t * 4) % 2 });
    // flashes
    const fphase = (lt % .32) / .32; if (lt > 0 && t < 106.3) lightLeak(860, 1130, 260, 'rgba(255,240,210,.8)', (1 - fphase) * .5);
    // 16 reels: ride the belt, then jump to the wall
    let done = 0;
    for (let i = 0; i < 16; i++) {
      const born = 101.6 + i * .27;
      if (t < born) continue;
      const ride = seg(t, born, born + .6), jump = E.inOutC(seg(t, born + .6, born + 1.0));
      if (jump >= 1) done++;
      const bx = lerp(860, 540, ride), by = 1290;
      const gx = 237 + (i % 4) * 202, gy = 300 + Math.floor(i / 4) * 236;
      const cx = lerp(540, 540, wall), wx = lerp(gx, cx + (gx - 540) * .55, wall), wy = lerp(gy, 300 + (gy - 300) * .55 + 40, wall);
      const x = lerp(bx, wx, jump), y = lerp(by, wy, jump) - Math.sin(jump * Math.PI) * 200;
      reel(x, y, lerp(.8, .95, jump) * lerp(1, .55, wall), i);
    }
    // counter
    const cnt = Math.min(16, done);
    if (t < 106.5) txt(String(cnt), 200, 1240, { size: 170, font: 'Inter Tight', weight: 900, color: C.gold, dir: 'ltr', alpha: seg(t, 101.7, 102) });
    // payoff: 16 VIDEOS / UNDER 10,000 EGP, at Mahmoud's scale
    const pay = E.outBack(seg(t, 106.6, 107.1)), pr = E.outBack(seg(t, 108.0, 108.5));
    if (pay > 0) {
      txt('16 VIDEOS', 540, 980, { size: 140 * Math.max(.01, pay), font: 'Inter Tight', weight: 900, color: C.gold, dir: 'ltr', alpha: Math.min(1, pay), shadow: { c: 'rgba(201,163,91,.4)', b: 30 } });
      txt('16 فيديو احترافي', 540, 1100, { size: 64, weight: 800, color: C.bone, alpha: Math.min(1, pay) });
    }
    if (pr > 0) {
      drawMahmoud(210, 1780, { s: .62, expr: 'happy', blink: blinkAt(t, 2), armL: [.3, .2], armR: [1.05, .3] });
      txt('أقل من', 680, 1370, { size: 58, weight: 800, color: C.bone, alpha: Math.min(1, pr) });
      bigNumber3D('10,000', 680, lerp(1560, 1640, 1 - Math.min(1, pr)), 150, 30, { face: C.gold, side: C.goldDeep, alpha: Math.min(1, pr) });
      txt('جنيه', 680, 1650, { size: 52, weight: 800, color: C.gold, alpha: Math.min(1, pr) });
      txt('UNDER 10,000 EGP', 680, 1730, { size: 32, font: 'Inter Tight', weight: 800, color: rgba(C.bone, .7), dir: 'ltr', spacing: 4, alpha: Math.min(1, pr) });
    }
    ctx.restore();
  }
  vignette(.45);
});

// ── SC16: path B — the full system (110.76 → 123.28) ────────
const ORBIT = [['هوية', 'IDENTITY', 111.9], ['محتوى', 'CONTENT', 112.9], ['تصميم', 'DESIGN', 113.9], ['إعلانات', 'ADS', 114.8], ['رحلة العميل', 'JOURNEY', 116.0]];
scene(110.76, 123.5, (t) => {
  navyBG(1); goldGrid(1, .05);
  const enter = E.outExpo(seg(t, 110.76, 111.3));
  const shrink = E.inOutC(seg(t, 119.4, 120.4));
  const cx = 540, cy = lerp(900, 560, shrink), sc = lerp(1, .62, shrink) * lerp(1.4, 1, enter);
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
  // orbit ellipse
  ctx.save(); ctx.strokeStyle = rgba(C.gold, .25); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 400, 200, 0, 0, 6.28); ctx.stroke(); ctx.restore();
  const rot = t * .32;
  const pos = ORBIT.map(([, , a], i) => { const ang = rot + i / ORBIT.length * 6.28; return { x: Math.cos(ang) * 400, y: Math.sin(ang) * 200, d: (Math.sin(ang) + 1) / 2, k: E.outBack(seg(t, a, a + .4)) }; });
  // links + flowing particles (the journey loops through everything)
  for (let i = 0; i < pos.length; i++) {
    const a = pos[i], b = pos[(i + 1) % pos.length]; const k = Math.min(a.k, b.k, 1); if (k <= 0) continue;
    ctx.save(); ctx.strokeStyle = rgba(C.gold, .55 * k); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    for (let p = 0; p < 3; p++) { const f = ((t * .6 + p / 3 + i * .17) % 1); ctx.fillStyle = C.goldSoft; ctx.beginPath(); ctx.arc(lerp(a.x, b.x, f), lerp(a.y, b.y, f), 6, 0, 6.28); ctx.fill(); }
    ctx.restore();
  }
  pos.forEach((p, i) => { if (p.k <= 0) return; ctx.save(); ctx.strokeStyle = rgba(C.gold, .3 * Math.min(1, p.k)); ctx.lineWidth = 2; ctx.setLineDash([4, 10]); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.restore(); });
  // centre: strategy (a compass star)
  const ck = E.outBack(seg(t, 111.0, 111.5));
  ctx.save(); ctx.scale(ck, ck); ctx.rotate(t * .1);
  ctx.fillStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 40; ctx.beginPath();
  for (let i = 0; i < 16; i++) { const r = i % 2 ? 34 : (i % 4 === 0 ? 120 : 70), a = i / 16 * 6.28 - Math.PI / 2; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill();
  ctx.restore();
  txt('استراتيجية', 0, 170, { size: 54, weight: 900, color: C.bone, alpha: Math.min(1, ck) });
  txt('STRATEGY', 0, 222, { size: 26, font: 'Inter Tight', weight: 800, color: rgba(C.gold, .8), dir: 'ltr', spacing: 8, alpha: Math.min(1, ck) });
  // orbit nodes, sorted by depth
  pos.map((p, i) => [p, i]).sort((a, b) => a[0].d - b[0].d).forEach(([p, i]) => {
    if (p.k <= 0) return; const s = lerp(.7, 1.1, p.d) * p.k;
    ctx.save(); ctx.translate(p.x, p.y); ctx.scale(s, s);
    ctx.fillStyle = mixColor('#1E2A47', '#2B3A63', p.d); ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 84, 0, 6.28); ctx.fill(); ctx.stroke();
    txt(ORBIT[i][0], 0, -6, { size: ORBIT[i][0].length > 6 ? 30 : 38, weight: 800, color: C.bone });
    txt(ORBIT[i][1], 0, 36, { size: 16, font: 'Inter Tight', weight: 800, color: C.gold, dir: 'ltr', spacing: 3 });
    ctx.restore();
  });
  ctx.restore();
  // different levels for different needs
  const lv = seg(t, 120.0, 121.6);
  if (lv > 0) {
    [[300, 300, 1], [540, 470, 2], [780, 640, 3]].forEach(([x, h, n], i) => {
      const k = E.outBack(seg(t, 120.1 + i * .25, 120.6 + i * .25)); if (k <= 0) return;
      const hh = h * k;
      ctx.save(); const g = ctx.createLinearGradient(0, 1760 - hh, 0, 1760); g.addColorStop(0, '#2B3A63'); g.addColorStop(1, '#141C33');
      ctx.fillStyle = g; ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x - 95, 1760 - hh, 190, hh, [18, 18, 0, 0]); ctx.fill(); ctx.stroke(); ctx.restore();
      for (let d = 0; d < n; d++) { ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(x - (n - 1) * 18 + d * 36, 1760 - hh + 50, 10, 0, 6.28); ctx.fill(); }
    });
    txt('حسب احتياجات مشروعك', 540, 1840, { size: 50, weight: 800, color: C.bone, alpha: seg(t, 121.2, 121.6) });
  }
  vignette(.45);
});

// ── SC17: not every project needs the same plan (123.28 → 134.81) ──
let SHARDS = null;
function makeShards() {
  const c = makeCanvas(1000, 340), g = c.getContext('2d');
  g.font = '900 260px "Inter Tight"'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  for (let i = 60; i > 0; i -= 2) { g.fillStyle = mixColor('#7A3426', '#000000', (i / 60) * .5); g.fillText('40,000', 500 + i * .55, 270 + i * .75 - 40); }
  g.fillStyle = '#E7735A'; g.fillText('40,000', 500, 230);
  const r = rng(11), out = [];
  for (let i = 0; i < 8; i++) for (let j = 0; j < 3; j++) out.push({ sx: i * 125, sy: j * 113, vx: (r() - .5) * 900, vy: -200 - r() * 500, vr: (r() - .5) * 8, k: r() });
  SHARDS = { c, out };
}
scene(123.28, 135.1, (t) => {
  if (!SHARDS) makeShards();
  paperBG(1);
  // a) three different businesses, three different plans
  const a = 1 - E.inOutC(seg(t, 125.4, 125.9));
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a;
    withCam({ x: 540, y: 1100, z: lerp(1.08, 1, seg(t, 123.28, 125.7)) }, () => {
      const shops = [[220, 'أثاث', C.terracotta], [540, 'كافيه', C.sage], [860, 'ملابس', '#8E7CC3']];
      shops.forEach(([x, l, c], i) => {
        const k = E.outBack(seg(t, 123.3 + i * .15, 123.7 + i * .15));
        miniShop(x, 1500, 2.4 * k, '#E2D8C6', 1, {});
        chip(x, 1600, l, { col: c, fg: '#fff', size: 36, scale: k });
      });
      // three different gold paths drawn by the nib
      const P1 = [[220, 1280], [220, 700]];
      const P2 = [[540, 1280], [540, 1150], [620, 1150], [620, 1000], [460, 1000], [460, 850], [540, 850], [540, 700]];
      const P3 = []; for (let i = 0; i <= 40; i++) { const f = i / 40; P3.push([860 + Math.sin(f * 9) * 80 * (1 - f), lerp(1280, 700, f)]); }
      [P1, P2, P3].forEach((pp, i) => {
        const pr = seg(t, 123.8 + i * .35, 124.6 + i * .35);
        sketchPath(pp, pr, { color: C.gold, width: 10, seed: 70 + i, passes: 1, wobble: 0 });
        if (pr > 0 && pr < 1) { const L = pp.length - 1, q = pp[Math.min(L, Math.floor(pr * L))]; drawNib(q[0], q[1], .5, -.5); }
        if (pr >= 1) { const e = pp[pp.length - 1]; ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(e[0], e[1], 18, 0, 6.28); ctx.fill(); }
      });
    });
    ctx.restore();
    txt('كل مشروع وله خطته', 540, 360, { size: 74, weight: 900, color: C.ink, alpha: seg(t, 124.0, 124.4) * a });
  }
  // b) the "tens of thousands" wall breaks into one small, right first step
  if (t > 125.4) {
    const b = E.inOutC(seg(t, 125.5, 125.9)) * (1 - E.inOutC(seg(t, 129.9, 130.4)));
    ctx.save(); ctx.globalAlpha = b;
    const drop = E.outBounce(seg(t, 125.7, 126.4)), crack = seg(t, 127.3, 127.5), fly = seg(t, 127.5, 128.5), gather = E.inOutC(seg(t, 128.4, 129.1));
    const ox = 40, oy = lerp(-400, 600, drop);
    const sh = shake(t, crack > 0 && crack < 1 ? 20 : (drop > .95 && t < 126.6 ? 12 : 0));
    ctx.translate(sh.x, sh.y);
    // shards
    if (crack < 1) ctx.drawImage(SHARDS.c, ox, oy);
    else SHARDS.out.forEach((s) => {
      const ft = fly * .9;
      let x = ox + s.sx + s.vx * ft, y = oy + s.sy + s.vy * ft + 1600 * ft * ft;
      const tx = 540 - 60 + (s.k * 120), ty = 1640;
      x = lerp(x, tx, gather); y = lerp(y, ty, gather);
      ctx.save(); ctx.translate(x + 62, y + 56); ctx.rotate(s.vr * ft * (1 - gather)); ctx.scale(1 - gather * .9, 1 - gather * .9); ctx.globalAlpha *= 1 - gather * .8;
      ctx.drawImage(SHARDS.c, s.sx, s.sy, 125, 113, -62, -56, 125, 113); ctx.restore();
    });
    if (crack > 0 && crack < 1) { ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(300, oy + 20); ctx.lineTo(380, oy + 150); ctx.lineTo(320, oy + 300); ctx.moveTo(700, oy); ctx.lineTo(640, oy + 170); ctx.lineTo(720, oy + 320); ctx.stroke(); ctx.restore(); }
    // the right first step
    const st = E.outBack(seg(t, 128.9, 129.3));
    if (st > 0) { ctx.save(); ctx.translate(540, 1700); ctx.scale(st, st); ctx.fillStyle = C.navy; ctx.strokeStyle = C.gold; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-220, -70, 440, 140, 16); ctx.fill(); ctx.stroke(); txt('ابدأ صح', 0, 4, { size: 62, font: 'Ruqaa', weight: 700, color: C.gold }); ctx.restore(); }
    const up = E.inOutQ(seg(t, 129.2, 129.6));
    drawMahmoud(lerp(250, 540, up), lerp(1820, 1630, up) - Math.sin(up * Math.PI) * 80, { s: .72, expr: t < 127.4 ? 'shock' : (t < 129 ? 'think' : 'happy'), blink: blinkAt(t, 9), look: t < 127.4 ? [1, -1] : [0, 0], armL: [.3, .2], armR: t > 129.4 ? [2.4, .3] : [.3, .2] });
    ctx.restore();
    txt('مش لازم عشرات الآلاف', 540, 330, { size: 68, weight: 900, color: C.ink, alpha: seg(t, 126.4, 126.8) * b });
  }
  // c) and you? (130.06 → 134.81)
  if (t > 129.9) {
    const c = E.inOutC(seg(t, 129.9, 130.5));
    ctx.save(); ctx.globalAlpha = c;
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1A1F33'); g.addColorStop(1, '#3A2E3C'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const push = E.inOutQ(seg(t, 130.2, 134.8));
    withCam({ x: 540, y: lerp(1200, 1080, push), z: lerp(.62, .95, push) }, () => {
      ctx.fillStyle = '#2B2A30'; ctx.fillRect(-1200, 1500, 3500, 1600);
      showroom(540, 1500, { s: 1.15, lit: 1, signText: 'معرض محمود', signCol: C.navy });
      // customers walking in (abstract tokens)
      for (let i = 0; i < 6; i++) { const f = ((t * .35 + i / 6) % 1); personToken(lerp(-300, 820, f), 1650 + (i % 2) * 40, 2.4, mixColor(C.bone, C.gold, (i % 3) / 3), { alpha: clamp(f * 4) * clamp((1 - f) * 6) }); }
      lightLeak(400, 1150, 600, 'rgba(255,200,120,.6)', .5);
      const pt = E.outBack(seg(t, 131.0, 131.5));
      drawMahmoud(330, 1720, { s: 1.15, expr: 'proud', blink: blinkAt(t, 3), armL: [.3, .2], armR: [lerp(.3, 1.35, pt), lerp(.2, -.2, pt)], look: [0, 0] });
    });
    ctx.restore();
    goldText('وإنت؟', 540, 420, 170, { p: E.inOutQ(seg(t, 131.4, 132.1)), alpha: c });
    vignette(.45);
  }
});

// ── SC18: START (134.81 → 143) ──────────────────────────────
scene(134.81, DUR, (t) => {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
  lightLeak(540, 900, 900, 'rgba(201,163,91,.18)', seg(t, 136.3, 137));
  goldGrid(seg(t, 136.4, 137.4), .06);
  const typed = 'START', n = Math.floor(clamp((t - 135.0) / .14, 0, 5));
  const send = seg(t, 135.95, 136.15), fly = E.inExpo(seg(t, 136.1, 136.45));
  // chat bar
  const bar = 1 - seg(t, 136.2, 136.5);
  if (bar > 0) {
    ctx.save(); ctx.globalAlpha = bar * seg(t, 134.81, 135.0);
    ctx.fillStyle = '#1C1D22'; ctx.beginPath(); ctx.roundRect(70, 1240, 800, 120, 60); ctx.fill();
    ctx.strokeStyle = 'rgba(236,232,225,.15)'; ctx.lineWidth = 2; ctx.stroke();
    txt(typed.slice(0, n) + (Math.floor(t * 3) % 2 && n < 5 ? '|' : ''), 120, 1302, { size: 56, font: 'Inter Tight', weight: 800, color: C.bone, dir: 'ltr', align: 'left' });
    ctx.save(); ctx.translate(950, 1300); ctx.scale(1 - send * .15, 1 - send * .15); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(0, 0, 60, 0, 6.28); ctx.fill();
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(-22, -24); ctx.lineTo(28, 0); ctx.lineTo(-22, 24); ctx.lineTo(-12, 0); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.restore();
  }
  // bubble flies up → becomes the giant word
  if (t > 136.1 && fly < 1) { ctx.save(); const y = lerp(1150, 860, fly), s = lerp(1, 3, fly); ctx.translate(lerp(700, 540, fly), y); ctx.scale(s, s); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.roundRect(-110, -44, 220, 88, 30); ctx.fill(); txt('START', 0, 3, { size: 46, font: 'Inter Tight', weight: 900, color: C.ink, dir: 'ltr' }); ctx.restore(); }
  const slam = seg(t, 136.45, 136.75);
  if (slam > 0) {
    const sh = shake(t, slam < 1 ? 24 * (1 - slam) : 0);
    const sc = lerp(1.6, 1, E.outExpo(slam));
    ctx.save(); ctx.translate(540 + sh.x, 880 + sh.y); ctx.scale(sc, sc);
    bigNumber3D('START', 0, 90, 250, 46, { face: C.gold, side: C.goldDeep, alpha: Math.min(1, slam * 3) });
    ctx.restore();
    confetti(t, 136.5, 540, 880, 60, 21, { cols: [C.gold, C.goldSoft, C.goldDeep, C.bone], spread: 6.28, g: 700, alpha: 1 - seg(t, 138, 139.5) });
  }
  // the line
  txt('وخلّي البداية المرة دي', 540, 1180, { size: 62, weight: 800, color: C.bone, alpha: seg(t, 137.0, 137.4) });
  goldText('بخطة.', 540, 1340, 160, { p: E.inOutQ(seg(t, 138.3, 139.0)) });
  // sign-off
  const lg = E.outC(seg(t, 139.4, 140.2));
  if (lg > 0) {
    const im = ASSETS.logoFull, s = .5, w = im.width * s, h = im.height * s;
    ctx.save(); ctx.globalAlpha = lg; ctx.shadowColor = 'rgba(201,163,91,.5)'; ctx.shadowBlur = 40; ctx.drawImage(im, 540 - w / 2, 230 - h / 2 + (1 - lg) * 30, w, h); ctx.restore();
    chip(540, 1600, 'ابعتلنا  START', { col: 'rgba(0,0,0,0)', fg: C.gold, size: 46, outline: C.gold, alpha: lg, pad: 44 });
    txt('FODA AGENCY', 540, 1760, { size: 30, font: 'Inter Tight', weight: 800, color: rgba(C.bone, .6), dir: 'ltr', spacing: 14, alpha: lg });
  }
  ctx.save(); ctx.globalAlpha = seg(t, 142.4, 143); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore();
  vignette(.5);
});
