import { describe, it, expect } from 'vitest';
import { Parser } from '../src/core/logic/parser';
import { Evaluator } from '../src/core/logic/evaluator';
import { TruthTableGenerator } from '../src/core/logic/truthtable';
import { CanonicalEngine } from '../src/core/logic/canonical';
import { BooleanSimplifier } from '../src/core/logic/simplifier';
import { EquivalenceChecker } from '../src/core/logic/equivalence';
import { CircuitCompiler } from '../src/core/circuit/compiler';
import { CircuitLayoutEngine } from '../src/core/circuit/layout';

describe('Discrete Mathematics Propositional Logic Engine', () => {
  it('correctly parses and evaluates conjunction (AND) and disjunction (OR)', () => {
    const ast = new Parser('P ∧ Q').parse();
    expect(Evaluator.evaluate(ast, { P: true, Q: true })).toBe(true);
    expect(Evaluator.evaluate(ast, { P: true, Q: false })).toBe(false);
    expect(Evaluator.evaluate(ast, { P: false, Q: true })).toBe(false);
    expect(Evaluator.evaluate(ast, { P: false, Q: false })).toBe(false);

    const astOr = new Parser('P ∨ Q').parse();
    expect(Evaluator.evaluate(astOr, { P: true, Q: false })).toBe(true);
    expect(Evaluator.evaluate(astOr, { P: false, Q: false })).toBe(false);
  });

  it('correctly parses and evaluates Universal NAND (⊼)', () => {
    const ast = new Parser('P ⊼ Q').parse();
    expect(Evaluator.evaluate(ast, { P: true, Q: true })).toBe(false);
    expect(Evaluator.evaluate(ast, { P: true, Q: false })).toBe(true);
    expect(Evaluator.evaluate(ast, { P: false, Q: true })).toBe(true);
    expect(Evaluator.evaluate(ast, { P: false, Q: false })).toBe(true);
  });

  it('correctly parses and evaluates Universal NOR (⊽)', () => {
    const ast = new Parser('P ⊽ Q').parse();
    expect(Evaluator.evaluate(ast, { P: false, Q: false })).toBe(true);
    expect(Evaluator.evaluate(ast, { P: true, Q: false })).toBe(false);
    expect(Evaluator.evaluate(ast, { P: false, Q: true })).toBe(false);
    expect(Evaluator.evaluate(ast, { P: true, Q: true })).toBe(false);
  });

  it('correctly evaluates material implication (P → Q)', () => {
    const ast = new Parser('P → Q').parse();
    expect(Evaluator.evaluate(ast, { P: true, Q: true })).toBe(true);
    expect(Evaluator.evaluate(ast, { P: true, Q: false })).toBe(false);
    expect(Evaluator.evaluate(ast, { P: false, Q: true })).toBe(true);
    expect(Evaluator.evaluate(ast, { P: false, Q: false })).toBe(true);
  });

  it('correctly evaluates exclusive OR (P ⊕ Q)', () => {
    const ast = new Parser('P ⊕ Q').parse();
    expect(Evaluator.evaluate(ast, { P: true, Q: true })).toBe(false);
    expect(Evaluator.evaluate(ast, { P: true, Q: false })).toBe(true);
    expect(Evaluator.evaluate(ast, { P: false, Q: true })).toBe(true);
    expect(Evaluator.evaluate(ast, { P: false, Q: false })).toBe(false);
  });

  it('correctly evaluates biconditional (P ↔ Q)', () => {
    const ast = new Parser('P ↔ Q').parse();
    expect(Evaluator.evaluate(ast, { P: true, Q: true })).toBe(true);
    expect(Evaluator.evaluate(ast, { P: true, Q: false })).toBe(false);
    expect(Evaluator.evaluate(ast, { P: false, Q: true })).toBe(false);
    expect(Evaluator.evaluate(ast, { P: false, Q: false })).toBe(true);
  });

  it('enforces operator precedence: NOT > AND > XOR > OR > IMPLIES > IFF', () => {
    const ast = new Parser('¬P ∨ Q ∧ R').parse();
    // P=T, Q=T, R=F => ¬T ∨ (T ∧ F) => F ∨ F = F
    expect(Evaluator.evaluate(ast, { P: true, Q: true, R: false })).toBe(false);
    // P=F, Q=F, R=F => ¬F ∨ (F ∧ F) => T ∨ F = T
    expect(Evaluator.evaluate(ast, { P: false, Q: false, R: false })).toBe(true);
  });

  it('verifies logical equivalence via model checking (EquivalenceChecker)', () => {
    // Implication Equivalence: P → Q ≡ ¬P ∨ Q
    const resImpl = EquivalenceChecker.check('P → Q', '¬P ∨ Q');
    expect(resImpl.isEquivalent).toBe(true);

    // De Morgan: ¬(P ∧ Q) ≡ ¬P ∨ ¬Q
    const resDeMorgan = EquivalenceChecker.check('¬(P ∧ Q)', '¬P ∨ ¬Q');
    expect(resDeMorgan.isEquivalent).toBe(true);

    // Non-equivalent check: P ∧ Q vs P ∨ Q
    const resDifferent = EquivalenceChecker.check('P ∧ Q', 'P ∨ Q');
    expect(resDifferent.isEquivalent).toBe(false);
  });

  it('identifies Tautology, Contradiction, and Contingency', () => {
    const taut = TruthTableGenerator.generate('P ∨ ¬P');
    expect(taut.classification).toBe('Tautology');

    const contra = TruthTableGenerator.generate('P ∧ ¬P');
    expect(contra.classification).toBe('Contradiction');

    const conting = TruthTableGenerator.generate('P ∧ Q');
    expect(conting.classification).toBe('Contingency');
  });

  it('computes Canonical SOP (Minterms) and POS (Maxterms)', () => {
    const table = TruthTableGenerator.generate('P ∧ Q');
    const canonical = CanonicalEngine.compute(table);
    expect(canonical.minterms).toEqual([3]);
    expect(canonical.maxterms).toEqual([0, 1, 2]);
    expect(canonical.sopNumeric).toBe('Σm(3)');
    expect(canonical.posNumeric).toBe('ΠM(0, 1, 2)');
  });

  it('simplifies expressions applying Absorption and De Morgan Laws', () => {
    const deMorgan = BooleanSimplifier.simplifyWithSteps('¬(P ∧ Q)');
    expect(deMorgan.some(s => s.law.includes("De Morgan's"))).toBe(true);

    const absorption = BooleanSimplifier.simplifyWithSteps('P ∨ (P ∧ Q)');
    expect(absorption.some(s => s.law.includes('Absorption'))).toBe(true);
  });

  it('compiles Circuit Graph with NAND and NOR gates and active propagation', () => {
    const ast = new Parser('P ⊼ Q').parse();
    const compiler = new CircuitCompiler();
    const graph = compiler.compile(ast, { P: true, Q: true });
    expect(graph.gates.some(g => g.type === 'NAND')).toBe(true);
    expect(graph.outputGate.output.value).toBe(false);

    const layout = CircuitLayoutEngine.layout(graph);
    expect(layout.bounds.width).toBeGreaterThan(0);
    expect(layout.wires[0].path).toContain('M');
  });
});
