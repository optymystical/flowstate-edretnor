"""Round 2: the protection run. A sand arena with the 300 ft conveyor down the middle, yard posts every 20 yards, the three wave
pens and the finale mark at 80 yards. 70x16 squares of 5 ft."""
import math
from bm import Map
from kit import *

ASSETS = "../../assets/scenes"; OUTD = "out"
m = Map(70, 16, G=100, Q=4, seed=21)
n = m.noise(4, 5, 2); n2 = m.noise(16, 3, 9)
for i, b in enumerate((176, 150, 108)): m.col[..., i] = b + (n - 0.5) * 26 + (n2 - 0.5) * 14
X0, X1, Y = 4, 64, 8          # conveyor start/end (60 squares = 300 ft), track centerline
# rake marks
for k in range(0, 70, 1):
    m.line([(k + 0.3, 3.2), (k + 0.8, 3.0)], (150, 126, 90), 0.02, alpha=0.4)
# the conveyor: rails, sleepers, belt
m.poly(m.rect(X0 - 1, Y - 0.9, X1 - X0 + 2, 1.8), (92, 70, 48), lw=0.06, shadow=0.25)
for x in range(X0 - 1, X1 + 1):
    m.poly(m.rect(x + 0.08, Y - 1.05, 0.34, 2.1), (78, 58, 40), lw=0.025, shadow=0.05)
m.poly(m.rect(X0 - 1, Y - 0.55, X1 - X0 + 2, 1.1), (64, 60, 58), lw=0.04, shadow=0)
for x in range(X0 - 1, X1 + 1): m.line([(x, Y - 0.55), (x, Y + 0.55)], (46, 44, 42), 0.04)
for yy in (Y - 0.7, Y + 0.7): m.line([(X0 - 1, yy), (X1 + 1, yy)], (150, 146, 140), 0.08)
# the carriage (the protected ally's sled) at the start
m.poly(m.rect(X0 - 0.5, Y - 0.75, 1.5, 1.5), (128, 92, 56), lw=0.05, shadow=0.2)
for t in (-0.45, 0.45): m.circle(X0 + 0.25, Y + t, 0.1, (60, 56, 52), shadow=0)
# gear house at the start, buffer at the end
m.poly(m.rect(0.6, Y - 2.2, 2.6, 4.4), (96, 84, 72), lw=0.06, shadow=0.35)
m.roof(0.6, Y - 2.2, 2.6, 4.4, (120, 62, 48), ridge='v', chimney=False)
m.poly(m.rect(X1 + 1.2, Y - 1.4, 1.2, 2.8), (110, 104, 96), lw=0.05, shadow=0.3)
for x, lab in [(X0 + 12 * k, f"{20 * k} yd") for k in range(6)]:
    m.line([(x, Y - 1.3), (x, Y + 1.3)], (240, 236, 224), 0.1)
    m.circle(x, Y - 1.7, 0.18, (200, 60, 50) if k else (60, 120, 70), shadow=0.25)
    text(m, x, Y + 1.85, lab, 0.48)
for x in range(X0 + 4, X1, 4):   # 20 ft ticks (one conveyor turn)
    if (x - X0) % 12: m.line([(x, Y - 1.05), (x, Y + 1.05)], (230, 226, 214), 0.04, alpha=0.7)

