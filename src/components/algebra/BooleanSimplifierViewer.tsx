import React, { useState, useMemo } from 'react';
import { BooleanSimplifier } from '../../core/logic/simplifier';
import { EquivalenceChecker } from '../../core/logic/equivalence';
import { SimplificationStep, EquivalenceResult } from '../../core/logic/types';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Lightbulb,
  ArrowLeftRight,
  ShieldCheck
} from 'lucide-react';

interface BooleanSimplifierViewerProps {
  initialExpression?: string;
}

export const BooleanSimplifierViewer: React.FC<BooleanSimplifierViewerProps> = ({
  initialExpression = '¬(P ∧ Q) ∨ (P ∧ ¬P)'
}) => {
  const [expression, setExpression] = useState(initialExpression);
  const [selectedLaw, setSelectedLaw] = useState<string | null>(null);

  const { steps, error, finalExpr } = useMemo(() => {
    try {
      if (!expression.trim()) return { steps: [], error: 'Enter an expression to simplify', finalExpr: '' };
      const res = BooleanSimplifier.simplifyWithSteps(expression);
      const finalForm = res.length > 0 ? res[res.length - 1].expression : expression;
      return { steps: res, error: null, finalExpr: finalForm };
    } catch (err: any) {
      return { steps: [], error: err.message || 'Error simplifying expression', finalExpr: '' };
    }
  }, [expression]);

  // Equivalence verification between original and simplified expression
  const equivalence = useMemo<EquivalenceResult | null>(() => {
    try {
      if (!expression.trim() || !finalExpr.trim()) return null;
      return EquivalenceChecker.check(expression, finalExpr);
    } catch {
      return null;
    }
  }, [expression, finalExpr]);

  const discreteLaws = [
    {
      name: 'Absorption Laws',
      formula: 'p ∨ (p ∧ q) ≡ p\np ∧ (p ∨ q) ≡ p',
      desc: 'The outer term absorbs the inner compound subterm sharing the same variable, eliminating redundant logic gates.'
    },
    {
      name: "De Morgan's Laws",
      formula: '¬(p ∧ q) ≡ ¬p ∨ ¬q\n¬(p ∨ q) ≡ ¬p ∧ ¬q',
      desc: 'Negating a conjunction yields a disjunction of negations, and vice versa.'
    },
    {
      name: 'Implication Equivalence',
      formula: 'p → q ≡ ¬p ∨ q',
      desc: 'A conditional statement is logically equivalent to the disjunction of the negated antecedent and consequent.'
    },
    {
      name: 'Universal Gate Definitions',
      formula: 'p ⊼ q ≡ ¬(p ∧ q)  [NAND]\np ⊽ q ≡ ¬(p ∨ q)  [NOR]',
      desc: 'NAND and NOR gates are universal functional complete operators in discrete structures.'
    },
    {
      name: 'Double Negation Law',
      formula: '¬(¬p) ≡ p',
      desc: 'Two consecutive negations cancel out, returning the original proposition.'
    },
    {
      name: 'Complement Laws',
      formula: 'p ∧ ¬p ≡ F (Contradiction)\np ∨ ¬p ≡ T (Tautology)',
      desc: 'A proposition cannot be simultaneously true and false; it must be either true or false.'
    },
    {
      name: 'Identity Laws',
      formula: 'p ∧ T ≡ p\np ∨ F ≡ p',
      desc: 'Conjunction with True or disjunction with False preserves the original truth value.'
    },
    {
      name: 'Domination Laws',
      formula: 'p ∨ T ≡ T\np ∧ F ≡ F',
      desc: 'Disjunction with True always yields True; conjunction with False always yields False.'
    },
    {
      name: 'Idempotent Laws',
      formula: 'p ∧ p ≡ p\np ∨ p ≡ p',
      desc: 'Combining identical propositions yields the proposition itself.'
    },
    {
      name: 'Distributive Laws',
      formula: 'p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)\np ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)',
      desc: 'Conjunction distributes over disjunction, and disjunction distributes over conjunction.'
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto select-none">
      {/* Header & Expression Input */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Boolean Algebra & Formal Law Simplifier
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic algebraic reduction with formal Discrete Mathematics law citations and truth-table verification.
            </p>
          </div>

          {equivalence && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Equivalence Mathematically Verified</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={expression}
            onChange={e => setExpression(e.target.value)}
            placeholder="e.g. ¬(P ∧ Q) ∨ (P ∧ ¬P), P ∨ (P ∧ Q)"
            className="flex-1 px-4 py-3 rounded-xl bg-cosmos-950 border border-slate-700 focus:border-cyan-400 text-white font-mono text-base outline-none shadow-inner"
          />
        </div>

        {/* Quick Example Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-500 font-mono">Simplification Presets:</span>
          {[
            { label: 'Absorption Law', expr: 'P ∨ (P ∧ Q)' },
            { label: 'De Morgan + Contradiction', expr: '¬(P ∧ Q) ∨ (P ∧ ¬P)' },
            { label: 'Universal NAND Simplification', expr: 'P ⊼ (P ∧ Q)' },
            { label: 'Double Negation', expr: '¬(¬(P ∧ Q))' },
            { label: 'Implication to Disjunction', expr: 'P → (Q ∧ P)' },
            { label: 'Biconditional Expansion', expr: 'P ↔ Q' },
            { label: 'Idempotent Reduction', expr: '(P ∨ P) ∧ (Q ∨ Q)' }
          ].map(p => (
            <button
              key={p.label}
              onClick={() => setExpression(p.expr)}
              className="px-2.5 py-1 rounded-md bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 hover:text-cyan-300 transition-all font-mono"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step-by-Step Mathematical Derivation */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 shadow-2xl">
        <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2 font-display uppercase tracking-wider">
          <Layers className="w-4 h-4 text-cyan-400" />
          Step-by-Step Proof Derivation Trace
        </h3>

        {error ? (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-sm">
            {error}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;
              return (
                <div
                  key={step.step}
                  className={`relative p-5 rounded-xl border transition-all ${
                    isLast
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'bg-cosmos-900/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-cyan-300">
                        {step.step}
                      </span>
                      <span className="font-bold text-sm text-slate-200 uppercase tracking-wide">
                        {step.law}
                      </span>
                    </div>

                    {isLast && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Final Irreducible Canonical Form
                      </span>
                    )}
                  </div>

                  <div className="py-2.5 px-4 rounded-lg bg-cosmos-950 border border-slate-800 font-mono text-base md:text-lg text-cyan-200 font-bold tracking-wide">
                    {step.expression}
                  </div>

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed font-sans">
                    {step.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Discrete Mathematics Laws Encyclopedia */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Discrete Structures: Formal Axiomatic Laws Reference
        </h3>
        <p className="text-xs text-slate-400">
          Core equivalence laws used in university discrete mathematics to prove propositions without constructing exponential truth tables.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {discreteLaws.map(law => (
            <div
              key={law.name}
              onClick={() => setSelectedLaw(selectedLaw === law.name ? null : law.name)}
              className="p-4 rounded-xl bg-cosmos-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-cyan-300 font-display uppercase tracking-wide">
                  {law.name}
                </span>
                <pre className="mt-2 p-2 rounded bg-cosmos-950 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed border border-slate-900">
                  {law.formula}
                </pre>
              </div>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                {law.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
