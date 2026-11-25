import React, { useState, useEffect } from 'react';
import { 
  Presentation, 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Cpu, 
  Table, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { TruthTableGenerator } from '../../core/logic/truthtable';
import { CircuitCompiler } from '../../core/circuit/compiler';
import { CircuitLayoutEngine } from '../../core/circuit/layout';
import { Parser } from '../../core/logic/parser';

interface ProfessorModeProps {
  onSpeak: (text: string) => void;
  onExit: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

interface ShowcaseSlide {
  id: number;
  title: string;
  subtitle: string;
  expression: string;
  narration: string;
  notes: string[];
}

export const ProfessorMode: React.FC<ProfessorModeProps> = ({
  onSpeak,
  onExit,
  isMuted,
  onToggleMute
}) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides: ShowcaseSlide[] = [
    {
      id: 1,
      title: "De Morgan's Laws: Duality in Action",
      subtitle: 'Discrete Structures Core Theorem',
      expression: '¬(P ∧ Q) ↔ (¬P ∨ ¬Q)',
      narration:
        "Dr. Mahmoud, here we demonstrate Augustus De Morgan's fundamental law of duality. Notice how the biconditional evaluates to True across all four valuation rows, proving it is a tautology.",
      notes: [
        'Fundamental law governing compiler optimization and logic gate reduction.',
        'Demonstrates how NAND logic can synthesize complete Boolean circuits.',
        'Verified across 2² = 4 states with 100% tautology classification.'
      ]
    },
    {
      id: 2,
      title: 'Conditional vs Biconditional Semantics',
      subtitle: 'Material Implication (P → Q)',
      expression: 'P → Q',
      narration:
        "The conditional statement P implies Q is false if and only if the antecedent P is true while the consequent Q is false. In all other three cases, it holds true by principle of explosion.",
      notes: [
        'Truth table reveals F only at valuation P=1, Q=0.',
        'Logically equivalent to (¬P ∨ Q).',
        'Forms the basis of deductive inference and mathematical modus ponens.'
      ]
    },
    {
      id: 3,
      title: 'Parity and Exclusive Disjunction',
      subtitle: '3-Variable XOR Network ((P ⊕ Q) ⊕ R)',
      expression: '(P ⊕ Q) ⊕ R',
      narration:
        "Here we observe the parity generation circuit, widely applied in error-detecting codes and full adders. The output is True if and only if an odd number of variables are True.",
      notes: [
        'Used in memory parity checking and cryptographic ciphers.',
        'Direct hardware realization using cascaded XOR logic gates.',
        'Generates 2³ = 8 state evaluations.'
      ]
    },
    {
      id: 4,
      title: 'Universal Argument: Modus Ponens',
      subtitle: 'Classical Valid Deductive Argument',
      expression: '(P ∧ (P → Q)) → Q',
      narration:
        "Modus Ponens is the cornerstone of logical inference. If both P and the conditional statement P implies Q are established truths, then Q is guaranteed to follow.",
      notes: [
        'Forms an absolute Tautology (all 1s in output vector).',
        'Demonstrates how complex compound propositions resolve into mathematical certainty.',
        'Foundational in Automated Theorem Proving and AI inference engines.'
      ]
    },
    {
      id: 5,
      title: 'Canonical Synthesis: SOP & POS',
      subtitle: 'From Truth Vector to Silicon Architecture',
      expression: '(P ∧ ¬Q) ∨ (¬P ∧ Q)',
      narration:
        "Every logical truth table can be canonically decomposed into a Sum of Products minterm expansion or a Product of Sums maxterm expansion, bridging discrete mathematics to VLSI silicon design.",
      notes: [
        'Isomorphic translation from truth table minterms to AND-OR gate matrices.',
        'Enables Karnaugh Map and Quine-McCluskey algorithmic minimization.',
        'Direct hardware correspondence.'
      ]
    }
  ];

  const currentSlide = slides[currentSlideIdx];

  // Compute table for current slide
  const tableData = React.useMemo(() => {
    try {
      return TruthTableGenerator.generate(currentSlide.expression);
    } catch {
      return null;
    }
  }, [currentSlide.expression]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      } else if (e.key === 'Space') {
        e.preventDefault();
        onSpeak(currentSlide.narration);
      } else if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIdx, onSpeak, onExit]);

  const handleNext = () => {
    if (currentSlideIdx < slides.length - 1) {
      const nextIdx = currentSlideIdx + 1;
      setCurrentSlideIdx(nextIdx);
      onSpeak(slides[nextIdx].narration);
    }
  };

  const handlePrev = () => {
    if (currentSlideIdx > 0) {
      const prevIdx = currentSlideIdx - 1;
      setCurrentSlideIdx(prevIdx);
      onSpeak(slides[prevIdx].narration);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-cosmos-950 text-slate-100 flex flex-col justify-between p-6 md:p-10 select-none overflow-hidden">
      {/* Background Matrix Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Top Presentation Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Professor Presentation Mode • Dr. Mahmoud
            </span>
            <h1 className="text-lg font-bold text-white font-display">
              {currentSlide.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSpeak(currentSlide.narration)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-mono text-cyan-300 flex items-center gap-2 transition-all"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Narrate Slide</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/40 hover:border-rose-400 text-xs font-mono text-rose-300 transition-all"
          >
            Exit Theater Mode
          </button>
        </div>
      </div>

      {/* Central High-Impact Slide Stage */}
      <div className="relative z-10 max-w-6xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Big Mathematical Reveal & Notes */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            {currentSlide.subtitle}
          </span>

          <div className="p-6 rounded-2xl bg-cosmos-900/90 border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.2)]">
            <span className="font-mono text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-300 tracking-wider">
              {currentSlide.expression}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {currentSlide.notes.map((note, idx) => (
              <div key={idx} className="flex items-start gap-3 text-slate-300 text-base md:text-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2.5 flex-shrink-0" />
                <span>{note}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-cyan-300/80 font-mono italic p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            Assistant Narration: "{currentSlide.narration}"
          </p>
        </div>

        {/* Right Column: Embedded Real-Time Truth Matrix */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Table className="w-4 h-4 text-cyan-400" />
              State Space Matrix
            </span>
            {tableData && (
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                  tableData.classification === 'Tautology'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : tableData.classification === 'Contradiction'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                }`}
              >
                {tableData.classification}
              </span>
            )}
          </div>

          {tableData && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-72">
              <table className="w-full text-xs md:text-sm font-mono text-center">
                <thead className="bg-slate-900 sticky top-0">
                  <tr className="border-b border-slate-800 text-slate-400">
                    {tableData.variables.map(v => (
                      <th key={v} className="py-2 px-3 text-cyan-300 font-bold">{v}</th>
                    ))}
                    <th className="py-2 px-4 text-white bg-cyan-950/60 font-bold">Output</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tableData.rows.map(r => (
                    <tr key={r.index} className="hover:bg-slate-800/40">
                      {tableData.variables.map(v => (
                        <td key={v} className="py-2 px-3 text-slate-300">{r.values[v] ? '1' : '0'}</td>
                      ))}
                      <td className={`py-2 px-4 font-black ${r.result ? 'text-cyan-300 bg-cyan-900/30' : 'text-slate-600'}`}>
                        {r.result ? '1' : '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Presenter Remote Controls */}
      <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span>Slide {currentSlideIdx + 1} of {slides.length}</span>
          <span className="text-slate-600">•</span>
          <span className="hidden sm:inline">Use [←] and [→] keys or Space to narrate</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSlideIdx === 0}
            className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
              currentSlideIdx === 0
                ? 'opacity-30 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentSlideIdx === slides.length - 1}
            className={`px-5 py-2 rounded-xl flex items-center gap-2 font-bold ${
              currentSlideIdx === slides.length - 1
                ? 'opacity-30 bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            }`}
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
