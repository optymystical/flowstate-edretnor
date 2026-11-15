"""The Edretnor crawl map: 11x11 crawl tiles (300 px each), a rounded 9x9 city inside walls and wilderness. The city outline
here must match CITY in scripts/crawl-rules.mjs. Nothing secret is drawn: cisterns, the barracks and the circles are placed by the
setup macro, not the map."""
import math, random
from bm import Map, OUT
from kit import *

ASSETS = "../../assets/scenes"; OUTD = "out"
T = 5                       # renderer units per crawl tile
m = Map(11 * T, 11 * T, G=60, Q=3, seed=41)
EXTRA = {(2, 1), (9, 8), (1, 8)}
CITY = {(x, y) for x in range(1, 10) for y in range(1, 10) if (x - 5) ** 2 + (y - 5) ** 2 <= 20} | EXTRA
SQUARE, HALL, OVERLOOK = (5, 5), (5, 4), (9, 1)
R = random.Random(7)

# ---- ground: fields and meadow outside, packed earth inside ----
grass(m, base=(92, 110, 62), seed=2)
for tx in range(11):
    for ty in range(11):
        if (tx, ty) in CITY or (tx, ty) == OVERLOOK: continue
        if R.random() < 0.45:     # farm plots
            ang = R.choice([0, math.pi / 2]); col = R.choice([(150, 140, 80), (120, 132, 70), (138, 116, 74), (104, 124, 60)])
            x0, y0 = tx * T + 0.4, ty * T + 0.4
            mk = m.mask_poly([(x0, y0), (x0 + T - 0.8, y0), (x0 + T - 0.8, y0 + T - 0.8), (x0, y0 + T - 0.8)], blur=0.1)
            m.paint(mk * 0.8, col)
            for k in range(1, 9):
                if ang == 0: m.line([(x0, y0 + k * 0.5), (x0 + T - 0.8, y0 + k * 0.5)], tuple(int(v * 0.85) for v in col), 0.05, alpha=0.6)
                else: m.line([(x0 + k * 0.5, y0), (x0 + k * 0.5, y0 + T - 0.8)], tuple(int(v * 0.85) for v in col), 0.05, alpha=0.6)
city_mask = sum(m.mask_poly([(x * T, y * T), (x * T + T, y * T), (x * T + T, y * T + T), (x * T, y * T + T)]) for x, y in CITY)
m.paint(city_mask, (124, 110, 90))

# ---- roads out of the four gates ----
for a, b in [((27.5, 0), (27.5, 5)), ((55, 27.5), (50, 27.5)), ((27.5, 55), (27.5, 50)), ((0, 27.5), (5, 27.5))]:
    m.paint(m.mask_line([a, b], 1.0, blur=0.15), (134, 116, 86))

# ---- streets on every tile edge inside the city, cobbles on the main cross ----
for x, y in CITY:
    for (dx, dy) in [(1, 0), (0, 1)]:
        if (x + dx, y + dy) in CITY:
            if dx: m.paint(m.mask_line([(x * T + T, y * T), (x * T + T, y * T + T)], 0.7, blur=0.05), (146, 132, 108))
            else: m.paint(m.mask_line([(x * T, y * T + T), (x * T + T, y * T + T)], 0.7, blur=0.05), (146, 132, 108))
m.paint(m.mask_line([(27.5, 5), (27.5, 50)], 1.1, blur=0.05), (150, 140, 122))
m.paint(m.mask_line([(5, 27.5), (50, 27.5)], 1.1, blur=0.05), (150, 140, 122))

ROOFS = [(150, 70, 52), (132, 62, 46), (112, 92, 70), (96, 84, 76), (160, 92, 60), (120, 74, 56)]
def houses(tx, ty, density=1.0):
    x0, y0 = tx * T + 0.5, ty * T + 0.5
    for row in range(3):
        for col in range(3):
            if R.random() > 0.92 * density: continue
            w, h = R.uniform(0.9, 1.35), R.uniform(0.9, 1.3)
            hx, hy = x0 + col * 1.4 + R.uniform(0, 0.12), y0 + row * 1.4 + R.uniform(0, 0.12)
            m.roof(hx, hy, w, h, m.jit(R.choice(ROOFS), 6), ridge=R.choice('hv'), chimney=False)
    if R.random() < 0.35: m.tree(x0 + R.uniform(0.5, 3.5), y0 + R.uniform(0.5, 3.5), 0.45)

for (tx, ty) in sorted(CITY):
    if (tx, ty) in (SQUARE, HALL): continue
    houses(tx, ty)

# the town square: plaza, fountain, market stalls
sx, sy = SQUARE[0] * T, SQUARE[1] * T
m.flagstones(sx + 0.35, sy + 0.35, T - 0.7, T - 0.7, (156, 148, 134), bw=0.7, bh=0.45)
m.circle(sx + 2.5, sy + 2.5, 0.9, (120, 116, 110), lw=0.06, shadow=0.15); m.circle(sx + 2.5, sy + 2.5, 0.7, (70, 110, 130), outline=None, shadow=0)
m.circle(sx + 2.5, sy + 2.5, 0.2, (150, 146, 138), shadow=0)
for k in range(8):
    a = 2 * math.pi * k / 8; tent(m, sx + 2.5 + 1.75 * math.cos(a) - 0.3, sy + 2.5 + 1.75 * math.sin(a) - 0.25, 0.6, 0.5,
                                 [(176, 60, 48), (58, 84, 140), (176, 140, 54), (70, 120, 72)][k % 4], a=a)
