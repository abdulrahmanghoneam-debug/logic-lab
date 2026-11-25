import { CanonicalForms, TruthTableResult } from './types';

export class CanonicalEngine {
  public static compute(table: TruthTableResult): CanonicalForms {
    const vars = table.variables;
    const minterms: number[] = [];
    const maxterms: number[] = [];

    const sopTerms: string[] = [];
    const posTerms: string[] = [];

    // Binary index matches the integer value of the variable combination:
    // e.g. P=1, Q=0, R=1 -> binary 101 -> minterm m_5
    for (const row of table.rows) {
      let decimalIndex = 0;
      for (let i = 0; i < vars.length; i++) {
        const v = vars[i];
        if (row.values[v]) {
          decimalIndex |= (1 << (vars.length - 1 - i));
        }
      }

      if (row.result) {
        minterms.push(decimalIndex);
        // Build minterm conjunction: e.g. (P ∧ ¬Q ∧ R)
        const literals = vars.map(v => row.values[v] ? v : `¬${v}`);
        sopTerms.push(`(${literals.join(' ∧ ')})`);
      } else {
        maxterms.push(decimalIndex);
        // Build maxterm disjunction: e.g. (¬P ∨ Q ∨ ¬R)
        const literals = vars.map(v => row.values[v] ? `¬${v}` : v);
        posTerms.push(`(${literals.join(' ∨ ')})`);
      }
    }

    // Sort terms by decimal index
    minterms.sort((a, b) => a - b);
    maxterms.sort((a, b) => a - b);

    const sopExpression = sopTerms.length === 0
      ? '0 (Contradiction)'
      : sopTerms.length === table.totalRows
        ? '1 (Tautology)'
        : sopTerms.join(' ∨ ');

    const posExpression = posTerms.length === 0
      ? '1 (Tautology)'
      : posTerms.length === table.totalRows
        ? '0 (Contradiction)'
        : posTerms.join(' ∧ ');

    const sopNumeric = `Σm(${minterms.join(', ')})`;
    const posNumeric = `ΠM(${maxterms.join(', ')})`;

    return {
      variables: vars,
      minterms,
      maxterms,
      sopExpression,
      posExpression,
      sopNumeric,
      posNumeric
    };
  }
}
