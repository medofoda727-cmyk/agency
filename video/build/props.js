// ─────────────────────────────────────────────────────────────
//  PROPS — furniture, shop, marketing objects. All support
//  o.sketch (0 colour … 1 pencil only) and o.reveal (draw-on).
// ─────────────────────────────────────────────────────────────
const PD = { sketch: 0, reveal: 1, s: 1, ink: '#15161A', alpha: 1 };
function po(o) { return Object.assign({}, PD, o); }
function shp(path, fillCol, o, lw = 4) {
  const fa = (1 - o.sketch) * (o.fa ?? 1);
  if (fa > 0 && fillCol) { ctx.save(); ctx.globalAlpha *= fa; ctx.fillStyle = fillCol; ctx.fill(path); ctx.restore(); }
  ctx.save(); ctx.strokeStyle = o.sketch > .5 ? C.graphite : o.ink; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (o.reveal < 1) ctx.setLineDash([Math.max(.01, o.reveal * 1600), 99999]);
  ctx.stroke(path);
  if (o.sketch > .05) { ctx.globalAlpha *= .35 * o.sketch; ctx.translate(2, -1.5); ctx.lineWidth = lw * .6; ctx.stroke(path); }
  ctx.restore();
}
function begin(x, y, o) { ctx.save(); ctx.translate(x, y); ctx.scale(o.s, o.s); if (o.rot) ctx.rotate(o.rot); ctx.globalAlpha *= o.alpha; }

