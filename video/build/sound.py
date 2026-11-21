"""
FODA "MAHMOUD" FILM — sound design + original music bed, synthesised.
Every cue below is tied to an on-screen event (times = film seconds).
Outputs: sfx.wav, music.wav (48 kHz stereo float), then mix.py combines.
"""
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
DUR = 143.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

def t_(d): return np.arange(int(d * SR)) / SR
def env_ad(n, a, d_shape=4.0):
    """attack (samples) then exponential decay"""
    e = np.ones(n)
    a = max(1, min(a, n))
    e[:a] = np.linspace(0, 1, a)
    rest = n - a
    if rest > 0: e[a:] = np.exp(-d_shape * np.linspace(0, 1, rest))
    return e
def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), min(hi, SR / 2 - 100) / (SR / 2)], 'band'); return signal.lfilter(b, a, x)
def lp(x, f, order=2):
    b, a = signal.butter(order, min(f, SR / 2 - 100) / (SR / 2), 'low'); return signal.lfilter(b, a, x)
def hp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), 'high'); return signal.lfilter(b, a, x)
def noise(d): return rng.standard_normal(int(d * SR))
def sweep_lp(x, f0, f1, block=256):
    """time-varying low-pass (block-wise, state carried)"""
    out = np.zeros_like(x); zi = None; nb = int(np.ceil(len(x) / block))
    for i in range(nb):
        f = f0 * (f1 / f0) ** (i / max(1, nb - 1))
        b, a = signal.butter(2, min(max(f, 30), SR / 2 - 200) / (SR / 2), 'low')
        if zi is None: zi = signal.lfilter_zi(b, a) * 0
        seg = x[i * block:(i + 1) * block]
        y, zi = signal.lfilter(b, a, seg, zi=zi); out[i * block:i * block + len(seg)] = y
    return out
def sine_sweep(d, f0, f1, curve='exp'):
    t = t_(d); n = len(t)
    f = f0 * (f1 / f0) ** (np.arange(n) / n) if curve == 'exp' else np.linspace(f0, f1, n)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

# ── stereo buses ────────────────────────────────────────────
SFX = np.zeros((N, 2)); MUS = np.zeros((N, 2))
def place(bus, at, x, gain=1.0, pan=0.0):
    if x.ndim == 1: x = np.stack([x * np.sqrt(.5 * (1 - pan)), x * np.sqrt(.5 * (1 + pan))], 1) * np.sqrt(2)
    i = int(at * SR)
    if i >= N: return
    j = min(N, i + len(x)); bus[i:j] += x[:j - i] * gain
def S(at, x, g=1.0, pan=0.0): place(SFX, at, x, g, pan)

# ── SFX library ─────────────────────────────────────────────
def whoosh(d=.6, f0=300, f1=4000, peak=.55, g=1.0):
    n = noise(d); x = sweep_lp(n, f0, f1); x = hp(x, 120)
    e = np.interp(np.linspace(0, 1, len(x)), [0, peak, 1], [0, 1, 0]) ** 1.6
    return x * e * g * .35
def impact(d=1.2, f0=110, f1=38, g=1.0, crash=.5):
    s = sine_sweep(d, f0, f1) * env_ad(int(d * SR), 30, 5)
    c = lp(noise(d), 3000) * env_ad(int(d * SR), 10, 9) * crash
    tail = lp(noise(d), 400) * env_ad(int(d * SR), 200, 4) * .6
    return (s * 1.0 + c * .5 + tail * .5) * g
def pop(f0=900, f1=280, d=.09, g=1.0):
    return sine_sweep(d, f0, f1) * env_ad(int(d * SR), 40, 6) * g * .55
def click(d=.012, f=3500, g=1.0):
    return bp(noise(d), f * .6, f * 1.6) * env_ad(int(d * SR), 5, 6) * g * .8
def metal(freqs=(3100, 4700, 6900), d=.35, g=1.0):
    t = t_(d); x = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * (9 + i * 4)) for i, f in enumerate(freqs)); return x * g * .25
def snip():
    a = click(.015, 6000, 1.4); b = metal((3300, 5200, 7600), .3, .9)
    out = np.zeros(int(.4 * SR)); out[:len(a)] += a; out[int(.02 * SR):int(.02 * SR) + len(b)] += b; return out
def pencil(d=.8, g=1.0, rate=9):
    t = t_(d); n = bp(noise(d), 1800, 7000)
    am = (0.5 + 0.5 * np.sin(2 * np.pi * rate * t + np.sin(2 * np.pi * 2.3 * t) * 2)) ** 2
    jitter = lp(np.abs(noise(d)), 30); jitter /= jitter.max() + 1e-9
    e = np.interp(np.linspace(0, 1, len(t)), [0, .05, .9, 1], [0, 1, 1, 0])
    return n * am * (.4 + .6 * jitter) * e * g * .16
