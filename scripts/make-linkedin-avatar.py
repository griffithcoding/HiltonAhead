"""Build a 300x300 LinkedIn avatar from the Hilton Ahead wordmark.

Input:  ~/Downloads/hiltonaheadlogo.png  (wordmark in top-left, cream bg, white canvas)
Output: public/logo/hilton-ahead-linkedin-avatar-300.png
"""
import os
from PIL import Image

SRC = os.path.expanduser(r"~\Downloads\hiltonaheadlogo.png")
OUT = r"public\logo\hilton-ahead-linkedin-avatar-300.png"
AVATAR = 300
PADDING = 12  # breathing room around wordmark inside the 300 square

im = Image.open(SRC).convert("RGB")
px = im.load()
W, H = im.size

# Crop to the non-white region (the cream rectangle + wordmark).
def is_white(rgb, thresh=248):
    return all(c >= thresh for c in rgb)

left, top, right, bottom = W, H, 0, 0
for y in range(H):
    for x in range(W):
        if not is_white(px[x, y]):
            if x < left: left = x
            if x > right: right = x
            if y < top: top = y
            if y > bottom: bottom = y

wordmark = im.crop((left, top, right + 1, bottom + 1))

# Sample the cream background color from the corners of the cropped mark.
wp = wordmark.load()
ww, wh = wordmark.size
samples = [wp[1, 1], wp[ww - 2, 1], wp[1, wh - 2], wp[ww - 2, wh - 2]]
cream = tuple(sum(s[i] for s in samples) // len(samples) for i in range(3))

# Resize wordmark to fit within (AVATAR - 2*PADDING) preserving aspect ratio.
max_w = AVATAR - 2 * PADDING
max_h = AVATAR - 2 * PADDING
scale = min(max_w / ww, max_h / wh)
new_size = (max(1, int(ww * scale)), max(1, int(wh * scale)))
wordmark_resized = wordmark.resize(new_size, Image.LANCZOS)

# Paste centered on a cream 300x300 canvas.
canvas = Image.new("RGB", (AVATAR, AVATAR), cream)
cx = (AVATAR - new_size[0]) // 2
cy = (AVATAR - new_size[1]) // 2
canvas.paste(wordmark_resized, (cx, cy))

os.makedirs(os.path.dirname(OUT), exist_ok=True)
canvas.save(OUT, "PNG", optimize=True)
print(f"wrote {OUT}  cream={cream}  wordmark={ww}x{wh} -> {new_size}")
