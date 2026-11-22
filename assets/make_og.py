"""Generate og.png (1200x630) in the site's brand style."""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
img = Image.new("RGB", (W, H), (6, 6, 15))
d = ImageDraw.Draw(img)

# radial-ish accent glow (top-left indigo -> bottom-right cyan) baked as gradients
def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

indigo = (99, 102, 241)
cyan = (6, 182, 212)
bg1 = (13, 13, 26)

# soft diagonal gradient bands
for y in range(H):
    t = y / H
    c = lerp(bg1, (6, 6, 15), t)
    d.line([(0, y), (W, y)], fill=c)

# big translucent diagonal gradient accent strip on the right
for x in range(W):
    t = x / W
    a = lerp((0, 0, 0), (120, 130, 250), t)
    # draw a faint vertical bar whose alpha ramps right
    col = lerp(bg1 if t < 0.5 else (8, 8, 20), a, 0.18 + 0.25 * t)
    d.line([(x, 0), (x, H)], fill=col)

def font(sz, bold=False):
    p = "/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf" % ("-Bold" if bold else "")
    return ImageFont.truetype(p, sz)

# gradient text helper (mask)
def grad_text(xy, text, sz, bold=False):
    f = font(sz, bold)
    bbox = d.textbbox((0, 0), text, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    mask = Image.new("L", (tw + 4, th + 4), 0)
    md = ImageDraw.Draw(mask)
    md.text((-bbox[0] + 2, -bbox[1] + 2), text, font=f, fill=255)
    # gradient map
    g = Image.new("RGB", mask.size, indigo)
    gd = ImageDraw.Draw(g)
    for xx in range(mask.size[0]):
        c = lerp(indigo, cyan, xx / max(1, mask.size[0]))
        gd.line([(xx, 0), (xx, mask.size[1])], fill=c)
    out = Image.composite(g, Image.new("RGB", mask.size, img_bg_at(xy)), mask)
    img.paste(out, (xy[0], xy[1]))


def img_bg_at(xy):
    return (10, 10, 22)

L = 90
grad_text((L, 150), "V-Scientific", 92, bold=True)
d.text((L, 270), "AI & Robotics Engineering", font=font(40, True), fill=(241, 241, 247))
d.text((L, 330), "Custom ML · Computer Vision · LLM Agents · Robotics", font=font(28), fill=(160, 160, 184))
d.text((L, 388), "Fixed-price services, a developer API & ready-made tools.", font=font(26), fill=(160, 160, 184))

# price badge pill
d.rounded_rectangle([L, 470, L + 560, 540], radius=35, outline=(99, 102, 241), width=2)
d.text((L + 30, 486), "MSc AI & Robotics (Commendation)  ·  vijay-v-scientific.com",
       font=font(22, True), fill=(129, 140, 248))

img.save("/home/vijay/projects/vijay-website/assets/og.png")
print("wrote og.png", img.size)
