/**
 * Standalone Production Server for LOGIC LAB
 * Serves optimized static distribution with secure ElevenLabs audio proxy
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env securely
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  const envVars = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        envVars[key] = value.trim();
      }
    });
  }
  return envVars;
}

const env = { ...loadEnvFile(), ...process.env };
const PORT = process.env.PORT || env.PORT || 3000;
const API_KEY = env.ELEVENLABS_API_KEY || '';
const audioCache = new Map();

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.mp3': 'audio/mpeg'
};

const server = http.createServer(async (req, res) => {
  // API: Status
  if (req.url === '/api/voice-status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      configured: Boolean(API_KEY && API_KEY.startsWith('sk_')),
      defaultVoice: '21m00Tcm4TlvDq8ikWAM'
    }));
    return;
  }

  // API: TTS proxy
  if (req.url === '/api/tts' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const text = (data.text || '').trim();
        const voiceId = data.voiceId || '21m00Tcm4TlvDq8ikWAM';
        const hasArabic = /[\u0600-\u06FF]/.test(text);
        const modelId = data.modelId || (hasArabic ? 'eleven_multilingual_v2' : 'eleven_turbo_v2_5');

        if (!text) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Text prompt required' }));
          return;
        }

        const cacheKey = `${voiceId}:${modelId}:${text}`;
        if (audioCache.has(cacheKey)) {
          const cached = audioCache.get(cacheKey);
          res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Content-Length': cached.length });
          res.end(cached);
          return;
        }

        const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          body: JSON.stringify({
            text,
            model_id: modelId,
            voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.2, use_speaker_boost: true }
          })
        });

        if (!elevenRes.ok) {
          res.writeHead(elevenRes.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'ElevenLabs API error', fallback: true }));
          return;
        }

        const arrayBuf = await elevenRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        audioCache.set(cacheKey, buffer);

        res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Content-Length': buffer.length });
        res.end(buffer);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message, fallback: true }));
      }
    });
    return;
  }

  // Static files from dist/
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`LOGIC LAB Production Server running on http://localhost:${PORT}`);
});
