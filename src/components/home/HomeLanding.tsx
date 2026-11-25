import React from 'react';
import { 
  Play, 
  Network, 
  Table, 
  Cpu, 
  BookOpen, 
  ArrowLeftRight, 
  GraduationCap, 
  Trophy, 
  Presentation, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  CheckCircle2, 
  Mic, 
  ShieldCheck,
  Binary
} from 'lucide-react';

interface HomeLandingProps {
  onNavigate: (module: string) => void;
  onStartShowreel: () => void;
  onVoiceWelcome: () => void;
}

export const HomeLanding: React.FC<HomeLandingProps> = ({
  onNavigate,
  onStartShowreel,
  onVoiceWelcome
}) => {
  const modules = [
    {
      id: 'proposition',
      title: 'Proposition & AST Builder',
      desc: 'Assemble propositions with visual syntax tokens and inspect recursive parse trees.',
      icon: Network,
      tag: 'Interactive Composition',
      color: 'from-blue-600 to-cyan-500'
    },
    {
      id: 'truthtable',
      title: 'Truth Table Generator',
      desc: 'Evaluate 2ⁿ valuation states with intermediate sub-formulas and classification.',
      icon: Table,
      tag: 'Deterministic Model',
      color: 'from-cyan-600 to-blue-500'
    },
    {
      id: 'circuit',
      title: 'Digital Logic Circuits',
      desc: 'ANSI/IEEE gate schematics with clickable inputs and animated voltage flow.',
      icon: Cpu,
      tag: 'Silicon Realization',
      color: 'from-emerald-600 to-cyan-500'
    },
    {
      id: 'algebra',
      title: 'Boolean Algebra Lab',
      desc: 'Formal reduction citing exact laws with side-by-side truth equivalence.',
      icon: BookOpen,
      tag: 'Axiomatic Proofs',
      color: 'from-purple-600 to-blue-500'
    },
    {
      id: 'converter',
      title: 'Canonical Converter',
      desc: 'Isomorphic transformation: Expressions ↔ Truth Tables ↔ SOP (Σm) & POS (ΠM).',
      icon: ArrowLeftRight,
      tag: 'Canonical Forms',
      color: 'from-cyan-500 to-indigo-600'
    },
    {
      id: 'tutorial',
      title: 'Guided Learning (11 Stages)',
      desc: 'Structured Discrete Structures curriculum from propositions to Boolean algebra.',
      icon: GraduationCap,
      tag: 'Academic Syllabus',
      color: 'from-amber-600 to-cyan-600'
    },
    {
      id: 'challenge',
      title: 'Live Challenge Arena',
      desc: 'Randomized problems across Novice, Scholar, and Grandmaster difficulties.',
      icon: Trophy,
      tag: 'Interactive Practice',
      color: 'from-orange-600 to-amber-500'
    },
    {
      id: 'presentation',
      title: 'Professor Presentation Mode',
      desc: 'Theater layout with remote keyboard controls and showcase demonstrations.',
      icon: Presentation,
      tag: 'Lecture Projection',
      color: 'from-blue-700 to-cyan-500'
    }
  ];

  return (
    <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto py-4 select-none">
      {/* Hero Welcome Section */}
      <div className="relative glass-panel p-8 md:p-12 rounded-3xl flex flex-col items-center text-center overflow-hidden shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>University Discrete Structures • Dedicated to Dr. Mahmoud</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-300 tracking-tight font-display mb-4">
          LOGIC LAB
        </h1>

        <p className="text-lg md:text-xl font-mono text-cyan-400 font-bold uppercase tracking-widest mb-6">
          Think. Connect. Prove.
        </p>

        <p className="max-w-2xl text-slate-300 text-sm md:text-base leading-relaxed mb-8">
          A high-performance computational learning environment bridging symbolic logic, deterministic model checking, real-time digital logic circuits, and natural conversational voice AI.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('copilot')}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 border border-cyan-400/40"
          >
            <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
            <span>ابدأ الجولة التفاعلية الحية مع دكتور محمود</span>
          </button>

          <button
            onClick={onStartShowreel}
            className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-slate-200 hover:text-cyan-300 font-mono text-xs font-bold shadow-md flex items-center gap-2 transition-all hover:bg-slate-800"
          >
            <Play className="w-4 h-4 text-cyan-400" />
            <span>عرض البداية السينمائي (15s)</span>
          </button>

          <button
            onClick={() => onNavigate('presentation')}
            className="px-5 py-3 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-200 font-mono text-xs font-bold shadow-md flex items-center gap-2 transition-all hover:bg-blue-900/60"
          >
            <Presentation className="w-4 h-4 text-cyan-300" />
            <span>وضع المحاضرة والعرض</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            Computational Laboratory Modules
          </h2>
          <span className="text-xs font-mono text-slate-400">8 Integrated Workspaces</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map(mod => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                className="group glass-panel p-5 rounded-2xl flex flex-col justify-between border border-slate-800/80 hover:border-cyan-500/50 hover:bg-cosmos-900/90 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-500/60 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-display mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {mod.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-cyan-400/80 group-hover:text-cyan-300">
                  <span>Enter Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice Assistant Integration Notice */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display">
              Powered by ElevenLabs Natural Conversational Voice
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Natural speech synthesis with scholarly rhythm, context-aware formula explanation, and instant microphone voice command control.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            API Key Secured Server-Side
          </span>
        </div>
      </div>
    </div>
  );
};
