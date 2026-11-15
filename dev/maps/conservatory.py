"""Round 3: the Clockwork Conservatory. The rotunda with the Lumen Core and five Seed Vaults, and the four wings: Dawn (east),
Noon (south), Dusk (west) and Night (north). 62x54 squares of 5 ft. Lights tagged with a facet stay hidden until the macro lights it."""
import math
from bm import Map, OUT
from kit import *

ASSETS = "../../assets/scenes"; OUTD = "out"
m = Map(62, 54, G=100, Q=4, seed=31)
CX, CY, R = 31, 30, 8
rock = m.noise(5, 5, 4)
for i, b in enumerate((34, 31, 30)): m.col[..., i] = b + (rock - 0.5) * 16

def circ(cx, cy, r, n=48, a0=0.0): return [(cx + r * math.cos(a0 + 2 * math.pi * k / n), cy + r * math.sin(a0 + 2 * math.pi * k / n)) for k in range(n)]
def floor(pts, col, seed=0, var=10):
    mk = m.mask_poly(pts, blur=0.05); nn = m.noise(10, 3, seed)[..., None]
    m.paint(mk, 0); m.col += mk[..., None] * (col + (nn - 0.5) * var)
def light(name, x, y, bright, dim, color, alpha=0.5, anim=None, hidden=False, state=None, speed=3, intensity=3):
    m.lights.append({'name': name, 'x': x * m.G, 'y': y * m.G, 'bright': bright, 'dim': dim, 'color': color, 'alpha': alpha,
                     'anim': anim, 'speed': speed, 'intensity': intensity, 'hidden': hidden, 'state': state})

# ---- floors ----
DAWN = (42, 26, 12, 8); NOON = (27, 41, 8, 8); DUSK = (10, 25, 10, 10); NIGHT = (21, 4, 20, 15)
rect = lambda x, y, w, h: [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]
floor(circ(CX, CY, R), (118, 110, 98), 1)
for x, y, w, h in [(39, 29, 3, 2), (30, 38, 2, 3), (20, 29, 3, 2), (30, 19, 2, 3)]: floor(rect(x, y, w, h), (110, 102, 90), 2)
floor(rect(*DAWN), (96, 104, 92), 3); floor(rect(*NOON), (104, 92, 78), 4); floor(rect(*DUSK), (150, 170, 182), 5, 16)
floor(rect(*NIGHT), (58, 76, 46), 6, 18)

# ---- rotunda: sundial floor and the Lumen Core ----
for k in range(24):
    a = 2 * math.pi * k / 24
    m.line([(CX + 1.6 * math.cos(a), CY + 1.6 * math.sin(a)), (CX + (R - 0.3) * math.cos(a), CY + (R - 0.3) * math.sin(a))], (88, 82, 72), 0.03 if k % 2 else 0.07)
for r in (3.2, 5.0, 6.9): m.line(circ(CX, CY, r, 96) + [circ(CX, CY, r, 96)[0]], (96, 88, 76), 0.05)
m.line([(CX, CY), (CX + 4.2, CY - 2.4)], (176, 150, 80), 0.16)        # the gnomon's shadow line
for k, s in enumerate(["DAWN", "NOON", "DUSK", "NIGHT"]):
    a = [0, math.pi / 2, math.pi, -math.pi / 2][k]
    text(m, CX + 4.1 * math.cos(a), CY + 4.1 * math.sin(a), s, 0.42, col=(206, 190, 150), ctx=m.o)
m.circle(CX, CY, 1.5, (92, 70, 48), lw=0.07, shadow=0.3)                 # planter
m.circle(CX, CY, 1.2, (60, 46, 32), outline=None, shadow=0)
hexa = [(CX + 0.62 * math.cos(math.pi / 6 + k * math.pi / 3), CY + 0.62 * math.sin(math.pi / 6 + k * math.pi / 3)) for k in range(6)]
m.poly(hexa, (120, 150, 170), lw=0.05, shadow=0.4)
for k, col in enumerate([(220, 180, 70), (230, 230, 220), (220, 110, 50), (130, 100, 200)]):
    a = [0, math.pi / 2, math.pi, -math.pi / 2][k]
    m.circle(CX + 0.35 * math.cos(a), CY + 0.35 * math.sin(a), 0.14, tuple(int(v * 0.45) for v in col), lw=0.02, shadow=0)
