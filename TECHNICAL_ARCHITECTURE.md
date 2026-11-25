# LOGIC LAB v2.0 — Technical Architecture

## 1. Frontend Scientific Shell (`index.html` / `logic_lab.html`)
- **Visual Direction:** *Cinematic Computational Intelligence* — deep midnight navy (`#040814`, `#091022`), crisp cyan/electric-blue accents (`#22D3EE`, `#2563EB`), `Space Grotesk` + `Inter` + `JetBrains Mono`, Left Laboratory Rail + asymmetric module-specific layouts.
- **Zero-Hallucination Math Core:** All parsing, truth tables, AST trees, circuit simulations, SOP/POS conversions, Boolean proofs, and context-aware assistant answers run deterministically through `LogicEngine`.

## 2. Secure ElevenLabs Voice Architecture (`server/server.js`)
Based on official ElevenLabs documentation (`elevenlabs.io/docs`):
- **Conversational Voice Agents (`GET /api/voice/signed-url`)**: Requests a short-lived (15-minute) signed WebSocket URL from `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=...` using server-side `xi-api-key: process.env.ELEVENLABS_API_KEY`. The browser connects to `wss://api.elevenlabs.io/v1/convai/conversation` without ever seeing the API key.
- **Streaming Text-to-Speech (`POST /api/voice/speak`)**: Proxies `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream` using `eleven_flash_v2_5` (~75–100ms latency) for interactive replies and `eleven_multilingual_v2` for expressive English/Arabic narration.
- **Secret Hygiene:** `.env` is excluded via `.gitignore`. Only `.env.example` is packaged. Any key previously pasted in chat is treated as compromised and excluded everywhere.
