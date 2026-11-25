/* LOGIC LAB — THE COLLECTOR'S EDITION
   Museum-Grade Book-Fair Outer Jacket (Front Cover, Center Spine & Back Cover) */

function coverFrameDecor(isFront = true) {
  return `
  <div style="position:absolute; inset:0; pointer-events:none; overflow:hidden;">
    <!-- Ambient Atmospheric Radial Lighting -->
    <div style="position:absolute; inset:0; background:
      radial-gradient(ellipse 78% 54% at ${isFront ? '50% 34%' : '30% 24%'}, rgba(29,78,216,0.22), transparent 66%),
      radial-gradient(ellipse 52% 42% at ${isFront ? '50% 34%' : '75% 82%'}, rgba(34,211,238,0.12), transparent 62%),
      radial-gradient(ellipse 46% 32% at ${isFront ? '50% 88%' : '20% 88%'}, rgba(229,193,123,0.09), transparent 65%),
      linear-gradient(170deg, #020611 0%, #040919 52%, #030713 100%);"></div>

    <!-- Subtle Precision Micro Engineering Grid -->
    <div style="position:absolute; inset:0; background-image:
      linear-gradient(rgba(56,189,248,0.042) 0.2mm, transparent 0.2mm),
      linear-gradient(90deg, rgba(56,189,248,0.042) 0.2mm, transparent 0.2mm);
      background-size: 9mm 9mm;"></div>

    <!-- Double Architectural Gold/Cyan Perimeter Frame + Corner Precision Brackets -->
    <svg viewBox="0 0 148 210" style="position:absolute; inset:0; width:100%; height:100%;" xmlns="http://www.w3.org/2000/svg">
      <rect x="7.5" y="7.5" width="133" height="195" fill="none" stroke="#E5C17B" stroke-opacity="0.34" stroke-width="0.24"/>
      <rect x="9.2" y="9.2" width="129.6" height="191.6" fill="none" stroke="#22D3EE" stroke-opacity="0.18" stroke-width="0.16"/>
      <!-- Precision Corner Foil Brackets -->
      <g stroke="#E5C17B" stroke-width="0.55" fill="none">
        <polyline points="7.5,14 7.5,7.5 14,7.5"/>
        <polyline points="134,7.5 140.5,7.5 140.5,14"/>
        <polyline points="7.5,196 7.5,202.5 14,202.5"/>
        <polyline points="134,202.5 140.5,202.5 140.5,196"/>
      </g>
      <!-- Tiny Diamond Corner Accents -->
      <g fill="#22D3EE" fill-opacity="0.85">
        <polygon points="7.5,6.3 8.5,7.5 7.5,8.7 6.5,7.5"/>
        <polygon points="140.5,6.3 141.5,7.5 140.5,8.7 139.5,7.5"/>
        <polygon points="7.5,201.3 8.5,202.5 7.5,203.7 6.5,202.5"/>
        <polygon points="140.5,201.3 141.5,202.5 140.5,203.7 139.5,202.5"/>
      </g>
    </svg>
  </div>`;
}

