/* LOGIC LAB — THE COLLECTOR'S EDITION
   Complete 20-Page Bilingual Editorial Manuscript & Composition Module */

const CROP_MARKS_SVG = `
<div class="crop-marks">
  <svg viewBox="0 0 154 216" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#22D3EE" stroke-width="0.28" stroke-opacity="0.72" fill="none">
      <!-- Top-Left (trim 3,3) -->
      <line x1="0" y1="3" x2="2.2" y2="3"/><line x1="3" y1="0" x2="3" y2="2.2"/>
      <!-- Top-Right (trim 151,3) -->
      <line x1="154" y1="3" x2="151.8" y2="3"/><line x1="151" y1="0" x2="151" y2="2.2"/>
      <!-- Bottom-Left (trim 3,213) -->
      <line x1="0" y1="213" x2="2.2" y2="213"/><line x1="3" y1="216" x2="3" y2="213.8"/>
      <!-- Bottom-Right (trim 151,213) -->
      <line x1="154" y1="213" x2="151.8" y2="213"/><line x1="151" y1="216" x2="151" y2="213.8"/>
    </g>
  </svg>
</div>`;

function wrapPage({ id, pageNum, sectionAr, sectionEn, dark = false, isCover = false, content }) {
  const gutterClass = pageNum % 2 === 0 ? 'rtl-right-page' : 'rtl-left-page';
  const folioTop = isCover ? '' : `
    <header class="folio-top">
      <a href="#p03" class="folio-link">LOGIC LAB · <span class="en-term">${sectionEn}</span></a>
      <span>${sectionAr}</span>
    </header>`;
  const folioBottom = isCover ? '' : `
    <footer class="folio-bottom">
      <a href="#p03" class="folio-link">الفهرس ↑</a>
      <span class="page-num">${String(pageNum).padStart(2, '0')}</span>
      <span>إصدار توثيقي للدكتور محمود أحمد زاهر</span>
    </footer>`;

  return `
<section id="${id}" class="sheet ${dark ? 'dark-sheet' : ''}" data-page="${pageNum}">
  <div class="bleed-bg ${isCover && dark ? 'cover-blueprint-grid' : ''}"></div>
  ${CROP_MARKS_SVG}
  <div class="trim-area ${isCover ? '' : 'interior ' + gutterClass}">
    ${folioTop}
    <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between; min-height:0;">
      ${content}
    </div>
    ${folioBottom}
  </div>
</section>`;
}

