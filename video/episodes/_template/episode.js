// ─────────────────────────────────────────────────────────────
//  EPxx — <عنوان الحلقة> · timeline
//  1) generate the VO (see SERIES_BIBLE §7), trim it to vo/vo.wav
//  2) cd vo && python3 ../../../kit/align.py   → paste the printed T here
// ─────────────────────────────────────────────────────────────
const T = [0, 3, 9, 14, 20];   // VO line starts (placeholder)
const DUR = 24.0;              // last line end + ~3.5 s tail for the CTA
const wt = (i, f) => T[i] + (T[i + 1] - T[i]) * f;
const HERO = CAST.sara;        // the episode's lead — a look on the series rig
