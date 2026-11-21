---
name: foda-story-reel
description: Produce a new episode of the Foda Agency AI-storytelling reel series (vertical 9:16, Egyptian-Arabic VO, hybrid sketch/2D/motion-graphics animation, gold pen-nib motif) in the house style set by EP01 "محمود ومعرض الأثاث". Use whenever the user asks for a new story video / حلقة جديدة / reel / فيديو storytelling for Foda, a variation of the Mahmoud video, or anything "بنفس الاستايل".
---

# Foda Story Reel — new episode

The style is fixed. **Read `video/SERIES_BIBLE.md` first and follow it.** The reference episode is `video/episodes/ep01-mahmoud-furniture/` (`PRODUCTION.md` has its storyboard). Reuse `video/kit/`. Change the kit only to add capabilities, and if you do, check that EP01 still renders identically (render a few frames before and after and compare pixels).

## Steps

1. **Setup:** `cd video/kit && npm i` (fonts). Python needs `numpy scipy pillow`. Chromium + Playwright are preinstalled.
2. **New episode:** `cp -r video/episodes/_template video/episodes/epNN-<slug>`. Pick or define the lead in `CAST` (`kit/character.js`), and set `HERO` in `episode.js`.
3. **Script:** use the user's script word for word, in Egyptian dialect. Never invent prices, offers or claims; ask the user for them. Add performance tags as in SERIES_BIBLE §7 and write `vo/script_compact.txt` (one line per sentence).
4. **Voice over:** ElevenLabs `creative_generate_speech`, `model_id: eleven_v4`, `voice_id: UR972wNGq3zluze0LoIp` (the series voice), `generations_count: 1`. Call with `estimate_only` first and report the credit cost. Create one flow per episode. Poll `creative_get_flow_run_status`, then download to `vo/vo_raw.mp3`.
   Convert it with `ffmpeg -i vo_raw.mp3 -ar 48000 -ac 1 vo.wav`. **Do not trim the start** unless a 100 ms RMS scan proves it is silent. EP01 v1 lost its first sentence this way.
5. **Timing:** get word timestamps with `creative_add_flow_asset_node` on the TTS generation, then `creative_transcribe_audio` (scribe, free). Save `words.json` as `vo/words_raw.json`. Snap line starts to real silences (see the EP01 `vo/timing_words.json`) and use them as `T` in `episode.js`. `kit/align.py` (pause-only) is a last-resort fallback: it can be off by seconds. Set `DUR` to the last line plus a 3–4 s CTA tail.
6. **Scenes:** write `scenes_*.js` beat by beat following the story template (SERIES_BIBLE §2). Every sentence needs a visual metaphor. Keep the three worlds, the pen-nib reveal of Foda after ~65%, and the CTA signature. Do not repeat the same transition twice in a row.
   Preview with `video/kit/snapt.sh video/episodes/epNN-<slug> <scratch> 1.0 5.2 …` and read the contact sheet. Check every scene boundary before the full render.
7. **Sound:** write `cues.py`. Every SFX cue must match an on-screen event, plus the series signatures (silence then one bell at the turn, C-E-G step chimes, impact on START), and arrange the music with `section()`. After mixing, check the levels: the voice must stay clearly above the impacts.
8. **Captions + cut-downs:** `python3 video/kit/captions.py <ep>` produces `captions_data.js` and SRTs. Add `CAPTION_ZONES` where captions would cover on-screen type. Define the cut-down in `variants.json` (cuts at sentence pauses only, full story arc kept). See SERIES_BIBLE §9b–9c.
9. **Build:** run `video/kit/build.sh video/episodes/epNN-<slug> <name> full`, then the same with `short`. Each produces `out/<name>_<variant>_9x16.mp4` at about −14 LUFS and under 100 MB. Also write `out/post_caption.md` (post copy, using only facts from the script).
10. **Deliver:** decode a few frames from the MP4 to check them, then commit the episode folder (frames and wavs are gitignored). Report honestly: what was generated, what is approximate (e.g. pause-based timing), and that you did not listen to or watch the result.
