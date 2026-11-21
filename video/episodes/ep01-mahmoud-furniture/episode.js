// ─────────────────────────────────────────────────────────────
//  EP01 — محمود ومعرض الأثاث · timeline
//  Scenes are AUTHORED on T_AUTH. The real VO line starts (ElevenLabs
//  word timings snapped to silences, vo/timing_words.json) are T_VO.
//  setWarp() maps the final film clock (= VO clock) onto the authored
//  clock, so every line's picture sits on its real words.
// ─────────────────────────────────────────────────────────────
const T_AUTH = [0, 2.35, 10.39, 12.94, 16.32, 17.40, 22.15, 34.73, 36.13, 37.71, 39.71, 47.07, 52.73, 57.42, 59.25, 68.81, 73.57, 75.74, 79.39, 84.87, 87.25, 96.95, 99.53, 110.76, 123.28, 125.69, 130.06, 134.81, 139.2];
const T_VO = [0.0, 2.37, 10.69, 13.62, 17.6, 19.51, 25.39, 34.88, 37.88, 40.88, 42.86, 50.23, 55.92, 60.6, 62.5, 72.31, 76.83, 79.0, 82.62, 88.06, 92.64, 100.14, 102.69, 113.93, 126.42, 128.84, 133.24, 137.95, 142.24];
const DUR = 143.0;            // authored length (scenes use it)
const T = T_AUTH;
setWarp(T_VO.concat([146.0]), T_AUTH.concat([DUR]));
// captions: move off on-screen type, hide where the picture already writes the line (VO clock)
const CAPTION_ZONES = [[100.14, 102.69, 1520], [102.69, 104.8, 1330], [104.8, 109.66, 1580], [109.66, 113.93, 1235], [122.0, 126.42, 1000], [126.42, 128.84, 1050], [137.95, 999, null]];
