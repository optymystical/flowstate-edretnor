"""Round 1 projectile tokens in the pinned monster-token style (make.py's frame). Projectiles have no Archetype, so they use a
neutral stone ring ("object"); no tier pips."""
import cairosvg, math
import make
from make import token, INK, ACC
make.ARCH["object"] = ("#9a8a6a", "#4a4030", "#26231e")
OUT = "../../assets/tokens"
S = {}
S["fieldstone"] = f'''<ellipse cx="256" cy="262" rx="150" ry="118" fill="#a8744a"/>
<ellipse cx="256" cy="250" rx="118" ry="88" fill="#c08a5a"/>
<path d="M170,248 Q256,212 342,248" fill="none" stroke="#7a4e2e" stroke-width="6"/>
<path d="M196,288 Q256,262 316,288" fill="none" stroke="#7a4e2e" stroke-width="5"/>
<circle cx="256" cy="250" r="16" fill="{ACC}"/>'''
peb = "".join(f'<circle cx="{256 + r * math.cos(a)}" cy="{256 + r * math.sin(a)}" r="{s}" fill="{c}"/>'
              for r, a, s, c in [(0, 0, 34, "#9a9284"), (92, 0.3, 30, "#b0a898"), (88, 1.5, 28, "#8a8274"), (96, 2.6, 32, "#a8a090"), (90, 3.7, 26, "#9a9284"),
                                 (94, 4.9, 30, "#b8b0a0"), (150, 0.9, 22, "#8a8274"), (148, 2.1, 24, "#a8a090"), (150, 4.2, 22, "#b0a898"), (146, 5.6, 24, "#9a9284")])
S["hailshot"] = peb
S["ironheart"] = f'''<circle cx="256" cy="256" r="140" fill="#4a4a50"/>
<path d="M140,236 Q256,206 372,236 M140,286 Q256,316 372,286" fill="none" stroke="#2a2a30" stroke-width="6"/>
<ellipse cx="210" cy="200" rx="42" ry="26" fill="#8a8a94" stroke="none" opacity=".8"/>
{''.join(f'<circle cx="{256 + 112 * math.cos(a)}" cy="{256 + 112 * math.sin(a)}" r="11" fill="{ACC}"/>' for a in [i * math.pi / 4 for i in range(8)])}'''
S["skyglass"] = f'''<circle cx="256" cy="256" r="70" fill="#9fd4e8" fill-opacity=".9"/>
<ellipse cx="232" cy="230" rx="24" ry="14" fill="#ffffff" stroke="none" opacity=".85"/>
<path d="M256,120 L256,160 M256,352 L256,392 M120,256 L160,256 M352,256 L392,256 M162,162 L188,188 M324,324 L350,350 M350,162 L324,188 M162,350 L188,324" stroke="{INK}" stroke-width="6"/>'''
S["wardwing"] = f'''<circle cx="256" cy="256" r="150" fill="none" stroke="#7fc4d8" stroke-width="10" stroke-dasharray="20 14"/>
<path d="M256,256 Q196,150 112,170 Q150,220 136,250 Q186,236 206,262 Z" fill="{INK}"/>
<path d="M256,256 Q316,150 400,170 Q362,220 376,250 Q326,236 306,262 Z" fill="{INK}"/>
<path d="M150,190 Q196,200 222,244 M362,190 Q316,200 290,244" fill="none" stroke="#a89878" stroke-width="5"/>
<path d="M256,232 L276,262 L256,300 L236,262 Z" fill="#7fc4d8"/>'''
S["snapshot"] = f'''<circle cx="300" cy="230" r="70" fill="#b0a898"/>
<path d="M120,190 L210,200 M100,240 L214,240 M120,290 L210,280" stroke="{INK}" stroke-width="10"/>
<path d="M240,320 L276,300 L262,348 L304,330 L250,410 L268,356 L228,372 Z" fill="{ACC}"/>'''
S["veiledwisp"] = f'''<circle cx="256" cy="246" r="62" fill="#d8d0f0"/>
<path d="M150,180 Q256,130 362,180 L372,360 Q340,330 314,362 Q286,330 256,364 Q226,330 198,362 Q172,330 140,360 Z" fill="#8a7aa8" fill-opacity=".72"/>
<path d="M392,214 Q410,246 392,278 M416,198 Q442,246 416,294 M120,214 Q102,246 120,278 M96,198 Q70,246 96,294" fill="none" stroke="{INK}" stroke-width="6"/>'''
S["lantern"] = f'''<rect x="236" y="104" width="40" height="26" rx="6" fill="{ACC}"/>
<path d="M256,92 L256,106" stroke="{INK}" stroke-width="6"/>
<ellipse cx="256" cy="256" rx="110" ry="130" fill="#e0703a"/>
<path d="M190,140 Q166,256 190,372 M256,128 L256,384 M322,140 Q346,256 322,372" fill="none" stroke="#a8401e" stroke-width="6"/>
<ellipse cx="256" cy="256" rx="54" ry="76" fill="#ffd27a" stroke="none" opacity=".85"/>
<rect x="232" y="382" width="48" height="24" rx="6" fill="{ACC}"/>'''
S["breakershot"] = f'''<g transform="rotate(-35 256 256)"><path d="M256,110 L284,190 L270,190 L270,380 L242,380 L242,190 L228,190 Z" fill="{INK}"/>
<path d="M242,350 L210,400 L242,380 M270,350 L302,400 L270,380" fill="#c0503a"/></g>'''
S["geode"] = f'''<path d="M256,110 L380,180 L380,330 L256,402 L132,330 L132,180 Z" fill="#7a7a84"/>
<path d="M256,110 L256,402 M132,180 L380,330 M380,180 L132,330" fill="none" stroke="#4a4a54" stroke-width="5"/>
<path d="M256,190 L318,226 L318,290 L256,326 L194,290 L194,226 Z" fill="#b48ad8"/>
<path d="M256,190 L256,326 M194,226 L318,290 M318,226 L194,290" fill="none" stroke="#6a4a8a" stroke-width="4"/>'''
S["heartstone"] = f'''<path d="M256,394 Q120,300 120,196 Q120,128 188,128 Q236,128 256,176 Q276,128 324,128 Q392,128 392,196 Q392,300 256,394 Z" fill="#8a3a3a"/>
<path d="M236,200 L276,200 M256,180 L256,300 M226,270 L286,236 M226,236 L286,270" stroke="{ACC}" stroke-width="10"/>
<ellipse cx="186" cy="176" rx="26" ry="16" fill="#c06a6a" stroke="none" opacity=".8"/>'''
for k, sym in S.items():
    svg = token("object", 0, sym)
    cairosvg.svg2png(bytestring=svg.encode(), write_to=f"{OUT}/projectile_{k}.png", output_width=512, output_height=512)
from PIL import Image
sheet = Image.new("RGBA", (6 * 200, 2 * 200), (40, 36, 32, 255))
for i, k in enumerate(S):
    im = Image.open(f"{OUT}/projectile_{k}.png").resize((190, 190), Image.LANCZOS); sheet.alpha_composite(im, (5 + (i % 6) * 200, 5 + (i // 6) * 200))
sheet.save("/tmp/projectiles.png"); print(list(S))
