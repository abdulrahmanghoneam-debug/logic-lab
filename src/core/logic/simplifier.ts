import { ASTNode, SimplificationStep } from './types';
import { Parser } from './parser';
import { Evaluator } from './evaluator';

export class BooleanSimplifier {
  /**
   * Generates step-by-step simplification traces with formal mathematical Discrete Structures laws
   */
  public static simplifyWithSteps(input: string | ASTNode): SimplificationStep[] {
    let ast: ASTNode;
    if (typeof input === 'string') {
      ast = new Parser(input).parse();
    } else {
      ast = input;
    }

    const steps: SimplificationStep[] = [];
    let stepCount = 1;

    let currentExpr = Evaluator.stringify(ast);
    steps.push({
      step: stepCount++,
      expression: currentExpr,
      law: 'Original Expression',
      explanation: 'Initial propositional logic formula entered for analysis.'
    });

    let modified = true;
    let iteration = 0;
    const maxIterations = 20;

    while (modified && iteration < maxIterations) {
      iteration++;
      modified = false;

      // 1. Expand NAND: A ⊼ B => ¬(A ∧ B)
      const resNand = this.replaceNand(ast);
      if (resNand.changed) {
        ast = resNand.node;
        currentExpr = Evaluator.stringify(ast);
        steps.push({
          step: stepCount++,
          expression: currentExpr,
          law: 'NAND Definition Law',
          explanation: 'Replaced universal NAND operator: (A ⊼ B) ≡ ¬(A ∧ B).'
        });
        modified = true;
        continue;
      }

      // 2. Expand NOR: A ⊽ B => ¬(A ∨ B)
      const resNor = this.replaceNor(ast);
      if (resNor.changed) {
        ast = resNor.node;
        currentExpr = Evaluator.stringify(ast);
        steps.push({
          step: stepCount++,
          expression: currentExpr,
          law: 'NOR Definition Law',
          explanation: 'Replaced universal NOR operator: (A ⊽ B) ≡ ¬(A ∨ B).'
        });
        modified = true;
        continue;
      }

      // 3. Eliminate Biconditionals: P <-> Q => (P -> Q) ∧ (Q -> P)
      const resBicon = this.replaceBiconditional(ast);
      if (resBicon.changed) {
        ast = resBicon.node;
        currentExpr = Evaluator.stringify(ast);
        steps.push({
          step: stepCount++,
          expression: currentExpr,
          law: 'Biconditional Equivalence',
          explanation: 'Replaced (A ↔ B) with ((A → B) ∧ (B → A)).'
        });
        modified = true;
        continue;
      }

      // 4. Eliminate Implications: P -> Q => ¬P ∨ Q
      const resImpl = this.replaceImplication(ast);
      if (resImpl.changed) {
        ast = resImpl.node;
        currentExpr = Evaluator.stringify(ast);
        steps.push({
          step: stepCount++,
          expression: currentExpr,
          law: 'Implication Law (Conditional)',
          explanation: 'Transformed implication (A → B) into (¬A ∨ B).'
        });
        modified = true;
        continue;
      }

      // 5. Eliminate XOR: P ⊕ Q => (P ∧ ¬Q) ∨ (¬P ∧ Q)
      const resXor = this.replaceXor(ast);
      if (resXor.changed) {
        ast = resXor.node;
        currentExpr = Evaluator.stringify(ast);
        steps.push({
          step: stepCount++,
          expression: currentExpr,
          law: 'Exclusive OR Equivalence',
          explanation: 'Expanded (A ⊕ B) into ((A ∧ ¬B) ∨ (¬A ∧ B)).'
        });
        modified = true;
        continue;
      }

      // 6. Double Negation: ¬(¬P) => P
      const resDoubleNeg = this.applyDoubleNegation(ast);
      if (resDoubleNeg.changed) {
        ast = resDoubleNeg.node;
        currentExpr = Evaluator.stringify(ast);
        steps.push({
          step: stepCount++,
          expression: currentExpr,
          law: 'Double Negation Law',
          explanation: 'Simplified double negation ¬(¬A) into A.'
        });
        modified = true;
        continue;
      }

      // 7. De Morgan's Laws: ¬(P ∧ Q) => ¬P ∨ ¬Q ; ¬(P ∨ Q) => ¬P ∧ ¬Q
      const resDeMorgan = this.applyDeMorgan(ast);
      if (resDeMorgan.changed) {
        ast = resDeMorgan.node;
        currentExpr = Evaluator.stringify(ast);
        steps.push({
          step: stepCount++,
          expression: currentExpr,
          law: "De Morgan's Laws",
          explanation: 'Distributed negation across conjunction/disjunction: ¬(A ∧ B) ≡ ¬A ∨ ¬B.'
        });
        modified = true;
        continue;
      }

      // 8. Absorption Laws: A ∨ (A ∧ B) => A; A ∧ (A ∨ B) => A
      const resAbsorption = this.applyAbsorption(ast);
      if (resAbsorption.changed) {
        ast = resAbsorption.node;
        currentExpr = Evaluator.stringify(ast);
        steps.push({
          step: stepCount++,
          expression: currentExpr,
          law: 'Absorption Law',
          explanation: 'Reduced redundant compound subterm: A ∨ (A ∧ B) ≡ A or A ∧ (A ∨ B) ≡ A.'
        });
        modified = true;
        continue;
      }

      // 9. Identity & Domination Laws (with constants)
      const resConstants = this.simplifyConstants(ast);
      if (resConstants.changed) {
        ast = resConstants.node;
        currentExpr = Evaluator.stringify(ast);
        steps.push({
          step: stepCount++,
          expression: currentExpr,
          law: resConstants.law || 'Identity / Domination Law',
          explanation: resConstants.explanation || 'Evaluated constant Boolean truth values.'
        });
        modified = true;
        continue;
      }

      // 10. Idempotent Laws: P ∧ P => P ; P ∨ P => P
      const resIdempotent = this.applyIdempotent(ast);
      if (resIdempotent.changed) {
        ast = resIdempotent.node;
        currentExpr = Evaluator.stringify(ast);
        steps.push({
          step: stepCount++,
          expression: currentExpr,
          law: 'Idempotent Law',
          explanation: 'Combined identical operands: (A ∧ A ≡ A) or (A ∨ A ≡ A).'
        });
        modified = true;
        continue;
      }

      // 11. Complement Laws: P ∧ ¬P => F ; P ∨ ¬P => T
      const resComplement = this.applyComplement(ast);
      if (resComplement.changed) {
        ast = resComplement.node;
        currentExpr = Evaluator.stringify(ast);
        steps.push({
          step: stepCount++,
          expression: currentExpr,
          law: 'Complement Law',
          explanation: 'Applied inverse truth properties: (A ∧ ¬A ≡ F) or (A ∨ ¬A ≡ T).'
        });
        modified = true;
        continue;
      }
    }

    if (steps.length === 1) {
      steps.push({
        step: 2,
        expression: currentExpr,
        law: 'Irreducible Form',
        explanation: 'The expression is already in its minimal canonical form.'
      });
    }

    return steps;
  }

