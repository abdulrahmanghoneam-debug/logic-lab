import { ASTNode, VariableValues } from './types';

export class Evaluator {
  public static evaluate(node: ASTNode, values: VariableValues): boolean {
    switch (node.type) {
      case 'constant':
        return node.value;

      case 'variable':
        if (!(node.name in values)) {
          throw new Error(`Variable '${node.name}' has no assigned truth value.`);
        }
        return !!values[node.name];

      case 'unary':
        if (node.operator === 'NOT') {
          return !this.evaluate(node.operand, values);
        }
        throw new Error('Unknown unary operator');

      case 'binary': {
        const leftVal = this.evaluate(node.left, values);
        const rightVal = this.evaluate(node.right, values);

        switch (node.operator) {
          case 'AND':
            return leftVal && rightVal;
          case 'OR':
            return leftVal || rightVal;
          case 'XOR':
            return (leftVal && !rightVal) || (!leftVal && rightVal);
          case 'NAND':
            return !(leftVal && rightVal);
          case 'NOR':
            return !(leftVal || rightVal);
          case 'IMPLIES':
            // P -> Q is false ONLY when P is true and Q is false
            return !leftVal || rightVal;
          case 'IFF':
            // P <-> Q is true when both are equal
            return leftVal === rightVal;
          default:
            throw new Error(`Unknown binary operator`);
        }
      }

      default:
        throw new Error(`Unknown AST node type`);
    }
  }

  /**
   * Convert AST node back to a standard logical formula string
   */
  public static stringify(node: ASTNode, parentPrecedence = 0): string {
    const precedenceMap: Record<string, number> = {
      'IFF': 1,
      'IMPLIES': 2,
      'OR': 3,
      'NOR': 3,
      'XOR': 4,
      'AND': 5,
      'NAND': 5,
      'NOT': 6,
    };

    const opSymbolMap: Record<string, string> = {
      'IFF': '↔',
      'IMPLIES': '→',
      'OR': '∨',
      'NOR': '⊽',
      'XOR': '⊕',
      'AND': '∧',
      'NAND': '⊼',
      'NOT': '¬',
    };

    switch (node.type) {
      case 'constant':
        return node.value ? 'T' : 'F';

      case 'variable':
        return node.name;

      case 'unary': {
        const childStr = this.stringify(node.operand, 6);
        return `¬${childStr}`;
      }

      case 'binary': {
        const prec = precedenceMap[node.operator] || 0;
        const sym = opSymbolMap[node.operator] || node.operator;
        const leftStr = this.stringify(node.left, prec);
        const rightStr = this.stringify(node.right, prec);

        const expr = `${leftStr} ${sym} ${rightStr}`;
        if (prec < parentPrecedence) {
          return `(${expr})`;
        }
        return expr;
      }
    }
  }

  public static extractVariables(node: ASTNode): string[] {
    const vars = new Set<string>();

    function traverse(n: ASTNode) {
      if (n.type === 'variable') {
        vars.add(n.name);
      } else if (n.type === 'unary') {
        traverse(n.operand);
      } else if (n.type === 'binary') {
        traverse(n.left);
        traverse(n.right);
      }
    }

    traverse(node);
    const order = ['P', 'Q', 'R', 'S'];
    return order.filter(v => vars.has(v)).concat(Array.from(vars).filter(v => !order.includes(v)));
  }

  public static extractSubExpressions(node: ASTNode): { node: ASTNode; repr: string; depth: number }[] {
    const list: { node: ASTNode; repr: string; depth: number }[] = [];
    const seen = new Set<string>();

    function getDepth(n: ASTNode): number {
      if (n.type === 'variable' || n.type === 'constant') return 1;
      if (n.type === 'unary') return 1 + getDepth(n.operand);
      return 1 + Math.max(getDepth(n.left), getDepth(n.right));
    }

    function traverse(n: ASTNode) {
      if (n.type === 'unary' || n.type === 'binary') {
        const repr = Evaluator.stringify(n);
        if (!seen.has(repr)) {
          seen.add(repr);
          list.push({ node: n, repr, depth: getDepth(n) });
        }
        if (n.type === 'unary') {
          traverse(n.operand);
        } else {
          traverse(n.left);
          traverse(n.right);
        }
      }
    }

    traverse(node);
    list.sort((a, b) => a.depth - b.depth);
    return list;
  }
}
