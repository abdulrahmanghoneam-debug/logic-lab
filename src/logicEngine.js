/**
 * LOGIC LAB — Deterministic Propositional & Boolean Logic Engine (v2.0)
 * Zero-dependency ES/UMD mathematical core + Context-Aware Conversational Engine.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LogicEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const OPERATORS = {
    NOT: { symbol: '¬', prec: 5, assoc: 'right', unary: true, name: 'NOT (Negation)' },
    AND: { symbol: '∧', prec: 4, assoc: 'left', unary: false, name: 'AND (Conjunction)' },
    NAND: { symbol: '⊼', prec: 4, assoc: 'left', unary: false, name: 'NAND' },
    XOR: { symbol: '⊕', prec: 3, assoc: 'left', unary: false, name: 'XOR (Exclusive OR)' },
    OR: { symbol: '∨', prec: 2, assoc: 'left', unary: false, name: 'OR (Disjunction)' },
    NOR: { symbol: '⊽', prec: 2, assoc: 'left', unary: false, name: 'NOR' },
    IMPLIES: { symbol: '→', prec: 1, assoc: 'right', unary: false, name: 'IMPLICATION (Conditional)' },
    IFF: { symbol: '↔', prec: 0, assoc: 'left', unary: false, name: 'BICONDITIONAL (XNOR)' }
  };

  function tokenize(input) {
    if (typeof input !== 'string' || !input.trim()) {
      throw new Error('Expression cannot be empty.');
    }
    const s = input.trim();
    const tokens = [];
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (/\s/.test(ch)) { i++; continue; }
      if (ch === '(' || ch === '[') { tokens.push({ type: 'LPAREN', value: '(', pos: i }); i++; continue; }
      if (ch === ')' || ch === ']') { tokens.push({ type: 'RPAREN', value: ')', pos: i }); i++; continue; }
      if (s.slice(i, i + 3) === '<->' || s.slice(i, i + 3) === '<=>') { tokens.push({ type: 'OP', op: 'IFF', value: '↔', pos: i }); i += 3; continue; }
      if (s.slice(i, i + 2) === '->' || s.slice(i, i + 2) === '=>') { tokens.push({ type: 'OP', op: 'IMPLIES', value: '→', pos: i }); i += 2; continue; }
      if (s.slice(i, i + 2) === '&&') { tokens.push({ type: 'OP', op: 'AND', value: '∧', pos: i }); i += 2; continue; }
      if (s.slice(i, i + 2) === '||') { tokens.push({ type: 'OP', op: 'OR', value: '∨', pos: i }); i += 2; continue; }
      if ('¬~!'.includes(ch)) { tokens.push({ type: 'OP', op: 'NOT', value: '¬', pos: i }); i++; continue; }
      if ('∧&*·.'.includes(ch)) { tokens.push({ type: 'OP', op: 'AND', value: '∧', pos: i }); i++; continue; }
      if ('∨|+v'.includes(ch) && (ch !== 'v' || !/[A-Za-z]/.test(s[i + 1] || ''))) { tokens.push({ type: 'OP', op: 'OR', value: '∨', pos: i }); i++; continue; }
      if ('⊕^'.includes(ch)) { tokens.push({ type: 'OP', op: 'XOR', value: '⊕', pos: i }); i++; continue; }
      if (ch === '→') { tokens.push({ type: 'OP', op: 'IMPLIES', value: '→', pos: i }); i++; continue; }
      if (ch === '↔') { tokens.push({ type: 'OP', op: 'IFF', value: '↔', pos: i }); i++; continue; }
      if (ch === '⊼' || ch === '↑') { tokens.push({ type: 'OP', op: 'NAND', value: '⊼', pos: i }); i++; continue; }
      if (ch === '⊽' || ch === '↓') { tokens.push({ type: 'OP', op: 'NOR', value: '⊽', pos: i }); i++; continue; }
      if (ch === '1') { tokens.push({ type: 'CONST', value: true, pos: i }); i++; continue; }
      if (ch === '0') { tokens.push({ type: 'CONST', value: false, pos: i }); i++; continue; }
      if (ch === "'" || ch === '′') { tokens.push({ type: 'PRIME', value: "'", pos: i }); i++; continue; }
      if (/[A-Za-z]/.test(ch)) {
        let j = i;
        while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
        const word = s.slice(i, j).toUpperCase();
        if (word === 'NOT') tokens.push({ type: 'OP', op: 'NOT', value: '¬', pos: i });
        else if (word === 'AND') tokens.push({ type: 'OP', op: 'AND', value: '∧', pos: i });
        else if (word === 'NAND') tokens.push({ type: 'OP', op: 'NAND', value: '⊼', pos: i });
        else if (word === 'OR') tokens.push({ type: 'OP', op: 'OR', value: '∨', pos: i });
        else if (word === 'NOR') tokens.push({ type: 'OP', op: 'NOR', value: '⊽', pos: i });
        else if (word === 'XOR') tokens.push({ type: 'OP', op: 'XOR', value: '⊕', pos: i });
        else if (word === 'XNOR' || word === 'IFF') tokens.push({ type: 'OP', op: 'IFF', value: '↔', pos: i });
        else if (word === 'IMPLIES' || word === 'IMP') tokens.push({ type: 'OP', op: 'IMPLIES', value: '→', pos: i });
        else if (word === 'T' || word === 'TRUE') tokens.push({ type: 'CONST', value: true, pos: i });
        else if (word === 'F' || word === 'FALSE') tokens.push({ type: 'CONST', value: false, pos: i });
        else if (word.length === 1 && 'PQRSABCD'.includes(word)) tokens.push({ type: 'VAR', value: word, pos: i });
        else throw new Error(`Unknown symbol "${s.slice(i, j)}" at position ${i + 1}. Use P, Q, R, S and operators ¬, ∧, ∨, ⊕, →, ↔.`);
        i = j; continue;
      }
      throw new Error(`Unexpected character "${ch}" at position ${i + 1}.`);
    }
    return tokens;
  }

  function parse(input) {
    const tokens = tokenize(input);
    let idx = 0;
    const peek = () => tokens[idx] || null;
    const consume = () => tokens[idx++];

    function parseIff() {
      let left = parseImplies();
      while (peek() && peek().type === 'OP' && peek().op === 'IFF') {
        consume(); left = { type: 'BINOP', op: 'IFF', left, right: parseImplies() };
      }
      return left;
    }
    function parseImplies() {
      let left = parseOr();
      if (peek() && peek().type === 'OP' && peek().op === 'IMPLIES') {
        consume(); return { type: 'BINOP', op: 'IMPLIES', left, right: parseImplies() };
      }
      return left;
    }
    function parseOr() {
      let left = parseXor();
      while (peek() && peek().type === 'OP' && (peek().op === 'OR' || peek().op === 'NOR')) {
        const op = consume().op; left = { type: 'BINOP', op, left, right: parseXor() };
      }
      return left;
    }
    function parseXor() {
      let left = parseAnd();
      while (peek() && peek().type === 'OP' && peek().op === 'XOR') {
        consume(); left = { type: 'BINOP', op: 'XOR', left, right: parseAnd() };
      }
      return left;
    }
    function parseAnd() {
      let left = parseUnary();
      while (peek() && peek().type === 'OP' && (peek().op === 'AND' || peek().op === 'NAND')) {
        const op = consume().op; left = { type: 'BINOP', op, left, right: parseUnary() };
      }
      return left;
    }
    function parseUnary() {
      if (peek() && peek().type === 'OP' && peek().op === 'NOT') {
        consume(); return { type: 'UNOP', op: 'NOT', operand: parseUnary() };
      }
      return parsePostfix();
    }
    function parsePostfix() {
      let node = parsePrimary();
      while (peek() && peek().type === 'PRIME') {
        consume(); node = { type: 'UNOP', op: 'NOT', operand: node };
      }
      return node;
    }
    function parsePrimary() {
      const tok = peek();
      if (!tok) throw new Error('Unexpected end of expression.');
      if (tok.type === 'VAR') { consume(); return { type: 'VAR', name: tok.value }; }
      if (tok.type === 'CONST') { consume(); return { type: 'CONST', value: tok.value }; }
      if (tok.type === 'LPAREN') {
        consume();
        const expr = parseIff();
        if (!peek() || peek().type !== 'RPAREN') throw new Error('Missing closing parenthesis ")".');
        consume();
        return expr;
      }
      throw new Error(`Unexpected token "${tok.value}" at position ${tok.pos + 1}.`);
    }

    const ast = parseIff();
    if (idx < tokens.length) throw new Error(`Unexpected token "${tokens[idx].value}" at position ${tokens[idx].pos + 1}.`);
    return ast;
  }

  function evaluateAST(node, env) {
    if (node.type === 'CONST') return Boolean(node.value);
    if (node.type === 'VAR') return Boolean(env[node.name]);
    if (node.type === 'UNOP') return !evaluateAST(node.operand, env);
    const l = evaluateAST(node.left, env);
    const r = evaluateAST(node.right, env);
    switch (node.op) {
      case 'AND': return l && r;
      case 'NAND': return !(l && r);
      case 'OR': return l || r;
      case 'NOR': return !(l || r);
      case 'XOR': return l !== r;
      case 'IMPLIES': return !l || r;
      case 'IFF': return l === r;
      default: return false;
    }
  }

  function astToString(node, parentPrec = -1, isRightChild = false, parentOp = null) {
    if (node.type === 'CONST') return node.value ? 'T' : 'F';
    if (node.type === 'VAR') return node.name;
    if (node.type === 'UNOP') {
      const inner = node.operand;
      return inner.type === 'BINOP' ? `¬(${astToString(inner, -1)})` : `¬${astToString(inner, OPERATORS.NOT.prec)}`;
    }
    const info = OPERATORS[node.op];
    const needParens = info.prec < parentPrec || (info.prec === parentPrec && isRightChild && parentOp !== node.op) || (info.prec === parentPrec && !isRightChild && node.op === 'IMPLIES' && parentOp === 'IMPLIES');
    const expr = `${astToString(node.left, info.prec, false, node.op)} ${info.symbol} ${astToString(node.right, info.prec, true, node.op)}`;
    return needParens ? `(${expr})` : expr;
  }

  function astToBooleanString(node, parentPrec = -1) {
    if (node.type === 'CONST') return node.value ? '1' : '0';
    if (node.type === 'VAR') return node.name;
    if (node.type === 'UNOP') {
      const inner = node.operand;
      return (inner.type === 'VAR' || inner.type === 'CONST') ? `${astToBooleanString(inner)}'` : `(${astToBooleanString(inner)})'`;
    }
    if (node.op === 'IMPLIES') {
      return astToBooleanString({ type: 'BINOP', op: 'OR', left: { type: 'UNOP', op: 'NOT', operand: node.left }, right: node.right }, parentPrec);
    }
    if (node.op === 'IFF') return `(${astToBooleanString(node.left)} ⊙ ${astToBooleanString(node.right)})`;
    const symMap = { AND: '·', OR: '+', XOR: '⊕', NAND: '⊼', NOR: '⊽' };
    const prec = OPERATORS[node.op].prec;
    const expr = node.op === 'AND' ? `${astToBooleanString(node.left, prec)}·${astToBooleanString(node.right, prec)}` : `${astToBooleanString(node.left, prec)} ${symMap[node.op]} ${astToBooleanString(node.right, prec)}`;
    return prec < parentPrec ? `(${expr})` : expr;
  }

  function astToTreeData(exprOrAst) {
    const ast = typeof exprOrAst === 'string' ? parse(exprOrAst) : exprOrAst;
    let id = 1;
    function walk(n, depth = 0) {
      const myId = id++;
      if (n.type === 'VAR') return { id: myId, label: n.name, kind: 'VAR', depth, children: [] };
      if (n.type === 'CONST') return { id: myId, label: n.value ? 'T' : 'F', kind: 'CONST', depth, children: [] };
      if (n.type === 'UNOP') return { id: myId, label: '¬', sub: 'NOT', kind: 'OP', depth, children: [walk(n.operand, depth + 1)] };
      return { id: myId, label: OPERATORS[n.op].symbol, sub: n.op, kind: 'OP', depth, children: [walk(n.left, depth + 1), walk(n.right, depth + 1)] };
    }
    return walk(ast, 0);
  }

  function extractVariables(ast) {
    const vars = new Set();
    (function walk(n) {
      if (!n) return;
      if (n.type === 'VAR') vars.add(n.name);
      else if (n.type === 'UNOP') walk(n.operand);
      else if (n.type === 'BINOP') { walk(n.left); walk(n.right); }
    })(ast);
    const order = ['P', 'Q', 'R', 'S', 'A', 'B', 'C', 'D'];
    return Array.from(vars).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }

  function collectSubexpressions(ast) {
    const seen = new Set();
    const list = [];
    (function walk(n) {
      if (!n || n.type === 'VAR' || n.type === 'CONST') return;
      if (n.type === 'UNOP') walk(n.operand);
      if (n.type === 'BINOP') { walk(n.left); walk(n.right); }
      const label = astToString(n);
      if (!seen.has(label)) { seen.add(label); list.push({ label, ast: n }); }
    })(ast);
    if (!list.length) list.push({ label: astToString(ast), ast });
    return list;
  }

  function generateTruthTable(exprStr, forcedVars = null) {
    const ast = typeof exprStr === 'string' ? parse(exprStr) : exprStr;
    const variables = forcedVars ? [...forcedVars] : extractVariables(ast);
    const subexpressions = collectSubexpressions(ast);
    const rowCount = Math.pow(2, variables.length);
    const rows = [], minterms = [], maxterms = [];
    for (let i = 0; i < rowCount; i++) {
      const env = {};
      const bitMask = rowCount - 1 - i;
      for (let v = 0; v < variables.length; v++) {
        env[variables[v]] = Boolean((bitMask >> (variables.length - 1 - v)) & 1);
      }
      const subValues = {};
      for (const sub of subexpressions) subValues[sub.label] = evaluateAST(sub.ast, env);
      const finalResult = evaluateAST(ast, env);
      if (finalResult) minterms.push(bitMask); else maxterms.push(bitMask);
      rows.push({ index: i, bitMask, inputs: env, subValues, result: finalResult });
    }
    const trueCount = rows.filter(r => r.result).length;
    const falseCount = rows.length - trueCount;
    const classification = trueCount === rows.length ? 'Tautology' : (falseCount === rows.length ? 'Contradiction' : 'Contingency');
    return {
      expression: astToString(ast), booleanExpression: astToBooleanString(ast),
      ast, variables, subexpressions, rows, trueCount, falseCount, classification,
      minterms: minterms.sort((a, b) => a - b), maxterms: maxterms.sort((a, b) => a - b)
    };
  }

  function explainRow(table, rowIndex, mode = 'TF') {
    const row = table.rows[rowIndex];
    if (!row) return [];
    const fmt = v => mode === '10' ? (v ? '1' : '0') : (v ? 'T' : 'F');
    const steps = [`Assign inputs: ${table.variables.map(v => `${v} = ${fmt(row.inputs[v])}`).join(', ') || 'Constant'}.`];
    for (const sub of table.subexpressions) {
      const n = sub.ast, val = row.subValues[sub.label];
      if (n.type === 'UNOP') {
        steps.push(`Evaluate ${sub.label}: ¬(${fmt(evaluateAST(n.operand, row.inputs))}) = ${fmt(val)}.`);
      } else if (n.type === 'BINOP') {
        const lVal = evaluateAST(n.left, row.inputs), rVal = evaluateAST(n.right, row.inputs);
        let reason = '';
        if (n.op === 'IMPLIES') reason = !lVal ? ' (vacuously true)' : (rVal ? ' (true → true)' : ' (true → false is false)');
        else if (n.op === 'XOR') reason = lVal !== rVal ? ' (inputs differ)' : ' (inputs match)';
        else if (n.op === 'IFF') reason = lVal === rVal ? ' (inputs match)' : ' (inputs differ)';
        steps.push(`Evaluate ${sub.label}: ${fmt(lVal)} ${OPERATORS[n.op].symbol} ${fmt(rVal)} = ${fmt(val)}${reason}.`);
      } else {
        steps.push(`Evaluate ${sub.label} = ${fmt(val)}.`);
      }
    }
    return steps;
  }

  function exportTruthTableCSV(table, mode = 'TF') {
    const fmt = v => mode === '10' ? (v ? '1' : '0') : (v ? 'T' : 'F');
    const lines = [[...table.variables, ...table.subexpressions.map(s => `"${s.label}"`)].join(',')];
    for (const r of table.rows) {
      lines.push([...table.variables.map(v => fmt(r.inputs[v])), ...table.subexpressions.map(s => fmt(r.subValues[s.label]))].join(','));
    }
    return lines.join('\n');
  }

  function checkEquivalence(expr1, expr2) {
    const ast1 = typeof expr1 === 'string' ? parse(expr1) : expr1;
    const ast2 = typeof expr2 === 'string' ? parse(expr2) : expr2;
    const order = ['P', 'Q', 'R', 'S', 'A', 'B', 'C', 'D'];
    const variables = Array.from(new Set([...extractVariables(ast1), ...extractVariables(ast2)])).sort((a, b) => order.indexOf(a) - order.indexOf(b));
    const t1 = generateTruthTable(ast1, variables), t2 = generateTruthTable(ast2, variables);
    const counterexamples = [];
    for (let i = 0; i < t1.rows.length; i++) {
      if (t1.rows[i].result !== t2.rows[i].result) {
        counterexamples.push({ rowIndex: i, inputs: t1.rows[i].inputs, leftValue: t1.rows[i].result, rightValue: t2.rows[i].result });
      }
    }
    return { equivalent: counterexamples.length === 0, expr1: astToString(ast1), expr2: astToString(ast2), variables, counterexamples, table1: t1, table2: t2 };
  }

  function truthTableToSOP(variables, outputs) {
    const rowCount = Math.pow(2, variables.length);
    const logicTerms = [], boolTerms = [], minterms = [];
    for (let i = 0; i < rowCount; i++) {
      if (!outputs[i]) continue;
      const bitMask = rowCount - 1 - i;
      minterms.push(bitMask);
      const lLits = [], bLits = [];
      for (let v = 0; v < variables.length; v++) {
        const bit = Boolean((bitMask >> (variables.length - 1 - v)) & 1);
        lLits.push(bit ? variables[v] : `¬${variables[v]}`);
        bLits.push(bit ? variables[v] : `${variables[v]}'`);
      }
      logicTerms.push(lLits.length > 1 ? `(${lLits.join(' ∧ ')})` : lLits[0]);
      boolTerms.push(bLits.join('·'));
    }
    if (!logicTerms.length) return { logic: 'F', boolean: '0', minterms: [] };
    if (logicTerms.length === rowCount) return { logic: 'T', boolean: '1', minterms: minterms.sort((a, b) => a - b) };
    return { logic: logicTerms.join(' ∨ '), boolean: boolTerms.join(' + '), minterms: minterms.sort((a, b) => a - b) };
  }

  function truthTableToPOS(variables, outputs) {
    const rowCount = Math.pow(2, variables.length);
    const logicTerms = [], boolTerms = [], maxterms = [];
    for (let i = 0; i < rowCount; i++) {
      if (outputs[i]) continue;
      const bitMask = rowCount - 1 - i;
      maxterms.push(bitMask);
      const lLits = [], bLits = [];
      for (let v = 0; v < variables.length; v++) {
        const bit = Boolean((bitMask >> (variables.length - 1 - v)) & 1);
        lLits.push(bit ? `¬${variables[v]}` : variables[v]);
        bLits.push(bit ? `${variables[v]}'` : variables[v]);
      }
      logicTerms.push(lLits.length > 1 ? `(${lLits.join(' ∨ ')})` : lLits[0]);
      boolTerms.push(`(${bLits.join(' + ')})`);
    }
    if (!logicTerms.length) return { logic: 'T', boolean: '1', maxterms: [] };
    if (logicTerms.length === rowCount) return { logic: 'F', boolean: '0', maxterms: maxterms.sort((a, b) => a - b) };
    return { logic: logicTerms.join(' ∧ '), boolean: boolTerms.join('·'), maxterms: maxterms.sort((a, b) => a - b) };
  }

  function astToCircuit(exprOrAst) {
    const ast = typeof exprOrAst === 'string' ? parse(exprOrAst) : exprOrAst;
    const nodes = [], edges = [], inputMap = {};
    let nextId = 1;
    const addNode = (kind, label, layer) => { const node = { id: `n${nextId++}`, kind, label, layer, inputs: [] }; nodes.push(node); return node; };
    function build(n) {
      if (n.type === 'VAR') { if (!inputMap[n.name]) inputMap[n.name] = addNode('INPUT', n.name, 0); return inputMap[n.name]; }
      if (n.type === 'CONST') return addNode('CONST', n.value ? '1' : '0', 0);
      if (n.type === 'UNOP' && n.op === 'NOT') {
        if (n.operand.type === 'BINOP' && ['AND', 'OR', 'XOR'].includes(n.operand.op)) {
          const l = build(n.operand.left), r = build(n.operand.right);
          const gKind = n.operand.op === 'AND' ? 'NAND' : (n.operand.op === 'OR' ? 'NOR' : 'XNOR');
          const g = addNode(gKind, gKind, Math.max(l.layer, r.layer) + 1);
          g.inputs = [l.id, r.id];
          edges.push({ from: l.id, to: g.id, port: 0 }, { from: r.id, to: g.id, port: 1 });
          return g;
        }
        const c = build(n.operand);
        const g = addNode('NOT', 'NOT', c.layer + 1);
        g.inputs = [c.id]; edges.push({ from: c.id, to: g.id, port: 0 });
        return g;
      }
      if (n.op === 'IMPLIES') {
        const l = build(n.left), r = build(n.right);
        const notL = addNode('NOT', 'NOT', l.layer + 1);
        notL.inputs = [l.id]; edges.push({ from: l.id, to: notL.id, port: 0 });
        const orG = addNode('OR', 'OR', Math.max(notL.layer, r.layer) + 1);
        orG.inputs = [notL.id, r.id]; edges.push({ from: notL.id, to: orG.id, port: 0 }, { from: r.id, to: orG.id, port: 1 });
        return orG;
      }
      const l = build(n.left), r = build(n.right);
      const kind = n.op === 'IFF' ? 'XNOR' : n.op;
      const g = addNode(kind, kind, Math.max(l.layer, r.layer) + 1);
      g.inputs = [l.id, r.id]; edges.push({ from: l.id, to: g.id, port: 0 }, { from: r.id, to: g.id, port: 1 });
      return g;
    }
    const rootNode = build(ast);
    const outNode = addNode('OUTPUT', 'OUT', rootNode.layer + 1);
    outNode.inputs = [rootNode.id];
    edges.push({ from: rootNode.id, to: outNode.id, port: 0 });
    return { expression: astToString(ast), variables: Object.keys(inputMap).sort(), nodes, edges, outputNodeId: outNode.id, maxLayer: outNode.layer };
  }

  function evaluateCircuit(circuit, inputValues = {}) {
    const values = {};
    const sorted = [...circuit.nodes].sort((a, b) => a.layer - b.layer);
    for (const n of sorted) {
      if (n.kind === 'INPUT') values[n.id] = Boolean(inputValues[n.label]);
      else if (n.kind === 'CONST') values[n.id] = n.label === '1';
      else if (n.kind === 'NOT') values[n.id] = !values[n.inputs[0]];
      else if (n.kind === 'OUTPUT') values[n.id] = values[n.inputs[0]];
      else {
        const a = values[n.inputs[0]], b = values[n.inputs[1]];
        if (n.kind === 'AND') values[n.id] = a && b;
        else if (n.kind === 'OR') values[n.id] = a || b;
        else if (n.kind === 'NAND') values[n.id] = !(a && b);
        else if (n.kind === 'NOR') values[n.id] = !(a || b);
        else if (n.kind === 'XOR') values[n.id] = a !== b;
        else if (n.kind === 'XNOR') values[n.id] = a === b;
      }
    }
    return { nodeValues: values, output: values[circuit.outputNodeId] };
  }

  function circuitToExpression(circuit) {
    const map = Object.fromEntries(circuit.nodes.map(n => [n.id, n]));
    function toAst(id) {
      const n = map[id];
      if (n.kind === 'INPUT') return { type: 'VAR', name: n.label };
      if (n.kind === 'CONST') return { type: 'CONST', value: n.label === '1' };
      if (n.kind === 'OUTPUT') return toAst(n.inputs[0]);
      if (n.kind === 'NOT') return { type: 'UNOP', op: 'NOT', operand: toAst(n.inputs[0]) };
      const l = toAst(n.inputs[0]), r = toAst(n.inputs[1]);
      return { type: 'BINOP', op: n.kind === 'XNOR' ? 'IFF' : n.kind, left: l, right: r };
    }
    const ast = toAst(circuit.outputNodeId);
    return { logic: astToString(ast), boolean: astToBooleanString(ast), ast };
  }

  const astEqual = (a, b) => astToString(a) === astToString(b);
  const isNegationOf = (a, b) => (a.type === 'UNOP' && a.op === 'NOT' && astEqual(a.operand, b)) || (b.type === 'UNOP' && b.op === 'NOT' && astEqual(b.operand, a));

  function simplifyOneStep(node) {
    if (!node) return null;
    if (node.type === 'BINOP' && node.op === 'IMPLIES') {
      return { node: { type: 'BINOP', op: 'OR', left: { type: 'UNOP', op: 'NOT', operand: node.left }, right: node.right }, law: 'Implication Equivalence', rule: 'A → B ≡ ¬A ∨ B', explanation: 'Rewrite conditional implication into disjunctive Boolean form.' };
    }
    if (node.type === 'UNOP' && node.op === 'NOT' && node.operand.type === 'CONST') {
      return { node: { type: 'CONST', value: !node.operand.value }, law: 'Complement Law (Constants)', rule: '¬T ≡ F, ¬F ≡ T', explanation: 'Negate the Boolean constant.' };
    }
    if (node.type === 'UNOP' && node.op === 'NOT' && node.operand.type === 'UNOP' && node.operand.op === 'NOT') {
      return { node: node.operand.operand, law: 'Double Negation Law', rule: '¬(¬A) ≡ A', explanation: 'Two consecutive negations cancel each other.' };
    }
    if (node.type === 'UNOP' && node.op === 'NOT' && node.operand.type === 'BINOP' && (node.operand.op === 'AND' || node.operand.op === 'OR')) {
      const flipped = node.operand.op === 'AND' ? 'OR' : 'AND';
      return {
        node: { type: 'BINOP', op: flipped, left: { type: 'UNOP', op: 'NOT', operand: node.operand.left }, right: { type: 'UNOP', op: 'NOT', operand: node.operand.right } },
        law: "De Morgan's Law", rule: node.operand.op === 'AND' ? '¬(A ∧ B) ≡ ¬A ∨ ¬B' : '¬(A ∨ B) ≡ ¬A ∧ ¬B', explanation: 'Distribute negation across the operator and invert ∧ ↔ ∨.'
      };
    }
    if (node.type === 'BINOP' && (node.op === 'AND' || node.op === 'OR')) {
      const l = node.left, r = node.right;
      if (node.op === 'AND' && r.type === 'CONST' && r.value === true) return { node: l, law: 'Identity Law', rule: 'A ∧ T ≡ A', explanation: 'Conjunction with True leaves the expression unchanged.' };
      if (node.op === 'AND' && l.type === 'CONST' && l.value === true) return { node: r, law: 'Identity Law', rule: 'T ∧ A ≡ A', explanation: 'Conjunction with True leaves the expression unchanged.' };
      if (node.op === 'OR' && r.type === 'CONST' && r.value === false) return { node: l, law: 'Identity Law', rule: 'A ∨ F ≡ A', explanation: 'Disjunction with False leaves the expression unchanged.' };
      if (node.op === 'OR' && l.type === 'CONST' && l.value === false) return { node: r, law: 'Identity Law', rule: 'F ∨ A ≡ A', explanation: 'Disjunction with False leaves the expression unchanged.' };
      if (node.op === 'OR' && ((l.type === 'CONST' && l.value === true) || (r.type === 'CONST' && r.value === true))) return { node: { type: 'CONST', value: true }, law: 'Domination Law', rule: 'A ∨ T ≡ T', explanation: 'Any disjunction with True is always True.' };
      if (node.op === 'AND' && ((l.type === 'CONST' && l.value === false) || (r.type === 'CONST' && r.value === false))) return { node: { type: 'CONST', value: false }, law: 'Domination Law', rule: 'A ∧ F ≡ F', explanation: 'Any conjunction with False is always False.' };
      if (astEqual(l, r)) return { node: l, law: 'Idempotent Law', rule: node.op === 'AND' ? 'A ∧ A ≡ A' : 'A ∨ A ≡ A', explanation: 'Combining an expression with itself yields the same expression.' };
      if (isNegationOf(l, r)) return { node: { type: 'CONST', value: node.op === 'OR' }, law: 'Complement Law', rule: node.op === 'OR' ? 'A ∨ ¬A ≡ T' : 'A ∧ ¬A ≡ F', explanation: node.op === 'OR' ? 'A proposition OR its negation is always True.' : 'A proposition AND its negation is always False.' };
      const opp = node.op === 'OR' ? 'AND' : 'OR';
      if (r.type === 'BINOP' && r.op === opp && (astEqual(l, r.left) || astEqual(l, r.right))) return { node: l, law: 'Absorption Law', rule: node.op === 'OR' ? 'A ∨ (A ∧ B) ≡ A' : 'A ∧ (A ∨ B) ≡ A', explanation: 'The broader term absorbs the redundant compound term.' };
      if (l.type === 'BINOP' && l.op === opp && (astEqual(r, l.left) || astEqual(r, l.right))) return { node: r, law: 'Absorption Law', rule: node.op === 'OR' ? '(A ∧ B) ∨ A ≡ A' : '(A ∨ B) ∧ A ≡ A', explanation: 'The broader term absorbs the redundant compound term.' };
      if (l.type === 'BINOP' && r.type === 'BINOP' && l.op === opp && r.op === opp) {
        const pairs = [[l.left, r.left, l.right, r.right], [l.left, r.right, l.right, r.left], [l.right, r.left, l.left, r.right], [l.right, r.right, l.left, r.left]];
        for (const [c1, c2, rem1, rem2] of pairs) {
          if (astEqual(c1, c2)) {
            return {
              node: { type: 'BINOP', op: opp, left: c1, right: { type: 'BINOP', op: node.op, left: rem1, right: rem2 } },
              law: 'Distributive Law (Factoring)', rule: opp === 'AND' ? '(A ∧ B) ∨ (A ∧ C) ≡ A ∧ (B ∨ C)' : '(A ∨ B) ∧ (A ∨ C) ≡ A ∨ (B ∧ C)', explanation: `Factor out common term ${astToString(c1)}.`
            };
          }
        }
      }
      if (r.type === 'BINOP' && r.op === opp) {
        if (isNegationOf(l, r.left)) return { node: { type: 'BINOP', op: node.op, left: l, right: r.right }, law: 'Distributive & Complement Law', rule: node.op === 'OR' ? 'A ∨ (¬A ∧ B) ≡ A ∨ B' : 'A ∧ (¬A ∨ B) ≡ A ∧ B', explanation: 'Distributing eliminates the complementary literal.' };
        if (isNegationOf(l, r.right)) return { node: { type: 'BINOP', op: node.op, left: l, right: r.left }, law: 'Distributive & Complement Law', rule: node.op === 'OR' ? 'A ∨ (B ∧ ¬A) ≡ A ∨ B' : 'A ∧ (B ∨ ¬A) ≡ A ∧ B', explanation: 'Distributing eliminates the complementary literal.' };
      }
      if (l.type === 'BINOP' && l.op === node.op) {
        if (astEqual(l.left, r) || astEqual(l.right, r)) return { node: l, law: 'Associative & Idempotent Laws', rule: node.op === 'OR' ? '(A ∨ B) ∨ A ≡ A ∨ B' : '(A ∧ B) ∧ A ≡ A ∧ B', explanation: 'Regroup duplicate operands via Associative Law and reduce.' };
        if (isNegationOf(l.left, r) || isNegationOf(l.right, r)) {
          const other = isNegationOf(l.left, r) ? l.right : l.left;
          return { node: { type: 'BINOP', op: node.op, left: other, right: { type: 'CONST', value: node.op === 'OR' } }, law: 'Associative & Complement Laws', rule: node.op === 'OR' ? '(A ∨ B) ∨ ¬A ≡ B ∨ T' : '(A ∧ B) ∧ ¬A ≡ B ∧ F', explanation: 'Group complementary terms using Associative & Commutative Laws.' };
        }
      }
    }
    if (node.type === 'UNOP') {
      const sub = simplifyOneStep(node.operand);
      if (sub) return { ...sub, node: { type: 'UNOP', op: node.op, operand: sub.node } };
    }
    if (node.type === 'BINOP') {
      const lStep = simplifyOneStep(node.left);
      if (lStep) return { ...lStep, node: { type: 'BINOP', op: node.op, left: lStep.node, right: node.right } };
      const rStep = simplifyOneStep(node.right);
      if (rStep) return { ...rStep, node: { type: 'BINOP', op: node.op, left: node.left, right: rStep.node } };
    }
    return null;
  }

  function simplifyBoolean(exprStr) {
    const startAst = typeof exprStr === 'string' ? parse(exprStr) : JSON.parse(JSON.stringify(exprStr));
    let current = JSON.parse(JSON.stringify(startAst));
    const steps = [], seen = new Set([astToString(current)]);
    for (let i = 0; i < 15; i++) {
      const res = simplifyOneStep(current);
      if (!res) break;
      const before = astToString(current), after = astToString(res.node);
      if (seen.has(after)) break;
      seen.add(after);
      steps.push({ step: steps.length + 1, before, after, law: res.law, rule: res.rule, explanation: res.explanation });
      current = res.node;
    }
    const eq = checkEquivalence(startAst, current);
    return {
      original: astToString(startAst),
      simplified: astToString(current),
      simplifiedBoolean: astToBooleanString(current),
      steps,
      verifiedEquivalent: eq.equivalent,
      comparisonTable: eq
    };
  }

  const BOOLEAN_LAWS = [
    { id: 'identity', name: 'Identity Laws', formulas: ['P ∧ T ≡ P', 'P ∨ F ≡ P'], example: 'P ∧ T', desc: 'True is the identity for AND; False for OR.' },
    { id: 'domination', name: 'Domination Laws', formulas: ['P ∨ T ≡ T', 'P ∧ F ≡ F'], example: 'P ∨ T', desc: 'True dominates OR; False dominates AND.' },
    { id: 'idempotent', name: 'Idempotent Laws', formulas: ['P ∧ P ≡ P', 'P ∨ P ≡ P'], example: 'P ∧ P', desc: 'Repeating the same variable changes nothing.' },
    { id: 'double_neg', name: 'Double Negation', formulas: ['¬(¬P) ≡ P'], example: '¬(¬P)', desc: 'Double negation restores the original value.' },
    { id: 'complement', name: 'Complement Laws', formulas: ['P ∨ ¬P ≡ T', 'P ∧ ¬P ≡ F'], example: 'P ∨ ¬P', desc: 'A variable and its negation cover all cases or conflict.' },
    { id: 'commutative', name: 'Commutative Laws', formulas: ['P ∧ Q ≡ Q ∧ P', 'P ∨ Q ≡ Q ∨ P'], example: 'P ∧ Q', desc: 'Order does not change AND or OR results.' },
    { id: 'associative', name: 'Associative Laws', formulas: ['(P ∧ Q) ∧ R ≡ P ∧ (Q ∧ R)'], example: '(P ∨ Q) ∨ ¬P', desc: 'Identical operators can be regrouped freely.' },
    { id: 'distributive', name: 'Distributive Laws', formulas: ['(P ∧ Q) ∨ (P ∧ R) ≡ P ∧ (Q ∨ R)'], example: '(P ∧ Q) ∨ (P ∧ ¬Q)', desc: 'Factor or expand across AND and OR.' },
    { id: 'demorgan', name: "De Morgan's Laws", formulas: ['¬(P ∧ Q) ≡ ¬P ∨ ¬Q', '¬(P ∨ Q) ≡ ¬P ∧ ¬Q'], example: '¬(P ∧ ¬Q)', desc: 'Negation splits the operator and flips ∧ ↔ ∨.' },
    { id: 'absorption', name: 'Absorption Laws', formulas: ['P ∨ (P ∧ Q) ≡ P', 'P ∧ (P ∨ Q) ≡ P'], example: 'P ∨ (P ∧ Q)', desc: 'A standalone term absorbs any compound containing it.' }
  ];

  /**
   * Context-Aware Conversational Assistant Engine (Deterministic Math + Safe Actions)
   */
  function answerInContext(rawInput, ctx = {}) {
    const text = (rawInput || '').trim();
    const lower = text.toLowerCase();
    const activeExpr = ctx.expression || '(P ∧ ¬Q) → R';
    const activeTab = ctx.activeTab || 'truthtable';

    if (!text) return { action: 'NONE', reply: 'Ask me anything about your current expression, truth table, circuit, or Boolean proof.' };

    // 1. Context-aware: "Explain this truth table"
    if (/explain\s+(this|the|my)?\s*truth\s*table|summarize\s+truth\s*table/i.test(lower)) {
      const t = generateTruthTable(activeExpr);
      const reply = `Your active expression ${t.expression} uses ${t.variables.length} variable(s) (${t.variables.join(', ')}), creating ${t.rows.length} rows. It evaluates to True on ${t.trueCount} rows and False on ${t.falseCount} rows, which makes it a ${t.classification}.`;
      return { action: 'NAVIGATE', tab: 'truthtable', reply };
    }

    // 2. Context-aware: "Why is the final column false / true?"
    if (/(why|when).*(final\s*column|output|result|it).*(false|0)/i.test(lower)) {
      const t = generateTruthTable(activeExpr);
      const falseRows = t.rows.filter(r => !r.result);
      if (falseRows.length === 0) {
        return { action: 'NONE', reply: `Actually, ${t.expression} is never False — it's a Tautology, so every single row evaluates to True.` };
      }
      const sample = falseRows.slice(0, 2).map(r =>
        '(' + t.variables.map(v => `${v}=${r.inputs[v] ? 'T' : 'F'}`).join(', ') + ')'
      ).join(' and ');
      const reply = `${t.expression} is False on ${falseRows.length} of ${t.rows.length} rows — for example when ${sample}. Click any highlighted False row in the table to trace each intermediate step.`;
      return { action: 'HIGHLIGHT_ROW', rowIndex: falseRows[0].index, tab: 'truthtable', reply };
    }
    if (/(why|when).*(final\s*column|output|result|it).*(true|1)/i.test(lower)) {
      const t = generateTruthTable(activeExpr);
      const trueRows = t.rows.filter(r => r.result);
      if (trueRows.length === 0) {
        return { action: 'NONE', reply: `${t.expression} is a Contradiction — it is never True under any variable assignment.` };
      }
      const sample = trueRows.slice(0, 2).map(r =>
        '(' + t.variables.map(v => `${v}=${r.inputs[v] ? 'T' : 'F'}`).join(', ') + ')'
      ).join(' and ');
      return { action: 'HIGHLIGHT_ROW', rowIndex: trueRows[0].index, tab: 'truthtable', reply: `${t.expression} is True on ${trueRows.length} of ${t.rows.length} rows, such as ${sample}.` };
    }

    // 3. Context-aware: "Explain this screen / what am I looking at"
    if (/explain\s+(this|the)?\s*(screen|page|module|view)|where\s+am\s+i/i.test(lower)) {
      const tabDesc = {
        home: 'You are on the LOGIC LAB Mission Hub, where you can jump into any Discrete Structures module or replay the cinematic opening.',
        tutorial: `You are in Guided Learning (Lesson ${(ctx.tutorialStage || 0) + 1} of 11). Each lesson pairs a concise explanation with an interactive check.`,
        builder: `You are in the Proposition Builder inspecting the parse tree and operator precedence of ${activeExpr}.`,
        truthtable: `You are in the Truth Table Generator analyzing all 2ⁿ combinations and intermediate columns for ${activeExpr}.`,
        circuits: `You are in the Live Logic Gates Lab simulating ${activeExpr}. Flip any input switch to trace active signals.`,
        boolean: `You are in the Boolean Algebra Lab, which simplifies formulas step-by-step and proves equivalence with side-by-side truth tables.`,
        converter: `You are in Expression Conversion, where toggling any truth-table cell synthesizes canonical SOP and POS forms instantaneously.`,
        playground: `You are in the Open Logic Playground, where the expression, truth table, circuit, and simplification all update together in real time.`,
        challenge: `You are in Live Challenges — test your mastery and reveal the verified proof, truth table, and circuit.`
      };
      return { action: 'NONE', reply: tabDesc[activeTab] || `You are working with ${activeExpr}.` };
    }

    // 4. "Explain De Morgan's law in simpler words"
    if (/de\s*morgan.*(simpler|simple|plain|easy)|دي مورغان/i.test(lower)) {
      return {
        action: 'SIMPLIFY',
        expression: '¬(P ∧ Q)',
        reply: `In plain words: saying "it is NOT true that both P and Q happened" is the exact same as saying "either P didn't happen, or Q didn't happen." Break the negation across the parentheses and flip AND ↔ OR. I've loaded ¬(P ∧ Q) in the Boolean Lab so you can see the proof.`
      };
    }

    // 5. "Generate another example"
    if (/(generate|give|show)\s+(me\s+)?(another|a\s+new|random)\s+(example|expression)/i.test(lower)) {
      const pool = ['(P ∧ Q) → R', '¬(P ∨ Q) ↔ (¬P ∧ ¬Q)', '(P ⊕ Q) ∧ ¬R', 'P ∨ (P ∧ Q)', '(P → Q) ∧ (Q → R)'];
      const filtered = pool.filter(e => e !== activeExpr);
      const picked = filtered[Math.floor(Math.random() * filtered.length)];
      const t = generateTruthTable(picked);
      return {
        action: 'LOAD_EXPR',
        expression: t.expression,
        reply: `Loaded a fresh example: ${t.expression}. It has ${t.rows.length} rows and is classified as a ${t.classification}.`
      };
    }

    // 6. "Show me the circuit for this expression"
    if (/(show|convert|build|draw).*(circuit|gate).*(this|current)?/i.test(lower)) {
      const c = astToCircuit(activeExpr);
      return {
        action: 'CIRCUIT',
        expression: activeExpr,
        reply: `Compiled ${activeExpr} into a ${c.nodes.length - c.variables.length - 1}-gate digital circuit. Flip any input switch to observe live signal propagation.`
      };
    }

    // 7. "Simplify this expression"
    if (/simplify\s+(this|the|current)?\s*(expression|formula)?$/i.test(lower)) {
      const res = simplifyBoolean(activeExpr);
      const reply = res.steps.length
        ? `Simplified ${res.original} to ${res.simplified} in ${res.steps.length} verified step(s), starting with ${res.steps[0].law}.`
        : `${res.original} is already in simplified form under standard Boolean laws.`;
      return { action: 'SIMPLIFY', expression: activeExpr, reply };
    }

    // 8. Ambiguity detection
    if (/(tea or coffee and cake|p and q or r|p or q and r)/i.test(text) && !/[()]/.test(text)) {
      return {
        action: 'AMBIGUOUS',
        reply: 'That phrasing has two valid groupings depending on operator precedence. Which interpretation would you like me to evaluate?',
        interpretations: [
          { label: '(P ∧ Q) ∨ R — Group AND first', expression: '(P ∧ Q) ∨ R' },
          { label: 'P ∧ (Q ∨ R) — Group OR first', expression: 'P ∧ (Q ∨ R)' }
        ]
      };
    }
    if (/either .+ or .+/i.test(text) && !/(xor|exclusive|inclusive)/i.test(text) && !/[∧∨⊕→↔]/.test(text)) {
      return {
        action: 'AMBIGUOUS',
        reply: '"Either … or …" can mean Exclusive OR (⊕) or Inclusive OR (∨). Which should we use?',
        interpretations: [
          { label: 'P ⊕ Q — Exclusive OR (one, not both)', expression: 'P ⊕ Q' },
          { label: 'P ∨ Q — Inclusive OR (at least one)', expression: 'P ∨ Q' }
        ]
      };
    }

    // 9. Named laws, comparisons, navigation, or direct expression parsing
    if (/de\s*morgan/i.test(lower)) return { action: 'SIMPLIFY', expression: '¬(P ∧ Q)', reply: "Opening De Morgan's Law proof for ¬(P ∧ Q) ≡ ¬P ∨ ¬Q." };
    if (/compare.*(xor).*(or)|compare.*(or).*(xor)/i.test(lower)) {
      return { action: 'COMPARE', expr1: 'P ⊕ Q', expr2: 'P ∨ Q', reply: 'Comparing XOR (P ⊕ Q) and OR (P ∨ Q): they agree on 3 rows and differ only when P = T and Q = T, where XOR is False and OR is True.' };
    }
    if (/explain.*implication/i.test(lower)) {
      return { action: 'LOAD_EXPR', expression: 'P → Q', tab: 'truthtable', reply: 'Implication (P → Q) means "If P, then Q." It is False ONLY when P is True and Q is False; whenever P is False, P → Q is vacuously True.' };
    }
    if (/(open|go to|switch to).*(playground)/i.test(lower)) return { action: 'NAVIGATE', tab: 'playground', reply: 'Opening the unified Logic Playground.' };
    if (/(open|go to|switch to).*(builder|tree)/i.test(lower)) return { action: 'NAVIGATE', tab: 'builder', reply: 'Opening the Proposition Builder & Parse Tree view.' };
    if (/(open|go to|switch to).*(tutorial|learn|guide)/i.test(lower)) return { action: 'NAVIGATE', tab: 'tutorial', reply: 'Opening the 11-stage Guided Learning track.' };
    if (/(open|go to|switch to).*(challenge|quiz)/i.test(lower)) return { action: 'NAVIGATE', tab: 'challenge', reply: 'Opening Live Challenges.' };
    if (/(open|go to|switch to).*(convert|sop|pos)/i.test(lower)) return { action: 'NAVIGATE', tab: 'converter', reply: 'Opening Expression Conversion Studio.' };
    if (/(presentation|present mode)/i.test(lower)) return { action: 'PRESENTATION', reply: 'Launching Professor Presentation Mode.' };

    // Attempt to extract & parse an explicit logical expression
    let cleaned = text
      .replace(/^(please\s+)?(create|generate|build|show|make|convert|draw|simplify|evaluate)\s+(me\s+)?(a\s+)?(truth\s*table|logic\s*circuit|logic\s*gates|circuit|boolean\s*expression)?\s*(for|of|into)?\s*/i, '')
      .replace(/^(احسب|أنشئ|اعرض|حول|بسط)\s+(جدول\s*الصواب|دائرة\s*منطقية|التعبير)?\s*(لـ|ل)?\s*/i, '')
      .replace(/[.؟?!]+$/, '')
      .replace(/ليس/g, 'NOT ').replace(/و/g, ' AND ').replace(/أو/g, ' OR ').trim();

    try {
      const parsed = parse(cleaned || text);
      const canon = astToString(parsed);
      const t = generateTruthTable(canon);
      if (/simplify|boolean/i.test(lower)) {
        const s = simplifyBoolean(canon);
        return { action: 'SIMPLIFY', expression: canon, reply: `Simplified ${canon} to ${s.simplified} (${s.steps.length} verified step(s)).` };
      }
      if (/circuit|gate/i.test(lower)) {
        return { action: 'CIRCUIT', expression: canon, reply: `Built the digital logic circuit for ${canon}.` };
      }
      return { action: 'LOAD_EXPR', expression: canon, tab: 'truthtable', reply: `Generated the ${t.rows.length}-row truth table for ${canon} — classified as a ${t.classification}.` };
    } catch (_) {
      return {
        action: 'UNKNOWN',
        reply: `I didn't recognize "${text}" as a formula or command. Try asking "Explain this truth table", "Why is the final column false?", "Show me the circuit for this expression", or enter any formula like P ∧ ¬Q.`
      };
    }
  }

  const CHALLENGE_BANK = {
    beginner: [
      { expr: 'P ∧ ¬Q', type: 'evaluate', inputs: { P: true, Q: false }, prompt: 'Evaluate this expression when P = T and Q = F.' },
      { expr: 'P → Q', type: 'evaluate', inputs: { P: false, Q: false }, prompt: 'Evaluate this implication when P = F and Q = F.' },
      { expr: 'P ∨ ¬P', type: 'classify', prompt: 'Classify this expression: Tautology, Contradiction, or Contingency?' },
      { expr: 'P ∧ ¬P', type: 'classify', prompt: 'Classify this expression: Tautology, Contradiction, or Contingency?' },
      { expr: 'P ⊕ Q', type: 'evaluate', inputs: { P: true, Q: true }, prompt: 'Evaluate Exclusive OR when P = T and Q = T.' }
    ],
    intermediate: [
      { expr: '¬(P ∧ Q) ↔ (¬P ∨ ¬Q)', type: 'classify', prompt: 'Classify this De Morgan equivalence statement.' },
      { expr: '(P → Q) ↔ (¬P ∨ Q)', type: 'classify', prompt: 'Classify this conditional equivalence.' },
      { expr: '(P ∧ Q) ∨ (P ∧ ¬Q)', type: 'simplify', expectedSimplified: 'P', prompt: 'What is the simplest equivalent form of this expression?' },
      { expr: 'P ∨ (P ∧ Q)', type: 'simplify', expectedSimplified: 'P', prompt: 'Apply the Absorption Law to simplify this formula.' }
    ],
    advanced: [
      { expr: '((P → Q) ∧ (Q → R)) → (P → R)', type: 'classify', prompt: 'Classify Hypothetical Syllogism across all 8 rows.' },
      { expr: '¬(P ∨ (¬P ∧ Q))', type: 'evaluate', inputs: { P: false, Q: false }, prompt: 'Evaluate this nested expression when P = F and Q = F.' },
      { expr: '(P ⊕ Q) ↔ (¬P ⊕ ¬Q)', type: 'classify', prompt: 'Classify this XOR invariance identity.' },
      { expr: '((P ∧ Q) → R) ↔ (P → (Q → R))', type: 'classify', prompt: 'Classify the Exportation Law across all 8 rows.' }
    ]
  };

  function generateChallenge(difficulty = 'beginner', idx = null) {
    const bank = CHALLENGE_BANK[difficulty] || CHALLENGE_BANK.beginner;
    const picked = idx !== null ? bank[idx % bank.length] : bank[Math.floor(Math.random() * bank.length)];
    const table = generateTruthTable(picked.expr);
    const circuit = astToCircuit(picked.expr);
    const simp = simplifyBoolean(picked.expr);
    let correctAnswer = '', options = [], explanation = [];
    if (picked.type === 'evaluate') {
      const val = evaluateAST(table.ast, picked.inputs);
      correctAnswer = val ? 'True (1)' : 'False (0)';
      options = ['True (1)', 'False (0)'];
      const rIdx = table.rows.findIndex(r => Object.keys(picked.inputs).every(k => r.inputs[k] === picked.inputs[k]));
      explanation = explainRow(table, rIdx, 'TF');
    } else if (picked.type === 'classify') {
      correctAnswer = table.classification;
      options = ['Tautology', 'Contradiction', 'Contingency'];
      explanation = [`Evaluated all ${table.rows.length} rows for ${table.expression}.`, `True rows: ${table.trueCount}, False rows: ${table.falseCount}.`, `Classification: ${table.classification}.`];
    } else {
      correctAnswer = picked.expectedSimplified || simp.simplified;
      options = [correctAnswer, 'Q', '¬P', 'P ∨ Q'];
      explanation = simp.steps.map(s => `Step ${s.step} (${s.law}): ${s.before} ≡ ${s.after}`);
    }
    return { difficulty, ...picked, canonicalExpr: table.expression, correctAnswer, options, explanation, table, circuit, simplification: simp };
  }

  return {
    OPERATORS, BOOLEAN_LAWS, tokenize, parse, evaluateAST, astToString, astToBooleanString, astToTreeData,
    extractVariables, collectSubexpressions, generateTruthTable, explainRow, exportTruthTableCSV,
    checkEquivalence, truthTableToSOP, truthTableToPOS, astToCircuit, evaluateCircuit, circuitToExpression,
    simplifyBoolean, answerInContext, generateChallenge
  };
}));
