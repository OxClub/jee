// Generates 10,000 unique questions per subject with computed answers and solutions.
const fs=require("fs"),path=require("path");
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R=(r,a,b)=>a+Math.floor(r()*(b-a+1)),P=(r,a)=>a[Math.floor(r()*a.length)];
const fmt=n=>String(+n.toFixed(2));
const SUP="⁰¹²³⁴⁵⁶⁷⁸⁹",sup=n=>String(n).split("").map(c=>c==="-"?"⁻":SUP[+c]).join("");
const ord=n=>n+(n%100>=11&&n%100<=13?"th":["th","st","nd","rd"][n%10]||"th");
function shuf(r,a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const nCr=(n,k)=>{let v=1;for(let i=1;i<=k;i++)v=v*(n-k+i)/i;return Math.round(v)};
const TRI=[[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[7,24,25],[20,21,29],[12,35,37],[15,20,25],[16,30,34]];
const CMP=[["H₂O",18],["CO₂",44],["NaOH",40],["CaCO₃",100],["H₂SO₄",98],["NH₃",17],["CH₄",16],["O₂",32]];
const G={
Physics:[
["Kinematics",r=>{const u=R(r,1,60),a=R(r,1,15),t=R(r,1,30);return[`A body moving at ${u} m/s accelerates uniformly at ${a} m/s² for ${t} s. Its final speed (m/s) is:`,u+a*t,`v = u + at = ${u} + ${a}×${t} = ${u+a*t} m/s`]}],
["Kinematics",r=>{const u=R(r,0,30),a=2*R(r,1,10),t=R(r,1,20),s=u*t+a*t*t/2;return[`A particle starts with speed ${u} m/s and accelerates at ${a} m/s² for ${t} s. Distance covered (m)?`,s,`s = ut + ½at² = ${u}×${t} + ½×${a}×${t}² = ${s} m`]}],
["Free fall",r=>{const t=R(r,1,30),h=5*t*t;return r()<.5?[`A stone is dropped from a height of ${h} m (g = 10 m/s²). Time to reach the ground (s)?`,t,`h = ½gt², so t = √(2h/g) = √(${2*h}/10) = ${t} s`]:[`A stone is dropped from a height of ${h} m (g = 10 m/s²). Speed on hitting the ground (m/s)?`,10*t,`t = √(2h/g) = ${t} s, so v = gt = 10×${t} = ${10*t} m/s`]}],
["Current electricity",r=>{const i=R(r,1,20),x=R(r,2,50),v=i*x;return[`A ${v} V battery is connected across a ${x} Ω resistor. Current (A)?`,i,`I = V/R = ${v}/${x} = ${i} A`]}],
["Current electricity",r=>{const p=P(r,[[6,3,2],[12,4,3],[20,5,4],[30,15,10],[12,6,4],[10,10,5],[6,6,3],[15,10,6],[20,30,12],[8,8,4]]),k=R(r,1,10);return[`Resistors of ${p[0]*k} Ω and ${p[1]*k} Ω are connected in parallel. Equivalent resistance (Ω)?`,p[2]*k,`R = R₁R₂/(R₁+R₂) = ${p[0]*k}×${p[1]*k}/${(p[0]+p[1])*k} = ${p[2]*k} Ω`]}],
["Current electricity",r=>{const a=R(r,1,50),b=R(r,1,50),c=R(r,1,50);return[`Resistors of ${a} Ω, ${b} Ω and ${c} Ω are connected in series. Equivalent resistance (Ω)?`,a+b+c,`R = R₁ + R₂ + R₃ = ${a} + ${b} + ${c} = ${a+b+c} Ω`]}],
["Work and energy",r=>{const m=R(r,1,30),v=R(r,1,40),k=m*v*v/2;return[`A ${m} kg mass moves at ${v} m/s. Kinetic energy (J)?`,k,`KE = ½mv² = ½×${m}×${v}² = ${fmt(k)} J`]}],
["Momentum",r=>{const m=R(r,1,9),k=R(r,1,5),c=R(r,1,12),b=m*k,v=(1+k)*c;return[`A ${m} kg block moving at ${v} m/s sticks to a ${b} kg block at rest. Common speed after impact (m/s)?`,c,`Momentum is conserved: ${m}×${v} = ${m+b}×v, so v = ${c} m/s`]}],
["Motion under gravity",r=>{const u=R(r,5,100),h=u*u/20;return[`A ball is thrown vertically upward at ${u} m/s (g = 10 m/s²). Maximum height (m)?`,h,`H = u²/2g = ${u*u}/20 = ${fmt(h)} m`]}],
["Waves",r=>{const f=R(r,1,100),l=R(r,1,50);return[`A wave has frequency ${f} Hz and wavelength ${l} m. Wave speed (m/s)?`,f*l,`v = fλ = ${f}×${l} = ${f*l} m/s`]}],
["Power",r=>{const p=R(r,1,100),t=R(r,1,30),w=p*t;return[`A machine does ${w} J of work in ${t} s. Power (W)?`,p,`P = W/t = ${w}/${t} = ${p} W`]}],
["Circular motion",r=>{const m=R(r,1,10),v=R(r,1,30),x=P(r,[1,2,4,5,10,20]),f=m*v*v/x;return[`A ${m} kg body moves in a circle of radius ${x} m at ${v} m/s. Centripetal force (N)?`,f,`F = mv²/r = ${m}×${v*v}/${x} = ${fmt(f)} N`]}],
["Heat",r=>{const m=R(r,1,200),d=R(r,1,80);return[`Heat needed to raise ${m} g of a liquid by ${d} °C if its specific heat is 4 J/g°C (J)?`,4*m*d,`Q = mcΔT = ${m}×4×${d} = ${4*m*d} J`]}],
["Ray optics",r=>{const f=2*R(r,1,40),k=P(r,[2,3]),u=k*f,v=u*f/(u-f);return[`An object is placed ${u} cm from a convex lens of focal length ${f} cm. Image distance (cm)?`,v,`1/v = 1/f − 1/u gives v = uf/(u−f) = ${u}×${f}/${u-f} = ${fmt(v)} cm`]}],
["Newton’s laws",r=>{const m=R(r,1,50),a=R(r,1,30);return[`A ${m} kg body accelerates at ${a} m/s². Net force (N)?`,m*a,`F = ma = ${m}×${a} = ${m*a} N`]}],
["Work and energy",r=>{const m=R(r,1,50),h=R(r,1,100);return[`Potential energy (J) of a ${m} kg mass raised ${h} m (g = 10 m/s²)?`,10*m*h,`PE = mgh = ${m}×10×${h} = ${10*m*h} J`]}]],
Chemistry:[
["Mole concept",r=>{const c=P(r,CMP),n=R(r,1,200)/4;return[`${fmt(n*c[1])} g of ${c[0]} (molar mass ${c[1]} g/mol). Number of moles?`,n,`n = m/M = ${fmt(n*c[1])}/${c[1]} = ${n} mol`]}],
["Mole concept",r=>{const c=P(r,CMP),n=R(r,1,200)/4;return[`Mass (g) of ${n} mol of ${c[0]} (molar mass ${c[1]} g/mol)?`,n*c[1],`m = n×M = ${n}×${c[1]} = ${fmt(n*c[1])} g`]}],
["Solutions",r=>{const m=R(r,1,60)/20,v=250*R(r,1,8),g=m*v*.04;return[`${fmt(g)} g of NaOH (molar mass 40 g/mol) is dissolved to make ${v} mL of solution. Molarity (M)?`,m,`n = ${fmt(g)}/40 = ${fmt(g/40)} mol; M = n/V(L) = ${fmt(g/40)}/${v/1000} = ${m} M`]}],
["Ionic equilibrium",r=>{const n=R(r,1,6);return r()<.5?[`pH of 10${sup(-n)} M HCl (strong acid)?`,n,`pH = −log[H⁺] = ${n}`]:[`pH of 10${sup(-n)} M NaOH (strong base) at 25 °C?`,14-n,`pOH = ${n}, so pH = 14 − ${n} = ${14-n}`]}],
["Gaseous state",r=>{const c=P(r,[["CO₂",44],["NH₃",17],["CH₄",16],["O₂",32]]),n=R(r,1,40)/4;return[`Volume (L) at STP of ${fmt(n*c[1])} g of ${c[0]} (molar mass ${c[1]} g/mol; 1 mol = 22.4 L)?`,n*22.4,`n = ${n} mol, so V = ${n}×22.4 = ${fmt(n*22.4)} L`]}],
["Solutions",r=>{const m=R(r,1,40),k=P(r,[2,4,5,10]),v=R(r,1,5)*50;return[`${v} mL of a ${m} M solution is diluted to ${v*k} mL. New molarity (M)?`,m/k,`M₁V₁ = M₂V₂, so M₂ = ${m}×${v}/${v*k} = ${fmt(m/k)} M`]}],
["Atomic structure",r=>{const z=R(r,3,90),q=P(r,[-3,-2,-1,1,2,3]);return[`An atom of atomic number ${z} becomes an ion with charge ${q>0?"+":"−"}${Math.abs(q)}. Number of electrons in the ion?`,z-q,`Electrons = ${z} ${q>0?"−":"+"} ${Math.abs(q)} = ${z-q}`]}],
["Atomic structure",r=>{const z=R(r,3,90),a=2*z+R(r,0,12);return[`An isotope has atomic number ${z} and mass number ${a}. Number of neutrons?`,a-z,`Neutrons = A − Z = ${a} − ${z} = ${a-z}`]}],
["Mole concept",r=>{const c=P(r,[["CH₄","C",3,4],["CaCO₃","Ca",2,5],["CO₂","C",3,11],["H₂O","H",1,9],["SO₂","S",1,2],["NaOH","Na",23,40],["MgO","Mg",3,5],["Fe₂O₃","Fe",7,10]]),k=R(r,1,40);return[`Mass of ${c[1]} (g) in ${c[3]*k} g of ${c[0]}?`,c[2]*k,`${c[1]} makes up ${c[2]}/${c[3]} of ${c[0]} by mass: ${c[3]*k}×${c[2]}/${c[3]} = ${c[2]*k} g`]}],
["Gaseous state",r=>{const p1=R(r,1,10);let p2=R(r,1,10);while(p2===p1)p2=R(r,1,10);const k=R(r,1,10),v1=p2*k,v2=p1*k;return[`A gas at ${p1} atm occupies ${v1} L. At constant temperature, its volume (L) at ${p2} atm?`,v2,`P₁V₁ = P₂V₂, so V₂ = ${p1}×${v1}/${p2} = ${fmt(p1*v1/p2)} L`]}],
["Stoichiometry",r=>{const x=P(r,[["N₂ + 3H₂ → 2NH₃","N₂","NH₃",2],["2H₂ + O₂ → 2H₂O","O₂","H₂O",2],["CH₄ + 2O₂ → CO₂ + 2H₂O","CH₄","H₂O",2],["2Mg + O₂ → 2MgO","O₂","MgO",2],["C₃H₈ + 5O₂ → 3CO₂ + 4H₂O","C₃H₈","CO₂",3],["2KClO₃ → 2KCl + 3O₂","KClO₃","O₂",1.5]]),n=R(r,1,80)/4;return[`${x[0]}. Moles of ${x[2]} formed from ${n} mol of ${x[1]} (other reagents in excess)?`,x[3]*n,`Mole ratio ${x[1]} : ${x[2]} = 1 : ${x[3]}, so moles = ${x[3]}×${n} = ${fmt(x[3]*n)}`]}],
["Solutions",r=>{const c=P(r,[["H₂SO₄",2],["HCl",1],["H₃PO₄",3],["NaOH",1],["Ca(OH)₂",2],["Al(OH)₃",3]]),m=R(r,1,80)/20;return[`Normality of a ${m} M solution of ${c[0]} (n-factor ${c[1]})?`,m*c[1],`N = M × n-factor = ${m}×${c[1]} = ${fmt(m*c[1])} N`]}],
["Solutions",r=>{const a=R(r,1,9),b=R(r,1,9);return[`A mixture has ${a} mol of A and ${b} mol of B. Mole fraction of A (2 decimals)?`,a/(a+b),`x(A) = ${a}/(${a}+${b}) = ${fmt(a/(a+b))}`]}],
["Mole concept",r=>{const c=P(r,[["H₂O",3],["CO₂",3],["NH₃",4],["CH₄",5],["H₂SO₄",7],["O₂",2],["NaOH",3],["CaCO₃",5]]),n=R(r,1,40)/4;return[`Total number of atoms (in units of Nₐ) in ${n} mol of ${c[0]}?`,n*c[1],`Each molecule has ${c[1]} atoms: ${n}×${c[1]} = ${fmt(n*c[1])} Nₐ`]}],
["Nuclear chemistry",r=>{const m=R(r,1,60),h=R(r,1,6),T=R(r,1,30),n0=m*2**h,t=h*T;return[`A sample has ${n0} atoms of a radioisotope with half-life ${T} h. How many atoms remain after ${t} h?`,m,`${t}/${T} = ${h} half-lives, so N = ${n0}/2${sup(h)} = ${m}`]}],
["Solutions",r=>{const m=R(r,1,40)/4,k=R(r,1,10),g=m*k*40;return[`${fmt(g)} g of NaOH (40 g/mol) is dissolved in ${k} kg of water. Molality (mol/kg)?`,m,`n = ${fmt(g)}/40 = ${fmt(m*k)} mol; molality = ${fmt(m*k)}/${k} = ${m}`]}],
["Thermodynamics",r=>{const x=R(r,10,500),y=R(r,10,500);return[`Two steps of a reaction have ΔH₁ = −${x} kJ and ΔH₂ = −${y} kJ. Overall ΔH (kJ)?`,-(x+y),`ΔH = ΔH₁ + ΔH₂ = −${x} + (−${y}) = −${x+y} kJ`]}],
["Solutions",r=>{const m=R(r,1,100)/10,i=P(r,[1,2,3]);return[`A solute giving ${i} particle(s) per formula unit is dissolved in water at ${m} molal (Kb = 0.5 K kg/mol). Boiling point elevation (K)?`,.5*i*m,`ΔTb = i·Kb·m = ${i}×0.5×${m} = ${fmt(.5*i*m)} K`]}],
["Gaseous state",r=>{const t=50*R(r,2,8),k=R(r,2,4),v=R(r,1,20);return[`A gas occupies ${v} L at ${t} K. At constant pressure, its volume (L) at ${t*k} K?`,v*k,`V₁/T₁ = V₂/T₂, so V₂ = ${v}×${t*k}/${t} = ${v*k} L`]}]],
Maths:[
["Quadratic equations",r=>{const p=R(r,1,30),q=R(r,1,30);return[`Find the sum of the squares of the roots of x² − ${p+q}x + ${p*q} = 0.`,p*p+q*q,`Roots are ${p} and ${q}: ${p}² + ${q}² = ${p*p+q*q}`]}],
["Sequences and series",r=>{const a=R(r,1,50),d=R(r,1,20),n=R(r,5,50);return[`Find the ${ord(n)} term of the AP ${a}, ${a+d}, ${a+2*d}, …`,a+(n-1)*d,`aₙ = a + (n−1)d = ${a} + ${n-1}×${d} = ${a+(n-1)*d}`]}],
["Sequences and series",r=>{const a=R(r,1,30),d=R(r,1,15),n=R(r,5,40),s=n*(2*a+(n-1)*d)/2;return[`Sum of the first ${n} terms of the AP with first term ${a} and common difference ${d}?`,s,`Sₙ = n/2 [2a + (n−1)d] = ${n}/2 × ${2*a+(n-1)*d} = ${s}`]}],
["Sequences and series",r=>{const a=R(r,1,9),q=R(r,2,4),n=R(r,3,8);return[`Find the ${ord(n)} term of the GP ${a}, ${a*q}, ${a*q*q}, …`,a*q**(n-1),`aₙ = a·r^(n−1) = ${a}×${q}${sup(n-1)} = ${a*q**(n-1)}`]}],
["Permutations and combinations",r=>{const n=R(r,5,20),k=R(r,2,6);return[`Find the value of ${n}C${k}.`,nCr(n,k),`nCr = n!/(r!(n−r)!) = ${nCr(n,k)}`]}],
["Differentiation",r=>{const a=R(r,1,9),n=R(r,2,5),b=R(r,1,20),c=R(r,1,5),v=a*n*c**(n-1)+b;return[`If f(x) = ${a}x${sup(n)} + ${b}x, find f′(${c}).`,v,`f′(x) = ${a*n}x${sup(n-1)} + ${b}, so f′(${c}) = ${v}`]}],
["Integration",r=>{const m=R(r,1,9),x=R(r,1,9),k=R(r,1,4),v=m*k**3+x*k*k;return[`Evaluate the integral of (${3*m}x² + ${2*x}x) dx from 0 to ${k}.`,v,`Antiderivative = ${m}x³ + ${x}x²; at ${k}: ${m}×${k**3} + ${x}×${k*k} = ${v}`]}],
["Matrices and determinants",r=>{const a=R(r,1,20),b=R(r,1,20),c=R(r,1,20),d=R(r,1,20);return[`Value of the determinant with rows (${a}, ${b}) and (${c}, ${d})?`,a*d-b*c,`ad − bc = ${a}×${d} − ${b}×${c} = ${a*d-b*c}`]}],
["Coordinate geometry",r=>{const t=P(r,TRI),x=R(r,0,20),y=R(r,0,20);return[`Distance between the points (${x}, ${y}) and (${x+t[0]}, ${y+t[1]})?`,t[2],`d = √(${t[0]}² + ${t[1]}²) = √${t[0]**2+t[1]**2} = ${t[2]}`]}],
["Limits",r=>{const a=R(r,1,50);return r()<.5?[`Find the limit as x → ${a} of (x² − ${a*a})/(x − ${a}).`,2*a,`(x² − a²)/(x − a) = x + a, so the limit is ${2*a}`]:[`Find the limit as x → ${a} of (x³ − ${a**3})/(x − ${a}).`,3*a*a,`(x³ − a³)/(x − a) = x² + ax + a², so the limit is 3×${a}² = ${3*a*a}`]}],
["Complex numbers",r=>{const t=P(r,TRI),k=R(r,1,10);return[`Find the modulus of the complex number ${t[0]*k} + ${t[1]*k}i.`,t[2]*k,`|z| = √(${t[0]*k}² + ${t[1]*k}²) = ${t[2]*k}`]}],
["Sequences and series",r=>{const n=R(r,3,60),w=r();return w<.4?[`Find 1 + 2 + 3 + … + ${n}.`,n*(n+1)/2,`n(n+1)/2 = ${n}×${n+1}/2 = ${n*(n+1)/2}`]:w<.75?[`Find 1² + 2² + 3² + … + ${n}².`,n*(n+1)*(2*n+1)/6,`n(n+1)(2n+1)/6 = ${n}×${n+1}×${2*n+1}/6 = ${n*(n+1)*(2*n+1)/6}`]:[`Find 1³ + 2³ + 3³ + … + ${n}³.`,(n*(n+1)/2)**2,`(n(n+1)/2)² = ${n*(n+1)/2}² = ${(n*(n+1)/2)**2}`]}],
["Vectors",r=>{const a=R(r,1,9),b=R(r,1,9),c=R(r,1,9),d=R(r,1,9),e=R(r,1,9),f=R(r,1,9);return[`Find the dot product of the vectors (${a}, ${b}, ${c}) and (${d}, ${e}, ${f}).`,a*d+b*e+c*f,`a·b = ${a}×${d} + ${b}×${e} + ${c}×${f} = ${a*d+b*e+c*f}`]}],
["Coordinate geometry",r=>{const s=R(r,1,9),dx=R(r,1,9),x=R(r,0,20),y=R(r,0,20);return[`Slope of the line through (${x}, ${y}) and (${x+dx}, ${y+s*dx})?`,s,`m = (y₂ − y₁)/(x₂ − x₁) = ${s*dx}/${dx} = ${s}`]}],
["Coordinate geometry",r=>{const a=R(r,1,40),b=R(r,1,40);return[`Area of the triangle with vertices (0, 0), (${a}, 0) and (0, ${b})?`,a*b/2,`Area = ½ × base × height = ½×${a}×${b} = ${fmt(a*b/2)}`]}]]};
const CAP=1600,N=10000;
function make(subj,ti,seed){const r=rng(seed*7919+ti*104729+subj.length*131+7),[,f]=G[subj][ti],[q,a,e]=f(r);
const c=[a+1,a-1,a+2,a-2,a*2,a/2,a+3,a-3,a*1.5,a+5,a+10,a*3,a+7,a-5].filter(v=>(v>0||a<=0)&&fmt(v)!==fmt(a)),d=[];
for(const v of shuf(r,c)){if(!d.some(x=>fmt(x)===fmt(v)))d.push(v);if(d.length==3)break}
const o=shuf(r,[a,...d]).map(fmt);return[q,o,o.indexOf(fmt(a)),e,ti]}
function build(subj){const per=G[subj].map((_,ti)=>{const seen=new Set(),out=[];for(let s=0;s<CAP*40&&out.length<CAP;s++){const x=make(subj,ti,s);if(!seen.has(x[0])){seen.add(x[0]);out.push(x)}}return out});
const seenAll=new Set(),pick=[];for(let i=0;pick.length<N;i++){let any=false;for(const l of per){if(i<l.length){any=true;if(pick.length<N&&!seenAll.has(l[i][0])){seenAll.add(l[i][0]);pick.push(l[i])}}}if(!any)break}
pick.sort((a,b)=>a[4]-b[4]);return pick}
module.exports={build,G,R,P,fmt,sup,shuf,rng,TRI,nCr,ord,CMP};
if(require.main===module){const dir=path.join(__dirname,"..","www","data");fs.mkdirSync(dir,{recursive:true});
for(const s of Object.keys(G)){const b=build(s),bad=b.filter(x=>/NaN|undefined|Infinity/.test(x[0]+x[1]+x[3])||new Set(x[1]).size!==4||x[2]<0).length;
fs.writeFileSync(path.join(dir,s.toLowerCase()+".json"),JSON.stringify({topics:G[s].map(t=>t[0]),q:b}));console.log(s,b.length,"bad",bad)}}
