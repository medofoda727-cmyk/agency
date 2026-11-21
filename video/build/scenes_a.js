// ─────────────────────────────────────────────────────────────
//  ACT I — Hook · Dream · Problem   (0 → 16.3s)
// ─────────────────────────────────────────────────────────────

// world of the opening night: shop, ribbon, Mahmoud
function openingWorld(tt, o = {}) {
  const sk = o.sketch || 0;
  // sky + street
  if (sk < 1) {
    ctx.save(); ctx.globalAlpha *= 1 - sk;
    const g = ctx.createLinearGradient(0, -400, 0, 1500); g.addColorStop(0, '#141A2E'); g.addColorStop(.7, '#3A2E3C'); g.addColorStop(1, '#6B4A3A');
    ctx.fillStyle = g; ctx.fillRect(-1200, -1600, 3500, 3100);
    ctx.fillStyle = '#2B2A30'; ctx.fillRect(-1200, 1500, 3500, 1600);
    ctx.fillStyle = '#3A3940'; ctx.fillRect(-1200, 1500, 3500, 40);
    ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 6; ctx.setLineDash([60, 50]); ctx.beginPath(); ctx.moveTo(-1200, 2000); ctx.lineTo(2300, 2000); ctx.stroke(); ctx.setLineDash([]);
    // neighbours (dark, closed)
    miniShop(-520, 1500, 4.2, '#2A2F3E', 0); miniShop(1600, 1500, 4.2, '#2F2A36', 0);
    ctx.restore();
  }
  showroom(540, 1500, { s: 1.15, sketch: sk, lit: 1 - sk * .7, signText: 'معرض محمود' });
  // ribbon
  const cut = seg(tt, .45, 1.4);
  const rib = (side) => {
    ctx.save(); const ax = side < 0 ? 140 : 940; ctx.translate(ax, 1290);
    ctx.rotate(side * -E.outBounce(cut) * 1.25);
    ctx.strokeStyle = sk > .5 ? C.graphite : '#B82E2E'; ctx.lineWidth = sk > .5 ? 4 : 26; ctx.lineCap = 'round';
    const len = cut > 0 ? 400 : 400; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(side * -len * .5, 22, side * -len, cut > 0 ? 6 : 0); ctx.stroke();
    if (sk > .5) { ctx.beginPath(); ctx.moveTo(0, 22); ctx.quadraticCurveTo(side * -len * .5, 44, side * -len, 28); ctx.stroke(); }
    ctx.restore();
  };
  rib(-1); rib(1);
  // bow on the left post
  if (sk < 1) { ctx.save(); ctx.globalAlpha *= 1 - sk; ctx.fillStyle = '#B82E2E'; ctx.beginPath(); ctx.ellipse(110, 1270, 40, 26, -.5, 0, 6.28); ctx.ellipse(170, 1270, 40, 26, .5, 0, 6.28); ctx.fill(); ctx.restore(); }
  // Mahmoud
  const lower = seg(tt, 1.5, 2.2);
  const up = E.outBack(seg(tt, .45, .75)) * (1 - E.inOutQ(lower));
  drawMahmoud(330, 1640, {
    s: 1.08, sketch: sk, expr: tt < 1.55 ? 'excited' : 'worried', blink: blinkAt(tt),
    armL: [lerp(.2, 2.7, up), lerp(.1, .3, up)], armR: [lerp(.3, 2.5, up), lerp(.2, .2, up)],
    look: tt > 1.6 ? [Math.sin((tt - 1.6) * 5) > 0 ? 1 : -1, 0] : [0, -.3],
  });
  // giant gold scissors (close → snip at .45, then fly away)
  const sc = seg(tt, 0, .45), away = E.inExpo(seg(tt, .55, 1.0));
  if (away < 1 && sk < .9) {
    ctx.save(); ctx.translate(540 + away * 900, 1300 - away * 700); ctx.rotate(-.25 + away * 1.4); ctx.globalAlpha *= 1 - sk;
    const open = (1 - E.inC(sc)) * .55;
    for (const d of [-1, 1]) {
      ctx.save(); ctx.rotate(d * open);
      const g = ctx.createLinearGradient(0, -20, 0, 20); g.addColorStop(0, '#F3DCA4'); g.addColorStop(1, C.goldDeep);
      ctx.fillStyle = g; ctx.strokeStyle = C.ink; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(330, d * -8); ctx.lineTo(330, d * 6); ctx.lineTo(-40, d * 22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(-110, d * 40, 64, 40, d * .3, 0, 6.28); ctx.lineWidth = 22; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 14; ctx.strokeStyle = C.gold; ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(0, 0, 12, 0, 6.28); ctx.fill();
    ctx.restore();
  }
  if (sk < .8) { ctx.save(); ctx.globalAlpha *= 1 - sk; confetti(tt, .45, 540, 1240, 90, 9, { floor: 1560 + 0, g: 1300 }); ctx.restore(); }
}

scene(0, 3.35, (t) => {
  const rewind = seg(t, 2.35, 3.35);
  const tt = rewind > 0 ? lerp(2.3, 0, E.inOutQ(rewind)) : t;
  const sk = E.inOutQ(seg(t, 2.55, 3.25));
  // camera: tight on ribbon → whip back → wide empty street
  let z = lerp(2.25, 1.0, E.outExpo(seg(t, .5, 1.25)));
  z = lerp(z, .62, E.inOutC(seg(t, 1.25, 2.3)));
  let cy = lerp(1290, 1300, seg(t, .5, 1.2)); cy = lerp(cy, 1180, E.inOutC(seg(t, 1.25, 2.3)));
  if (rewind > 0) { z = lerp(.62, .78, E.inOutQ(rewind)); cy = lerp(1180, 1150, rewind); }
  const sh = shake(t, t > .45 && t < .7 ? 14 * (1 - seg(t, .45, .7)) : 0);
  // background: paper bleeds in during the rewind
  if (sk > 0) paperBG(sk);
  withCam({ x: 540 + sh.x, y: cy + sh.y, z, r: sh.r }, () => openingWorld(tt, { sketch: sk }));
  // the "nobody came" counter
  const cnt = seg(t, 1.6, 1.85) * (1 - seg(t, 2.35, 2.6));
  if (cnt > 0) {
    ctx.save(); ctx.globalAlpha = cnt; ctx.translate(540, 300 + (1 - E.outBack(cnt)) * 40);
    ctx.fillStyle = 'rgba(11,11,13,.72)'; ctx.beginPath(); ctx.roundRect(-190, -70, 380, 140, 70); ctx.fill();
    ctx.strokeStyle = C.bone; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(-90, 0, 46, 28, 0, 0, 6.28); ctx.stroke(); ctx.fillStyle = C.bone; ctx.beginPath(); ctx.arc(-90, 0, 13, 0, 6.28); ctx.fill();
    txt('0', 40, 6, { size: 96, font: 'Inter Tight', weight: 900, color: C.bone, dir: 'ltr' });
    txt('زائر', 122, 10, { size: 34, weight: 600, color: C.mute });
    ctx.restore();
  }
  if (sk < 1) vignette(.6 * (1 - sk));
  rewindFX(Math.sin(rewind * Math.PI) * .9, t);
});

// ── ACT I-b : the dream, sketched → built  (3.35 → 10.39) ──
function roomWorld(t, o) {
  // one-point perspective room, drawn on paper then coloured
  const draw = o.draw, col = o.col;
  const BW = [240, 520, 840, 1120]; // back wall x0,y0,x1,y1
  const fl = [[-200, 1760], [1280, 1760]];
  const pts = { back: rectPts(240, 520, 600, 600) };
  if (col > 0) {
    ctx.save(); ctx.globalAlpha *= col;
    ctx.fillStyle = '#E8DCC6'; ctx.fillRect(240, 520, 600, 600);
    ctx.fillStyle = '#D9C9AE'; ctx.beginPath(); ctx.moveTo(240, 520); ctx.lineTo(-200, 80); ctx.lineTo(-200, 1760); ctx.lineTo(240, 1120); ctx.fill();
    ctx.beginPath(); ctx.moveTo(840, 520); ctx.lineTo(1280, 80); ctx.lineTo(1280, 1760); ctx.lineTo(840, 1120); ctx.fill();
    const fg = ctx.createLinearGradient(0, 1120, 0, 1760); fg.addColorStop(0, '#B98A5E'); fg.addColorStop(1, '#8E6340');
    ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(240, 1120); ctx.lineTo(840, 1120); ctx.lineTo(1280, 1760); ctx.lineTo(-200, 1760); ctx.fill();
    ctx.strokeStyle = 'rgba(60,35,20,.25)'; ctx.lineWidth = 3;
    for (let i = 1; i < 9; i++) { const f = i / 9; ctx.beginPath(); ctx.moveTo(lerp(240, 840, f), 1120); ctx.lineTo(lerp(-200, 1280, f), 1760); ctx.stroke(); }
    // window light on back wall
    ctx.fillStyle = 'rgba(255,240,200,.35)'; ctx.beginPath(); ctx.moveTo(-200, 300); ctx.lineTo(240, 640); ctx.lineTo(240, 900); ctx.lineTo(-200, 700); ctx.fill();
    ctx.restore();
  }
  const lines = [rectPts(240, 520, 600, 600), [[240, 520], [-200, 80]], [[840, 520], [1280, 80]], [[240, 1120], [-200, 1760]], [[840, 1120], [1280, 1760]]];
  lines.forEach((l, i) => sketchPath(l, seg(draw, i * .16, i * .16 + .3), { width: 5, seed: 50 + i, closed: i === 0, alpha: 1 - col * .4 }));
  return lines;
}

scene(3.35, 10.39, (t) => {
  paperBG(1);
  // 1) sketch Mahmoud dreams (3.35 → 4.6)
  const dive = E.inOutExpo(seg(t, 4.45, 5.25));
  if (t < 5.3) {
    const cam = { x: lerp(540, 540, dive), y: lerp(1100, 700, dive), z: lerp(1, 5.5, dive) };
    withCam(cam, () => {
      showroom(540, 1650, { s: .78, sketch: 1, reveal: 1 - seg(t, 3.35, 3.9), alpha: 1 - seg(t, 3.6, 3.9) });
      drawMahmoud(540, 1560, { s: 1.15, sketch: 1, expr: 'happy', look: [.4, -1], armL: [.3, 2.2], armR: [.2, .1] });
      // thought bubble drawn by the nib
      const b = seg(t, 3.55, 4.3);
      sketchPath(ellipsePts(620, 960, 16, 14, 20), seg(b, 0, .2), { width: 4, seed: 3, closed: true });
      sketchPath(ellipsePts(660, 900, 26, 22, 24), seg(b, .1, .3), { width: 4, seed: 4, closed: true });
      const cl = []; for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2; const rr2 = 1 + .09 * Math.sin(a * 9); cl.push([540 + Math.cos(a) * 330 * rr2, 640 + Math.sin(a) * 230 * rr2]); }
      sketchPath(cl, seg(b, .25, 1), { width: 5, seed: 5 });
      // a tiny dream inside
      sofa(540, 720, { s: .7, sketch: 1, reveal: seg(t, 4.0, 4.45) });
      floorLamp(760, 720, { s: .5, sketch: 1, reveal: seg(t, 4.15, 4.5) });
      plant(330, 720, { s: .5, sketch: 1, reveal: seg(t, 4.2, 4.5) });
      const nibp = cl[Math.floor(seg(b, .25, 1) * 119)];
      if (b > 0 && b < 1) drawNib(nibp[0], nibp[1], .55, -.5);
    });
    if (dive > .7) { ctx.fillStyle = rgba(C.paper, (dive - .7) / .3); ctx.fillRect(0, 0, W, H); }
  }
  // 2) the room gets built (5.25 → 8.9)
  if (t >= 5.25) {
    const pull = E.inOutExpo(seg(t, 8.85, 9.45));
    const drift = seg(t, 5.25, 8.9);
    const cam = { x: 540 + Math.sin(drift * 2) * 30, y: lerp(1000, 1080, drift), z: lerp(1.12, 1.0, E.outC(drift)) * lerp(1, .32, pull), r: lerp(-.015, .01, drift) };
    const appear = E.outC(seg(t, 5.25, 5.6));
    ctx.save(); ctx.globalAlpha = appear;
    withCam(cam, () => {
      const draw = seg(t, 5.25, 6.05), col = E.inOutQ(seg(t, 5.95, 6.5));
      roomWorld(t, { draw, col });
      // nib building the lines
      if (draw > 0 && draw < 1) { const l = [[240, 520], [840, 520], [840, 1120], [240, 1120], [-200, 1760]]; const k = draw * 4, i = Math.min(3, Math.floor(k)), f = k - i; drawNib(lerp(l[i][0], l[i + 1][0], f), lerp(l[i][1], l[i + 1][1], f), .9, -.55); }
      // decor
      const fr = (a) => E.outBack(seg(t, a, a + .35));
      if (t > 7.75) { frame(420, 760, { s: fr(7.75) }); frame(640, 720, { s: fr(7.9) * .8 }); }
      const rugK = E.outC(seg(t, 7.9, 8.35)); if (rugK > 0) { ctx.save(); ctx.translate(540, 1420); ctx.scale(rugK, 1); rug(0, 0, { s: 1.1 }); ctx.restore(); }
      // furniture drops: sketch → colour after landing
      const drops = [[6.45, (o) => shelf(700, 1150, o), 1], [6.65, (o) => sofa(540, 1380, o), 1.25], [6.9, (o) => armchair(900, 1560, o), 1.15], [7.1, (o) => floorLamp(200, 1500, o), 1.2], [7.3, (o) => plant(110, 1700, o), 1.1], [7.45, (o) => sideTable(330, 1440, o), 1]];
      for (const [a, fn, s] of drops) {
        if (t < a) continue;
        const k = seg(t, a, a + .45), y = -900 * (1 - E.outBounce(k));
        const lamp = fn.toString().includes('floorLamp') ? E.inOutQ(seg(t, 8.1, 8.4)) : 0;
        ctx.save(); ctx.translate(0, y); fn({ s, sketch: 1 - E.inOutQ(seg(t, a + .35, a + .75)), on: lamp }); ctx.restore();
      }
      // Mahmoud walks in (side) and turns to us, proud
      if (t > 7.6) {
        const w = seg(t, 7.6, 8.5), x = lerp(1250, 620, E.outQ(w));
        if (w < 1) drawMahmoud(x, 1700, { s: 1.1, side: true, flip: -1, walk: (t * 1.6) % 1 });
        else drawMahmoud(620, 1700, { s: 1.1, expr: 'proud', blink: blinkAt(t), armL: [.5, 1.9], armR: [.5, 1.9] });
      }
      lightLeak(200, 1150, 500, 'rgba(255,200,120,.6)', E.inOutQ(seg(t, 8.1, 8.5)) * .6);
    });
    ctx.restore();
    vignette(.25);
  }
  // 3) cut to the facade: the doors open (9.25 → 10.39)
  if (t >= 9.2) {
    const k = E.outExpo(seg(t, 9.2, 9.6));
    ctx.save(); ctx.globalAlpha = k;
    const z = lerp(1.9, .92, k) * lerp(1, 1.04, seg(t, 9.6, 10.39));
    withCam({ x: 540, y: lerp(1150, 1180, k), z }, () => {
      openingWorld(Math.max(0, t - 9.55));
      // OPEN sign flips on the door
      const flip = seg(t, 9.75, 10.05);
      ctx.save(); ctx.translate(805, 1095); ctx.scale(1.15, 1.15 * Math.abs(Math.cos(flip * Math.PI)));
      ctx.fillStyle = flip > .5 ? C.gold : C.ink; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-70, -32, 140, 64, 10); ctx.fill(); ctx.stroke();
      txt(flip > .5 ? 'مفتوح' : 'مغلق', 0, 2, { size: 34, weight: 800, color: flip > .5 ? C.ink : C.bone });
      ctx.restore();
    });
    ctx.restore();
    vignette(.4);
    lightLeak(800, 1100, 600, 'rgba(255,200,120,.7)', seg(t, 9.95, 10.3) * .5);
  }
});

