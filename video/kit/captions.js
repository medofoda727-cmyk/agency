// ─────────────────────────────────────────────────────────────
//  CAPTIONS — series style: Alexandria 800, dark pill, the word
//  being spoken lights up gold. Drawn on the VO clock, above grain.
//  Episode may define CAPTION_ZONES = [[from, to, y | null]] (VO clock)
//  to move captions away from on-screen type, or hide them (null).
// ─────────────────────────────────────────────────────────────
const CAP_Y = 1330, CAP_SIZE = 64;
function captionY(t) {
  if (typeof CAPTION_ZONES !== 'undefined') for (const [a, b, y] of CAPTION_ZONES) if (t >= a && t < b) return y;
  return CAP_Y;
}
function drawCaptions(t, lo = -1e9, hi = 1e9) {
  // only chunks spoken inside the current segment (cut-downs never show a deleted line)
  const c = CAPTIONS.find(c => t >= c.s && t < c.e && c.s >= lo && c.words[0].s < hi); if (!c) return;
  const y = captionY(t); if (y === null) return;
  const k = E.outBack(seg(t, c.s, c.s + .14)), fade = 1 - seg(t, c.e - .08, c.e);
  let size = CAP_SIZE; const gap = size * .32;
  const isLatin = w => /^[A-Za-z0-9,.]+$/.test(w);
  const fontOf = w => isLatin(w) ? ['Inter Tight', 800] : ['Alexandria', 800];
  let ws = c.words.map(w => ({ ...w, wd: measure(w.w, size, ...fontOf(w.w)) }));
  let tot = ws.reduce((s, w) => s + w.wd, 0) + gap * (ws.length - 1);
  if (tot > 900) { const f = 900 / tot; size *= f; ws = ws.map(w => ({ ...w, wd: w.wd * f })); tot = 900; }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = fade;
  ctx.translate(540, y); ctx.scale(lerp(.9, 1, Math.min(1, k)), lerp(.9, 1, Math.min(1, k))); ctx.translate(-540, -y);
  const ph = size * 1.75, pw = tot + size * 1.1;
  ctx.fillStyle = 'rgba(11,11,13,.66)'; ctx.beginPath(); ctx.roundRect(540 - pw / 2, y - ph / 2, pw, ph, ph / 2); ctx.fill();
  let x = 540 + tot / 2; // right → left (Arabic reading order)
  for (const w of ws) {
    const on = t >= w.s - .03 && t < w.e + .08, said = t >= w.s - .03;
    const [font, weight] = fontOf(w.w);
    const pop = on ? 1 + .08 * (1 - seg(t, w.s, w.s + .18)) : 1;
    ctx.save(); ctx.translate(x - w.wd / 2, y + size * .06); ctx.scale(pop, pop);
    txt(w.w, 0, 0, { size, font, weight, color: on ? C.gold : (said ? C.bone : rgba(C.bone, .55)), dir: isLatin(w.w) ? 'ltr' : 'rtl' });
    ctx.restore();
    x -= w.wd + gap;
  }
  ctx.restore();
}
