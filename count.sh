#!/usr/bin/env bash

for d in gPhoto iCloud; do
  echo "${d}"
  echo " - Size (MB): `du -sm $d`"
  echo " - Count: `find ${d} -type f | wc -l`"
done
