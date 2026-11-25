const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { buildAllPages } = require('./booklet_pages.js');
const { buildLuxuryFrontCoverInner, buildLuxuryBackCoverInner } = require('./cover_design.js');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = __dirname;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(SOURCE_DIR, '.chrome_pdf_prof');
fs.mkdirSync(USER_DATA, { recursive: true });

const wait = ms => new Promise(r => setTimeout(r, ms));
const FONTS_HEAD = `
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@400;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
`;

const stylesCss = fs.readFileSync(path.join(SOURCE_DIR, 'booklet_styles.css'), 'utf8');

function buildDocumentHtml(mode) {
  const pages = buildAllPages('assets').join('\n');
  const pageRule = mode === 'digital'
    ? `@page { size: 148mm 210mm; margin: 0; }`
    : `@page { size: 154mm 216mm; margin: 0; }`;
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>LOGIC LAB — The Collector's Edition (${mode.toUpperCase()})</title>
  ${FONTS_HEAD}
  <style>
${stylesCss}
${pageRule}
  </style>
</head>
<body class="mode-${mode}">
${pages}
</body>
</html>`;
}

function buildCoverHtml() {
  const frontInner = buildLuxuryFrontCoverInner();
  const backInner = buildLuxuryBackCoverInner();
  const bleedPlateMarks = `
    <div class="crop-marks">
      <svg viewBox="0 0 154 216" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#22D3EE" stroke-width="0.28" stroke-opacity="0.72" fill="none">
          <line x1="0" y1="3" x2="2.2" y2="3"/><line x1="3" y1="0" x2="3" y2="2.2"/>
          <line x1="154" y1="3" x2="151.8" y2="3"/><line x1="151" y1="0" x2="151" y2="2.2"/>
          <line x1="0" y1="213" x2="2.2" y2="213"/><line x1="3" y1="216" x2="3" y2="213.8"/>
          <line x1="154" y1="213" x2="151.8" y2="213"/><line x1="151" y1="216" x2="151" y2="213.8"/>
        </g>
      </svg>
    </div>`;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>LOGIC LAB — Luxury Collector's Cover &amp; Back Jacket</title>
  ${FONTS_HEAD}
  <style>
${stylesCss}
.wrap-sheet {
  position: relative;
  width: 304mm; /* Back 148 + Spine Fold 2 + Front 148 + 3mm bleed L/R = 304mm */
  height: 216mm; /* 210 + 3mm bleed T/B */
  overflow: hidden;
  page-break-after: always;
  background: #020611;
  color: #F8FAFC;
}
.wrap-bg {
  position: absolute;
  inset: 0;
  background: #020611;
}
.wrap-marks {
  position: absolute;
  inset: 0;
  z-index: 30;
  pointer-events: none;
}
/* Arabic RTL Outside Wrap Lay-Flat Orientation (looking at exterior):
   LEFT side = Front Cover (148mm), CENTER = Spine fold (2mm), RIGHT side = Back Cover (148mm) */
.wrap-row {
  position: relative;
  z-index: 10;
  width: 298mm;
  height: 210mm;
  margin: 3mm auto;
  display: grid;
  grid-template-columns: 148mm 2mm 148mm;
  direction: ltr;
}
.wrap-panel {
  position: relative;
  height: 210mm;
  overflow: hidden;
  direction: rtl;
  display: flex;
  flex-direction: column;
}
.wrap-spine {
  position: relative;
  border-left: 0.16mm solid rgba(229, 193, 123, 0.22);
  border-right: 0.16mm solid rgba(229, 193, 123, 0.22);
  background: linear-gradient(180deg, #020611 0%, #07122B 50%, #020611 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 12mm 0;
}
.standalone-bleed {
  position: absolute;
  inset: -2mm;
  background: #020611;
  z-index: 0;
}
@page coverSpread { size: 304mm 216mm; margin: 0; }
@page singlePlate { size: 154mm 216mm; margin: 0; }
.wrap-sheet { page: coverSpread; }
.sheet { page: singlePlate; }
  </style>
</head>
<body class="mode-print">
  <!-- PAGE 1: Full Arabic RTL Outside Wrap Spread (Front Left · 2mm Gold-Trim Spine · Back Right) -->
  <section class="wrap-sheet">
    <div class="wrap-bg"></div>
    <div class="wrap-marks">
      <svg viewBox="0 0 304 216" style="width:100%;height:100%;" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#22D3EE" stroke-width="0.3" fill="none">
          <!-- Outer Trim Corners (3,3) .. (301,213) -->
          <line x1="0" y1="3" x2="2.2" y2="3"/><line x1="3" y1="0" x2="3" y2="2.2"/>
          <line x1="304" y1="3" x2="301.8" y2="3"/><line x1="301" y1="0" x2="301" y2="2.2"/>
          <line x1="0" y1="213" x2="2.2" y2="213"/><line x1="3" y1="216" x2="3" y2="213.8"/>
          <line x1="304" y1="213" x2="301.8" y2="213"/><line x1="301" y1="216" x2="301" y2="213.8"/>
          <!-- Center Spine Fold Ticks (151 & 153 mm) -->
          <line x1="151" y1="0" x2="151" y2="2.4" stroke="#E5C17B" stroke-dasharray="0.8 0.6"/>
          <line x1="153" y1="0" x2="153" y2="2.4" stroke="#E5C17B" stroke-dasharray="0.8 0.6"/>
          <line x1="151" y1="213.6" x2="151" y2="216" stroke="#E5C17B" stroke-dasharray="0.8 0.6"/>
          <line x1="153" y1="213.6" x2="153" y2="216" stroke="#E5C17B" stroke-dasharray="0.8 0.6"/>
        </g>
      </svg>
    </div>
    <div class="wrap-row">
      <div class="wrap-panel">${frontInner}</div>
      <div class="wrap-spine">
        <div style="width:0.25mm; flex:1; background:linear-gradient(180deg, transparent, rgba(229,193,123,0.45), rgba(34,211,238,0.45), transparent);"></div>
      </div>
      <div class="wrap-panel">${backInner}</div>
    </div>
  </section>

  <!-- PAGE 2: Standalone Luxury Front Cover Plate (154 x 216 mm incl. 3mm bleed) -->
  <section class="sheet dark-sheet" data-page="cover-front">
    <div class="standalone-bleed"></div>
    ${bleedPlateMarks}
    <div class="trim-area">${frontInner}</div>
  </section>

  <!-- PAGE 3: Standalone Luxury Back Cover Plate (154 x 216 mm incl. 3mm bleed) -->
  <section class="sheet dark-sheet" data-page="cover-back">
    <div class="standalone-bleed"></div>
    ${bleedPlateMarks}
    <div class="trim-area">${backInner}</div>
  </section>
</body>
</html>`;
}

