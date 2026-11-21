// ─────────────────────────────────────────────────────────────
//  ACT II — DIY marketing · no direction · chaos · the price wall
//  (16.32 → 68.81s)
// ─────────────────────────────────────────────────────────────
// ── SC4: he does it himself (16.32 → 22.15) ─────────────────
scene(16.32, 22.45, (t) => {
  const iris = E.inOutC(seg(t, 16.32, 16.75));
  ctx.save();
  if (iris < 1) { ctx.beginPath(); ctx.arc(540, 980, iris * 1200 + 1, 0, 6.28); ctx.clip(); }
  paperBG(1);
  const z = lerp(1.35, .9, E.inOutQ(seg(t, 16.6, 22.2)));
  const vf = seg(t, 19.75, 19.95) * (1 - seg(t, 20.95, 21.15)); // viewfinder moment
  const sh = shake(t, vf * 10, 9);
  withCam({ x: 540 + sh.x, y: 1060 + sh.y, z, r: vf * .05 + sh.r }, () => {
    // Mahmoud rolls up his sleeves
    const roll = Math.max(0, Math.sin(seg(t, 16.5, 17.4) * Math.PI * 2));
    const ad = seg(t, 20.9, 21.3);
    drawMahmoud(540, 1560, {
      s: 1.15, expr: t < 17.4 ? 'frustrated' : (t < 19.7 ? 'excited' : 'think'), blink: blinkAt(t, 2),
      armL: t < 17.4 ? [.7 + roll * .4, 2.3] : [lerp(.3, 1.2, ad), lerp(.3, .9, ad)], armR: t < 17.4 ? [.7 + roll * .4, 2.3] : [.4 + Math.sin(t * 3) * .1, 1.6],
    });
    if (t < 17.6) txt('بنفسه', 540, 860, { size: 110, font: 'Ruqaa', weight: 700, color: C.graphite, alpha: seg(t, 16.75, 17.0) * (1 - seg(t, 17.35, 17.6)) });
    // 1) the page
    const pg = E.outBack(seg(t, 17.4, 17.8));
    if (pg > 0) phone(250, 820, { s: .9 * pg, rot: -.12 }, (o) => {
      ctx.fillStyle = '#CFC7B8'; ctx.fillRect(-150, -290, 300, 170);
      ctx.fillStyle = C.navy; ctx.beginPath(); ctx.arc(0, -120, 56, 0, 6.28); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.stroke();
      txt('م', 0, -116, { size: 54, weight: 900, color: C.bone });
      txt('معرض محمود', 0, -30, { size: 30, weight: 800, color: C.ink });
      txt('12 متابع', 0, 14, { size: 24, weight: 600, color: C.mute });
      for (let i = 0; i < 6; i++) { ctx.fillStyle = ['#D8CDBA', '#C9BBA2', '#E2D8C6'][i % 3]; ctx.fillRect(-126 + (i % 3) * 86, 60 + Math.floor(i / 3) * 86, 80, 80); }
    });
    // 2) photos burst out of the phone and pin around him
    const cards = [[790, 560, .12, C.fabric, sofaIcon], [860, 960, -.15, C.terracotta, chairIcon], [180, 1240, .2, '#D9B36A', lampIcon], [820, 1380, .08, C.sage, sofaIcon], [520, 420, -.08, '#8E7CC3', chairIcon], [140, 450, .25, C.fabric, lampIcon]];
    cards.forEach(([x, y, r, col, ic], i) => {
      const a = 18.55 + i * .13, k = E.outBack(seg(t, a, a + .4));
      if (k <= 0) return;
      postCard(lerp(250, x, k), lerp(820, y, k), { s: .62 * k, rot: r * k, color: col, icon: ic, liked: i % 2 });
      if (k >= 1) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(x, y - 112, 10, 0, 6.28); ctx.fill(); }
    });
    // 4) the paid ad: megaphone + coin
    const mg = E.outBack(seg(t, 20.95, 21.3));
    if (mg > 0) {
      megaphone(820, 1160, { s: 1.2 * mg, rot: -.35 });
      chip(820, 960, 'ممول', { col: C.ink, fg: C.gold, size: 38, alpha: seg(t, 21.2, 21.4), scale: E.outBack(seg(t, 21.2, 21.5)) });
      const cf = seg(t, 21.35, 21.9); if (cf > 0 && cf < 1) coin(780, lerp(500, 1120, E.inQ(cf)), .9, t * 12);
    }
  });
  // 3) handheld video: viewfinder overlay
  if (vf > 0) {
    ctx.save(); ctx.globalAlpha = vf; ctx.strokeStyle = '#fff'; ctx.lineWidth = 8;
    const m = 70, L = 90;
    for (const [x, y, dx, dy] of [[m, m + 100, 1, 1], [W - m, m + 100, -1, 1], [m, H - m - 100, 1, -1], [W - m, H - m - 100, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x, y + dy * L); ctx.lineTo(x, y); ctx.lineTo(x + dx * L, y); ctx.stroke(); }
    if (Math.floor(t * 3) % 2 === 0) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(130, 250, 16, 0, 6.28); ctx.fill(); }
    txt('REC', 200, 252, { size: 34, font: 'Inter Tight', weight: 800, color: '#fff', dir: 'ltr', align: 'left' });
    txt('00:0' + Math.floor((t - 19.75) * 4) % 10, W - 120, 252, { size: 34, font: 'Inter Tight', weight: 800, color: '#fff', dir: 'ltr' });
    ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W / 2 - 30, H / 2); ctx.lineTo(W / 2 + 30, H / 2); ctx.moveTo(W / 2, H / 2 - 30); ctx.lineTo(W / 2, H / 2 + 30); ctx.stroke();
    ctx.restore();
  }
  vignette(.25);
  ctx.restore();
});