function buildAllPages(assetPrefix = 'assets') {
  const S = p => `${assetPrefix}/screenshots/${p}`;
  const QR_GH = `${assetPrefix}/qr_github_repo.png`;
  const QR_APP = `${assetPrefix}/qr_live_app.png`;
  const QR_BOOK = `${assetPrefix}/qr_interactive_book.png`;

  const tocItems = [
    { num: '01', id: 'p04', ar: 'سؤال يستحق التأمل: لماذا لا يكفي الحفظ؟', en: 'Opening Question', pg: '04' },
    { num: '02', id: 'p05', ar: 'التحدي التعليمي: من الشرائح الصامتة إلى التفاعل', en: 'The Challenge', pg: '05' },
    { num: '03', id: 'p06', ar: 'الفكرة الجوهرية: معادلة واحدة وعشر عدسات', en: 'Central Concept & 3D Entry', pg: '06' },
    { num: '04', id: 'p07', ar: 'مرحباً بك داخل المختبر (تشريح الواجهة)', en: 'The Laboratory HUD', pg: '07' },
    { num: '05', id: 'p08', ar: 'لغة المنطق: المتغيرات، الروابط، وشجرة AST', en: 'Language & Parse Trees', pg: '08' },
    { num: '06', id: 'p09', ar: 'داخل محرّك جداول الصواب والبرهان الاستقصائي', en: 'Truth Table Engine', pg: '09' },
    { num: '07', id: 'p10', ar: 'استوديو التحويل القياسي SOP و POS', en: 'Canonical Conversion', pg: '10' },
    { num: '08', id: 'p11', ar: 'من الرياضيات إلى السيليكون: محاكي البوابات', en: 'IEEE Logic Gates Lab', pg: '11' },
    { num: '09', id: 'p12', ar: 'جمال الجبر البولياني والاختصار خطوة بخطوة', en: 'Boolean Algebra Proofs', pg: '12' },
    { num: '10', id: 'p13', ar: 'مختبر مفتوح وقصة تفاعلية من ٦ فصول', en: 'Playground & Bilingual Story', pg: '13' },
    { num: '11', id: 'p14', ar: 'التعلّم الموجّه، التحديات الحية، ووضع المحاضرة', en: '11 Lessons · Challenges · Slides', pg: '14' },
    { num: '12', id: 'p15', ar: 'المساعد الأكاديمي والصوت الطبيعي بالذكاء الاصطناعي', en: 'Voice Guide & ElevenLabs', pg: '15' },
    { num: '13', id: 'p16', ar: 'ما وراء التجربة: البنية التقنية ونظام الألوان', en: 'Architecture & Design System', pg: '16' },
    { num: '14', id: 'p17', ar: 'التحقق الهندسي الصادق وآفاق التطوير', en: 'Verification, Limits & Future', pg: '17–18' },
    { num: '15', id: 'p19', ar: 'بيان الإصدار والخاتمة التذكارية', en: 'Colophon & Final Thought', pg: '19–20' }
  ];

  return [
    /* P.01 — FRONT COVER (Concept A: Monograph Monolith) */
    wrapPage({
      id: 'p01', pageNum: 1, dark: true, isCover: true,
      content: `
      <div style="height:100%; padding:13mm 14mm; display:flex; flex-direction:column; justify-content:space-between; position:relative;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:0.25mm solid rgba(56,189,248,0.28); padding-bottom:3mm;">
          <span class="mono" style="font-size:7pt; color:#22D3EE; letter-spacing:0.18em;">COLLECTOR'S EDITION · MONOGRAPH v2.0</span>
          <span class="mono" style="font-size:7pt; color:#94A3B8; letter-spacing:0.12em;">DISCRETE STRUCTURES</span>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin:auto 0; text-align:center;">
          <!-- Custom Geometric Monolith Cover Seal -->
          <svg viewBox="0 0 220 185" dir="ltr" style="width:74mm; height:auto; margin-bottom:6mm;" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="covCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#22D3EE"/><stop offset="100%" stop-color="#2563EB"/>
              </linearGradient>
            </defs>
            <circle cx="110" cy="92" r="78" fill="none" stroke="rgba(56,189,248,0.18)" stroke-width="0.6" stroke-dasharray="2 3"/>
            <circle cx="110" cy="92" r="56" fill="none" stroke="rgba(34,211,238,0.34)" stroke-width="0.7"/>
            <polygon points="110,16 178,92 110,168 42,92" fill="rgba(8,18,38,0.72)" stroke="url(#covCyan)" stroke-width="1.2"/>
            <!-- Turnstile & Binary Truth Branches -->
            <path d="M 76 92 L 106 92 M 76 72 L 76 112" stroke="#F8FAFC" stroke-width="3.2" stroke-linecap="round"/>
            <path d="M 106 92 C 122 92, 124 64, 142 64" fill="none" stroke="#22D3EE" stroke-width="1.5"/>
            <path d="M 106 92 C 122 92, 124 120, 142 120" fill="none" stroke="#3B82F6" stroke-width="1.5"/>
            <circle cx="144" cy="64" r="5.5" fill="#040814" stroke="#22D3EE" stroke-width="1.6"/>
            <circle cx="144" cy="120" r="5.5" fill="#040814" stroke="#3B82F6" stroke-width="1.6"/>
            <text x="144" y="66.5" fill="#22D3EE" font-family="JetBrains Mono" font-size="7" font-weight="700" text-anchor="middle">1</text>
            <text x="144" y="122.5" fill="#93C5FD" font-family="JetBrains Mono" font-size="7" font-weight="700" text-anchor="middle">0</text>
            <text x="110" y="156" fill="#64748B" direction="ltr" unicode-bidi="bidi-override" font-family="JetBrains Mono" font-size="6.2" text-anchor="middle">(P ∧ ¬Q) → R  ≡  ¬P ∨ Q ∨ R</text>
          </svg>

          <div class="display-en" style="font-size:33pt; font-weight:700; color:#FFFFFF; line-height:0.98;">
            LOGIC <span style="color:#22D3EE;">LAB</span>
          </div>
          <div class="mono" style="font-size:7.6pt; color:#93C5FD; letter-spacing:0.28em; margin-top:2.5mm;">
            THE SCIENCE OF THINKING
          </div>
          <div style="width:26mm; height:0.35mm; background:linear-gradient(90deg, transparent, #22D3EE, transparent); margin:5mm auto;"></div>
          <div style="font-size:12.5pt; font-weight:600; color:#E2E8F0; line-height:1.5;">
            العِلم الكامن خلف التفكير المنطقي وبنية البرهان
          </div>
        </div>

        <div style="border-top:0.25mm solid rgba(56,189,248,0.28); padding-top:3.5mm; display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <div style="font-size:8.5pt; font-weight:600; color:#F8FAFC;">نسخة خاصة مُهداة إلى الدكتور محمود أحمد زاهر</div>
            <div style="font-size:7pt; color:#94A3B8; margin-top:0.6mm;">توثيق شامل للمشروع الهندسي والتطبيق التفاعلي</div>
          </div>
          <div class="mono" style="font-size:7pt; color:#22D3EE; text-align:left;">
            A5 · PRINT<br/>ARCHIVE
          </div>
        </div>
      </div>`
    }),

    /* P.02 — HALF-TITLE & PERSONAL DEDICATION (RTL Right Page: Left gutter 15.5mm) */
    wrapPage({
      id: 'p02', pageNum: 2, sectionAr: 'إهداء وبيان الطبعة', sectionEn: 'DEDICATION', dark: false,
      content: `
      <div style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
        <div style="margin-top:8mm;">
          <div class="mono" style="font-size:7.2pt; color:#0891B2; letter-spacing:0.16em;">⊢ PROPOSITIONAL STUDIO · ARCHIVE COPY</div>
          <h2 class="display-en" style="font-size:20pt; font-weight:700; color:#0B132B; margin-top:2mm;">LOGIC LAB</h2>
          <p style="font-size:9pt; color:#475569; margin-top:1mm;">مختبر الهياكل المتقطعة والدوائر المنطقية</p>
        </div>

        <div style="border:0.3mm solid rgba(15,23,42,0.14); border-radius:3mm; padding:6mm 5.5mm; background:#F4F7FA;">
          <div style="font-size:7.5pt; font-weight:700; color:#0891B2; margin-bottom:2.5mm;">إهداء شخصي</div>
          <p style="font-size:10.5pt; font-weight:600; color:#0B132B; line-height:1.72;">
            إلى الدكتور محمود أحمد زاهر،
          </p>
          <p class="body-ar" style="margin-top:2.5mm; font-size:9pt;">
            أُعدّ هذا الكتيّب بوصفه توثيقاً مطبوعاً لمشروع <span class="en-term">LOGIC LAB</span>، انطلاقاً من رغبة صادقة في تحويل مفاهيم <span class="en-term">Discrete Structures</span> من معادلات ساكنة إلى بيئة بصرية وحسابية تتيح للطالب أن يرى الفرضية، ويختبر كل احتمال، ويشاهد كيف يترجم المنطق المجرد إلى بوابة إلكترونية وبرهان جبري واضح.
          </p>
          <p class="body-ar" style="margin-top:2.5mm; font-size:9pt;">
            نأمل أن يكون هذا الإصدار المطبوع تذكاراً يليق بقاعات المحاضرات والبحث العلمي، وأن يعكس بدقة الجهد الهندسي المبذول خلف كل شاشة ومعادلة داخل التطبيق.
          </p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:3mm; font-size:7.3pt; color:#475569; border-top:0.25mm solid rgba(15,23,42,0.12); padding-top:3mm;">
          <div>
            <strong style="color:#0B132B;">الإصدار الموثّق:</strong><br/>LOGIC LAB v2.0 (24/24 Verified)
          </div>
          <div>
            <strong style="color:#0B132B;">مواصفات الطباعة:</strong><br/>A5 Portrait (148 × 210 mm) · 20 Pages
          </div>
        </div>
      </div>`
    }),

    /* P.03 — TABLE OF CONTENTS (Clickable Internal Anchors in Digital PDF!) */
    wrapPage({
      id: 'p03', pageNum: 3, sectionAr: 'فهرس المحتويات', sectionEn: 'CONTENTS', dark: false,
      content: `
      <div>
        <div class="sec-kicker">INDEX · خريطة الكتيّب</div>
        <h1 class="h1-ar" style="margin-bottom:3mm;">رحلة في عشرين صفحة</h1>
        <div>
          ${tocItems.map(it => `
            <a href="#${it.id}" class="toc-row">
              <span class="toc-num">${it.num}</span>
              <span class="toc-title">${it.ar}</span>
              <span class="toc-en">${it.en}</span>
              <span class="toc-pg">${it.pg}</span>
            </a>`).join('')}
        </div>
      </div>`
    }),

    /* P.04 — OPENING QUESTION (Dark Editorial Plate) */
    wrapPage({
      id: 'p04', pageNum: 4, sectionAr: 'سؤال يستحق التأمل', sectionEn: 'OPENING QUESTION', dark: true,
      content: `
      <div style="height:100%; display:flex; flex-direction:column; justify-content:space-between; padding:4mm 0;">
        <div class="sec-kicker">01 · نقطة البداية</div>
        <div style="margin:auto 0;">
          <div class="mono" style="font-size:8pt; color:#22D3EE; margin-bottom:4mm;">{ P ∈ {0, 1} }  ⟶  { SILICON &amp; PROOF }</div>
          <h1 class="h1-ar" style="font-size:19pt; line-height:1.42; color:#FFFFFF; margin-bottom:5mm;">
            هل يتعلّم الطالب المنطق حقّاً حين يقرأ جدول صواب مكتملاً… أم حين يرى المعادلة تتفكّك أمامه لحظة بلحظة؟
          </h1>
          <p class="body-ar" style="color:#CBD5E1; font-size:9.3pt; line-height:1.8;">
            منذ أن صاغ جورج بول قوانين الفكر في منتصف القرن التاسع عشر، تحوّلت الكلمات البشرية إلى بنية رياضية دقيقة تحكم كل معالج حاسوبي نستخدمه اليوم. ومع ذلك، ما زالت الفجوة قائمة في قاعات الدرس بين الورقة الصامتة التي تُرسم عليها الرموز، وبين الإحساس الحي بأن هذه الرموز نظام مترابط ينبض بالحياة.
          </p>
        </div>
        <div class="quote-callout" style="font-size:8.6pt;">
          يبدأ الفهم الحقيقي عندما تتحول <span class="en-term">Proposition</span> واحدة من سطر حبر جامد إلى نظام يمكن لمسه واختباره والشك في كل حالة من حالاته.
        </div>
      </div>`
    }),

    /* P.05 — THE CHALLENGE */
    wrapPage({
      id: 'p05', pageNum: 5, sectionAr: 'التحدي التعليمي', sectionEn: 'THE CHALLENGE', dark: false,
      content: `
      <div style="display:flex; flex-direction:column; gap:3.5mm; height:100%;">
        <div>
          <div class="sec-kicker">02 · تشخيص الفجوة</div>
          <h1 class="h1-ar">حين تبقى الروابط المنطقية حبيسة الشرائح الصامتة</h1>
          <p class="body-ar">
            في مقرر <span class="en-term">Discrete Structures</span>، غالباً ما يواجه الطالب أربع وحدات تبدو متفرقة: صياغة الفرضيات <span class="en-term">(Propositions)</span>، بناء جداول الصواب <span class="en-term">(Truth Tables)</span>، اختصار <span class="en-term">Boolean Algebra</span>، ثم رسم الدوائر <span class="en-term">(Logic Gates)</span>. وحين تُقدَّم هذه الوحدات في عروض ثابتة، يحفظ الطالب شكل الجدول دون أن يلاحظ أن العمود النهائي ليس إلا ترجمة لنفس الشجرة البنيوية ونفس التوصيلات الكهربائية.
          </p>
        </div>

        <!-- Minimal Contrast Diagram (HTML Headings + LTR Vector Tracks = Zero Clipping) -->
        <div class="info-card" style="padding:3mm 3.5mm; display:flex; flex-direction:column; gap:2mm;">
          <div style="font-size:7.8pt; font-weight:700; color:#0B132B;">الفرق البنيوي بين العرض التقليدي ومنهج <span class="en-term">LOGIC LAB</span></div>
          <div style="font-size:7.2pt; font-weight:600; color:#64748B;">الشرائح الثابتة: جُزر معرفية معزولة عن بعضها</div>
          <svg viewBox="0 0 360 30" dir="ltr" style="width:100%; height:auto;" xmlns="http://www.w3.org/2000/svg">
            <g fill="#E2E8F0" stroke="#94A3B8" stroke-width="0.8">
              <rect x="2" y="2" width="83" height="24" rx="4"/><rect x="93" y="2" width="83" height="24" rx="4"/>
              <rect x="184" y="2" width="83" height="24" rx="4"/><rect x="275" y="2" width="83" height="24" rx="4"/>
            </g>
            <g fill="#475569" font-family="Space Grotesk" font-size="7.2" text-anchor="middle" font-weight="600">
              <text x="43" y="17">Propositions</text><text x="134" y="17">Truth Tables</text>
              <text x="225" y="17">Boolean Laws</text><text x="316" y="17">Logic Gates</text>
            </g>
          </svg>
          <div style="border-top:0.25mm dashed #CBD5E1; padding-top:2mm; font-size:7.2pt; font-weight:700; color:#0891B2;">منهج <span class="en-term">LOGIC LAB</span>: محرّك حتمي موحّد (<span class="en-term">Deterministic Core</span>)</div>
          <svg viewBox="0 0 360 40" dir="ltr" style="width:100%; height:auto;" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="356" height="36" rx="6" fill="#040814"/>
            <g fill="#22D3EE" font-family="JetBrains Mono" font-size="7.4" text-anchor="middle" font-weight="700">
              <rect x="12" y="9" width="72" height="22" rx="3" fill="#0F1D36" stroke="#22D3EE" stroke-width="0.8"/><text x="48" y="23">Formula</text>
              <rect x="100" y="9" width="72" height="22" rx="3" fill="#0F1D36" stroke="#3B82F6" stroke-width="0.8"/><text x="136" y="23">AST &amp; 2ⁿ</text>
              <rect x="188" y="9" width="74" height="22" rx="3" fill="#0F1D36" stroke="#34D399" stroke-width="0.8"/><text x="225" y="23">Simplifier</text>
              <rect x="278" y="9" width="70" height="22" rx="3" fill="#0F1D36" stroke="#22D3EE" stroke-width="0.8"/><text x="313" y="23">IEEE DAG</text>
            </g>
            <path d="M84 20 L100 20 M172 20 L188 20 M262 20 L278 20" stroke="#22D3EE" stroke-width="1.2"/>
          </svg>
        </div>

        <p class="body-ar">
          أول سؤال يصطدم به المتعلّم عند كتابة تعبير مثل <span class="math-inline">P ∧ Q ∨ R</span> هو: أيهما يُنفَّذ أولاً؟ وفي أي صف تنقلب النتيجة إلى <span class="en-term">False</span>؟ بدون تفاعل فوري وأعمدة وسيطة، يظل هذا التساؤل معلّقاً.
        </p>
      </div>`
    }),

    /* P.06 — CENTRAL IDEA & 3D ENTRY */
    wrapPage({
      id: 'p06', pageNum: 6, sectionAr: 'الفكرة الجوهرية', sectionEn: 'CENTRAL IDEA', dark: false,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">03 · الفلسفة التصميمية</div>
          <h1 class="h1-ar">فكرة واحدة، وعشر نوافذ لرؤيتها</h1>
          <p class="body-ar">
            يقوم <span class="en-term">LOGIC LAB</span> على مبدأ بسيط: لا تقم بمحاكاة الشاشات بصورة منفصلة، بل ابنِ نواة رياضية حتمية واحدة (<span class="en-term">Deterministic Core</span>) تحسب الصواب والخطأ وتُصدّر نفس الحقيقة إلى كل أداة في المختبر. وحين تدخل التطبيق للمرة الأولى، يستقبلك مجسّم ثلاثي الأبعاد عبر <span class="en-term">Three.js WebGL</span> يُعرف بـ «المتشعّب البولياني» تتناغم حركته مع التمرير ويضم وحدة إدخال فورية باللغتين العربية والإنجليزية.
          </p>
        </div>

        <div class="screen-plate">
          <img src="${S('01_showcase_3d.png')}" alt="واجهة الانطلاق ثلاثية الأبعاد للمشروع"/>
          <div class="plate-caption">
            <span>الافتتاحية التفاعلية ثلاثية الأبعاد مع بوابة اختيار اللغة العربية والإنجليزية</span>
            <span class="mono">WebGL 0.160</span>
          </div>
        </div>

        <div class="info-card" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:2mm; text-align:center;">
          <div>
            <div class="mono" style="font-size:10pt; font-weight:700; color:#0891B2;">THINK</div>
            <div style="font-size:7.3pt; color:#334155;">صِغ الفرضية وشاهد شجرة الأولويات</div>
          </div>
          <div>
            <div class="mono" style="font-size:10pt; font-weight:700; color:#1D4ED8;">CONNECT</div>
            <div style="font-size:7.3pt; color:#334155;">تتبّع جدول الصواب ودائرة البوابات</div>
          </div>
          <div>
            <div class="mono" style="font-size:10pt; font-weight:700; color:#059669;">PROVE</div>
            <div style="font-size:7.3pt; color:#334155;">أثبت التكافؤ جبرياً خطوة بخطوة</div>
          </div>
        </div>
      </div>`
    }),

    /* P.07 — WELCOME TO THE LABORATORY (ANNOTATED FULL HUD — Dark Accent Page) */
    wrapPage({
      id: 'p07', pageNum: 7, sectionAr: 'جولة في المختبر', sectionEn: 'INSIDE THE STUDIO', dark: true,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">04 · تشريح الواجهة العلمية</div>
          <h1 class="h1-ar">مرحباً بك داخل <span class="en-term">LOGIC LAB</span></h1>
          <p class="body-ar" style="margin-bottom:2.5mm;">
            تنظيم الواجهة مستوحى من المختبرات الهندسية: شريط جانبي ثابت يضم ١٠ مساحات عمل، ومنصة وسطى متكيّفة، ودرج أيمن للمساعد الصوتي يراقب الفرضية النشطة باستمرار.
          </p>
        </div>

        <div class="screen-plate">
          <img src="${S('02_home_hub.png')}" alt="الشاشة الرئيسية لمختبر LOGIC LAB"/>
          <div class="plate-caption">
            <span>الواجهة الرئيسية <span class="mono">Home / Welcome</span> وقراءة <span class="mono">(P ∧ ¬Q) → R</span></span>
            <span class="mono">Live Specimen</span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:2mm; font-size:7.6pt;">
          <div class="info-card" style="display:flex; gap:2mm; align-items:flex-start; padding:2.2mm;">
            <span class="pin-badge">1</span>
            <div><strong>الشريط الأيسر:</strong> تنقل مباشر بين ١٠ وحدات وتدريب من ١١ درساً مع مؤشر <span class="mono">24/24 OK</span>.</div>
          </div>
          <div class="info-card" style="display:flex; gap:2mm; align-items:flex-start; padding:2.2mm;">
            <span class="pin-badge">2</span>
            <div><strong>لوحة العيّنة النشطة:</strong> تقرأ المعادلة الحالية وتعرض عدد المتغيرات ونسبة الصواب فورياً.</div>
          </div>
          <div class="info-card" style="display:flex; gap:2mm; align-items:flex-start; padding:2.2mm;">
            <span class="pin-badge">3</span>
            <div><strong>المساعد الأكاديمي الأيمن:</strong> لوحة تفاعلية تحلل السياق الحالي بالصوت أو النص.</div>
          </div>
          <div class="info-card" style="display:flex; gap:2mm; align-items:flex-start; padding:2.2mm;">
            <span class="pin-badge">4</span>
            <div><strong>وضع المحاضرة <span class="mono">(P)</span>:</strong> عرض تقديمي مباشر من ٦ مشاهد لقاعات التدريس.</div>
          </div>
        </div>
      </div>`
    }),

    /* P.08 — LANGUAGE OF LOGIC & PARSE TREE */
    wrapPage({
      id: 'p08', pageNum: 8, sectionAr: 'لغة المنطق وبناء الجمل', sectionEn: 'LANGUAGE & AST', dark: false,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">05 · التحليل النحوي للمنطق</div>
          <h1 class="h1-ar">من الفرضية الرمزية إلى شجرة الأولويات</h1>
          <p class="body-ar">
            يبدأ كل برهان من فرضية أولية تأخذ قيمة <span class="en-term">True</span> أو <span class="en-term">False</span>، وتُركَّب من خلال متغيرات (<span class="math-inline">P, Q, R, S</span>). يقوم محلّل <span class="en-term">Recursive-Descent Parser</span> في <span class="en-term">LOGIC LAB</span> بتحويل الصيغة المكتوبة إلى شجرة تحليل مجردة (<span class="en-term">AST Parse Tree</span>) تُلزم الحساب بالترتيب الرياضي الدقيق دون لبس.
          </p>
        </div>

        <table class="pub-table">
          <thead>
            <tr><th>العامل</th><th>الرمز</th><th>المستوى (الأولوية)</th><th>الوظيفة المنطقية</th></tr>
          </thead>
          <tbody>
            <tr><td><span class="en-term">NOT</span></td><td class="mono">¬ , ~ , !</td><td class="mono">5 (أعلى)</td><td>عكس القيمة المنطقية (أحادي الترابط لليمين)</td></tr>
            <tr><td><span class="en-term">AND / NAND</span></td><td class="mono">∧ , ⊼</td><td class="mono">4</td><td>الوصل؛ صائب فقط عند تحقق الطرفين معاً</td></tr>
            <tr><td><span class="en-term">XOR</span></td><td class="mono">⊕ , ^</td><td class="mono">3</td><td>أو الحصرية؛ صائب عند اختلاف الطرفين فقط</td></tr>
            <tr><td><span class="en-term">OR / NOR</span></td><td class="mono">∨ , ⊽</td><td class="mono">2</td><td>الفصل الشامل؛ صائب بتحقق أحد الطرفين على الأقل</td></tr>
            <tr><td><span class="en-term">IMPLIES</span></td><td class="mono">→ , -&gt;</td><td class="mono">1 (ليمين)</td><td>الاستلزام الشرطي؛ يكذب فقط عند <span class="mono">T → F</span></td></tr>
            <tr><td><span class="en-term">IFF (XNOR)</span></td><td class="mono">↔ , &lt;-&gt;</td><td class="mono">0 (أدنى)</td><td>التكافؤ الشرطي؛ يصدق عند تطابق القيمتين</td></tr>
          </tbody>
        </table>

        <div class="screen-plate">
          <img src="${S('03_proposition_builder.png')}" alt="وحدة بناء الفرضيات وشجرة AST"/>
          <div class="plate-caption">
            <span>وحدة <span class="mono">Proposition Builder</span> تعرِض شجرة <span class="mono">(P ∧ ¬Q) → R</span></span>
            <span class="mono">Recursive AST</span>
          </div>
        </div>
      </div>`
    }),

    /* P.09 — INSIDE THE TRUTH TABLE ENGINE */
    wrapPage({
      id: 'p09', pageNum: 9, sectionAr: 'محرّك جداول الصواب', sectionEn: 'TRUTH TABLE ENGINE', dark: false,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">06 · البرهان الشامل عبر 2ⁿ احتمالاً</div>
          <h1 class="h1-ar">كيف تُكشَف الحقيقة صفّاً بعد صف؟</h1>
          <p class="body-ar">
            يُنشئ مولّد <span class="en-term">Truth Table</span> جميع التوليفات الممكنة (<span class="math-inline">2ⁿ</span> صفّاً)، ولا يكتفي بالعمود الأخير بل يولّد أوتوماتيكياً <strong>أعمدة التعبيرات الوسيطة</strong> (مثل <span class="math-inline">¬Q</span> ثم <span class="math-inline">P ∧ ¬Q</span> قبل الوصول إلى <span class="math-inline">(P ∧ ¬Q) → R</span>). وعند النقر على أي صف، يشرح التفسير المفصّل سبب كل قيمة في ذلك الصف.
          </p>
        </div>

        <div class="screen-plate">
          <img src="${S('04_truth_table.png')}" alt="مولد جداول الصواب وأداة التحقق من التكافؤ"/>
          <div class="plate-caption">
            <span>تحليل الصف ١ والأعمدة الوسيطة لـ <span class="mono">(P ∧ ¬Q) → R</span> (تصنيف: <span class="mono">Contingency</span>)</span>
            <span class="mono">7T / 1F</span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:2mm; font-size:7.3pt;">
          <div class="info-card" style="border-top:0.7mm solid #059669;">
            <strong class="en-term" style="color:#059669;">Tautology</strong>
            <div style="margin-top:0.8mm; color:#334155;">عبارة صائبة في جميع الصفوف الممكنة مثل <span class="mono">P ∨ ¬P</span>.</div>
          </div>
          <div class="info-card" style="border-top:0.7mm solid #E11D48;">
            <strong class="en-term" style="color:#E11D48;">Contradiction</strong>
            <div style="margin-top:0.8mm; color:#334155;">عبارة خاطئة دائماً مهما تغيّرت المدخلات مثل <span class="mono">P ∧ ¬P</span>.</div>
          </div>
          <div class="info-card" style="border-top:0.7mm solid #0891B2;">
            <strong class="en-term" style="color:#0891B2;">Equivalence (≡)</strong>
            <div style="margin-top:0.8mm; color:#334155;">مقارنة تعبيرين مع تحديد أول مثال مضاد (<span class="en-term">Counterexample</span>).</div>
          </div>
        </div>
      </div>`
    }),

    /* P.10 — EXPRESSION CONVERSION STUDIO (SOP & POS) */
    wrapPage({
      id: 'p10', pageNum: 10, sectionAr: 'التحويل القياسي SOP / POS', sectionEn: 'CANONICAL CONVERSION', dark: false,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">07 · عكس المسار من الجدول إلى المعادلة</div>
          <h1 class="h1-ar">استوديو التحويل: اصنع الصيغة من مخرجاتها</h1>
          <p class="body-ar">
            في تصميم الأنظمة الرقمية، يبدأ المهندس أحياناً من الجدول المطلوب لا من المعادلة. يتيح <span class="en-term">Expression Conversion Studio</span> تعديل خانات المخرجات (<span class="math-inline">0 ↔ 1</span>) لمتغيرين أو ثلاثة، ليحسب فوراً كلّاً من الصيغة القياسية <span class="en-term">Canonical SOP</span> (<span class="math-inline">Σm</span>) والصيغة القياسية <span class="en-term">Canonical POS</span> (<span class="math-inline">ΠM</span>) مع التحقق التلقائي من تطابقهما.
          </p>
        </div>

        <div class="screen-plate">
          <img src="${S('07_converter_studio.png')}" alt="استوديو التحويل القياسي SOP و POS"/>
          <div class="plate-caption">
            <span>تخليق صيغتَي <span class="mono">P·Q' + P'·Q</span> و <span class="mono">(P'+Q')·(P+Q)</span> لعملية <span class="mono">XOR</span></span>
            <span class="mono">Verified Match</span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5mm; font-size:7.6pt;">
          <div class="info-card">
            <strong style="color:#1D4ED8;">مجموع المضروبات — <span class="en-term">SOP (Σm)</span></strong>
            <div style="color:#334155; margin-top:1mm; line-height:1.55;">يلتقط كل صف قيمته <span class="mono">1</span> (<span class="en-term">Minterm</span>) ويربط الحدود بعامل <span class="mono">OR</span>، مثل صفَي <span class="mono">(1,2)</span> لدالة <span class="mono">XOR</span>.</div>
          </div>
          <div class="info-card">
            <strong style="color:#0891B2;">مضروب المجموعات — <span class="en-term">POS (ΠM)</span></strong>
            <div style="color:#334155; margin-top:1mm; line-height:1.55;">يلتقط كل صف قيمته <span class="mono">0</span> (<span class="en-term">Maxterm</span>) بحدود معكوسة، ثم يربطها مباشرة عبر <span class="mono">AND</span> لفتحها في المحاكي.</div>
          </div>
        </div>
      </div>`
    }),

    /* P.11 — FROM LOGIC TO SILICON: LOGIC GATES SIMULATOR (Dark Accent Page) */
    wrapPage({
      id: 'p11', pageNum: 11, sectionAr: 'من الرياضيات إلى السيليكون', sectionEn: 'LOGIC GATES LAB', dark: true,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">08 · محاكاة البوابات الإلكترونية</div>
          <h1 class="h1-ar">حين تتجسّد المعادلة في دوائر <span class="en-term">IEEE</span> حية</h1>
          <p class="body-ar">
            يحوّل المترجم <span class="math-inline">astToCircuit</span> شجرة المعادلة إلى رسم متجهي تفاعلي وفق رموز <span class="en-term">IEEE</span> لسبع بوابات أساسية (<span class="mono">AND, OR, NOT, NAND, NOR, XOR, XNOR</span>). ويمكن للطالب النقر على مفاتيح الإدخال <span class="math-inline">P, Q, R</span> مباشرة لمشاهدة نبضات الجهد العالي (<span class="mono">HIGH = 1</span>) تسري عبر الأسلاك، أو بناء دائرة مخصصة وقراءة تعبيرها المنطقي العكسي.
          </p>
        </div>

        <div class="screen-plate">
          <img src="${S('05_logic_gates.png')}" alt="محاكي البوابات المنطقية"/>
          <div class="plate-caption">
            <span>تصميم حي لصيغة <span class="mono">(P ⊕ Q) ∧ ¬R</span> والتحقق المتطابق عبر <span class="mono">Circuit → Boolean</span></span>
            <span class="mono">OUT = 1 (TRUE)</span>
          </div>
        </div>

        <div class="quote-callout" style="font-size:8.2pt;">
          كل تغيير في أحد المدخلات لا يغيّر النتيجة النهائية فحسب، بل يضيء المسار الفيزيائي الفعلي عبر بوابات <span class="mono">XOR</span> و <span class="mono">NOT</span> و <span class="mono">AND</span> ويختبر التطابق على جميع صفوف الجدول.
        </div>
      </div>`
    }),

    /* P.12 — BOOLEAN ALGEBRA LAB */
    wrapPage({
      id: 'p12', pageNum: 12, sectionAr: 'جمال الجبر البولياني', sectionEn: 'BOOLEAN ALGEBRA', dark: false,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">09 · الاختصار والبرهان الخطوة-بخطوة</div>
          <h1 class="h1-ar">تبسيط المعادلات عبر ١٠ عائلات قوانين موثّقة</h1>
          <p class="body-ar">
            التعبير المعقد يكلّف بوابات إلكترونية أكثر. يطبّق مختبر <span class="en-term">Boolean Algebra Lab</span> خطوات اختصار رياضية صحيحة على العبارة المدخلة مع تسمية القانون عند كل خطوة، متبوعةً بجدول صواب مقارن جنباً إلى جنب بين الصيغة الأصلية والمختصرة.
          </p>
        </div>

        <div class="screen-plate">
          <img src="${S('06_boolean_lab.png')}" alt="مختبر الجبر البولياني والبرهان ثلاثي الخطوات"/>
          <div class="plate-caption">
            <span>اختصار <span class="mono">(P ∧ Q) ∨ (P ∧ ¬Q)</span> إلى <span class="mono">P</span> عبر قوانين التوزيع والتكميل والحياد</span>
            <span class="mono">✓ Equivalent</span>
          </div>
        </div>

        <div class="info-card" style="padding:2.2mm 2.8mm;">
          <div style="font-size:7.3pt; font-weight:700; color:#0B132B; margin-bottom:1.2mm;">عائلات القوانين العشر المطبّقة داخل المحرّك:</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.8mm 3mm; font-size:7pt; color:#334155;">
            <div>01. <span class="en-term">Identity</span> <span class="mono">(P∧T≡P)</span></div>
            <div>06. <span class="en-term">Commutative</span> <span class="mono">(P∧Q≡Q∧P)</span></div>
            <div>02. <span class="en-term">Domination</span> <span class="mono">(P∨T≡T)</span></div>
            <div>07. <span class="en-term">Associative</span> <span class="mono">(P∧Q)∧R≡P∧(Q∧R)</span></div>
            <div>03. <span class="en-term">Idempotent</span> <span class="mono">(P∧P≡P)</span></div>
            <div>08. <span class="en-term">Distributive</span> <span class="mono">P∧(Q∨R)</span></div>
            <div>04. <span class="en-term">Double Negation</span> <span class="mono">(¬¬P≡P)</span></div>
            <div>09. <span class="en-term">De Morgan's</span> <span class="mono">¬(P∧Q)≡¬P∨¬Q</span></div>
            <div>05. <span class="en-term">Complement</span> <span class="mono">(P∨¬P≡T)</span></div>
            <div>10. <span class="en-term">Absorption</span> <span class="mono">P∨(P∧Q)≡P</span></div>
          </div>
        </div>
      </div>`
    }),

    /* P.13 — OPEN PLAYGROUND & BILINGUAL 6-CHAPTER STORY */
    wrapPage({
      id: 'p13', pageNum: 13, sectionAr: 'المختبر الموحّد والقصة التفاعلية', sectionEn: 'PLAYGROUND & STORY', dark: false,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">10 · تجربة متصلة متعددة المسارات</div>
          <h1 class="h1-ar">صيغة واحدة تحرّك ثلاثة عوالم معاً</h1>
          <p class="body-ar">
            في <span class="en-term">Open Logic Playground</span>، يقود شريط الصيغة الوحيد كلّاً من جدول الصواب والدائرة الإلكترونية والمُبسّط الجبري في وقت واحد. وبالموازاة، يوفّر التطبيق «مسرح القصة التفاعلي» المكوّن من ٦ فصول متصلة باللغتين العربية والإنجليزية.
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:3.2mm;">
          <div class="screen-plate compact">
            <img src="${S('08_unified_playground.png')}" alt="المختبر المفتوح مع المساعد الذكي"/>
            <div class="plate-caption">
              <span>ساحة <span class="mono">Logic Playground</span> تعرض الجدول والدائرة والتبسيط وإجابة المساعد</span>
              <span class="mono">3-Way Sync</span>
            </div>
          </div>

          <div class="screen-plate compact">
            <img src="${S('09_story_ch4_ar.png')}" alt="الفصل الرابع من القصة التفاعلية باللغة العربية"/>
            <div class="plate-caption">
              <span>الفصل الرابع من القصة العربية التفاعلية: الدائرة الكهربائية الحية</span>
              <span class="mono">Chapter 4 / 6 AR</span>
            </div>
          </div>
        </div>
      </div>`
    }),

    /* P.14 — GUIDED LEARNING, CHALLENGES & PRESENTATION MODE */
    wrapPage({
      id: 'p14', pageNum: 14, sectionAr: 'التعلّم والتحديات والمحاضرة', sectionEn: 'ACADEMY & CHALLENGES', dark: false,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">11 · من المبتدئ إلى قاعة المحاضرات</div>
          <h1 class="h1-ar">١١ درساً موجّهاً، تحديات متدرّجة، ومنصة عرض</h1>
          <p class="body-ar">
            يدعم التطبيق ثلاثة مسارات تعليمية متكاملة: منهج <span class="en-term">Guided Learning</span> المكوّن من ١١ درساً تفاعلياً مع أسئلة فورية، ووضع <span class="en-term">Live Challenges</span> عبر ٣ مستويات <span class="en-term">(Beginner · Intermediate · Advanced)</span> مع كشف البرهان الكامل، إضافة إلى وضع <span class="en-term">Presentation Mode</span> المخصص للعرض داخل المدرّجات الجامعية.
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:3.2mm;">
          <div class="screen-plate compact">
            <img src="${S('11_challenges.png')}" alt="ساحة التحديات الحية والبرهان"/>
            <div class="plate-caption">
              <span>تحدّي تصنيف <span class="mono">P ∧ ¬P</span> إلى <span class="mono">Contradiction</span> مع جدول الصواب والدائرة</span>
              <span class="mono">3 Tiers Verified</span>
            </div>
          </div>

          <div class="screen-plate compact">
            <img src="${S('10_presentation_mode.png')}" alt="وضع العرض التقديمي للدكتور"/>
            <div class="plate-caption">
              <span>وضع <span class="mono">Professor Presentation Mode</span> — ٦ مشاهد تُدار بلوحة المفاتيح</span>
              <span class="mono">Shortcut: P / Esc</span>
            </div>
          </div>
        </div>
      </div>`
    }),

    /* P.15 — MEET THE VOICE & AI ASSISTANT (Dark Feature Page) */
    wrapPage({
      id: 'p15', pageNum: 15, sectionAr: 'المساعد الأكاديمي والصوت الذكي', sectionEn: 'ACADEMIC ASSISTANT', dark: true,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">12 · التفاعل الصوتي والتحليل السياقي</div>
          <h1 class="h1-ar">مساعد يعرف السياق، ولا يخترع إجابة رياضية</h1>
          <p class="body-ar">
            يعتمد <span class="en-term">Academic Voice Guide</span> على قاعدة تصميمية صارمة: فهم السياق أو استنتاج الكلام الطبيعي غير المتقن يستعين بالذكاء الاصطناعي، أما التحقق الرياضي نفسه فيمرّ دائماً عبر المحرك المحلي <span class="mono">LogicEngine</span> دون هلوسة.
          </p>
        </div>

        <div style="display:grid; grid-template-columns:1fr; gap:2.5mm;">
          <div class="info-card">
            <div class="mono" style="font-size:7.5pt; color:#22D3EE; margin-bottom:1mm;">01 · CONTEXT-AWARE ENGINE (answerInContext)</div>
            <p class="body-ar" style="font-size:8pt; color:#CBD5E1;">
              يتتبع المساعد الشاشة النشطة والمعادلة الحالية؛ فيستجيب لأسئلة مثل <em>«لماذا العمود النهائي خطأ؟»</em> بتحديد رقم الصف وتظليله، أو <em>«اشرح قانون دي مورغان ببساطة»</em>، أو رصد العبارات الغامضة مثل <span class="mono">P and Q or R</span> وطلب التوضيح.
            </p>
          </div>
          <div class="info-card">
            <div class="mono" style="font-size:7.5pt; color:#34D399; margin-bottom:1mm;">02 · ELEVENLABS NATURAL VOICE + CACHING</div>
            <p class="body-ar" style="font-size:8pt; color:#CBD5E1;">
              يدعم النطق الطبيعي عبر <span class="en-term">ElevenLabs</span> (<span class="mono">eleven_multilingual_v2</span> للسرد العربي والإنجليزي، و<span class="mono">eleven_flash_v2_5</span> للردود السريعة) مع تخزين مؤقت في <span class="mono">IndexedDB</span> وبديل صامت أو متصفح عند غياب الخادم.
            </p>
          </div>
          <div class="info-card">
            <div class="mono" style="font-size:7.5pt; color:#93C5FD; margin-bottom:1mm;">03 · SPEECH-TO-LOGIC &amp; WEAK-MIC RECOVERY</div>
            <p class="body-ar" style="font-size:8pt; color:#CBD5E1;">
              باستخدام <span class="en-term">Web Speech API</span> مع بدائل نطقية (<span class="mono">maxAlternatives = 5</span>)، يجمع المحلل بين القواعد الصوتية ونموذج <span class="en-term">Gemini Flash</span> لتصحيح النطق المشوش مثل تحويل عبارة <em>«B&amp;Q or not be and not or»</em> إلى <span class="mono">P ∧ Q ∨ ¬P ∧ ¬R</span>.
            </p>
          </div>
        </div>

        <div class="quote-callout" style="font-size:7.8pt;">
          <strong>توضيح أمين:</strong> يعتمد الالتقاط الصوتي بالمايكروفون على إذن المتصفح ودعم <span class="mono">SpeechRecognition</span>، كما يتطلب الصوت الطبيعي <span class="en-term">ElevenLabs</span> تشغيل الخادم المحلي <span class="mono">server/server.js</span> أو تزويد مفتاح جلسة.
        </div>
      </div>`
    }),

    /* P.16 — BEHIND THE EXPERIENCE: TECHNICAL ARCHITECTURE */
    wrapPage({
      id: 'p16', pageNum: 16, sectionAr: 'البنية التقنية ونظام التصميم', sectionEn: 'ARCHITECTURE & SYSTEM', dark: false,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">13 · الهندسة المعمارية</div>
          <h1 class="h1-ar">كيف تتكامل الأجزاء دون تعقيد البناء؟</h1>
          <p class="body-ar">
            صُمّم <span class="en-term">LOGIC LAB</span> للعمل فوراً بفتح ملف <span class="mono">index.html</span> وحده دون خطوات <span class="mono">Build</span> معقدة، بينما تبقى النواة الرياضية <span class="mono">src/logicEngine.js</span> مفصولة للاختبار المؤتمت بـ <span class="mono">Node.js</span>، ويعمل <span class="mono">server/server.js</span> كوسيط خفيف يحمي مفاتيح الصوت على الخادم.
          </p>
        </div>

        <!-- Custom Architecture Blueprint Diagram (LTR isolated SVG) -->
        <div class="info-card" style="padding:3mm;">
          <svg viewBox="0 0 360 120" dir="ltr" style="width:100%; height:auto;" xmlns="http://www.w3.org/2000/svg">
            <rect x="235" y="10" width="118" height="44" rx="5" fill="#0B132B"/>
            <text x="294" y="29" fill="#22D3EE" font-family="Space Grotesk" font-size="8.2" font-weight="700" text-anchor="middle">Browser UI (index.html)</text>
            <text x="294" y="42" fill="#94A3B8" direction="ltr" unicode-bidi="bidi-override" font-family="JetBrains Mono" font-size="6.4" text-anchor="middle">10 Views · Three.js · SVG</text>

            <rect x="235" y="70" width="118" height="40" rx="5" fill="#1E293B"/>
            <text x="294" y="88" fill="#34D399" font-family="Space Grotesk" font-size="8" font-weight="700" text-anchor="middle">LogicEngine Core</text>
            <text x="294" y="100" fill="#CBD5E1" direction="ltr" unicode-bidi="bidi-override" font-family="JetBrains Mono" font-size="6.4" text-anchor="middle">AST · 2ⁿ · SOP/POS · DAG</text>

            <rect x="8" y="10" width="142" height="44" rx="5" fill="#EFF6FF" stroke="#2563EB" stroke-width="0.9"/>
            <text x="79" y="29" fill="#1E3A8A" font-family="Space Grotesk" font-size="8.2" font-weight="700" text-anchor="middle">Node Proxy (server.js)</text>
            <text x="79" y="42" fill="#475569" direction="ltr" unicode-bidi="bidi-override" font-family="JetBrains Mono" font-size="6.3" text-anchor="middle">/api/voice/speak · signed-url</text>

            <rect x="8" y="70" width="142" height="40" rx="5" fill="#F1F5F9" stroke="#64748B" stroke-width="0.9"/>
            <text x="79" y="88" fill="#0F172A" font-family="Space Grotesk" font-size="8" font-weight="700" text-anchor="middle">Node Unit Tests (24/24)</text>
            <text x="79" y="100" fill="#475569" direction="ltr" unicode-bidi="bidi-override" font-family="JetBrains Mono" font-size="6.3" text-anchor="middle">tests/logicEngine.test.js</text>

            <line x1="235" y1="32" x2="150" y2="32" stroke="#2563EB" stroke-width="1.2"/>
            <line x1="294" y1="54" x2="294" y2="70" stroke="#0891B2" stroke-width="1.4"/>
            <line x1="235" y1="90" x2="150" y2="90" stroke="#059669" stroke-width="1.2"/>
          </svg>
        </div>

        <!-- Brand Color Swatches -->
        <div>
          <div style="font-size:7.6pt; font-weight:700; color:#0B132B; margin-bottom:2mm;">نظام الألوان والمكونات البصرية (<span class="en-term">Visual Identity Tokens</span>)</div>
          <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:2mm;">
            <div style="text-align:center;"><div style="height:8.5mm; border-radius:1.5mm; background:#030712;"></div><div class="mono" style="font-size:6.2pt; margin-top:1mm;">#030712</div></div>
            <div style="text-align:center;"><div style="height:8.5mm; border-radius:1.5mm; background:#081022;"></div><div class="mono" style="font-size:6.2pt; margin-top:1mm;">#081022</div></div>
            <div style="text-align:center;"><div style="height:8.5mm; border-radius:1.5mm; background:#22D3EE;"></div><div class="mono" style="font-size:6.2pt; margin-top:1mm;">#22D3EE</div></div>
            <div style="text-align:center;"><div style="height:8.5mm; border-radius:1.5mm; background:#2563EB;"></div><div class="mono" style="font-size:6.2pt; margin-top:1mm;">#2563EB</div></div>
            <div style="text-align:center;"><div style="height:8.5mm; border-radius:1.5mm; background:#10B981;"></div><div class="mono" style="font-size:6.2pt; margin-top:1mm;">#10B981</div></div>
          </div>
        </div>
      </div>`
    }),

    /* P.17 — VERIFICATION, GITHUB ACCESS & LIVE QR SUITE */
    wrapPage({
      id: 'p17', pageNum: 17, sectionAr: 'التحقق الهندسي والروابط المباشرة', sectionEn: 'VERIFICATION & QR LINKS', dark: false,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">14 · سجل الشفافية والوصول السريع</div>
          <h1 class="h1-ar">التحقق الهندسي وروابط التجربة الحية</h1>
          <p class="body-ar" style="font-size:8.4pt;">
            يميز هذا الجدول بوضوح بين القدرات المختبرة محلياً وعبر الويب، وبين الخدمات السحابية التي تتطلب مفاتيح تشغيل خاصة:
          </p>
        </div>

        <table class="pub-table">
          <thead>
            <tr><th>المكوّن / الخاصية</th><th>الحالة الموثّقة</th><th>التحقق الميداني</th></tr>
          </thead>
          <tbody>
            <tr><td>المحرك الرياضي وجداول <span class="mono">2ⁿ</span> والـ <span class="mono">AST</span></td><td><strong style="color:#059669;">مكتمل</strong></td><td class="mono">24 / 24 Passed</td></tr>
            <tr><td>محاكاة <span class="mono">7</span> بوابات وعكس الدائرة</td><td><strong style="color:#059669;">مكتمل</strong></td><td class="mono">DAG Equivalence ✓</td></tr>
            <tr><td>الاختصار الجبري (<span class="mono">10</span> قوانين) و<span class="mono">SOP/POS</span></td><td><strong style="color:#059669;">مكتمل</strong></td><td class="mono">Row-Verified ✓</td></tr>
            <tr><td>مستودع <span class="en-term">GitHub</span> وواجهة الويب والكتيّب</td><td><strong style="color:#059669;">منشور متاح</strong></td><td class="mono">GitHub &amp; Pages ✓</td></tr>
            <tr><td>صوت <span class="en-term">ElevenLabs</span> وتحليل <span class="en-term">Gemini</span></td><td><strong style="color:#0891B2;">يعتمد على <span class="mono">.env</span></strong></td><td>عبر <span class="mono">server.js</span> أو مفتاح الجلسة</td></tr>
          </tbody>
        </table>

        <!-- Verified Triple QR Grid: Live App + Interactive Book + GitHub Repository -->
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:2.2mm;">
          <a href="https://abdulrahmanghoneam-debug.github.io/logic-lab/" class="info-card" style="text-decoration:none; text-align:center; padding:2.2mm 1.5mm; display:flex; flex-direction:column; align-items:center; gap:1.2mm; border-top:0.65mm solid #0891B2;">
            <img src="${QR_APP}" alt="QR Code Live App" style="width:20.5mm; height:20.5mm; border-radius:1mm; border:0.2mm solid #CBD5E1;"/>
            <strong style="font-size:7pt; color:#0B132B;">التجربة الحية للتطبيق</strong>
            <span class="mono" style="font-size:5.4pt; color:#0891B2;">github.io/logic-lab</span>
          </a>
          <a href="https://abdulrahmanghoneam-debug.github.io/logic-lab/LOGIC_LAB_INTERACTIVE_EDITION.html" class="info-card" style="text-decoration:none; text-align:center; padding:2.2mm 1.5mm; display:flex; flex-direction:column; align-items:center; gap:1.2mm; border-top:0.65mm solid #1D4ED8;">
            <img src="${QR_BOOK}" alt="QR Code Interactive Booklet" style="width:20.5mm; height:20.5mm; border-radius:1mm; border:0.2mm solid #CBD5E1;"/>
            <strong style="font-size:7pt; color:#0B132B;">الكتيّب التفاعلي الرقمي</strong>
            <span class="mono" style="font-size:5.4pt; color:#1D4ED8;">Interactive Book</span>
          </a>
          <a href="https://github.com/abdulrahmanghoneam-debug/logic-lab" class="info-card" style="text-decoration:none; text-align:center; padding:2.2mm 1.5mm; display:flex; flex-direction:column; align-items:center; gap:1.2mm; border-top:0.65mm solid #059669;">
            <img src="${QR_GH}" alt="QR Code GitHub Repository" style="width:20.5mm; height:20.5mm; border-radius:1mm; border:0.2mm solid #CBD5E1;"/>
            <strong style="font-size:7pt; color:#0B132B;">مستودع الكود والملفات</strong>
            <span class="mono" style="font-size:5.4pt; color:#059669;">GitHub Repository</span>
          </a>
        </div>
        <div style="font-size:6.8pt; color:#475569; text-align:center;">
          وللتشغيل الكامل مع خادم الصوت أو <span class="mono">Docker</span> محلياً: <span class="mono">http://localhost:3000/</span> عبر <span class="mono">node server/server.js</span>
        </div>
      </div>`
    }),

    /* P.18 — ONE PROJECT, MANY POSSIBILITIES (FUTURE HORIZONS) */
    wrapPage({
      id: 'p18', pageNum: 18, sectionAr: 'آفاق التطوير المستقبلية', sectionEn: 'FUTURE HORIZONS', dark: false,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">15 · ما بعد الإصدار الثاني</div>
          <h1 class="h1-ar">مشروع واحد، وآفاق قابلة للبناء عليها</h1>
          <p class="body-ar">
            بينما يغطي <span class="en-term">LOGIC LAB v2.0</span> كامل أساسيات المنطق القضوي والجبر البولياني والبوابات الرقمية، تفتح معماريته المفصولة الباب أمام أربعة امتدادات أكاديمية واضحة دون المساس بنواته الحالية:
          </p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:3mm;">
          <div class="info-card">
            <div class="mono" style="font-size:7pt; color:#0891B2;">NEXT · 01</div>
            <strong style="font-size:8.6pt; color:#0B132B;">خرائط كارنو (<span class="en-term">K-Maps</span>)</strong>
            <p class="body-ar" style="font-size:7.6pt; margin-top:1mm;">توليد تجمّعات <span class="mono">2, 4, 8</span> بصرياً انطلاقاً من مخرجات جدول الصواب لتبسيط الدوائر بمرونة أكبر.</p>
          </div>
          <div class="info-card">
            <div class="mono" style="font-size:7pt; color:#1D4ED8;">NEXT · 02</div>
            <strong style="font-size:8.6pt; color:#0B132B;">منطق المحمولات (<span class="mono">∀, ∃</span>)</strong>
            <p class="body-ar" style="font-size:7.6pt; margin-top:1mm;">الانتقال من <span class="en-term">Propositional Logic</span> إلى <span class="en-term">Predicate Logic</span> وقواعد الاستدلال الكمي.</p>
          </div>
          <div class="info-card">
            <div class="mono" style="font-size:7pt; color:#059669;">NEXT · 03</div>
            <strong style="font-size:8.6pt; color:#0B132B;">تصدير أوراق برهان <span class="mono">LaTeX</span></strong>
            <p class="body-ar" style="font-size:7.6pt; margin-top:1mm;">تمكين الأستاذ والطالب من استخراج جدول الصواب أو إثبات التبسيط ككود <span class="mono">LaTeX</span> جاهز للأبحاث.</p>
          </div>
          <div class="info-card">
            <div class="mono" style="font-size:7pt; color:#64748B;">NEXT · 04</div>
            <strong style="font-size:8.6pt; color:#0B132B;">خادم صوت سحابي متكامل</strong>
            <p class="body-ar" style="font-size:7.6pt; margin-top:1mm;">استضافة حاوية <span class="mono">Docker</span> الخادمة للوسيط <span class="mono">server.js</span> لتوفير الصوت الطبيعي للطلبة دون إعداد محلي.</p>
          </div>
        </div>

        <div class="quote-callout" style="font-size:8.2pt;">
          كل إضافة مقترحة هنا تبنى فوق بنية واضحة قائمة بالفعل (<span class="mono">src/logicEngine.js</span>)، وتخضع لنفس فلسفة الصرامة والاختبار قبل العرض.
        </div>
      </div>`
    }),

    /* P.19 — COLOPHON & TECHNICAL INDEX */
    wrapPage({
      id: 'p19', pageNum: 19, sectionAr: 'بيان الإصدار والتوثيق', sectionEn: 'COLOPHON', dark: false,
      content: `
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
        <div>
          <div class="sec-kicker">16 · بطاقة النشر والملفات</div>
          <h1 class="h1-ar">بيان المشروع ومكوّنات الحزمة</h1>
          <p class="body-ar">
            تم تصميم وإخراج هذا الكتيّب من واقع الشفرة الفعلية للتطبيق وعبر لقطات حية التُقطت مباشرة أثناء التشغيل بدقة الطباعة، ليكون وثيقة مرجعية كاملة لملكية المشروع ومكوناته.
          </p>
        </div>

        <table class="pub-table">
          <thead><tr><th>الملف / المصدر في المستودع</th><th>الدور الوظيفي</th></tr></thead>
          <tbody>
            <tr><td class="mono">index.html</td><td>الواجهة الكاملة، المشهد ثلاثي الأبعاد، الـ <span class="mono">10</span> وحدات، والقصة الصوتية</td></tr>
            <tr><td class="mono">src/logicEngine.js</td><td>النواة الرياضية الحتمية <span class="mono">(Parser, 2ⁿ, SOP/POS, DAG, Simplifier)</span></td></tr>
            <tr><td class="mono">tests/logicEngine.test.js</td><td>حزمة الاختبارات التلقائية (<span class="mono">24</span> اختباراً ناجحاً بنسبة <span class="mono">100%</span>)</td></tr>
            <tr><td class="mono">server/server.js</td><td>خادم <span class="mono">Node.js</span> الوسيط الآمن لتشغيل واجهة <span class="en-term">ElevenLabs</span> الصوتية</td></tr>
            <tr><td class="mono">LOGIC_LAB_BOOKLET_SOURCE/</td><td>المصدر الكامل القابل للتعديل للكتيّب مع الصور والمخططات المتجهة</td></tr>
          </tbody>
        </table>

        <div class="info-card" style="font-size:7.6pt; line-height:1.65;">
          <strong>الخطوط المستخدمة في الإخراج الطباعي:</strong><br/>
          النصوص العربية: <span class="en-term">IBM Plex Sans Arabic</span> · العناوين اللاتينية: <span class="en-term">Space Grotesk &amp; Manrope</span> · الصيغ والرموز: <span class="en-term">JetBrains Mono</span>.
          <div style="margin-top:1.5mm; color:#475569;">مقاس القطع: <span class="mono">A5 (148 × 210 mm)</span> · هامش القص للطباعة: <span class="mono">3 mm</span> · التجليد: <span class="en-term">Saddle-Stitch</span> (تخريز وسطي — <span class="mono">20</span> صفحة).</div>
        </div>
      </div>`
    }),

    /* P.20 — BACK COVER & FINAL THOUGHT FOR DR. MAHMOUD */
    wrapPage({
      id: 'p20', pageNum: 20, dark: true, isCover: true,
      content: `
      <div style="height:100%; padding:15mm 14mm; display:flex; flex-direction:column; justify-content:space-between; text-align:center;">
        <div class="mono" style="font-size:7pt; color:#64748B; letter-spacing:0.22em;">LOGIC LAB · BACK COVER</div>

        <div style="margin:auto 0; padding:0 4mm;">
          <div style="width:14mm; height:14mm; margin:0 auto 5mm; border-radius:3mm; border:0.35mm solid rgba(34,211,238,0.45); background:#081229; display:flex; align-items:center; justify-content:center;" class="mono">
            <span style="font-size:15pt; font-weight:700; color:#22D3EE;">⊢</span>
          </div>
          <p style="font-size:12pt; font-weight:600; color:#F8FAFC; line-height:1.8;">
            «المنطق لا يُعلّمنا فقط كيف نصل إلى الإجابة الصحيحة؛ بل يعلّمنا كيف نرى الطريق كلّه، خطوةً بعد خطوة، بلا غموض.»
          </p>
          <div style="width:20mm; height:0.3mm; background:#22D3EE; margin:5mm auto; opacity:0.65;"></div>
          <p style="font-size:8.6pt; color:#94A3B8; line-height:1.75;">
            أُهديت هذه النسخة التوثيقية إلى <strong style="color:#E2E8F0;">الدكتور محمود أحمد زاهر</strong> تقديراً لمساحة التساؤل والتعلّم التي يفتحها علم <span class="en-term">Discrete Structures</span> في نفوس طلابه.
          </p>
        </div>

        <div style="border-top:0.25mm solid rgba(56,189,248,0.22); padding-top:4mm; display:flex; justify-content:space-between; align-items:center;">
          <span class="display-en" style="font-size:8.5pt; font-weight:700; color:#F8FAFC;">LOGIC <span style="color:#22D3EE;">LAB</span></span>
          <span class="mono" style="font-size:6.8pt; color:#64748B; letter-spacing:0.16em;">THINK. CONNECT. PROVE.</span>
        </div>
      </div>`
    })
  ];
}

module.exports = { buildAllPages, CROP_MARKS_SVG };