// ── ACT I-c : open ≠ known  (10.39 → 16.32) ─────────────────
scene(10.39, 16.6, (t) => {
  // crane up from the facade into a top-down city
  const up = E.inOutC(seg(t, 10.39, 11.9));
  const toMap = E.inOutExpo(seg(t, 11.5, 12.5));
  if (toMap < 1) {
    ctx.save(); ctx.globalAlpha = 1 - toMap;
    withCam({ x: 540, y: lerp(1180, 900, up), z: lerp(.96, .55, up) }, () => {
      openingWorld(3, { sketch: 0 });
      // desaturating "nobody" street
    });
    ctx.fillStyle = `rgba(14,18,32,${up * .45})`; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  if (toMap > 0) {
    ctx.save(); ctx.globalAlpha = toMap;
    const z = lerp(3.2, 1.0, E.outC(seg(t, 11.5, 13.2)));
    const sway = seg(t, 13.2, 16.6);
    withCam({ x: lerp(540, 540, sway), y: lerp(1050, 980, sway), z: z * lerp(1, 1.06, sway), r: lerp(.05, 0, E.outC(seg(t, 11.5, 13.2))) }, () => {
      drawCity(t, { visible: 0 });
      // the invisible dome around the shop
      const S = CITY.shop, d = seg(t, 12.3, 13.0);
      ctx.save(); ctx.strokeStyle = 'rgba(236,232,225,.35)'; ctx.lineWidth = 3; ctx.setLineDash([12, 14]); ctx.lineDashOffset = -t * 30;
      ctx.beginPath(); ctx.arc(S.x, S.y, 170 * E.outBack(d), 0, 6.28); ctx.stroke(); ctx.restore();
      // sonar pings that nobody answers
      for (let i = 0; i < 3; i++) { const p = ((t - 12.6 + i * .7) % 2.1) / 2.1; if (t < 12.6) break; ctx.save(); ctx.strokeStyle = rgba(C.gold, (1 - p) * .6); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(S.x, S.y, 60 + p * 160, 0, 6.28); ctx.stroke(); ctx.restore(); }
    });
    ctx.restore();
    vignette(.55);
    // typography: مفتوح ≠ معروف
    const a1 = E.outBack(seg(t, 13.35, 13.75)), a2 = E.outBack(seg(t, 14.3, 14.6)), a3 = E.outBack(seg(t, 14.75, 15.15));
    if (a1 > 0) {
      ctx.save(); ctx.globalAlpha = Math.min(1, seg(t, 13.35, 13.6)) * (1 - seg(t, 16.25, 16.6));
      ctx.fillStyle = 'rgba(8,10,18,.75)'; ctx.beginPath(); ctx.roundRect(70, 230, 940, 230, 40); ctx.fill(); ctx.restore();
      const out = 1 - seg(t, 16.25, 16.6);
      txt('مفتوح', 790, 345 + (1 - a1) * 40, { size: 112, weight: 900, color: C.bone, alpha: Math.min(1, a1) * out });
      txt('≠', 545, 340, { size: 140 * Math.max(.01, a2), font: 'Inter Tight', weight: 900, color: C.gold, dir: 'ltr', alpha: Math.min(1, a2) * out });
      txt('معروف', 285, 345 + (1 - a3) * 40, { size: 112, weight: 900, color: '#E7735A', alpha: Math.min(1, a3) * out });
    }
  }
});
