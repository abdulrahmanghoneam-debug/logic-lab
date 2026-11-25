import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

// Server-side in-memory cache for synthesized audio to prevent duplicate API credit usage
const audioCache = new Map<string, Buffer>();

function elevenLabsPlugin(apiKey: string): Plugin {
  return {
    name: 'elevenlabs-proxy-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Status check endpoint
        if (req.url === '/api/voice-status' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            configured: Boolean(apiKey && apiKey.startsWith('sk_')),
            defaultVoice: '21m00Tcm4TlvDq8ikWAM', // Rachel
            availableVoices: [
              { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', category: 'Scholarly & Warm' },
              { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', category: 'Narrative & Deep' },
              { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', category: 'Academic & Clear' },
              { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', category: 'Authoritative British' }
            ]
          }));
          return;
        }

        // Text-to-Speech synthesis endpoint
        if (req.url === '/api/tts' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const text = (data.text || '').trim();
              const voiceId = data.voiceId || '21m00Tcm4TlvDq8ikWAM';
              // Automatically use eleven_multilingual_v2 for natural Arabic pronunciation
              const hasArabic = /[\u0600-\u06FF]/.test(text);
              const modelId = data.modelId || (hasArabic ? 'eleven_multilingual_v2' : 'eleven_turbo_v2_5');

              if (!text) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Text prompt is required.' }));
                return;
              }

              if (!apiKey) {
                res.statusCode = 503;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'ElevenLabs API key not configured', fallback: true }));
                return;
              }

              // Check cache
              const cacheKey = `${voiceId}:${modelId}:${text}`;
              if (audioCache.has(cacheKey)) {
                const cachedBuffer = audioCache.get(cacheKey)!;
                res.setHeader('Content-Type', 'audio/mpeg');
                res.setHeader('Content-Length', cachedBuffer.length);
                res.setHeader('X-Cache-Status', 'HIT');
                res.end(cachedBuffer);
                return;
              }

              // Request from ElevenLabs API
              const elevenResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                  'xi-api-key': apiKey,
                  'Content-Type': 'application/json',
                  'Accept': 'audio/mpeg'
                },
                body: JSON.stringify({
                  text,
                  model_id: modelId,
                  voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.2,
                    use_speaker_boost: true
                  }
                })
              });

              if (!elevenResponse.ok) {
                const errorData = await elevenResponse.text();
                console.warn('ElevenLabs API error:', elevenResponse.status, errorData);
                res.statusCode = elevenResponse.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'ElevenLabs API error', details: errorData, fallback: true }));
                return;
              }

              const arrayBuffer = await elevenResponse.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              audioCache.set(cacheKey, buffer);

              res.setHeader('Content-Type', 'audio/mpeg');
              res.setHeader('Content-Length', buffer.length);
              res.setHeader('X-Cache-Status', 'MISS');
              res.end(buffer);
            } catch (err: any) {
              console.error('TTS handler error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message, fallback: true }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  // Securely load environment variables from .env on the server side
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.ELEVENLABS_API_KEY || '';

  return {
    plugins: [
      react(),
      elevenLabsPlugin(apiKey)
    ],
    server: {
      port: 3000,
      open: false
    }
  };
});
