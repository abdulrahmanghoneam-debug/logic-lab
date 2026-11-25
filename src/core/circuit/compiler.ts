import { ASTNode } from '../logic/types';
import { Evaluator } from '../logic/evaluator';
import { CircuitGate, CircuitGraph, CircuitPin, CircuitWire, GateType } from './types';

export class CircuitCompiler {
  private gateCounter = 0;
  private pinCounter = 0;

  public compile(ast: ASTNode, inputStates: Record<string, boolean>): CircuitGraph {
    this.gateCounter = 0;
    this.pinCounter = 0;

    const variables = Evaluator.extractVariables(ast);
    const inputGates: CircuitGate[] = [];
    const internalGates: CircuitGate[] = [];
    const wires: CircuitWire[] = [];

    // Create input nodes (Layer 0)
    const inputMap = new Map<string, CircuitGate>();
    variables.forEach(varName => {
      const gId = `input_${varName}`;
      const pId = `pin_out_${varName}`;
      const val = !!inputStates[varName];

      const outPin: CircuitPin = {
        id: pId,
        name: varName,
        gateId: gId,
        type: 'output',
        value: val,
        x: 0,
        y: 0
      };

      const gate: CircuitGate = {
        id: gId,
        type: 'INPUT',
        label: varName,
        layer: 0,
        x: 0,
        y: 0,
        width: 60,
        height: 40,
        inputs: [],
        output: outPin
      };

      inputMap.set(varName, gate);
      inputGates.push(gate);
    });

    // Recursively build gate structure from AST
    const buildSubcircuit = (node: ASTNode, depth: number): { gate: CircuitGate; outPin: CircuitPin } => {
      if (node.type === 'variable') {
        const inGate = inputMap.get(node.name);
        if (!inGate) {
          throw new Error(`Unrecognized input variable: ${node.name}`);
        }
        return { gate: inGate, outPin: inGate.output };
      }

      if (node.type === 'constant') {
        const gId = `const_${++this.gateCounter}`;
        const pId = `pin_out_${gId}`;
        const outPin: CircuitPin = {
          id: pId,
          name: node.value ? '1' : '0',
          gateId: gId,
          type: 'output',
          value: node.value,
          x: 0,
          y: 0
        };
        const gate: CircuitGate = {
          id: gId,
          type: 'INPUT',
          label: node.value ? '1' : '0',
          layer: 0,
          x: 0,
          y: 0,
          width: 50,
          height: 36,
          inputs: [],
          output: outPin
        };
        inputGates.push(gate);
        return { gate, outPin };
      }

      if (node.type === 'unary' && node.operator === 'NOT') {
        const child = buildSubcircuit(node.operand, depth + 1);
        const gId = `gate_NOT_${++this.gateCounter}`;
        const inPinId = `pin_in_${gId}_0`;
        const outPinId = `pin_out_${gId}`;

        const inVal = child.outPin.value;
        const outVal = !inVal;

        const inPin: CircuitPin = {
          id: inPinId,
          name: 'in',
          gateId: gId,
          type: 'input',
          value: inVal,
          x: 0,
          y: 0
        };

        const outPin: CircuitPin = {
          id: outPinId,
          name: 'out',
          gateId: gId,
          type: 'output',
          value: outVal,
          x: 0,
          y: 0
        };

        const gate: CircuitGate = {
          id: gId,
          type: 'NOT',
          label: 'NOT',
          layer: child.gate.layer + 1,
          x: 0,
          y: 0,
          width: 70,
          height: 48,
          inputs: [inPin],
          output: outPin
        };

        internalGates.push(gate);

        // Connect wire from child to this gate
        wires.push({
          id: `wire_${child.outPin.id}_to_${inPin.id}`,
          fromPinId: child.outPin.id,
          toPinId: inPin.id,
          fromX: 0,
          fromY: 0,
          toX: 0,
          toY: 0,
          value: inVal,
          path: ''
        });

        return { gate, outPin };
      }

      if (node.type === 'binary') {
        const left = buildSubcircuit(node.left, depth + 1);
        const right = buildSubcircuit(node.right, depth + 1);

        let gateType: GateType = 'AND';
        let label = 'AND';
        let outVal = false;

        const leftVal = left.outPin.value;
        const rightVal = right.outPin.value;

        switch (node.operator) {
          case 'AND':
            gateType = 'AND';
            label = 'AND';
            outVal = leftVal && rightVal;
            break;
          case 'NAND':
            gateType = 'NAND';
            label = 'NAND';
            outVal = !(leftVal && rightVal);
            break;
          case 'OR':
            gateType = 'OR';
            label = 'OR';
            outVal = leftVal || rightVal;
            break;
          case 'NOR':
            gateType = 'NOR';
            label = 'NOR';
            outVal = !(leftVal || rightVal);
            break;
          case 'XOR':
            gateType = 'XOR';
            label = 'XOR';
            outVal = (leftVal && !rightVal) || (!leftVal && rightVal);
            break;
          case 'IMPLIES':
            // Synthesized as ¬A ∨ B using OR gate with inverted A
            gateType = 'OR';
            label = 'OR (¬A ∨ B)';
            outVal = !leftVal || rightVal;
            break;
          case 'IFF':
            gateType = 'XNOR';
            label = 'XNOR';
            outVal = leftVal === rightVal;
            break;
        }

        const gId = `gate_${gateType}_${++this.gateCounter}`;
        const inPin0: CircuitPin = {
          id: `pin_in_${gId}_0`,
          name: 'in0',
          gateId: gId,
          type: 'input',
          value: leftVal,
          x: 0,
          y: 0
        };
        const inPin1: CircuitPin = {
          id: `pin_in_${gId}_1`,
          name: 'in1',
          gateId: gId,
          type: 'input',
          value: rightVal,
          x: 0,
          y: 0
        };
        const outPin: CircuitPin = {
          id: `pin_out_${gId}`,
          name: 'out',
          gateId: gId,
          type: 'output',
          value: outVal,
          x: 0,
          y: 0
        };

        const maxChildLayer = Math.max(left.gate.layer, right.gate.layer);
        const gate: CircuitGate = {
          id: gId,
          type: gateType,
          label,
          layer: maxChildLayer + 1,
          x: 0,
          y: 0,
          width: 80,
          height: 54,
          inputs: [inPin0, inPin1],
          output: outPin
        };

        internalGates.push(gate);

        wires.push({
          id: `wire_${left.outPin.id}_to_${inPin0.id}`,
          fromPinId: left.outPin.id,
          toPinId: inPin0.id,
          fromX: 0,
          fromY: 0,
          toX: 0,
          toY: 0,
          value: leftVal,
          path: ''
        });

        wires.push({
          id: `wire_${right.outPin.id}_to_${inPin1.id}`,
          fromPinId: right.outPin.id,
          toPinId: inPin1.id,
          fromX: 0,
          fromY: 0,
          toX: 0,
          toY: 0,
          value: rightVal,
          path: ''
        });

        return { gate, outPin };
      }

      throw new Error(`Unsupported node type in circuit compiler`);
    };

    const rootCircuit = buildSubcircuit(ast, 0);

    // Create terminal Output Node
    const outGId = 'gate_FINAL_OUTPUT';
    const outInPin: CircuitPin = {
      id: 'pin_in_FINAL_OUTPUT',
      name: 'in',
      gateId: outGId,
      type: 'input',
      value: rootCircuit.outPin.value,
      x: 0,
      y: 0
    };
    const outTerminalPin: CircuitPin = {
      id: 'pin_out_FINAL_OUTPUT',
      name: 'Q_out',
      gateId: outGId,
      type: 'output',
      value: rootCircuit.outPin.value,
      x: 0,
      y: 0
    };

    const finalOutputGate: CircuitGate = {
      id: outGId,
      type: 'OUTPUT',
      label: 'OUT',
      layer: rootCircuit.gate.layer + 1,
      x: 0,
      y: 0,
      width: 65,
      height: 42,
      inputs: [outInPin],
      output: outTerminalPin
    };

    wires.push({
      id: `wire_${rootCircuit.outPin.id}_to_${outInPin.id}`,
      fromPinId: rootCircuit.outPin.id,
      toPinId: outInPin.id,
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0,
      value: rootCircuit.outPin.value,
      path: ''
    });

    const allGates = [...inputGates, ...internalGates, finalOutputGate];

    return {
      gates: allGates,
      wires,
      inputs: inputGates,
      outputGate: finalOutputGate,
      bounds: { width: 800, height: 400 }
    };
  }
}