// furniture — origin at floor centre
function sofa(x, y, oo = {}) {
  const o = po(oo); begin(x, y, o); const c = oo.color || C.fabric, c2 = oo.color2 || C.fabric2;
  shp(P(p => p.roundRect(-170, -150, 340, 90, 26)), c2, o);
  shp(P(p => p.roundRect(-180, -84, 360, 58, 18)), c, o);
  shp(P(p => p.roundRect(-200, -120, 50, 100, 20)), c, o); shp(P(p => p.roundRect(150, -120, 50, 100, 20)), c, o);
  shp(P(p => { p.moveTo(-160, -24); p.lineTo(-166, 0); p.moveTo(160, -24); p.lineTo(166, 0); }), null, o, 6);
  shp(P(p => p.roundRect(-110, -136, 70, 52, 14)), C.terracotta, o, 3); shp(P(p => p.roundRect(50, -136, 70, 52, 14)), C.cream, o, 3);
  ctx.restore();
}
function armchair(x, y, oo = {}) {
  const o = po(oo); begin(x, y, o); const c = oo.color || C.terracotta;
  shp(P(p => { p.moveTo(-80, -40); p.bezierCurveTo(-96, -190, 96, -190, 80, -40); p.closePath(); }), c, o);
  shp(P(p => p.roundRect(-100, -70, 200, 46, 18)), mixColor(c, '#000000', .12), o);
  shp(P(p => p.roundRect(-108, -110, 36, 80, 16)), c, o); shp(P(p => p.roundRect(72, -110, 36, 80, 16)), c, o);
  shp(P(p => { p.moveTo(-80, -24); p.lineTo(-90, 0); p.moveTo(80, -24); p.lineTo(90, 0); }), null, o, 6);
  ctx.restore();
}
function floorLamp(x, y, oo = {}) {
  const o = po(oo); begin(x, y, o);
  if (oo.on) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha *= oo.on * (1 - o.sketch); ctx.fillStyle = radial(0, -300, 260, 'rgba(255,214,140,.55)', 'rgba(255,214,140,0)'); ctx.fillRect(-300, -600, 600, 600); ctx.restore(); }
  shp(P(p => { p.moveTo(0, 0); p.lineTo(0, -300); }), null, o, 6);
  shp(P(p => p.ellipse(0, -2, 40, 8, 0, 0, 6.28)), C.ink, o, 3);
  shp(P(p => { p.moveTo(-50, -290); p.lineTo(-34, -370); p.lineTo(34, -370); p.lineTo(50, -290); p.closePath(); }), oo.on ? '#F6DFA8' : C.cream, o);
  ctx.restore();
}
function sideTable(x, y, oo = {}) {
  const o = po(oo); begin(x, y, o);
  shp(P(p => p.ellipse(0, -110, 80, 18, 0, 0, 6.28)), C.wood, o);
  shp(P(p => { p.moveTo(-50, -100); p.lineTo(-60, 0); p.moveTo(50, -100); p.lineTo(60, 0); p.moveTo(0, -94); p.lineTo(0, 0); }), null, o, 6);
  shp(P(p => { p.moveTo(-14, -126); p.bezierCurveTo(-26, -150, -20, -180, 0, -190); p.bezierCurveTo(20, -180, 26, -150, 14, -126); p.closePath(); }), C.sage, o, 3);
  ctx.restore();
}
function shelf(x, y, oo = {}) {
  const o = po(oo); begin(x, y, o);
  shp(P(p => p.rect(-110, -420, 220, 420)), C.woodDark, o);
  for (let i = 1; i < 4; i++) shp(P(p => { p.moveTo(-110, -420 + i * 105); p.lineTo(110, -420 + i * 105); }), null, o, 4);
  shp(P(p => p.rect(-80, -400, 30, 80)), C.cream, o, 3); shp(P(p => p.rect(-44, -390, 24, 70)), C.terracotta, o, 3);
  shp(P(p => p.ellipse(50, -340, 30, 24, 0, 0, 6.28)), C.sage, o, 3);
  shp(P(p => p.rect(-70, -280, 120, 60)), C.gold, o, 3); shp(P(p => p.ellipse(-30, -150, 34, 40, 0, 0, 6.28)), C.cream, o, 3);
  shp(P(p => p.rect(20, -190, 60, 80)), C.fabric, o, 3);
  ctx.restore();
}
function plant(x, y, oo = {}) {
  const o = po(oo); begin(x, y, o);
  shp(P(p => { p.moveTo(-40, -90); p.lineTo(40, -90); p.lineTo(30, 0); p.lineTo(-30, 0); p.closePath(); }), C.terracotta, o);
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .38, l = 120 + (i % 2) * 50; shp(P(p => { p.moveTo(0, -90); p.quadraticCurveTo(Math.cos(a) * l * .4 - 20, -90 + Math.sin(a) * l * .7, Math.cos(a) * l, -90 + Math.sin(a) * l); p.quadraticCurveTo(Math.cos(a) * l * .5 + 20, -90 + Math.sin(a) * l * .5, 0, -90); }), i % 2 ? C.sage : '#6F8B6A', o, 3); }
  ctx.restore();
}
function rug(x, y, oo = {}) { const o = po(oo); begin(x, y, o); shp(P(p => p.ellipse(0, 0, 300, 50, 0, 0, 6.28)), oo.color || '#D9C7A3', o, 3); shp(P(p => p.ellipse(0, 0, 240, 36, 0, 0, 6.28)), null, o, 2); ctx.restore(); }
function frame(x, y, oo = {}) { const o = po(oo); begin(x, y, o); shp(P(p => p.rect(-70, -90, 140, 180)), C.gold, o); shp(P(p => p.rect(-54, -74, 108, 148)), C.cream, o, 3); shp(P(p => { p.moveTo(-54, 40); p.lineTo(-10, -10); p.lineTo(20, 20); p.lineTo(54, -20); }), null, o, 3); ctx.restore(); }

