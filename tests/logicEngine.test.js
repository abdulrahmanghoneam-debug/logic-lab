const assert = require('assert');
const LE = require('../src/logicEngine.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (err) {
    failed++;
    console.error(`FAIL: ${name} -> ${err.message}`);
  }
}

test('NOT operator (¬P)', () => {
  const t = LE.generateTruthTable('¬P');
  assert.deepStrictEqual(t.rows.map(r => r.result), [false, true]);
});
test('AND operator (P ∧ Q)', () => {
  assert.deepStrictEqual(LE.generateTruthTable('P ∧ Q').rows.map(r => r.result), [true, false, false, false]);
});
test('OR operator (P ∨ Q)', () => {
  assert.deepStrictEqual(LE.generateTruthTable('P ∨ Q').rows.map(r => r.result), [true, true, true, false]);
});
test('XOR operator (P ⊕ Q)', () => {
  assert.deepStrictEqual(LE.generateTruthTable('P ⊕ Q').rows.map(r => r.result), [false, true, true, false]);
});
test('IMPLICATION operator (P → Q)', () => {
  assert.deepStrictEqual(LE.generateTruthTable('P → Q').rows.map(r => r.result), [true, false, true, true]);
});
test('BICONDITIONAL operator (P ↔ Q)', () => {
  assert.deepStrictEqual(LE.generateTruthTable('P ↔ Q').rows.map(r => r.result), [true, false, false, true]);
});
test('NAND & NOR operators', () => {
  assert.deepStrictEqual(LE.generateTruthTable('P ⊼ Q').rows.map(r => r.result), [false, true, true, true]);
  assert.deepStrictEqual(LE.generateTruthTable('P ⊽ Q').rows.map(r => r.result), [false, false, false, true]);
});
test('Operator precedence: ¬ > ∧ > ⊕ > ∨ > → > ↔', () => {
  assert.strictEqual(LE.checkEquivalence('P ∨ Q ∧ R', 'P ∨ (Q ∧ R)').equivalent, true);
  assert.strictEqual(LE.checkEquivalence('¬P ∧ Q', '(¬P) ∧ Q').equivalent, true);
  assert.strictEqual(LE.checkEquivalence('P → Q → R', 'P → (Q → R)').equivalent, true);
});
test('Double negation & ASCII aliases', () => {
  assert.strictEqual(LE.checkEquivalence('~~P && !Q', 'P AND NOT Q').equivalent, true);
});
test('Tautology detection', () => {
  assert.strictEqual(LE.generateTruthTable('P ∨ ¬P').classification, 'Tautology');
  assert.strictEqual(LE.generateTruthTable('((P → Q) ∧ (Q → R)) → (P → R)').classification, 'Tautology');
});
test('Contradiction detection', () => {
  assert.strictEqual(LE.generateTruthTable('P ∧ ¬P').classification, 'Contradiction');
  assert.strictEqual(LE.generateTruthTable('(P ↔ Q) ∧ (P ⊕ Q)').classification, 'Contradiction');
});
test('4-variable 16-row truth table', () => {
  const t = LE.generateTruthTable('(P ∧ Q) → (R ∨ S)');
  assert.strictEqual(t.rows.length, 16);
  assert.strictEqual(t.variables.length, 4);
});
test('De Morgan equivalence & XOR/OR counterexample', () => {
  assert.strictEqual(LE.checkEquivalence('¬(P ∧ Q)', '¬P ∨ ¬Q').equivalent, true);
  const neq = LE.checkEquivalence('P ⊕ Q', 'P ∨ Q');
  assert.strictEqual(neq.equivalent, false);
  assert.deepStrictEqual(neq.counterexamples[0].inputs, { P: true, Q: true });
});
test('Truth Table → SOP & POS equivalence', () => {
  const t = LE.generateTruthTable('P ⊕ Q');
  const outs = t.rows.map(r => r.result);
  assert.strictEqual(LE.checkEquivalence('P ⊕ Q', LE.truthTableToSOP(t.variables, outs).logic).equivalent, true);
  assert.strictEqual(LE.checkEquivalence('P ⊕ Q', LE.truthTableToPOS(t.variables, outs).logic).equivalent, true);
});
test('Circuit DAG simulation & reverse expression equivalence', () => {
  for (const e of ['P ∧ ¬Q', '¬(P ∧ Q)', '¬(P ∨ Q)', 'P → Q', 'P ↔ Q', '(P ⊕ Q) ∧ R']) {
    const t = LE.generateTruthTable(e);
    const c = LE.astToCircuit(e);
    for (const row of t.rows) {
      assert.strictEqual(LE.evaluateCircuit(c, row.inputs).output, row.result);
    }
    assert.strictEqual(LE.checkEquivalence(e, LE.circuitToExpression(c).logic).equivalent, true);
  }
});
test('Boolean Algebra Simplifier (all 10 law families incl. Absorption)', () => {
  const cases = [
    ['¬(¬P)', 'P'], ['P ∧ T', 'P'], ['P ∨ T', 'T'], ['P ∧ F', 'F'], ['P ∧ P', 'P'],
    ['P ∨ ¬P', 'T'], ['P ∧ ¬P', 'F'], ['(P ∧ Q) ∨ (P ∧ ¬Q)', 'P'], ['¬(P ∧ ¬Q)', '¬P ∨ Q'],
    ['P ∨ (P ∧ Q)', 'P'], ['P ∧ (P ∨ Q)', 'P']
  ];
  for (const [inp, expected] of cases) {
    const res = LE.simplifyBoolean(inp);
    assert.strictEqual(res.verifiedEquivalent, true);
    assert.strictEqual(LE.checkEquivalence(res.simplified, expected).equivalent, true);
  }
  assert.strictEqual(LE.BOOLEAN_LAWS.length, 10);
});
test('AST Parse Tree data generator', () => {
  const tree = LE.astToTreeData('(P ∧ ¬Q) → R');
  assert.strictEqual(tree.label, '→');
  assert.strictEqual(tree.children.length, 2);
});
test('Context-Aware Assistant: Explain this truth table', () => {
  const r = LE.answerInContext('Explain this truth table.', { expression: 'P → Q', activeTab: 'truthtable' });
  assert.ok(r.reply.includes('P → Q') && r.reply.includes('4 rows'));
});
test('Context-Aware Assistant: Why is the final column false?', () => {
  const r = LE.answerInContext('Why is the final column false?', { expression: 'P → Q', activeTab: 'truthtable' });
  assert.strictEqual(r.action, 'HIGHLIGHT_ROW');
  assert.strictEqual(r.rowIndex, 1);
});
test('Context-Aware Assistant: Explain this screen', () => {
  const r = LE.answerInContext('Explain this screen', { expression: 'P ∧ Q', activeTab: 'circuits' });
  assert.ok(r.reply.includes('Logic Gates Lab'));
});
test('Context-Aware Assistant: Explain De Morgan in simpler words', () => {
  const r = LE.answerInContext("Explain De Morgan's law in simpler words", { expression: 'P ∧ Q' });
  assert.strictEqual(r.action, 'SIMPLIFY');
  assert.strictEqual(r.expression, '¬(P ∧ Q)');
});
test('Context-Aware Assistant: Ambiguity detection', () => {
  const r = LE.answerInContext('P and Q or R', { expression: 'P ∧ Q' });
  assert.strictEqual(r.action, 'AMBIGUOUS');
  assert.strictEqual(r.interpretations.length, 2);
});
test('Context-Aware Assistant: Generate another example', () => {
  const r = LE.answerInContext('Generate another example', { expression: '(P ∧ Q) → R' });
  assert.strictEqual(r.action, 'LOAD_EXPR');
  assert.notStrictEqual(r.expression, '(P ∧ Q) → R');
});
test('Live Challenge Generator across all 3 tiers', () => {
  for (const diff of ['beginner', 'intermediate', 'advanced']) {
    const ch = LE.generateChallenge(diff, 0);
    assert.ok(ch.canonicalExpr && ch.correctAnswer && ch.table.rows.length >= 2);
  }
});

console.log(`\nLOGIC LAB v2.0 Unit Test Summary: ${passed} passed, ${failed} failed (Total: ${passed + failed})`);
if (failed > 0) process.exit(1);
