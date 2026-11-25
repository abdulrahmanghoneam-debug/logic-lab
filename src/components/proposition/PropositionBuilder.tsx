import React, { useState, useMemo } from 'react';
import { Parser } from '../../core/logic/parser';
import { Evaluator } from '../../core/logic/evaluator';
import { ASTNode } from '../../core/logic/types';
import { 
  Network, 
  Sparkles, 
  Play, 
  Trash2, 
  CornerDownRight, 
  CheckCircle, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Brackets
} from 'lucide-react';

interface PropositionBuilderProps {
  onSendToWorkspace?: (expr: string) => void;
}

export const PropositionBuilder: React.FC<PropositionBuilderProps> = ({ onSendToWorkspace }) => {
  const [tokens, setTokens] = useState<string[]>(['(', 'P', '∧', 'Q', ')', '→', 'R']);
  const [variableStates, setVariableStates] = useState<Record<string, boolean>>({
    P: true,
    Q: true,
    R: false,
    S: false
  });

  const expressionString = useMemo(() => tokens.join(' '), [tokens]);

  const { ast, error, evaluatedValue, detectedVars } = useMemo(() => {
    try {
      if (tokens.length === 0) {
        return { ast: null, error: 'Expression is empty', evaluatedValue: null, detectedVars: [] };
      }
      const rawExpr = tokens.join(' ');
      const parsedAst = new Parser(rawExpr).parse();
      const vars = Evaluator.extractVariables(parsedAst);
      const val = Evaluator.evaluate(parsedAst, variableStates);
      return { ast: parsedAst, error: null, evaluatedValue: val, detectedVars: vars };
    } catch (err: any) {
      return { ast: null, error: err.message, evaluatedValue: null, detectedVars: [] };
    }
  }, [tokens, variableStates]);

  const addToken = (token: string) => {
    setTokens(prev => [...prev, token]);
  };

  const removeLast = () => {
    setTokens(prev => prev.slice(0, -1));
  };

  const clearAll = () => {
    setTokens([]);
  };

  const toggleVariable = (v: string) => {
    setVariableStates(prev => ({
      ...prev,
      [v]: !prev[v]
    }));
  };

  // Render recursive AST tree nodes
  const renderASTTree = (node: ASTNode, depth = 0): React.ReactNode => {
    if (node.type === 'variable') {
      const val = variableStates[node.name];
      return (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono">
          <span className="font-bold text-cyan-300">{node.name}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] ${val ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-800 text-slate-400'}`}>
            {val ? '1' : '0'}
          </span>
        </div>
      );
    }

    if (node.type === 'constant') {
      return (
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-300">
          {node.value ? 'True' : 'False'}
        </div>
      );
    }

    if (node.type === 'unary') {
      return (
        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-cosmos-900 border border-slate-800 shadow-md">
          <div className="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
            NOT (¬)
          </div>
          <div className="w-px h-3 bg-slate-700" />
          {renderASTTree(node.operand, depth + 1)}
        </div>
      );
    }

    if (node.type === 'binary') {
      return (
        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-cosmos-900 border border-slate-800 shadow-md">
          <div className="px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
            {node.operator}
          </div>
          <div className="w-full flex items-center justify-around gap-4 pt-1">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 font-mono mb-1">Left</span>
              {renderASTTree(node.left, depth + 1)}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 font-mono mb-1">Right</span>
              {renderASTTree(node.right, depth + 1)}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <Network className="w-5 h-5 text-cyan-400" />
              Interactive Proposition & AST Builder
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Assemble propositional formulas with visual syntax tokens, inspect recursive Abstract Syntax Trees, and preview live truth valuations.
            </p>
          </div>

          {onSendToWorkspace && (
            <button
              onClick={() => onSendToWorkspace(expressionString)}
              disabled={!!error || tokens.length === 0}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Send to Truth Table</span>
            </button>
          )}
        </div>

        {/* Expression Tape Display */}
        <div className="min-h-16 p-4 rounded-xl bg-cosmos-950 border border-slate-700/80 flex flex-wrap items-center gap-2 shadow-inner">
          {tokens.length === 0 ? (
            <span className="text-xs text-slate-500 font-mono italic">
              Click tokens below to compose a proposition...
            </span>
          ) : (
            tokens.map((tok, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-lg font-mono text-sm font-bold shadow-md ${
                  ['P', 'Q', 'R', 'S'].includes(tok)
                    ? 'bg-blue-500/20 border border-blue-500/40 text-blue-200'
                    : ['(', ')'].includes(tok)
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                }`}
              >
                {tok}
              </span>
            ))
          )}
        </div>

        {/* Token Keyboard Palette */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-mono mr-1">Variables:</span>
          {['P', 'Q', 'R', 'S'].map(v => (
            <button
              key={v}
              onClick={() => addToken(v)}
              className="px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-200 font-mono text-xs font-bold hover:bg-blue-900 transition-all active:scale-95 shadow-sm"
            >
              {v}
            </button>
          ))}

          <span className="text-xs text-slate-400 font-mono mx-1">Operators:</span>
          {[
            { sym: '¬', label: 'NOT' },
            { sym: '∧', label: 'AND' },
            { sym: '∨', label: 'OR' },
            { sym: '⊕', label: 'XOR' },
            { sym: '⊼', label: 'NAND' },
            { sym: '⊽', label: 'NOR' },
            { sym: '→', label: 'IMPLIES' },
            { sym: '↔', label: 'IFF' },
            { sym: '(', label: '(' },
            { sym: ')', label: ')' }
          ].map(op => (
            <button
              key={op.sym}
              onClick={() => addToken(op.sym)}
              title={op.label}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs font-bold hover:border-cyan-400 transition-all active:scale-95 shadow-sm"
            >
              {op.sym}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={removeLast}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
            >
              Backspace
            </button>
            <button
              onClick={clearAll}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 text-xs font-mono transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: AST Visualizer & Live Valuation Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Abstract Syntax Tree */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
              <Brackets className="w-4 h-4 text-cyan-400" />
              Hierarchical Abstract Syntax Tree (AST)
            </h3>
            {ast && !error && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Valid Syntax
              </span>
            )}
          </div>

          <div className="w-full min-h-[300px] p-6 rounded-xl bg-cosmos-950 border border-slate-800 flex items-center justify-center overflow-x-auto">
            {error ? (
              <div className="text-center text-rose-400 text-xs font-mono p-4 flex flex-col items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <span>{error}</span>
              </div>
            ) : ast ? (
              renderASTTree(ast)
            ) : (
              <span className="text-xs text-slate-500 font-mono">No AST to display</span>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Variable Valuation */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
              <Play className="w-4 h-4 text-cyan-400" />
              Live Valuation Tester
            </h3>
            <span className="text-xs font-mono text-slate-400">Toggle Inputs</span>
          </div>

          <div className="p-4 rounded-xl bg-cosmos-950 border border-slate-800 flex flex-col gap-3">
            {detectedVars.length === 0 ? (
              <span className="text-xs text-slate-500 font-mono italic">
                Add propositional variables to toggle truth values.
              </span>
            ) : (
              detectedVars.map(v => (
                <div key={v} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-mono text-xs font-bold text-cyan-300">Variable {v}:</span>
                  <button
                    onClick={() => toggleVariable(v)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                      variableStates[v]
                        ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200'
                        : 'bg-slate-800 border border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>{variableStates[v] ? 'TRUE (1)' : 'FALSE (0)'}</span>
                  </button>
                </div>
              ))
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300">Evaluated Output:</span>
              <span
                className={`font-mono text-sm font-black px-4 py-1.5 rounded-lg border ${
                  evaluatedValue === true
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : evaluatedValue === false
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {evaluatedValue === null ? 'INCOMPLETE' : evaluatedValue ? 'TRUE (1)' : 'FALSE (0)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
