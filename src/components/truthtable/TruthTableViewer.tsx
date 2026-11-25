import React, { useState, useMemo } from 'react';
import { TruthTableGenerator } from '../../core/logic/truthtable';
import { EquivalenceChecker } from '../../core/logic/equivalence';
import { TruthTableResult, TruthTableRow, EquivalenceResult } from '../../core/logic/types';
import { 
  Check, 
  Copy, 
  Sparkles, 
  Info, 
  AlertTriangle,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  ArrowLeftRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface TruthTableViewerProps {
  initialExpression?: string;
  onExpressionChange?: (expr: string) => void;
}

export const TruthTableViewer: React.FC<TruthTableViewerProps> = ({
  initialExpression = '(P ∧ Q) → R',
  onExpressionChange
}) => {
  const [expression, setExpression] = useState(initialExpression);
  const [notation, setNotation] = useState<'TF' | '01'>('TF');
  const [selectedRow, setSelectedRow] = useState<TruthTableRow | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Equivalence checker state
  const [showEquivalenceModal, setShowEquivalenceModal] = useState(false);
  const [compareExpr2, setCompareExpr2] = useState('¬(P ∧ Q)');
  const [compareExpr1, setCompareExpr1] = useState('¬P ∨ ¬Q');

  const { table, error } = useMemo(() => {
    try {
      if (!expression.trim()) {
        return { table: null, error: 'Please enter a logical expression.' };
      }
      const res = TruthTableGenerator.generate(expression);
      return { table: res, error: null };
    } catch (err: any) {
      return { table: null, error: err.message || 'Syntax error in expression.' };
    }
  }, [expression]);

  const equivalenceResult = useMemo<EquivalenceResult | null>(() => {
    try {
      if (!compareExpr1.trim() || !compareExpr2.trim()) return null;
      return EquivalenceChecker.check(compareExpr1, compareExpr2);
    } catch {
      return null;
    }
  }, [compareExpr1, compareExpr2]);

  const handleInputChange = (val: string) => {
    setExpression(val);
    setSelectedRow(null);
    onExpressionChange?.(val);
  };

  const insertSymbol = (sym: string) => {
    setExpression(prev => prev + sym);
  };

  const handleCopyMarkdown = () => {
    if (!table) return;
    const md = TruthTableGenerator.toMarkdown(table, notation);
    navigator.clipboard.writeText(md);
    setCopyFeedback('Markdown copied to clipboard!');
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleCopyCSV = () => {
    if (!table) return;
    const csv = TruthTableGenerator.toCSV(table, notation);
    navigator.clipboard.writeText(csv);
    setCopyFeedback('CSV copied to clipboard!');
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const presets = [
    { label: 'Modus Ponens', expr: '(P ∧ (P → Q)) → Q' },
    { label: "De Morgan's Conjunction", expr: '¬(P ∧ Q) ↔ (¬P ∨ ¬Q)' },
    { label: 'Law of Excluded Middle', expr: 'P ∨ ¬P' },
    { label: 'Universal NAND Form', expr: 'P ⊼ Q' },
    { label: 'Universal NOR Form', expr: 'P ⊽ Q' },
    { label: 'Implication Equivalence', expr: '(P → Q) ↔ (¬P ∨ Q)' },
    { label: '3-Variable XOR Parity', expr: '(P ⊕ Q) ⊕ R' }
  ];

  const formatBool = (b: boolean) => (notation === 'TF' ? (b ? 'T' : 'F') : (b ? '1' : '0'));

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Top Controls & Input Bar */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              Dynamic Truth Table Generator
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic evaluation with intermediate sub-formulas, tautology detection, and dual notation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEquivalenceModal(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-xs font-mono text-indigo-200 hover:bg-indigo-900 transition-all"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{showEquivalenceModal ? 'Hide Equivalence' : 'Equivalence Verifier'}</span>
            </button>

            <button
              onClick={() => setNotation(prev => (prev === 'TF' ? '01' : 'TF'))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-mono text-cyan-300 transition-all"
            >
              {notation === 'TF' ? (
                <>
                  <ToggleLeft className="w-4 h-4 text-cyan-400" />
                  <span>Mode: True / False</span>
                </>
              ) : (
                <>
                  <ToggleRight className="w-4 h-4 text-emerald-400" />
                  <span>Mode: 1 / 0 (Binary)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Expression Input */}
        <div className="relative w-full">
          <input
            type="text"
            value={expression}
            onChange={e => handleInputChange(e.target.value)}
            placeholder="e.g. (P ∧ Q) → R, ¬P ∨ Q, P ⊼ Q"
            className="w-full px-4 py-3 rounded-xl bg-cosmos-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white font-mono text-base outline-none shadow-inner transition-all"
          />
        </div>

        {/* Virtual Keypad Palette with NAND and NOR */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 mr-2 font-mono">Insert Operator:</span>
          {[
            { sym: 'P', title: 'Variable P' },
            { sym: 'Q', title: 'Variable Q' },
            { sym: 'R', title: 'Variable R' },
            { sym: 'S', title: 'Variable S' },
            { sym: '¬', title: 'NOT (Negation)' },
            { sym: '∧', title: 'AND (Conjunction)' },
            { sym: '∨', title: 'OR (Disjunction)' },
            { sym: '⊕', title: 'XOR (Exclusive OR)' },
            { sym: '⊼', title: 'NAND (Universal)' },
            { sym: '⊽', title: 'NOR (Universal)' },
            { sym: '→', title: 'IMPLICATION (Conditional)' },
            { sym: '↔', title: 'BICONDITIONAL (IFF)' },
            { sym: '(', title: 'Left Parenthesis' },
            { sym: ')', title: 'Right Parenthesis' }
          ].map(k => (
            <button
              key={k.sym}
              onClick={() => insertSymbol(k.sym)}
              title={k.title}
              className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 hover:border-cyan-500 text-cyan-300 font-mono text-sm font-semibold hover:bg-cyan-950/40 transition-all active:scale-95"
            >
              {k.sym}
            </button>
          ))}
          <button
            onClick={() => setExpression('')}
            className="ml-auto px-2 py-1 text-xs text-slate-500 hover:text-rose-400 font-mono transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Presets:</span>
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => handleInputChange(p.expr)}
              className="px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800 hover:border-slate-600 text-xs text-slate-300 hover:text-cyan-300 transition-all font-mono"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logical Equivalence Checker Drawer */}
      {showEquivalenceModal && (
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-indigo-500/40 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-indigo-300 flex items-center gap-2 font-display">
              <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
              Logical Equivalence Verifier (A ≡ B)
            </h3>
            {equivalenceResult && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                  equivalenceResult.isEquivalent
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {equivalenceResult.isEquivalent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>{equivalenceResult.isEquivalent ? 'LOGICALLY EQUIVALENT' : 'NOT EQUIVALENT'}</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 font-mono">
            {equivalenceResult?.explanation}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-mono text-slate-400">Expression A:</span>
              <input
                type="text"
                value={compareExpr1}
                onChange={e => setCompareExpr1(e.target.value)}
                className="px-3 py-2 rounded-lg bg-cosmos-950 border border-slate-700 text-cyan-200 font-mono text-xs outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-mono text-slate-400">Expression B:</span>
              <input
                type="text"
                value={compareExpr2}
                onChange={e => setCompareExpr2(e.target.value)}
                className="px-3 py-2 rounded-lg bg-cosmos-950 border border-slate-700 text-indigo-200 font-mono text-xs outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table Presentation */}
      {table && (
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 shadow-2xl">
          {/* Metadata & Classification Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Classification:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase font-mono shadow-md ${
                  table.classification === 'Tautology'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : table.classification === 'Contradiction'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                }`}
              >
                {table.classification}
              </span>
              <span className="text-xs text-slate-400">
                ({table.trueCount} True, {table.falseCount} False in {table.totalRows} states)
              </span>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs text-slate-300 flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Markdown</span>
              </button>
              <button
                onClick={handleCopyCSV}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs text-slate-300 flex items-center gap-1.5 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copy CSV</span>
              </button>
            </div>
          </div>

          {copyFeedback && (
            <div className="text-xs text-emerald-400 font-mono animate-fade-in flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{copyFeedback}</span>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-sm font-mono">
              <thead>
                <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
                  <th className="py-3 px-3 text-center text-xs text-slate-500 w-12">#</th>
                  {table.variables.map(v => (
                    <th key={v} className="py-3 px-4 text-center font-bold text-cyan-300 border-r border-slate-800/60">
                      {v}
                    </th>
                  ))}
                  {table.subExpressions.map(sub => (
                    <th key={sub} className="py-3 px-4 text-center text-slate-300 border-r border-slate-800/60 font-medium">
                      {sub}
                    </th>
                  ))}
                  <th className="py-3 px-5 text-center font-bold text-white bg-cyan-950/40 border-l-2 border-cyan-500/60">
                    {table.normalizedExpression}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {table.rows.map(row => {
                  const isSelected = selectedRow?.index === row.index;
                  return (
                    <tr
                      key={row.index}
                      onClick={() => setSelectedRow(row)}
                      className={`cursor-pointer transition-colors duration-150 ${
                        isSelected
                          ? 'bg-cyan-950/60 ring-1 ring-cyan-500/50'
                          : row.result
                          ? 'hover:bg-slate-800/50'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center text-xs text-slate-600">
                        {row.index + 1}
                      </td>

                      {table.variables.map(v => {
                        const val = row.values[v];
                        return (
                          <td
                            key={v}
                            className={`py-2.5 px-4 text-center font-semibold border-r border-slate-800/40 ${
                              val ? 'text-cyan-400' : 'text-slate-500'
                            }`}
                          >
                            {formatBool(val)}
                          </td>
                        );
                      })}

                      {table.subExpressions.map(sub => {
                        const val = row.intermediateValues[sub];
                        return (
                          <td
                            key={sub}
                            className={`py-2.5 px-4 text-center border-r border-slate-800/40 ${
                              val ? 'text-emerald-400 font-medium' : 'text-slate-500'
                            }`}
                          >
                            {formatBool(val)}
                          </td>
                        );
                      })}

                      <td
                        className={`py-2.5 px-5 text-center font-bold border-l-2 border-cyan-500/40 ${
                          row.result
                            ? 'text-cyan-300 bg-cyan-900/20 font-black text-base'
                            : 'text-rose-400/90 bg-rose-950/10'
                        }`}
                      >
                        {formatBool(row.result)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Interactive Row Inspector */}
          {selectedRow && (
            <div className="p-4 rounded-xl bg-cosmos-900/90 border border-cyan-500/30 flex flex-col gap-2 animate-fade-in shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Info className="w-4 h-4 text-cyan-400" />
                  Row {selectedRow.index + 1} Deep Inspection
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Evaluated Result: <strong className={selectedRow.result ? 'text-cyan-300' : 'text-rose-400'}>{selectedRow.result ? 'TRUE' : 'FALSE'}</strong>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Valuation: {table.variables.map(v => `${v} = ${selectedRow.values[v] ? 'T' : 'F'}`).join(', ')}
              </p>
              {table.subExpressions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {table.subExpressions.map(sub => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300"
                    >
                      {sub} = <strong className={selectedRow.intermediateValues[sub] ? 'text-emerald-400' : 'text-slate-500'}>{formatBool(selectedRow.intermediateValues[sub])}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