function buildLuxuryFrontCoverInner() {
  return `
  <div style="position:relative; width:100%; height:100%; padding:12.5mm 13mm 12mm; display:flex; flex-direction:column; justify-content:space-between; color:#F8FAFC; direction:rtl;">
    ${coverFrameDecor(true)}

    <!-- TOP ARCHIVAL EDITION HEADER -->
    <div style="position:relative; z-index:4; display:flex; justify-content:space-between; align-items:center; border-bottom:0.22mm solid rgba(229,193,123,0.34); padding-bottom:2.8mm;">
      <span style="font-size:7.6pt; font-weight:600; color:#E5C17B; letter-spacing:0.02em;">الإصدار التذكاري الخاص · ٢.٠</span>
      <span dir="ltr" class="mono" style="font-size:6.6pt; color:#93C5FD; letter-spacing:0.18em;">COLLECTOR'S MONOGRAPH · v2.0</span>
    </div>

    <!-- MONUMENTAL CENTERPIECE: BOOLEAN CRYSTAL CORE + MASTHEAD -->
    <div style="position:relative; z-index:4; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:1mm 0;">
      <!-- Precision Astronomical Boolean Core SVG -->
      <svg viewBox="0 0 280 232" dir="ltr" style="width:78mm; height:auto; margin-bottom:2mm;" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="coreHalo" cx="50%" cy="48%" r="48%">
            <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.34"/>
            <stop offset="48%" stop-color="#1D4ED8" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="#040814" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="goldArc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F5DFAB"/>
            <stop offset="50%" stop-color="#D4AF63"/>
            <stop offset="100%" stop-color="#9A7836"/>
          </linearGradient>
          <linearGradient id="cyanEdge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#67E8F9"/>
            <stop offset="50%" stop-color="#22D3EE"/>
            <stop offset="100%" stop-color="#2563EB"/>
          </linearGradient>
          <linearGradient id="facetTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E3A8A" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.22"/>
          </linearGradient>
          <linearGradient id="facetSide" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#040814" stop-opacity="0.88"/>
            <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.36"/>
          </linearGradient>
        </defs>

        <!-- Halo Glow -->
        <circle cx="140" cy="112" r="106" fill="url(#coreHalo)"/>

        <!-- Precision Outer Compass Ring & Architectural Ticks -->
        <circle cx="140" cy="112" r="96" fill="none" stroke="url(#goldArc)" stroke-width="0.6" stroke-opacity="0.55"/>
        <circle cx="140" cy="112" r="89" fill="none" stroke="#22D3EE" stroke-width="0.35" stroke-opacity="0.35" stroke-dasharray="2 3"/>
        <circle cx="140" cy="112" r="72" fill="none" stroke="url(#goldArc)" stroke-width="0.4" stroke-opacity="0.4" stroke-dasharray="12 4 2 4"/>

        <!-- Cardinal & Diagonal Ticks -->
        <g stroke="#E5C17B" stroke-opacity="0.65" stroke-width="0.6">
          <line x1="140" y1="11" x2="140" y2="19"/>
          <line x1="140" y1="205" x2="140" y2="213"/>
          <line x1="39" y1="112" x2="47" y2="112"/>
          <line x1="233" y1="112" x2="241" y2="112"/>
          <line x1="68.5" y1="40.5" x2="73.5" y2="45.5"/>
          <line x1="211.5" y1="40.5" x2="206.5" y2="45.5"/>
          <line x1="68.5" y1="183.5" x2="73.5" y2="178.5"/>
          <line x1="211.5" y1="183.5" x2="206.5" y2="178.5"/>
        </g>

        <!-- Tilted Orbital Logic Ellipses -->
        <ellipse cx="140" cy="112" rx="92" ry="34" transform="rotate(-28 140 112)" fill="none" stroke="#38BDF8" stroke-width="0.55" stroke-opacity="0.38"/>
        <ellipse cx="140" cy="112" rx="92" ry="34" transform="rotate(28 140 112)" fill="none" stroke="#E5C17B" stroke-width="0.48" stroke-opacity="0.32"/>

        <!-- Central Isometric Faceted Boolean Core -->
        <polygon points="140,36 206,112 140,188 74,112" fill="url(#facetSide)" stroke="url(#cyanEdge)" stroke-width="1.35"/>
        <polygon points="140,36 206,112 140,112" fill="url(#facetTop)" stroke="#67E8F9" stroke-width="0.5" stroke-opacity="0.5"/>
        <polygon points="140,36 74,112 140,112" fill="rgba(15,23,42,0.58)" stroke="#E5C17B" stroke-width="0.45" stroke-opacity="0.45"/>
        <polygon points="140,46 196,112 140,178 84,112" fill="none" stroke="url(#goldArc)" stroke-width="0.45" stroke-opacity="0.52"/>

        <!-- Monumental Sculpted Turnstile Emblem + Binary Propagation -->
        <path d="M 103 112 L 136 112 M 103 90 L 103 134" stroke="#FFFFFF" stroke-width="3.6" stroke-linecap="round"/>
        <path d="M 136 112 C 154 112, 155 83, 175 83" fill="none" stroke="#22D3EE" stroke-width="1.9"/>
        <path d="M 136 112 C 154 112, 155 141, 175 141" fill="none" stroke="#3B82F6" stroke-width="1.9"/>

        <!-- Input & Output Logic Nodes -->
        <circle cx="103" cy="112" r="2.8" fill="#E5C17B"/>
        <circle cx="177" cy="83" r="7" fill="#030712" stroke="#22D3EE" stroke-width="1.7"/>
        <circle cx="177" cy="141" r="7" fill="#030712" stroke="#60A5FA" stroke-width="1.7"/>
        <text x="177" y="85.8" fill="#67E8F9" font-family="JetBrains Mono" font-size="8" font-weight="700" text-anchor="middle">1</text>
        <text x="177" y="143.8" fill="#93C5FD" font-family="JetBrains Mono" font-size="8" font-weight="700" text-anchor="middle">0</text>

        <!-- Perimeter Orbital Logic Satellites -->
        <circle cx="62" cy="70" r="3.2" fill="#030712" stroke="#E5C17B" stroke-width="1.1"/>
        <circle cx="218" cy="154" r="3.2" fill="#030712" stroke="#22D3EE" stroke-width="1.1"/>
        <circle cx="218" cy="70" r="2.5" fill="#38BDF8"/>
        <circle cx="62" cy="154" r="2.5" fill="#E5C17B"/>

        <!-- Top & Bottom Engraved Axioms -->
        <text x="140" y="28" fill="#E5C17B" direction="ltr" unicode-bidi="bidi-override" font-family="JetBrains Mono, Consolas, monospace" font-size="6.4" letter-spacing="1.4" text-anchor="middle">DISCRETE STRUCTURES · ARCHIVE</text>
        <text x="140" y="224" fill="#94A3B8" direction="ltr" unicode-bidi="bidi-override" font-family="JetBrains Mono, Consolas, monospace" font-size="6.4" letter-spacing="0.8" text-anchor="middle">¬(P ∧ Q) ≡ ¬P ∨ ¬Q   ·   (P ∧ ¬Q) → R</text>
      </svg>

      <!-- Monumental Masthead -->
      <div dir="ltr" class="display-en" style="font-size:35pt; font-weight:700; color:#FFFFFF; line-height:0.96; letter-spacing:-0.03em;">
        LOGIC <span style="color:#22D3EE;">LAB</span>
      </div>
      <div dir="ltr" class="mono" style="font-size:7.3pt; color:#E5C17B; letter-spacing:0.26em; margin-top:2.4mm; font-weight:700;">
        THE SCIENCE OF COMPUTATIONAL PROOF
      </div>

      <!-- Champagne-Gold Ornament Rule -->
      <div style="display:flex; align-items:center; justify-content:center; gap:3mm; width:56mm; margin:4mm auto 3.5mm;">
        <div style="flex:1; height:0.25mm; background:linear-gradient(90deg, transparent, #E5C17B);"></div>
        <span style="color:#22D3EE; font-size:7pt;">◆</span>
        <div style="flex:1; height:0.25mm; background:linear-gradient(90deg, #E5C17B, transparent);"></div>
      </div>

      <!-- Arabic Monograph Title -->
      <div style="font-size:13.5pt; font-weight:700; color:#FFFFFF; line-height:1.48;">
        العِلم الكامن خلف التفكير المنطقي وبنية البرهان
      </div>
      <div style="font-size:8.3pt; font-weight:400; color:#94A3B8; line-height:1.6; margin-top:1.4mm; max-width:108mm;">
        رحلة حوسبية من الفرضية الواحدة إلى جداول الصواب، الدوائر السيليكونية، والجبر البولياني
      </div>
    </div>

    <!-- BOTTOM MUSEUM DEDICATION PLAQUE -->
    <div style="position:relative; z-index:4;">
      <div style="background:linear-gradient(135deg, rgba(8,19,43,0.92), rgba(4,10,26,0.96)); border:0.28mm solid rgba(229,193,123,0.48); border-radius:2.4mm; padding:3.6mm 5mm; text-align:center; box-shadow:0 4px 18px rgba(0,0,0,0.45);">
        <div class="mono" dir="ltr" style="font-size:6.2pt; color:#22D3EE; letter-spacing:0.2em; text-transform:uppercase;">DEDICATED ARCHIVE EDITION · نسخة إهداء خاصة</div>
        <div style="font-size:10.5pt; font-weight:700; color:#F8FAFC; margin-top:1mm;">
          مُهدى إلى سعادة <span style="color:#F5DFAB;">الدكتور محمود أحمد زاهر</span>
        </div>
        <div style="font-size:7.2pt; color:#94A3B8; margin-top:0.8mm;">
          كتيّب توثيقي وتذكاري للمختبر الحوسبي التفاعلي · مساق الهياكل المتقطعة
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:3mm; font-size:6.6pt; color:#64748B;">
        <span dir="ltr" class="mono">A5 MONOGRAPH · 20 PAGES</span>
        <span dir="ltr" class="mono" style="color:#E5C17B;">24/24 ENGINE TESTS VERIFIED</span>
      </div>
    </div>
  </div>`;
}

