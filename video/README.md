# Foda Story Series — AI storytelling reels

| | |
| --- | --- |
| **Style guide (start here)** | [`SERIES_BIBLE.md`](SERIES_BIBLE.md) |
| Engine (shared by every episode) | `kit/`: `character.js` (cast rig), `props.js`, `lib.js`, `core.js`, `fx.js`, `audio.py`, `mix.py`, `render.js`, `build.sh` |
| EP01 · محمود ومعرض الأثاث | `episodes/ep01-mahmoud-furniture/`: [`out/foda_mahmoud_story_9x16.mp4`](episodes/ep01-mahmoud-furniture/out/foda_mahmoud_story_9x16.mp4) · [`PRODUCTION.md`](episodes/ep01-mahmoud-furniture/PRODUCTION.md) |
| New episode starter | `episodes/_template/` |
| Character / cast sheets | `assets/` |
| Claude Code skill | `.claude/skills/foda-story-reel/`: ask for "حلقة جديدة بنفس الاستايل" |

```bash
cd video/kit && npm i && cd ..                       # once (fonts); pip install numpy scipy pillow
kit/build.sh episodes/ep01-mahmoud-furniture foda_mahmoud_story
```