  // --- Transform Helpers ---

  private static replaceNand(node: ASTNode): { node: ASTNode; changed: boolean } {
    if (node.type === 'binary') {
      if (node.operator === 'NAND') {
        return {
          node: {
            type: 'unary',
            operator: 'NOT',
            operand: { type: 'binary', operator: 'AND', left: node.left, right: node.right }
          },
          changed: true
        };
      }
      const l = this.replaceNand(node.left);
      if (l.changed) return { node: { ...node, left: l.node }, changed: true };
      const r = this.replaceNand(node.right);
      if (r.changed) return { node: { ...node, right: r.node }, changed: true };
    } else if (node.type === 'unary') {
      const child = this.replaceNand(node.operand);
      if (child.changed) return { node: { ...node, operand: child.node }, changed: true };
    }
    return { node, changed: false };
  }

  private static replaceNor(node: ASTNode): { node: ASTNode; changed: boolean } {
    if (node.type === 'binary') {
      if (node.operator === 'NOR') {
        return {
          node: {
            type: 'unary',
            operator: 'NOT',
            operand: { type: 'binary', operator: 'OR', left: node.left, right: node.right }
          },
          changed: true
        };
      }
      const l = this.replaceNor(node.left);
      if (l.changed) return { node: { ...node, left: l.node }, changed: true };
      const r = this.replaceNor(node.right);
      if (r.changed) return { node: { ...node, right: r.node }, changed: true };
    } else if (node.type === 'unary') {
      const child = this.replaceNor(node.operand);
      if (child.changed) return { node: { ...node, operand: child.node }, changed: true };
    }
    return { node, changed: false };
  }

