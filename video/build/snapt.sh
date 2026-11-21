#!/bin/bash
# usage: snapt.sh t1 t2 ... -> contact sheet
OUT=/tmp/claude-0/-home-user-agency/61329949-73f4-5d89-8eab-27afc048e576/scratchpad/snaps
args=(); for t in "$@"; do args+=("renderAt($t)" "$OUT/f_$t.jpg"); done
node snap.js "${args[@]}"
files=(); for t in "$@"; do files+=("$OUT/f_$t.jpg"); done
python3 - "$OUT/contact.jpg" "${files[@]}" <<'PY'
import sys
from PIL import Image, ImageDraw
out=sys.argv[1]; fs=sys.argv[2:]; n=len(fs); cols=min(n,4); rows=(n+cols-1)//cols
tw,th=360,640; sheet=Image.new('RGB',(cols*tw,rows*(th+30)),'white'); d=ImageDraw.Draw(sheet)
for i,f in enumerate(fs):
    im=Image.open(f).resize((tw,th)); x=(i%cols)*tw; y=(i//cols)*(th+30); sheet.paste(im,(x,y+30)); d.text((x+8,y+8),f.split('f_')[1],fill='black')
sheet.save(out,quality=85)
PY