function buildLuxuryBackCoverInner() {
  return `
  <div style="position:relative; width:100%; height:100%; padding:12.5mm 13mm 11.5mm; display:flex; flex-direction:column; justify-content:space-between; color:#F8FAFC; direction:rtl;">
    ${coverFrameDecor(false)}

    <!-- TOP EDITORIAL HEADER & SYNOPSIS -->
    <div style="position:relative; z-index:4;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:0.22mm solid rgba(229,193,123,0.32); padding-bottom:2.6mm; margin-bottom:5mm;">
        <span style="font-size:7.6pt; font-weight:600; color:#E5C17B;">عن هذا الإصدار التذكاري</span>
        <span dir="ltr" class="mono" style="font-size:6.6pt; color:#93C5FD; letter-spacing:0.18em;">ABOUT THIS MONOGRAPH</span>
      </div>

      <div style="font-size:12pt; font-weight:700; color:#FFFFFF; line-height:1.5; margin-bottom:2.8mm;">
        كيف تتحوّل الفكرة المنطقية إلى برهان رياضي ودائرة سيليكون حية؟
      </div>
      <p style="font-size:8.2pt; color:#CBD5E1; line-height:1.75; text-align:justify;">
        يقدّم هذا الكتاب التوثيقي البنية الهندسية والفكرية لمنصة <strong dir="ltr" class="en-term" style="color:#22D3EE;">LOGIC LAB</strong> — المختبر الحوسبي التفاعلي الذي ينقل علم الهياكل المتقطعة من الشرائح الصامتة إلى التجربة الحيّة؛ حيث يرى الطالب المعادلة الواحدة في الوقت ذاته كشجرة أولويات، وجدول صواب استقصائي، وبوابات إلكترونية تنبض بالإشارات، واشتقاق جبري خطوةً بخطوة.
      </p>
    </div>

    <!-- 4 ARCHITECTURE PILLARS (BOOK-FAIR SPEC TILES) -->
    <div style="position:relative; z-index:4; display:grid; grid-template-columns:1fr 1fr; gap:2.8mm; margin:2mm 0;">
      <div style="background:rgba(7,16,38,0.82); border:0.22mm solid rgba(56,189,248,0.28); border-radius:2mm; padding:3mm 3.4mm;">
        <div dir="ltr" class="mono" style="font-size:6.4pt; color:#22D3EE; letter-spacing:0.1em; margin-bottom:1mm;">01 · DETERMINISTIC CORE</div>
        <div style="font-size:8.2pt; font-weight:700; color:#FFFFFF; margin-bottom:0.8mm;">محرّك منطقي حتمي</div>
        <div style="font-size:7pt; color:#94A3B8; line-height:1.5;">توليد جداول الصواب الكاملة وشجرة التحليل وتصنيف التطابق باجتياز <span dir="ltr" class="mono" style="color:#34D399;">24/24</span> اختبار وحدة.</div>
      </div>

      <div style="background:rgba(7,16,38,0.82); border:0.22mm solid rgba(56,189,248,0.28); border-radius:2mm; padding:3mm 3.4mm;">
        <div dir="ltr" class="mono" style="font-size:6.4pt; color:#60A5FA; letter-spacing:0.1em; margin-bottom:1mm;">02 · IEEE SILICON LAB</div>
        <div style="font-size:8.2pt; font-weight:700; color:#FFFFFF; margin-bottom:0.8mm;">محاكاة بوابات سيليكونية</div>
        <div style="font-size:7pt; color:#94A3B8; line-height:1.5;">تحويل فوري للمعادلات إلى <span dir="ltr" class="mono" style="color:#E2E8F0;">7</span> بوابات رقمية مع تتبّع النبضات الثنائية <span dir="ltr" class="mono" style="display:inline-block;">0 / 1</span>.</div>
      </div>

      <div style="background:rgba(7,16,38,0.82); border:0.22mm solid rgba(229,193,123,0.3); border-radius:2mm; padding:3mm 3.4mm;">
        <div dir="ltr" class="mono" style="font-size:6.4pt; color:#E5C17B; letter-spacing:0.1em; margin-bottom:1mm;">03 · ALGEBRAIC PROOF</div>
        <div style="font-size:8.2pt; font-weight:700; color:#FFFFFF; margin-bottom:0.8mm;">جبر بولياني وتحويل قياسي</div>
        <div style="font-size:7pt; color:#94A3B8; line-height:1.5;">تبسيط جبري عبر القوانين العشرة وتحويل تلقائي لصيغ <span dir="ltr" class="mono" style="display:inline-block; color:#E2E8F0;">SOP / POS</span>.</div>
      </div>

      <div style="background:rgba(7,16,38,0.82); border:0.22mm solid rgba(229,193,123,0.3); border-radius:2mm; padding:3mm 3.4mm;">
        <div dir="ltr" class="mono" style="font-size:6.4pt; color:#E5C17B; letter-spacing:0.1em; margin-bottom:1mm;">04 · 3D &amp; BILINGUAL VOICE</div>
        <div style="font-size:8.2pt; font-weight:700; color:#FFFFFF; margin-bottom:0.8mm;">مشهد 3D وصوت طبيعي</div>
        <div style="font-size:7pt; color:#94A3B8; line-height:1.5;">بوابة <span dir="ltr" class="mono" style="display:inline-block;">Three.js</span> وتجربة صوتية ثنائية اللغة عبر <span dir="ltr" class="mono" style="color:#34D399;">42</span> تسجيلاً لـ <span dir="ltr" class="mono" style="display:inline-block;">ElevenLabs</span>.</div>
      </div>
    </div>

    <!-- SCULPTED CLOSING EPIGRAPH -->
    <div style="position:relative; z-index:4; background:rgba(8,19,43,0.72); border-right:0.8mm solid #E5C17B; border-top:0.18mm solid rgba(229,193,123,0.22); border-bottom:0.18mm solid rgba(229,193,123,0.22); border-left:0.18mm solid rgba(229,193,123,0.22); border-radius:0 2mm 2mm 0; padding:3.4mm 4.2mm; margin:1.5mm 0;">
      <p style="font-size:8.7pt; font-weight:600; color:#F8FAFC; line-height:1.68;">
        «المنطق لا يُعلّمنا فقط كيف نصل إلى الإجابة الصحيحة؛ بل يعلّمنا كيف نرى الطريق كلّه، خطوةً بعد خطوة، بلا غموض.»
      </p>
      <div style="font-size:7.1pt; color:#E5C17B; margin-top:1.4mm;">
        إهداء وتقدير خاص إلى <strong>الدكتور محمود أحمد زاهر</strong> · قسم الهياكل المتقطعة
      </div>
    </div>

    <!-- BOOK-FAIR FOOTER: DUAL VERIFIED QR PORTALS + ARCHIVE SEAL BARCODE -->
    <div style="position:relative; z-index:4; border-top:0.24mm solid rgba(229,193,123,0.34); padding-top:3.5mm; display:flex; justify-content:space-between; align-items:stretch; gap:3mm;">
      <!-- Right Block (RTL): Dual Scannable QR Cards -->
      <div style="display:flex; gap:2.5mm; align-items:center;">
        <div style="text-align:center;">
          <div style="background:#FFFFFF; padding:1.3mm; border-radius:1.4mm; border:0.25mm solid #22D3EE; display:inline-block;">
            <img src="assets/qr_live_app.png" alt="Live App QR" style="width:15.5mm; height:15.5mm; display:block;"/>
          </div>
          <div style="font-size:6.2pt; font-weight:700; color:#67E8F9; margin-top:1mm;">تجربة التطبيق الحي</div>
        </div>
        <div style="text-align:center;">
          <div style="background:#FFFFFF; padding:1.3mm; border-radius:1.4mm; border:0.25mm solid #E5C17B; display:inline-block;">
            <img src="assets/qr_interactive_book.png" alt="Interactive Book QR" style="width:15.5mm; height:15.5mm; display:block;"/>
          </div>
          <div style="font-size:6.2pt; font-weight:700; color:#F5DFAB; margin-top:1mm;">الكتاب التفاعلي</div>
        </div>
      </div>

      <!-- Left Block (RTL): Press Metadata & Graphic Archive Barcode -->
      <div dir="ltr" style="flex:1; background:rgba(4,9,24,0.92); border:0.22mm solid rgba(148,163,184,0.28); border-radius:1.8mm; padding:2.4mm 3mm; display:flex; flex-direction:column; justify-content:space-between;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="display-en" style="font-size:9pt; font-weight:700; color:#FFFFFF;">LOGIC <span style="color:#22D3EE;">LAB</span></span>
          <span class="mono" style="font-size:5.8pt; color:#E5C17B; letter-spacing:0.12em;">COLLECTOR'S PRESS</span>
        </div>
        <!-- Graphic Archive Seal Bars (full-width decorative publishing mark) -->
        <div style="background:#FFFFFF; border-radius:1mm; padding:1.3mm 2.2mm; margin:1.2mm 0;">
          <svg viewBox="0 0 128 22" preserveAspectRatio="none" style="width:100%; height:5.4mm; display:block;" xmlns="http://www.w3.org/2000/svg">
            <g fill="#040814">
              <rect x="0" y="1" width="2.2" height="20"/><rect x="3.4" y="1" width="1" height="20"/>
              <rect x="6" y="1" width="3.4" height="20"/><rect x="11" y="1" width="1.2" height="20"/>
              <rect x="14" y="1" width="2.6" height="20"/><rect x="18" y="1" width="1" height="20"/>
              <rect x="21" y="1" width="3.4" height="20"/><rect x="26" y="1" width="1.5" height="20"/>
              <rect x="30" y="1" width="2" height="20"/><rect x="34" y="1" width="1.2" height="20"/>
              <rect x="38" y="1" width="3.8" height="20"/><rect x="44" y="1" width="1.1" height="20"/>
              <rect x="47" y="1" width="2.4" height="20"/><rect x="52" y="1" width="1.5" height="20"/>
              <rect x="56" y="1" width="3" height="20"/><rect x="61" y="1" width="1" height="20"/>
              <rect x="64" y="1" width="2.2" height="20"/><rect x="68" y="1" width="3.5" height="20"/>
              <rect x="74" y="1" width="1.2" height="20"/><rect x="78" y="1" width="2.6" height="20"/>
              <rect x="83" y="1" width="1.1" height="20"/><rect x="86" y="1" width="3.2" height="20"/>
              <rect x="91" y="1" width="1.6" height="20"/><rect x="95" y="1" width="2.4" height="20"/>
              <rect x="100" y="1" width="1.1" height="20"/><rect x="103" y="1" width="3.6" height="20"/>
              <rect x="109" y="1" width="1.2" height="20"/><rect x="113" y="1" width="2.6" height="20"/>
              <rect x="118" y="1" width="1.2" height="20"/><rect x="121" y="1" width="2.8" height="20"/>
              <rect x="125.5" y="1" width="2.5" height="20"/>
            </g>
          </svg>
        </div>
        <div class="mono" style="display:flex; justify-content:space-between; font-size:5.6pt; color:#94A3B8; letter-spacing:0.06em;">
          <span>LOGIC-LAB · ARCHIVE V2.0</span>
          <span style="color:#E5C17B;">A5 · THINK. CONNECT. PROVE.</span>
        </div>
      </div>
    </div>
  </div>`;
}

module.exports = { buildLuxuryFrontCoverInner, buildLuxuryBackCoverInner };
