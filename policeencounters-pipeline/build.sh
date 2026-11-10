#!/usr/bin/env bash
set -euo pipefail
mkdir -p source output
URL='https://d34w7g4gy10iej.cloudfront.net/video/2610/DOD_112028728/DOD_112028728.mp4'
PAGE='https://www.dvidshub.net/video/1025347/coast-guard-helicopter-medevacs-injured-rafter-rogue-river'
if ! curl -fLsS --retry 2 --max-time 120 "$URL" -o source/rogue.mp4; then
  curl -fLsS --retry 2 https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ./yt-dlp
  chmod +x ./yt-dlp
  ./yt-dlp -f 'b[ext=mp4]/best' -o source/rogue.mp4 "$PAGE"
fi
ffprobe -v error -show_entries format=duration,size:stream=width,height,codec_name -of default=noprint_wrappers=1 source/rogue.mp4 > output/source_probe.txt
ffmpeg -hide_banner -loglevel error -y -i source/rogue.mp4 -vf 'fps=1/6,scale=480:-2,tile=4x2' -frames:v 1 output/preview_sheet.jpg
cp source/rogue.mp4 output/rogue_original_for_review.mp4
printf 'DVIDS video ID 1025347 | 2026-10-01 | U.S. Coast Guard Northwest | public domain image | %s\nThis is UNEDITED REVIEW FOOTAGE, not a finished Short. Do not publish this artifact.\n' "$PAGE" > output/credits.txt