  private static replaceBiconditional(node: ASTNode): { node: ASTNode; changed: boolean } {
    if (node.type === 'binary') {
      if (node.operator === 'IFF') {
        const leftNode = node.left;
        const rightNode = node.right;
        const imp1: ASTNode = { type: 'binary', operator: 'IMPLIES', left: leftNode, right: rightNode };
        const imp2: ASTNode = { type: 'binary', operator: 'IMPLIES', left: rightNode, right: leftNode };
        return {
          node: { type: 'binary', operator: 'AND', left: imp1, right: imp2 },
          changed: true
        };
      }
      const l = this.replaceBiconditional(node.left);
      if (l.changed) return { node: { ...node, left: l.node }, changed: true };
      const r = this.replaceBiconditional(node.right);
      if (r.changed) return { node: { ...node, right: r.node }, changed: true };
    } else if (node.type === 'unary') {
      const child = this.replaceBiconditional(node.operand);
      if (child.changed) return { node: { ...node, operand: child.node }, changed: true };
    }
    return { node, changed: false };
  }

  private static replaceImplication(node: ASTNode): { node: ASTNode; changed: boolean } {
    if (node.type === 'binary') {
      if (node.operator === 'IMPLIES') {
        return {
          node: {
            type: 'binary',
            operator: 'OR',
            left: { type: 'unary', operator: 'NOT', operand: node.left },
            right: node.right
          },
          changed: true
        };
      }
      const l = this.replaceImplication(node.left);
      if (l.changed) return { node: { ...node, left: l.node }, changed: true };
      const r = this.replaceImplication(node.right);
      if (r.changed) return { node: { ...node, right: r.node }, changed: true };
    } else if (node.type === 'unary') {
      const child = this.replaceImplication(node.operand);
      if (child.changed) return { node: { ...node, operand: child.node }, changed: true };
    }
    return { node, changed: false };
  }

  private static replaceXor(node: ASTNode): { node: ASTNode; changed: boolean } {
    if (node.type === 'binary') {
      if (node.operator === 'XOR') {
        return {
          node: {
            type: 'binary',
            operator: 'OR',
            left: {
              type: 'binary',
              operator: 'AND',
              left: node.left,
              right: { type: 'unary', operator: 'NOT', operand: node.right }
            },
            right: {
              type: 'binary',
              operator: 'AND',
              left: { type: 'unary', operator: 'NOT', operand: node.left },
              right: node.right
            }
          },
          changed: true
        };
      }
      const l = this.replaceXor(node.left);
      if (l.changed) return { node: { ...node, left: l.node }, changed: true };
      const r = this.replaceXor(node.right);
      if (r.changed) return { node: { ...node, right: r.node }, changed: true };
    } else if (node.type === 'unary') {
      const child = this.replaceXor(node.operand);
      if (child.changed) return { node: { ...node, operand: child.node }, changed: true };
    }
    return { node, changed: false };
  }

  private static applyDoubleNegation(node: ASTNode): { node: ASTNode; changed: boolean } {
    if (node.type === 'unary' && node.operator === 'NOT') {
      if (node.operand.type === 'unary' && node.operand.operator === 'NOT') {
        return { node: node.operand.operand, changed: true };
      }
      const child = this.applyDoubleNegation(node.operand);
      if (child.changed) return { node: { ...node, operand: child.node }, changed: true };
    } else if (node.type === 'binary') {
      const l = this.applyDoubleNegation(node.left);
      if (l.changed) return { node: { ...node, left: l.node }, changed: true };
      const r = this.applyDoubleNegation(node.right);
      if (r.changed) return { node: { ...node, right: r.node }, changed: true };
    }
    return { node, changed: false };
  }