// ── SC5: talking to nobody (22.15 → 34.73) ──────────────────
const CROWD = (() => { const r = rng(77), a = []; for (let i = 0; i < 10; i++) a.push([640 + (i % 4) * 120 + (Math.floor(i / 4) % 2) * 60 + (r() - .5) * 30, 1360 + Math.floor(i / 4) * 200 + (r() - .5) * 30, r()]); return a; })();
scene(22.15, 34.9, (t) => {
  // whip pan in from the previous scene
  const whip = 1 - E.outExpo(seg(t, 22.15, 22.6));
  paperBG(1);
  ctx.fillStyle = 'rgba(80,60,40,.06)'; ctx.fillRect(0, 0, W, H);
  const pull = E.inOutC(seg(t, 29.6, 31.2));
  if (pull < 1) {
    ctx.save(); ctx.globalAlpha = 1 - pull;
    withCam({ x: 540 + whip * 900 + seg(t, 22.6, 29.6) * 60, y: 1100, z: lerp(1, .8, pull) }, () => {
      // Mahmoud with megaphone
      const mouth = t < 26.6 ? Math.abs(Math.sin(t * 9)) : 0;
      drawMahmoud(260, 1640, { s: 1.05, expr: t < 26.6 ? 'excited' : 'think', mouth, blink: blinkAt(t, 1), armL: [.3, .2], armR: [1.55, .15], tilt: t < 26.6 ? -.05 : .08 });
      if (t < 26.8) megaphone(420, 1180, { s: .75, rot: -.18 });
      // sound waves that pass through everybody
      if (t < 26.8) for (let i = 0; i < 6; i++) {
        const p = ((t - 22.5) * .7 + i / 6) % 1; if (t < 22.5) break;
        ctx.save(); ctx.strokeStyle = rgba(C.red, (1 - p) * .8); ctx.lineWidth = 7; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(470, 1170, 60 + p * 900, -.45, .45); ctx.stroke(); ctx.restore();
      }
      // speech bubbles with no clear message (26.6 → 29.6)
      for (let i = 0; i < 4; i++) {
        const a = 26.75 + i * .55, k = seg(t, a, a + 1.1); if (k <= 0 || k >= 1) continue;
        const x = lerp(420, 820, E.inOutQ(k)), y = lerp(1060, 1180 - i * 60, k) - Math.sin(k * Math.PI) * 120;
        const burst = seg(k, .82, 1);
        ctx.save(); ctx.translate(x, y); ctx.scale(1 + burst * .6, 1 + burst * .6); ctx.globalAlpha = 1 - burst;
        ctx.fillStyle = '#fff'; ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-110, -60, 220, 120, 40); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-60, 56); ctx.lineTo(-90, 92); ctx.lineTo(-30, 58); ctx.fillStyle = '#fff'; ctx.fill();
        scribble(0, -12, 150, 30, 300 + i, 1, C.graphite, 5); scribble(0, 22, 110, 20, 400 + i, 1, C.mute, 4);
        ctx.restore();
      }
      // the crowd — blank, unaffected
      CROWD.forEach(([x, y, r], i) => {
        const bob = Math.sin(t * 2 + i) * 4;
        personToken(x, y + bob, 1.9, mixColor('#6E6A64', '#9A958C', r));
        const q = E.outBack(seg(t, 23.3 + r * .8, 23.6 + r * .8));
        if (q > 0) txt('؟', x + 6, y - 150 + bob, { size: 60 * q, weight: 900, color: t > 26.6 ? C.red : C.graphite });
      });
    });
    ctx.restore();
    // kinetic type
    const k1 = E.outBack(seg(t, 23.0, 23.4)), o1 = 1 - seg(t, 26.3, 26.6);
    txt('بيكلم مين؟', 540, 420, { size: 120 * Math.max(k1, .01), weight: 900, color: C.ink, alpha: Math.min(1, k1) * o1 });
    const k2 = E.outBack(seg(t, 27.2, 27.6)), o2 = 1 - seg(t, 29.4, 29.7);
    txt('ويقول إيه؟', 540, 420, { size: 120 * Math.max(k2, .01), weight: 900, color: C.ink, alpha: Math.min(1, k2) * o2 });
  }
  // c) a sea of identical shops (29.6 → 34.73)
  if (pull > 0) {
    ctx.save(); ctx.globalAlpha = pull;
    const grow = seg(t, 30.4, 33.6);
    const n = Math.round(lerp(1, 7, E.inQ(grow)));
    const z = lerp(1.25, .5, E.inOutC(grow));
    withCam({ x: 540, y: 1000, z, r: Math.sin(t * .6) * .02 }, () => {
      const cols = 2 * n + 1, rows = 2 * n + 3;
      for (let i = -n; i <= n; i++) for (let j = -n - 1; j <= n + 1; j++) {
        const d = Math.hypot(i, j); const app = seg(t, 30.4 + d * .22, 30.7 + d * .22);
        if (app <= 0) continue;
        const me = i === 0 && j === 0;
        miniShop(540 + i * 170, 1050 + j * 150, 1.15 * E.outBack(app), me ? '#D9CFBE' : '#D9CFBE', me ? 1 : .6);
      }
      // gold ring that loses itself
      const ring = 1 - seg(t, 33.0, 34.2);
      ctx.save(); ctx.strokeStyle = rgba(C.gold, ring); ctx.lineWidth = 6 / z; ctx.beginPath(); ctx.arc(540, 1010, 110, 0, 6.28); ctx.stroke(); ctx.restore();
      // confused customer in front
      personToken(540, 1220, 2.1, C.graphite);
      txt('؟', 540 + Math.sin(t * 4) * 40, 1060, { size: 90, weight: 900, color: C.red, alpha: seg(t, 31, 31.3) });
    });
    ctx.restore();
    const k3 = E.outBack(seg(t, 31.4, 31.8));
    ctx.save(); ctx.globalAlpha = Math.min(1, k3) * (1 - seg(t, 34.5, 34.9)); ctx.fillStyle = 'rgba(239,233,221,.92)'; ctx.beginPath(); ctx.roundRect(140, 300, 800, 200, 30); ctx.fill(); ctx.restore();
    txt('ليه يختاروك إنت؟', 540, 400, { size: 96 * Math.max(k3, .01), weight: 900, color: C.ink, alpha: Math.min(1, k3) * (1 - seg(t, 34.5, 34.9)) });
  }
  vignette(.3);
});

