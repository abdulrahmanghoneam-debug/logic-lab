/**
 * LOGIC LAB — One-Command Portable Daniel Voice Bundler
 * Run once on your computer (Node.js 18+):
 *   1) Put ELEVENLABS_API_KEY=<your_key> inside .env
 *   2) Run: node server/bundle_offline_voices.js
 * Produces index.html with all 13 Arabic & English Daniel MP3 clips permanently embedded
 * so it works offline on EVERY browser and EVERY computer with zero future API usage!
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
  console.error('Missing ELEVENLABS_API_KEY in .env file.');
  process.exit(1);
}

const LINES = [
  'Welcome, Dr. Mahmoud. Step inside LOGIC LAB, where a single proposition becomes a truth table, a live circuit, and a mathematical proof.',
  'Imagine a smart university vault. Proposition P means "Power is ON." It can only be True (1) or False (0). Flip P below and watch its negation ¬P invert instantaneously.',
  'تخيّل معمل ذكي. الفرضية P تعني "الكهرباء تعمل" — قيمتها إما True (1) أو False (0). اضغط على P بالأسفل وشاهد كيف ينعكس النفي ¬P فوراً.',
  'Now add Q: "Security Key Inserted." Choose how P and Q connect—AND, OR, XOR, or IMPLIES—and notice how the outcome changes live. Your choice carries forward into the next chapters.',
  'نضيف الآن Q: "مفتاح الأمان موجود". اختر كيف يرتبط P مع Q — AND أو OR أو XOR أو IMPLIES — واختيارك هيكمل معانا في الفصول القادمة.',
  'Testing one input isn’t a proof. Here is the complete Truth Table for the exact formula you just built. Click any row to trace its step-by-step evaluation.',
  'تجربة حالة واحدة لا تكفي للإثبات. إليك جدول الصواب الكامل لنفس المعادلة التي بنيتها — اضغط على أي صف لتتبع خطوات حسابه.',
  'Every operator maps directly to physical transistors. Click P or Q right on the schematic below to send live electrical pulses through the gates.',
  'كل عامل منطقي يتحول مباشرة إلى بوابات إلكترونية. اضغط على P أو Q على الرسمة مباشرة وشاهد نبضات الإشارة تسري في الأسلاك.',
  'In Discrete Structures, two different formulas can produce the exact same truth table. Click "Transform" below to watch Boolean laws replace one structure with its simpler equivalent—saving hardware gates.',
  'في الهياكل المتقطعة، يمكن استبدال معادلة معقدة بأخرى أبسط تماماً مع الحفاظ على نفس جدول الصواب 100%. اضغط "طبّق القانون" لتشاهد التحول الرياضي.',
  'You have walked from a single bit to circuits and algebraic proofs. Speak or type any expression—such as "P and Q or not R"—and watch the entire engine respond live.',
  'بعد أن شاهدت الرحلة كاملة من Bit واحد إلى الدوائر والإثباتات — قل أو اكتب أي معادلة مثل "P and Q or not R" وشاهد المحرك يستجيب فوراً.'
];

(async () => {
  const embedded = {};
  for (let i = 0; i < LINES.length; i++) {
    const text = LINES[i];
    console.log(`[${i + 1}/${LINES.length}] Recording Daniel...`);
    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.48, similarity_boost: 0.78, style: 0.15, use_speaker_boost: true }
      })
    });
    if (!resp.ok) {
      const errText = await resp.text();
      console.error(`ElevenLabs error (${resp.status}):`, errText);
      process.exit(1);
    }
    const b64 = Buffer.from(await resp.arrayBuffer()).toString('base64');
    embedded[text] = `data:audio/mpeg;base64,${b64}`;
  }

  const indexPath = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  const marker = 'const EMBEDDED_AUDIO = /*__EMBEDDED_DANIEL_AUDIO__*/{};';
  if (!html.includes(marker)) {
    console.error('Marker not found in index.html');
    process.exit(1);
  }
  html = html.replace(marker, `const EMBEDDED_AUDIO = ${JSON.stringify(embedded)};`);
  const outPath = path.join(__dirname, '..', 'logic_lab_offline_daniel.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log('SUCCESS! Created portable offline file:', outPath);
})();