  private static applyDeMorgan(node: ASTNode): { node: ASTNode; changed: boolean } {
    if (node.type === 'unary' && node.operator === 'NOT') {
      if (node.operand.type === 'binary') {
        const bin = node.operand;
        if (bin.operator === 'AND') {
          return {
            node: {
              type: 'binary',
              operator: 'OR',
              left: { type: 'unary', operator: 'NOT', operand: bin.left },
              right: { type: 'unary', operator: 'NOT', operand: bin.right }
            },
            changed: true
          };
        } else if (bin.operator === 'OR') {
          return {
            node: {
              type: 'binary',
              operator: 'AND',
              left: { type: 'unary', operator: 'NOT', operand: bin.left },
              right: { type: 'unary', operator: 'NOT', operand: bin.right }
            },
            changed: true
          };
        }
      }
      const child = this.applyDeMorgan(node.operand);
      if (child.changed) return { node: { ...node, operand: child.node }, changed: true };
    } else if (node.type === 'binary') {
      const l = this.applyDeMorgan(node.left);
      if (l.changed) return { node: { ...node, left: l.node }, changed: true };
      const r = this.applyDeMorgan(node.right);
      if (r.changed) return { node: { ...node, right: r.node }, changed: true };
    }
    return { node, changed: false };
  }

  private static applyAbsorption(node: ASTNode): { node: ASTNode; changed: boolean } {
    if (node.type === 'binary') {
      const leftStr = Evaluator.stringify(node.left);
      const rightStr = Evaluator.stringify(node.right);

      // A ∨ (A ∧ B) => A
      if (node.operator === 'OR' && node.right.type === 'binary' && node.right.operator === 'AND') {
        const subLeft = Evaluator.stringify(node.right.left);
        const subRight = Evaluator.stringify(node.right.right);
        if (leftStr === subLeft || leftStr === subRight) {
          return { node: node.left, changed: true };
        }
      }
      // (A ∧ B) ∨ A => A
      if (node.operator === 'OR' && node.left.type === 'binary' && node.left.operator === 'AND') {
        const subLeft = Evaluator.stringify(node.left.left);
        const subRight = Evaluator.stringify(node.left.right);
        if (rightStr === subLeft || rightStr === subRight) {
          return { node: node.right, changed: true };
        }
      }

      // A ∧ (A ∨ B) => A
      if (node.operator === 'AND' && node.right.type === 'binary' && node.right.operator === 'OR') {
        const subLeft = Evaluator.stringify(node.right.left);
        const subRight = Evaluator.stringify(node.right.right);
        if (leftStr === subLeft || leftStr === subRight) {
          return { node: node.left, changed: true };
        }
      }
      // (A ∨ B) ∧ A => A
      if (node.operator === 'AND' && node.left.type === 'binary' && node.left.operator === 'OR') {
        const subLeft = Evaluator.stringify(node.left.left);
        const subRight = Evaluator.stringify(node.left.right);
        if (rightStr === subLeft || rightStr === subRight) {
          return { node: node.right, changed: true };
        }
      }

      const l = this.applyAbsorption(node.left);
      if (l.changed) return { node: { ...node, left: l.node }, changed: true };
      const r = this.applyAbsorption(node.right);
      if (r.changed) return { node: { ...node, right: r.node }, changed: true };
    } else if (node.type === 'unary') {
      const c = this.applyAbsorption(node.operand);
      if (c.changed) return { node: { ...node, operand: c.node }, changed: true };
    }
    return { node, changed: false };
  }