def paper(d=.5, g=1.0):
    t = t_(d); n = bp(noise(d), 900, 5000); am = np.abs(np.sin(2 * np.pi * 14 * t * (1 + t))) ** 3
    e = np.interp(np.linspace(0, 1, len(t)), [0, .1, 1], [0, 1, 0]); return n * am * e * g * .3
def thud(g=1.0, f=72, d=.35):
    s = sine_sweep(d, f * 1.6, f) * env_ad(int(d * SR), 20, 7)
    n = lp(noise(d), 900) * env_ad(int(d * SR), 10, 12); return (s + n * .6) * g * .8
def step(g=1.0):
    return thud(g * .45, 95, .18) + np.pad(click(.01, 2500, g * .5), (0, int(.18 * SR) - int(.01 * SR)))
def coin_clink(g=1.0, k=1.0):
    return metal((2300 * k, 3950 * k, 5600 * k, 7100 * k), .4, g * 1.2)
def shutter(g=1.0):
    a = click(.01, 3000, 1.2); b = bp(noise(.06), 1500, 6000) * env_ad(int(.06 * SR), 20, 8) * .5
    out = np.zeros(int(.12 * SR)); out[:len(a)] += a; out[int(.04 * SR):int(.04 * SR) + len(b)] += b; return out * g
def chime(f=880, d=2.5, g=1.0):
    t = t_(d); x = sum(np.sin(2 * np.pi * f * m * t) * np.exp(-t * (1.2 + i * 1.6)) * a for i, (m, a) in enumerate([(1, 1), (2.01, .45), (3.02, .22), (4.2, .12)]))
    return x * env_ad(len(t), 60, 0.01) * g * .3
def sparkle(d=1.2, g=1.0, n_=26, lo=2500, hi=7000, seed=1):
    r = np.random.default_rng(seed); out = np.zeros(int((d + .4) * SR))
    for _ in range(n_):
        f = r.uniform(lo, hi); at = r.uniform(0, d); x = np.sin(2 * np.pi * f * t_(.25)) * np.exp(-t_(.25) * 22) * r.uniform(.3, 1)
        i = int(at * SR); out[i:i + len(x)] += x
    return out * g * .12
def riser(d=2.0, g=1.0, f0=200, f1=1600):
    n = sweep_lp(noise(d), f0, f1 * 3); s = sine_sweep(d, f0, f1) * .3
    e = np.linspace(0, 1, int(d * SR)) ** 2.2; return (hp(n, 150) * .5 + s) * e * g * .4
def rev_swell(d=1.0, g=1.0):
    return riser(d, g, 300, 2400)
def tape_rewind(d=1.0, g=1.0):
    t = t_(d); car = np.sin(2 * np.pi * np.cumsum(900 + 700 * np.sin(2 * np.pi * 11 * t)) / SR)
    n = bp(noise(d), 800, 5000) * (.5 + .5 * np.sin(2 * np.pi * 23 * t))
    e = np.interp(np.linspace(0, 1, len(t)), [0, .15, .85, 1], [0, 1, 1, 0]); return (car * .25 + n * .4) * e * g * .5
def tape_stop(d=.5, g=1.0):
    return sine_sweep(d, 220, 30) * env_ad(int(d * SR), 10, 3) * g * .4 + lp(noise(d), 600) * env_ad(int(d * SR), 10, 6) * g * .2
def cricket(d=1.0, g=1.0):
    t = t_(d); car = np.sin(2 * np.pi * 4600 * t); gate = (np.sin(2 * np.pi * 34 * t) > .3) * ((t % .5) < .22)
    return car * lp(gate.astype(float), 300) * g * .06
def sonar(g=1.0):
    t = t_(1.4); return np.sin(2 * np.pi * 1250 * t) * np.exp(-t * 4) * env_ad(len(t), 100, .01) * g * .18
def creak(d=.7, g=1.0):
    t = t_(d); f = 90 + 40 * np.sin(2 * np.pi * 3 * t); saw = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR)
    return bp(saw, 300, 1800) * np.interp(np.linspace(0, 1, len(t)), [0, .2, 1], [0, 1, 0]) * g * .18
def crack(g=1.0):
    a = hp(noise(.25), 1500) * env_ad(int(.25 * SR), 5, 14); b = impact(.8, 140, 45, .6, .9)
    out = np.zeros(int(.8 * SR)); out[:len(a)] += a * .9; out += b[:len(out)]; return out * g
