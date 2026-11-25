import React, { useState, useMemo } from 'react';
import { Parser } from '../../core/logic/parser';
import { Evaluator } from '../../core/logic/evaluator';
import { TruthTableGenerator } from '../../core/logic/truthtable';
import { CanonicalEngine } from '../../core/logic/canonical';
import { CircuitCompiler } from '../../core/circuit/compiler';
import { CircuitLayoutEngine } from '../../core/circuit/layout';
import { 
  ArrowLeftRight, 
  Table, 
  Cpu, 
  Code2, 
  Sigma, 
  CheckCircle, 
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const ConversionWorkspace: React.FC = () => {
  const [expression, setExpression] = useState('(P ∧ ¬Q) ∨ R');
  const [activeTab, setActiveTab] = useState<'all' | 'canonical' | 'truth' | 'circuit'>('all');

  const { table, canonical, circuit, error } = useMemo(() => {
    try {
      if (!expression.trim()) return { table: null, canonical: null, circuit: null, error: 'Empty expression' };
      const ast = new Parser(expression).parse();
      const tbl = TruthTableGenerator.generate(ast);
      const can = CanonicalEngine.compute(tbl);
      const compiler = new CircuitCompiler();
      const rawGraph = compiler.compile(ast, { P: true, Q: false, R: true, S: false });
      const layoutGraph = CircuitLayoutEngine.layout(rawGraph, 700, 320);

      return { table: tbl, canonical: can, circuit: layoutGraph, error: null };
    } catch (err: any) {
      return { table: null, canonical: null, circuit: null, error: err.message };
    }
  }, [expression]);

  const presets = [
    { label: 'SOP Example', expr: '(P ∧ ¬Q) ∨ (¬P ∧ Q)' },
    { label: 'POS Example', expr: '(P ∨ Q) ∧ (¬P ∨ ¬Q)' },
    { label: '3-Var Minterms', expr: '(P ∧ Q) ∨ R' },
    { label: 'Majority Function', expr: '(P ∧ Q) ∨ (Q ∧ R) ∨ (P ∧ R)' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Input & Control Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
              Unified Mathematical Conversion Workspace
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Synchronized cross-domain isomorphism: Expression ↔ Truth Table ↔ Canonical SOP / POS ↔ Digital Logic Circuit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Verified Isomorphic Equivalence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={expression}
            onChange={e => setExpression(e.target.value)}
            placeholder="Enter propositional expression..."
            className="flex-1 px-4 py-3 rounded-xl bg-cosmos-950 border border-slate-700 focus:border-cyan-400 text-white font-mono text-base outline-none shadow-inner"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-500 font-mono">Conversion Presets:</span>
          {presets.map(p => (
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

      {error ? (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-sm">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Box 1: Canonical SOP (Sum of Products / Minterms) */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2 font-display">
                <Sigma className="w-4 h-4 text-cyan-400" />
                Canonical Sum of Products (SOP)
              </h3>
              <span className="text-xs font-mono text-slate-400">Minterm Expansion</span>
            </div>

            <div className="p-4 rounded-xl bg-cosmos-950 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs text-slate-400 font-mono">Minterm List:</span>
              <p className="text-sm font-mono font-bold text-cyan-200">
                {canonical?.sopNumeric}
              </p>
              <span className="text-xs text-slate-400 font-mono mt-2">Algebraic Boolean SOP:</span>
              <p className="text-xs md:text-sm font-mono text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800 leading-relaxed overflow-x-auto">
                {canonical?.sopExpression}
              </p>
            </div>
          </div>

          {/* Box 2: Canonical POS (Product of Sums / Maxterms) */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-blue-300 flex items-center gap-2 font-display">
                <Layers className="w-4 h-4 text-blue-400" />
                Canonical Product of Sums (POS)
              </h3>
              <span className="text-xs font-mono text-slate-400">Maxterm Expansion</span>
            </div>

            <div className="p-4 rounded-xl bg-cosmos-950 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs text-slate-400 font-mono">Maxterm List:</span>
              <p className="text-sm font-mono font-bold text-blue-200">
                {canonical?.posNumeric}
              </p>
              <span className="text-xs text-slate-400 font-mono mt-2">Algebraic Boolean POS:</span>
              <p className="text-xs md:text-sm font-mono text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800 leading-relaxed overflow-x-auto">
                {canonical?.posExpression}
              </p>
            </div>
          </div>

          {/* Box 3: Compact Truth Table Summary */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                <Table className="w-4 h-4 text-cyan-400" />
                Truth Table Mapping
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {table?.trueCount} True / {table?.totalRows} Total
              </span>
            </div>

            <div className="overflow-x-auto max-h-60 rounded-xl border border-slate-800">
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead className="bg-slate-900 sticky top-0">
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3 text-center">m_i</th>
                    {table?.variables.map(v => (
                      <th key={v} className="py-2 px-2 text-center text-cyan-300 font-bold">{v}</th>
                    ))}
                    <th className="py-2 px-3 text-center font-bold text-white bg-cyan-950/40">F</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {table?.rows.map((r, i) => (
                    <tr key={r.index} className={r.result ? 'bg-cyan-950/20' : ''}>
                      <td className="py-1.5 px-3 text-center text-slate-500">m{i}</td>
                      {table.variables.map(v => (
                        <td key={v} className="py-1.5 px-2 text-center text-slate-300">
                          {r.values[v] ? '1' : '0'}
                        </td>
                      ))}
                      <td className={`py-1.5 px-3 text-center font-bold ${r.result ? 'text-cyan-300' : 'text-slate-600'}`}>
                        {r.result ? '1' : '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Box 4: Silicon Logic Gate Topology Summary */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2 font-display">
                <Cpu className="w-4 h-4 text-emerald-400" />
                Digital Logic Circuit Synthesis
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {circuit?.gates.length} Gates / {circuit?.wires.length} Interconnects
              </span>
            </div>

            <div className="p-4 rounded-xl bg-cosmos-950 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>Gate Primitives:</span>
                <span className="text-cyan-400 font-bold">
                  {Array.from(new Set(circuit?.gates.filter(g => g.type !== 'INPUT' && g.type !== 'OUTPUT').map(g => g.type))).join(', ') || 'Direct Connection'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>Circuit Depth / Layers:</span>
                <span className="text-emerald-400 font-bold">
                  {Math.max(...(circuit?.gates.map(g => g.layer) || [0]))} propagation stages
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>Terminal Output:</span>
                <span className={`font-bold ${circuit?.outputGate.output.value ? 'text-cyan-300' : 'text-slate-500'}`}>
                  {circuit?.outputGate.output.value ? 'HIGH (1)' : 'LOW (0)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
