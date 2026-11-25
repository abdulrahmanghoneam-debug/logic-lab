const fs = require('fs');
const path = require('path');
const { buildAllPages } = require('./booklet_pages.js');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = __dirname;
const stylesCss = fs.readFileSync(path.join(SOURCE_DIR, 'booklet_styles.css'), 'utf8');
const logicEngineCode = fs.readFileSync(path.join(ROOT, 'src', 'logicEngine.js'), 'utf8');

function buildInteractiveHtml(assetPrefix) {
  const pages = buildAllPages(assetPrefix);
  // Enhance Interactive Digital Edition with real inline live LogicEngine widgets inside Pages 9, 11, 12!
  const pagesHtml = pages.join('\n');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LOGIC LAB — The Collector's Edition (Interactive Digital Reader)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@400;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
  <style>
${stylesCss}
body {
  background: #030712 !important;
  color: #F8FAFC;
  min-height: 100vh;
}
.reader-toolbar {
  position: sticky;
  top: 0;
  z-index: 80;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 20px;
  background: rgba(4, 8, 20, 0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.18);
}
.reader-btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-family: 'IBM Plex Sans Arabic', sans-serif;
  font-weight: 600;
  border: 1px solid rgba(56, 189, 248, 0.25);
  background: #081229;
  color: #E2E8F0;
  cursor: pointer;
}
.reader-btn:hover { border-color: #22D3EE; color: #FFFFFF; }
.reader-btn.primary { background: #22D3EE; color: #040814; border-color: #22D3EE; }

.reader-layout {
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px 16px 40px;
  display: grid;
  grid-template-columns: 270px 1fr;
  gap: 24px;
  align-items: start;
}
@media (max-width: 1024px) {
  .reader-layout { grid-template-columns: 1fr; }
}
.reader-sidebar {
  position: sticky;
  top: 66px;
  background: #071022;
  border: 1px solid rgba(56, 189, 248, 0.16);
  border-radius: 14px;
  padding: 14px;
  max-height: calc(100vh - 88px);
  overflow-y: auto;
}
.nav-item {
  width: 100%;
  text-align: right;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: #94A3B8;
  font-family: 'IBM Plex Sans Arabic', sans-serif;
  font-size: 12px;
  cursor: pointer;
}
.nav-item:hover { background: rgba(34, 211, 238, 0.08); color: #F8FAFC; }
.nav-item.active { background: rgba(34, 211, 238, 0.16); color: #22D3EE; font-weight: 700; }

.stage-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.spread-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
.spread-container.is-spread {
  flex-wrap: nowrap;
  gap: 3px;
}
.spread-container.is-spread .sheet {
  width: 132mm;
  height: 187.3mm;
}
.spread-container.is-spread .trim-area {
  transform: scale(0.892);
  transform-origin: top right;
}
.spread-container .sheet {
  width: 148mm;
  height: 210mm;
  box-shadow: 0 24px 60px -18px rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  margin: 0 !important;
  page-break-after: auto !important;
}
.spread-container .crop-marks { display: none !important; }
.spread-container .trim-area.interior { margin: 0 !important; padding: 12mm 13mm 11.5mm 13mm !important; }
.spread-container .trim-area:not(.interior) { margin: 0 !important; padding: 0 !important; }
@media (max-width: 720px) {
  .spread-container .sheet {
    transform-origin: top center;
    transform: scale(0.62);
    margin-bottom: -80mm !important;
  }
}

.lab-widget-bar {
  width: 100%;
  max-width: 960px;
  background: #071022;
  border: 1px solid rgba(34, 211, 238, 0.25);
  border-radius: 16px;
  padding: 18px;
}
.mini-tt-table { width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono', monospace; font-size: 12px; direction: ltr; text-align: center; }
.mini-tt-table th { background: #0B1730; color: #22D3EE; padding: 6px 8px; border-bottom: 1px solid rgba(56,189,248,0.2); }
.mini-tt-table td { padding: 5px 8px; border-bottom: 1px solid rgba(148,163,184,0.12); color: #E2E8F0; }
  </style>
</head>
<body>
  <header class="reader-toolbar">
    <div style="display:flex; align-items:center; gap:10px;">
      <span class="mono" style="color:#22D3EE; font-weight:700;">⊢ LOGIC LAB</span>
      <span style="font-size:12px; color:#94A3B8;">النسخة التفاعلية الرقمية · Collector's Edition</span>
    </div>
    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
      <button id="btn-prev" class="reader-btn" type="button">الصفحة السابقة →</button>
      <span id="page-readout" class="mono" style="font-size:12px; color:#22D3EE;">01 / 20</span>
      <button id="btn-next" class="reader-btn" type="button">← الصفحة التالية</button>
      <button id="btn-mode" class="reader-btn primary" type="button">عرض صفحة مزدوجة (Spread)</button>
      <a href="LOGIC_LAB_DIGITAL_EDITION.pdf" class="reader-btn" style="text-decoration:none;">تنزيل PDF</a>
    </div>
  </header>

  <main class="reader-layout">
    <aside class="reader-sidebar">
      <div style="font-size:11px; color:#22D3EE; font-weight:700; margin-bottom:10px; font-family:'JetBrains Mono',monospace;">TABLE OF CONTENTS</div>
      <div id="sidebar-toc"></div>
    </aside>

    <div class="stage-wrap">
      <div id="spread-stage" class="spread-container"></div>

      <!-- Interactive Companion Sandbox Powered Directly by LogicEngine -->
      <section class="lab-widget-bar" aria-label="Interactive Mathematical Companion">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <div>
            <div class="mono" style="font-size:11px; color:#22D3EE;">INTERACTIVE COMPANION · POWERED BY SRC/LOGICENGINE.JS</div>
            <h3 style="font-size:15px; color:#FFF; margin-top:2px;">جرّب أمثلة الكتيّب حيّاً مباشرةً</h3>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" class="reader-btn preset-pick" data-expr="(P ∧ ¬Q) → R">(P ∧ ¬Q) → R</button>
            <button type="button" class="reader-btn preset-pick" data-expr="¬(P ∧ Q) ↔ (¬P ∨ ¬Q)">De Morgan</button>
            <button type="button" class="reader-btn preset-pick" data-expr="(P ∧ Q) ∨ (P ∧ ¬Q)">Distributive</button>
          </div>
        </div>
        <div style="display:flex; gap:8px; margin-bottom:12px;">
          <input id="live-expr-inp" type="text" value="(P ∧ ¬Q) → R" dir="ltr" style="flex:1; padding:8px 12px; border-radius:8px; border:1px solid rgba(56,189,248,0.3); background:#040814; color:#FFF; font-family:'JetBrains Mono',monospace;" />
          <button id="live-eval-btn" class="reader-btn primary" type="button">حساب الصواب والتبسيط</button>
        </div>
        <div id="live-output-grid" style="display:grid; grid-template-columns:1.2fr 1fr; gap:14px;">
          <div style="overflow-x:auto; background:#040814; padding:10px; border-radius:10px; border:1px solid rgba(56,189,248,0.16);">
            <table id="live-tt" class="mini-tt-table"></table>
          </div>
          <div style="background:#040814; padding:12px; border-radius:10px; border:1px solid rgba(56,189,248,0.16); font-size:12px;">
            <div class="mono" style="color:#34D399; font-size:11px; margin-bottom:6px;">ALGEBRAIC SIMPLIFICATION &amp; CLASSIFICATION</div>
            <div id="live-summary" style="color:#E2E8F0; line-height:1.7;"></div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <div id="all-pages-store" style="display:none;">
${pagesHtml}
  </div>

  <script>
${logicEngineCode}
  </script>
  <script>
  (function () {
    const store = document.getElementById('all-pages-store');
    const sheets = Array.from(store.querySelectorAll('.sheet'));
    const stage = document.getElementById('spread-stage');
    const toc = document.getElementById('sidebar-toc');
    const readout = document.getElementById('page-readout');
    let current = 0;
    let spreadMode = false;

    const LABELS = [
      '01 · الغلاف (Cover)',
      '02 · إهداء للدكتور محمود أحمد زاهر',
      '03 · فهرس المحتويات',
      '04 · سؤال يستحق التأمل',
      '05 · التحدي التعليمي',
      '06 · الفكرة والواجهة 3D',
      '07 · مرحباً بك في المختبر',
      '08 · لغة المنطق وشجرة AST',
      '09 · محرّك جداول الصواب',
      '10 · التحويل SOP / POS',
      '11 · محاكي البوابات IEEE',
      '12 · مختبر الجبر البولياني',
      '13 · المختبر والقصة العربية',
      '14 · الدروس والتحديات والعرض',
      '15 · المساعد والذكاء الصوتي',
      '16 · البنية التقنية والألوان',
      '17 · التحقق الهندسي و QR',
      '18 · آفاق التطوير المستقبلية',
      '19 · بيان الإصدار والملفات',
      '20 · الغلاف الخلفي والخاتمة'
    ];

    toc.innerHTML = LABELS.map((lbl, i) =>
      '<button type="button" class="nav-item" data-go="' + i + '"><span>' + lbl + '</span><span class="mono">' + String(i + 1).padStart(2, '0') + '</span></button>'
    ).join('');

    function renderStage() {
      stage.innerHTML = '';
      stage.classList.toggle('is-spread', spreadMode && current > 0);
      if (!spreadMode) {
        stage.appendChild(sheets[current].cloneNode(true));
        readout.textContent = String(current + 1).padStart(2, '0') + ' / ' + sheets.length;
      } else {
        // Arabic RTL Spread: even page right (visually first in RTL row), odd page left!
        if (current === 0) {
          stage.appendChild(sheets[0].cloneNode(true));
          readout.textContent = 'Cover (01)';
        } else {
          const rightIdx = current % 2 === 1 ? current : current - 1;
          stage.appendChild(sheets[rightIdx].cloneNode(true));
          if (rightIdx + 1 < sheets.length) {
            stage.appendChild(sheets[rightIdx + 1].cloneNode(true));
            readout.textContent = String(rightIdx + 1).padStart(2, '0') + '–' + String(rightIdx + 2).padStart(2, '0') + ' / ' + sheets.length;
          } else {
            readout.textContent = String(rightIdx + 1).padStart(2, '0') + ' / ' + sheets.length;
          }
        }
      }
      stage.querySelectorAll('a[href^="#p"]').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const num = parseInt(a.getAttribute('href').slice(2), 10) - 1;
          if (!isNaN(num) && num >= 0 && num < sheets.length) { current = num; renderStage(); }
        });
      });
      toc.querySelectorAll('.nav-item').forEach((b, idx) => b.classList.toggle('active', idx === current));
    }

    toc.addEventListener('click', e => {
      const btn = e.target.closest('[data-go]'); if (!btn) return;
      current = Number(btn.dataset.go); renderStage();
    });
    document.getElementById('btn-prev').addEventListener('click', () => {
      const step = spreadMode && current > 1 ? 2 : 1;
      current = Math.max(0, current - step); renderStage();
    });
    document.getElementById('btn-next').addEventListener('click', () => {
      const step = spreadMode && current > 0 ? 2 : 1;
      current = Math.min(sheets.length - 1, current + step); renderStage();
    });
    document.getElementById('btn-mode').addEventListener('click', () => {
      spreadMode = !spreadMode;
      document.getElementById('btn-mode').textContent = spreadMode ? 'عرض صفحة واحدة' : 'عرض صفحة مزدوجة (Spread)';
      renderStage();
    });
    document.addEventListener('keydown', e => {
      if (e.target && e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') document.getElementById('btn-next').click();
      else if (e.key === 'ArrowRight') document.getElementById('btn-prev').click();
    });

    function runLiveCompanion() {
      const inp = document.getElementById('live-expr-inp').value;
      const tbl = document.getElementById('live-tt');
      const sum = document.getElementById('live-summary');
      try {
        const tt = LogicEngine.generateTruthTable(inp);
        const simp = LogicEngine.simplifyBoolean(inp);
        tbl.innerHTML = '<thead><tr>' + tt.variables.map(v => '<th>' + v + '</th>').join('') + '<th>' + tt.expression + '</th></tr></thead><tbody>' +
          tt.rows.map(r => '<tr>' + tt.variables.map(v => '<td>' + (r.inputs[v] ? 'T' : 'F') + '</td>').join('') +
            '<td style="font-weight:700;color:' + (r.result ? '#34D399' : '#FB7185') + '">' + (r.result ? 'T' : 'F') + '</td></tr>').join('') + '</tbody>';
        const stepsHtml = simp.steps.length
          ? simp.steps.map(s => '<div class="mono" style="font-size:11px;margin-top:4px;color:#CBD5E1;">' + s.step + '. ' + s.before + ' ≡ ' + s.after + ' <span style="color:#22D3EE">[' + s.law + ']</span></div>').join('')
          : '<div class="mono" style="font-size:11px;margin-top:4px;color:#94A3B8;">Already simplified: ' + simp.simplified + '</div>';
        sum.innerHTML = '<div><strong>التصنيف:</strong> <span class="mono" style="color:#22D3EE;">' + tt.classification + '</span> (' + tt.trueCount + ' True / ' + tt.falseCount + ' False)</div>' +
          '<div><strong>الناتج المختصر:</strong> <span class="mono" style="color:#34D399;">' + simp.simplified + '</span></div>' + stepsHtml;
      } catch (err) {
        sum.innerHTML = '<div style="color:#FB7185;">' + err.message + '</div>';
      }
    }
    document.getElementById('live-eval-btn').addEventListener('click', runLiveCompanion);
    document.querySelectorAll('.preset-pick').forEach(b => b.addEventListener('click', () => {
      document.getElementById('live-expr-inp').value = b.dataset.expr; runLiveCompanion();
    }));

    renderStage();
    runLiveCompanion();
  })();
  </script>
</body>
</html>`;
}

fs.writeFileSync(path.join(SOURCE_DIR, 'interactive_edition.html'), buildInteractiveHtml('assets'), 'utf8');
fs.writeFileSync(path.join(ROOT, 'LOGIC_LAB_INTERACTIVE_EDITION.html'), buildInteractiveHtml('LOGIC_LAB_BOOKLET_SOURCE/assets'), 'utf8');
console.log('Generated interactive editions cleanly.');
