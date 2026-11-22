# Builds solution PDFs (1,000 questions each) from www/data/*.json using DejaVu fonts.
import json, os, sys
from xml.sax.saxutils import escape
from reportlab.lib.pagesizes import A5
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, KeepTogether

FD = os.environ.get("FONT_DIR", "/usr/share/fonts/truetype/dejavu")
pdfmetrics.registerFont(TTFont("DV", os.path.join(FD, "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("DVB", os.path.join(FD, "DejaVuSans-Bold.ttf")))
pdfmetrics.registerFontFamily("DV", normal="DV", bold="DVB", italic="DV", boldItalic="DVB")
base = ParagraphStyle("b", fontName="DV", fontSize=9.6, leading=13.5, textColor=colors.HexColor("#111111"))
qs = ParagraphStyle("q", parent=base, fontSize=10.2, leading=14.5, spaceBefore=7)
opt = ParagraphStyle("o", parent=base, leftIndent=8, spaceBefore=2)
ans = ParagraphStyle("a", parent=base, leftIndent=8, textColor=colors.HexColor("#0a7a4b"), spaceBefore=2)
sol = ParagraphStyle("s", parent=base, leftIndent=8, textColor=colors.HexColor("#333333"), spaceAfter=5)
topic = ParagraphStyle("t", parent=base, fontName="DVB", fontSize=12.5, leading=16, spaceBefore=12, spaceAfter=4, textColor=colors.HexColor("#0b3fb3"))
title = ParagraphStyle("h", parent=base, fontName="DVB", fontSize=17, leading=22, spaceAfter=4, textColor=colors.HexColor("#0a2a7a"))
AB = "ABCD"
PER = 1000
out_dir = os.path.join("www", "pdfs")
os.makedirs(out_dir, exist_ok=True)
manifest = {}

def one(ename, subject, slug, vol, data, start):
    name = f"{slug}-vol{vol:02d}.pdf"
    label = f"{ename} · {subject} · Questions {start+1}–{start+len(data['q'])}"
    def deco(c, d):
        c.saveState(); c.setFont("DV", 7.5); c.setFillColor(colors.HexColor("#666666"))
        c.drawString(12*mm, 8*mm, "JEE Prep Studio · " + label)
        c.drawRightString(A5[0]-12*mm, 8*mm, str(d.page)); c.restoreState()
    doc = BaseDocTemplate(os.path.join(out_dir, name), pagesize=A5, leftMargin=12*mm, rightMargin=12*mm, topMargin=12*mm, bottomMargin=14*mm, title=label, author="JEE Prep Studio")
    doc.addPageTemplates([PageTemplate(id="p", frames=[Frame(12*mm, 14*mm, A5[0]-24*mm, A5[1]-26*mm, id="f", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)], onPage=deco)])
    st = [Paragraph(escape(label), title), Paragraph("Questions with answers and step-by-step solutions. Practice material generated from templates; not official papers and not affiliated with NTA or any IIT.", base)]
    last = -1
    for i, (q, o, ai, e, t) in enumerate(data["q"]):
        if t != last:
            st.append(Paragraph(escape(data["topics"][t]), topic)); last = t
        n = start + i + 1
        st.append(KeepTogether([
            Paragraph(f"<b>Q{n}.</b> {escape(q)}", qs),
            Paragraph("&nbsp;&nbsp;".join(f"<b>{AB[k]}.</b> {escape(x)}" for k, x in enumerate(o)), opt),
            Paragraph(f"<b>Answer:</b> {AB[ai]}. {escape(o[ai])}", ans),
            Paragraph(f"<b>Solution:</b> {escape(e)}", sol)]))
    doc.build(st)
    return name, label

for ex in json.load(open(os.path.join("www", "data", "exams.json"), encoding="utf-8")):
    manifest[ex["id"]] = {}
    for sub in ex["subs"]:
        data = json.load(open(os.path.join("www", "data", sub["file"]), encoding="utf-8"))
        qa = data["q"]; vols = []; slug = sub["file"].replace(".json", "").replace("_", "-")
        for v in range(0, len(qa), PER):
            part = {"topics": data["topics"], "q": qa[v:v+PER]}
            name, label = one(ex["name"], sub["name"], slug, v//PER + 1, part, v)
            vols.append({"file": name, "label": label}); print(name, flush=True)
        manifest[ex["id"]][sub["name"]] = vols
json.dump(manifest, open(os.path.join("www", "pdfs", "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False)
