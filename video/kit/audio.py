"""
FODA STORY SERIES — audio kit: SFX synthesis library, music engine, buses.
Episode cue sheets do:  from audio import *;  setup(DUR);  S(...)/M(...)/section(...);  finish(...)
"""
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
DUR = N = None
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
SFX = MUS = None
def setup(dur, seed=7):
    """allocate the two stereo buses for an episode of `dur` seconds"""
    global DUR, N, SFX, MUS, rng
    DUR = dur; N = int(SR * dur); rng = np.random.default_rng(seed)
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

# ── MUSIC ENGINE ───────────────────────────────────────────────────
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

# ── reverb / gates / output ──────────────────────────────────
def reverb(x, secs=2.2, wet=.25, seed=0):
    r = np.random.default_rng(seed); n = int(secs * SR); t = np.arange(n) / SR
    ir = np.stack([r.standard_normal(n) * np.exp(-t * 6.9 / secs), r.standard_normal(n) * np.exp(-t * 6.9 / secs)], 1)
    ir[:, 0] = lp(ir[:, 0], 5000); ir[:, 1] = lp(ir[:, 1], 5000); ir /= np.sqrt((ir ** 2).sum(0))
    y = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], 1)
    return x * (1 - wet) + y * wet * 2.2
def gate(bus, a, b, fade=.08):
    i, j = int(a * SR), int(b * SR); f = int(fade * SR)
    bus[i:i + f] *= np.linspace(1, 0, f)[:, None]; bus[i + f:j] = 0

def finish(gates=(), out_dir='.'):
    """reverb both buses, apply music gates [(a, b, fade)], write sfx.wav + music.wav"""
    global SFX, MUS
    SFX = reverb(SFX, 1.6, .18, 1); MUS = reverb(MUS, 2.8, .3, 2)
    for g in gates: gate(MUS, *g)
    import os
    wavfile.write(os.path.join(out_dir, 'sfx.wav'), SR, SFX.astype(np.float32)); wavfile.write(os.path.join(out_dir, 'music.wav'), SR, MUS.astype(np.float32))
    print('peaks', np.abs(SFX).max(), np.abs(MUS).max())
