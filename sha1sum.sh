#!/usr/bin/env bash

mkdir -p data

for d in gPhoto iCloud; do
  echo "Hash ${d}"
  rm "data/${d}.sha1dums"
  find ${d} -type f -print0 | while IFS= read -r -d '' file; do
      echo "sha1sum $file"
      sha1sum "$file" >> "data/${d}.sha1dums"
  done
done


