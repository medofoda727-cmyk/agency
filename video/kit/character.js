// ─────────────────────────────────────────────────────────────
//  CHARACTER RIG — front + side, one design language for the whole
//  series. Feet at (0,0). Full height ≈ 560 units at s = 1.
//  Cast members are LOOKS on the same rig (colours, hair, beard,
//  glasses, hijab) so every episode's lead feels like one family.
//  drawMahmoud(x, y, opt) = drawCharacter with the default look;
//  pass opt.cast = CAST.sara (or any partial look) for others.
// ─────────────────────────────────────────────────────────────
const LOOK_DEFAULT = {
  skin: '#C98E62', skinShade: '#A9714B', hair: '#1C1715', suit: '#1E2A47', suit2: '#16203A',
  shirt: '#F4F1EA', trouser: '#34343C', shoe: '#5A3B26', pin: '#C9A35B',
  hairStyle: 'side', beard: true, glasses: false, hijab: null,
};
const CAST = {
  mahmoud: {},                                                     // EP01 — furniture showroom
  sara: { skin: '#D7A27A', skinShade: '#B9835C', hairStyle: 'hijab', hijab: '#8A4B3C', beard: false, suit: '#C8684A', suit2: '#A85440', trouser: '#2E2E36', shoe: '#3A2A22' },
  karim: { skin: '#B97E55', skinShade: '#99643F', hairStyle: 'short', beard: false, glasses: true, suit: '#5E7F7A', suit2: '#4A6662', shirt: '#EDE6D6' },
  mona: { skin: '#E0B08A', skinShade: '#C39068', hairStyle: 'long', hair: '#3A2318', beard: false, suit: '#3F3A5C', suit2: '#2F2B47', trouser: '#2A2A30' },
  hassan: { skin: '#8E5B3B', skinShade: '#744A30', hair: '#2A2420', hairStyle: 'short', beard: true, suit: '#6B4A2E', suit2: '#563B24', shirt: '#E9DFC9' },
};
function lookOf(m) { return Object.assign({}, LOOK_DEFAULT, m.cast || {}); }
const M_DEF = {
  s: 1, expr: 'neutral', look: [0, 0], mouth: 0, blink: 0,
  armL: [0.18, 0.15], armR: [0.18, 0.15], // [shoulder, elbow] radians, + = away from body
  lean: 0, tilt: 0, walk: -1, bob: 0, sketch: 0, reveal: 1, side: false, flip: 1,
  ink: '#15161A', sweat: 0, sparkle: 0, holding: null, cast: null,
};

function mShape(path, fillCol, m, o = {}) {
  const fa = (1 - m.sketch) * (o.fa ?? 1);
  if (fa > 0 && fillCol) { ctx.save(); ctx.globalAlpha *= fa; ctx.fillStyle = fillCol; ctx.fill(path); ctx.restore(); }
  if (o.noStroke) return;
  ctx.save();
  ctx.strokeStyle = m.sketch > .5 ? C.graphite : m.ink;
  ctx.lineWidth = (o.lw ?? 4.2) / Math.max(.6, Math.min(1.4, m.s)) ;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (m.reveal < 1) ctx.setLineDash([Math.max(0.01, m.reveal * 1400), 99999]);
  ctx.stroke(path);
  if (m.sketch > 0.05) { // second pencil pass for a sketchy feel
    ctx.globalAlpha *= .35 * m.sketch; ctx.translate(1.5, -1); ctx.lineWidth *= .6; ctx.stroke(path);
  }
  ctx.restore();
}
function P(fn) { const p = new Path2D(); fn(p); return p; }

function armPath(sx, sy, sh, el, dir) {
  // dir = -1 for screen-left arm, +1 for screen-right
  const a1 = sh * dir, ex = sx + Math.sin(a1) * 95, ey = sy + Math.cos(a1) * 95;
  const a2 = a1 + el * dir, hx = ex + Math.sin(a2) * 88, hy = ey + Math.cos(a2) * 88;
  return { ex, ey, hx, hy };
}

