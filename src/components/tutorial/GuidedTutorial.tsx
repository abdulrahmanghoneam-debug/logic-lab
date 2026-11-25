import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Volume2, 
  HelpCircle,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuidedTutorialProps {
  onSpeak?: (text: string) => void;
  onNavigateToTool?: (tool: string) => void;
}

interface TutorialStage {
  id: number;
  title: string;
  topic: string;
  assistantVoiceText: string;
  explanation: string[];
  keyConcept: string;
  interactiveDemo: {
    prompt: string;
    options: { text: string; correct: boolean; explanation: string }[];
  };
}

export const GuidedTutorial: React.FC<GuidedTutorialProps> = ({ onSpeak }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  // 11 Complete Progressive Stages as requested by Dr. Mahmoud
  const stages: TutorialStage[] = [
    {
      id: 1,
      title: 'Stage 1: What is a Proposition?',
      topic: 'Foundations of Discrete Structures',
      assistantVoiceText:
        'A proposition is a declarative statement that is either strictly True or strictly False, but never both at the same time.',
      keyConcept: 'Truth Value ∈ { True, False }',
      explanation: [
        'Declarative assertions like "7 is a prime number" or "Discrete mathematics is computational" have definitive truth values.',
        'Questions ("What is logic?"), commands ("Solve this proof!"), and paradoxes ("This statement is false") are NOT propositions.'
      ],
      interactiveDemo: {
        prompt: 'Which of the following sentences is a valid mathematical proposition?',
        options: [
          { text: 'x + 4 = 10', correct: false, explanation: 'Incorrect: Without assigning a value to x, the truth value is indeterminate.' },
          { text: 'The sum of angles in a planar triangle is 180 degrees.', correct: true, explanation: 'Correct! This is a declarative geometric fact with truth value True.' },
          { text: 'Please close the logic gate.', correct: false, explanation: 'Incorrect: This is an imperative command.' }
        ]
      }
    },
    {
      id: 2,
      title: 'Stage 2: Logical Variables',
      topic: 'Symbolic Abstraction',
      assistantVoiceText:
        'We represent atomic propositions using symbolic variables: P, Q, R, and S.',
      keyConcept: 'Symbols P, Q, R, S replace natural language assertions',
      explanation: [
        'Symbolic abstraction lets us analyze logical arguments algebraically without ambiguity.',
        'Example: Let P = "The server is online", and Q = "The database responded".'
      ],
      interactiveDemo: {
        prompt: 'Why do mathematicians use variables P and Q instead of full sentences?',
        options: [
          { text: 'To isolate the deductive structure from specific subject matter.', correct: true, explanation: 'Correct! Algebraic variables enable formal deductive reasoning regardless of empirical content.' },
          { text: 'Because letters make computations longer.', correct: false, explanation: 'Incorrect: Symbolic notation makes logic concise and precise.' }
        ]
      }
    },
    {
      id: 3,
      title: 'Stage 3: Truth Values',
      topic: 'Binary Isomorphism',
      assistantVoiceText:
        'Every proposition maps to one of two truth values: True (represented as 1 or T) and False (represented as 0 or F).',
      keyConcept: 'Boolean Domain B = { 0, 1 }',
      explanation: [
        'In digital computing, True maps to High Voltage (+5V or +3.3V) and False maps to Ground (0V).',
        'George Boole showed that classical logic is completely isomorphic to binary arithmetic.'
      ],
      interactiveDemo: {
        prompt: 'In digital logic, what electrical state corresponds to a Boolean False value?',
        options: [
          { text: 'Ground (0 Volts / LOW)', correct: true, explanation: 'Correct! Logic 0 corresponds physically to reference ground voltage.' },
          { text: 'Positive Supply (+5 Volts / HIGH)', correct: false, explanation: 'Incorrect: Positive supply voltage represents Logic 1 (HIGH).' }
        ]
      }
    },
    {
      id: 4,
      title: 'Stage 4: What is NOT? (Negation)',
      topic: 'Unary Inversion',
      assistantVoiceText:
        'Negation, denoted with ¬ or tilde, inverts the truth value of a proposition.',
      keyConcept: '¬T = F | ¬F = T',
      explanation: [
        'If proposition P is True, then ¬P is False.',
        'Double Negation Law states that ¬(¬P) ≡ P (inverting twice returns the original value).'
      ],
      interactiveDemo: {
        prompt: 'If P is False, what is the value of ¬(¬(¬P))?',
        options: [
          { text: 'True', correct: true, explanation: 'Correct! P=F, ¬P=T, ¬¬P=F, and ¬¬¬P=T.' },
          { text: 'False', correct: false, explanation: 'Incorrect: Three successive negations invert False to True.' }
        ]
      }
    },
    {
      id: 5,
      title: 'Stage 5: What is AND? (Conjunction)',
      topic: 'Logical Conjunction (∧)',
      assistantVoiceText:
        'Conjunction is True if and only if BOTH operands are True.',
      keyConcept: 'P ∧ Q = 1 only when P = 1 and Q = 1',
      explanation: [
        'Conjunction behaves like numerical multiplication: 1 × 1 = 1, but 1 × 0 = 0.',
        'If even a single conjunct is False, the entire conjunction is False.'
      ],
      interactiveDemo: {
        prompt: 'Evaluate: If P = True and Q = False, what is P ∧ Q?',
        options: [
          { text: 'False (0)', correct: true, explanation: 'Correct! Because Q is False, the conjunction P ∧ Q evaluates to False.' },
          { text: 'True (1)', correct: false, explanation: 'Incorrect: Both operands must be True for conjunction to hold.' }
        ]
      }
    },
    {
      id: 6,
      title: 'Stage 6: What is OR? (Disjunction)',
      topic: 'Logical Disjunction (∨)',
      assistantVoiceText:
        'Disjunction is True when AT LEAST ONE operand is True.',
      keyConcept: 'P ∨ Q = 0 only when both P = 0 and Q = 0',
      explanation: [
        'In mathematics, OR is inclusive by default: P ∨ Q is True if P is True, Q is True, or both are True.',
        'For exclusive choices (where both cannot be true), we use XOR (⊕).'
      ],
      interactiveDemo: {
        prompt: 'When does the disjunction P ∨ Q evaluate to False?',
        options: [
          { text: 'Only when both P and Q are False.', correct: true, explanation: 'Correct! Any single True operand makes the disjunction True.' },
          { text: 'When one is True and the other is False.', correct: false, explanation: 'Incorrect: At least one True makes it True.' }
        ]
      }
    },
    {
      id: 7,
      title: 'Stage 7: What is Implication? (Conditional)',
      topic: 'Material Implication (→)',
      assistantVoiceText:
        'The conditional P implies Q is False if and only if P is True and Q is False.',
      keyConcept: 'P → Q ≡ ¬P ∨ Q',
      explanation: [
        'A conditional promise "If it rains, I will bring an umbrella" is broken ONLY when it rains (P=T) and no umbrella is brought (Q=F).',
        'When the antecedent P is False, the conditional is vacuously True.'
      ],
      interactiveDemo: {
        prompt: 'If P is False and Q is False, what is the truth value of P → Q?',
        options: [
          { text: 'True', correct: true, explanation: 'Correct! By vacuous truth, a false premise never breaks an implication.' },
          { text: 'False', correct: false, explanation: 'Incorrect: P → Q is False ONLY when P=True and Q=False.' }
        ]
      }
    },
    {
      id: 8,
      title: 'Stage 8: What is Biconditional? (Equivalence)',
      topic: 'Biconditional (↔ / IFF)',
      assistantVoiceText:
        'The biconditional P if and only if Q is True when both operands share the exact same truth value.',
      keyConcept: 'P ↔ Q = 1 when P = Q',
      explanation: [
        'P ↔ Q asserts that P and Q imply each other: (P → Q) ∧ (Q → P).',
        'It evaluates to True for (T, T) and (F, F), and False for mixed pairs.'
      ],
      interactiveDemo: {
        prompt: 'Evaluate: False ↔ False',
        options: [
          { text: 'True', correct: true, explanation: 'Correct! Both operands have matching truth values (both False), so equivalence holds.' },
          { text: 'False', correct: false, explanation: 'Incorrect: Biconditional is True when both truth values agree.' }
        ]
      }
    },
    {
      id: 9,
      title: 'Stage 9: How Truth Tables are Constructed',
      topic: 'Exhaustive Valuation Tables',
      assistantVoiceText:
        'A truth table enumerates all two to the power of n combinations of variable valuations.',
      keyConcept: 'Total Rows = 2ⁿ for n distinct variables',
      explanation: [
        'For 2 variables: 2² = 4 rows (TT, TF, FT, FF).',
        'For 3 variables: 2³ = 8 rows.',
        'Intermediate columns show step-by-step sub-formula evaluation.'
      ],
      interactiveDemo: {
        prompt: 'How many rows are required for a truth table with variables P, Q, and R?',
        options: [
          { text: '8 rows', correct: true, explanation: 'Correct! 2³ = 8 rows.' },
          { text: '6 rows', correct: false, explanation: 'Incorrect: The combinations scale exponentially: 2³ = 8.' }
        ]
      }
    },
    {
      id: 10,
      title: 'Stage 10: What are Logic Gates?',
      topic: 'Physical Silicon Computation',
      assistantVoiceText:
        'Logic gates are physical semiconductor circuits implementing Boolean operations in silicon.',
      keyConcept: 'AND, OR, NOT, NAND, NOR, XOR, XNOR',
      explanation: [
        'NAND and NOR are Universal Gates: any Boolean function can be built entirely from NAND gates alone.',
        'Modern microprocessors combine billions of logic gates on a single silicon die.'
      ],
      interactiveDemo: {
        prompt: 'Why is the NAND gate called a "Universal Gate"?',
        options: [
          { text: 'Any logic gate or circuit can be constructed using only NAND gates.', correct: true, explanation: 'Correct! NAND alone forms a functionally complete set of logical connectives.' },
          { text: 'Because it was the first gate ever manufactured.', correct: false, explanation: 'Incorrect: It is universal due to functional completeness.' }
        ]
      }
    },
    {
      id: 11,
      title: 'Stage 11: What is Boolean Algebra?',
      topic: 'Axiomatic Laws & Simplification',
      assistantVoiceText:
        'Boolean algebra allows us to simplify complex formulas algebraically using formal equivalence laws.',
      keyConcept: "De Morgan's Laws, Absorption, Idempotent, Distributive",
      explanation: [
        "De Morgan's: ¬(P ∧ Q) ≡ ¬P ∨ ¬Q and ¬(P ∨ Q) ≡ ¬P ∧ ¬Q.",
        'Absorption: P ∨ (P ∧ Q) ≡ P.',
        'Simplifying formulas reduces the number of physical silicon gates required in digital hardware.'
      ],
      interactiveDemo: {
        prompt: "According to De Morgan's Law, what is ¬(P ∧ Q)?",
        options: [
          { text: '¬P ∨ ¬Q', correct: true, explanation: "Correct! Negating conjunction produces disjunction of negations." },
          { text: '¬P ∧ ¬Q', correct: false, explanation: 'Incorrect: The operator must flip from AND to OR.' }
        ]
      }
    }
  ];

  const currentStage = stages[currentStageIdx];

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedAnswer(idx);
    setHasSubmitted(true);

    if (currentStage.interactiveDemo.options[idx].correct) {
      if (!completedStages.includes(currentStage.id)) {
        setCompletedStages(prev => [...prev, currentStage.id]);
      }
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNext = () => {
    if (currentStageIdx < stages.length - 1) {
      const nextIdx = currentStageIdx + 1;
      setCurrentStageIdx(nextIdx);
      setSelectedAnswer(null);
      setHasSubmitted(false);
      onSpeak?.(stages[nextIdx].assistantVoiceText);
    }
  };

  const handlePrev = () => {
    if (currentStageIdx > 0) {
      const prevIdx = currentStageIdx - 1;
      setCurrentStageIdx(prevIdx);
      setSelectedAnswer(null);
      setHasSubmitted(false);
      onSpeak?.(stages[prevIdx].assistantVoiceText);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto select-none">
      {/* Header & Stage Tabs */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Guided Discrete Structures Journey
              </h2>
              <p className="text-xs text-slate-400">
                11-stage progressive university curriculum designed for Dr. Mahmoud's lecture.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-300">
              Stage {currentStageIdx + 1} / {stages.length}
            </span>
            <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                style={{ width: `${((currentStageIdx + 1) / stages.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stage Pills Scrollbar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-800">
          {stages.map((stg, i) => {
            const isCompleted = completedStages.includes(stg.id);
            const isCurrent = i === currentStageIdx;
            return (
              <button
                key={stg.id}
                onClick={() => {
                  setCurrentStageIdx(i);
                  setSelectedAnswer(null);
                  setHasSubmitted(false);
                  onSpeak?.(stg.assistantVoiceText);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-200 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : isCompleted
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{stg.id}.</span>
                <span>{stg.topic}</span>
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lesson Content Card */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col gap-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              {currentStage.topic}
            </span>
            <h3 className="text-2xl font-black text-white font-display mt-1">
              {currentStage.title}
            </h3>
          </div>

          <button
            onClick={() => onSpeak?.(currentStage.assistantVoiceText)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-mono text-cyan-300 flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Narrate Lesson</span>
          </button>
        </div>

        {/* Key Concept Box */}
        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-mono">Formal Mathematical Definition:</span>
            <span className="text-sm md:text-base font-mono font-bold text-cyan-200">
              {currentStage.keyConcept}
            </span>
          </div>
        </div>

        {/* Explanations */}
        <div className="flex flex-col gap-3">
          {currentStage.explanation.map((para, idx) => (
            <p key={idx} className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
              • {para}
            </p>
          ))}
        </div>

        {/* Micro-exercise */}
        <div className="p-6 rounded-2xl bg-cosmos-900 border border-slate-800 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Checkpoint Exercise:
            </h4>
          </div>

          <p className="text-sm md:text-base text-cyan-200 font-medium">
            {currentStage.interactiveDemo.prompt}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
            {currentStage.interactiveDemo.options.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              return (
                <button
                  key={i}
                  disabled={hasSubmitted}
                  onClick={() => handleSelectOption(i)}
                  className={`p-4 rounded-xl text-left font-mono text-xs md:text-sm border transition-all ${
                    hasSubmitted
                      ? opt.correct
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : isSelected
                        ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500'
                      : 'bg-slate-900 border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span>{opt.text}</span>
                    {hasSubmitted && (
                      opt.correct ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : isSelected ? (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      ) : null
                    )}
                  </div>

                  {hasSubmitted && isSelected && (
                    <p className={`mt-2 text-xs font-sans ${opt.correct ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {opt.explanation}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStageIdx === 0}
            className={`px-4 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
              currentStageIdx === 0
                ? 'opacity-30 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStageIdx === stages.length - 1}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              currentStageIdx === stages.length - 1
                ? 'opacity-30 bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95'
            }`}
          >
            <span>Next Stage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