def debris(d=1.2, g=1.0, seed=3):
    r = np.random.default_rng(seed); out = np.zeros(int((d + .3) * SR))
    for _ in range(26):
        x = bp(noise(.05), r.uniform(800, 3000), 6000) * env_ad(int(.05 * SR), 3, 10) * r.uniform(.2, .8); i = int(r.uniform(0, d) ** 1.6 / d ** .6 * SR); out[i:i + len(x)] += x
    return out * g
def key_click(g=1.0):
    return click(.008, 4200, g) + np.pad(thud(.12 * g, 180, .05), (0, 0))[:int(.008 * SR)] * 0
def heart(g=1.0):
    a = thud(g, 55, .25); out = np.zeros(int(.6 * SR)); out[:len(a)] += a; out[int(.22 * SR):int(.22 * SR) + len(a)] += a * .7; return out
def hum(d=4.0, g=1.0):
    t = t_(d); x = signal.sawtooth(2 * np.pi * 55 * t) * .3 + np.sin(2 * np.pi * 110 * t) * .3
    rat = (np.sin(2 * np.pi * 12 * t) > .6).astype(float); x = lp(x, 500) + bp(noise(d), 1500, 4000) * lp(rat, 200) * .3
    e = np.interp(np.linspace(0, 1, len(t)), [0, .08, .92, 1], [0, 1, 1, 0]); return x * e * g * .18
def projector(d=3.8, g=1.0):
    t = t_(d); gate = ((t * 20) % 1 < .25).astype(float); x = bp(noise(d), 1200, 5000) * lp(gate, 400)
    e = np.interp(np.linspace(0, 1, len(t)), [0, .05, .9, 1], [0, 1, 1, 0]); return x * e * g * .14
def ambience(d, g=1.0, lo=150, hi=1200):
    x = bp(noise(d), lo, hi); x = lp(x, hi); e = np.interp(np.linspace(0, 1, len(x)), [0, .1, .9, 1], [0, 1, 1, 0]); return x * e * g * .05
def rumble(d=3.0, g=1.0):
    t = t_(d); x = lp(noise(d), 120) * 2 + np.sin(2 * np.pi * 38 * t) * .4
    return x * (np.linspace(0, 1, len(t)) ** 1.5) * g * .4
def drip(g=1.0):
    return sine_sweep(.08, 1400, 700) * env_ad(int(.08 * SR), 20, 8) * g * .25

# ── CUE SHEET (film seconds) ────────────────────────────────
# Hook
S(0.0, ambience(2.4, 1.2, 100, 900))
S(0.05, metal((2400, 3900), .4, .3), .6, .1)                # blades opening
S(0.45, snip(), 1.4)
S(0.47, pop(500, 120, .14, 1.0), .9); S(0.5, paper(1.2, 1.0), .8, .2); S(0.5, sparkle(1.0, 1.0, 20, 3000, 8000, 2), .9)
S(1.2, whoosh(.8, 200, 2500, .35), 1.0)                     # whip pull-back
S(1.62, cricket(.7), 1.0, .5)
S(1.65, pop(1200, 700, .07), .8)
S(2.3, tape_rewind(1.05), 1.0)
# Dream
S(3.55, pencil(.8, 1.0), 1.0, .2); S(4.0, pencil(.5, .8, 12), 1.0, -.1)
S(4.4, rev_swell(.85, 1.0), .9)
S(5.25, pencil(.85, 1.1, 7), 1.0, -.2); S(5.95, paper(.5, 1.0), .7)
for a, p in [(6.45, -.1), (6.65, 0), (6.9, .4), (7.1, -.5), (7.3, -.6), (7.45, -.2)]:
    S(a + .16, thud(1.0, 70 + (p + 1) * 15), .9, p); S(a + .3, thud(.35, 90), .7, p)
    S(a + .38, paper(.3, .6), .5, p)
