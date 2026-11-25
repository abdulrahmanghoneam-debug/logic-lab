export type TokenType =
  | 'VAR'
  | 'CONST'
  | 'NOT'
  | 'AND'
  | 'OR'
  | 'XOR'
  | 'NAND'
  | 'NOR'
  | 'IMPLIES'
  | 'IFF'
  | 'LPAREN'
  | 'RPAREN'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

export type ASTNode =
  | VariableNode
  | ConstantNode
  | UnaryOpNode
  | BinaryOpNode;

export interface VariableNode {
  type: 'variable';
  name: 'P' | 'Q' | 'R' | 'S';
}

export interface ConstantNode {
  type: 'constant';
  value: boolean;
}

export interface UnaryOpNode {
  type: 'unary';
  operator: 'NOT';
  operand: ASTNode;
}

export interface BinaryOpNode {
  type: 'binary';
  operator: 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'IMPLIES' | 'IFF';
  left: ASTNode;
  right: ASTNode;
}

export type VariableValues = Record<string, boolean>;

export interface TruthTableRow {
  index: number;
  values: VariableValues;
  intermediateValues: Record<string, boolean>;
  result: boolean;
}

export type ClassificationType = 'Tautology' | 'Contradiction' | 'Contingency';

export interface TruthTableResult {
  expression: string;
  normalizedExpression: string;
  variables: string[];
  subExpressions: string[];
  rows: TruthTableRow[];
  classification: ClassificationType;
  trueCount: number;
  falseCount: number;
  totalRows: number;
}

export interface CanonicalForms {
  variables: string[];
  minterms: number[];
  maxterms: number[];
  sopExpression: string;
  posExpression: string;
  sopNumeric: string;
  posNumeric: string;
}

export interface SimplificationStep {
  step: number;
  expression: string;
  latex?: string;
  law: string;
  explanation: string;
}

export interface EquivalenceResult {
  expr1: string;
  expr2: string;
  isEquivalent: boolean;
  variables: string[];
  comparisonTable: {
    index: number;
    values: VariableValues;
    val1: boolean;
    val2: boolean;
    matches: boolean;
  }[];
  explanation: string;
}