m.poly(m.rect(30.2, 32.0, 1.6, 0.5), (150, 124, 70), lw=0.04, shadow=0.15)   # the plaque
m.circle(34.3, 25.6, 0.3, (186, 150, 70), lw=0.04, shadow=0.2); m.circle(34.3, 25.6, 0.14, (40, 30, 20), outline=None, shadow=0)  # the Steward's horn
m.circle(CX, CY - 2.4, 0.55, (70, 64, 58), lw=0.05, shadow=0.1); m.line([(CX - 0.4, CY - 2.4), (CX + 0.4, CY - 2.4)], (40, 36, 32), 0.05)  # tunnel hatch

# rotunda wall with the four wing doors (2 squares wide at E, S, W, N)
segs = 64; pts = circ(CX, CY, R, segs)
for k in range(segs):
    a, b = pts[k], pts[(k + 1) % segs]; mid = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    if any(abs(mid[0] - dx) < 1.0 and abs(mid[1] - dy) < 1.0 for dx, dy in [(CX + R, CY), (CX, CY + R), (CX - R, CY), (CX, CY - R)]): continue
    m.wall_stroke(a, b, (92, 84, 74), 0.3); m.wall(a, b)
for (a, b, kind) in [((CX + R, CY - 1), (CX + R, CY + 1), 'door'), ((CX - 1, CY + R), (CX + 1, CY + R), 'door'),
                     ((CX - R, CY - 1), (CX - R, CY + 1), 'door'), ((CX - 1, CY - R), (CX + 1, CY - R), 'locked')]:
    m.line([a, b], (176, 140, 64), 0.22); m.wall(a, b, kind)
m.circle(CX, CY - R, 0.35, (130, 100, 200), lw=0.04, shadow=0)   # the North gate's glyph

# Seed Vaults: 2x2 glass cells, the glass door facing the Core
for i, deg in enumerate([-60, -30, 45, 135, 225]):
    a = math.radians(deg); vx, vy = CX + 5.9 * math.cos(a), CY + 5.9 * math.sin(a)
    sq = m.rot([(-1, -1), (1, -1), (1, 1), (-1, 1)], vx, vy, a)
    m.poly(sq, (128, 150, 140), outline=None, shadow=0, alpha=0.55)
    m.circle(vx + 0.35 * math.cos(a), vy + 0.35 * math.sin(a), 0.45, (96, 70, 48), lw=0.04, shadow=0.15)   # potted plant
    m.bush(vx + 0.35 * math.cos(a), vy + 0.35 * math.sin(a), 0.35, (70, 104, 60))
    m.circle(*m.rot([(0.55, 0.62)], vx, vy, a)[0], 0.18, (150, 124, 70), lw=0.03, shadow=0.05)              # valve wheel
    for p, q in zip(sq, sq[1:] + sq[:1]): m.line([p, q], (190, 220, 225), 0.08, alpha=0.9)
    inner = (sq[0], sq[3])        # the side facing the Core (local x = -1)
    for p, q in [(sq[0], sq[1]), (sq[1], sq[2]), (sq[2], sq[3])]: m.wall(p, q, 'glass')
    m.wall(inner[1], inner[0], 'glassdoor')
    m.region(f"Seed Vault {i + 1}", "vault", [sq])
    light(f"Seed Vault {i + 1}: germination glow", vx, vy, 0, 10, "#9fe0a8", 0.35)
# gear lockers A and B by the south door
for lab, deg in [("A", 68), ("B", 112)]:
    a = math.radians(deg); lx, ly = CX + 7.2 * math.cos(a), CY + 7.2 * math.sin(a)
    m.poly(m.rect(lx - 0.9, ly - 0.4, 1.8, 0.8, a + math.pi / 2), (96, 84, 70), lw=0.05, shadow=0.2)
    m.poly(m.rect(lx - 0.75, ly - 0.25, 1.5, 0.5, a + math.pi / 2), (150, 180, 190), outline=None, shadow=0, alpha=0.6)
    text(m, lx - 0.9 * math.cos(a), ly - 0.9 * math.sin(a), lab, 0.5, ctx=m.o)

def vroom(x, y, w, h, doors=()):
    """Draws a room's walls (the Foundry walls come from m.room), with brass doors and open gaps."""
    sides = {'n': ((x, y), (x + w, y)), 'e': ((x + w, y), (x + w, y + h)), 's': ((x, y + h), (x + w, y + h)), 'w': ((x, y), (x, y + h))}
    for sd, (a, b) in sides.items():
        L = math.dist(a, b); ux, uy = (b[0] - a[0]) / L, (b[1] - a[1]) / L; pos = 0
        for d in sorted([d for d in doors if d[0] == sd], key=lambda d: d[1]):
            if d[1] > pos: m.wall_stroke((a[0] + ux * pos, a[1] + uy * pos), (a[0] + ux * d[1], a[1] + uy * d[1]))
            if (d[3] if len(d) > 3 else 'door') != 'gap':
                m.line([(a[0] + ux * d[1], a[1] + uy * d[1]), (a[0] + ux * (d[1] + d[2]), a[1] + uy * (d[1] + d[2]))], (176, 140, 64), 0.22)
            pos = d[1] + d[2]
        if pos < L: m.wall_stroke((a[0] + ux * pos, a[1] + uy * pos), b)
    m.room(x, y, w, h, doors=doors)