// ── SC6: the designer, the videographer (34.73 → 47.07) ─────
scene(34.73, 47.3, (t) => {
  paperBG(1);
  const z = lerp(1.05, 1, seg(t, 34.73, 39.7));
  // 1) the snap + logos without identity
  if (t < 39.8) {
    withCam({ x: 540, y: 960, z, r: 0 }, () => {
      const snap = seg(t, 34.9, 35.2);
      drawMahmoud(540, 1720, { s: 1.0, expr: t < 36.2 ? 'excited' : (t < 37.8 ? 'worried' : 'excited'), mouth: talkMouth(t, 34.8, 35.7) + talkMouth(t, 37.8, 38.8), blink: blinkAt(t, 3), armL: [.3, .2], armR: t < 36.2 || (t > 37.7 && t < 38.9) ? [2.4 - snap * .3, .5] : [.3, .2] });
      if (snap > 0 && snap < 1) { ctx.save(); ctx.strokeStyle = C.gold; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28, r0 = 30 + snap * 40, r1 = r0 + 30; ctx.beginPath(); ctx.moveTo(700 + Math.cos(a) * r0, 980 + Math.sin(a) * r0); ctx.lineTo(700 + Math.cos(a) * r1, 980 + Math.sin(a) * r1); ctx.stroke(); } ctx.restore(); }
      // 6 identities that don't match
      const pos = [[250, 420, -.2], [820, 380, .15], [180, 820, .1], [880, 760, -.12], [300, 1180, .18], [800, 1160, -.08]];
      pos.forEach(([x, y, r], i) => {
        const a = 36.1 + i * .16, k = E.outBack(seg(t, a, a + .3)); if (k <= 0) return;
        ctx.save(); ctx.translate(x, y); ctx.rotate(r + Math.sin(t * 3 + i) * .04 * (t > 37 ? 1 : 0)); logoVariant(i, 0, 0, 1.25 * k); ctx.restore();
      });
      // the missing identity: an empty dashed slot
      const sl = seg(t, 37.0, 37.3);
      if (sl > 0) { ctx.save(); ctx.globalAlpha = sl * (1 - seg(t, 37.75, 37.95)); ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.setLineDash([20, 16]); ctx.lineDashOffset = t * 40; ctx.beginPath(); ctx.arc(540, 780, 140, 0, 6.28); ctx.stroke(); ctx.restore(); txt('هوية؟', 540, 784, { size: 70, weight: 900, color: C.red, alpha: sl * (1 - seg(t, 37.75, 37.95)) }); }
      // the camera drops in with a flash
      const cm = seg(t, 37.85, 38.25);
      if (cm > 0) cameraIcon(540, lerp(-300, 760, E.outBounce(cm)), { s: 1.5, rec: Math.floor(t * 3) % 2 });
    });
    const fl = seg(t, 38.25, 38.6); if (fl > 0 && fl < 1) { ctx.fillStyle = `rgba(255,255,255,${(1 - fl) * .9})`; ctx.fillRect(0, 0, W, H); }
  }
  // 2) videos about everything and nothing (39.71 → 47.07)
  if (t >= 39.7) {
    const k = E.outExpo(seg(t, 39.7, 40.1));
    ctx.save(); ctx.globalAlpha = k;
    ctx.fillStyle = '#EFE9DD'; ctx.fillRect(0, 0, W, H); paperBG(1);
    const tangle = seg(t, 41.5, 43.6);
    const strips = [[-.35, 520, C.terracotta, [sofaIcon, pctIcon, chairIcon, priceIcon]], [.28, 980, C.fabric, [priceIcon, qIcon, lampIcon, pctIcon]], [-.12, 1440, '#8E7CC3', [chairIcon, sofaIcon, qIcon, priceIcon]]];
    strips.forEach(([ang, y, col, icons], si) => {
      const dir = si % 2 ? -1 : 1, off = (t - 39.7) * 260 * dir;
      ctx.save(); ctx.translate(540, y); ctx.rotate(ang + Math.sin(t * 1.3 + si) * .12 * tangle);
      ctx.fillStyle = C.ink; ctx.fillRect(-1400, -150, 2800, 300);
      for (let h = -30; h <= 30; h++) { ctx.fillStyle = '#EFE9DD'; ctx.fillRect(h * 46 + (off % 46), -136, 24, 16); ctx.fillRect(h * 46 + (off % 46), 120, 24, 16); }
      for (let f = -6; f <= 6; f++) {
        const fx = f * 240 + (off % 240), wav = Math.sin(fx * .01 + t * 3) * 40 * tangle;
        ctx.save(); ctx.translate(fx, wav); ctx.rotate(Math.sin(f + t) * .2 * tangle);
        ctx.fillStyle = mixColor(col, '#000000', (Math.abs(f) % 3) * .12); ctx.fillRect(-100, -100, 200, 200);
        ctx.save(); ctx.scale(.85, .85); icons[(f + 12) % 4]({ sketch: 0 }); ctx.restore();
        ctx.restore();
      }
      ctx.restore();
    });
    ctx.restore();
    // missing pieces: story / plan / order
    const bx = [[540, 640, 'قصة', 43.6], [540, 960, 'خطة', 44.3], [540, 1280, 'ترتيب', 45.0]];
    const panel = seg(t, 43.3, 43.6);
    if (panel > 0) { ctx.fillStyle = rgba('#EFE9DD', .88 * panel); ctx.fillRect(0, 0, W, H); }
    bx.forEach(([x, y, l, a]) => {
      const k2 = E.outBack(seg(t, a, a + .3)); if (k2 <= 0) return;
      ctx.save(); ctx.translate(x, y); ctx.scale(k2, k2); ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.setLineDash([22, 14]); ctx.beginPath(); ctx.roundRect(-300, -110, 600, 220, 30); ctx.stroke(); ctx.restore();
      txt(l, x, y + 4, { size: 110, weight: 900, color: C.ink, alpha: Math.min(1, k2) });
      sketchPath([[x - 220, y + 10], [x + 220, y - 14]], seg(t, a + .35, a + .6), { color: C.red, width: 12, seed: a * 10 });
    });
  }
  vignette(.28);
});

