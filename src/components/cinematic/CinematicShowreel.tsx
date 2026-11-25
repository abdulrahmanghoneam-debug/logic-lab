import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Binary, 
  Cpu, 
  Compass,
  Network,
  CheckCircle2,
  Layers
} from 'lucide-react';

interface CinematicShowreelProps {
  onComplete: () => void;
  onSpeak: (text: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const CinematicShowreel: React.FC<CinematicShowreelProps> = ({
  onComplete,
  onSpeak,
  isMuted,
  onToggleMute
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const totalDuration = 15;
  const spokenRef = useRef(false);

  const drMahmoudScript = 
    "Good afternoon, Dr. Mahmoud. Welcome to LOGIC LAB. An interactive environment designed to transform logical expressions into truth tables, Boolean representations, and digital logic circuits. Today, you won't just watch a presentation. You'll interact with it.";

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && secondsElapsed < totalDuration) {
      timer = setInterval(() => {
        setSecondsElapsed(prev => {
          const next = Math.round((prev + 0.1) * 10) / 10;
          if (next >= 7.5 && !spokenRef.current) {
            spokenRef.current = true;
            onSpeak(drMahmoudScript);
          }
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, secondsElapsed, onSpeak]);

  const handleReplay = () => {
    spokenRef.current = false;
    setSecondsElapsed(0);
    setIsPlaying(true);
  };

  // 5 Precise Choreographed Scenes:
  // Scene 1 (0.0s - 3.0s): Abstract Mathematical Symbols & Geometric Elements
  // Scene 2 (3.0s - 6.5s): Logical Connectives & Truth Relations Linking
  // Scene 3 (6.5s - 10.0s): Transformation into Structured Data & Silicon Computation
  // Scene 4 (10.0s - 13.0s): LOGIC LAB Identity Emergence & Dr. Mahmoud Welcome
  // Scene 5 (13.0s - 15.0s): Interface Access & Invitation to Explore
  const currentScene = 
    secondsElapsed < 3.0 ? 1 :
    secondsElapsed < 6.5 ? 2 :
    secondsElapsed < 10.0 ? 3 :
    secondsElapsed < 13.0 ? 4 : 5;

  const progressPercent = Math.min(100, (secondsElapsed / totalDuration) * 100);

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-cosmos-950 text-slate-100 select-none rounded-3xl border border-slate-800/80 shadow-2xl">
      {/* Background Matrix & Dynamic Geometry */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Atmospheric Dimensional Waves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-32 left-1/3 w-[32rem] h-[32rem] bg-cyan-600/10 rounded-full blur-3xl transition-transform duration-1000"
          style={{ transform: `scale(${1 + Math.sin(secondsElapsed * 0.7) * 0.15})` }}
        />
        <div 
          className="absolute -bottom-32 right-1/3 w-[32rem] h-[32rem] bg-blue-600/10 rounded-full blur-3xl transition-transform duration-1000"
          style={{ transform: `scale(${1 + Math.cos(secondsElapsed * 0.7) * 0.15})` }}
        />
      </div>

      {/* Main Storyboard Stage */}
      <div className="relative z-10 max-w-4xl w-full px-6 flex flex-col items-center text-center">

        {/* Scene 1: Abstract Mathematical Symbols & Geometry (0.0s - 3.0s) */}
        {currentScene === 1 && (
          <div className="animate-fade-in flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-[0.3em] text-cyan-400 font-mono mb-4">
              Scene I • Computational Space & Atomic Propositions
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 font-display">
              In the Beginning, There Was Truth.
            </h2>
            <div className="flex items-center gap-6 mt-2">
              {[
                { sym: 'P', label: 'Antecedent' },
                { sym: 'Q', label: 'Consequent' },
                { sym: 'R', label: 'Premise' },
                { sym: 'S', label: 'Conclusion' }
              ].map((v, i) => (
                <div
                  key={v.sym}
                  className="w-16 h-16 rounded-2xl bg-cosmos-900 border border-cyan-500/30 flex flex-col items-center justify-center shadow-xl transform transition-transform"
                  style={{ animation: `bounce 2s infinite ${i * 0.25}s` }}
                >
                  <span className="text-2xl font-mono font-bold text-cyan-300">{v.sym}</span>
                  <span className="text-[9px] text-slate-500 font-mono">{v.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-slate-400 font-mono max-w-md">
              Discrete variables representing atomic assertions in mathematical universe.
            </p>
          </div>
        )}

        {/* Scene 2: Logical Connectives & Relations Linking (3.0s - 6.5s) */}
        {currentScene === 2 && (
          <div className="animate-fade-in flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-[0.3em] text-blue-400 font-mono mb-4">
              Scene II • Connectives & Axiomatic Synthesis
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 font-display">
              Connective Operators Form Bridges.
            </h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-xl">
              {[
                { sym: '¬', name: 'NOT', desc: 'Negation' },
                { sym: '∧', name: 'AND', desc: 'Conjunction' },
                { sym: '∨', name: 'OR', desc: 'Disjunction' },
                { sym: '⊕', name: 'XOR', desc: 'Parity' },
                { sym: '→', name: 'IMPLIES', desc: 'Inference' },
                { sym: '↔', name: 'IFF', desc: 'Equivalence' },
                { sym: '⊼', name: 'NAND', desc: 'Universal' },
                { sym: '⊽', name: 'NOR', desc: 'Universal' }
              ].map(op => (
                <div
                  key={op.sym}
                  className="px-3.5 py-2 rounded-xl bg-cosmos-900 border border-slate-700 hover:border-cyan-400 flex items-center gap-2.5 shadow-lg transition-all"
                >
                  <span className="text-lg font-bold font-mono text-cyan-300">{op.sym}</span>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-mono font-bold text-slate-200">{op.name}</span>
                    <span className="text-[9px] text-slate-500 font-mono">{op.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scene 3: Structural Data & Silicon Computation (6.5s - 10.0s) */}
        {currentScene === 3 && (
          <div className="animate-fade-in flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-[0.3em] text-emerald-400 font-mono mb-4">
              Scene III • Transformation into Silicon Logic
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 font-display">
              From Truth Values to Silicon Gates.
            </h2>
            <p className="text-slate-300 max-w-lg text-sm leading-relaxed mb-6 font-sans">
              Formulas compile directly into real-time digital logic schematics with picosecond propagation and active voltage flow.
            </p>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-cosmos-900 border border-emerald-500/40 shadow-xl">
              <span className="px-2.5 py-1 rounded bg-slate-950 font-mono text-xs text-cyan-300 font-bold">P = 1</span>
              <span className="text-slate-500 font-mono">∧</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 font-mono text-xs text-cyan-300 font-bold">Q = 1</span>
              <span className="text-emerald-400 font-mono">⟹</span>
              <span className="px-3 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 font-mono text-xs text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                Output Voltage: HIGH (+5V)
              </span>
            </div>
          </div>
        )}

        {/* Scene 4: LOGIC LAB Identity Emergence (10.0s - 13.0s) */}
        {currentScene === 4 && (
          <div className="animate-fade-in flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dedicated Presentation for Dr. Mahmoud</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-400 font-display mb-4">
              LOGIC LAB
            </h1>
            <p className="text-xl md:text-2xl font-bold text-cyan-400 tracking-widest uppercase font-mono mb-6">
              Think. Connect. Prove.
            </p>
            <p className="text-slate-300 max-w-xl text-base leading-relaxed italic font-serif">
              "Good afternoon, Dr. Mahmoud. Welcome to LOGIC LAB. Today, you won't just watch a presentation. You'll interact with it."
            </p>
          </div>
        )}

        {/* Scene 5: Interface Ready & Clear Invitation (13.0s - 15.0s) */}
        {currentScene === 5 && (
          <div className="animate-fade-in flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-4 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 font-display">
              The Laboratory is Ready.
            </h2>
            <p className="text-slate-400 text-sm max-w-md mb-6 font-sans">
              Explore dynamic truth tables, interactive logic circuits, Boolean algebra proofs, and AI conversational guidance.
            </p>

            <button
              onClick={onComplete}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 font-mono"
            >
              <span>بدء الجولة التفاعلية مع دكتور محمود • Start Live Walkthrough</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Cinematic Timeline Footer */}
      <div className="absolute bottom-6 left-0 right-0 max-w-3xl mx-auto px-6 flex flex-col gap-3 z-20">
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100 shadow-[0_0_10px_#06b6d4]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>{secondsElapsed.toFixed(1)}s / {totalDuration}.0s</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 uppercase font-bold">Scene {currentScene} / 5</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMute}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <button
              onClick={handleReplay}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>

            <button
              onClick={onComplete}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors flex items-center gap-1 font-semibold"
            >
              <span>Skip Intro</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
