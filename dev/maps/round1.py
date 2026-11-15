"""Round 1: the projectile shoot. A festival field with the contestant line in the south, the flight lane 20-30 ft out, and the
launchers in the north. 36x26 squares of 5 ft."""
import math
from bm import Map
from kit import *

ASSETS = "../../assets/scenes"; OUTD = "out"
m = Map(36, 26, G=100, Q=4, seed=11)
grass(m, seed=1)
# mown flight lane (20-30 ft north of the line at y=19)
lane = m.mask_poly([(0, 13), (36, 13), (36, 15), (0, 15)], blur=0.15)
m.col += lane[..., None] * 14
for i in range(0, 36, 2):   # mowing stripes in the launch field
    s = m.mask_poly([(i, 1), (i + 1, 1), (i + 1, 12.6), (i, 12.6)], blur=0.1)
    m.col += s[..., None] * 6
# packed earth: contestant line and the walkway behind it
dirt(m, m.mask_poly([(1.5, 19), (34.5, 19), (34.5, 21.6), (1.5, 21.6)], blur=0.2))
dirt(m, m.mask_line([(18, 21.6), (18, 26)], 2.2, blur=0.3), col=(124, 100, 70))
dirt(m, m.mask_ellipse(18, 5.5, 4.2, 2.6, blur=0.4), col=(120, 98, 70), seed=5)

# chalk lines
m.line([(2, 19), (34, 19)], (236, 232, 220), 0.12, alpha=0.9)
for x in range(2, 35, 4): m.line([(x, 18.75), (x, 19.25)], (236, 232, 220), 0.08)
m.line([(0.6, 15), (35.4, 15)], (236, 232, 220), 0.05, alpha=0.55)
m.line([(0.6, 13), (35.4, 13)], (236, 232, 220), 0.05, alpha=0.55)
text(m, 5.5, 12.55, "30 ft", 0.4); text(m, 5.5, 14.55, "20 ft", 0.4)

# rope barrier between the field and the line
for x in range(2, 35, 2): m.circle(x, 18.1, 0.09, (110, 80, 50), shadow=0.1)
m.line([(2, 18.1), (34, 18.1)], (200, 176, 130), 0.035)

# grandstand and royal box (south)
bleachers(m, 0.5, 22.2, 14.5, 3.6, rows=4, facing='n'); crowd(m, 0.7, 22.4, 14.1, 3.2, 120, seed=1)
bleachers(m, 21, 22.2, 14.5, 3.6, rows=4, facing='n'); crowd(m, 21.2, 22.4, 14.1, 3.2, 120, seed=2)
m.poly(m.rect(15.4, 22.3, 1.2, 3.5), (100, 74, 48), lw=0.04)
m.poly(m.rect(19.4, 22.3, 1.2, 3.5), (100, 74, 48), lw=0.04)
m.poly(m.rect(16.2, 22.6, 3.6, 3.0), (128, 34, 40), lw=0.07, shadow=0.4)       # royal canopy
for i in range(4): m.line([(16.2 + 0.9 * i + 0.45, 22.6), (16.2 + 0.9 * i + 0.45, 25.6)], (180, 150, 70), 0.06)
m.line([(16.2, 22.6), (19.8, 22.6)], (204, 170, 80), 0.12)
for x in (16.6, 19.4): banner(m, x, 22.4, (128, 34, 40))

# team pavilions on the flanks
for i, col in enumerate([(58, 84, 140), (176, 60, 48), (70, 120, 72), (176, 140, 54)]):
    tent(m, 0.6 if i < 2 else 32.4, 6.4 + 3.0 * (i % 2), 3.0, 2.6, col)
for x in range(4, 33, 4): banner(m, x, 21.9, [(58, 84, 140), (176, 60, 48), (70, 120, 72), (176, 140, 54)][(x // 4) % 4])

# the launchers (north)
def launcher(x, y, s=1.0):
    m.poly(m.rect(x - 1.3 * s, y - 0.9 * s, 2.6 * s, 1.8 * s), (98, 70, 44), lw=0.06, shadow=0.35)
    for t in (-0.9, 0.9): m.plank(x + t * s, y, 2.2 * s, a=math.pi / 2, w=0.28 * s, col=(80, 58, 36))
    m.plank(x, y - 0.2 * s, 2.6 * s, a=0, w=0.24 * s, col=(70, 50, 30))
    m.plank(x, y + 0.6 * s, 3.2 * s, a=math.pi / 2, w=0.22 * s, col=(110, 80, 50))     # throwing arm
    m.circle(x, y + 2.1 * s, 0.38 * s, (90, 80, 70), lw=0.04, shadow=0.15)            # cup
    for t in (-1, 1): m.circle(x + t * 1.35 * s, y - 0.2 * s, 0.32 * s, (74, 66, 60), lw=0.05, shadow=0.15)  # wheels / winch
m.R.seed(3)
launcher(18, 4.4, 1.15); launcher(8, 5.4, 0.8); launcher(28, 5.4, 0.8)
for x, y in [(15.2, 6.6), (20.8, 6.8), (16, 2.4), (21.2, 2.6), (6.2, 7.0), (29.8, 7.0)]: m.crate(x, y, 1.1)
for x, y in [(14.6, 5.0), (21.6, 5.2), (9.8, 7.2), (26.2, 7.2)]: m.barrel(x, y)
m.circle(23.6, 3.4, 0.55, (112, 106, 96), shadow=0.2); m.circle(23.6, 3.4, 0.4, (86, 80, 72), outline=None, shadow=0)  # iron balls
for k in range(5): m.circle(23.3 + 0.22 * (k % 3), 3.2 + 0.25 * (k // 3), 0.13, (60, 58, 56), shadow=0.05)
# festival lantern on its tether post (the protect launch)
m.circle(30.5, 10.5, 0.12, (70, 52, 34), shadow=0.3)
m.circle(30.5, 10.5, 0.42, (236, 186, 90), lw=0.04, shadow=0, ctx=m.t); m.glow_at(30.5, 10.5, 1.4, (255, 200, 110), 0.4)
# boundary hedges and trees
for x in range(0, 37, 3): m.bush(x + m.R.uniform(-0.5, 0.5), 0.5, 0.8)
for y in range(3, 18, 4): m.tree(0.4, y, 1.1); m.tree(35.6, y + 1, 1.1)
for x, y in [(4.5, 11), (32, 11.5), (11, 2.2), (25.5, 1.8)]: m.bush(x, y, 0.6)

m.region("Contestant line", "line", [[(1.5, 19), (34.5, 19), (34.5, 21.6), (1.5, 21.6)]])
m.region("Flight lane (20-30 ft out)", "lane", [[(0, 13), (36, 13), (36, 15), (0, 15)]])
m.region("Launch field (closed to contestants)", "field", [[(0, 0), (36, 0), (36, 18), (0, 18)]])
m.marks.append({"name": "Royal box", "x": 18, "y": 24})
finish(m, "round1-field", OUTD, ASSETS)
