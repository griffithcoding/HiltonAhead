# /public/footage

Drop license-clean Hilton Head Island aerial drone footage here.

## Required files

| File                              | Format | Used by                                  |
| --------------------------------- | ------ | ---------------------------------------- |
| `hilton-head-flyover.mp4`         | H.264  | `<IslandFlyover />` — primary source     |
| `hilton-head-flyover.webm`        | VP9/AV1 | `<IslandFlyover />` — better compression |

If both are present the browser picks the most efficient. If neither is
present, the section degrades gracefully to the poster image
(`photos.coastalAerial`) plus the editorial overlay graphics.

## Specs (target)

- **Duration:** 8–15 seconds, looping seamlessly
- **Resolution:** 1920×1080 (or 2560×1440 if available)
- **Bitrate:** ~3-5 Mbps so the file lands at 3-6 MB
- **Audio:** none (the `<video>` is muted-autoplay anyway)
- **Content:** aerial of HHI coastline, lighthouse, beach, marsh, or marina —
  no faces visible.

## Where to source

1. **Pexels** — free license, search "Hilton Head aerial," "Hilton Head Island
   drone," "Hilton Head lighthouse aerial," "Sea Pines aerial."
2. **Pixabay** — free license.
3. **Visit Hilton Head Island press kit** — apply for media access; the kit
   typically includes high-res aerial B-roll licensed for editorial /
   promotional use.
4. **Storyblocks / Adobe Stock** — paid, but consistent quality.

## After dropping the file in

Re-encode if needed:

```bash
# H.264 MP4 at 1080p, ~4 Mbps, fast-start for streaming
ffmpeg -i source.mov -vcodec libx264 -crf 23 -preset slow -movflags +faststart \
  -an -vf scale=1920:1080 hilton-head-flyover.mp4

# WebM (VP9) for browsers that prefer it
ffmpeg -i source.mov -c:v libvpx-vp9 -b:v 3.5M -an -vf scale=1920:1080 \
  hilton-head-flyover.webm
```

## License attribution

When you drop a file in, add a row here so we have a record.

`hilton-head-flyover.mp4` / `.webm` is a 30s montage of six Pexels-licensed
4K aerial drone clips — six 5.5s segments joined with 0.6s crossfades. All
six are tagged or visually consistent with Hilton Head Island.

| # | Pexels ID | Title                                  | Contributor | License            | Source URL                                     |
| - | --------- | -------------------------------------- | ----------- | ------------------ | ---------------------------------------------- |
| 1 | 32742689  | Aerial View of Tranquil Beachfront     | K (kelly)   | Pexels License (free, commercial OK) | https://www.pexels.com/video/32742689/ |
| 2 | 32742692  | Aerial View of Coastal Wetlands & Boardwalk | K (kelly) | Pexels License | https://www.pexels.com/video/32742692/ |
| 3 | 32742701  | Aerial View of Scenic Golf Course      | K (kelly)   | Pexels License     | https://www.pexels.com/video/32742701/         |
| 4 | 26326850  | Hilton Head                            | Eric Skaggs | Pexels License     | https://www.pexels.com/video/26326850/         |
| 5 | 32742702  | Aerial View of Coastal Beachfront & Resort | K (kelly) | Pexels License | https://www.pexels.com/video/32742702/         |
| 6 | 26326851  | Hilton Head                            | Eric Skaggs | Pexels License     | https://www.pexels.com/video/26326851/         |

Pexels License terms: free for personal and commercial use, modification
allowed, no attribution required (but courtesy credit is welcomed). Full
license: https://www.pexels.com/license/

The montage was assembled with ffmpeg's `xfade` filter chain at 1920×1080,
30 fps. Source clips kept under `/tmp/footage-source/` (gitignored) for
re-edits; re-running the build is documented in `scripts/` if/when added.
