# QA report — REEL-001-ar.mp4

Generated 2026-11-21 12:30.

## Specs

| Check | Value | Result |
|---|---|---|
| Size | 1080x1920 | ✅ |
| Frame rate | 30.000 fps (r=30/1, avg=30/1) | ✅ |
| Constant frame rate | r=30/1 avg=30/1 | ✅ |
| Video codec / pixel format | h264 / yuv420p | ✅ |
| Audio | aac @ 48000 Hz | ✅ |
| Duration | 46.333333s | — |
| Loudness (integrated) | -14.9 LUFS | ✅ |
| True peak | -2.8 dBTP | ✅ |
| First frame | has content (`first_frame.jpg`) | ✅ |
| Flashes (most in 1 s) | 0  | ✅ |

## Motion

```json
{"frames_compared": 1389, "moving_frames": 748, "static_frames": 641, "median_pct_pixels_changed_when_moving": 0.326, "hitches": [{"frame": 660, "time": 22.0}, {"frame": 706, "time": 23.533}, {"frame": 864, "time": 28.8}, {"frame": 960, "time": 32.0}, {"frame": 1236, "time": 41.2}], "jumps": []}
```

- **Hitches** (a duplicate frame during motion) cause visible stutter. Fix the timeline at those times.
- **Jumps** are frames that change much more than their neighbours. Fine if it's an intended hard cut; otherwise add easing or a transition. Evidence is in `flagged/`.
- Frozen sections (≥1.5 s): none
- Black sections: none

## Visual review

- `contact_sheet_safezones.jpg`: every 0.5 s (left→right, top→bottom; tile k = k×0.5 s) with paid-Reels unsafe areas in red. No text, logo, mascot or CTA may sit in red.
- Then review the key beats frame by frame (`render.mjs stills --at …`) and listen once with sound.