# Town Hall: a large slate-roofed hall around a courtyard
hx, hy = HALL[0] * T, HALL[1] * T
m.flagstones(hx + 0.3, hy + 0.3, T - 0.6, T - 0.6, (140, 132, 120), bw=0.8, bh=0.5)
m.roof(hx + 0.6, hy + 0.5, 3.8, 1.4, (70, 82, 104), ridge='h', chimney=False)
m.roof(hx + 0.6, hy + 1.9, 1.2, 2.2, (70, 82, 104), ridge='v', chimney=False)
m.roof(hx + 3.2, hy + 1.9, 1.2, 2.2, (70, 82, 104), ridge='v', chimney=False)
m.circle(hx + 2.5, hy + 1.2, 0.45, (80, 92, 116), lw=0.05, shadow=0.2)    # the clock tower
banner(m, hx + 2.5, hy + 0.9, (128, 34, 40))

# ---- city walls along the outline, towers at corners, gates at the four roads ----
GATES = {((5, 1), 'n'), ((9, 5), 'e'), ((5, 9), 's'), ((1, 5), 'w')}
corners = set()
for x, y in CITY:
    for (dx, dy, side) in [(0, -1, 'n'), (1, 0, 'e'), (0, 1, 's'), (-1, 0, 'w')]:
        if (x + dx, y + dy) in CITY: continue
        a, b = {'n': ((x, y), (x + 1, y)), 'e': ((x + 1, y), (x + 1, y + 1)), 's': ((x, y + 1), (x + 1, y + 1)), 'w': ((x, y), (x, y + 1))}[side]
        A, B = (a[0] * T, a[1] * T), (b[0] * T, b[1] * T)
        if ((x, y), side) in GATES:
            mid = ((A[0] + B[0]) / 2, (A[1] + B[1]) / 2); ux, uy = (B[0] - A[0]) / T, (B[1] - A[1]) / T
            m.wall_stroke(A, (mid[0] - ux * 0.7, mid[1] - uy * 0.7), (120, 112, 100), 0.45)
            m.wall_stroke((mid[0] + ux * 0.7, mid[1] + uy * 0.7), B, (120, 112, 100), 0.45)
            for s in (-1, 1): m.poly(m.rect(mid[0] + s * ux * 0.95 - 0.4, mid[1] + s * uy * 0.95 - 0.4, 0.8, 0.8), (128, 120, 108), lw=0.06, shadow=0.3)
        else:
            m.wall_stroke(A, B, (120, 112, 100), 0.45)
        corners.add(A); corners.add(B)
for (cx, cy) in corners:
    m.circle(cx, cy, 0.42, (130, 122, 110), lw=0.06, shadow=0.3); m.circle(cx, cy, 0.25, (104, 96, 86), outline=None, shadow=0)

# ---- wilderness: woods, scrub, a stream; the Overlook hill ----
for tx in range(11):
    for ty in range(11):
        if (tx, ty) in CITY or (tx, ty) == OVERLOOK: continue
        for _ in range(R.randint(1, 5)):
            px, py = tx * T + R.uniform(0.6, T - 0.6), ty * T + R.uniform(0.6, T - 0.6)
            (m.tree if R.random() < 0.6 else m.bush)(px, py, R.uniform(0.5, 0.95))
ox, oy = OVERLOOK[0] * T + 2.5, OVERLOOK[1] * T + 2.5
for r, col in [(2.2, (110, 112, 80)), (1.6, (124, 120, 92)), (1.0, (138, 132, 104))]:
    m.paint(m.mask_ellipse(ox, oy, r, r * 0.9, blur=0.3), col)
m.rock(ox - 0.6, oy + 0.4, 0.5); m.rock(ox + 0.8, oy - 0.3, 0.4)
m.poly(m.rect(ox - 0.35, oy - 0.35, 0.7, 0.7), (120, 108, 90), lw=0.06, shadow=0.35)   # the watchtower
m.circle(ox, oy, 0.2, (80, 70, 60), outline=None, shadow=0)

# ---- the attack: smoke over the city ----
for _ in range(9):
    tx, ty = R.choice(sorted(CITY))
    m.smoke(tx * T + 2.5, ty * T + 2.5, 1.4, n=8, drift=(0.8, -0.6), a=0.18)
for _ in range(4):
    tx, ty = R.choice(sorted(CITY - {SQUARE, HALL}))
    m.flames(tx * T + R.uniform(1, 4), ty * T + R.uniform(1, 4), 0.45, n=5)

m.marks.append({"city": sorted(CITY), "square": SQUARE, "hall": HALL, "overlook": OVERLOOK})
finish(m, "edretnor", OUTD, ASSETS)