# ---- corridors ----
for (a, b) in [((39, 29), (42, 29)), ((39, 31), (42, 31)), ((30, 38), (30, 41)), ((32, 38), (32, 41)),
               ((20, 29), (23, 29)), ((20, 31), (23, 31)), ((30, 19), (30, 22)), ((32, 19), (32, 22))]:
    m.wall_stroke(a, b); m.wall(a, b)

# ---- Dawn: the Propagation House (east) ----
x, y, w, h = DAWN
for i in range(1, w): m.line([(x + i, y), (x + i, y + h)], (78, 86, 76), 0.03)
for i in range(1, h): m.line([(x, y + i), (x + w, y + i)], (78, 86, 76), 0.03)
GLYPH = [("Dew", (110, 170, 220)), ("Seed", (200, 170, 90)), ("Root", (150, 100, 60)), ("Thorn", (170, 60, 70)), ("Bloom", (220, 120, 180)), ("Leaf", (90, 170, 90))]
for k, (g, col) in enumerate(GLYPH):
    bx = x + 3.2 + (k % 3) * 2.6; by = y + (0.6 if k < 3 else h - 2.1)
    m.poly(m.rect(bx, by, 2.0, 1.5), (84, 60, 40), lw=0.05, shadow=0.15); m.poly(m.rect(bx + 0.1, by + 0.1, 1.8, 1.3), (62, 46, 32), outline=None, shadow=0)
    for j in range(4): m.bush(bx + 0.4 + j * 0.4, by + 0.75, 0.28, (60 + k * 6, 100, 54))
    m.circle(bx + 1.0, by + (1.75 if k < 3 else -0.25), 0.22, tuple(int(v * 0.5) for v in col), lw=0.03, shadow=0)   # lamp bank lens
    light(f"Dawn sun-lamp: {g}", bx + 1.0, by + 0.75, 10, 20, "#ffe2a0", 0.45, hidden=True, state="dawn")
