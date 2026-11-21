"""Synthesize a small UI sound-effect kit (whoosh, pop, tick, impact, stamp) as 48 kHz WAVs.
    python3 scripts/synth_sfx.py <out_dir>
Deterministic (fixed seed), no samples, no licences needed."""
import sys, os, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)
out = sys.argv[1]; os.makedirs(out, exist_ok=True)

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a, r):  # attack/release in seconds, exponential release
    e = np.ones(n); na = max(1, int(SR * a)); e[:na] = np.linspace(0, 1, na)
    e[na:] = np.exp(-np.arange(n - na) / (SR * r)); return e
def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y
def bandsweep(x, f0, f1):  # time-varying band-pass from two one-pole filters
    n = len(x); fcs = np.geomspace(f0, f1, n); y = np.zeros(n); lo = hi = 0.0
    for i, v in enumerate(x):
        a = np.exp(-2 * np.pi * fcs[i] / SR); lo = (1 - a) * v + a * lo
        b = np.exp(-2 * np.pi * fcs[i] * 0.35 / SR); hi = (1 - b) * v + b * hi
        y[i] = lo - hi
    return y
def biquad_bp_sweep(x, f0, f1, q):  # resonant band-pass (RBJ) with a swept centre
    n = len(x); fcs = np.geomspace(f0, f1, n); y = np.zeros(n); x1 = x2 = y1 = y2 = 0.0
    for i, v in enumerate(x):
        w = 2 * np.pi * fcs[i] / SR; al = np.sin(w) / (2 * q); a0 = 1 + al
        b0, b2, a1, a2 = al / a0, -al / a0, -2 * np.cos(w) / a0, (1 - al) / a0
        o = b0 * v + b2 * x2 - a1 * y1 - a2 * y2; x2, x1 = x1, v; y2, y1 = y1, o; y[i] = o
    return y
def lp4(x, fc):  # four cascaded one-poles: a real low-pass
    for _ in range(4): x = onepole_lp(x, fc)
    return x
def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    st = np.stack([x, x], 1); pcm = (st * 32767).astype(np.int16)
    with wave.open(os.path.join(out, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

# whoosh: noise through a rising band-pass, swell then fall
d = 0.42; n = int(SR * d); x = rng.standard_normal(n)
y = biquad_bp_sweep(biquad_bp_sweep(x, 350, 5000, 2.2), 350, 5000, 2.2); sh = np.sin(np.pi * np.linspace(0, 1, n) ** 0.7) ** 2
save("whoosh.wav", y * sh)

# pop: pitch-dropping sine with a tiny click
tt = t(0.09); f = 900 * np.exp(-tt * 35) + 260; ph = 2 * np.pi * np.cumsum(f) / SR
save("pop.wav", np.sin(ph) * env(len(tt), 0.002, 0.025) + 0.15 * rng.standard_normal(len(tt)) * env(len(tt), 0.0005, 0.003))

# tick: short bright double partial
tt = t(0.06); save("tick.wav", (np.sin(2 * np.pi * 2600 * tt) + 0.5 * np.sin(2 * np.pi * 3900 * tt)) * env(len(tt), 0.001, 0.012))

# impact: sub thud + noise crack + coin shimmer
tt = t(0.9); n = len(tt)
sub = np.sin(2 * np.pi * (55 + 60 * np.exp(-tt * 18)) * tt) * env(n, 0.003, 0.22)
crack = onepole_lp(rng.standard_normal(n), 3000) * env(n, 0.001, 0.03)
shim = sum(np.sin(2 * np.pi * fq * tt + p) for fq, p in [(3150, 0), (4420, 1.1), (5890, 2.3), (7010, .4)]) * env(n, 0.004, 0.18) * 0.18
save("impact.wav", sub + 0.6 * crack + shim)

# stamp: dull low thud
tt = t(0.25); n = len(tt)
save("stamp.wav", lp4(rng.standard_normal(n), 400) * env(n, 0.001, 0.05) * 6 + np.sin(2 * np.pi * (80 + 50 * np.exp(-tt * 40)) * tt) * env(n, 0.002, 0.08))
print("ok:", sorted(os.listdir(out)))