async function getWsUrl(port) {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await new Promise((res, rej) => {
        http.get(`http://127.0.0.1:${port}/json/list`, r => {
          let b = ''; r.on('data', d => b += d); r.on('end', () => { try { res(JSON.parse(b)); } catch (e) { rej(e); } });
        }).on('error', rej);
      });
      const p = list.find(t => t.type === 'page');
      if (p && p.webSocketDebuggerUrl) return p.webSocketDebuggerUrl;
    } catch (_) {}
    await wait(250);
  }
  throw new Error('Chrome DevTools JSON did not respond');
}

function connectCDP(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 1;
    const pending = new Map();
    ws.onopen = () => resolve({ ws, send });
    ws.onerror = reject;
    ws.onmessage = ev => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        const { res, rej } = pending.get(m.id);
        pending.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      }
    };
    function send(method, params = {}) {
      return new Promise((res, rej) => {
        const mid = id++;
        pending.set(mid, { res, rej });
        ws.send(JSON.stringify({ id: mid, method, params }));
      });
    }
  });
}

(async () => {
  const printHtmlPath = path.join(SOURCE_DIR, 'print_source.html');
  const digitalHtmlPath = path.join(SOURCE_DIR, 'digital_source.html');
  const coverHtmlPath = path.join(SOURCE_DIR, 'cover_source.html');

  fs.writeFileSync(printHtmlPath, buildDocumentHtml('print'), 'utf8');
  fs.writeFileSync(digitalHtmlPath, buildDocumentHtml('digital'), 'utf8');
  fs.writeFileSync(coverHtmlPath, buildCoverHtml(), 'utf8');
  console.log('Written HTML sources.');

  // Serve LOGIC_LAB_BOOKLET_SOURCE over localhost temporarily so Google Fonts + local PNGs load cleanly
  const mimeMap = { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.css': 'text/css', '.svg': 'image/svg+xml' };
  const server = http.createServer((req, res) => {
    const cleanUrl = decodeURIComponent(req.url.split('?')[0]);
    const target = path.join(SOURCE_DIR, cleanUrl === '/' ? 'print_source.html' : cleanUrl);
    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      res.writeHead(200, { 'Content-Type': mimeMap[path.extname(target)] || 'application/octet-stream' });
      fs.createReadStream(target).pipe(res);
    } else {
      res.writeHead(404); res.end('Not found');
    }
  });
  await new Promise(res => server.listen(3491, '127.0.0.1', res));

  const port = 9251;
  const chrome = spawn(CHROME, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${USER_DATA}`,
    '--headless=new',
    '--no-first-run',
    'about:blank'
  ], { stdio: 'ignore' });

  try {
    const wsUrl = await getWsUrl(port);
    const cdp = await connectCDP(wsUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    async function renderJob(urlPath, outPdf, checkOverflow = false) {
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:3491/${urlPath}` });
      await cdp.send('Runtime.evaluate', {
        expression: `Promise.all([
          document.fonts.load('700 24px "Space Grotesk"'),
          document.fonts.load('600 12px "Manrope"'),
          document.fonts.load('400 12px "JetBrains Mono"'),
          document.fonts.load('700 12px "JetBrains Mono"'),
          document.fonts.load('400 12px "IBM Plex Sans Arabic"'),
          document.fonts.load('700 18px "IBM Plex Sans Arabic"'),
          document.fonts.ready
        ]).then(() => new Promise(r => setTimeout(r, 900)))`,
        awaitPromise: true
      });
      if (checkOverflow) {
        const overflowReport = await cdp.send('Runtime.evaluate', {
          expression: `(() => {
            const out = [];
            document.querySelectorAll('.sheet').forEach(s => {
              const t = s.querySelector('.trim-area');
              if (t && t.scrollHeight > t.clientHeight + 2) {
                out.push({ page: s.dataset.page, scrollH: t.scrollHeight, clientH: t.clientHeight });
              }
            });
            return { totalSheets: document.querySelectorAll('.sheet').length, overflows: out };
          })()`,
          returnByValue: true
        });
        console.log(`OVERFLOW_CHECK [${urlPath}]:`, JSON.stringify(overflowReport.result.value));
      }
      const { data } = await cdp.send('Page.printToPDF', {
        printBackground: true,
        preferCSSPageSize: true,
        marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
        generateDocumentOutline: true
      });
      fs.writeFileSync(path.join(ROOT, outPdf), Buffer.from(data, 'base64'));
      console.log(`GENERATED PDF: ${outPdf}`);
    }

    await renderJob('print_source.html', 'LOGIC_LAB_COLLECTORS_EDITION.pdf', true);
    await renderJob('digital_source.html', 'LOGIC_LAB_DIGITAL_EDITION.pdf', true);
    await renderJob('cover_source.html', 'LOGIC_LAB_COVER.pdf', true);
  } finally {
    chrome.kill();
    server.close();
  }
})();
