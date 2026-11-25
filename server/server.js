/**
 * LOGIC LAB — Secure Server-Side ElevenLabs Voice Proxy (Node.js / Express-free native HTTP)
 * Security: Reads ELEVENLABS_API_KEY exclusively from environment variables (.env).
 * NEVER hardcode API keys or expose them to browser JavaScript.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// Minimal .env loader (no external dependency required)
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      const k = trimmed.slice(0, eq).trim();
      const v = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const PORT = Number(process.env.PORT || 3000);
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'onwK4e9ZLuTAKqWW03F9';
const DEFAULT_AGENT_ID = process.env.ELEVENLABS_AGENT_ID || '';

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // 1. Health & Voice Capability Endpoint (never returns the API key)
  if (req.method === 'GET' && req.url === '/api/voice/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      configured: Boolean(ELEVENLABS_API_KEY),
      geminiConfigured: Boolean(GEMINI_API_KEY),
      agentConfigured: Boolean(ELEVENLABS_API_KEY && DEFAULT_AGENT_ID),
      models: { interactive: 'eleven_flash_v2_5', narration: 'eleven_multilingual_v2' }
    }));
    return;
  }

  // 2. ElevenLabs Conversational AI (ElevenAgents) Signed WebSocket URL
  if (req.method === 'GET' && req.url === '/api/voice/signed-url') {
    if (!ELEVENLABS_API_KEY || !DEFAULT_AGENT_ID) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Set ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID in your local .env file.' }));
      return;
    }
    try {
      const upstream = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(DEFAULT_AGENT_ID)}`,
        { headers: { 'xi-api-key': ELEVENLABS_API_KEY } }
      );
      const data = await upstream.json();
      res.writeHead(upstream.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unable to reach ElevenLabs signed-URL endpoint.' }));
    }
    return;
  }

  // 3. Streaming Text-to-Speech Proxy (Flash v2.5 for interactive / Multilingual v2 for narration)
  if (req.method === 'POST' && req.url === '/api/voice/speak') {
    if (!ELEVENLABS_API_KEY) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'ELEVENLABS_API_KEY is not configured on the server.' }));
      return;
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { text, mode, voiceId } = JSON.parse(body || '{}');
        if (!text || typeof text !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing text parameter.' }));
          return;
        }
        const activeVoiceId = (typeof voiceId === 'string' && /^[a-zA-Z0-9]{10,40}$/.test(voiceId))
          ? voiceId : DEFAULT_VOICE_ID;
        const model_id = mode === 'narration' ? 'eleven_multilingual_v2' : 'eleven_flash_v2_5';
        const upstream = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(activeVoiceId)}/stream`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': ELEVENLABS_API_KEY,
              'Content-Type': 'application/json',
              'Accept': 'audio/mpeg'
            },
            body: JSON.stringify({
              text: text.slice(0, 1500),
              model_id,
              voice_settings: { stability: 0.45, similarity_boost: 0.78, style: 0.25 }
            })
          }
        );
        if (!upstream.ok) {
          res.writeHead(upstream.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'ElevenLabs TTS stream returned an error.' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
        const arrayBuf = await upstream.arrayBuffer();
        res.end(Buffer.from(arrayBuf));
      } catch (_) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Voice synthesis proxy error.' }));
      }
    });
    return;
  }

  // 4. Secure Server-Side Gemini Speech-to-Logic Proxy
  if (req.method === 'POST' && req.url === '/api/ai/translate') {
    if (!GEMINI_API_KEY) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured.' }));
      return;
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { transcript, alternatives } = JSON.parse(body || '{}');
        const altHint = Array.isArray(alternatives) && alternatives.length > 1
          ? `\nAlternative speech hypotheses: ${alternatives.slice(0, 4).map(a => `"${a}"`).join(', ')}` : '';
        const promptText = `You are the AI voice-to-logic interpreter inside LOGIC LAB.\nConvert weak-mic Arabic or English spoken propositional logic into clean Unicode symbols (¬, ∧, ∨, ⊕, →, ↔) using variables P, Q, R, S, A, B, C, D.\nOutput ONLY the formula with zero prose or LaTeX.\nInput transcript: "${String(transcript || '').slice(0, 400)}"${altHint}`;
        for (const model of ['gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-flash-lite-latest']) {
          try {
            const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { temperature: 0.1 } })
            });
            if (upstream.ok) {
              const data = await upstream.json();
              const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (text) { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ text, model })); return; }
            }
          } catch (_) {}
        }
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Gemini upstream unavailable.' }));
      } catch (_) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Translation proxy error.' }));
      }
    });
    return;
  }

  // 5. Serve static LOGIC LAB application, Collector's Booklet PDFs & assets
  const cleanReqUrl = decodeURIComponent((req.url || '/').split('?')[0]);
  const safePath = path.normalize(cleanReqUrl === '/' ? 'index.html' : cleanReqUrl.replace(/^\/+/, ''));
  const filePath = path.join(__dirname, '..', safePath);
  if (filePath.startsWith(path.join(__dirname, '..')) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = {
      '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css',
      '.md': 'text/markdown', '.pdf': 'application/pdf', '.png': 'image/png',
      '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json',
      '.mp3': 'audio/mpeg', '.wav': 'audio/wav'
    }[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`LOGIC LAB server running at http://localhost:${PORT}`);
  console.log(`ElevenLabs Voice Proxy: ${ELEVENLABS_API_KEY ? 'Configured via ELEVENLABS_API_KEY' : 'Not configured (browser voice fallback active)'}`);
});
