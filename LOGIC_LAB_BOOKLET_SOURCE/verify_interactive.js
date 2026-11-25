const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const clean = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(ROOT, clean === '/' ? 'LOGIC_LAB_INTERACTIVE_EDITION.html' : clean);
  if (fs.existsSync(f) && fs.statSync(f).isFile()) {
    const ext = path.extname(f);
    res.writeHead(200, { 'Content-Type': ext === '.html' ? 'text/html; charset=utf-8' : (ext === '.png' ? 'image/png' : 'application/octet-stream') });
    fs.createReadStream(f).pipe(res);
  } else { res.writeHead(404); res.end('404'); }
});

server.listen(3492, '127.0.0.1', async () => {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--remote-debugging-port=9254',
    '--user-data-dir=' + path.join(__dirname, '.chrome_int_prof'),
    '--headless=new', 'about:blank'
  ], { stdio: 'ignore' });
  try {
    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
      try {
        const list = await new Promise((r, j) => http.get('http://127.0.0.1:9254/json/list', res => { let b=''; res.on('data', d=>b+=d); res.on('end', ()=>r(JSON.parse(b))); }).on('error', j));
        if (list.find(t=>t.type==='page')) { wsUrl = list.find(t=>t.type==='page').webSocketDebuggerUrl; break; }
      } catch(_) {}
      await new Promise(r => setTimeout(r, 250));
    }
    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);
    let nid = 1; const pend = new Map(), errs = [];
    ws.onmessage = e => {
      const m = JSON.parse(e.data);
      if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); p.res(m.result); }
      else if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails?.text);
    };
    const send = (method, params={}) => new Promise(res => { const id = nid++; pend.set(id, { res }); ws.send(JSON.stringify({ id, method, params })); });
    await send('Page.enable'); await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: 'http://127.0.0.1:3492/' });
    for (let t = 0; t < 20; t++) {
      await new Promise(r => setTimeout(r, 350));
      const rdy = await send('Runtime.evaluate', { expression: `document.querySelectorAll('#spread-stage .sheet').length`, returnByValue: true });
      if (rdy?.result?.value > 0) break;
    }
    await send('Runtime.evaluate', { expression: `document.getElementById('btn-mode').click(); document.getElementById('btn-next').click(); document.getElementById('live-expr-inp').value = '(P ∧ Q) ∨ (P ∧ ¬Q)'; document.getElementById('live-eval-btn').click();` });
    await new Promise(r => setTimeout(r, 400));
    const check = await send('Runtime.evaluate', { expression: `({ sheetsInSpread: document.querySelectorAll('#spread-stage .sheet').length, readout: document.getElementById('page-readout').textContent, rows: document.querySelectorAll('#live-tt tbody tr').length, summary: document.getElementById('live-summary').innerText })`, returnByValue: true });
    console.log('INTERACTIVE_CHECK:', JSON.stringify(check.result.value), 'ERRORS:', JSON.stringify(errs));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'pdf_renders', 'interactive_spread_preview.png'), Buffer.from(shot.data, 'base64'));
  } finally { chrome.kill(); server.close(); }
});
