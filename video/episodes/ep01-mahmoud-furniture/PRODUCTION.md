# EP01 · محمود ومعرض الأثاث — production notes

**Final video:** `out/foda_mahmoud_story_9x16.mp4`: 1080×1920, 30 fps, 2:23, H.264 + AAC, loudness −14 LUFS (TikTok / Reels).

Everything in this film is generated: the voice by ElevenLabs, and every frame, sound effect and note of music by code (`../../kit/` plus this folder's `scenes_*.js` and `cues.py`). The series-wide rules are in `../../SERIES_BIBLE.md`. There is no live action, stock footage, clip-art, or real people. The only real asset is the Foda logo (`public/brand/logo-full.png`).

---

## 1. Creative Direction — «القلم اللي بيرسم الخطة»

The Foda logo is a gold calligraphy pen nib. That nib is the main motif of the film.

* The story starts as a **pencil sketch on paper** (Mahmoud's dream). The sketch is drawn, then **coloured**, then **built in 2.5D** (Sketch → World).
* When Mahmoud markets "by himself", the world stays on paper but gets **cluttered, tilted and loud**: cards, megaphones, mismatched logos, ropes, leaking pipes.
* At the turning point the paper world **goes dark**. A single **gold point** appears and the gold nib draws one clean line. The chaos snaps into a grid, then into two lanes, and the line folds into a staircase. From here the visual language is **navy + gold, ordered, symmetrical**.
* At the reveal, the camera pulls back and the whole city turns out to be a sketch on paper. **The gold nib rises off the page and becomes the Foda logo.** The agency enters the story as the hand that draws the plan, not as an ad.

Hook: a match-cut. The film **opens on the payoff moment** (ribbon cut, confetti… pull-back: an empty street, a counter showing **0 زائر**). It then **rewinds like a tape** into the original sketch: "محمود قرر يفتح معرض أثاث…". The same ribbon snip comes back exactly on "فتح المعرض".

## 2. Visual Style Guide

| Layer | Look |
| --- | --- |
| Paper world (dream / DIY / chaos) | warm paper `#EFE9DD` with fibre texture, graphite pencil strokes that draw on, double-pass wobble |
| Colour world | flat fills, 4 px ink outline `#15161A`, soft cel shading, warm practical lights |
| Night city (problem / funnel) | top-down map `#0D1120`, people as abstract light tokens |
| System world (solution) | navy gradient `#0B1020 → #141C33`, gold hairline grid, gold glow lines |
| Finishing | film grain (overlay), vignette, light leaks, camera shake on impacts only |

Typography: **Alexandria** (modern Arabic, 600–900) for the main words, **Aref Ruqaa** for the handwritten gold moments (بنفسه · ابدأ صح · لوحده · وإنت؟ · بخطة.), **Inter Tight** for the Latin accents (16 VIDEOS · UNDER 10,000 EGP · IDENTITY / CONTENT / TRUST · START). Arabic always leads, and English stays a secondary label. Text is set in the edit (rendered vector text), never generated inside AI images.

## 3. Colour Palette

`Ink #0B0B0D` · `Navy #1E2A47` · `Gold #C9A35B` · `Gold soft #E6C98E` · `Gold deep #8A6A2F` · `Paper #EFE9DD` · `Bone #ECE8E1` · `Terracotta #C8684A` · `Fabric teal #5E7F7A` · `Sage #8FA58A` · `Alarm red #E7735A` (prices / problems only)

The Foda brand colours (ink, bone, gold) come from the agency website and decide the solution half of the film.

## 4. Character Sheet — Mahmoud

`kit/character.js` is a vector rig, so he is **the same in every shot**. He is about 32, has a short side-parted black hair and a neat beard, and wears a navy blazer with a gold pin, a white open-collar shirt, charcoal trousers and brown shoes. His proportions are stylised, not chibi.
Views: front, profile (walk cycle), sketch layer. Expressions: neutral, happy, excited, worried, think, frustrated, shock, aha (+ gold sparkle), sad, proud, tired (+ sweat). Rendered sheet: `../../assets/mahmoud_character_sheet.jpg`.

## 5. Storyboard (times = VO seconds)

| # | Time | VO | Picture | Transition in |
| --- | --- | --- | --- | --- |
| 1 Hook | 0–2.3 | محمود قرر يفتح… | Giant gold scissors **snip** the ribbon, confetti, whip pull-back → empty street, **0 زائر** | cold open |
| 2 Dream | 2.3–10.4 | كان عنده حلم… فتح المعرض | **Tape rewind** turns colour into pencil. A thought bubble is drawn by the nib; the camera **dives** into it. The perspective room is drawn line by line, then coloured. Furniture **drops** in as sketches that turn to colour. Mahmoud walks in. Cut to the facade: the OPEN sign flips and the **ribbon snip** returns | rewind / dive / zoom-match |
| 3 Problem | 10.4–16.3 | نسي حاجة… لمجرد إنه فتح | Tape-stop. The crane shot rises into a **top-down night city**. Crowds flow **around** an invisible dome over his shop, and sonar pings get no answer. Type: **مفتوح ≠ معروف** | crane → map |
| 4 DIY | 16.3–22.2 | قرر يبدأ… إعلان ممول | **Iris** in on paper. Mahmoud rolls up his sleeves. The page pops up, cards burst out and pin around him, a handheld **viewfinder** appears, then a megaphone and a coin labelled **ممول** | iris |
| 5 No message | 22.2–34.7 | بيكلم مين… عشرات المعارض | Megaphone waves pass through faceless "؟" tokens. Speech bubbles hold only **scribbles** and burst. Pull back: the shop is **cloned into a sea of identical shops** and the gold ring gets lost. Type: **ليه يختاروك إنت؟** | whip pan |
| 6 Hires | 34.7–47.1 | هجيب مصمم… ترتيب للمحتوى | A finger snap, then **6 mismatched logos** slam in around an empty dashed slot labelled «هوية؟». A camera drops in with a flash. **Film strips** run in three directions and tangle. **قصة / خطة / ترتيب** are struck through | flash / cut |
| 7 Directions | 47.1–52.7 | مرة عروض، مرة أسعار… | Mahmoud is **pulled by four ropes**: عروض, أسعار, منتجات, ؟. The cards spin like a broken compass | punch-in |
| 8 Drain | 52.7–57.4 | بيستهلك فلوسه… | Coins go into a **funnel marked «تسويق»** and leak out of a pipe maze. The budget bar drains from 100% to 12%, and the result cup gets one coin | push-out |
| 9 Agency | 57.4–59.3 | قرر يروح لشركة تسويق | Mahmoud walks to a dark glass tower and the camera **tilts up** | tilt |
| 10 Prices | 59.3–68.8 | 30 و40 ألف… لوحده | **30,000** and **40,000** fall as extruded 3D blocks with heavy impacts. The camera pulls out so they **tower**, their shadow covers him, and he walks away into the dark. **لوحده** | hard cut to dark |
| 11 Turn | 68.8–75.7 | بس الحقيقة… يبدأ صح | Silence, then **one gold point**. The nib draws a line, the frozen chaos snaps into a grid and then into two lanes, and the line folds into stairs. **ابدأ صح** in gold Ruqaa | language change |
| 12 Steps | 75.7–87.3 | أولًا… ثانيًا… ثالثًا | Mahmoud climbs **3 lit steps**. ① Six logos **morph into one mark** plus a palette ② a **consistent content carousel** ③ "؟" turn into hearts (TRUST) | hop |
| 13 Funnel | 87.3–97 | العروض والإعلانات… عملاء حقيقيين | Back to the city: his shop now **glows gold**. The عروض / إعلانات beacons orbit it and crowds **bend toward his door** through a funnel ring. **مهتم ← عميل حقيقي** | zoom-match |
| 14 Reveal | 97–99.5 | ده بالضبط اللي بنعمله في Foda | The city fades to sketch, the **gold nib lifts off the page** and becomes the **Foda logo** | morph |
| 15 Path A | 99.5–110.8 | باقات تصوير وإنتاج… | The gold line **forks**. A production line: the camera shutters and 16 reels ride a belt into a **4×4 wall**. **16 VIDEOS** and **أقل من 10,000 جنيه**, the 10,000 shown at Mahmoud's own height (callback to the giant 40,000) | fork / push |
| 16 Path B | 110.8–123.3 | استراتيجية… رحلة العميل | A **3D orbit ecosystem**: STRATEGY at the centre with هوية, محتوى, تصميم, إعلانات and رحلة العميل joined by particle links. Three different-height levels appear under **حسب احتياجات مشروعك** | cut |
| 17 Close | 123.3–134.8 | مش كل مشروع… عشرات الآلاف… | Three shops, three different gold paths: **كل مشروع وله خطته**. The **40,000 wall drops and shatters**, and its shards re-form into one small step, **ابدأ صح**. Mahmoud steps up. Then his full, lit showroom as he points at the viewer: **وإنت؟** | paper return |
| 18 CTA | 134.8–143 | ابعتلنا كلمة START… بخطة | "START" is typed into a chat bar and sent. The bubble flies up and **slams into a 3D gold START**. **وخلّي البداية المرة دي ـ بخطة.** Foda logo with the CTA pill «ابعتلنا START» | dark |

## 6. Voice Over (ElevenLabs)

* Model: `eleven_v4` (supports audio tags). Voice: **Haytham – Dramatic, Warm and Friendly** (Egyptian, narrative-story, middle-aged). I chose it over the "advertisement" and "news" Egyptian voices because it is labelled for storytelling and podcast narration, which is the "friend telling a story" register the brief asks for.
* The script was kept **word for word** in Egyptian Arabic. Delivery direction was added with tags: `[curious]` hook, `[excited]` dream, `[softly]` / `[nervous]` / `[frustrated]` / `[tired]` problem, `[sad]` after the prices, `[long pause] [softly]` at the turn, `[warmly]` / `[confident]` for the solution and close.
* Files: `vo/vo_raw.mp3` (ElevenLabs master), `vo/vo.wav` (leading 3 s of silence trimmed), `vo/script_tagged.txt`, `vo/timing.json` (line timings).

## 7. Scene prompts / Animation plan

No image or video generator was used for scenes. Image generators cannot keep Mahmoud consistent across about 40 shots, cannot render Arabic text correctly, and would produce the "sequence of AI images" look the brief rules out. Each scene is instead a deterministic animation function in `scenes_*.js`. They use:
camera rigs (push, pull, crane, whip, dutch, handheld shake), sketch→colour morphs, draw-on strokes, 2.5D perspective, parallax depth, particle systems (confetti, coins, crowds, shards), extruded 3D type, a broken-text shatter, an orbit with depth sorting, and kinetic Arabic typography.

## 8. Sound design plan (`cues.py`)

Every sound effect is placed on an on-screen event (about 260 cues): scissors and metallic snip, confetti paper flutter, a lone cricket on "0 visitors", tape-rewind, pencil scratching while lines draw, furniture thuds with a bounce, footsteps, a lamp click, tape-stop when the problem lands, sonar pings, card pins, a REC beep, a megaphone thump, coin clinks, a projector rattle, rope creaks with a heartbeat, a leaking coin stream with drips, sub impacts on 30,000 and 40,000, a pressure rumble, echoing footsteps, **total silence then one bell** at the turn, rising step chimes (C-E-G), shutter clicks on the production line, a stone crack and debris on the shattering 40,000, keyboard clicks on START, and a final cinematic hit.
Whooshes are used on fewer than half of the transitions on purpose. Silence is used at 10.4 s (tape-stop) and from 67.6 to 68.9 s.

## 9. Music direction

An original score composed in code at 96 BPM:
A minor, light plucks (dream) → drone (problem) → pulse and 16th hats (DIY) → b2 tension Am–B♭ with claps (chaos) → dark drone and heartbeat (drain) → near silence (prices) → **bell, then a C-major swell** (turn) → a warm, modern groove C–G–Am–F (solution) → riser → final hit on START.
It is ducked about 8 dB under the voice by a voice-driven sidechain envelope, then mastered to −14 LUFS / −1.5 dBTP.

## 10. Editing plan

Shot lengths follow the VO lines (`vo/timing.json`), not a fixed grid. Pace runs from fast cuts in the hook and chaos, to slow holds on the prices and the turn, to steady rhythm in the solution. Transitions are never repeated back to back: rewind, dive, zoom-match, crane, iris, whip, flash, punch-in, tilt, hard cut to black, line-fold, morph, fork-push and shatter.

## Rebuild

```bash
# from video/
(cd kit && npm i)                              # fonts (@fontsource); pip install numpy scipy pillow
kit/build.sh episodes/ep01-mahmoud-furniture foda_mahmoud_story
```
Preview any frame: `node kit/snap.js episodes/ep01-mahmoud-furniture "renderAt(61.5)" /tmp/f.jpg`.
