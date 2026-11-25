# LOGIC LAB v2.0 — Think. Connect. Prove.

An interactive university **Discrete Structures** computational laboratory — paired with the bilingual **Collector's Edition Project Booklet** created for **Dr. Mahmoud Ahmed Zaher**.

## Live Experiences
- **Live Web Application (GitHub Pages):** https://abdulrahmanghoneam-debug.github.io/logic-lab/
- **Interactive Digital Booklet Reader:** https://abdulrahmanghoneam-debug.github.io/logic-lab/LOGIC_LAB_INTERACTIVE_EDITION.html
- **Print-Ready Collector's Booklet (A5, 20 Pages + 3mm Bleed):** `LOGIC_LAB_COLLECTORS_EDITION.pdf`
- **Digital Clickable PDF Edition (A5, 20 Pages):** `LOGIC_LAB_DIGITAL_EDITION.pdf`
- **Separate Printer Cover Wrap:** `LOGIC_LAB_COVER.pdf`

## Core Capabilities
- **Deterministic Mathematical Engine (`src/logicEngine.js`)**: `24/24` automated unit tests across all 8 logical operators (`¬, ∧, ∨, ⊕, →, ↔, ⊼, ⊽`), AST Parse Trees, exhaustive `2ⁿ` truth tables with intermediate columns, canonical SOP/POS conversion, IEEE 7-gate DAG circuit compiler & simulator, and 10-law Boolean Algebra step-by-step simplifier.
- **3D Showcase & 6-Chapter Bilingual Story**: Three.js `0.160.0` Boolean Manifold centerpiece, English & Arabic spatial-audio storytelling, 11 guided lessons, Live Challenges, and Presentation Mode (`P`).
- **Voice & AI Proxy (`server/server.js`)**: Optional ElevenLabs TTS proxy and Gemini weak-mic speech translation configured securely via `.env` (never exposing secrets in client bundles).

## Quick Launch
1. Open `index.html` directly in any modern browser, **or** visit the live GitHub Pages deployment above.
2. To run with local ElevenLabs / Gemini server proxies:
   ```bash
   cp .env.example .env
   # Add your ELEVENLABS_API_KEY / GEMINI_API_KEY to .env
   node server/server.js
   ```
3. Or run via **Docker**:
   ```bash
   docker build -t logic-lab .
   docker run -p 3000:3000 --env-file .env logic-lab
   ```

## Automated Mathematical Verification
```bash
node tests/logicEngine.test.js
```