for i in range(4): S(7.62 + i * .3, step(.8), .8, .3 - i * .1)
S(7.75, pop(700, 500, .08), .7, -.2); S(7.9, pop(800, 550, .08), .7, .1)
S(7.92, paper(.45, .8), .8)
S(8.1, click(.02, 2000, 1.4), 1.0, -.6); S(8.12, chime(1320, 1.2, .25), 1.0, -.6)
S(8.85, whoosh(.55, 300, 5000, .6), 1.0); S(9.2, whoosh(.4, 600, 6000, .2), .7)
S(9.75, paper(.25, 1.0), 1.0, .5)
S(10.0, snip(), 1.0); S(10.02, sparkle(.8, 1.0, 16, 3000, 8000, 5), .7)
# Problem
S(10.39, tape_stop(.6), .8)
S(11.45, whoosh(1.2, 120, 1800, .6), .9)
S(11.6, ambience(5.0, 1.4, 80, 600))
for i in range(5): S(12.6 + i * .7, sonar(), .8, (-.3, .3)[i % 2])
S(13.35, pop(600, 300, .1), .7); S(14.3, impact(.6, 160, 70, .5, .2), .8); S(14.75, pop(500, 250, .1), .7)
# DIY
S(16.3, whoosh(.5, 400, 6000, .5), .9)
S(16.55, paper(.4, .7), .6, -.2); S(16.95, paper(.4, .7), .6, .2)
S(17.42, pop(500, 900, .12), 1.0, -.4)
for i in range(6): S(18.55 + i * .13 + .3, click(.02, 2400 + i * 200, 1.3), .9, (-.5, .5)[i % 2]); S(18.55 + i * .13, whoosh(.25, 800, 6000, .7), .35)
S(19.75, chime(1760, .25, .6), .7); S(19.75, ambience(1.3, 1.5, 300, 3000))
S(20.95, thud(1.0, 90), .9, .4); S(21.2, pop(800, 500, .08), .8, .4)
S(21.35, whoosh(.5, 1500, 6000, .9), .3, .3); S(21.88, coin_clink(1.0), .9, .3)
# Talking to nobody
S(22.15, whoosh(.45, 300, 7000, .4), 1.0)
for i in range(5): S(22.5 + i * 1.43, sine_sweep(.4, 220, 160) * env_ad(int(.4 * SR), 400, 4) * .2, .7, .2)
for i in range(10): S(23.4 + i * .08, pop(1300 - i * 30, 900, .05), .35, .5)
for i in range(4): S(26.75 + i * .55 + .9, pop(400, 900, .06), .8, .4)
S(29.6, whoosh(1.0, 200, 3000, .7), .8)
cl = 30.4
for i in range(18): cl += max(.06, .3 * (.84 ** i)); S(cl, click(.02, 2000 + i * 60, .9), .6, (i % 5 - 2) * .2)
S(31.4, pop(600, 300, .1), .7)
# Designer / videographer
S(34.73, whoosh(.4, 500, 6000, .5), .7)
S(34.92, click(.03, 1800, 1.8), 1.0, .4)
for i in range(6): S(36.1 + i * .16, impact(.35, 220 + i * 25, 120, .35, .3), .9, (-.5, .5, -.6, .6, -.4, .4)[i])
S(37.0, sine_sweep(.6, 300, 240) * env_ad(int(.6 * SR), 800, 3) * .15, .9)
S(37.85, whoosh(.35, 1000, 5000, .8), .5); S(38.05, thud(1.0, 85), 1.0); S(38.25, shutter(1.4), 1.0); S(38.26, sparkle(.4, .8, 10, 5000, 9000, 9), .7)
S(39.7, projector(3.9), 1.0)
for a in (43.6, 44.3, 45.0): S(a, pop(500, 300, .1), .8); S(a + .35, pencil(.3, 1.2, 14), 1.2)
# Pulled in four directions
for a, p in [(47.15, -.6), (48.35, .6), (49.4, -.6), (50.5, .6)]:
    S(a, impact(.4, 180, 90, .5, .2), .8, p); S(a + .2, creak(.8, 1.0), 1.0, p)
S(49.5, heart(.8), .6); S(50.6, heart(.8), .6); S(51.4, whoosh(1.2, 300, 3000, .5), .7)
# Leaking budget
S(52.7, whoosh(.5, 400, 2000, .5), .6)
r2 = np.random.default_rng(4)
for i in range(46):
    S(52.73 + i * .1 + r2.uniform(0, .05), coin_clink(r2.uniform(.25, .5), r2.uniform(.85, 1.15)), .6, r2.uniform(-.7, .7))
