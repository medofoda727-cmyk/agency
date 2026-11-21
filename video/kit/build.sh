#!/bin/bash
# Build one variant of an episode → <ep>/out/<name>_<variant>_9x16.mp4
# usage: kit/build.sh <episodeDir> <name> [variant=full] [captions=1]
#   e.g. kit/build.sh episodes/ep01-mahmoud-furniture foda_mahmoud short
set -e
KIT=$(cd "$(dirname "$0")" && pwd); EP=$(cd "$1" && pwd); NAME=${2:-episode}; VAR=${3:-full}; CAP=${4:-1}
SUF=$([ "$CAP" = "0" ] && echo "_nocap" || echo "")
[ -f "$EP/vo/words_raw.json" ] && python3 "$KIT/captions.py" "$EP" >/dev/null
node "$KIT/render.js" "$EP" 4 0 0 "$VAR" "$CAP"
[ -f "$EP/sfx.wav" ] || (cd "$EP" && python3 cues.py)
python3 "$KIT/mix.py" "$EP" "$VAR"
cd "$EP"; mkdir -p out; OUTF="out/${NAME}_${VAR}${SUF}_9x16.mp4"; FR="frames_${VAR}${SUF}"
ffmpeg -y -hide_banner -loglevel error -i "mix_${VAR}.wav" -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 "mix_${VAR}_norm.wav"
ffmpeg -y -hide_banner -loglevel error -framerate 30 -i "$FR/f%05d.jpg" -c:v libx264 -preset medium -b:v 4600k -pass 1 -passlogfile ".x264_$VAR" -pix_fmt yuv420p -an -f null /dev/null
ffmpeg -y -hide_banner -loglevel error -framerate 30 -i "$FR/f%05d.jpg" -i "mix_${VAR}_norm.wav" -c:v libx264 -preset medium -b:v 4600k -maxrate 9M -bufsize 12M -pass 2 -passlogfile ".x264_$VAR" \
  -pix_fmt yuv420p -profile:v high -level 4.2 -c:a aac -b:a 192k -shortest -movflags +faststart "$OUTF"
rm -f .x264_${VAR}*
ffmpeg -hide_banner -i "$OUTF" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
echo "→ $EP/$OUTF"
