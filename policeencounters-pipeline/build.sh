#!/usr/bin/env bash
set -euo pipefail
mkdir -p output
curl -fLsS --retry 3 --max-time 180 'https://d34w7g4gy10iej.cloudfront.net/video/2608/DOD_111891141/DOD_111891141.mp4' -o output/jacumba_original.mp4
test -s output/jacumba_original.mp4
printf 'Original U.S. CBP footage. DVIDS 1018022. For editing and QC, not a finished Short.\n' > output/README.txt