// ── SC7: pulled in four directions (47.07 → 52.73) ──────────
scene(47.07, 53.0, (t) => {
  const bg = seg(t, 47.07, 52.73);
  paperBG(1); ctx.fillStyle = `rgba(180,60,40,${bg * .1})`; ctx.fillRect(0, 0, W, H);
  const enter = E.outExpo(seg(t, 47.07, 47.5));
  const sh = shake(t, seg(t, 49.5, 52.7) * 9, 14);
  withCam({ x: 540 + sh.x, y: 1000 + sh.y, z: lerp(1.6, 1, enter) * lerp(1, .92, bg), r: sh.r }, () => {
    const pulls = [[47.15, 'عروض', -1, -1, C.terracotta, pctIcon], [48.35, 'أسعار', 1, -1, '#D9B36A', priceIcon], [49.4, 'منتجات', -1, 1, C.fabric, sofaIcon], [50.5, '؟', 1, 1, '#8E7CC3', qIcon]];
    const hands = { l: [430, 900], r: [650, 900] };
    pulls.forEach(([a, l, dx, dy, col, ic], i) => {
      const k = E.outBack(seg(t, a, a + .45)); if (k <= 0) return;
      const wob = Math.sin(t * 5 + i * 2) * 30 * seg(t, a + .4, a + 1.2), spin = seg(t, 51.4, 52.7) * (i % 2 ? 1 : -1) * 6.28 * .3;
      const ex = 540 + dx * (260 + 140 * k) + wob, ey = 1000 + dy * (480 + 120 * k) + wob * .5;
      // rope
      ctx.save(); ctx.strokeStyle = '#7A5A3A'; ctx.lineWidth = 8; ctx.setLineDash([16, 6]); ctx.beginPath(); ctx.moveTo(540 + dx * 90, 1000 + dy * 60); ctx.quadraticCurveTo(540 + dx * 160, 1000 + dy * 300 + Math.sin(t * 9 + i) * 10, ex, ey); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.translate(ex, ey); ctx.rotate(spin + dx * .1);
      postCard(0, 0, { s: .72, color: col, icon: ic });
      ctx.restore();
      chip(ex, ey + 180, l, { col: C.ink, fg: C.bone, size: 40, alpha: Math.min(1, k) });
      // arrow showing the pull direction
      arrowHead(ex + dx * 150, ey + dy * 40, Math.atan2(dy * .4, dx), 40, C.red);
    });
    const stretch = seg(t, 47.2, 51);
    drawMahmoud(540, 1300, { s: 1.0, expr: t < 49 ? 'worried' : 'frustrated', sweat: seg(t, 49.2, 49.6), blink: blinkAt(t, 4), armL: [1.3 + Math.sin(t * 7) * .15 * stretch, .1], armR: [1.3 + Math.cos(t * 7) * .15 * stretch, .1], lean: Math.sin(t * 6) * .06 * stretch, tilt: Math.sin(t * 5) * .08 * stretch });
  });
  vignette(.35);
});

