// ─────────────────────────────────────────────────────────────
//  FX — series-wide looks: scribbles, product icons, the navy+gold
//  "system" world and gold calligraphy write-on.
// ─────────────────────────────────────────────────────────────
function scribble(x, y, w, h, seed, p = 1, col = C.graphite, lw = 4) {
  const r = rng(seed), pts = [];
  for (let i = 0; i < 26; i++) pts.push([x - w / 2 + (i / 25) * w + (r() - .5) * 20, y + (r() - .5) * h]);
  sketchPath(pts, p, { width: lw, color: col, seed, wobble: 3, passes: 1 });
}
function sofaIcon(o) { sofa(0, 40, { s: .38, sketch: o.sketch }); }
function chairIcon(o) { armchair(0, 50, { s: .5, sketch: o.sketch }); }
function lampIcon(o) { floorLamp(0, 80, { s: .32, sketch: o.sketch, on: 1 }); }
function pctIcon() { txt('%', 0, 6, { size: 120, font: 'Inter Tight', weight: 900, color: '#fff', dir: 'ltr' }); }
function priceIcon() { txt('1999', 0, 6, { size: 70, font: 'Inter Tight', weight: 900, color: '#fff', dir: 'ltr' }); }
function qIcon() { txt('?', 0, 8, { size: 130, font: 'Inter Tight', weight: 900, color: '#fff', dir: 'ltr' }); }

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

