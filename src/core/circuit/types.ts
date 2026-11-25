export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR' | 'INPUT' | 'OUTPUT';

export interface CircuitPin {
  id: string;
  name: string;
  gateId: string;
  type: 'input' | 'output';
  value: boolean;
  x: number;
  y: number;
}

export interface CircuitGate {
  id: string;
  type: GateType;
  label: string;
  layer: number;
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: CircuitPin[];
  output: CircuitPin;
}

export interface CircuitWire {
  id: string;
  fromPinId: string;
  toPinId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  value: boolean;
  path: string;
}

export interface CircuitGraph {
  gates: CircuitGate[];
  wires: CircuitWire[];
  inputs: CircuitGate[];
  outputGate: CircuitGate;
  bounds: { width: number; height: number };
}
