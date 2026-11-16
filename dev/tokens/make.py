import cairosvg
from PIL import Image
ARCH={"martial":("#b0623a","#5a2c16","#2b2420"),"mental":("#8a5cb8","#3f2560","#241f2b"),"magic":("#3f8fb0","#1b4659","#1e2629")}
INK="#e9dcc0"; ACC="#c9a45c"
def pips(n):
    s,gap="",26; x0=256-(n-1)*gap/2
    for i in range(n):
        x=x0+i*gap; s+=f'<path d="M{x},438 l9,9 l-9,9 l-9,-9z" fill="{ACC}" stroke="#1a1410" stroke-width="2"/>'
    return s
def token(arch,tier,sym):
    ring,dark,field=ARCH[arch]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<defs><radialGradient id="f" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="{field}"/><stop offset="1" stop-color="#0e0c0a"/></radialGradient>
<linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{ring}"/><stop offset="1" stop-color="{dark}"/></linearGradient></defs>
<circle cx="256" cy="256" r="250" fill="url(#r)"/><circle cx="256" cy="256" r="250" fill="none" stroke="#120e0b" stroke-width="6"/>
<circle cx="256" cy="256" r="214" fill="url(#f)" stroke="#120e0b" stroke-width="6"/>
<circle cx="256" cy="256" r="200" fill="none" stroke="{ring}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="4 8"/>
<g stroke="#120e0b" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">{sym}</g>{pips(tier)}</svg>'''
CROWN=f'<path d="M222,118 L230,96 L243,110 L256,90 L269,110 L282,96 L290,118 Z" fill="{ACC}" stroke-width="5"/>'
S={}
# Brawler: wrapped fist
S["brawler"]=f'''<rect x="176" y="176" width="160" height="150" rx="40" fill="#c89a72"/>
<path d="M216,182 v58 M256,180 v60 M296,182 v58" stroke="#7a5038" stroke-width="6"/>
<path d="M176,236 Q160,250 168,290 L196,300" fill="#c89a72"/>
<rect x="190" y="300" width="132" height="70" rx="10" fill="{INK}"/>
<path d="M190,318 L322,334 M190,342 L322,358" stroke="#a89878" stroke-width="5"/>
<rect x="190" y="300" width="132" height="70" rx="10" fill="none"/>'''
# Hedge-mage: igniter rod with flame
S["hedgemage"]=f'''<g transform="rotate(30 256 300)"><rect x="244" y="200" width="24" height="230" rx="10" fill="#8a6a44"/>
<rect x="236" y="196" width="40" height="22" rx="6" fill="{ACC}"/></g>
<path d="M226,196 Q216,150 250,112 Q248,146 266,152 Q262,124 286,98 Q316,150 300,196 Q286,226 256,226 Q232,224 226,196 Z" fill="#d9662a"/>
<path d="M246,196 Q244,170 262,150 Q266,172 280,176 Q288,200 270,214 Q254,220 246,196 Z" fill="#f2b84a" stroke-width="5"/>'''
# Devotee: bone skull charm on a cord
S["devotee"]=f'''<path d="M150,130 Q256,210 362,130" fill="none" stroke="#120e0b" stroke-width="16"/>
<path d="M150,130 Q256,210 362,130" fill="none" stroke="#8a6a44" stroke-width="7"/>
<path d="M206,250 Q206,184 256,184 Q306,184 306,250 Q306,282 288,292 L288,326 L224,326 L224,292 Q206,282 206,250 Z" fill="{INK}"/>
<circle cx="234" cy="252" r="15" fill="#241f2b" stroke-width="4"/><circle cx="278" cy="252" r="15" fill="#241f2b" stroke-width="4"/>
<path d="M256,270 l-8,16 h16 z" fill="#241f2b" stroke-width="3"/>
<path d="M238,308 v18 M256,308 v18 M274,308 v18" stroke-width="5"/>'''
# Swift duelist: heavy blade crossed with a knife
S["swift"]=f'''<g transform="rotate(-38 256 256)"><path d="M248,86 L264,86 L270,320 L242,320 Z" fill="{INK}"/>
<path d="M256,92 L256,316" stroke="#a89878" stroke-width="4"/>
<rect x="212" y="320" width="88" height="16" rx="5" fill="{ACC}"/><rect x="246" y="336" width="20" height="70" rx="6" fill="#5a3d24"/></g>
<g transform="rotate(40 256 256)"><path d="M250,150 L262,150 L266,280 L246,280 Z" fill="{INK}"/>
<rect x="232" y="280" width="48" height="12" rx="4" fill="{ACC}"/><rect x="248" y="292" width="16" height="46" rx="5" fill="#5a3d24"/></g>'''
# Charm mage: open scroll with spiral eye
S["charm"]=f'''<rect x="150" y="170" width="212" height="170" fill="{INK}"/>
<rect x="134" y="156" width="28" height="198" rx="12" fill="#8a6a44"/><rect x="350" y="156" width="28" height="198" rx="12" fill="#8a6a44"/>
<path d="M190,256 Q256,196 322,256 Q256,316 190,256 Z" fill="#cfe7ef"/>
<circle cx="256" cy="256" r="26" fill="#3f8fb0" stroke-width="5"/>
<path d="M256,256 m-12,0 a12,12 0 1,1 12,12 a7,7 0 1,1 -7,-7" fill="none" stroke="#120e0b" stroke-width="4"/>'''
# Pyre adept: crossed logs under a dark-cored flame
S["pyre"]=f'''<rect x="150" y="320" width="212" height="34" rx="14" fill="#7a5a3a" transform="rotate(-12 256 337)"/>
<rect x="150" y="320" width="212" height="34" rx="14" fill="#8a6a44" transform="rotate(12 256 337)"/>
<path d="M256,96 Q312,170 296,226 Q330,206 328,168 Q372,250 334,312 L178,312 Q140,250 184,168 Q182,206 216,226 Q200,170 256,96 Z" fill="#d9662a"/>
<path d="M256,168 Q288,216 276,250 Q296,244 300,224 Q318,266 300,300 L212,300 Q196,266 214,232 Q222,252 236,254 Q226,212 256,168 Z" fill="#f2b84a" stroke-width="5"/>'''
# Halberdier (King's Guard): halberd
S["halberdier"]=CROWN+f'''<g transform="rotate(-24 256 270)"><rect x="248" y="150" width="18" height="270" rx="6" fill="#8a6a44"/>
<path d="M266,170 L330,150 Q350,200 330,252 L266,236 Z" fill="{INK}"/>
<path d="M248,190 L210,176 L210,214 L248,206 Z" fill="{INK}"/>
<path d="M257,150 L248,104 L266,104 Z" fill="{INK}"/>
<rect x="244" y="236" width="26" height="12" rx="3" fill="{ACC}"/></g>'''
# Ward-mage (King's Guard): hex shield sigil around a crystal shard
S["wardmage"]=CROWN+f'''<path d="M256,150 L346,202 L346,306 L256,358 L166,306 L166,202 Z" fill="none" stroke-width="18"/>
<path d="M256,150 L346,202 L346,306 L256,358 L166,306 L166,202 Z" fill="none" stroke="#6fc0dc" stroke-width="8"/>
<path d="M256,196 L292,254 L256,322 L220,254 Z" fill="{INK}"/>
<path d="M256,196 L256,322 M220,254 L292,254" stroke="#a89878" stroke-width="4"/>'''
# Gravedeacon (King's Guard): emptied hourglass
S["gravedeacon"]=CROWN+f'''<rect x="176" y="150" width="160" height="20" rx="6" fill="{ACC}"/><rect x="176" y="340" width="160" height="20" rx="6" fill="{ACC}"/>
<path d="M196,170 L316,170 Q316,232 262,255 Q316,278 316,340 L196,340 Q196,278 250,255 Q196,232 196,170 Z" fill="#cfc4ae"/>
<path d="M214,340 Q256,300 298,340 Z" fill="#3f2560" stroke-width="4"/>
<path d="M256,258 L256,322" stroke="#3f2560" stroke-width="4" stroke-dasharray="6 6"/>'''
# Blackwell (Royal Guard): scythe crescent with a funeral lily
S["blackwell"]=CROWN+f'''<g transform="translate(256 282) scale(0.84) translate(-256 -256)"><g transform="rotate(28 256 270)"><rect x="248" y="140" width="16" height="290" rx="6" fill="#3a2a1e"/>
<path d="M256,146 Q180,120 120,170 Q186,150 250,176 Z" fill="#cfc4ae"/></g>
<path d="M232,392 Q238,330 250,290" fill="none" stroke="#4f7a3a" stroke-width="9"/>
<path d="M250,292 Q196,286 168,244 Q214,246 246,272 Z" fill="{INK}"/>
<path d="M250,292 Q300,270 318,226 Q276,236 254,270 Z" fill="{INK}"/>
<path d="M250,292 Q232,236 252,196 Q272,240 262,286 Z" fill="{INK}"/>
<path d="M248,282 l-14,-26 M256,280 l2,-28 M262,282 l16,-22" stroke="#3f2560" stroke-width="4"/>
<circle cx="234" cy="254" r="5" fill="#3f2560" stroke="none"/><circle cx="258" cy="250" r="5" fill="#3f2560" stroke="none"/><circle cx="279" cy="258" r="5" fill="#3f2560" stroke="none"/></g>'''
ROSTER=[("brawler","martial",2),("hedgemage","magic",2),("devotee","mental",2),
        ("swift","martial",3),("charm","magic",3),("pyre","mental",3),
        ("halberdier","martial",4),("wardmage","magic",4),("gravedeacon","mental",4),("blackwell","mental",5)]
NAMES={"brawler":"local_brawler","hedgemage":"local_hedge_mage","devotee":"local_devotee","swift":"staff_swift_duelist",
 "charm":"staff_charm_mage","pyre":"staff_pyre_adept","halberdier":"kings_guard_halberdier","wardmage":"kings_guard_ward_mage",
 "gravedeacon":"kings_guard_gravedeacon","blackwell":"royal_guard_blackwell"}
pngs=[]
for k,a,t in ROSTER:
    svg=token(a,t,S[k]); n=NAMES[k]
    open(n+".svg","w").write(svg); cairosvg.svg2png(bytestring=svg.encode(),write_to=n+".png",output_width=512,output_height=512); pngs.append(n+".png")
sheet=Image.new("RGBA",(5*270,2*270),(40,36,32,255))
for i,p in enumerate(pngs):
    im=Image.open(p).resize((256,256),Image.LANCZOS); sheet.alpha_composite(im,(7+(i%5)*270,7+(i//5)*270))
sheet.save("round2_token_sheet.png"); print("ok")