// ── SC8: the leaking budget (52.73 → 57.42) ─────────────────
const PIPE = [[540, 420], [540, 620], [240, 620], [240, 860], [840, 860], [840, 1100], [300, 1100], [300, 1340], [700, 1340], [700, 1560], [540, 1560], [540, 1660]];
const PL = (() => { let a = [0]; for (let i = 1; i < PIPE.length; i++) a.push(a[i - 1] + Math.hypot(PIPE[i][0] - PIPE[i - 1][0], PIPE[i][1] - PIPE[i - 1][1])); return a; })();
function pipeAt(d) { for (let i = 1; i < PIPE.length; i++) if (d <= PL[i]) { const f = (d - PL[i - 1]) / (PL[i] - PL[i - 1]); return [lerp(PIPE[i - 1][0], PIPE[i][0], f), lerp(PIPE[i - 1][1], PIPE[i][1], f), i]; } return [...PIPE[PIPE.length - 1], PIPE.length]; }
scene(52.73, 57.6, (t) => {
  const lt = t - 52.73, ink = seg(t, 52.73, 57.4);
  paperBG(1); ctx.fillStyle = `rgba(30,25,20,${.08 + ink * .25})`; ctx.fillRect(0, 0, W, H);
  const enter = E.outC(seg(t, 52.73, 53.3));
  withCam({ x: 540, y: lerp(700, 1000, enter), z: lerp(1.5, 1, enter) }, () => {
    // funnel
    ctx.save(); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(380, 260); ctx.lineTo(700, 260); ctx.lineTo(580, 420); ctx.lineTo(500, 420); ctx.closePath(); ctx.fill(); ctx.restore();
    txt('تسويق', 540, 318, { size: 50, weight: 900, color: C.gold });
    // pipes
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const draw = (lw, col) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); PIPE.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
    draw(70, C.ink); draw(52, '#6B6F7A'); draw(14, 'rgba(255,255,255,.18)');
    ctx.restore();
    // leaks at the joints
    const leaks = [2, 4, 6, 8, 9];
    leaks.forEach((j) => { const [x, y] = PIPE[j]; ctx.save(); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(x, y, 14, 0, 6.28); ctx.fill(); ctx.restore(); });
    // coins: most escape before the end
    for (let i = 0; i < 46; i++) {
      const born = i * .1; if (lt < born) continue;
      const leakJ = (i * 7) % 7 < 5 ? leaks[(i * 3) % 5] : 99;
      const d = (lt - born) * 900;
      const stop = leakJ < 99 ? PL[leakJ] : PL[PL.length - 1] + 200;
      if (d < stop) { const [x, y] = pipeAt(Math.min(d, PL[PL.length - 1])); if (d <= PL[PL.length - 1]) coin(x, y, .45, lt * 8 + i); else { const f = (d - PL[PL.length - 1]) / 200; coin(540, 1660 + f * 60, .3, i, { alpha: 1 - f }); } }
      else {
        const ft = (d - stop) / 900, [x0, y0] = PIPE[leakJ], vx = (i % 2 ? 1 : -1) * (300 + (i % 5) * 80);
        coin(x0 + vx * ft, y0 - 300 * ft + 1400 * ft * ft, .4, lt * 10 + i, { alpha: clamp(1 - ft) });
      }
    }
    // the result: a tiny cup
    ctx.save(); ctx.fillStyle = C.cream; ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(480, 1700); ctx.lineTo(600, 1700); ctx.lineTo(585, 1800); ctx.lineTo(495, 1800); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    txt('نتيجة', 540, 1860, { size: 40, weight: 800, color: C.ink });
    // Mahmoud, drained
    drawMahmoud(900, 1820, { s: .72, expr: 'tired', sweat: 1, blink: blinkAt(t, 5), armL: [.08, .1], armR: [.08, .1], lean: .05, tilt: .1 });
  });
  // budget bar
  const lvl = lerp(1, .12, E.inOutQ(seg(t, 53.2, 57.2)));
  ctx.save(); ctx.translate(90, 520);
  ctx.fillStyle = 'rgba(11,11,13,.85)'; ctx.beginPath(); ctx.roundRect(-34, -20, 68, 840, 34); ctx.fill();
  ctx.fillStyle = mixColor(C.red, C.sage, lvl); ctx.beginPath(); ctx.roundRect(-20, 6 + 794 * (1 - lvl), 40, 794 * lvl, 20); ctx.fill();
  ctx.restore();
  txt('الميزانية', 90, 470, { size: 30, weight: 800, color: C.ink });
  txt(Math.round(lvl * 100) + '%', 90, 1400, { size: 40, font: 'Inter Tight', weight: 900, color: C.ink, dir: 'ltr' });
  vignette(.45);
});

