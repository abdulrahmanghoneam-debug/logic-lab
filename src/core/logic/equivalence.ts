import { ASTNode, EquivalenceResult, VariableValues } from './types';
import { Parser } from './parser';
import { Evaluator } from './evaluator';

export class EquivalenceChecker {
  /**
   * Evaluates if two propositional expressions are logically equivalent (A ≡ B),
   * which holds if and only if (A ↔ B) is a Tautology.
   */
  public static check(expr1Str: string, expr2Str: string): EquivalenceResult {
    const ast1 = new Parser(expr1Str).parse();
    const ast2 = new Parser(expr2Str).parse();

    const vars1 = Evaluator.extractVariables(ast1);
    const vars2 = Evaluator.extractVariables(ast2);

    // Union of all variables
    const allVarsSet = new Set([...vars1, ...vars2]);
    const order = ['P', 'Q', 'R', 'S'];
    const variables = order.filter(v => allVarsSet.has(v)).concat(Array.from(allVarsSet).filter(v => !order.includes(v)));

    const totalRows = Math.pow(2, variables.length);
    let isEquivalent = true;
    const comparisonTable: EquivalenceResult['comparisonTable'] = [];

    for (let i = 0; i < totalRows; i++) {
      const binaryVal = (totalRows - 1) - i;
      const values: VariableValues = {};

      for (let v = 0; v < variables.length; v++) {
        const bitShift = variables.length - 1 - v;
        const bit = (binaryVal >> bitShift) & 1;
        values[variables[v]] = bit === 1;
      }

      const val1 = Evaluator.evaluate(ast1, values);
      const val2 = Evaluator.evaluate(ast2, values);
      const matches = val1 === val2;

      if (!matches) {
        isEquivalent = false;
      }

      comparisonTable.push({
        index: i,
        values,
        val1,
        val2,
        matches
      });
    }

    const explanation = isEquivalent
      ? `Expressions are logically equivalent (${Evaluator.stringify(ast1)} ≡ ${Evaluator.stringify(ast2)}). The biconditional evaluates to True across all ${totalRows} state valuations.`
      : `Expressions are NOT equivalent. They diverge on ${comparisonTable.filter(r => !r.matches).length} of ${totalRows} valuation rows.`;

    return {
      expr1: Evaluator.stringify(ast1),
      expr2: Evaluator.stringify(ast2),
      isEquivalent,
      variables,
      comparisonTable,
      explanation
    };
  }
}
