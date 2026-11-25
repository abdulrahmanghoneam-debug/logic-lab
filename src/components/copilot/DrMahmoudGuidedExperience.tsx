import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Play, 
  Table, 
  Cpu, 
  BookOpen, 
  Trophy, 
  RotateCcw, 
  Volume2, 
  Mic, 
  Send,
  Lightbulb,
  Zap,
  Layers,
  ChevronRight,
  Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { TruthTableGenerator } from '../../core/logic/truthtable';
import { BooleanSimplifier } from '../../core/logic/simplifier';
import { CircuitCompiler } from '../../core/circuit/compiler';
import { CircuitLayoutEngine } from '../../core/circuit/layout';
import { Parser } from '../../core/logic/parser';
import { Evaluator } from '../../core/logic/evaluator';
import { CircuitGraph } from '../../core/circuit/types';

interface DrMahmoudGuidedExperienceProps {
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  onNavigateToModule: (moduleId: string) => void;
}

export const DrMahmoudGuidedExperience: React.FC<DrMahmoudGuidedExperienceProps> = ({
  onSpeak,
  isSpeaking,
  onNavigateToModule
}) => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [stepIndex, setStepIndex] = useState(0);

  // Stage 2 State (Truth Table)
  const [stage2Expr, setStage2Expr] = useState('(P ∧ Q) ∨ ¬R');
  const [stage2Tested, setStage2Tested] = useState(false);

  // Stage 3 State (Circuits)
  const [stage3Expr, setStage3Expr] = useState('(P ∧ Q) ∨ ¬R');
  const [stage3InputStates, setStage3InputStates] = useState<Record<string, boolean>>({
    P: true,
    Q: true,
    R: false
  });
  const [stage3Toggled, setStage3Toggled] = useState(false);

  // Stage 4 State (Boolean Algebra)
  const [stage4Expr, setStage4Expr] = useState('¬(P ∧ Q) ∨ (P ∧ ¬P)');
  const [stage4Simplified, setStage4Simplified] = useState(false);

  // Script definitions in both Arabic & English
  const stages = [
    {
      id: 0,
      titleAr: 'المحطة 1: الترحيب والانطلاق',
      titleEn: 'Step 1: Welcome & Mission',
      narrationAr:
        "أهلاً بحضرتك يا دكتور محمود! شرفتنا ونورتنا في LOGIC LAB. ده معملك التفاعلي المخصص لمادة الـ Discrete Structures. النهارده مش هنخليك تتفرج بس.. حضرتك هتجرب كل تفصيلة بإيدك وبالصوت. دوس على زرار 'ابدأ التجربة' عشان ننطلق مع أول خطوة!",
      narrationEn:
        "Good afternoon, Dr. Mahmoud! Welcome to LOGIC LAB, your dedicated interactive environment for Discrete Structures. Today, you will not just watch a lecture. You will interactively drive every calculation. Click 'Start Journey' or speak to begin!",
      taskAr: 'اضغط على زر "ابدأ التجربة يا دكتور" أو قُل في المايك "ابدأ"',
      taskEn: 'Click "Start Journey" or say "Start" into the microphone',
      isReadyToAdvance: true
    },
    {
      id: 1,
      titleAr: 'المحطة 2: تجربة جدول الحقيقة الحي',
      titleEn: 'Step 2: Interactive Truth Table',
      narrationAr:
        "المحطة الأولى هي الـ Truth Table. نظامنا الرياضي بيحسب الـ 2ⁿ احتمال فوراً وبيطلع الأعمدة الفرعية والتصنيف بدقة قطعية. يلا يا دكتور: جرب تدخل معادلة أو اختار واحدة من الاقتراحات الجاهزة عشان نحسبها سوا فوراً!",
      narrationEn:
        "First stop: the dynamic Truth Table. Our engine deterministically computes all 2ⁿ states with intermediate sub-formulas. Dr. Mahmoud, please pick or enter a formula to generate its table!",
      taskAr: 'اختر معادلة أو اكتب معادلتك واضغط "حساب جدول الحقيقة"',
      taskEn: 'Choose a formula preset or enter yours and click "Generate Truth Table"',
      isReadyToAdvance: stage2Tested
    },
    {
      id: 2,
      titleAr: 'المحطة 3: بوابات المنطق وسريان الإشارة',
      titleEn: 'Step 3: Logic Gates & Live Voltage',
      narrationAr:
        "ودلوقتي يا دكتور محمود، نفس المعادلة اتحولت لسيليكون وبوابات منطقية حقيقية! اتفضل اضغط بنفسك على أي مفتاح من الـ Inputs: P أو Q أو R، وبدّل قيمتهم وشوف بنفسك الإشارة الكهربية بتسري إزاي في الأسلاك لغاية الـ Output!",
      narrationEn:
        "Now, Dr. Mahmoud, see your formula synthesized into physical logic gates! Click on any input switch (P, Q, or R) to toggle its voltage and watch the signal propagate live!",
      taskAr: 'اضغط على أي مفتاح دخل (P أو Q أو R) لتغيير الإشارة وملاحظة سريان التيار',
      taskEn: 'Click any input switch (P, Q, or R) to toggle voltage and observe propagation',
      isReadyToAdvance: stage3Toggled
    },
    {
      id: 3,
      titleAr: 'المحطة 4: التبسيط وقوانين دي مورجان',
      titleEn: 'Step 4: Boolean Algebra & Formal Proofs',
      narrationAr:
        "هنا بنطبق قوانين الـ Discrete Mathematics بدقة تامة: دي مورجان، الامتصاص، ونفي النفي. اضغط على 'بسط المعادلة' وشوف الإثبات الرياضي خطوة بخطوة مع التأكد التام من تطابق جداول الحقيقة!",
      narrationEn:
        "Here we apply formal Discrete Mathematics laws: De Morgan, Absorption, and Double Negation. Click 'Simplify Formula' to witness step-by-step reduction with verified truth equivalence!",
      taskAr: 'اضغط على زر "بسط المعادلة واعرض القوانين" لرؤية خطوات التبسيط الأكاديمية',
      taskEn: 'Click "Simplify Formula" to view step-by-step mathematical law derivations',
      isReadyToAdvance: stage4Simplified
    },
    {
      id: 4,
      titleAr: 'المحطة 5: التحدي المباشر وحرية المعمل',
      titleEn: 'Step 5: Live Challenge & Full Freedom',
      narrationAr:
        "الله ينور يا دكتور محمود! كده حضرتك جربت الدورة الكاملة: من الفكرة الرمزية، للجدول، للدائرة، للإثبات والتبسيط. دلوقتي تقدر تدخل على 'التحدي المباشر' لاختبار مسائل عشوائية، أو تفتح 'المعمل المفتوح' وتجرب أي فكرة تخطر في بالك!",
      narrationEn:
        "Outstanding work, Dr. Mahmoud! You have experienced the complete pipeline: from symbolic expression to truth table, silicon gates, and formal proofs. You can now launch the Live Challenge Arena or explore the Open Playground!",
      taskAr: 'اختر وجهتك التالية: التحدي المباشر أو المعمل المفتوح أو وضع العرض الأكاديمي',
      taskEn: 'Choose your destination: Live Challenge, Open Playground, or Presentation Mode',
      isReadyToAdvance: true
    }
  ];

  const currentStage = stages[stepIndex];

  // Auto-speak on step transition
  useEffect(() => {
    const textToSpeak = lang === 'ar' ? currentStage.narrationAr : currentStage.narrationEn;
    onSpeak(textToSpeak);
  }, [stepIndex, lang]);

  // Compute Stage 2 Table
  const stage2Table = React.useMemo(() => {
    try {
      return TruthTableGenerator.generate(stage2Expr);
    } catch {
      return null;
    }
  }, [stage2Expr]);

  // Compute Stage 3 Circuit Graph
  const stage3Circuit = React.useMemo<CircuitGraph | null>(() => {
    try {
      const ast = new Parser(stage3Expr).parse();
      const compiler = new CircuitCompiler();
      const rawGraph = compiler.compile(ast, stage3InputStates);
      return CircuitLayoutEngine.layout(rawGraph, 750, 360);
    } catch {
      return null;
    }
  }, [stage3Expr, stage3InputStates]);

  // Compute Stage 4 Simplification Steps
  const stage4Steps = React.useMemo(() => {
    try {
      return BooleanSimplifier.simplifyWithSteps(stage4Expr);
    } catch {
      return [];
    }
  }, [stage4Expr]);

  const handleNextStep = () => {
    if (stepIndex < stages.length - 1) {
      setStepIndex(prev => prev + 1);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrevStep = () => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
    }
  };

  const handleToggleStage3Input = (varName: string) => {
    setStage3InputStates(prev => ({
      ...prev,
      [varName]: !prev[varName]
    }));
    setStage3Toggled(true);

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 }
    });

    const praiseText = lang === 'ar'
      ? `الله ينور يا دكتور! غيرت قيمة ${varName} والإشارة سريت في البوابات فوراً!`
      : `Excellent Dr. Mahmoud! Variable ${varName} changed and signal propagated instantly!`;
    onSpeak(praiseText);
  };

  const handleApplySimplification = () => {
    setStage4Simplified(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    const praiseText = lang === 'ar'
      ? "عاش يا دكتور! المعادلة اتبسطت بقوانين دي مورجان والامتصاص، والتكافؤ متطابق تماماً!"
      : "Formally reduced with De Morgan and Absorption laws, mathematically verified!";
    onSpeak(praiseText);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto select-none" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner with Dr. Mahmoud Greeting & Step Progress */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 shadow-2xl border border-cyan-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              <Sparkles className="w-6 h-6 text-cyan-200" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                {lang === 'ar' ? 'الجولة التفاعلية الحية • خاصة بالدكتور محمود' : 'Live Interactive Co-Pilot • Dedicated to Dr. Mahmoud'}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white font-display">
                {lang === 'ar' ? currentStage.titleAr : currentStage.titleEn}
              </h2>
            </div>
          </div>

          {/* Language Switcher & Step Tracker */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 hover:border-cyan-500 transition-all"
            >
              <Languages className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'English Language' : 'اللغة العربية'}</span>
            </button>

            <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              {lang === 'ar' ? `المحطة ${stepIndex + 1} من ${stages.length}` : `Stage ${stepIndex + 1} of ${stages.length}`}
            </span>
          </div>
        </div>

        {/* Co-Pilot Active Speech Box */}
        <div className="p-4 rounded-2xl bg-cosmos-950/90 border border-cyan-500/30 flex items-center gap-3 shadow-inner">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping flex-shrink-0" />
          <p className="text-sm md:text-base font-sans font-medium text-cyan-200 leading-relaxed italic">
            "{lang === 'ar' ? currentStage.narrationAr : currentStage.narrationEn}"
          </p>
        </div>

        {/* Required User Action Directive */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/80 to-cyan-950/80 border border-cyan-500/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs md:text-sm font-mono text-white">
            <Lightbulb className="w-4 h-4 text-amber-400 animate-bounce flex-shrink-0" />
            <span><strong>{lang === 'ar' ? 'مطلوب من حضرتك الآن:' : 'Your Action Required:'}</strong> {lang === 'ar' ? currentStage.taskAr : currentStage.taskEn}</span>
          </div>

          {currentStage.isReadyToAdvance && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'اكتملت التجربة' : 'Tested'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Stage Body */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col gap-6 shadow-2xl">
        
        {/* STAGE 0: Welcome & Orientation */}
        {stepIndex === 0 && (
          <div className="flex flex-col items-center text-center py-8 gap-6 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-10 h-10 animate-pulse" />
            </div>

            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-black text-white font-display mb-2">
                {lang === 'ar' ? 'جاهز للتجربة يا دكتور محمود؟' : 'Ready to Experience LOGIC LAB?'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {lang === 'ar' 
                  ? 'هنأخذ حضرتك في جولة سريعة وممتعة: هتجرب جدول الحقيقة، بعد كده هتشوف بوابات المنطق وسريان الكهرباء، بعد كده هتشوف التبسيط الأكاديمي، وفي الآخر نسيبك مع التحديات والمعمل المفتوح!'
                  : 'We will take you through a rapid, interactive hands-on walkthrough: test truth tables, see physical logic gates with voltage propagation, witness Boolean proofs, and unlock the playground!'}
              </p>
            </div>

            <button
              onClick={handleNextStep}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95"
            >
              <span>{lang === 'ar' ? 'ابدأ التجربة التفاعلية الآن' : 'Start Interactive Experience Now'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STAGE 1: Live Truth Table Testing */}
        {stepIndex === 1 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Table className="w-4 h-4" />
                {lang === 'ar' ? 'جرّب كتابة أو اختيار معادلة منطقية:' : 'Try typing or selecting a formula:'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  '(P ∧ Q) ∨ ¬R',
                  'P → (Q ∧ R)',
                  '¬(P ∧ Q) ↔ (¬P ∨ ¬Q)',
                  '(P ⊕ Q) ⊕ R'
                ].map(ex => (
                  <button
                    key={ex}
                    onClick={() => {
                      setStage2Expr(ex);
                      setStage2Tested(true);
                      onSpeak(lang === 'ar' ? `حسبنا المعادلة ${ex} يا دكتور!` : `Calculated formula ${ex}!`);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
                      stage2Expr === ex
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={stage2Expr}
                onChange={e => {
                  setStage2Expr(e.target.value);
                  setStage2Tested(true);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-cosmos-950 border border-slate-700 text-cyan-200 font-mono text-sm outline-none shadow-inner"
              />
              <button
                onClick={() => {
                  setStage2Tested(true);
                  confetti({ particleCount: 30, spread: 50 });
                  onSpeak(lang === 'ar' ? 'تم الحساب بدقة يا دكتور!' : 'Computed deterministically!');
                }}
                className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md"
              >
                {lang === 'ar' ? 'احسب الجدول' : 'Evaluate Table'}
              </button>
            </div>

            {/* Truth Table Result */}
            {stage2Table && (
              <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-56">
                <table className="w-full text-xs font-mono text-center">
                  <thead className="bg-slate-900 sticky top-0">
                    <tr className="border-b border-slate-800 text-slate-300">
                      {stage2Table.variables.map(v => (
                        <th key={v} className="py-2 px-3 text-cyan-300 font-bold">{v}</th>
                      ))}
                      {stage2Table.subExpressions.map(sub => (
                        <th key={sub} className="py-2 px-3 text-slate-400 font-medium">{sub}</th>
                      ))}
                      <th className="py-2 px-4 text-white bg-cyan-950/60 font-bold">
                        {stage2Table.normalizedExpression}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stage2Table.rows.map(r => (
                      <tr key={r.index} className="hover:bg-slate-800/40">
                        {stage2Table.variables.map(v => (
                          <td key={v} className="py-1.5 px-3 text-slate-300">{r.values[v] ? 'T' : 'F'}</td>
                        ))}
                        {stage2Table.subExpressions.map(sub => (
                          <td key={sub} className="py-1.5 px-3 text-emerald-400">{r.intermediateValues[sub] ? 'T' : 'F'}</td>
                        ))}
                        <td className={`py-1.5 px-4 font-black ${r.result ? 'text-cyan-300 bg-cyan-900/30' : 'text-rose-400'}`}>
                          {r.result ? 'T' : 'F'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {stage2Tested && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center justify-between">
                <span>{lang === 'ar' ? 'ممتاز يا دكتور! الجدول محسوب بالكامل، يلا بينا على بوابات المنطق.' : 'Table computed! Ready to convert into logic gates.'}</span>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-md"
                >
                  <span>{lang === 'ar' ? 'انتقل للبوابات المنطقية' : 'Next: Logic Gates'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAGE 2: Live Logic Gates Simulation */}
        {stepIndex === 2 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                {lang === 'ar' ? 'جرّب التبديل بين المفاتيح لرؤية نبض الإشارة:' : 'Toggle input switches to trigger live signal flow:'}
              </span>

              {/* Interactive Switches */}
              <div className="flex items-center gap-2">
                {Object.keys(stage3InputStates).map(v => (
                  <button
                    key={v}
                    onClick={() => handleToggleStage3Input(v)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all active:scale-95 shadow-md flex items-center gap-1.5 ${
                      stage3InputStates[v]
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <span>{v}</span>
                    <span>=</span>
                    <span>{stage3InputStates[v] ? '1 (HIGH)' : '0 (LOW)'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Circuit Schematic */}
            <div className="w-full min-h-[280px] p-4 bg-cosmos-950/90 rounded-2xl border border-slate-800 flex items-center justify-center overflow-x-auto shadow-inner">
              {stage3Circuit ? (
                <svg
                  width={stage3Circuit.bounds.width}
                  height={stage3Circuit.bounds.height}
                  viewBox={`0 0 ${stage3Circuit.bounds.width} ${stage3Circuit.bounds.height}`}
                  className="select-none"
                >
                  {/* Wires */}
                  {stage3Circuit.wires.map(wire => (
                    <path
                      key={wire.id}
                      d={wire.path}
                      fill="none"
                      className={wire.value ? 'wire-active' : 'wire-inactive'}
                    />
                  ))}

                  {/* Gates */}
                  {stage3Circuit.gates.map(gate => (
                    <g key={gate.id}>
                      <rect
                        x={gate.x}
                        y={gate.y}
                        width={gate.width}
                        height={gate.height}
                        rx={6}
                        fill={gate.output.value ? 'rgba(6, 182, 212, 0.2)' : 'rgba(30, 41, 59, 0.8)'}
                        stroke={gate.output.value ? '#00f5ff' : '#475569'}
                        strokeWidth={2}
                      />
                      <text
                        x={gate.x + gate.width / 2}
                        y={gate.y + gate.height / 2 + 4}
                        textAnchor="middle"
                        className="font-mono text-xs font-bold fill-white pointer-events-none"
                      >
                        {gate.label}
                      </text>
                    </g>
                  ))}
                </svg>
              ) : (
                <span className="text-xs font-mono text-slate-500">Compiling gate schematic...</span>
              )}
            </div>

            {stage3Toggled && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center justify-between">
                <span>{lang === 'ar' ? 'الله ينور يا دكتور! التيار سري والبوابات حسبت الخرج، يلا على التبسيط الأكاديمي.' : 'Signal propagation verified! Ready to inspect Boolean proofs.'}</span>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-md"
                >
                  <span>{lang === 'ar' ? 'انتقل للتبسيط الأكاديمي' : 'Next: Boolean Proofs'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAGE 3: Boolean Algebra Proof */}
        {stepIndex === 3 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {lang === 'ar' ? 'معادلة للتجربة: دي مورجان والتناقض والامتصاص:' : 'Formula to reduce via formal discrete laws:'}
              </span>

              <button
                onClick={handleApplySimplification}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'بسط المعادلة واعرض القوانين' : 'Simplify Formula & Show Laws'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-cosmos-950 border border-slate-800 font-mono text-sm text-cyan-200 font-bold">
              {stage4Expr}
            </div>

            {/* Steps Trace */}
            {stage4Simplified && (
              <div className="flex flex-col gap-3">
                {stage4Steps.map(step => (
                  <div key={step.step} className="p-3.5 rounded-xl bg-cosmos-900 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-300 flex items-center justify-center font-bold">
                        {step.step}
                      </span>
                      <span className="font-bold text-slate-200">{step.law}</span>
                      <span className="text-cyan-300 bg-cosmos-950 px-2 py-0.5 rounded border border-slate-800">{step.expression}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">{step.explanation}</span>
                  </div>
                ))}

                <div className="mt-2 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center justify-between">
                  <span>{lang === 'ar' ? 'تم التبسيط والإثبات الأكاديمي بنجاح 100%! جاهز للانطلاق؟' : 'Axiomatic reduction 100% verified! Ready for full freedom?'}</span>
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <span>{lang === 'ar' ? 'إتمام الجولة والانطلاق' : 'Finish Co-Pilot Tour'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STAGE 4: Completion & Free Exploration */}
        {stepIndex === 4 && (
          <div className="flex flex-col items-center text-center py-6 gap-6 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-black text-white font-display mb-2">
                {lang === 'ar' ? 'مبروك يا دكتور محمود! الجولة اكتملت بنجاح' : 'Congratulations Dr. Mahmoud! Walkthrough Completed'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {lang === 'ar'
                  ? 'حضرتك جربت كل قدرات المنظومة: جداول الحقيقة، محاكاة البوابات، وتبسيط الجبر البولياني. دلوقتي تقدر تبدأ تجربة حرة وتختار المحطة اللي تحبها:'
                  : 'You have actively verified every capability of LOGIC LAB. Choose your preferred destination to explore further:'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl mt-2">
              <button
                onClick={() => onNavigateToModule('challenge')}
                className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 text-amber-200 font-mono text-xs font-bold transition-all flex flex-col items-center gap-2 shadow-md hover:scale-105"
              >
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>{lang === 'ar' ? 'التحدي المباشر' : 'Live Challenge'}</span>
              </button>

              <button
                onClick={() => onNavigateToModule('playground')}
                className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 font-mono text-xs font-bold transition-all flex flex-col items-center gap-2 shadow-md hover:scale-105"
              >
                <Zap className="w-5 h-5 text-cyan-400" />
                <span>{lang === 'ar' ? 'المعمل المفتوح' : 'Open Playground'}</span>
              </button>

              <button
                onClick={() => onNavigateToModule('presentation')}
                className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 hover:border-blue-400 text-blue-200 font-mono text-xs font-bold transition-all flex flex-col items-center gap-2 shadow-md hover:scale-105"
              >
                <Layers className="w-5 h-5 text-blue-400" />
                <span>{lang === 'ar' ? 'وضع العرض الأكاديمي' : 'Presentation Mode'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Global Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handlePrevStep}
            disabled={stepIndex === 0}
            className={`px-4 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
              stepIndex === 0
                ? 'opacity-30 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'ar' ? 'المرحلة السابقة' : 'Previous Step'}</span>
          </button>

          {stepIndex < stages.length - 1 && (
            <button
              onClick={handleNextStep}
              disabled={!currentStage.isReadyToAdvance}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                !currentStage.isReadyToAdvance
                  ? 'opacity-40 bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95'
              }`}
            >
              <span>{lang === 'ar' ? 'المرحلة التالية' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