  private static simplifyConstants(node: ASTNode): { node: ASTNode; changed: boolean; law?: string; explanation?: string } {
    if (node.type === 'unary' && node.operator === 'NOT') {
      if (node.operand.type === 'constant') {
        return {
          node: { type: 'constant', value: !node.operand.value },
          changed: true,
          law: 'Negation of Constant',
          explanation: `Evaluated ¬${node.operand.value ? 'T' : 'F'} = ${!node.operand.value ? 'T' : 'F'}`
        };
      }
      const c = this.simplifyConstants(node.operand);
      if (c.changed) return { node: { ...node, operand: c.node }, changed: true, law: c.law, explanation: c.explanation };
    } else if (node.type === 'binary') {
      if (node.left.type === 'constant') {
        const val = node.left.value;
        if (node.operator === 'AND') {
          if (!val) {
            return { node: { type: 'constant', value: false }, changed: true, law: 'Domination Law', explanation: 'F ∧ A ≡ F' };
          } else {
            return { node: node.right, changed: true, law: 'Identity Law', explanation: 'T ∧ A ≡ A' };
          }
        } else if (node.operator === 'OR') {
          if (val) {
            return { node: { type: 'constant', value: true }, changed: true, law: 'Domination Law', explanation: 'T ∨ A ≡ T' };
          } else {
            return { node: node.right, changed: true, law: 'Identity Law', explanation: 'F ∨ A ≡ A' };
          }
        }
      }

      if (node.right.type === 'constant') {
        const val = node.right.value;
        if (node.operator === 'AND') {
          if (!val) {
            return { node: { type: 'constant', value: false }, changed: true, law: 'Domination Law', explanation: 'A ∧ F ≡ F' };
          } else {
            return { node: node.left, changed: true, law: 'Identity Law', explanation: 'A ∧ T ≡ A' };
          }
        } else if (node.operator === 'OR') {
          if (val) {
            return { node: { type: 'constant', value: true }, changed: true, law: 'Domination Law', explanation: 'A ∨ T ≡ T' };
          } else {
            return { node: node.left, changed: true, law: 'Identity Law', explanation: 'A ∨ F ≡ A' };
          }
        }
      }

      const l = this.simplifyConstants(node.left);
      if (l.changed) return { node: { ...node, left: l.node }, changed: true, law: l.law, explanation: l.explanation };
      const r = this.simplifyConstants(node.right);
      if (r.changed) return { node: { ...node, right: r.node }, changed: true, law: r.law, explanation: r.explanation };
    }

    return { node, changed: false };
  }

  private static applyIdempotent(node: ASTNode): { node: ASTNode; changed: boolean } {
    if (node.type === 'binary' && (node.operator === 'AND' || node.operator === 'OR')) {
      const leftStr = Evaluator.stringify(node.left);
      const rightStr = Evaluator.stringify(node.right);
      if (leftStr === rightStr) {
        return { node: node.left, changed: true };
      }
      const l = this.applyIdempotent(node.left);
      if (l.changed) return { node: { ...node, left: l.node }, changed: true };
      const r = this.applyIdempotent(node.right);
      if (r.changed) return { node: { ...node, right: r.node }, changed: true };
    } else if (node.type === 'unary') {
      const c = this.applyIdempotent(node.operand);
      if (c.changed) return { node: { ...node, operand: c.node }, changed: true };
    }
    return { node, changed: false };
  }

  private static applyComplement(node: ASTNode): { node: ASTNode; changed: boolean } {
    if (node.type === 'binary') {
      const isNegOf = (a: ASTNode, b: ASTNode): boolean => {
        return a.type === 'unary' && a.operator === 'NOT' && Evaluator.stringify(a.operand) === Evaluator.stringify(b);
      };

      if (isNegOf(node.left, node.right) || isNegOf(node.right, node.left)) {
        if (node.operator === 'AND') {
          return { node: { type: 'constant', value: false }, changed: true };
        } else if (node.operator === 'OR') {
          return { node: { type: 'constant', value: true }, changed: true };
        }
      }

      const l = this.applyComplement(node.left);
      if (l.changed) return { node: { ...node, left: l.node }, changed: true };
      const r = this.applyComplement(node.right);
      if (r.changed) return { node: { ...node, right: r.node }, changed: true };
    } else if (node.type === 'unary') {
      const c = this.applyComplement(node.operand);
      if (c.changed) return { node: { ...node, operand: c.node }, changed: true };
    }
    return { node, changed: false };
  }
}