m.poly(m.rect(x + 0.3, y + 3.0, 0.5, 2.0), (70, 64, 58), lw=0.04, shadow=0.1)               # the junction board
for k in range(6): m.circle(x + 0.55, y + 3.2 + k * 0.32, 0.1, (30, 28, 26), lw=0.02, shadow=0)
m.circle(x + 0.6, y + 5.6, 0.22, (150, 124, 70), lw=0.03, shadow=0.1)                     # the hand-crank glow-lamp
m.paint(m.mask_ellipse(x + 6, y + 4.0, 1.7, 1.25, blur=0.1), (26, 46, 52))                  # the pond
m.line(circ(x + 6, y + 4.0, 1.7, 40) + [circ(x + 6, y + 4.0, 1.7, 40)[0]], (90, 86, 80), 0.08)
for k in range(3): m.circle(x + 5.5 + k * 0.4, y + 3.7 + (k % 2) * 0.5, 0.09, (220, 140, 60), outline=None, shadow=0)
for k in range(7): m.bush(x + w - 0.45, y + 0.6 + k * 1.0, 0.45, (56, 92, 50))              # the trellis (east wall)
m.line([(x + w - 0.2, y + 0.3), (x + w - 0.2, y + h - 0.3)], (110, 84, 52), 0.08)
for k in range(5): m.bush(x + w - 2.6 + (k % 3) * 0.5, y + 5.6 + (k // 3) * 0.6, 0.55, (70, 70, 40))   # the bramble
vroom(x, y, w, h, doors=[('w', 3, 2, 'door')])
m.region("Dawn: Propagation House (total darkness)", "dawn", [rect(*DAWN)])
m.region("Pond (10 ft deep)", "pond", [circ(x + 6, y + 4.0, 1.7, 24)])
m.region("Trellis (25 ft up)", "trellis", [rect(x + w - 1, y, 1, h)])
m.region("Bramble (60 Durability)", "bramble", [rect(x + w - 3.2, y + 5.0, 2.0, 1.8)])

# ---- Noon: the Mistworks (south) ----
x, y, w, h = NOON
m.flagstones(x, y, w, h, (108, 96, 80), bw=1.0, bh=0.8)
m.circle(x + 2.0, y + 6.0, 1.5, (120, 84, 50), lw=0.07, shadow=0.35)       # the boiler
m.circle(x + 2.0, y + 6.0, 1.0, (100, 70, 42), outline=None, shadow=0); m.circle(x + 2.0, y + 6.0, 0.3, (40, 30, 24), outline=None, shadow=0)
for k, nm in enumerate(["Wren", "Moth", "Heron", "Bee", "Owl"]):
    py = y + 0.9 + k * 1.1
    m.line([(x + w - 0.2, py), (x + w - 1.4, py)], (170, 130, 70), 0.22)
    m.circle(x + w - 1.5, py, 0.22, (150, 30, 30) if k % 2 else (40, 60, 120), lw=0.03, shadow=0.05)
    text(m, x + w - 2.35, py, nm, 0.27, ctx=m.o)
m.poly(m.rect(x + 2.0, y + 1.6, 2.0, 2.0), (40, 50, 52), lw=0.08, shadow=0)  # the flooded sump
m.poly(m.rect(x + 2.2, y + 1.8, 1.6, 1.6), (36, 56, 58), outline=None, shadow=0)
m.circle(x + 0.45, y + 3.0, 0.32, (110, 90, 70), lw=0.04, shadow=0.1)     # drain wheel
for k in range(4): m.line([(x + 0.45, y + 3.0), (x + 0.45 + 0.3 * math.cos(k * math.pi / 2), y + 3.0 + 0.3 * math.sin(k * math.pi / 2))], (70, 56, 44), 0.04)
fx, fy = x + 4.75, y + 6.8                                                  # the flywheel pump
m.circle(fx, fy, 1.1, (90, 70, 56), lw=0.06, shadow=0.3); m.circle(fx, fy, 0.85, (110, 80, 60), outline=None, shadow=0)
for k in range(6): m.line([(fx, fy), (fx + 0.85 * math.cos(k * math.pi / 3), fy + 0.85 * math.sin(k * math.pi / 3))], (70, 50, 40), 0.07)
m.barrel(x + 0.6, y + h - 0.6, 0.6)                                         # the oil can corner
vroom(x, y, w, h, doors=[('n', 3, 2, 'door')])
m.region("Noon: Mistworks", "noon", [rect(*NOON)])
m.region("Flooded sump (8 ft)", "sump", [rect(x + 2.0, y + 1.6, 2, 2)])
light("Noon: work lamps", x + 4, y + 4, 10, 30, "#ffe6b8", 0.3, anim="torch", speed=2, intensity=2)

# ---- Dusk: the Cold Cellar (west) ----
x, y, w, h = DUSK
import random; RR = random.Random(5)
for _ in range(40):
    sx, sy = x + RR.uniform(0.5, w - 0.5), y + RR.uniform(0.5, h - 0.5); a = RR.uniform(0, math.pi)
    m.line([(sx, sy), (sx + 0.8 * math.cos(a), sy + 0.8 * math.sin(a))], (200, 220, 230), 0.02, alpha=0.7)
m.poly(m.rect(x + 0.4, y + 4.0, 0.8, 2.0), (90, 110, 130), lw=0.05, shadow=0.15)          # the regulator
m.circle(x + 0.8, y + 5.0, 0.3, (120, 200, 255), lw=0.03, shadow=0); m.glow_at(x + 0.8, y + 5.0, 1.4, (120, 200, 255), 0.5)
for vx, vy in [(x + 3, y + 0.35), (x + 6, y + 0.35), (x + 4.5, y + h - 0.35)]:            # vent nozzles
    m.circle(vx, vy, 0.3, (120, 140, 156), lw=0.04, shadow=0.1); m.circle(vx, vy, 0.15, (30, 40, 50), outline=None, shadow=0)
m.poly(m.rect(x + w - 3.4, y + 0.3, 3.0, 1.2), (170, 200, 214), lw=0.05, shadow=0.2)     # the ice cabinet: 12 jars
for k in range(12): m.circle(x + w - 3.1 + (k % 6) * 0.48, y + 0.6 + (k // 6) * 0.55, 0.16, (220, 230, 236), lw=0.02, shadow=0)
m.poly(m.rect(x + w - 2.4, y + h - 1.6, 1.8, 1.0), (120, 96, 70), lw=0.04, shadow=0.15)   # desk with the frosted ledger
m.poly(m.rect(x + w - 2.1, y + h - 1.4, 0.8, 0.6), (220, 226, 230), outline=None, shadow=0)
vroom(x, y, w, h, doors=[('e', 4, 2, 'door')])
m.line([(x + w, y + 4), (x + w, y + 6)], (190, 225, 240), 0.3)
m.region("Dusk: Cold Cellar (frost purge)", "dusk", [rect(*DUSK)])
light("Dusk: regulator glyph", x + 0.8, y + 5, 5, 10, "#80c8ff", 0.5, anim="pulse")
light("Dusk: frost-lamps", x + 5, y + 5, 5, 30, "#bfe4ff", 0.35)

# ---- Night: the Specimen Garden (north) ----
x, y, w, h = NIGHT
for k in range(3): m.line([(30, y + h - 0.3 - k * 0.35), (32, y + h - 0.3 - k * 0.35)], (120, 112, 100), 0.12)   # steps down
m.paint(m.mask_line([(31, y + h), (31, 15.5)], 1.4, blur=0.1), (120, 108, 90))
WX, WY = 31, 10.5
m.paint(m.mask_ellipse(WX, WY, 4.2, 4.2, blur=0.1), (82, 80, 74))
m.line(circ(WX, WY, 3.6, 80) + [circ(WX, WY, 3.6, 80)[0]], (170, 160, 210), 0.1)
m.line(circ(WX, WY, 3.2, 80) + [circ(WX, WY, 3.2, 80)[0]], (170, 160, 210), 0.04)
for k in range(12):
    a = 2 * math.pi * k / 12; text(m, WX + 3.4 * math.cos(a), WY + 3.4 * math.sin(a), "✦", 0.25, col=(190, 180, 230), ctx=m.o, outline=False)
m.circle(WX, WY, 1.2, (96, 70, 48), lw=0.06, shadow=0.25)        # the specimen bed
for k, deg in enumerate([-90, 30, 150]):
    a = math.radians(deg); lx, ly = WX + 4.0 * math.cos(a), WY + 4.0 * math.sin(a)
    m.circle(lx, ly, 0.35, (70, 66, 80), lw=0.04, shadow=0.2); m.circle(lx, ly, 0.2, (200, 200, 255), outline=None, shadow=0)
    light(f"Night: moon-lamp {k + 1}", lx, ly, 2, 12, "#b8c4ff", 0.4, anim="pulse")
for (bx, by, r) in [(23, 6, 1.3), (39, 6, 1.4), (24, 15, 1.2), (38.5, 15.5, 1.3), (27, 5.5, 0.9), (35, 5.0, 1.0)]: m.tree(bx, by, r, (44, 66, 40))
for (bx, by) in [(22.5, 10), (39.5, 10.5), (26, 17), (36, 17.5), (25.5, 12.5), (36.5, 13)]: m.bush(bx, by, 0.7, (52, 80, 46))
vroom(x, y, w, h, doors=[('s', 9, 2, 'gap')])
m.region("Night: Specimen Garden", "night", [rect(*NIGHT)])
m.region("Ward-circle", "ward", [circ(WX, WY, 3.6, 24)])

# ---- the Steward's booth (sealed, overlooking the rotunda) ----
m.poly(rect(40.5, 37.5, 4, 3), (70, 60, 52), lw=0.07, shadow=0.3)
m.poly(rect(40.7, 37.7, 3.6, 2.6), (96, 84, 70), outline=None, shadow=0)
m.line([(40.5, 37.5), (42.5, 37.5)], (190, 220, 225), 0.1)
vroom(40.5, 37.5, 4, 3)
light("Steward's booth", 42.5, 39, 2, 6, "#ffd28a", 0.4, anim="torch")

# ---- rotunda lights ----
light("Rotunda: emergency glow", CX, CY, 10, 45, "#9ab0c8", 0.3)
for k, (nm, col) in enumerate([("dawn", "#ffd27a"), ("noon", "#f4f4ff"), ("dusk", "#ff9a50"), ("night", "#a58cff")]):
    a = [0, math.pi / 2, math.pi, -math.pi / 2][k]
    light(f"Lumen Core: {nm.title()} facet", CX + 0.4 * math.cos(a), CY + 0.4 * math.sin(a), 5, 15, col, 0.5, anim="pulse", hidden=True, state=nm)
light("Moon Lily bloom", CX, CY, 10, 30, "#e8f0ff", 0.6, anim="sunburst", hidden=True, state="bloom")
m.region("The Lumen Core", "core", [circ(CX, CY, 1.5, 24)])
finish(m, "conservatory", OUTD, ASSETS)