// the showroom (front elevation). origin at ground centre, ~700 wide
function showroom(x, y, oo = {}) {
  const o = po(oo); begin(x, y, o); const lit = oo.lit ?? 1;
  shp(P(p => p.rect(-360, -620, 720, 620)), oo.wall || '#D9CFBE', o);
  shp(P(p => { p.moveTo(-390, -620); p.lineTo(390, -620); p.lineTo(360, -680); p.lineTo(-360, -680); p.closePath(); }), C.ink, o);
  // sign board
  shp(P(p => p.rect(-250, -600, 500, 90)), oo.signCol || C.navy, o);
  if (oo.signText !== '') txt(oo.signText || 'معرض محمود', 0, -555, { size: 50, weight: 800, color: oo.signTextCol || C.bone, alpha: (1 - o.sketch) * (oo.signAlpha ?? 1) });
  // window
  const wpath = P(p => p.rect(-320, -480, 420, 400));
  shp(wpath, mixColor('#2A3040', '#F6E3B8', lit), o);
  if (lit > 0 && o.sketch < 1) {
    ctx.save(); ctx.clip(wpath); ctx.globalAlpha *= 1 - o.sketch;
    sofa(-110, -110, { s: .7 }); floorLamp(40, -100, { s: .6, on: lit }); plant(-260, -90, { s: .6 });
    ctx.globalAlpha *= .25; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-320, -480); ctx.lineTo(-200, -480); ctx.lineTo(-320, -300); ctx.fill();
    ctx.restore();
  }
  shp(P(p => { p.moveTo(-110, -480); p.lineTo(-110, -80); }), null, o, 4);
  // door
  shp(P(p => p.rect(150, -400, 160, 400)), C.woodDark, o);
  shp(P(p => p.rect(172, -376, 116, 230)), mixColor('#2A3040', '#F6E3B8', lit * .8), o, 3);
  shp(P(p => p.arc(285, -200, 7, 0, 6.28)), C.gold, o, 2);
  // awning
  for (let i = 0; i < 7; i++) shp(P(p => { p.moveTo(-340 + i * 70, -500); p.lineTo(-270 + i * 70, -500); p.lineTo(-270 + i * 70, -470); p.quadraticCurveTo(-305 + i * 70, -450, -340 + i * 70, -470); p.closePath(); }), i % 2 ? C.cream : (oo.awning || C.terracotta), o, 3);
  ctx.restore();
}

// generic small "other shop" box used in city / clones
function miniShop(x, y, s, col, lit = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= o.alpha ?? 1;
  ctx.fillStyle = col; ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.rect(-50, -70, 100, 70); ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.ink; ctx.fillRect(-56, -82, 112, 14);
  ctx.fillStyle = lit ? `rgba(255,220,150,${.5 + lit * .5})` : '#2A3040'; ctx.fillRect(-38, -54, 44, 34); ctx.strokeRect(-38, -54, 44, 34);
  ctx.fillStyle = C.woodDark; ctx.fillRect(14, -48, 24, 48);
  ctx.restore();
}

// a faceless "person" token (pill + head) — abstract audience, never real people
function personToken(x, y, s, col = C.graphite, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= o.alpha ?? 1; ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(0, -46, 13, 0, 6.28); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-15, -30, 30, 44, 14); ctx.fill();
  if (o.ring) { ctx.strokeStyle = o.ring; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, -20, 34, 0, 6.28); ctx.stroke(); }
  ctx.restore();
}