for i in range(12): S(53.0 + i * .37, drip(1.0), .6, r2.uniform(-.5, .5))
S(53.2, sine_sweep(4.0, 330, 160) * np.linspace(0, 1, int(4.0 * SR)) ** .5 * .07, 1.0)
for i in range(4): S(53.2 + i * 1.1, heart(.6), .5)
# Tower
for i in range(6): S(57.45 + i * .31, step(.7), .8, -.3 + i * .1)
S(57.9, whoosh(1.4, 100, 1500, .7), .7)
# Price wall
S(59.25, ambience(9.0, .8, 60, 300))
S(60.9, whoosh(.3, 200, 3000, .9), .6); S(61.2, impact(2.0, 90, 30, .9, .6), .55)
S(61.85, whoosh(.3, 200, 3000, .9), .6); S(62.15, impact(2.2, 80, 26, 1.0, .7), .6)
S(62.8, pop(500, 250, .1), .6)
S(63.8, rumble(3.2, .6), .6)
for i in range(7): S(66.45 + i * .42, step(.6 * (1 - i / 8)), .9, -.2 - i * .08)
# Turn
S(68.9, chime(1046.5, 3.5, .7), .55)
S(69.6, sparkle(1.2, .6, 18, 2000, 6000, 11), .5); S(69.6, whoosh(1.2, 2000, 8000, .5), .25)
for i in range(16): S(71.6 + i * .06, click(.012, 3000 + i * 80, .7), .6, (i % 4 - 1.5) * .3)
S(72.6, whoosh(.6, 600, 5000, .5), .5); S(73.45, whoosh(.8, 300, 4000, .5), .6)
S(74.0, chime(1568, 2.0, .8), .8); S(74.0, sparkle(1.0, 1.0, 24, 3000, 9000, 12), .9); S(74.0, pencil(.9, 1.2, 6), .7)
# Steps
for i, (a, f) in enumerate([(75.9, 523.25), (79.5, 659.25), (85.0, 783.99)]):
    S(a, whoosh(.45, 600, 4000, .6), .5); S(a + .45, chime(f, 1.6, .9), .8); S(a + .45, thud(.6, 110), .6)
S(76.4, whoosh(1.0, 300, 5000, .8), .6); S(77.35, impact(.8, 200, 90, .5, .1), .8); S(77.35, chime(1046.5, 1.8, .6), .7)
for i in range(4): S(77.7 + i * .1, pop(900 + i * 120, 700, .06), .7)
for i in range(3): S(79.6 + i * 1.81, whoosh(.5, 1200, 5000, .5), .3)
for i in range(7): S(85.3 + i * .12 + .15, pop(700 + i * 60, 1200, .07), .6, (i - 3) * .15)
# Funnel
S(87.25, whoosh(.5, 300, 5000, .5), .7); S(87.5, sparkle(1.4, .8, 20, 2000, 6000, 14), .7); S(87.5, chime(659.25, 2.0, .5), .6)
S(89.6, pop(600, 1000, .08), .8, -.3); S(90.4, pop(700, 1100, .08), .8, .3)
S(91.5, whoosh(.9, 500, 3000, .5), .5)
for i in range(22): S(91.8 + i * .2 + r2.uniform(0, .1), pop(1500, 1900, .04), .25, r2.uniform(-.6, .6))
S(93.4, pop(500, 300, .1), .7); S(94.4, whoosh(.4, 800, 6000, .8), .6)
# Foda reveal
S(96.95, pencil(.4, 1.0, 10), .9); S(97.0, whoosh(.9, 400, 6000, .5), .6)
S(97.2, rev_swell(.65, 1.0), .7)
S(97.85, impact(2.5, 70, 32, .7, .3), .6); S(97.85, chime(523.25, 3.0, .7), .8); S(97.9, sparkle(1.6, 1.0, 30, 2500, 9000, 15), .9)
S(98.7, whoosh(.5, 3000, 9000, .5), .2)
# Path A
S(99.6, whoosh(.9, 300, 4000, .6), .6); S(100.0, pop(500, 900, .08), .7, -.3); S(100.2, pop(500, 900, .08), .7, .3)
S(100.9, whoosh(.7, 300, 6000, .7), .8)
S(101.4, hum(5.0, 1.0), .9)
k = 101.4
while k < 106.3: S(k, shutter(.6), .7, .4); k += .32
for i in range(16): S(101.6 + i * .27 + 1.0, pop(600 + i * 40, 900 + i * 40, .06), .6, (i % 4 - 1.5) * .3)
S(106.3, whoosh(.6, 500, 6000, .6), .7); S(106.6, impact(1.2, 150, 60, .8, .3), .9); S(106.6, chime(783.99, 1.5, .6), .6)
S(108.0, pop(400, 900, .12), .8); S(108.02, sparkle(.8, .8, 16, 3000, 8000, 16), .7)
# Path B
S(110.76, whoosh(.5, 300, 5000, .5), .7); S(111.0, chime(392.0, 2.2, .7), .8); S(111.0, impact(1.0, 120, 50, .5, .1), .6)
for i, a in enumerate([111.9, 112.9, 113.9, 114.8, 116.0]): S(a, chime([523.25, 587.33, 659.25, 783.99, 880.0][i], 1.0, .5), .7, (i - 2) * .3)
S(112.0, ambience(8.0, .6, 2000, 7000))
S(119.4, whoosh(.9, 400, 4000, .6), .5)
for i in range(3): S(120.1 + i * .25, sine_sweep(.4, 200 + i * 80, 500 + i * 150) * env_ad(int(.4 * SR), 2000, 3) * .25, .8, (i - 1) * .4)
# Close
S(123.28, whoosh(.5, 300, 5000, .5), .6)
for i in range(3): S(123.3 + i * .15, pop(500 + i * 120, 300, .09), .6, (i - 1) * .5)
for i in range(3): S(123.8 + i * .35, pencil(.8, 1.0, 8 + i * 2), .9, (i - 1) * .5)
S(125.5, whoosh(.4, 300, 3000, .5), .5)
S(125.85, impact(1.6, 90, 32, .8, .5), .6)
S(127.3, crack(.8), .7); S(127.5, debris(1.2, 1.0), 1.0)
S(128.4, rev_swell(.7, .8), .6); S(128.95, pop(400, 800, .12), .9); S(129.0, chime(1046.5, 1.4, .6), .7)
S(129.25, whoosh(.4, 800, 4000, .5), .5)
S(129.9, whoosh(.6, 300, 5000, .5), .6)
S(130.2, ambience(4.5, 1.2, 200, 2000))
S(131.0, chime(1318.5, 1.5, .5), .6, .3); S(131.05, chime(1046.5, 1.5, .5), .6, .3)
S(131.4, pencil(.7, 1.0, 6), .6)
# START
S(134.81, whoosh(.4, 200, 2000, .5), .5)
for i in range(5): S(135.0 + i * .14, click(.01, 4200, 1.4), 1.0, .1)
S(135.95, click(.02, 1800, 1.5), 1.0, .3); S(136.0, whoosh(.45, 800, 9000, .85), .9)
S(136.45, impact(3.0, 80, 28, 1.0, .6), .6); S(136.45, chime(523.25, 4.0, .9), .9); S(136.5, sparkle(2.0, 1.2, 40, 2500, 10000, 17), 1.0)
S(137.0, pop(500, 300, .1), .4); S(138.3, pencil(.7, 1.0, 5), .7); S(138.35, chime(1568, 2.0, .45), .6)
S(139.4, sparkle(1.6, .8, 22, 2000, 7000, 18), .8); S(139.4, chime(783.99, 3.0, .5), .7)