// ── SC9: the agency tower (57.42 → 59.25) ───────────────────
function tower(x, y, s, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(-300, -2600, 300, 0); g.addColorStop(0, '#2B3550'); g.addColorStop(1, '#0F1422');
  ctx.fillStyle = g; ctx.fillRect(-300, -2600, 600, 2600);
  ctx.fillStyle = 'rgba(160,190,255,.08)'; for (let i = 0; i < 40; i++) for (let j = 0; j < 6; j++) if ((i * 7 + j * 3) % 5) ctx.fillRect(-270 + j * 92, -2560 + i * 64, 76, 46);
  ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.beginPath(); ctx.moveTo(-300, -2600); ctx.lineTo(-100, -2600); ctx.lineTo(300, -1700); ctx.lineTo(300, -1400); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#0A0D16'; ctx.fillRect(-90, -260, 180, 260); ctx.fillStyle = 'rgba(201,163,91,.6)'; ctx.fillRect(-80, -250, 160, 240);
  txt('شركة تسويق', 0, -320, { size: 52, weight: 800, color: C.gold });
  ctx.restore();
}
scene(57.42, 59.5, (t) => {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0B0E18'); g.addColorStop(1, '#2A2E3C'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const tilt = E.inOutC(seg(t, 57.9, 59.2));
  withCam({ x: 540, y: lerp(1400, 300, tilt), z: lerp(1, .7, tilt) }, () => {
    ctx.fillStyle = '#1A1C24'; ctx.fillRect(-800, 1700, 2600, 900);
    tower(700, 1700, 1);
    const w = seg(t, 57.42, 59.25);
    drawMahmoud(lerp(-80, 420, w), 1700, { s: .85, side: true, walk: (t * 1.5) % 1 });
  });
  vignette(.6);
});