function drawLimbArm(sx, sy, sh, el, dir, m) {
  const { ex, ey, hx, hy } = armPath(sx, sy, sh, el, dir);
  // sleeve as thick rounded stroke
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const sleeve = P(p => { p.moveTo(sx, sy); p.lineTo(ex, ey); p.lineTo(hx - (hx - ex) * .12, hy - (hy - ey) * .12); });
  if (m.sketch < 1) { ctx.globalAlpha *= 1 - m.sketch; ctx.strokeStyle = m.ink; ctx.lineWidth = 42; ctx.stroke(sleeve); ctx.strokeStyle = m.L.suit; ctx.lineWidth = 34; ctx.stroke(sleeve);
    ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 10; ctx.translate(dir * 7, 0); ctx.stroke(sleeve); ctx.translate(-dir * 7, 0); }
  ctx.restore();
  if (m.sketch > 0) { ctx.save(); ctx.globalAlpha *= m.sketch; sketchPath([[sx - 16, sy], [ex - 16, ey], [hx - 14, hy]], m.reveal, { width: 3, seed: 11 + dir }); sketchPath([[sx + 16, sy], [ex + 16, ey], [hx + 14, hy]], m.reveal, { width: 3, seed: 12 + dir }); ctx.restore(); }
  // cuff + hand
  const hand = P(p => p.arc(hx, hy, 16, 0, 6.28));
  const cuff = P(p => p.arc(hx - (hx - ex) * .16, hy - (hy - ey) * .16, 15, 0, 6.28));
  mShape(cuff, m.L.shirt, m, { lw: 3 });
  mShape(hand, m.L.skin, m, { lw: 3.6 });
  return { hx, hy };
}

