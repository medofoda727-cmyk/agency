"""Mix an episode variant: voice on top, music ducked by a voice-driven sidechain, SFX by RMS.
usage: python3 kit/mix.py <episodeDir> [variant=full]
reads vo/vo.wav, sfx.wav, music.wav (+ variants.json) → mix_<variant>.wav
A cut-down (edl) slices the voice at [a,b] and SFX/music at [a+vshift, b+vshift], with short crossfades.
"""
import numpy as np, sys, os, json
from scipy.io import wavfile
from scipy import signal
SR = 48000
os.chdir(sys.argv[1] if len(sys.argv) > 1 else '.')
VAR = sys.argv[2] if len(sys.argv) > 2 else 'full'
_, vo = wavfile.read('vo/vo.wav'); vo = vo.astype(np.float32)
if np.abs(vo).max() > 2: vo /= 32768
_, sfx = wavfile.read('sfx.wav'); _, mus = wavfile.read('music.wav')
N = len(sfx); v = np.zeros(N); v[:min(N, len(vo))] = vo[:N]
v = v / np.abs(v).max() * .72
def rms(x): return np.sqrt(np.mean(x ** 2) + 1e-12)
mus = mus / rms(mus) * rms(v[v != 0]) * .5
sfx = sfx / rms(sfx) * rms(v[v != 0]) * .34

variants = json.load(open('variants.json')) if os.path.exists('variants.json') else {}
edl = variants.get(VAR, {}).get('edl')
if edl:
    def cut(x, a, b, fade):
        i, j = int(a * SR), int(b * SR); y = x[i:j].copy(); f = int(fade * SR)
        if f: r = np.linspace(0, 1, f); sh = (f,) + (1,) * (y.ndim - 1); y[:f] *= r.reshape(sh); y[-f:] *= r[::-1].reshape(sh)
        return y
    def join(parts, xf):
        out = parts[0]; n = int(xf * SR)
        for p in parts[1:]:
            if n and len(out) > n: out = np.concatenate([out[:-n], out[-n:] + p[:n], p[n:]])
            else: out = np.concatenate([out, p])
        return out
    # voice: hard cuts inside pauses (tiny fades, no overlap); picture-locked stems: overlap-crossfade
    v = np.concatenate([cut(v, e['a'], e['b'], .012) for e in edl])
    sl = lambda x, xf: join([cut(x, e['a'] + e.get('vshift', 0), e['b'] + e.get('vshift', 0), xf) for e in edl], xf)
    sfx = sl(sfx, .04); mus = sl(mus, .15)
    L = len(v); sfx = np.pad(sfx, ((0, max(0, L - len(sfx))), (0, 0)))[:L]; mus = np.pad(mus, ((0, max(0, L - len(mus))), (0, 0)))[:L]
    # last 1.2 s: fade music + sfx tails so the cut-down ends clean
    f = int(1.2 * SR); r = np.linspace(1, 0, f)[:, None]; sfx[-f:] *= r; mus[-f:] *= r

env = np.abs(v); b, a = signal.butter(2, 4 / (SR / 2)); env = signal.filtfilt(b, a, env)
env = np.clip(env / (np.percentile(env[env > 1e-4], 90) + 1e-9), 0, 1)
duck = 1 - .62 * env
mix = np.stack([v, v], 1) + mus * duck[:, None] + sfx * (1 - .25 * env)[:, None]
mix = np.tanh(mix * 1.1) / 1.1
wavfile.write(f'mix_{VAR}.wav', SR, mix.astype(np.float32))
print(VAR, 'len', round(len(mix) / SR, 2), 's  peak', round(float(np.abs(mix).max()), 3))
