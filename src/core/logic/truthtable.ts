import { ASTNode, ClassificationType, TruthTableResult, TruthTableRow, VariableValues } from './types';
import { Parser } from './parser';
import { Evaluator } from './evaluator';

export class TruthTableGenerator {
  public static generate(expressionInput: string | ASTNode): TruthTableResult {
    let ast: ASTNode;
    let rawExpr = '';

    if (typeof expressionInput === 'string') {
      rawExpr = expressionInput;
      const parser = new Parser(expressionInput);
      ast = parser.parse();
    } else {
      ast = expressionInput;
      rawExpr = Evaluator.stringify(ast);
    }

    const normalizedExpr = Evaluator.stringify(ast);
    const variables = Evaluator.extractVariables(ast);

    if (variables.length === 0) {
      // Degenerate case with constants only
      const res = Evaluator.evaluate(ast, {});
      return {
        expression: rawExpr,
        normalizedExpression: normalizedExpr,
        variables: ['P'],
        subExpressions: [],
        rows: [
          {
            index: 0,
            values: { P: false },
            intermediateValues: {},
            result: res
          },
          {
            index: 1,
            values: { P: true },
            intermediateValues: {},
            result: res
          }
        ],
        classification: res ? 'Tautology' : 'Contradiction',
        trueCount: res ? 2 : 0,
        falseCount: res ? 0 : 2,
        totalRows: 2
      };
    }

    const subExprList = Evaluator.extractSubExpressions(ast);
    // Omit the root expression from intermediate columns if present, as it is the final column
    const intermediates = subExprList.filter(s => s.repr !== normalizedExpr);
    const subExprStrings = intermediates.map(s => s.repr);

    const totalRows = Math.pow(2, variables.length);
    const rows: TruthTableRow[] = [];
    let trueCount = 0;
    let falseCount = 0;

    // Generate in standard textbook descending binary order (T, T, T ... -> F, F, F)
    // or standard truth table order (row 0: 000, row 1: 001 or row 0: T T T)
    // University discrete structures standard: Row 0 is all True (1 1 1), Row 1 is (1 1 0), ..., last row is all False (0 0 0)
    for (let i = 0; i < totalRows; i++) {
      // In standard notation, row 0 has highest binary value (all 1s / Ts)
      const binaryVal = (totalRows - 1) - i;
      const values: VariableValues = {};

      for (let v = 0; v < variables.length; v++) {
        const bitShift = variables.length - 1 - v;
        const bit = (binaryVal >> bitShift) & 1;
        values[variables[v]] = bit === 1;
      }

      // Evaluate intermediate subexpressions
      const intermediateValues: Record<string, boolean> = {};
      for (const sub of intermediates) {
        intermediateValues[sub.repr] = Evaluator.evaluate(sub.node, values);
      }

      const result = Evaluator.evaluate(ast, values);
      if (result) trueCount++;
      else falseCount++;

      rows.push({
        index: i,
        values,
        intermediateValues,
        result
      });
    }

    let classification: ClassificationType = 'Contingency';
    if (trueCount === totalRows) {
      classification = 'Tautology';
    } else if (falseCount === totalRows) {
      classification = 'Contradiction';
    }

    return {
      expression: rawExpr,
      normalizedExpression: normalizedExpr,
      variables,
      subExpressions: subExprStrings,
      rows,
      classification,
      trueCount,
      falseCount,
      totalRows
    };
  }

  /**
   * Export truth table as clean GitHub Flavored Markdown
   */
  public static toMarkdown(table: TruthTableResult, notation: 'TF' | '01' = 'TF'): string {
    const formatBool = (b: boolean) => notation === 'TF' ? (b ? 'T' : 'F') : (b ? '1' : '0');

    const headers = [...table.variables, ...table.subExpressions, table.normalizedExpression];
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;

    const dataRows = table.rows.map(row => {
      const vVals = table.variables.map(v => formatBool(row.values[v]));
      const iVals = table.subExpressions.map(expr => formatBool(row.intermediateValues[expr]));
      const rVal = formatBool(row.result);
      return `| ${[...vVals, ...iVals, rVal].join(' | ')} |`;
    });

    return [
      `### Truth Table: \`${table.normalizedExpression}\``,
      `**Classification**: **${table.classification}** (${table.trueCount} True, ${table.falseCount} False out of ${table.totalRows} states)`,
      '',
      headerRow,
      separatorRow,
      ...dataRows
    ].join('\n');
  }

  /**
   * Export truth table as CSV
   */
  public static toCSV(table: TruthTableResult, notation: 'TF' | '01' = 'TF'): string {
    const formatBool = (b: boolean) => notation === 'TF' ? (b ? 'T' : 'F') : (b ? '1' : '0');
    const headers = [...table.variables, ...table.subExpressions, table.normalizedExpression];
    const rows = table.rows.map(row => {
      const vVals = table.variables.map(v => formatBool(row.values[v]));
      const iVals = table.subExpressions.map(expr => formatBool(row.intermediateValues[expr]));
      const rVal = formatBool(row.result);
      return [...vVals, ...iVals, rVal].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  }
}
