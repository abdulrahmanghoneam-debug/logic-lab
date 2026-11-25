import os, fitz

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
RENDER_DIR = os.path.join(os.path.dirname(__file__), 'pdf_renders')
os.makedirs(RENDER_DIR, exist_ok=True)

def audit_pdf(name, export_pages=False):
    path = os.path.join(ROOT, name)
    doc = fitz.open(path)
    print(f"\n=== AUDIT: {name} ===")
    print(f"Pages: {len(doc)} | File bytes: {os.path.getsize(path)}")
    fonts_seen = set()
    link_count = 0
    empty_pages = []
    for i, page in enumerate(doc):
        r = page.rect
        w_mm = round(r.width * 25.4 / 72.0, 1)
        h_mm = round(r.height * 25.4 / 72.0, 1)
        if i == 0 or i == 1:
            print(f"  P{i+1:02d} size: {w_mm} x {h_mm} mm")
        for f in page.get_fonts(full=True):
            fonts_seen.add(f[3])
        links = page.get_links()
        link_count += len(links)
        txt = page.get_text().strip()
        if not txt and i != 0:
            empty_pages.append(i+1)
        if export_pages:
            pix = page.get_pixmap(dpi=150)
            pix.save(os.path.join(RENDER_DIR, f"{name[:-4]}_p{i+1:02d}.png"))
    print(f"  Embedded font names: {sorted(fonts_seen)}")
    print(f"  Clickable links inside PDF: {link_count}")
    print(f"  Blank/textless pages (excluding P01 cover if SVG-only): {empty_pages}")
    if name == 'LOGIC_LAB_DIGITAL_EDITION.pdf':
        p3_links = doc[2].get_links() if len(doc) > 2 else []
        print(f"  P03 TOC links count: {len(p3_links)}")
        if p3_links:
            print(f"  Sample P03 link: kind={p3_links[0].get('kind')} page={p3_links[0].get('page')}")
    doc.close()

audit_pdf('LOGIC_LAB_COLLECTORS_EDITION.pdf', export_pages=True)
audit_pdf('LOGIC_LAB_DIGITAL_EDITION.pdf', export_pages=False)
audit_pdf('LOGIC_LAB_COVER.pdf', export_pages=True)
print('\nRENDERING COMPLETE ->', RENDER_DIR)