function drawCharacter(x, y, opt = {}) { return drawMahmoud(x, y, opt); }
function drawMahmoud(x, y, opt = {}) {
  const m = Object.assign({}, M_DEF, opt); m.L = lookOf(m);
  if (m.alpha === 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(m.s * m.flip, m.s);
  if (m.alpha !== undefined) ctx.globalAlpha *= m.alpha;
  if (m.shadow !== false && m.sketch < 1) shadowEllipse(0, 4, 120, 18, .18 * (1 - m.sketch));
  if (m.side) { drawMahmoudSide(m); ctx.restore(); return; }

  const walk = m.walk >= 0;
  const ph = m.walk * Math.PI * 2;
  const bob = (walk ? Math.abs(Math.sin(ph)) * -10 : 0) + m.bob;
  ctx.translate(0, bob);
  ctx.rotate(m.lean);

  // legs
  const legSwing = walk ? Math.sin(ph) * .38 : 0;
  for (const [dir, sw] of [[-1, legSwing], [1, -legSwing]]) {
    const hx = dir * 28, hy = -255;
    const kx = hx + Math.sin(sw) * 125, ky = hy + Math.cos(sw) * 125;
    const bend = walk ? Math.max(0, -Math.sin(ph + (dir > 0 ? 0 : Math.PI))) * .5 : 0;
    const fx = kx + Math.sin(sw - bend) * 122, fy = Math.min(-6, ky + Math.cos(sw - bend) * 122);
    const leg = P(p => { p.moveTo(hx, hy); p.lineTo(kx, ky); p.lineTo(fx, fy); });
    if (m.sketch < 1) { ctx.save(); ctx.globalAlpha *= 1 - m.sketch; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = m.ink; ctx.lineWidth = 50; ctx.stroke(leg); ctx.strokeStyle = m.L.trouser; ctx.lineWidth = 42; ctx.stroke(leg); ctx.restore(); }
    if (m.sketch > 0) { ctx.save(); ctx.globalAlpha *= m.sketch; sketchPath([[hx - 20, hy], [kx - 20, ky], [fx - 18, fy]], m.reveal, { width: 3, seed: 20 + dir }); sketchPath([[hx + 20, hy], [kx + 20, ky], [fx + 18, fy]], m.reveal, { width: 3, seed: 21 + dir }); ctx.restore(); }
    const shoe = P(p => { p.moveTo(fx - 22, fy + 6); p.quadraticCurveTo(fx - 22, fy - 14, fx, fy - 12); p.quadraticCurveTo(fx + 30 * dir + (dir < 0 ? 0 : 0), fy - 8, fx + 34 * (dir < 0 ? -1 : 1), fy + 6); p.closePath(); });
    mShape(shoe, m.L.shoe, m, { lw: 3.6 });
  }

  // back arm (screen-right arm drawn behind torso when raised high? keep both in front for clarity)
  // torso / blazer
  const torso = P(p => { p.moveTo(-72, -398); p.quadraticCurveTo(-84, -330, -64, -240); p.lineTo(64, -240); p.quadraticCurveTo(84, -330, 72, -398); p.quadraticCurveTo(0, -418, -72, -398); p.closePath(); });
  mShape(torso, m.L.suit, m);
  // shirt V + lapels
  const shirtV = P(p => { p.moveTo(-26, -406); p.lineTo(0, -318); p.lineTo(26, -406); p.closePath(); });
  mShape(shirtV, m.L.shirt, m, { lw: 3 });
  const lapL = P(p => { p.moveTo(-28, -406); p.lineTo(-44, -360); p.lineTo(-24, -352); p.lineTo(0, -300); p.lineTo(-4, -318); p.closePath(); });
  const lapR = P(p => { p.moveTo(28, -406); p.lineTo(44, -360); p.lineTo(24, -352); p.lineTo(0, -300); p.lineTo(4, -318); p.closePath(); });
  mShape(lapL, m.L.suit2, m, { lw: 3 }); mShape(lapR, m.L.suit2, m, { lw: 3 });
  // blazer shading + button + gold pin
  if (m.sketch < 1) {
    ctx.save(); ctx.globalAlpha *= (1 - m.sketch); ctx.clip(torso);
    ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.fillRect(30, -420, 60, 200);
    ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(-70, -420, 30, 200);
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= (1 - m.sketch); ctx.fillStyle = m.L.pin; ctx.beginPath(); ctx.arc(-46, -368, 6, 0, 6.28); ctx.fill();
    ctx.fillStyle = m.ink; ctx.beginPath(); ctx.arc(0, -278, 5, 0, 6.28); ctx.fill(); ctx.restore();
  }
  // neck
  const neck = P(p => { p.rect(-16, -432, 32, 30); });
  mShape(neck, m.L.skinShade, m, { lw: 3 });

  // head
  ctx.save(); ctx.translate(0, -478); ctx.rotate(m.tilt);
  drawHead(m);
  ctx.restore();

  // arms (front)
  const hl = drawLimbArm(-66, -388, m.armL[0], m.armL[1], -1, m);
  const hr = drawLimbArm(66, -388, m.armR[0], m.armR[1], 1, m);
  if (m.holding) m.holding(hl, hr);
  ctx.restore();
}

function drawHead(m) {
  if (!m.L) m.L = lookOf(m);
  const hs = m.L.hairStyle;
  if (hs === 'hijab') { // drape behind the face, covering neck and shoulders
    mShape(P(p => { p.moveTo(-70, -10); p.bezierCurveTo(-74, -86, 74, -86, 70, -10); p.bezierCurveTo(74, 40, 84, 80, 86, 112); p.quadraticCurveTo(0, 134, -86, 112); p.bezierCurveTo(-84, 80, -74, 40, -70, -10); p.closePath(); }), m.L.hijab, m);
  } else if (hs === 'long') {
    mShape(P(p => { p.moveTo(-62, -20); p.bezierCurveTo(-70, 40, -74, 90, -66, 118); p.lineTo(66, 118); p.bezierCurveTo(74, 90, 70, 40, 62, -20); p.closePath(); }), m.L.hair, m);
  }
  // ears
  if (hs !== 'hijab') for (const d of [-1, 1]) mShape(P(p => p.ellipse(d * 54, 8, 11, 17, 0, 0, 6.28)), m.L.skinShade, m, { lw: 3.4 });
  // face
  const face = P(p => { p.moveTo(-52, -20); p.bezierCurveTo(-56, 40, -30, 70, 0, 72); p.bezierCurveTo(30, 70, 56, 40, 52, -20); p.bezierCurveTo(52, -66, -52, -66, -52, -20); p.closePath(); });
  mShape(face, m.L.skin, m);
  // beard (short, neat) — under the jaw
  const beard = P(p => { p.moveTo(-50, 6); p.bezierCurveTo(-48, 50, -26, 76, 0, 78); p.bezierCurveTo(26, 76, 48, 50, 50, 6); p.bezierCurveTo(44, 30, 30, 40, 18, 40); p.quadraticCurveTo(0, 32, -18, 40); p.bezierCurveTo(-30, 40, -44, 30, -50, 6); p.closePath(); });
  if (m.L.beard) mShape(beard, m.L.hair, m, { lw: 3, fa: .92 });
  // hair — side part, a little volume
  if (hs === 'hijab') mShape(P(p => { p.moveTo(-54, -14); p.bezierCurveTo(-58, -76, 58, -76, 54, -14); p.bezierCurveTo(46, -50, -46, -50, -54, -14); p.closePath(); }), mixColor(m.L.hijab, '#000000', .18), m, { lw: 3 });
  const hair = hs === 'hijab' ? null : hs === 'short' ? P(p => { p.moveTo(-54, -14); p.bezierCurveTo(-60, -62, -30, -78, 0, -78); p.bezierCurveTo(30, -78, 60, -62, 54, -14); p.bezierCurveTo(46, -42, 20, -50, 0, -50); p.bezierCurveTo(-20, -50, -46, -42, -54, -14); p.closePath(); }) : P(p => { p.moveTo(-56, -8); p.bezierCurveTo(-64, -60, -40, -84, -4, -84); p.bezierCurveTo(34, -88, 66, -66, 56, -6); p.bezierCurveTo(52, -30, 42, -44, 24, -48); p.bezierCurveTo(4, -40, -16, -50, -30, -44); p.bezierCurveTo(-44, -38, -50, -24, -56, -8); p.closePath(); });
  if (hair) mShape(hair, m.L.hair, m);
  if (hs === 'side' && m.sketch < 1) { ctx.save(); ctx.globalAlpha *= (1 - m.sketch) * .5; ctx.strokeStyle = '#4a3f3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-20, -74); ctx.quadraticCurveTo(10, -80, 34, -64); ctx.stroke(); ctx.restore(); }

  const e = m.expr, lx = m.look[0] * 5, ly = m.look[1] * 4;
  // brows
  const BR = { neutral: [0, 0, 0], happy: [-4, -4, 0], excited: [-10, -10, 0], worried: [8, -6, 1], sad: [8, -2, 1], think: [-10, 2, 0], frustrated: [-6, 8, -1], shock: [-16, -16, 0], aha: [-12, -12, 0], proud: [-4, -2, 0], tired: [4, 0, .6] }[e] || [0, 0, 0];
  for (const d of [-1, 1]) {
    const inner = d < 0 ? BR[0] : (e === 'think' ? BR[1] : BR[0]);
    const slant = BR[2];
    const y0 = -30 + (e === 'think' && d > 0 ? -10 : BR[1]);
    const bp = P(p => { p.moveTo(d * 10, y0 + (slant > 0 ? -8 * slant : slant < 0 ? 8 : 0)); p.quadraticCurveTo(d * 24, y0 - 6, d * 38, y0 + (slant > 0 ? 4 : slant < 0 ? -4 : 0)); });
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = m.sketch > .5 ? C.graphite : m.L.hair; ctx.lineWidth = 7; if (m.reveal < 1) ctx.setLineDash([m.reveal * 120, 999]); ctx.stroke(bp); ctx.restore();
  }
  // eyes
  const big = e === 'shock' || e === 'aha';
  for (const d of [-1, 1]) {
    const ex = d * 22 + lx, ey = -10 + ly;
    ctx.save();
    if (e === 'happy' || e === 'proud') { // smiling arcs
      ctx.strokeStyle = m.ink; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(ex, ey + 4, 8, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    } else {
      const bl = clamp(m.blink + (e === 'tired' ? .45 : 0));
      ctx.fillStyle = '#fff'; ctx.globalAlpha *= (1 - m.sketch * .6);
      ctx.beginPath(); ctx.ellipse(ex, ey, big ? 11 : 9, (big ? 13 : 11) * (1 - bl), 0, 0, 6.28); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = m.ink;
      ctx.beginPath(); ctx.ellipse(ex + lx * .3, ey + ly * .3, big ? 6.5 : 6, (big ? 7.5 : 7) * (1 - bl), 0, 0, 6.28); ctx.fill();
      if (bl < .6) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + 2 + lx * .3, ey - 3, 2.2, 0, 6.28); ctx.fill(); }
      if (bl > .3) { ctx.strokeStyle = m.ink; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(ex - 11, ey - 11 * (1 - bl) + 2); ctx.lineTo(ex + 11, ey - 11 * (1 - bl) + 2); ctx.stroke(); }
    }
    ctx.restore();
  }
  if (m.L.glasses) { ctx.save(); ctx.strokeStyle = m.ink; ctx.lineWidth = 4; for (const d of [-1, 1]) { ctx.beginPath(); ctx.roundRect(d * 22 + lx - 17, -10 + ly - 13, 34, 26, 9); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-5 + lx, -12 + ly); ctx.quadraticCurveTo(lx, -16 + ly, 5 + lx, -12 + ly); ctx.stroke(); ctx.restore(); }
  // nose
  ctx.save(); ctx.strokeStyle = m.L.skinShade; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(2, -4); ctx.quadraticCurveTo(8, 14, -2, 18); ctx.stroke(); ctx.restore();
  // mouth (sits in the beard → draw with light lip colour so it reads)
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = m.L.beard ? '#F2E6DA' : '#7A3328'; ctx.fillStyle = '#5B2420'; ctx.lineWidth = 4.5;
  const mo = m.mouth;
  const my = 40;
  if (e === 'happy' || e === 'proud' || e === 'neutral') {
    ctx.beginPath(); ctx.moveTo(-16, my - 2); ctx.quadraticCurveTo(0, my + (e === 'neutral' ? 6 : 12) + mo * 8, 16, my - 2); if (mo > .1 || e === 'happy') { ctx.closePath(); ctx.fill(); } ctx.stroke();
  } else if (e === 'excited' || e === 'aha') {
    ctx.beginPath(); ctx.moveTo(-18, my - 4); ctx.quadraticCurveTo(0, my + 22 + mo * 6, 18, my - 4); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.fillRect(-12, my - 3, 24, 5);
  } else if (e === 'shock') {
    ctx.beginPath(); ctx.ellipse(0, my + 4, 9, 13 + mo * 3, 0, 0, 6.28); ctx.fill(); ctx.stroke();
  } else if (e === 'worried' || e === 'sad' || e === 'tired') {
    ctx.beginPath(); ctx.moveTo(-14, my + 6); ctx.quadraticCurveTo(0, my - 4 - (e === 'sad' ? 4 : 0) + mo * 10, 14, my + 6); ctx.stroke();
  } else if (e === 'think') {
    ctx.beginPath(); ctx.moveTo(-12, my + 2); ctx.quadraticCurveTo(4, my + 6, 16, my - 2); ctx.stroke();
  } else if (e === 'frustrated') {
    ctx.beginPath(); ctx.moveTo(-16, my + 4); ctx.lineTo(16, my + 4); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, my + 4, 12, 2 + mo * 8, 0, 0, 6.28); ctx.fill();
  }
  ctx.restore();
  // blush / sweat / sparkle
  if (e === 'happy' || e === 'excited' || e === 'aha') { ctx.save(); ctx.globalAlpha *= .22 * (1 - m.sketch); ctx.fillStyle = '#E0684F'; for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 34, 14, 10, 6, 0, 0, 6.28); ctx.fill(); } ctx.restore(); }
  if (m.sweat > 0) { ctx.save(); ctx.globalAlpha *= m.sweat; ctx.fillStyle = '#8FC3E8'; ctx.strokeStyle = m.ink; ctx.lineWidth = 2.5; const sy = -44 + (1 - m.sweat) * 10; ctx.beginPath(); ctx.moveTo(62, sy); ctx.quadraticCurveTo(74, sy + 22, 62, sy + 28); ctx.quadraticCurveTo(50, sy + 22, 62, sy); ctx.fill(); ctx.stroke(); ctx.restore(); }
  if (m.sparkle > 0) { ctx.save(); ctx.globalAlpha *= m.sparkle; ctx.strokeStyle = C.gold; ctx.lineWidth = 5; ctx.lineCap = 'round'; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .45, r0 = 96, r1 = 96 + 30 * m.sparkle; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0 - 20); ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1 - 20); ctx.stroke(); } ctx.restore(); }
}