# ── MUSIC ───────────────────────────────────────────────────
BPM = 96; BEAT = 60 / BPM; BAR = BEAT * 4
def mf(m): return 440 * 2 ** ((m - 69) / 12)
CH = {'Am': (45, [57, 60, 64, 69]), 'F': (41, [53, 57, 60, 64]), 'C': (48, [55, 60, 64, 67]), 'G': (43, [55, 59, 62, 67]),
      'Bb': (46, [58, 62, 65, 70]), 'E': (40, [52, 56, 59, 64]), 'Dm': (50, [62, 65, 69, 74]), 'Em': (40, [55, 59, 64, 67]),
      'Cmaj9': (48, [55, 59, 62, 64]), 'Fmaj7': (41, [57, 60, 64, 65])}
def M(at, x, g=1.0, pan=0.0): place(MUS, at, x, g, pan)
def pluck(f, d=.9, g=1.0, bright=1.0):
    t = t_(d); x = np.sin(2 * np.pi * f * t) + .35 * bright * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6) + .12 * bright * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 10)
    return x * env_ad(len(t), 60, 5.5) * g * .16
def pad(notes, d, g=1.0, att=.8, cutoff=1800):
    t = t_(d); x = np.zeros((len(t), 2))
    for m in notes:
        for k, det in enumerate((-.08, .08)):
            f = mf(m) * 2 ** (det / 12); ph = rng.uniform(0, 6.28)
            w = np.sin(2 * np.pi * f * t + ph) + .3 * np.sin(4 * np.pi * f * t + ph) + .12 * np.sin(6 * np.pi * f * t)
            x[:, k] += w
    x[:, 0] = lp(x[:, 0], cutoff); x[:, 1] = lp(x[:, 1], cutoff)
    e = np.interp(t, [0, min(att, d / 2), max(d - .6, d / 2), d], [0, 1, 1, 0]); return x * e[:, None] * g * .035
def bass(f, d, g=1.0):
    t = t_(d); x = np.tanh(1.6 * (np.sin(2 * np.pi * f * t) + .25 * np.sin(4 * np.pi * f * t))); return lp(x, 400) * env_ad(len(t), 120, 2) * g * .22
