"""Shared top-down battlemap renderer for Flow State Foundry scenes (cairo vector props over numpy ground)."""
import cairocffi as cairo, numpy as np, math, random, json
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

def C(c, a=1.0):
    return (c[0]/255, c[1]/255, c[2]/255, a)

OUT = (30, 24, 18)

class Map:
    def __init__(self, gw, gh, G=100, Q=4, seed=1):
        self.gw, self.gh, self.G, self.Q = gw, gh, G, Q
        self.W, self.H = gw*G, gh*G
        self.h, self.w = self.H//Q, self.W//Q          # ground (low-res) dims
        self.px = G/Q                                    # low-res px per square
        yy, xx = np.mgrid[0:self.h, 0:self.w]
        self.X = (xx+0.5)/self.px; self.Y = (yy+0.5)/self.px   # square coords of every low-res pixel
        self.col = np.zeros((self.h, self.w, 3), np.float32)
        self.surf = {}
        for k in ('shadow', 'obj', 'top', 'glow'):
            s = cairo.ImageSurface(cairo.FORMAT_ARGB32, self.W, self.H)
            c = cairo.Context(s); c.scale(G, G); c.set_line_join(cairo.LINE_JOIN_ROUND); c.set_line_cap(cairo.LINE_CAP_ROUND)
            self.surf[k] = (s, c)
        self.o = self.surf['obj'][1]; self.s = self.surf['shadow'][1]; self.t = self.surf['top'][1]; self.g = self.surf['glow'][1]
        self.R = random.Random(seed); self.seed = seed
        self.walls, self.lights, self.regions, self.marks = [], [], [], []

    # ---------------- ground (numpy, low-res) ----------------
    def noise(self, scale, octaves=4, seed=0):
        rng = np.random.default_rng(seed + 1000*self.seed); acc = np.zeros((self.h, self.w), np.float32); amp = 1; tot = 0
        for o in range(octaves):
            n = max(2, int(scale*2**o))
            small = rng.random((n, int(n*self.w/self.h)+1)).astype(np.float32)
            im = Image.fromarray((small*255).astype(np.uint8)).resize((self.w, self.h), Image.BICUBIC)
            acc += np.asarray(im, np.float32)/255*amp; tot += amp; amp *= 0.5
        return acc/tot

    def mask_poly(self, pts, blur=0):
        im = Image.new('L', (self.w, self.h), 0)
        ImageDraw.Draw(im).polygon([(x*self.px, y*self.px) for x, y in pts], fill=255)
        m = np.asarray(im, np.float32)/255
        return ndimage.gaussian_filter(m, blur*self.px) if blur else m

    def mask_line(self, pts, width, blur=0):
        im = Image.new('L', (self.w, self.h), 0); d = ImageDraw.Draw(im)
        P = [(x*self.px, y*self.px) for x, y in pts]
        d.line(P, fill=255, width=max(1, int(width*self.px)), joint='curve')
        r = width*self.px/2
        for x, y in P: d.ellipse([x-r, y-r, x+r, y+r], fill=255)
        m = np.asarray(im, np.float32)/255
        return ndimage.gaussian_filter(m, blur*self.px) if blur else m

    def mask_ellipse(self, cx, cy, rx, ry, blur=0):
        m = (((self.X-cx)/rx)**2 + ((self.Y-cy)/ry)**2 <= 1).astype(np.float32)
        return ndimage.gaussian_filter(m, blur*self.px) if blur else m

    def paint(self, mask, color):
        m = np.clip(mask, 0, 1)[..., None]
        color = np.asarray(color, np.float32)
        self.col = self.col*(1-m) + color*m

    def dist(self, mask):   # distance (squares) from outside the mask, measured inside it
        return ndimage.distance_transform_edt(mask > 0.5)/self.px

    # ---------------- vector helpers ----------------
    def _path(self, c, pts, close=True):
        c.move_to(*pts[0])
        for p in pts[1:]: c.line_to(*p)
        if close: c.close_path()

    def poly(self, pts, fill, outline=OUT, lw=0.035, shadow=0.13, ctx=None, alpha=1.0):
        c = ctx or self.o
        if shadow and c is self.o:
            self.s.save(); self.s.translate(shadow*0.8, shadow); self._path(self.s, pts)
            self.s.set_source_rgba(0, 0, 0, 0.6); self.s.fill(); self.s.restore()
        self._path(c, pts); c.set_source_rgba(*C(fill, alpha))
        if outline: c.fill_preserve(); c.set_source_rgba(*C(outline, alpha)); c.set_line_width(lw); c.stroke()
        else: c.fill()

    def circle(self, x, y, r, fill, outline=OUT, lw=0.035, shadow=0.1, ctx=None, alpha=1.0):
        c = ctx or self.o
        if shadow and c is self.o:
            self.s.arc(x+shadow*0.8, y+shadow, r, 0, 2*math.pi); self.s.set_source_rgba(0, 0, 0, 0.6); self.s.fill()
        c.new_sub_path(); c.arc(x, y, r, 0, 2*math.pi); c.set_source_rgba(*C(fill, alpha))
        if outline: c.fill_preserve(); c.set_source_rgba(*C(outline, alpha)); c.set_line_width(lw); c.stroke()
        else: c.fill()

    def line(self, pts, color, lw, ctx=None, alpha=1.0):
        c = ctx or self.o
        self._path(c, pts, close=False); c.set_source_rgba(*C(color, alpha)); c.set_line_width(lw); c.stroke()

    def jit(self, col, k=12):
        f = 1+self.R.uniform(-k, k)/100
        return tuple(max(0, min(255, int(v*f + self.R.randint(-3, 3)))) for v in col[:3])

    @staticmethod
    def rot(pts, cx, cy, a):
        ca, sa = math.cos(a), math.sin(a)
        return [(cx + x*ca - y*sa, cy + x*sa + y*ca) for x, y in pts]

    def rect(self, x, y, w, h, a=0.0):
        cx, cy = x+w/2, y+h/2
        return self.rot([(-w/2, -h/2), (w/2, -h/2), (w/2, h/2), (-w/2, h/2)], cx, cy, a)

    # ---------------- props ----------------
    WOOD = (138, 98, 60); WOOD2 = (112, 80, 48); DARKW = (74, 52, 32)
    def crate(self, x, y, s=1.0, a=None):
        a = self.R.uniform(0, math.pi) if a is None else a; h = 0.42*s
        p = self.rot([(-h, -h), (h, -h), (h, h), (-h, h)], x, y, a); self.poly(p, self.jit(self.WOOD))
        for t in (-0.33, 0.33):
            self.line(self.rot([(-h, t*h*2), (h, t*h*2)], x, y, a), self.DARKW, 0.025)
        self.line(self.rot([(-h, -h), (h, h)], x, y, a), (84, 58, 34), 0.03)

    def barrel(self, x, y, s=1.0, side=False, a=None, col=(124, 88, 52)):
        r = 0.3*s
        if side:
            a = self.R.uniform(0, math.pi) if a is None else a
            p = self.rot([(-r*1.4, -r), (r*1.4, -r), (r*1.4, r), (-r*1.4, r)], x, y, a); self.poly(p, self.jit(col))
            for t in (-0.8, 0.8): self.line(self.rot([(t*r*1.4, -r), (t*r*1.4, r)], x, y, a), (70, 66, 62), 0.05)
        else:
            self.circle(x, y, r, self.jit(col)); self.circle(x, y, r*0.7, self.jit(col), outline=(72, 68, 64), lw=0.035, shadow=0)

    def plank(self, x, y, l=1.2, a=None, w=0.16, col=None):
        a = self.R.uniform(0, math.pi) if a is None else a
        p = self.rot([(-l/2, -w/2), (l/2, -w/2), (l/2, w/2), (-l/2, w/2)], x, y, a)
        self.poly(p, self.jit(col or self.WOOD, 18), lw=0.025, shadow=0.06)

    def stone(self, x, y, s=1.0, cols=((124, 116, 102), (108, 100, 88), (138, 128, 112), (96, 88, 78))):
        r = 0.26*s; n = self.R.randint(5, 7); o = self.R.uniform(0, 1)
        p = [(x + r*self.R.uniform(0.6, 1.1)*math.cos(2*math.pi*i/n+o), y + r*self.R.uniform(0.6, 1.1)*math.sin(2*math.pi*i/n+o)) for i in range(n)]
        self.poly(p, self.jit(self.R.choice(cols), 10), lw=0.025, shadow=0.06)

    def rock(self, x, y, r, col=(118, 112, 104), n=None):
        n = n or self.R.randint(7, 10); o = self.R.uniform(0, 1)
        p = [(x + r*self.R.uniform(0.7, 1.1)*math.cos(2*math.pi*i/n+o), y + r*self.R.uniform(0.7, 1.1)*0.9*math.sin(2*math.pi*i/n+o)) for i in range(n)]
        self.poly(p, self.jit(col, 8), lw=0.05, shadow=0.3)
        # highlight facet
        hp = [(x + (px-x)*0.55 - r*0.18, y + (py-y)*0.55 - r*0.2) for px, py in p]
        self.poly(hp, tuple(min(255, int(v*1.15)) for v in col), outline=None, shadow=0, alpha=0.6)
        for _ in range(2):
            a = self.R.uniform(0, 2*math.pi); self.line([(x, y), (x + r*0.7*math.cos(a), y + r*0.7*math.sin(a))], (70, 66, 60), 0.03, alpha=0.7)
        return p

    def bush(self, x, y, r, col=(58, 86, 42)):
        for i in range(6):
            a = self.R.uniform(0, 2*math.pi); rr = r*self.R.uniform(0.2, 0.6)
            cx, cy = x + rr*math.cos(a), y + rr*math.sin(a); s = r*self.R.uniform(0.45, 0.7)
            self.circle(cx, cy, s, self.jit(col, 12), outline=(30, 44, 22), lw=0.03, shadow=0.25)

    def tree(self, x, y, r, col=(52, 82, 40), ctx=None):
        c = ctx or self.t   # canopies draw on top layer (over tokens' ground clutter)
        self.s.arc(x+0.35, y+0.45, r*1.05, 0, 2*math.pi); self.s.set_source_rgba(0, 0, 0, 0.55); self.s.fill()
        for i in range(9):
            a = self.R.uniform(0, 2*math.pi); rr = r*self.R.uniform(0.15, 0.55)
            cx, cy = x + rr*math.cos(a), y + rr*math.sin(a); s = r*self.R.uniform(0.4, 0.62)
            self.circle(cx, cy, s, self.jit(col, 14), outline=(26, 40, 20), lw=0.04, shadow=0, ctx=c)
        for i in range(4):
            a = self.R.uniform(0, 2*math.pi); rr = r*self.R.uniform(0.1, 0.4)
            self.circle(x + rr*math.cos(a) - r*0.1, y + rr*math.sin(a) - r*0.12, r*0.25, self.jit((80, 112, 58), 10), outline=None, shadow=0, ctx=c, alpha=0.7)

    def roof(self, x, y, w, h, col, ridge='h', a=0.0, chimney=True):
        """Gable roof on rectangle (x,y,w,h). ridge 'h' = ridge runs along x."""
        cx, cy = x+w/2, y+h/2
        R = lambda pts: self.rot([(px-cx, py-cy) for px, py in pts], cx, cy, a)
        self.poly(R([(x, y), (x+w, y), (x+w, y+h), (x, y+h)]), col, lw=0.06, shadow=0.35)
        dark = tuple(int(v*0.78) for v in col); light = tuple(min(255, int(v*1.08)) for v in col)
        if ridge == 'h':
            self.poly(R([(x, y), (x+w, y), (x+w, cy), (x, cy)]), light, outline=None, shadow=0)
            self.poly(R([(x, cy), (x+w, cy), (x+w, y+h), (x, y+h)]), dark, outline=None, shadow=0)
            n = max(3, int(h/0.35))
            for i in range(1, n):
                yy = y + i*h/n
                if abs(yy-cy) < 0.05: continue
                self.line(R([(x, yy), (x+w, yy)]), tuple(int(v*0.62) for v in col), 0.025, alpha=0.8)
            self.line(R([(x, cy), (x+w, cy)]), tuple(int(v*0.5) for v in col), 0.09)
        else:
            self.poly(R([(x, y), (cx, y), (cx, y+h), (x, y+h)]), light, outline=None, shadow=0)
            self.poly(R([(cx, y), (x+w, y), (x+w, y+h), (cx, y+h)]), dark, outline=None, shadow=0)
            n = max(3, int(w/0.35))
            for i in range(1, n):
                xx = x + i*w/n
                if abs(xx-cx) < 0.05: continue
                self.line(R([(xx, y), (xx, y+h)]), tuple(int(v*0.62) for v in col), 0.025, alpha=0.8)
            self.line(R([(cx, y), (cx, y+h)]), tuple(int(v*0.5) for v in col), 0.09)
        self.poly(R([(x, y), (x+w, y), (x+w, y+h), (x, y+h)]), col, outline=OUT, lw=0.07, shadow=0, alpha=0.0)
        self._path(self.o, R([(x, y), (x+w, y), (x+w, y+h), (x, y+h)])); self.o.set_source_rgba(*C(OUT)); self.o.set_line_width(0.07); self.o.stroke()
        if chimney:
            px, py = (x + w*0.75, y + h*0.2) if ridge == 'h' else (x + w*0.2, y + h*0.75)
            self.poly(R([(px-0.25, py-0.25), (px+0.25, py-0.25), (px+0.25, py+0.25), (px-0.25, py+0.25)]), (110, 100, 92), lw=0.04, shadow=0.15)
            self.circle(*R([(px, py)])[0], 0.12, (40, 34, 30), outline=None, shadow=0)

    def floor_boards(self, x, y, w, h, col=(120, 90, 60), horiz=True):
        self.poly([(x, y), (x+w, y), (x+w, y+h), (x, y+h)], col, outline=None, shadow=0)
        if horiz:
            for i in range(1, int(h/0.3)+1): self.line([(x, y+i*0.3), (x+w, y+i*0.3)], tuple(int(v*0.75) for v in col), 0.02)
        else:
            for i in range(1, int(w/0.3)+1): self.line([(x+i*0.3, y), (x+i*0.3, y+h)], tuple(int(v*0.75) for v in col), 0.02)

    def wall_stroke(self, a, b, col=(96, 90, 82), lw=0.28):
        self.line([a, b], OUT, lw+0.07); self.line([a, b], col, lw)

    def flames(self, x, y, r, n=7, wind=(0.8, -0.6)):
        self.glow_at(x, y, r*3.4, (255, 140, 50), 0.5)
        wl = math.hypot(*wind); ux, uy = wind[0]/wl, wind[1]/wl
        blobs = []
        for i in range(n):
            a = self.R.uniform(0, 2*math.pi); rr = r*math.sqrt(self.R.random())*0.7
            blobs.append((x + rr*math.cos(a), y + rr*math.sin(a), r*self.R.uniform(0.28, 0.5)))
        c = self.t
        for layer, (c0, c1, k) in enumerate([((150, 40, 14), (150, 40, 14), 1.25), ((232, 96, 30), (210, 60, 20), 1.0), ((255, 190, 70), (240, 120, 40), 0.62), ((255, 240, 170), (255, 200, 90), 0.3)]):
            for (bx, by, s) in blobs:
                s2 = s*k
                # teardrop: circle stretched downwind
                pts = []
                for t in np.linspace(0, 2*math.pi, 28):
                    px, py = math.cos(t)*s2, math.sin(t)*s2
                    d = px*ux + py*uy
                    stretch = 1 + (0.9 if d > 0 else 0)*(d/s2 if s2 else 0)
                    pts.append((bx + px + ux*max(d, 0)*0.9 + 0.08*s2*math.sin(5*t + layer), by + py + uy*max(d, 0)*0.9 + 0.08*s2*math.cos(4*t + layer)))
                g = cairo.RadialGradient(bx, by, 0, bx, by, s2*1.6)
                g.add_color_stop_rgba(0, *C(c0, 0.95 if layer else 0.55)); g.add_color_stop_rgba(1, *C(c1, 0.75 if layer else 0.3))
                self._path(c, pts); c.set_source(g); c.fill()

    def glow_at(self, x, y, r, col, a):
        g = cairo.RadialGradient(x, y, 0, x, y, r)
        g.add_color_stop_rgba(0, *C(col, a)); g.add_color_stop_rgba(1, *C(col, 0))
        self.g.set_source(g); self.g.arc(x, y, r, 0, 2*math.pi); self.g.fill()

    def smoke(self, x, y, r, n=10, drift=(1.0, -0.6), a=0.22):
        for i in range(n):
            t = i/n
            cx = x + drift[0]*t*r*3 + self.R.uniform(-0.3, 0.3)*r; cy = y + drift[1]*t*r*3 + self.R.uniform(-0.3, 0.3)*r
            s = r*(0.5 + t)
            g = cairo.RadialGradient(cx, cy, 0, cx, cy, s)
            g.add_color_stop_rgba(0, 0.22, 0.21, 0.2, a*(1-t*0.6)); g.add_color_stop_rgba(1, 0.22, 0.21, 0.2, 0)
            self.t.set_source(g); self.t.arc(cx, cy, s, 0, 2*math.pi); self.t.fill()

    def boat(self, x, y, l, w, a, col=(118, 84, 50), wrecked=False, upturned=False, burnt=False):
        n = 24; pts = []
        for i in range(n+1):
            t = i/n; px = -l/2 + l*t; hw = w/2*math.sin(math.pi*t)**0.7 * (1 if t > 0.25 else 0.6+1.6*t)
            pts.append((px, -hw))
        pts += [(px, -py) for px, py in reversed(pts)]
        if burnt: col = (52, 40, 32)
        P = self.rot(pts, x, y, a)
        if upturned:
            self.poly(P, self.jit(col, 8), lw=0.05, shadow=0.15)
            self.line(self.rot([(-l/2*0.95, 0), (l/2*0.95, 0)], x, y, a), tuple(int(v*0.6) for v in col), 0.07)
            for k in (-0.3, 0.3): self.line(self.rot([(-l/2*0.8, k*w/2), (l/2*0.8, k*w/2)], x, y, a), tuple(int(v*0.75) for v in col), 0.025)
            return
        self.poly(P, self.jit(col, 8), lw=0.05, shadow=0.15)
        inner = self.rot([(px*0.9, py*0.75) for px, py in pts], x, y, a)
        self.poly(inner, (int(col[0]*0.7), int(col[1]*0.7), int(col[2]*0.7)), lw=0.025, shadow=0)
        for k in range(1, 4):
            px = -l/2*0.8 + k*l*0.8/2.2
            hw = w/2*0.7
            self.line(self.rot([(px, -hw), (px, hw)], x, y, a), col, 0.12)
        if wrecked:
            hole = self.rot([(l*0.1, -w*0.1), (l*0.25, -w*0.3), (l*0.32, w*0.05), (l*0.18, w*0.2)], x, y, a)
            self.poly(hole, (34, 30, 28), lw=0.03, shadow=0)
            for i in range(3): self.plank(x + self.R.uniform(-1, 1)*l/2, y + self.R.uniform(-1, 1)*w, 0.8)

    def cobbles(self, poly_pts, col=(128, 120, 108), size=0.32, seed=5):
        from shapely.geometry import Polygon, Point
        P = Polygon(poly_pts); minx, miny, maxx, maxy = P.bounds
        R = random.Random(seed); yy = miny; row = 0
        while yy < maxy:
            xx = minx + (size/2 if row % 2 else 0)
            while xx < maxx:
                cx, cy = xx + R.uniform(-0.04, 0.04), yy + R.uniform(-0.04, 0.04)
                if P.contains(Point(cx, cy)):
                    s = size*R.uniform(0.38, 0.48)
                    pts = [(cx + s*math.cos(t)*R.uniform(0.85, 1.05), cy + s*math.sin(t)*R.uniform(0.85, 1.05)) for t in np.linspace(0, 2*math.pi, 7)[:-1]]
                    f = R.uniform(0.86, 1.1); c = tuple(int(v*f) for v in col)
                    self.poly(pts, c, outline=(70, 64, 58), lw=0.018, shadow=0)
                xx += size
            yy += size*0.9; row += 1

    def flagstones(self, x, y, w, h, col=(132, 126, 116), bw=0.9, bh=0.6, seed=6):
        R = random.Random(seed); row = 0; yy = y
        while yy < y+h-1e-6:
            hh = min(bh, y+h-yy); xx = x - (bw/2 if row % 2 else 0)
            while xx < x+w-1e-6:
                x0 = max(x, xx); x1 = min(x+w, xx+bw)
                if x1-x0 > 0.05:
                    f = R.uniform(0.88, 1.08); c = tuple(int(min(255, v*f)) for v in col)
                    self.poly([(x0, yy), (x1, yy), (x1, yy+hh), (x0, yy+hh)], c, outline=(78, 72, 66), lw=0.025, shadow=0)
                xx += bw
            yy += bh; row += 1

    # ---------------- foundry data ----------------
    def wall(self, a, b, kind='solid'):
        self.walls.append({'c': [round(a[0]*self.G), round(a[1]*self.G), round(b[0]*self.G), round(b[1]*self.G)], 'kind': kind})

    def wall_path(self, pts, kind='solid', close=False):
        P = list(pts) + ([pts[0]] if close else [])
        for a, b in zip(P, P[1:]): self.wall(a, b, kind)

    def room(self, x, y, w, h, doors=(), kind='solid'):
        """Rectangular wall loop. doors: list of (side, offset_from_start, width[, doorkind]) sides n/s/e/w."""
        sides = {'n': ((x, y), (x+w, y)), 'e': ((x+w, y), (x+w, y+h)), 's': ((x, y+h), (x+w, y+h)), 'w': ((x, y), (x, y+h))}
        for sd, (a, b) in sides.items():
            L = math.dist(a, b); ux, uy = (b[0]-a[0])/L, (b[1]-a[1])/L
            cuts = sorted([d for d in doors if d[0] == sd], key=lambda d: d[1]); pos = 0
            for d in cuts:
                off, dw = d[1], d[2]; dk = d[3] if len(d) > 3 else 'door'
                if off > pos: self.wall((a[0]+ux*pos, a[1]+uy*pos), (a[0]+ux*off, a[1]+uy*off), kind)
                if dk != 'gap': self.wall((a[0]+ux*off, a[1]+uy*off), (a[0]+ux*(off+dw), a[1]+uy*(off+dw)), dk)
                pos = off+dw
            if pos < L: self.wall((a[0]+ux*pos, a[1]+uy*pos), b, kind)

    def light(self, name, x, y, bright, dim, color, alpha=0.45, anim='torch', speed=5, intensity=5):
        self.lights.append({'name': name, 'x': x*self.G, 'y': y*self.G, 'bright': bright, 'dim': dim, 'color': color,
                            'alpha': alpha, 'anim': anim, 'speed': speed, 'intensity': intensity})

    def region(self, name, kind, polys, holes=()):
        sh = [{'type': 'polygon', 'points': [round(v*self.G) for p in poly for v in p], 'hole': False} for poly in polys]
        sh += [{'type': 'polygon', 'points': [round(v*self.G) for p in poly for v in p], 'hole': True} for poly in holes]
        self.regions.append({'name': name, 'kind': kind, 'shapes': sh})

    # ---------------- output ----------------
    def compose(self, ground_blur=0.0, vignette=True):
        base = Image.fromarray(np.clip(self.col, 0, 255).astype(np.uint8)).resize((self.W, self.H), Image.BICUBIC).convert('RGBA')
        def pil(k):
            s = self.surf[k][0]; s.flush()
            a = np.ndarray((self.H, self.W, 4), np.uint8, s.get_data())
            rgba = a[..., [2, 1, 0, 3]].copy()
            # un-premultiply
            al = rgba[..., 3:4].astype(np.float32)
            rgb = np.where(al > 0, rgba[..., :3].astype(np.float32)*255/np.maximum(al, 1), 0)
            out = np.concatenate([np.clip(rgb, 0, 255), al], -1).astype(np.uint8)
            return Image.fromarray(out, 'RGBA')
        sh = pil('shadow').getchannel('A').filter(ImageFilter.GaussianBlur(0.1*self.G))
        img = Image.composite(Image.new('RGBA', base.size, (8, 6, 5, 255)), base, sh.point(lambda v: int(v*0.5)))
        img.alpha_composite(pil('obj'))
        # glow: additive-ish screen
        gl = pil('glow'); ga = np.asarray(gl, np.float32)/255; im = np.asarray(img, np.float32)/255
        rgb = 1 - (1 - im[..., :3])*(1 - ga[..., :3]*ga[..., 3:4])
        img = Image.fromarray((np.concatenate([rgb, im[..., 3:4]], -1)*255).astype(np.uint8), 'RGBA')
        img.alpha_composite(pil('top'))
        if vignette:
            vig = Image.new('L', (self.W, self.H), 0)
            ImageDraw.Draw(vig).ellipse([-self.W*0.15, -self.H*0.15, self.W*1.15, self.H*1.15], fill=255)
            vig = vig.filter(ImageFilter.GaussianBlur(self.W*0.05))
            img = Image.composite(img, Image.new('RGBA', img.size, (18, 15, 12, 255)), vig.point(lambda v: int(165+v*90/255)))
        return img.convert('RGB')

    def save_data(self, path):
        json.dump({'walls': self.walls, 'lights': self.lights, 'regions': self.regions, 'marks': self.marks,
                   'grid': [self.gw, self.gh, self.G]}, open(path, 'w'))