// side (profile) view — facing screen-right
function drawMahmoudSide(m) {
  const walk = m.walk >= 0, ph = m.walk * Math.PI * 2;
  ctx.translate(0, (walk ? Math.abs(Math.sin(ph)) * -10 : 0) + m.bob); ctx.rotate(m.lean);
  const sw = walk ? Math.sin(ph) * .42 : 0;
  // far arm + leg first
  const drawLeg = (a, shade) => {
    const hx = 0, hy = -255, kx = hx + Math.sin(a) * 125, ky = hy + Math.cos(a) * 125;
    const b = walk ? Math.max(0, Math.sin(ph + (shade ? Math.PI : 0))) * .55 : 0;
    const fx = kx + Math.sin(a - b) * 122, fy = Math.min(-6, ky + Math.cos(a - b) * 122);
    const leg = P(p => { p.moveTo(hx, hy); p.lineTo(kx, ky); p.lineTo(fx, fy); });
    ctx.save(); ctx.globalAlpha *= 1 - m.sketch; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = m.ink; ctx.lineWidth = 50; ctx.stroke(leg); ctx.strokeStyle = shade ? '#2A2A31' : m.L.trouser; ctx.lineWidth = 42; ctx.stroke(leg); ctx.restore();
    if (m.sketch > 0) { ctx.save(); ctx.globalAlpha *= m.sketch; sketchPath([[hx - 18, hy], [kx - 18, ky], [fx - 16, fy]], m.reveal, { width: 3, seed: shade ? 3 : 4 }); sketchPath([[hx + 18, hy], [kx + 18, ky], [fx + 16, fy]], m.reveal, { width: 3, seed: shade ? 5 : 6 }); ctx.restore(); }
    mShape(P(p => { p.moveTo(fx - 18, fy + 6); p.quadraticCurveTo(fx - 18, fy - 16, fx + 4, fy - 14); p.quadraticCurveTo(fx + 40, fy - 8, fx + 44, fy + 6); p.closePath(); }), shade ? '#46301f' : m.L.shoe, m, { lw: 3.6 });
  };
  const drawArm = (a, el, shade) => {
    const sx = 0, sy = -388, ex = sx + Math.sin(a) * 95, ey = sy + Math.cos(a) * 95, hx = ex + Math.sin(a + el) * 88, hy = ey + Math.cos(a + el) * 88;
    const sl = P(p => { p.moveTo(sx, sy); p.lineTo(ex, ey); p.lineTo(hx, hy); });
    ctx.save(); ctx.globalAlpha *= 1 - m.sketch; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = m.ink; ctx.lineWidth = 42; ctx.stroke(sl); ctx.strokeStyle = shade ? m.L.suit2 : m.L.suit; ctx.lineWidth = 34; ctx.stroke(sl); ctx.restore();
    if (m.sketch > 0) { ctx.save(); ctx.globalAlpha *= m.sketch; sketchPath([[sx, sy], [ex, ey], [hx, hy]], m.reveal, { width: 3, seed: shade ? 8 : 9 }); ctx.restore(); }
    mShape(P(p => p.arc(hx, hy, 16, 0, 6.28)), m.L.skin, m, { lw: 3.6 });
  };
  drawArm(walk ? -sw * .9 : -m.armR[0] * .5, walk ? -.2 : -m.armR[1], true);
  drawLeg(-sw, true);
  drawLeg(sw, false);
  const torso = P(p => { p.moveTo(-40, -402); p.quadraticCurveTo(-52, -320, -40, -240); p.lineTo(46, -240); p.quadraticCurveTo(64, -330, 44, -402); p.quadraticCurveTo(0, -414, -40, -402); p.closePath(); });
  mShape(torso, m.L.suit, m);
  mShape(P(p => { p.moveTo(44, -402); p.lineTo(34, -350); p.lineTo(56, -330); }), null, m, { lw: 3 });
  mShape(P(p => p.rect(-10, -432, 26, 32)), m.L.skinShade, m, { lw: 3 });
  // head profile
  ctx.save(); ctx.translate(4, -478); ctx.rotate(m.tilt);
  const head = P(p => { p.moveTo(-50, -20); p.bezierCurveTo(-54, -70, 40, -74, 50, -24); p.lineTo(58, 2); p.lineTo(50, 8); p.bezierCurveTo(52, 40, 40, 70, 8, 72); p.bezierCurveTo(-30, 70, -52, 30, -50, -20); p.closePath(); });
  mShape(head, m.L.skin, m);
  const hs = m.L.hairStyle;
  if (hs === 'long') mShape(P(p => { p.moveTo(-50, -30); p.bezierCurveTo(-70, 20, -66, 80, -56, 116); p.lineTo(6, 116); p.bezierCurveTo(-10, 80, -20, 30, -10, -20); p.closePath(); }), m.L.hair, m);
  if (m.L.beard) mShape(P(p => { p.moveTo(-46, 10); p.bezierCurveTo(-40, 54, -10, 80, 12, 78); p.bezierCurveTo(36, 76, 50, 52, 48, 26); p.quadraticCurveTo(36, 40, 22, 38); p.quadraticCurveTo(0, 36, -10, 20); p.closePath(); }), m.L.hair, m, { lw: 3 });
  if (hs === 'hijab') mShape(P(p => { p.moveTo(34, -64); p.bezierCurveTo(-20, -100, -84, -40, -64, 30); p.lineTo(-56, 116); p.lineTo(44, 116); p.lineTo(38, 70); p.bezierCurveTo(10, 76, -8, 44, -6, 4); p.bezierCurveTo(-4, -28, 10, -48, 36, -50); p.closePath(); }), m.L.hijab, m);
  else mShape(P(p => { p.moveTo(-54, 6); p.bezierCurveTo(-66, -60, 0, -94, 44, -60); p.bezierCurveTo(56, -48, 52, -36, 46, -34); p.bezierCurveTo(20, -44, -10, -40, -22, -26); p.bezierCurveTo(-30, -6, -40, 4, -54, 6); p.closePath(); }), m.L.hair, m);
  if (hs !== 'hijab') mShape(P(p => p.ellipse(-14, 4, 11, 17, 0, 0, 6.28)), m.L.skinShade, m, { lw: 3.2 });
  if (m.L.glasses) { ctx.save(); ctx.strokeStyle = m.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(18, -22, 28, 24, 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(18, -12); ctx.lineTo(-10, -8); ctx.stroke(); ctx.restore(); }
  ctx.fillStyle = m.ink; ctx.beginPath(); ctx.ellipse(30, -10, 5, 7 * (1 - m.blink), 0, 0, 6.28); ctx.fill();
  ctx.strokeStyle = m.L.hair; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(18, -30 - (m.expr === 'worried' ? -4 : 0)); ctx.lineTo(44, -32 + (m.expr === 'frustrated' ? 6 : 0)); ctx.stroke();
  ctx.strokeStyle = m.L.beard ? '#F2E6DA' : '#7A3328'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(34, 40); ctx.quadraticCurveTo(42, m.expr === 'happy' || m.expr === 'proud' ? 46 : 40, 48, 38); ctx.stroke();
  ctx.restore();
  drawArm(walk ? sw * .9 : m.armL[0] * .5, walk ? -.25 : -m.armL[1], false);
}
