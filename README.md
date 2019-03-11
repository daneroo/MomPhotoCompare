# Compare Photos in Google Photos and iCloud

## Notes

- Almost all files are different!

## Usage

1. first hash, produces `gPhoto.json` and `iCloud.json`
2. second compare

```bash
time node js/hash gPhoto
time node js/hash iCloud
```

```bash
time node js/compare gPhoto.json iCloud.json
```

## Previous bash start

```bash
./count.sh
./sha1sum.sh
```
