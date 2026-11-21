"""
EPxx — sound design cue sheet + music arrangement (see SERIES_BIBLE §8).
Run from this folder:  python3 cues.py && python3 ../../kit/mix.py .
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'kit'))
from audio import *

setup(24.0)   # = DUR in episode.js

# ── SFX (every cue = an on-screen event) ──
for i in range(3): S(0.3 + i * .6, pencil(.6, 1.0, 8 + i), .9)     # the nib draws the room
S(2.2, paper(.5, 1.0), .7)                                         # colour floods in
S(9.0, tape_stop(.6), .8)                                          # the problem lands
S(9.2, chime(1046.5, 3.5, .7), .55)                                # silence → one bell (turn)
S(11.0, sparkle(1.0, 1.0, 24, 3000, 9000, 12), .9); S(11.0, pencil(.9, 1.2, 6), .7)
S(20.3, impact(3.0, 80, 28, 1.0, .6), .6); S(20.3, chime(523.25, 4.0, .9), .9)
S(21.0, pencil(.7, 1.0, 5), .7)

# ── MUSIC ──
section(0, 9, ['Fmaj7', 'C'], {'pad': .9, 'pluck': .7})
M(10.0, pad([48, 55, 59, 62, 64], 3.4, 1.1, 2.2, 2200))
section(11.5, 20, ['C', 'G', 'Am', 'F'], {'pad': .8, 'pluck': .85, 'bass': .7, 'kick': .65, 'clap': .45, 'hat': .55})
M(20.3, pad([36, 48, 55, 60, 64, 67], 3.6, 1.6, .02, 3200)); M(20.3, kick(1.3))

finish(gates=[(9.0, 9.9, .08)])
