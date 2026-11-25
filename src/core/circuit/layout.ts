import { CircuitGraph } from './types';

export class CircuitLayoutEngine {
  public static layout(graph: CircuitGraph, canvasWidth = 850, canvasHeight = 440): CircuitGraph {
    // Group gates by layer
    const layerMap = new Map<number, typeof graph.gates>();
    let maxLayer = 0;

    for (const gate of graph.gates) {
      if (!layerMap.has(gate.layer)) {
        layerMap.set(gate.layer, []);
      }
      layerMap.get(gate.layer)!.push(gate);
      if (gate.layer > maxLayer) maxLayer = gate.layer;
    }

    const marginX = 70;
    const marginY = 50;
    const effectiveWidth = Math.max(canvasWidth - marginX * 2, (maxLayer + 1) * 160);
    const layerStepX = maxLayer > 0 ? effectiveWidth / maxLayer : 200;

    const totalCalculatedHeight = Math.max(canvasHeight, 400);

    // Position each gate in its layer
    layerMap.forEach((gatesInLayer, layer) => {
      const x = marginX + layer * layerStepX;
      const count = gatesInLayer.length;
      const stepY = (totalCalculatedHeight - marginY * 2) / (count + 1);

      gatesInLayer.forEach((gate, idx) => {
        const y = marginY + (idx + 1) * stepY - gate.height / 2;
        gate.x = x;
        gate.y = y;

        // Position output pin on the right edge
        gate.output.x = gate.x + gate.width;
        gate.output.y = gate.y + gate.height / 2;

        // Position input pins on the left edge
        if (gate.inputs.length === 1) {
          gate.inputs[0].x = gate.x;
          gate.inputs[0].y = gate.y + gate.height / 2;
        } else if (gate.inputs.length === 2) {
          gate.inputs[0].x = gate.x;
          gate.inputs[0].y = gate.y + gate.height * 0.3;
          gate.inputs[1].x = gate.x;
          gate.inputs[1].y = gate.y + gate.height * 0.7;
        }
      });
    });

    // Map pin locations
    const pinMap = new Map<string, { x: number; y: number }>();
    for (const gate of graph.gates) {
      pinMap.set(gate.output.id, { x: gate.output.x, y: gate.output.y });
      for (const pin of gate.inputs) {
        pinMap.set(pin.id, { x: pin.x, y: pin.y });
      }
    }

    // Compute cubic bezier smooth paths for wires
    for (const wire of graph.wires) {
      const from = pinMap.get(wire.fromPinId);
      const to = pinMap.get(wire.toPinId);

      if (from && to) {
        wire.fromX = from.x;
        wire.fromY = from.y;
        wire.toX = to.x;
        wire.toY = to.y;

        const deltaX = Math.abs(to.x - from.x) * 0.5;
        const cp1x = from.x + deltaX;
        const cp1y = from.y;
        const cp2x = to.x - deltaX;
        const cp2y = to.y;

        wire.path = `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
      }
    }

    graph.bounds = {
      width: Math.max(canvasWidth, marginX * 2 + (maxLayer + 1) * layerStepX + 100),
      height: totalCalculatedHeight
    };

    return graph;
  }
}
