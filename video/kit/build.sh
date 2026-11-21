#!/bin/bash
# Full build of one episode → <ep>/out/<name>_9x16.mp4
# usage: kit/build.sh episodes/ep01-mahmoud-furniture foda_mahmoud_story
set -e
KIT=$(cd "$(dirname "$0")" && pwd); EP=$(cd "$1" && pwd); NAME=${2:-episode}
node "$KIT/render.js" "$EP" 4
(cd "$EP" && python3 cues.py) && python3 "$KIT/mix.py" "$EP"
cd "$EP"; mkdir -p out
ffmpeg -y -hide_banner -loglevel error -i mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 mix_norm.wav
ffmpeg -y -hide_banner -loglevel error -framerate 30 -i frames/f%05d.jpg -c:v libx264 -preset medium -b:v 4600k -pass 1 -passlogfile .x264 -pix_fmt yuv420p -an -f null /dev/null
ffmpeg -y -hide_banner -loglevel error -framerate 30 -i frames/f%05d.jpg -i mix_norm.wav -c:v libx264 -preset medium -b:v 4600k -maxrate 9M -bufsize 12M -pass 2 -passlogfile .x264 \
  -pix_fmt yuv420p -profile:v high -level 4.2 -c:a aac -b:a 192k -shortest -movflags +faststart "out/${NAME}_9x16.mp4"
rm -f .x264*
ffmpeg -hide_banner -i "out/${NAME}_9x16.mp4" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
echo "→ $EP/out/${NAME}_9x16.mp4"
