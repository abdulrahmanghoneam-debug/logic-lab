/**
 * LOGIC LAB — One-Time Daniel Voice Pre-Generator (AR + EN)
 * Run locally on your computer once:
 *   1) Put ELEVENLABS_API_KEY=... in .env
 *   2) Run: node server/generate_daniel_voices.js
 * Generates permanent MP3 files in ./audio/ using Daniel (onwK4e9ZLuTAKqWW03F9).
 */
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq > 0 && !process.env[t.slice(0, eq).trim()]) {
      process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9'; // Daniel
if (!API_KEY) {
  console.error('Please set ELEVENLABS_API_KEY in .env first.');
  process.exit(1);
}

const CLIPS = [
  ['welcome_en', 'Welcome, Dr. Mahmoud. Step inside LOGIC LAB, where a single proposition becomes a truth table, a live circuit, and a mathematical proof.'],
  ['ch1_en', 'Imagine a smart university vault. Proposition P means Power is ON. It can only be True or False. Flip P below and watch its negation invert instantaneously.'],
  ['ch1_ar', 'تخيّل معمل ذكي. الفرضية بي تعني الكهرباء تعمل، قيمتها إما صح أو خطأ. اضغط على بي بالأسفل وشاهد كيف ينعكس النفي فوراً.'],
  ['ch2_en', 'Now add Q: Security Key Inserted. Choose how P and Q connect—AND, OR, XOR, or IMPLIES—and notice how the outcome changes live.'],
  ['ch2_ar', 'نضيف الآن كيو: مفتاح الأمان موجود. اختر كيف يرتبط بي مع كيو واختيارك هيكمل معانا في الفصول القادمة.'],
  ['ch3_en', 'Testing one input is not a proof. Here is the complete Truth Table for the exact formula you just built. Click any row to trace its step-by-step evaluation.'],
  ['ch3_ar', 'تجربة حالة واحدة لا تكفي للإثبات. إليك جدول الصواب الكامل لنفس المعادلة التي بنيتها، اضغط على أي صف لتتبع خطوات حسابه.'],
  ['ch4_en', 'Every operator maps directly to physical transistors. Click P or Q right on the schematic below to send live electrical pulses through the gates.'],
  ['ch4_ar', 'كل عامل منطقي يتحول مباشرة إلى بوابات إلكترونية. اضغط على بي أو كيو على الرسمة مباشرة وشاهد نبضات الإشارة تسري في الأسلاك.'],
  ['ch5_en', 'In Discrete Structures, two different formulas can produce the exact same truth table. Click Transform below to watch Boolean laws replace one structure with its simpler equivalent.'],
  ['ch5_ar', 'في الهياكل المتقطعة يمكن استبدال معادلة معقدة بأخرى أبسط تماماً مع الحفاظ على نفس جدول الصواب. اضغط طبّق القانون لتشاهد التحول الرياضي.'],
  ['ch6_en', 'You have walked from a single bit to circuits and algebraic proofs. Speak or type any expression and watch the entire engine respond live.'],
  ['ch6_ar', 'بعد أن شاهدت الرحلة كاملة، قل أو اكتب أي معادلة من اختيارك وشاهد المحرك يستجيب فوراً.']
];

(async () => {
  const outDir = path.join(__dirname, '..', 'audio');
  fs.mkdirSync(outDir, { recursive: true });
  for (const [name, text] of CLIPS) {
    const file = path.join(outDir, `${name}.mp3`);
    console.log('Generating:', name);
    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.48, similarity_boost: 0.78, style: 0.15, use_speaker_boost: true } })
    });
    if (!resp.ok) { console.error('Failed:', name, resp.status); continue; }
    fs.writeFileSync(file, Buffer.from(await resp.arrayBuffer()));
  }
  console.log('Done! Saved permanent Daniel MP3 files in ./audio/');
})();
