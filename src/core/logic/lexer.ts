import { Token, TokenType } from './types';

export class Lexer {
  private input: string;
  private pos = 0;

  constructor(input: string) {
    this.input = input;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.pos < this.input.length) {
      const char = this.input[this.pos];

      if (/\s/.test(char)) {
        this.pos++;
        continue;
      }

      const remaining = this.input.slice(this.pos);

      // Biconditional: <->, <=>, ↔, IFF, xnor
      if (/^<->|^<=>|^↔/i.test(remaining)) {
        const match = remaining.match(/^<->|^<=>|^↔/i)![0];
        tokens.push({ type: 'IFF', value: '↔', position: this.pos });
        this.pos += match.length;
        continue;
      }
      if (/^IFF\b|^XNOR\b/i.test(remaining)) {
        const match = remaining.match(/^IFF\b|^XNOR\b/i)![0];
        tokens.push({ type: 'IFF', value: '↔', position: this.pos });
        this.pos += match.length;
        continue;
      }

      // Implication: ->, =>, →, IMPLIES
      if (/^->|^=>|^→/i.test(remaining)) {
        const match = remaining.match(/^->|^=>|^→/i)![0];
        tokens.push({ type: 'IMPLIES', value: '→', position: this.pos });
        this.pos += match.length;
        continue;
      }
      if (/^IMPLIES\b/i.test(remaining)) {
        tokens.push({ type: 'IMPLIES', value: '→', position: this.pos });
        this.pos += 7;
        continue;
      }

      // NAND: ⊼, NAND
      if (char === '⊼' || /^NAND\b/i.test(remaining)) {
        const len = char === '⊼' ? 1 : 4;
        tokens.push({ type: 'NAND', value: '⊼', position: this.pos });
        this.pos += len;
        continue;
      }

      // NOR: ⊽, NOR
      if (char === '⊽' || /^NOR\b/i.test(remaining)) {
        const len = char === '⊽' ? 1 : 3;
        tokens.push({ type: 'NOR', value: '⊽', position: this.pos });
        this.pos += len;
        continue;
      }

      // XOR: ⊕, ^, XOR
      if (char === '⊕' || char === '^') {
        tokens.push({ type: 'XOR', value: '⊕', position: this.pos });
        this.pos++;
        continue;
      }
      if (/^XOR\b/i.test(remaining)) {
        tokens.push({ type: 'XOR', value: '⊕', position: this.pos });
        this.pos += 3;
        continue;
      }

      // AND: ∧, &&, &, *, AND
      if (char === '∧' || char === '&' || char === '*') {
        if (remaining.startsWith('&&')) {
          tokens.push({ type: 'AND', value: '∧', position: this.pos });
          this.pos += 2;
        } else {
          tokens.push({ type: 'AND', value: '∧', position: this.pos });
          this.pos++;
        }
        continue;
      }
      if (/^AND\b/i.test(remaining)) {
        tokens.push({ type: 'AND', value: '∧', position: this.pos });
        this.pos += 3;
        continue;
      }

      // OR: ∨, ||, |, +, OR
      if (char === '∨' || char === '|' || char === '+') {
        if (remaining.startsWith('||')) {
          tokens.push({ type: 'OR', value: '∨', position: this.pos });
          this.pos += 2;
        } else {
          tokens.push({ type: 'OR', value: '∨', position: this.pos });
          this.pos++;
        }
        continue;
      }
      if (/^OR\b/i.test(remaining)) {
        tokens.push({ type: 'OR', value: '∨', position: this.pos });
        this.pos += 2;
        continue;
      }

      // NOT: ¬, ~, !, NOT
      if (char === '¬' || char === '~' || char === '!') {
        tokens.push({ type: 'NOT', value: '¬', position: this.pos });
        this.pos++;
        continue;
      }
      if (/^NOT\b/i.test(remaining)) {
        tokens.push({ type: 'NOT', value: '¬', position: this.pos });
        this.pos += 3;
        continue;
      }

      // Parentheses
      if (char === '(' || char === '[' || char === '{') {
        tokens.push({ type: 'LPAREN', value: '(', position: this.pos });
        this.pos++;
        continue;
      }
      if (char === ')' || char === ']' || char === '}') {
        tokens.push({ type: 'RPAREN', value: ')', position: this.pos });
        this.pos++;
        continue;
      }

      // Constants
      if (/^(TRUE|T|1)\b/i.test(remaining)) {
        const match = remaining.match(/^(TRUE|T|1)\b/i)![0];
        tokens.push({ type: 'CONST', value: 'T', position: this.pos });
        this.pos += match.length;
        continue;
      }
      if (/^(FALSE|F|0)\b/i.test(remaining)) {
        const match = remaining.match(/^(FALSE|F|0)\b/i)![0];
        tokens.push({ type: 'CONST', value: 'F', position: this.pos });
        this.pos += match.length;
        continue;
      }

      // Variables: P, Q, R, S, A, B, C, D (normalized to P, Q, R, S)
      if (/^[P-S]/i.test(char)) {
        tokens.push({ type: 'VAR', value: char.toUpperCase(), position: this.pos });
        this.pos++;
        continue;
      }
      if (/^[A-D]/i.test(char)) {
        const map: Record<string, string> = { A: 'P', B: 'Q', C: 'R', D: 'S' };
        tokens.push({ type: 'VAR', value: map[char.toUpperCase()] || 'P', position: this.pos });
        this.pos++;
        continue;
      }

      throw new Error(`Unexpected character '${char}' at index ${this.pos}`);
    }

    tokens.push({ type: 'EOF', value: '', position: this.pos });
    return tokens;
  }
}