def pen(x, side, label, col):
    y0 = 3.0 if side < 0 else 10.6
    m.poly(m.rect(x - 2, y0, 4, 2.4), (150, 126, 92), outline=None, shadow=0)
    for a, b in [((x - 2, y0), (x + 2, y0)), ((x - 2, y0), (x - 2, y0 + 2.4)), ((x + 2, y0), (x + 2, y0 + 2.4))] if side < 0 else \
                [((x - 2, y0 + 2.4), (x + 2, y0 + 2.4)), ((x - 2, y0), (x - 2, y0 + 2.4)), ((x + 2, y0), (x + 2, y0 + 2.4))]:
        m.line([a, b], (90, 64, 40), 0.18)
    gy = y0 + 2.4 if side < 0 else y0
    m.line([(x - 2, gy), (x - 0.8, gy)], (90, 64, 40), 0.18); m.line([(x + 0.8, gy), (x + 2, gy)], (90, 64, 40), 0.18)
    m.plank(x - 0.4, gy + (0.35 if side < 0 else -0.35), 1.1, a=0.6 * side, w=0.14, col=(120, 86, 52))
    banner(m, x - 1.9, y0 + (0.1 if side < 0 else 2.3), col)
    m.wall((x - 2, gy), (x - 0.8, gy)); m.wall((x + 0.8, gy), (x + 2, gy))
    m.wall((x - 2, y0), (x - 2, y0 + 2.4)); m.wall((x + 2, y0), (x + 2, y0 + 2.4))
    m.wall((x - 2, y0 if side < 0 else y0 + 2.4), (x + 2, y0 if side < 0 else y0 + 2.4))
    m.wall((x - 0.8, gy), (x + 0.8, gy), 'door')
    m.region(label, "pen", [[(x - 2, y0), (x + 2, y0), (x + 2, y0 + 2.4), (x - 2, y0 + 2.4)]])
for k, (lab, col) in enumerate([("Wave 1: locals", (90, 120, 70)), ("Wave 2: staff", (60, 84, 140)), ("Wave 3: King's Guard", (128, 34, 40))]):
    x = X0 + 12 * (k + 1)
    pen(x + 2, -1, f"{lab} (north pen)", col); pen(x + 2, 1, f"{lab} (south pen)", col)
# the finale mark at 80 yards: Blackwell's circle
fx = X0 + 48
m.circle(fx + 3, Y - 4.0, 1.0, (160, 150, 136), lw=0.06, shadow=0.2)
m.circle(fx + 3, Y - 4.0, 0.75, (128, 34, 40), outline=None, shadow=0)
text(m, fx + 3, Y - 4.0, "IV", 0.6, col=(230, 200, 110))
m.region("Finale: Blackwell (turn 13)", "finale", [[(fx + 2, Y - 5), (fx + 4, Y - 5), (fx + 4, Y - 3), (fx + 2, Y - 3)]])
# cover: hay bales and barricades scattered off the track
for x, y, a in [(10, 4.6, 0.2), (22.5, 11.6, -0.3), (34, 4.4, 0.5), (46.5, 11.8, 0.1), (58, 4.6, -0.4), (25, 4.2, 1.2), (37, 11.5, 0.9)]:
    m.poly(m.rect(x - 0.9, y - 0.45, 1.8, 0.9, a), (206, 176, 96), lw=0.04, shadow=0.2)
    m.line(m.rot([(-0.9, 0), (0.9, 0)], x, y, a), (170, 140, 70), 0.03)
# stands
bleachers(m, 0.3, 0.2, 69.4, 2.4, rows=3, facing='s'); crowd(m, 0.5, 0.35, 69, 2.1, 420, seed=4)
bleachers(m, 0.3, 13.4, 69.4, 2.4, rows=3, facing='n'); crowd(m, 0.5, 13.55, 69, 2.1, 420, seed=5)
m.poly(m.rect(48, 13.3, 6, 2.6), (128, 34, 40), lw=0.07, shadow=0.4)
for i in range(6): m.line([(48.5 + i, 13.3), (48.5 + i, 15.9)], (180, 150, 70), 0.06)
for x in range(2, 69, 6): banner(m, x, 2.75, [(58, 84, 140), (176, 60, 48), (70, 120, 72), (176, 140, 54)][(x // 6) % 4], a=0.6)

m.region("Start (0 yd)", "start", [[(X0 - 1, Y - 1), (X0 + 1, Y - 1), (X0 + 1, Y + 1), (X0 - 1, Y + 1)]])
m.region("Conveyor (20 ft a turn)", "track", [[(X0 - 1, Y - 0.9), (X1 + 1, Y - 0.9), (X1 + 1, Y + 0.9), (X0 - 1, Y + 0.9)]])
finish(m, "round2-track", OUTD, ASSETS)
