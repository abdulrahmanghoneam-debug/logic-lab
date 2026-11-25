import React, { useState, useMemo } from 'react';
import { Parser } from '../../core/logic/parser';
import { Evaluator } from '../../core/logic/evaluator';
import { CircuitCompiler } from '../../core/circuit/compiler';
import { CircuitLayoutEngine } from '../../core/circuit/layout';
import { CircuitGate, CircuitGraph } from '../../core/circuit/types';
import { 
  Zap, 
  ToggleLeft, 
  ToggleRight, 
  RotateCcw, 
  Sparkles, 
  HelpCircle,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

interface CircuitSimulatorProps {
  expression?: string;
  onExpressionChange?: (expr: string) => void;
}

export const CircuitSimulator: React.FC<CircuitSimulatorProps> = ({
  expression = '(P ∧ Q) ∨ ¬R',
  onExpressionChange
}) => {
  const [currentExpr, setCurrentExpr] = useState(expression);
  const [inputStates, setInputStates] = useState<Record<string, boolean>>({
    P: true,
    Q: true,
    R: false,
    S: false
  });
  const [zoom, setZoom] = useState(1);
  const [hoveredGate, setHoveredGate] = useState<CircuitGate | null>(null);

  // Compile circuit graph whenever expression or inputStates change
  const { graph, error, variables } = useMemo(() => {
    try {
      if (!currentExpr.trim()) {
        return { graph: null, error: 'Enter a valid expression', variables: [] };
      }
      const ast = new Parser(currentExpr).parse();
      const vars = Evaluator.extractVariables(ast);
      const compiler = new CircuitCompiler();
      const rawGraph = compiler.compile(ast, inputStates);
      const layoutGraph = CircuitLayoutEngine.layout(rawGraph, 850, 420);
      return { graph: layoutGraph, error: null, variables: vars };
    } catch (err: any) {
      return { graph: null, error: err.message || 'Compilation error', variables: [] };
    }
  }, [currentExpr, inputStates]);

  const toggleInput = (varName: string) => {
    setInputStates(prev => ({
      ...prev,
      [varName]: !prev[varName]
    }));
  };

  const handleExprChange = (val: string) => {
    setCurrentExpr(val);
    onExpressionChange?.(val);
  };

  // Helper to render gate SVG paths based on gate type
  const renderGateShape = (gate: CircuitGate) => {
    const isOutActive = gate.output.value;
    const strokeColor = isOutActive ? '#00f5ff' : '#475569';
    const fillColor = isOutActive ? 'rgba(0, 245, 255, 0.15)' : 'rgba(15, 23, 42, 0.7)';

    switch (gate.type) {
      case 'INPUT':
        return (
          <g className="cursor-pointer" onClick={() => toggleInput(gate.label)}>
            <rect
              x={gate.x}
              y={gate.y}
              width={gate.width}
              height={gate.height}
              rx={8}
              fill={gate.output.value ? 'rgba(6, 182, 212, 0.25)' : 'rgba(30, 41, 59, 0.8)'}
              stroke={gate.output.value ? '#06b6d4' : '#334155'}
              strokeWidth={2}
              className="transition-all duration-200"
            />
            <text
              x={gate.x + gate.width / 2}
              y={gate.y + gate.height / 2 + 5}
              textAnchor="middle"
              className="font-mono text-sm font-bold fill-white pointer-events-none select-none"
            >
              {gate.label} = {gate.output.value ? '1' : '0'}
            </text>
          </g>
        );

      case 'OUTPUT':
        return (
          <g>
            <rect
              x={gate.x}
              y={gate.y}
              width={gate.width}
              height={gate.height}
              rx={10}
              fill={isOutActive ? 'rgba(0, 245, 255, 0.3)' : 'rgba(30, 41, 59, 0.8)'}
              stroke={isOutActive ? '#00f5ff' : '#334155'}
              strokeWidth={2.5}
              filter={isOutActive ? 'drop-shadow(0 0 10px #00f5ff)' : 'none'}
            />
            <text
              x={gate.x + gate.width / 2}
              y={gate.y + gate.height / 2 + 5}
              textAnchor="middle"
              className={`font-mono text-xs font-bold select-none ${isOutActive ? 'fill-cyan-200' : 'fill-slate-400'}`}
            >
              OUT: {isOutActive ? '1 (HIGH)' : '0 (LOW)'}
            </text>
          </g>
        );

      case 'AND':
        return (
          <g>
            <path
              d={`M ${gate.x} ${gate.y} 
                  H ${gate.x + gate.width * 0.5} 
                  A ${gate.height / 2} ${gate.height / 2} 0 0 1 ${gate.x + gate.width * 0.5} ${gate.y + gate.height} 
                  H ${gate.x} Z`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <text
              x={gate.x + gate.width * 0.35}
              y={gate.y + gate.height / 2 + 4}
              textAnchor="middle"
              className="font-mono text-xs font-bold fill-slate-300 pointer-events-none"
            >
              AND
            </text>
          </g>
        );

      case 'NAND':
        return (
          <g>
            <path
              d={`M ${gate.x} ${gate.y} 
                  H ${gate.x + gate.width * 0.45} 
                  A ${gate.height / 2} ${gate.height / 2} 0 0 1 ${gate.x + gate.width * 0.45} ${gate.y + gate.height} 
                  H ${gate.x} Z`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <circle
              cx={gate.x + gate.width * 0.45 + gate.height / 2 + 4}
              cy={gate.y + gate.height / 2}
              r={4.5}
              fill="rgba(15, 23, 42, 0.9)"
              stroke={strokeColor}
              strokeWidth={2}
            />
            <text
              x={gate.x + gate.width * 0.3}
              y={gate.y + gate.height / 2 + 4}
              textAnchor="middle"
              className="font-mono text-xs font-bold fill-slate-300 pointer-events-none"
            >
              NAND
            </text>
          </g>
        );

      case 'OR':
        return (
          <g>
            <path
              d={`M ${gate.x} ${gate.y} 
                  Q ${gate.x + gate.width * 0.25} ${gate.y + gate.height / 2} ${gate.x} ${gate.y + gate.height} 
                  Q ${gate.x + gate.width * 0.6} ${gate.y + gate.height} ${gate.x + gate.width} ${gate.y + gate.height / 2} 
                  Q ${gate.x + gate.width * 0.6} ${gate.y} ${gate.x} ${gate.y} Z`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <text
              x={gate.x + gate.width * 0.4}
              y={gate.y + gate.height / 2 + 4}
              textAnchor="middle"
              className="font-mono text-xs font-bold fill-slate-300 pointer-events-none"
            >
              OR
            </text>
          </g>
        );

      case 'NOR':
        return (
          <g>
            <path
              d={`M ${gate.x} ${gate.y} 
                  Q ${gate.x + gate.width * 0.25} ${gate.y + gate.height / 2} ${gate.x} ${gate.y + gate.height} 
                  Q ${gate.x + gate.width * 0.55} ${gate.y + gate.height} ${gate.x + gate.width - 10} ${gate.y + gate.height / 2} 
                  Q ${gate.x + gate.width * 0.55} ${gate.y} ${gate.x} ${gate.y} Z`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <circle
              cx={gate.x + gate.width - 5}
              cy={gate.y + gate.height / 2}
              r={4.5}
              fill="rgba(15, 23, 42, 0.9)"
              stroke={strokeColor}
              strokeWidth={2}
            />
            <text
              x={gate.x + gate.width * 0.35}
              y={gate.y + gate.height / 2 + 4}
              textAnchor="middle"
              className="font-mono text-xs font-bold fill-slate-300 pointer-events-none"
            >
              NOR
            </text>
          </g>
        );

      case 'XOR':
        // Curved back with extra curve, pointed front
        return (
          <g>
            {/* Secondary back arc */}
            <path
              d={`M ${gate.x - 8} ${gate.y} 
                  Q ${gate.x + gate.width * 0.25 - 8} ${gate.y + gate.height / 2} ${gate.x - 8} ${gate.y + gate.height}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={2}
            />
            <path
              d={`M ${gate.x} ${gate.y} 
                  Q ${gate.x + gate.width * 0.25} ${gate.y + gate.height / 2} ${gate.x} ${gate.y + gate.height} 
                  Q ${gate.x + gate.width * 0.6} ${gate.y + gate.height} ${gate.x + gate.width} ${gate.y + gate.height / 2} 
                  Q ${gate.x + gate.width * 0.6} ${gate.y} ${gate.x} ${gate.y} Z`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <text
              x={gate.x + gate.width * 0.4}
              y={gate.y + gate.height / 2 + 4}
              textAnchor="middle"
              className="font-mono text-xs font-bold fill-slate-300 pointer-events-none"
            >
              XOR
            </text>
          </g>
        );

      case 'NOT':
        // Triangle with inversion circle
        return (
          <g>
            <path
              d={`M ${gate.x} ${gate.y} 
                  L ${gate.x + gate.width - 12} ${gate.y + gate.height / 2} 
                  L ${gate.x} ${gate.y + gate.height} Z`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            {/* Bubble */}
            <circle
              cx={gate.x + gate.width - 6}
              cy={gate.y + gate.height / 2}
              r={5}
              fill="rgba(15, 23, 42, 0.9)"
              stroke={strokeColor}
              strokeWidth={2}
            />
            <text
              x={gate.x + gate.width * 0.3}
              y={gate.y + gate.height / 2 + 4}
              textAnchor="middle"
              className="font-mono text-xs font-bold fill-slate-300 pointer-events-none"
            >
              NOT
            </text>
          </g>
        );

      case 'XNOR':
        return (
          <g>
            <path
              d={`M ${gate.x - 8} ${gate.y} 
                  Q ${gate.x + gate.width * 0.25 - 8} ${gate.y + gate.height / 2} ${gate.x - 8} ${gate.y + gate.height}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={2}
            />
            <path
              d={`M ${gate.x} ${gate.y} 
                  Q ${gate.x + gate.width * 0.25} ${gate.y + gate.height / 2} ${gate.x} ${gate.y + gate.height} 
                  Q ${gate.x + gate.width * 0.6} ${gate.y + gate.height} ${gate.x + gate.width - 10} ${gate.y + gate.height / 2} 
                  Q ${gate.x + gate.width * 0.6} ${gate.y} ${gate.x} ${gate.y} Z`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <circle
              cx={gate.x + gate.width - 5}
              cy={gate.y + gate.height / 2}
              r={5}
              fill="rgba(15, 23, 42, 0.9)"
              stroke={strokeColor}
              strokeWidth={2}
            />
            <text
              x={gate.x + gate.width * 0.35}
              y={gate.y + gate.height / 2 + 4}
              textAnchor="middle"
              className="font-mono text-xs font-bold fill-slate-300 pointer-events-none"
            >
              XNOR
            </text>
          </g>
        );

      default:
        return (
          <rect
            x={gate.x}
            y={gate.y}
            width={gate.width}
            height={gate.height}
            rx={4}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Top Controls Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <Zap className="w-5 h-5 text-cyan-400" />
              Interactive Digital Logic Circuit Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time gate synthesis with clickable logic switches and animated voltage propagation.
            </p>
          </div>

          {/* Interactive Input Switches */}
          <div className="flex flex-wrap items-center gap-2">
            {variables.map(v => (
              <button
                key={v}
                onClick={() => toggleInput(v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all shadow-md active:scale-95 ${
                  inputStates[v]
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span>{v}</span>
                <span>=</span>
                <span>{inputStates[v] ? '1 (HIGH)' : '0 (LOW)'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Expression Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-500 font-mono">Circuit Presets:</span>
          {[
            { label: 'AND Gate', expr: 'P ∧ Q' },
            { label: 'OR Gate', expr: 'P ∨ Q' },
            { label: 'XOR Gate', expr: 'P ⊕ Q' },
            { label: 'Implication (¬P ∨ Q)', expr: 'P → Q' },
            { label: 'Biconditional (XNOR)', expr: 'P ↔ Q' },
            { label: 'De Morgan Circuit', expr: '¬(P ∧ Q)' },
            { label: '3-Variable Logic', expr: '(P ∧ Q) ∨ ¬R' }
          ].map(p => (
            <button
              key={p.label}
              onClick={() => handleExprChange(p.expr)}
              className="px-2.5 py-1 rounded-md bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 hover:text-cyan-300 transition-all font-mono"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Circuit Canvas Container */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col gap-4 shadow-2xl relative overflow-hidden">
        {/* Canvas Toolbar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              Expression: <strong className="text-cyan-300 font-mono">{currentExpr}</strong>
            </span>
            {graph && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                Final Output: {graph.outputGate.output.value ? '1 (HIGH)' : '0 (LOW)'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
              className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-slate-400">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SVG Schematic Board */}
        <div className="w-full overflow-x-auto min-h-[380px] bg-cosmos-950/80 rounded-xl border border-slate-800/80 flex items-center justify-center p-4">
          {graph ? (
            <svg
              width={graph.bounds.width * zoom}
              height={graph.bounds.height * zoom}
              viewBox={`0 0 ${graph.bounds.width} ${graph.bounds.height}`}
              className="transition-transform duration-150 select-none"
            >
              {/* Subtle background grid within SVG */}
              <defs>
                <pattern id="circuitGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(30, 41, 59, 0.3)" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuitGrid)" />

              {/* Render Wires with animated signal propagation */}
              {graph.wires.map(wire => (
                <path
                  key={wire.id}
                  d={wire.path}
                  fill="none"
                  className={wire.value ? 'wire-active' : 'wire-inactive'}
                />
              ))}

              {/* Render Gates */}
              {graph.gates.map(gate => (
                <g
                  key={gate.id}
                  onMouseEnter={() => setHoveredGate(gate)}
                  onMouseLeave={() => setHoveredGate(null)}
                  className="transition-transform duration-200 hover:opacity-90"
                >
                  {renderGateShape(gate)}

                  {/* Pin Terminals */}
                  {gate.inputs.map(pin => (
                    <circle
                      key={pin.id}
                      cx={pin.x}
                      cy={pin.y}
                      r={3.5}
                      fill={pin.value ? '#00f5ff' : '#475569'}
                      stroke="#02040a"
                      strokeWidth={1.5}
                    />
                  ))}
                  <circle
                    cx={gate.output.x}
                    cy={gate.output.y}
                    r={3.5}
                    fill={gate.output.value ? '#00f5ff' : '#475569'}
                    stroke="#02040a"
                    strokeWidth={1.5}
                  />
                </g>
              ))}
            </svg>
          ) : (
            <div className="text-center text-slate-500 text-sm font-mono p-8">
              {error || 'Building circuit schematic...'}
            </div>
          )}
        </div>

        {/* Status & Voltage Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-cyan-400 shadow-[0_0_8px_#00f5ff] rounded" />
              <span>Logic HIGH (1) - Active Voltage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-slate-700 rounded" />
              <span>Logic LOW (0) - Ground / Inactive</span>
            </div>
          </div>
          <span className="text-slate-500 italic">
            Click on input variables (P, Q, R) to toggle live signal flow.
          </span>
        </div>
      </div>
    </div>
  );
};
