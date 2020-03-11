# Compare Photos in Google Photos and iCloud

All old iCloud photos were imported into Google Photos.

tl;dr

- In the end I simply downloaded all iCloud photos, and imported them into GooglePhotos (not original resolution)
- iCloud Originals were imported into `/archive/media/photo/mom/iCloudPhotos-2019-08-24`

Comparing iCloud and GooglePhots Downloads, to hopefully consiladte them both, with no loss and no duplicates

## Notes

2019-08-24 Fetched all iCloud Photos again

```bash
...iCloudPhotos-Mom-2019-08-24$ sha1sum * | sort > ../iCloudPhotos-Mom-2019-08-24.sorted.sha1sums
...iCloudPhotos-Mom-2019-08-24$ sha1sum * > ../iCloudPhotos-Mom-2019-08-24.unsorted.sha1sums

...iCloudPhotos-Mom-2019-03-10$ sha1sum * | sort > ../iCloudPhotos-Mom-2019-03-10.sorted.sha1sums
...iCloudPhotos-Mom-2019-03-10$ sha1sum * > ../iCloudPhotos-Mom-2019-03-10.unsorted.sha1sums

```

2019-03-10

- Almost all files are different!

```json
{ path: 'gPhoto.json', sz: { count: 1153, size: '1862.21MB' } }
{ path: 'iCloud.json', sz: { count: 1058, size: '2842.23MB' } }
// inverted by hash
{ invertedA: 1153, invertedB: 1056, union: 2202 }
// inverted by stamp
{ invertedA: 938, invertedB: 880, union: 938 }

```

example:  JPEG Quality 92 n iCloud, 68 on GooglePhotos, with filsize 1611250 -> 610205

```bash
ls -l ./gPhoto/2019/IMG_1256.JPG ./iCloud/IMG_1256.JPG
jhead ./gPhoto/2019/IMG_1256.JPG ./iCloud/IMG_1256.JPG
```

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

## Perkeep

```bash
# pk-put init -gpgkey XYXXYXYXYYX # just once
pk-put file --permanode --title='Mom-gPhoto' --tag=mom ./gPhoto
pk-put file --permanode --title='Mom-iCloud' --tag=mom ./iCloud
```
