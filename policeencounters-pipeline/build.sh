#!/usr/bin/env bash
set -euo pipefail
mkdir -p output
URL='https://d34w7g4gy10iej.cloudfront.net/video/2608/DOD_111891141/DOD_111891141.mp4'
curl -fLsS --retry 3 --max-time 180 "$URL" -o output/jacumba_original.mp4
ffprobe -v error -show_entries format=duration,size:stream=width,height,codec_name -of default=noprint_wrappers=1 output/jacumba_original.mp4 > output/probe.txt
ffmpeg -hide_banner -loglevel error -y -i output/jacumba_original.mp4 -vf 'fps=1/4,scale=480:-2,tile=5x2' -frames:v 1 output/preview.jpg
echo 'UNEDITED SOURCE FOR PRIVATE QC ONLY. U.S. CBP DVIDS 1018022. Do not publish raw footage.' > output/README.txt
