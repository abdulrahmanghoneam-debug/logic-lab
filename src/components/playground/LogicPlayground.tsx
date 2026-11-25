import React, { useState } from 'react';
import { TruthTableViewer } from '../truthtable/TruthTableViewer';
import { CircuitSimulator } from '../circuit/CircuitSimulator';
import { BooleanSimplifierViewer } from '../algebra/BooleanSimplifierViewer';
import { ConversionWorkspace } from '../converter/ConversionWorkspace';
import { 
  FlaskConical, 
  Sparkles, 
  Table, 
  Cpu, 
  BookOpen, 
  ArrowLeftRight,
  Shuffle
} from 'lucide-react';

export const LogicPlayground: React.FC = () => {
  const [expression, setExpression] = useState('(P ∧ Q) ∨ ¬R');
  const [activeSubView, setActiveSubView] = useState<'truthtable' | 'circuit' | 'algebra' | 'conversion'>('truthtable');

  const randomExpressions = [
    '(P ∧ Q) → R',
    '¬(P ∧ Q) ↔ (¬P ∨ ¬Q)',
    '(P ⊕ Q) ⊕ R',
    'P ⊼ (Q ⊽ R)',
    '(P ∨ ¬Q) ∧ (¬P ∨ Q)',
    '((P → Q) ∧ P) → Q',
    '(P ∧ Q) ∨ (P ∧ ¬Q)'
  ];

  const handleRandomize = () => {
    const chosen = randomExpressions[Math.floor(Math.random() * randomExpressions.length)];
    setExpression(chosen);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Playground Control Bar */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <FlaskConical className="w-5 h-5 text-cyan-400" />
              Open Discrete Logic Playground
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live computational sandbox: test expressions across truth tables, circuits, algebraic reductions, and canonical forms simultaneously.
            </p>
          </div>

          <button
            onClick={handleRandomize}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-xs font-mono text-cyan-300 flex items-center gap-2 transition-all active:scale-95 shadow-md"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random Formula</span>
          </button>
        </div>

        {/* Global Expression Bar */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={expression}
            onChange={e => setExpression(e.target.value)}
            placeholder="Enter any propositional formula..."
            className="flex-1 px-4 py-3 rounded-xl bg-cosmos-950 border border-slate-700 focus:border-cyan-400 text-white font-mono text-base outline-none shadow-inner"
          />
        </div>

        {/* Sub-view switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800 overflow-x-auto">
          {[
            { id: 'truthtable', label: 'Truth Table', icon: Table },
            { id: 'circuit', label: 'Circuit Schematic', icon: Cpu },
            { id: 'algebra', label: 'Boolean Proof', icon: BookOpen },
            { id: 'conversion', label: 'Canonical SOP / POS', icon: ArrowLeftRight }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeSubView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubView(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-200 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Sub-view Component */}
      <div className="w-full">
        {activeSubView === 'truthtable' && (
          <TruthTableViewer initialExpression={expression} onExpressionChange={setExpression} />
        )}
        {activeSubView === 'circuit' && (
          <CircuitSimulator expression={expression} onExpressionChange={setExpression} />
        )}
        {activeSubView === 'algebra' && (
          <BooleanSimplifierViewer initialExpression={expression} />
        )}
        {activeSubView === 'conversion' && (
          <ConversionWorkspace />
        )}
      </div>
    </div>
  );
};
