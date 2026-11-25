import React, { useState } from 'react';
import { TruthTableGenerator } from '../../core/logic/truthtable';
import { BooleanSimplifier } from '../../core/logic/simplifier';
import { CircuitCompiler } from '../../core/circuit/compiler';
import { CircuitLayoutEngine } from '../../core/circuit/layout';
import { Parser } from '../../core/logic/parser';
import { 
  Trophy, 
  Dices, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Layers, 
  Eye, 
  Table, 
  Cpu,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

type DifficultyLevel = 'Novice' | 'Scholar' | 'Grandmaster';

interface ChallengeProblem {
  expression: string;
  difficulty: DifficultyLevel;
  question: string;
  expectedClassification: 'Tautology' | 'Contradiction' | 'Contingency';
  hint: string;
}

export const LiveChallenge: React.FC = () => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Scholar');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const problemPool: ChallengeProblem[] = [
    // Novice
    {
      expression: 'P ∨ ¬P',
      difficulty: 'Novice',
      question: 'Determine the classification of this foundational discrete logic formula:',
      expectedClassification: 'Tautology',
      hint: 'Notice that one of P or ¬P is guaranteed to be True in every interpretation.'
    },
    {
      expression: 'P ∧ ¬P',
      difficulty: 'Novice',
      question: 'Determine the classification of this formula:',
      expectedClassification: 'Contradiction',
      hint: 'Can a statement and its negation both hold simultaneously?'
    },
    {
      expression: 'P → Q',
      difficulty: 'Novice',
      question: 'Is the standard conditional an absolute tautology or contingent upon valuations?',
      expectedClassification: 'Contingency',
      hint: 'Consider what happens when P is True and Q is False.'
    },

    // Scholar
    {
      expression: '(P ∧ (P → Q)) → Q',
      difficulty: 'Scholar',
      question: 'Classify this classical argument form (Modus Ponens):',
      expectedClassification: 'Tautology',
      hint: 'If P is true and P implies Q, must Q necessarily be true?'
    },
    {
      expression: '¬(P ∧ Q) ↔ (¬P ∨ ¬Q)',
      difficulty: 'Scholar',
      question: "Classify this formulation of De Morgan's Law:",
      expectedClassification: 'Tautology',
      hint: 'Are both sides logically equivalent in all states?'
    },
    {
      expression: '(P ⊕ Q) ∧ (P ↔ Q)',
      difficulty: 'Scholar',
      question: 'Evaluate the conjunction of Exclusive-OR and Biconditional:',
      expectedClassification: 'Contradiction',
      hint: 'XOR requires opposite truth values; Biconditional requires identical truth values.'
    },

    // Grandmaster
    {
      expression: '((P → Q) ∧ (Q → R)) → (P → R)',
      difficulty: 'Grandmaster',
      question: 'Classify the Law of Hypothetical Syllogism across 3 variables:',
      expectedClassification: 'Tautology',
      hint: 'Transitivity of implication holds across all discrete state spaces.'
    },
    {
      expression: '(P ∧ Q ∧ R) ∧ (¬P ∨ ¬Q ∨ ¬R)',
      difficulty: 'Grandmaster',
      question: 'Evaluate this 3-variable compound conjunction:',
      expectedClassification: 'Contradiction',
      hint: 'Apply De Morgan: the right clause is exactly ¬(P ∧ Q ∧ R).'
    },
    {
      expression: '(P ∨ Q) ∧ (¬P ∨ R) ∧ (¬Q ∨ R)',
      difficulty: 'Grandmaster',
      question: 'Evaluate this resolution form for 3 variables:',
      expectedClassification: 'Contingency',
      hint: 'Check if there exist valuations making it True and others making it False.'
    }
  ];

  const [currentProblemIdx, setCurrentProblemIdx] = useState(3); // Modus Ponens initial
  const currentProblem = problemPool[currentProblemIdx];

  const tableData = React.useMemo(() => {
    try {
      return TruthTableGenerator.generate(currentProblem.expression);
    } catch {
      return null;
    }
  }, [currentProblem.expression]);

  const simplificationSteps = React.useMemo(() => {
    try {
      return BooleanSimplifier.simplifyWithSteps(currentProblem.expression);
    } catch {
      return [];
    }
  }, [currentProblem.expression]);

  const generateRandomChallenge = (diff = difficulty) => {
    const candidates = problemPool
      .map((p, idx) => ({ ...p, idx }))
      .filter(p => p.difficulty === diff && p.idx !== currentProblemIdx);

    const chosen = candidates[Math.floor(Math.random() * candidates.length)] || problemPool[0];
    setCurrentProblemIdx(chosen.idx);
    setSelectedAnswer(null);
    setIsRevealed(false);
  };

  const handleSelectAnswer = (ans: 'Tautology' | 'Contradiction' | 'Contingency') => {
    if (isRevealed) return;
    setSelectedAnswer(ans);
    setIsRevealed(true);

    if (ans === currentProblem.expectedClassification) {
      setScore(prev => prev + 100);
      setStreak(prev => prev + 1);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Challenge Header & Difficulty Selector */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Live Mathematical Challenge Arena
              </h2>
              <p className="text-xs text-slate-400">
                Randomized propositional logic challenges designed for live lecture interaction.
              </p>
            </div>
          </div>

          {/* Score & Streak */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Score: <strong className="text-amber-300">{score}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Streak: <strong className="text-orange-300">{streak}</strong></span>
            </div>
          </div>
        </div>

        {/* Difficulty Selector and Randomizer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Difficulty:</span>
            {(['Novice', 'Scholar', 'Grandmaster'] as DifficultyLevel[]).map(d => (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  generateRandomChallenge(d);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  difficulty === d
                    ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-200 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={() => generateRandomChallenge()}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-xs font-mono text-cyan-300 flex items-center gap-2 transition-all hover:bg-slate-800 active:scale-95 shadow-md"
          >
            <Dices className="w-4 h-4 text-cyan-400" />
            <span>Generate New Challenge</span>
          </button>
        </div>
      </div>

      {/* Main Challenge Arena Card */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col gap-6 shadow-2xl">
        <div className="flex flex-col items-center text-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-widest">
            {currentProblem.difficulty} Challenge
          </span>
          <p className="text-sm md:text-base text-slate-300 max-w-xl">
            {currentProblem.question}
          </p>

          {/* Formula Display Box */}
          <div className="my-4 px-6 py-4 rounded-2xl bg-cosmos-950 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-300 tracking-wider">
              {currentProblem.expression}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-mono italic">
            Hint: {currentProblem.hint}
          </p>
        </div>

        {/* Answer Selection Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {(['Tautology', 'Contingency', 'Contradiction'] as const).map(ans => {
            const isSelected = selectedAnswer === ans;
            const isCorrect = ans === currentProblem.expectedClassification;

            return (
              <button
                key={ans}
                disabled={isRevealed}
                onClick={() => handleSelectAnswer(ans)}
                className={`p-5 rounded-2xl border text-center font-display font-bold text-base transition-all duration-300 ${
                  isRevealed
                    ? isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : isSelected
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                      : 'bg-slate-900/40 border-slate-800/60 text-slate-600'
                    : 'bg-slate-900/80 border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-cyan-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span>{ans}</span>
                  {isRevealed && (
                    isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    ) : null
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Post-Resolution Proof & Verification Drawer */}
        {isRevealed && (
          <div className="mt-6 flex flex-col gap-6 pt-6 border-t border-slate-800 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2 font-display">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Mathematical Verification & Derivation
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Deterministic Output: <strong className="text-emerald-400">{currentProblem.expectedClassification}</strong>
              </span>
            </div>

            {/* Compact Truth Table Evidence */}
            {tableData && (
              <div className="p-4 rounded-xl bg-cosmos-950 border border-slate-800 flex flex-col gap-2">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-cyan-400" />
                  Truth Table Proof ({tableData.trueCount} True / {tableData.totalRows} Total):
                </span>
                <div className="overflow-x-auto rounded-lg border border-slate-800 max-h-48">
                  <table className="w-full text-xs font-mono text-center">
                    <thead className="bg-slate-900 sticky top-0">
                      <tr>
                        {tableData.variables.map(v => (
                          <th key={v} className="py-1.5 px-3 text-cyan-300 font-bold">{v}</th>
                        ))}
                        <th className="py-1.5 px-3 text-white bg-cyan-950/40">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {tableData.rows.map(r => (
                        <tr key={r.index}>
                          {tableData.variables.map(v => (
                            <td key={v} className="py-1 px-3 text-slate-400">{r.values[v] ? 'T' : 'F'}</td>
                          ))}
                          <td className={`py-1 px-3 font-bold ${r.result ? 'text-cyan-300' : 'text-rose-400'}`}>
                            {r.result ? 'T' : 'F'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Next Challenge Action */}
            <button
              onClick={() => generateRandomChallenge()}
              className="self-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              Continue to Next Challenge →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
