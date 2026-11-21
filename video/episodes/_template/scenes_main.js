// ─────────────────────────────────────────────────────────────
//  Starter scenes — one example per series world. Replace freely,
//  but keep the beat order and signatures from SERIES_BIBLE §2.
// ─────────────────────────────────────────────────────────────

// Paper world: the dream is sketched by the nib, then coloured
scene(0, 9, (t) => {
  paperBG(1);
  const draw = seg(t, .3, 2.2), col = E.inOutQ(seg(t, 2.2, 3));
  withCam({ x: 540, y: 1100, z: lerp(1.1, 1, seg(t, 0, 9)) }, () => {
    const box = rectPts(240, 700, 600, 600);
    sketchPath(box, draw, { width: 5, seed: 1, closed: true });
    if (draw > 0 && draw < 1) { const k = draw * 4, i = Math.min(3, Math.floor(k)), f = k - i, a = box[i], b = box[(i + 1) % 4]; drawNib(lerp(a[0], b[0], f), lerp(a[1], b[1], f), .9, -.55); }
    sofa(470, 1260, { s: 1.0, sketch: 1 - col, reveal: seg(t, 1.5, 2.5) });
    drawMahmoud(820, 1700, { cast: HERO, s: 1.0, expr: 'happy', sketch: 1 - col, blink: blinkAt(t) });
  });
  vignette(.25);
});

// Turn → system world: silence, one gold point, the line, "ابدأ صح"
scene(9, 20, (t) => {
  navyBG(E.inOutQ(seg(t, 9, 10))); goldGrid(seg(t, 10, 11.5), .08);
  const line = E.inOutExpo(seg(t, 9.6, 10.8));
  ctx.save(); ctx.strokeStyle = C.gold; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.shadowColor = C.gold; ctx.shadowBlur = 24;
  ctx.beginPath(); ctx.moveTo(lerp(540, 60, line), 960); ctx.lineTo(lerp(540, 1020, line), 960); ctx.stroke(); ctx.restore();
  goldText('ابدأ صح', 540, 520, 190, { p: E.inOutQ(seg(t, 11, 12)) });
  drawMahmoud(540, 1600, { cast: HERO, s: .9, expr: 'aha', sparkle: seg(t, 11.5, 12), blink: blinkAt(t) });
  vignette(.5);
});

// CTA — the series sign-off
scene(20, DUR, (t) => {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
  const slam = seg(t, 20.3, 20.6);
  if (slam > 0) { ctx.save(); ctx.translate(540, 880); const s = lerp(1.6, 1, E.outExpo(slam)); ctx.scale(s, s); bigNumber3D('START', 0, 90, 250, 46, { face: C.gold, side: C.goldDeep }); ctx.restore(); }
  goldText('بخطة.', 540, 1300, 160, { p: E.inOutQ(seg(t, 21, 21.8)) });
  const lg = E.outC(seg(t, 22, 22.8)), im = ASSETS.logoFull;
  if (lg > 0) { ctx.save(); ctx.globalAlpha = lg; ctx.drawImage(im, 540 - im.width * .25, 230 - im.height * .25, im.width * .5, im.height * .5); ctx.restore(); chip(540, 1600, 'ابعتلنا  START', { col: 'rgba(0,0,0,0)', fg: C.gold, size: 46, outline: C.gold, alpha: lg, pad: 44 }); }
});