// social-post card (generic, unbranded)
function postCard(x, y, oo = {}) {
  const o = po(oo); begin(x, y, o); const w = oo.w || 300, h = oo.h || 380, col = oo.color || C.terracotta;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 30 * (1 - o.sketch); ctx.shadowOffsetY = 14;
  shp(P(p => p.roundRect(-w / 2, -h / 2, w, h, 22)), '#FFFFFF', o, 3); ctx.restore();
  shp(P(p => p.arc(-w / 2 + 34, -h / 2 + 34, 16, 0, 6.28)), C.gold, o, 2);
  shp(P(p => p.roundRect(-w / 2 + 58, -h / 2 + 26, 110, 14, 7)), '#DDD6C8', o, 0.01);
  shp(P(p => p.roundRect(-w / 2 + 18, -h / 2 + 66, w - 36, h * .55, 14)), col, o, 3);
  if (oo.icon) { ctx.save(); ctx.translate(0, -h / 2 + 66 + h * .275); ctx.globalAlpha *= 1 - o.sketch * .5; oo.icon(o); ctx.restore(); }
  shp(P(p => p.roundRect(-w / 2 + 18, h / 2 - 90, w * .6, 14, 7)), '#DDD6C8', o, 0.01);
  shp(P(p => p.roundRect(-w / 2 + 18, h / 2 - 64, w * .4, 14, 7)), '#E8E2D6', o, 0.01);
  // like / comment row
  shp(P(p => { p.moveTo(-w / 2 + 30, h / 2 - 30); p.arc(-w / 2 + 30, h / 2 - 30, 9, 0, 6.28); }), oo.liked ? C.red : '#EDE7DA', o, 2);
  if (oo.label) txt(oo.label, w / 2 - 22, h / 2 - 28, { size: 28, weight: 800, color: oo.labelCol || C.ink, align: 'right', alpha: 1 - o.sketch });
  ctx.restore();
}
// phone frame
function phone(x, y, oo = {}, inner) {
  const o = po(oo); begin(x, y, o); const w = 300, h = 600;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 40 * (1 - o.sketch); ctx.shadowOffsetY = 20;
  shp(P(p => p.roundRect(-w / 2, -h / 2, w, h, 44)), C.ink, o, 3); ctx.restore();
  const scr = P(p => p.roundRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 34));
  shp(scr, oo.screen || '#F7F4EE', o, 2);
  if (inner) { ctx.save(); ctx.clip(scr); inner(o); ctx.restore(); }
  shp(P(p => p.roundRect(-40, -h / 2 + 24, 80, 18, 9)), C.ink, o, 1);
  ctx.restore();
}
function cameraIcon(x, y, oo = {}) {
  const o = po(oo); begin(x, y, o);
  shp(P(p => p.roundRect(-120, -70, 240, 150, 24)), C.ink, o);
  shp(P(p => p.roundRect(-60, -98, 90, 34, 10)), C.ink, o);
  shp(P(p => p.arc(0, 6, 54, 0, 6.28)), '#2A2E3A', o); shp(P(p => p.arc(0, 6, 30, 0, 6.28)), '#4A5A7A', o, 3);
  if (oo.rec) { ctx.save(); ctx.globalAlpha *= oo.rec; ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(88, -40, 12, 0, 6.28); ctx.fill(); ctx.restore(); }
  ctx.restore();
}
function megaphone(x, y, oo = {}) {
  const o = po(oo); begin(x, y, o);
  shp(P(p => { p.moveTo(-90, -30); p.lineTo(60, -90); p.lineTo(60, 90); p.lineTo(-90, 30); p.closePath(); }), oo.color || C.red, o);
  shp(P(p => p.roundRect(-120, -34, 34, 68, 10)), C.ink, o);
  shp(P(p => p.ellipse(60, 0, 18, 90, 0, 0, 6.28)), mixColor(oo.color || C.red, '#000000', .25), o);
  shp(P(p => { p.moveTo(-60, 26); p.lineTo(-70, 90); p.lineTo(-40, 90); p.lineTo(-34, 20); }), C.ink, o, 3);
  ctx.restore();
}
function coin(x, y, s = 1, spin = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * Math.max(.08, Math.abs(Math.cos(spin))), s); ctx.globalAlpha *= o.alpha ?? 1;
  ctx.fillStyle = C.goldDeep; ctx.beginPath(); ctx.arc(0, 4, 40, 0, 6.28); ctx.fill();
  ctx.fillStyle = C.gold; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 40, 0, 6.28); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = C.goldDeep; ctx.beginPath(); ctx.arc(0, 0, 28, 0, 6.28); ctx.stroke();
  txt('ج', 0, 2, { size: 34, weight: 800, color: C.goldDeep });
  ctx.restore();
}
function banknote(x, y, s = 1, rot = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha *= o.alpha ?? 1;
  ctx.fillStyle = '#9DBF8E'; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-80, -40, 160, 80, 8); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#5F8A55'; ctx.beginPath(); ctx.roundRect(-68, -30, 136, 60, 6); ctx.stroke();
  ctx.fillStyle = '#5F8A55'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, 6.28); ctx.fill();
  ctx.restore();
}
function chip(x, y, label, oo = {}) {
  const { col = C.ink, fg = C.bone, size = 34, alpha = 1, font = 'Alexandria', dir = 'rtl', pad = 28, scale = 1, rot = 0, outline = null } = oo;
  if (alpha <= 0) return;
  const w = measure(label, size, font, 800) + pad * 2, h = size * 1.9;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(scale, scale); ctx.globalAlpha *= alpha;
  ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.shadowColor = 'transparent';
  if (outline) { ctx.strokeStyle = outline; ctx.lineWidth = 3; ctx.stroke(); }
  txt(label, 0, 2, { size, weight: 800, color: fg, font, dir });
  ctx.restore();
}
function arrowHead(x, y, ang, s = 26, col = C.ink) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s, -s * .55); ctx.lineTo(-s * .7, 0); ctx.lineTo(-s, s * .55); ctx.closePath(); ctx.fill(); ctx.restore(); }