def kick(g=1.0):
    return sine_sweep(.32, 120, 42) * env_ad(int(.32 * SR), 30, 6) * g * .55
def clap(g=1.0):
    x = bp(noise(.18), 900, 4000); e = env_ad(len(x), 10, 9); return x * e * g * .16
def hat(g=1.0, d=.05):
    return hp(noise(d), 7000) * env_ad(int(d * SR), 5, 8) * g * .07
def bell(f, d=2.5, g=1.0): return chime(f, d, g) * 1.2

def section(a, b, prog, layers, arp='up', octave=0, swing=0.0, gain=1.0):
    bar = 0; t0 = a
    while t0 < b - .05:
        name = prog[bar % len(prog)]; root, notes = CH[name]; d = min(BAR, b - t0)
        if 'pad' in layers: M(t0, pad([n + octave for n in notes[:3]] + [notes[0] + 12 + octave], d + .5, layers['pad'] * gain))
        if 'bass' in layers:
            for i in range(4 if layers.get('bass8') is None else 8):
                st = t0 + i * (BEAT if layers.get('bass8') is None else BEAT / 2)
                if st < b: M(st, bass(mf(root), (BEAT if layers.get('bass8') is None else BEAT / 2) * .95, layers['bass'] * gain))
        if 'pluck' in layers:
            seq = notes + [notes[1] + 12, notes[2] + 12, notes[3]] if arp == 'up' else [notes[0], notes[2], notes[1], notes[3], notes[2] + 12, notes[3], notes[1] + 12, notes[2]]
            for i in range(8):
                st = t0 + i * BEAT / 2 + (swing * BEAT / 2 if i % 2 else 0)
                if st < b: M(st, pluck(mf(seq[i % len(seq)] + 12 + octave), .9, layers['pluck'] * gain * (1 if i % 2 == 0 else .7)), 1.0, (-.35, .35)[i % 2])
        for i in range(4):
            st = t0 + i * BEAT
            if st >= b: break
            if 'kick' in layers and (layers.get('kick_half') is None or i % 2 == 0): M(st, kick(layers['kick'] * gain))
            if 'clap' in layers and i % 2 == 1: M(st, clap(layers['clap'] * gain), 1.0, .1)
            if 'hat' in layers:
                for h in range(2 if layers.get('hat16') is None else 4):
                    hs = st + h * BEAT / (2 if layers.get('hat16') is None else 4)
                    if hs < b: M(hs, hat(layers['hat'] * gain * (1 if h % 2 else .6)), 1.0, .3)
        t0 += BAR; bar += 1

