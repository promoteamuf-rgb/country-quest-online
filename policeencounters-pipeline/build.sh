#!/usr/bin/env bash
set -euo pipefail
mkdir -p source output
SOURCE_URL='https://d34w7g4gy10iej.cloudfront.net/video/2608/DOD_111891141/DOD_111891141.mp4'
DVIDS_PAGE='https://www.dvidshub.net/video/1018022/border-patrol-agents-rescue-individual-suffering-heat-exhaustion-jacumba-mountains'
echo 'Downloading official U.S. CBP / DVIDS source...'
if ! curl -fLsS --retry 3 --max-time 180 "$SOURCE_URL" -o source/original.mp4; then
  echo 'Trying alternate federal CDN resolution...'
  if ! curl -fLsS --retry 2 --max-time 180 'https://d34w7g4gy10iej.cloudfront.net/video/2608/DOD_111891141/DOD_111891141-1280x720-3000k.mp4' -o source/original.mp4; then
    echo 'Trying downloader on official DVIDS release...'
    curl -fLsS --retry 3 https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ./yt-dlp
    chmod +x ./yt-dlp
    ./yt-dlp -f 'b[ext=mp4]/best' -o 'source/original.mp4' "$DVIDS_PAGE"
  fi
fi
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height -of default=noprint_wrappers=1 source/original.mp4
espeak-ng -v en-us -s 152 -p 46 -a 145 -w source/narration.wav "On August first, twenty twenty six, a person was lost in California's Jacumba Mountains with very little water. In temperatures near one hundred and seven degrees, Border Patrol agents began a search. They found the person, provided medical aid, and coordinated an airlift to an ambulance. This is real U.S. Customs and Border Protection footage."
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
VF="[0:v]split=2[vbg][vfg];[vbg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:10,eq=brightness=-0.12[bg];[vfg]scale=1080:1400:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2:shortest=1[v0];[v0]drawbox=x=0:y=0:w=1080:h=285:color=black@0.7:t=fill,drawtext=fontfile=$FONT:text='LOST IN EXTREME HEAT':fontcolor=white:fontsize=58:x=(w-text_w)/2:y=75,drawtext=fontfile=$FONT:text='BORDER PATROL RESCUE':fontcolor=yellow:fontsize=40:x=(w-text_w)/2:y=175,drawbox=x=0:y=1570:w=1080:h=350:color=black@0.66:t=fill,drawtext=fontfile=$FONT:text='AUGUST 1 2026 - CALIFORNIA':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=1610,drawtext=fontfile=$FONT:text='107 DEGREE HEAT':fontcolor=white:fontsize=49:x=(w-text_w)/2:y=1675:enable='between(t,0,9)',drawtext=fontfile=$FONT:text='AGENTS FOUND THE LOST PERSON':fontcolor=white:fontsize=35:x=(w-text_w)/2:y=1675:enable='between(t,9,23)',drawtext=fontfile=$FONT:text='AIRLIFTED FOR MEDICAL CARE':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=1675:enable='gte(t,23)',drawtext=fontfile=$FONT:text='SOURCE - U.S. CBP / DVIDS':fontcolor=white:fontsize=27:x=(w-text_w)/2:y=1815,fps=30,format=yuv420p[vout]"
ffmpeg -hide_banner -loglevel warning -y -i source/original.mp4 -i source/narration.wav -filter_complex "$VF;[1:a]apad=pad_dur=45[aout]" -map '[vout]' -map '[aout]' -t 37.5 -c:v libx264 -preset veryfast -crf 22 -profile:v high -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart output/PoliceEncounters_Jacumba_Rescue_Short_01.mp4
printf 'Source: %s\nAgency: U.S. Customs and Border Protection Office of Public Affairs\nDVIDS Video ID: 1018022\nU.S. public-domain government footage; DVIDS usage restrictions and privacy rights still apply.\nThe appearance of U.S. Department of War (DoW) visual information does not imply or constitute DoW endorsement.\n' "$DVIDS_PAGE" > output/SOURCE_AND_CREDITS.txt
ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 output/PoliceEncounters_Jacumba_Rescue_Short_01.mp4