// extruded 3D-ish number block (for the price scene)
function bigNumber3D(str, x, y, size, depth, o = {}) {
  const { face = C.bone, side = '#8C8577', light = 0, font = 'Inter Tight', weight = 900, dir = 'ltr', alpha = 1, dx = .55, dy = .75 } = o;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.font = `${weight} ${size}px "${font}"`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.direction = dir;
  for (let i = depth; i > 0; i -= 2) { ctx.fillStyle = mixColor(side, '#000000', (i / depth) * .5); ctx.fillText(str, x + i * dx, y + i * dy); }
  ctx.fillStyle = face; ctx.fillText(str, x, y);
  if (light) { ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = `rgba(255,255,255,${light})`; ctx.fillText(str, x, y); }
  ctx.restore();
}

// tiny logo style variants for "no identity" chaos
function logoVariant(i, x, y, s = 1, alpha = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= alpha;
  const sets = [
    () => { ctx.fillStyle = '#E94B8A'; ctx.beginPath(); ctx.arc(0, 0, 70, 0, 6.28); ctx.fill(); txt('محمود', 0, 4, { size: 40, weight: 900, color: '#fff' }); },
    () => { ctx.fillStyle = '#1BA9A0'; ctx.fillRect(-90, -50, 180, 100); txt('M.HOME', 0, 4, { size: 40, font: 'Inter Tight', weight: 900, color: '#FFF36B', dir: 'ltr' }); },
    () => { ctx.strokeStyle = '#7A3CE0'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-70, 50); ctx.lineTo(0, -60); ctx.lineTo(70, 50); ctx.closePath(); ctx.stroke(); txt('أثاث', 0, 26, { size: 34, weight: 800, color: '#7A3CE0' }); },
    () => { ctx.fillStyle = '#F4B400'; ctx.beginPath(); ctx.roundRect(-100, -40, 200, 80, 40); ctx.fill(); txt('Mahmoud Furniture', 0, 3, { size: 24, font: 'Caveat', weight: 700, color: '#222', dir: 'ltr' }); },
    () => { ctx.fillStyle = '#222'; ctx.fillRect(-70, -70, 140, 140); txt('MF', 0, 6, { size: 70, font: 'Inter Tight', weight: 900, color: '#E33', dir: 'ltr' }); },
    () => { ctx.fillStyle = '#3B8D4E'; ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; ctx.lineTo(Math.cos(a) * 76, Math.sin(a) * 76); } ctx.fill(); txt('معرضنا', 0, 4, { size: 30, font: 'Ruqaa', weight: 700, color: '#fff' }); },
  ];
  sets[i % sets.length](); ctx.restore();
}