# A — hook: hopeful motif that is cut short
for i, m in enumerate([64, 69, 72, 76]): M(0.05 + i * .16, pluck(mf(m + 12), 1.0, .9), 1.0, (-.3, .3)[i % 2])
M(0.0, pad([57, 60, 64], 1.8, .7, .2))
M(0.47, bell(1046.5, 1.5, .5))
# B — the dream
section(3.35, 6.45, ['Fmaj7', 'C'], {'pad': .9, 'pluck': .7})
section(6.45, 10.39, ['G', 'Am', 'Fmaj7', 'C'], {'pad': 1.0, 'pluck': .9, 'bass': .7, 'kick': .6, 'kick_half': 1, 'hat': .5})
M(9.6, riser(.8, .4, 400, 1800))
# C — problem: drone
M(10.6, pad([45, 52, 57], 5.8, 1.2, 1.5, 700)); M(12.6, pad([60, 63], 3.6, .5, 1.5, 900))
# D — trying (tension builds)
section(16.32, 22.15, ['Am', 'F', 'C', 'G'], {'pad': .7, 'pluck': .7, 'bass': .6, 'kick': .6, 'hat': .6})
section(22.15, 29.6, ['Am', 'F', 'Dm', 'E'], {'pad': .7, 'pluck': .75, 'bass': .65, 'bass8': 1, 'kick': .65, 'hat': .7})
M(29.6, riser(.9, .5, 300, 1500))
section(30.4, 34.73, ['Am', 'Am', 'F', 'E'], {'pad': .8, 'pluck': .6, 'bass': .6, 'bass8': 1, 'kick': .7, 'hat': .7, 'hat16': 1})
# E — chaos
section(34.73, 47.07, ['Am', 'Bb', 'Am', 'E'], {'pad': .8, 'pluck': .8, 'bass': .7, 'bass8': 1, 'kick': .75, 'clap': .6, 'hat': .8, 'hat16': 1}, arp='zig', swing=.1)
section(47.07, 52.73, ['Dm', 'Bb', 'E', 'E'], {'pad': .9, 'pluck': .85, 'bass': .75, 'bass8': 1, 'kick': .8, 'clap': .7, 'hat': .9, 'hat16': 1}, arp='zig')
M(51.6, riser(1.1, .5, 300, 2000))
# F — drain: dark
M(52.73, pad([38, 45, 53], 4.9, 1.2, .3, 600))
section(52.73, 57.42, ['Dm', 'Am'], {'kick': .55, 'kick_half': 1})
M(57.42, pad([41, 48, 57], 2.2, 1.0, .5, 500))
# G — price wall: near silence, a low string drone that dies
M(59.3, pad([33, 40, 45], 8.8, 1.3, 2.5, 400))
# H — turn: bell, then warm major swell
M(70.4, pad([48, 55, 59, 62, 64], 3.4, 1.1, 2.2, 2200))
for i, m in enumerate([72, 76, 79, 83]): M(71.6 + i * .45, pluck(mf(m), 1.6, .6), 1.0, (-.3, .3)[i % 2])
M(72.8, riser(.8, .4, 400, 2000))
# I — solution groove (C major)
section(73.57, 75.74, ['C'], {'pad': .9, 'pluck': .7, 'bass': .5})
section(75.74, 87.25, ['C', 'G', 'Am', 'F'], {'pad': .8, 'pluck': .85, 'bass': .7, 'kick': .65, 'clap': .45, 'hat': .55})
section(87.25, 96.6, ['F', 'C', 'G', 'Am'], {'pad': .9, 'pluck': .95, 'bass': .75, 'kick': .7, 'clap': .55, 'hat': .65, 'hat16': 1}, octave=0)
# J — reveal
M(96.6, pad([48, 55, 60, 64, 67], 3.2, 1.0, .4, 2600))
# K — two paths
section(99.53, 110.76, ['C', 'G', 'Am', 'F'], {'pad': .8, 'pluck': .9, 'bass': .7, 'kick': .7, 'clap': .5, 'hat': .6})
section(110.76, 123.28, ['F', 'G', 'Em', 'Am'], {'pad': .9, 'pluck': .85, 'bass': .7, 'kick': .65, 'clap': .5, 'hat': .6, 'hat16': 1})
# L — closing
section(123.28, 129.9, ['F', 'C', 'G', 'Am'], {'pad': .9, 'pluck': .7, 'bass': .5})
section(129.9, 134.81, ['F', 'G', 'C', 'C'], {'pad': 1.0, 'pluck': .9, 'bass': .7, 'kick': .7, 'clap': .5, 'hat': .7, 'hat16': 1})
M(134.81, pad([53, 57, 60, 64], 1.6, .8, .2, 1200)); M(135.0, riser(1.4, .7, 200, 2400))
# N — final
M(136.45, pad([36, 48, 55, 60, 64, 67], 6.3, 1.6, .02, 3200))
for i, m in enumerate([60, 64, 67, 72, 76, 79]): M(136.5 + i * .5, pluck(mf(m + 12), 1.8, .6), 1.0, (-.3, .3)[i % 2])
M(136.45, kick(1.3)); M(136.45, bass(mf(36), 2.5, 1.2))

# ── reverb + write ──────────────────────────────────────────
def reverb(x, secs=2.2, wet=.25, seed=0):
    r = np.random.default_rng(seed); n = int(secs * SR); t = np.arange(n) / SR
    ir = np.stack([r.standard_normal(n) * np.exp(-t * 6.9 / secs), r.standard_normal(n) * np.exp(-t * 6.9 / secs)], 1)
    ir[:, 0] = lp(ir[:, 0], 5000); ir[:, 1] = lp(ir[:, 1], 5000); ir /= np.sqrt((ir ** 2).sum(0))
    y = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], 1)
    return x * (1 - wet) + y * wet * 2.2
SFX = reverb(SFX, 1.6, .18, 1); MUS = reverb(MUS, 2.8, .3, 2)
# hard cut of the music at the tape-stop (10.39) and silence before the bell (68.81)
def gate(bus, a, b, fade=.08):
    i, j = int(a * SR), int(b * SR); f = int(fade * SR)
    bus[i:i + f] *= np.linspace(1, 0, f)[:, None]; bus[i + f:j] = 0
gate(MUS, 10.39, 10.6); gate(MUS, 67.6, 68.85, 1.0)
gate(MUS, 136.25, 136.44, .05)
wavfile.write('sfx.wav', SR, SFX.astype(np.float32)); wavfile.write('music.wav', SR, MUS.astype(np.float32))
print('peaks', np.abs(SFX).max(), np.abs(MUS).max())
