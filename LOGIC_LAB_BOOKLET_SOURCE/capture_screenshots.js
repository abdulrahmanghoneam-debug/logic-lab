const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'assets', 'screenshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_shot_prof');
fs.mkdirSync(USER_DATA, { recursive: true });

const wait = ms => new Promise(r => setTimeout(r, ms));

async function getWsUrl(port) {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await new Promise((res, rej) => {
        http.get(`http://127.0.0.1:${port}/json/list`, r => {
          let b = ''; r.on('data', d => b += d); r.on('end', () => { try { res(JSON.parse(b)); } catch (e) { rej(e); } });
        }).on('error', rej);
      });
      const page = list.find(t => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (_) {}
    await wait(250);
  }
  throw new Error('CDP timeout');
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
  const port = 9249;
  const chrome = spawn(CHROME, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${USER_DATA}`,
    '--headless=new',
    '--enable-webgl',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    'about:blank'
  ], { stdio: 'ignore' });

  try {
    const wsUrl = await getWsUrl(port);
    const cdp = await connectCDP(wsUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    const evalJS = async expr => {
      const r = await cdp.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      return r.result ? r.result.value : null;
    };
    const shot = async (name) => {
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUT_DIR, name), Buffer.from(data, 'base64'));
      console.log('CAPTURED:', name);
    };

    // High-DPI 2x captures at crisp composition sizes
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1360, height: 820, deviceScaleFactor: 2, mobile: false });
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/' });
    await wait(3200);
    await shot('01_showcase_3d.png');

    // Close intro to full lab
    await evalJS(`closeIntro('home');`);
    await wait(500);
    await shot('02_home_hub.png');

    // Proposition Builder (AST Parse Tree)
    await evalJS(`switchTab('builder'); syncGlobalExpression('(P ∧ ¬Q) → R'); renderBuilderModule();`);
    await wait(400);
    await shot('03_proposition_builder.png');

    // Truth Table Generator with matching formula + Equivalence Comparison
    await evalJS(`switchTab('truthtable'); document.getElementById('expr-input').value = '(P ∧ ¬Q) → R'; renderTruthTableModule(); document.getElementById('eq-expr-a').value = '¬(P ∧ Q)'; document.getElementById('eq-expr-b').value = '¬P ∨ ¬Q'; runEquivalenceCheck();`);
    await wait(450);
    await shot('04_truth_table.png');

    // Logic Gates Simulator
    await evalJS(`switchTab('circuits'); syncGlobalExpression('(P ⊕ Q) ∧ ¬R'); AppState.circuitInputs = { P: true, Q: false, R: false, S: false }; renderCircuitsModule();`);
    await wait(450);
    await shot('05_logic_gates.png');

    // Boolean Algebra Lab
    await evalJS(`switchTab('boolean'); document.getElementById('bool-input').value = '(P ∧ Q) ∨ (P ∧ ¬Q)'; runBooleanSimplifier();`);
    await wait(450);
    await shot('06_boolean_lab.png');

    // Expression Conversion Studio
    await evalJS(`switchTab('converter'); AppState.convVars = 2; AppState.convOutputs = [false, true, true, false]; renderConverterModule();`);
    await wait(400);
    await shot('07_converter_studio.png');

    // Unified Playground + Assistant question without auto-tab navigation
    await evalJS(`switchTab('playground'); syncGlobalExpression('(P ∧ ¬Q) ∨ (P ∧ Q)'); renderPlaygroundModule(); handleAssistantQuery('Why is the final column false?', false); setTimeout(() => switchTab('playground'), 50);`);
    await wait(550);
    await evalJS(`switchTab('playground'); renderPlaygroundModule();`);
    await wait(250);
    await shot('08_unified_playground.png');

    // Live Challenges Arena
    await evalJS(`switchTab('challenge'); loadNewChallenge(); revealChallengeSolution(null);`);
    await wait(450);
    await shot('11_challenges.png');

    // Story Mode Chapter 4 Arabic (1280x720 @2x)
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 2, mobile: false });
    await evalJS(`StoryState.lang = 'ar'; StoryState.chosenOp = 'IMPLIES'; openFocusedStage(3);`);
    await wait(500);
    await shot('09_story_ch4_ar.png');

    // Presentation Mode
    await evalJS(`closeFocusedStage('home'); openPresentationMode(); AppState.presentationIndex = 2; renderPresentationSlide();`);
    await wait(450);
    await shot('10_presentation_mode.png');

    console.log('ALL_SCREENSHOTS_COMPLETE');
  } finally {
    chrome.kill();
  }
})();