// ── SC10: the price wall (59.25 → 68.81) ────────────────────
scene(59.25, 69.1, (t) => {
  ctx.fillStyle = '#0B0C10'; ctx.fillRect(0, 0, W, H);
  const lt = t - 59.25;
  const grow = E.inOutC(seg(t, 63.8, 66.8));
  const leave = seg(t, 66.4, 68.7);
  const hit1 = 61.2, hit2 = 62.15;
  const sh = shake(t, (t > hit1 && t < hit1 + .35 ? 26 * (1 - seg(t, hit1, hit1 + .35)) : 0) + (t > hit2 && t < hit2 + .45 ? 36 * (1 - seg(t, hit2, hit2 + .45)) : 0));
  const z = lerp(1, .62, grow);
  withCam({ x: 540 + sh.x, y: lerp(1100, 1000, grow) + sh.y, z, r: sh.r }, () => {
    // floor + spotlight
    ctx.fillStyle = '#15161C'; ctx.fillRect(-1200, 1720, 3600, 1400);
    const mx = lerp(540, -260, E.inQ(leave));
    const spotA = 1 - seg(t, 67.6, 68.7);
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = spotA;
    ctx.fillStyle = radial(mx, 1730, 260, 'rgba(255,230,180,.35)', 'rgba(0,0,0,0)'); ctx.fillRect(mx - 300, 1430, 600, 600);
    const cone = ctx.createLinearGradient(0, -400, 0, 1730); cone.addColorStop(0, 'rgba(255,230,180,0)'); cone.addColorStop(1, 'rgba(255,230,180,.14)');
    ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(mx - 40, -400); ctx.lineTo(mx + 40, -400); ctx.lineTo(mx + 240, 1730); ctx.lineTo(mx - 240, 1730); ctx.fill();
    ctx.restore();
    // giant numbers
    const drop = (a, y0, y1) => y1 - (1 - E.outBounce(seg(t, a - .3, a + .25))) * 2200;
    const sc = lerp(1, 1.5, grow), fade = 1 - seg(t, 67.4, 68.6);
    if (t > hit1 - .3) bigNumber3D('30,000', 540, drop(hit1, 0, 1050 - grow * 300), 200 * sc, 55, { face: C.bone, side: '#7C756A', alpha: fade });
    if (t > hit2 - .3) bigNumber3D('40,000', 540, drop(hit2, 0, 1400 - grow * 120), 235 * sc, 65, { face: '#E7735A', side: '#7A3426', alpha: fade });
    const eg = E.outBack(seg(t, 62.8, 63.2));
    if (eg > 0) chip(540, 1850, 'جنيه / شهريًا', { col: C.bone, fg: C.ink, size: 40, scale: eg, alpha: fade });
    // dust on impacts
    for (const [a, y] of [[hit1, 1060], [hit2, 1430]]) { const d = seg(t, a, a + .9); if (d > 0 && d < 1) { ctx.save(); ctx.globalAlpha = (1 - d) * .5; ctx.fillStyle = '#8C857A'; for (let i = 0; i < 14; i++) { const ang = (i / 14) * Math.PI, r0 = 260 + d * 320; ctx.beginPath(); ctx.arc(540 + Math.cos(ang) * r0 * 1.6, y - Math.sin(ang) * 30 - d * 40, 20 + d * 40, 0, 6.28); ctx.fill(); } ctx.restore(); } }
    // the shadow the numbers cast on him
    ctx.fillStyle = `rgba(0,0,0,${grow * .45})`; ctx.fillRect(-1200, 1500, 3600, 260);
    // tiny Mahmoud
    if (leave <= 0) drawMahmoud(540, 1730, { s: .5, expr: t < 63.8 ? 'shock' : 'sad', blink: blinkAt(t, 6), look: [0, -1], armL: [.1, .1], armR: [.1, .1], tilt: t > 63.8 ? .12 : 0 });
    else drawMahmoud(mx, 1730, { s: .5, side: true, flip: -1, walk: (t * 1.2) % 1, alpha: spotA });
    if (leave > 0) { ctx.save(); ctx.globalAlpha = spotA * .5; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(mx + 200, 1745, 220, 14, 0, 0, 6.28); ctx.fill(); ctx.restore(); }
  });
  vignette(.7);
  txt('لوحده', 540, 400, { size: 90, font: 'Ruqaa', weight: 700, color: rgba(C.bone, .9), alpha: seg(t, 67.0, 67.4) * (1 - seg(t, 68.2, 68.7)) });
});
