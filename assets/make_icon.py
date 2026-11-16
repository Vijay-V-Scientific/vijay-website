"""Generate apple-touch-icon.png (180x180) from the brand 'V' design."""
from PIL import Image, ImageDraw

S = 180
img = Image.new("RGBA", (S, S), (6, 6, 15, 255))
d = ImageDraw.Draw(img)

# rounded dark tile already the bg; draw a gradient 'V' by blending two colours
def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

c1, c2 = (99, 102, 241), (6, 182, 212)
pts = [(45, 45), (90, 135), (135, 45)]
width = 22
# draw the two arms with a colour gradient along x
def arm(p0, p1):
    steps = 40
    for i in range(steps):
        t0, t1 = i / steps, (i + 1) / steps
        x0 = p0[0] + (p1[0] - p0[0]) * t0
        y0 = p0[1] + (p1[1] - p0[1]) * t0
        x1 = p0[0] + (p1[0] - p0[0]) * t1
        y1 = p0[1] + (p1[1] - p0[1]) * t1
        tx = ((x0 + 45) / 135)
        d.line([(x0, y0), (x1, y1)], fill=lerp(c1, c2, min(1, max(0, tx))) + (255,), width=width)

arm(pts[0], pts[1])
arm(pts[1], pts[2])
for p in pts:
    r = width / 2
    t = (p[0] - 45) / 90
    col = lerp(c1, c2, min(1, max(0, t))) + (255,)
    d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=col)

img.save("apple-touch-icon.png")
print("wrote apple-touch-icon.png", img.size)
