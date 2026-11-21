import re,subprocess,json
lines=[re.sub(r'\[[^\]]*\]','',l).strip() for l in open('script_compact.txt') if l.strip()]
out=subprocess.run(['ffmpeg','-hide_banner','-i','vo.wav','-af','silencedetect=noise=-38dB:d=0.25','-f','null','-'],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',out)]; en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',out)]
sil=[( (a+b)/2,b-a) for a,b in zip(st,en)]
speech_start=en[0] if st[0]<0.05 else 0.0
end=st[-1] if len(st)>len(en) else 139.2
L=[len(l) for l in lines]; tot=sum(L)
# DP alignment: choose boundaries among silences monotonic, cost = |expected - silence|, prefer longer silences
import itertools
cands=[s for s in sil if s[0]>speech_start+0.5]
exp=[];c=0
for l in L[:-1]:
    c+=l; exp.append(speech_start+(end-speech_start)*c/tot)
n=len(exp); m=len(cands); INF=1e9
dp=[[INF]*(m) for _ in range(n)]; bk=[[-1]*m for _ in range(n)]
for j in range(m): dp[0][j]=abs(cands[j][0]-exp[0])-2*cands[j][1]
for i in range(1,n):
    best=INF;bj=-1
    for j in range(m):
        if j>0 and dp[i-1][j-1]<best: best=dp[i-1][j-1]; bj=j-1
        if bj>=0: dp[i][j]=best+abs(cands[j][0]-exp[i])-2*cands[j][1]; bk[i][j]=bj
j=min(range(m),key=lambda j:dp[n-1][j]); bounds=[]
for i in range(n-1,-1,-1): bounds.append(cands[j][0]); j=bk[i][j]
bounds=bounds[::-1]
times=[speech_start]+bounds+[end]
res=[{'i':i,'start':round(times[i],2),'end':round(times[i+1],2),'text':lines[i]} for i in range(len(lines))]
json.dump(res,open('timing.json','w'),ensure_ascii=False,indent=1)
for r in res: print(f"{r['i']:2d} {r['start']:6.2f}-{r['end']:6.2f} exp~ {r['text'][:50]}")
