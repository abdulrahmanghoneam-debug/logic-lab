import { Token, ASTNode, TokenType } from './types';
import { Lexer } from './lexer';

/**
 * Recursive descent parser enforcing standard Discrete Mathematics precedence:
 * 1. Parentheses: ( ... )
 * 2. Unary NOT: ¬
 * 3. Conjunction (AND): ∧, NAND: ⊼
 * 4. Exclusive OR (XOR): ⊕
 * 5. Disjunction (OR): ∨, NOR: ⊽
 * 6. Conditional (IMPLICATION): → (Right-associative)
 * 7. Biconditional (IFF): ↔
 */
export class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(inputOrTokens: string | Token[]) {
    if (typeof inputOrTokens === 'string') {
      const lexer = new Lexer(inputOrTokens);
      this.tokens = lexer.tokenize();
    } else {
      this.tokens = inputOrTokens;
    }
  }

  public parse(): ASTNode {
    if (this.peek().type === 'EOF') {
      throw new Error('Expression cannot be empty.');
    }
    const node = this.parseBiconditional();
    if (this.peek().type !== 'EOF') {
      throw new Error(`Unexpected token '${this.peek().value}' at position ${this.peek().position}`);
    }
    return node;
  }

  // Precedence 1: Biconditional (↔)
  private parseBiconditional(): ASTNode {
    let expr = this.parseImplication();

    while (this.match('IFF')) {
      const operator = 'IFF';
      const right = this.parseImplication();
      expr = { type: 'binary', operator, left: expr, right };
    }

    return expr;
  }

  // Precedence 2: Implication (→) - Right associative
  private parseImplication(): ASTNode {
    const expr = this.parseDisjunction();

    if (this.match('IMPLIES')) {
      const operator = 'IMPLIES';
      const right = this.parseImplication();
      return { type: 'binary', operator, left: expr, right };
    }

    return expr;
  }

  // Precedence 3: Disjunction (∨) & NOR (⊽)
  private parseDisjunction(): ASTNode {
    let expr = this.parseXor();

    while (this.match('OR', 'NOR')) {
      const prev = this.previous();
      const operator = prev.type === 'NOR' ? 'NOR' : 'OR';
      const right = this.parseXor();
      expr = { type: 'binary', operator, left: expr, right };
    }

    return expr;
  }

  // Precedence 4: Exclusive OR (⊕)
  private parseXor(): ASTNode {
    let expr = this.parseConjunction();

    while (this.match('XOR')) {
      const operator = 'XOR';
      const right = this.parseConjunction();
      expr = { type: 'binary', operator, left: expr, right };
    }

    return expr;
  }

  // Precedence 5: Conjunction (∧) & NAND (⊼)
  private parseConjunction(): ASTNode {
    let expr = this.parseUnary();

    while (this.match('AND', 'NAND')) {
      const prev = this.previous();
      const operator = prev.type === 'NAND' ? 'NAND' : 'AND';
      const right = this.parseUnary();
      expr = { type: 'binary', operator, left: expr, right };
    }

    return expr;
  }

  // Precedence 6: Unary NOT (¬)
  private parseUnary(): ASTNode {
    if (this.match('NOT')) {
      const operand = this.parseUnary();
      return { type: 'unary', operator: 'NOT', operand };
    }

    return this.parsePrimary();
  }

  // Precedence 7: Primary (Vars, Constants, Grouping)
  private parsePrimary(): ASTNode {
    if (this.match('CONST')) {
      const prev = this.previous();
      return { type: 'constant', value: prev.value === 'T' };
    }

    if (this.match('VAR')) {
      const prev = this.previous();
      return { type: 'variable', name: prev.value as 'P' | 'Q' | 'R' | 'S' };
    }

    if (this.match('LPAREN')) {
      const expr = this.parseBiconditional();
      if (!this.match('RPAREN')) {
        throw new Error(`Expected closing parenthesis ')' at position ${this.peek().position}`);
      }
      return expr;
    }

    throw new Error(`Expected variable or expression at token '${this.peek().value || 'EOF'}' (pos ${this.peek().position})`);
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return type === 'EOF';
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: 'EOF', value: '', position: 0 };
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}
