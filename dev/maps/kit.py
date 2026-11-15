"""Props and finishing shared by the Edretnor scenes (on top of bm.py, the project's battlemap renderer)."""
import math, json, cairocffi as cairo
from PIL import Image
from bm import Map, C, OUT

def grass(m, base=(86, 112, 58), var=(18, 20, 10), seed=0):
    n = m.noise(3, 5, seed); n2 = m.noise(12, 3, seed + 7)
    for i in range(3): m.col[..., i] = base[i] + (n - 0.5) * var[i] * 2 + (n2 - 0.5) * var[i]

def dirt(m, mask, col=(132, 108, 76), seed=3):
    n = m.noise(8, 4, seed)[..., None]
    m.paint(mask, 0)  # clear
    m.col += mask[..., None] * (col + (n - 0.5) * 30)

def text(m, x, y, s, size=0.5, col=(240, 232, 210), ctx=None, bold=True, outline=True):
    c = ctx or m.t
    c.select_font_face("serif", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD if bold else cairo.FONT_WEIGHT_NORMAL)
    c.set_font_size(size); xb, yb, tw, th, _, _ = c.text_extents(s)
    c.move_to(x - tw / 2 - xb, y - th / 2 - yb)
    c.text_path(s)
    if outline: c.set_source_rgba(*C(OUT)); c.set_line_width(size * 0.12); c.stroke_preserve()
    c.set_source_rgba(*C(col)); c.fill()

def bleachers(m, x, y, w, h, rows=4, col=(128, 92, 56), facing='n'):
    m.poly(m.rect(x, y, w, h), (70, 50, 32), lw=0.06, shadow=0.3)
    for i in range(rows):
        t = i / rows
        if facing in 'ns':
            yy = y + (t if facing == 'n' else 1 - t - 1 / rows) * h
            m.poly(m.rect(x + 0.05, yy + 0.05, w - 0.1, h / rows - 0.1), m.jit(col, 6), lw=0.03, shadow=0)
            m.line([(x + 0.05, yy + h / rows * 0.5), (x + w - 0.05, yy + h / rows * 0.5)], tuple(int(v * 0.7) for v in col), 0.02)
        else:
            xx = x + (t if facing == 'w' else 1 - t - 1 / rows) * w
            m.poly(m.rect(xx + 0.05, y + 0.05, w / rows - 0.1, h - 0.1), m.jit(col, 6), lw=0.03, shadow=0)
    for k in range(int((w if facing in 'ns' else h) / 3) + 1):   # spectators
        pass

def crowd(m, x, y, w, h, n, seed=0):
    import random; R = random.Random(seed)
    cols = [(150, 52, 44), (60, 82, 132), (172, 148, 70), (88, 120, 70), (120, 70, 120), (180, 170, 150), (90, 70, 50)]
    for _ in range(n):
        cx, cy = x + R.uniform(0.2, w - 0.2), y + R.uniform(0.2, h - 0.2)
        m.circle(cx, cy, 0.17, R.choice(cols), lw=0.025, shadow=0.05)
        m.circle(cx, cy, 0.08, (214, 178, 140), outline=None, shadow=0)

def tent(m, x, y, w, h, col=(176, 60, 48), stripe=(226, 214, 186), a=0.0):
    cx, cy = x + w / 2, y + h / 2
    m.poly(m.rect(x, y, w, h, a), col, lw=0.06, shadow=0.35)
    n = 6
    for i in range(n):
        if i % 2: continue
        t0, t1 = i / n, (i + 1) / n
        tri = m.rot([(-w / 2 + w * t0, -h / 2), (-w / 2 + w * t1, -h / 2), (0, 0)], cx, cy, a)
        m.poly(tri, stripe, outline=None, shadow=0)
        tri = m.rot([(-w / 2 + w * t0, h / 2), (-w / 2 + w * t1, h / 2), (0, 0)], cx, cy, a)
        m.poly(tri, stripe, outline=None, shadow=0)
    m.line(m.rot([(-w / 2, -h / 2), (w / 2, h / 2)], cx, cy, a), (40, 30, 26), 0.03, alpha=0.5)
    m.line(m.rot([(w / 2, -h / 2), (-w / 2, h / 2)], cx, cy, a), (40, 30, 26), 0.03, alpha=0.5)
    m.circle(cx, cy, 0.12, (90, 70, 40), shadow=0)

def banner(m, x, y, col, a=-0.6):
    m.circle(x, y, 0.1, (70, 52, 34), shadow=0.25)
    p = m.rot([(0, -0.08), (0.9, -0.08), (0.75, 0.12), (0.9, 0.3), (0, 0.3)], x, y, a)
    m.poly(p, col, lw=0.03, shadow=0, ctx=m.t)

def brazier(m, x, y, lit=True):
    m.circle(x, y, 0.32, (58, 52, 48), lw=0.05, shadow=0.15)
    m.circle(x, y, 0.22, (30, 24, 20), outline=None, shadow=0)
    if lit: m.flames(x, y, 0.22, n=5)

def lamp_post(m, x, y, col=(255, 220, 150)):
    m.circle(x, y, 0.16, (60, 54, 48), shadow=0.2)
    m.circle(x, y, 0.1, col, outline=None, shadow=0)
    m.glow_at(x, y, 1.2, col, 0.35)

def finish(m, name, out_dir, assets, glow_blur=0):
    img = m.compose()
    img.save(f"{assets}/{name}.webp", quality=82, method=5)
    th = img.copy(); th.thumbnail((400, 400)); th.save(f"{assets}/{name}-thumb.webp", quality=70)
    m.save_data(f"{out_dir}/{name}.json")
    print(name, img.size)
