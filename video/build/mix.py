import numpy as np
from scipy.io import wavfile
from scipy import signal
SR=48000
_,vo=wavfile.read('../vo/vo.wav'); vo=vo.astype(np.float32); vo/=32768 if vo.dtype!=np.float32 and np.abs(vo).max()>2 else 1
if np.abs(vo).max()>2: vo/=32768
_,sfx=wavfile.read('sfx.wav'); _,mus=wavfile.read('music.wav')
N=len(sfx); v=np.zeros(N); v[:min(N,len(vo))]=vo[:N]
v=v/np.abs(v).max()*.72
# voice envelope for ducking
env=np.abs(v); b,a=signal.butter(2,4/(SR/2)); env=signal.filtfilt(b,a,env); env=np.clip(env/ (np.percentile(env[env>1e-4],90)+1e-9),0,1)
duck=1-.62*env
def rms(x): return np.sqrt(np.mean(x**2)+1e-12)
mus=mus/ rms(mus) * rms(v[v!=0])*.5
sfx=sfx/rms(sfx)*rms(v[v!=0])*.34
mix=np.stack([v,v],1)*1.0 + mus*duck[:,None] + sfx*(1-.25*env)[:,None]
# soft limiter
mix=np.tanh(mix*1.1)/1.1
wavfile.write('mix.wav',SR,mix.astype(np.float32))
print('peak',np.abs(mix).max())
