// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Node } from "./types";

/**
 * Runtime - Single Source of Truth for all story state.
 *
 * Holds:
 * - Current position (label + node index)
 * - Execution stack (for nested condition blocks)
 * - Variables
 * - Characters
 * - History (for future Save/Load/Rollback)
 */
export class Runtime {
  // ============================================
  // Position State
  // ============================================

  public currentLabel: string = 'Start';
  public currentNodeIndex: number = 0;

  /**
   * Stack for nested node execution (e.g. condition thenNodes).
   * Each entry is a list of nodes + current index within that list.
   */
  public executionStack: Array<{ nodes: Node[]; index: number }> = [];

  // ============================================
  // Story State
  // ============================================

  public variables: Map<string, any> = new Map();
  public characters: Map<string, Record<string, string>> = new Map();
  public history: Array<RuntimeState> = [];

  // ============================================
  // Constructor
  // ============================================

  constructor(startLabel: string = 'Start') {
    this.currentLabel = startLabel;
  }

  // ============================================
  // Navigation
  // ============================================

  public jump(label: string): void {
    this.currentLabel = label;
    this.currentNodeIndex = 0;
    this.executionStack = [];
    console.log(`[Runtime] Jumped to label: ${label}`);
  }

  public advanceNode(): void {
    this.currentNodeIndex++;
  }

  public clearStack(): void {
    this.executionStack = [];
  }

  public pushStack(nodes: Node[]): void {
    this.executionStack.push({ nodes, index: 0 });
  }

  public peekStack(): { nodes: Node[]; index: number } | null {
    return this.executionStack.length > 0
      ? this.executionStack[this.executionStack.length - 1]
      : null;
  }

  public popStack(): void {
    this.executionStack.pop();
  }

  // ============================================
  // Variables
  // ============================================

  public setVariable(name: string, value: any): void {
    this.variables.set(name, value);
    console.log(`[Runtime] Set variable: ${name} = ${value}`);
  }

  public getVariable(name: string): any {
    return this.variables.get(name);
  }

  public hasVariable(name: string): boolean {
    return this.variables.has(name);
  }

  // ============================================
  // Characters
  // ============================================

  public registerCharacter(name: string, attributes: Record<string, string>): void {
    this.characters.set(name, attributes);
    console.log(`[Runtime] Registered character: ${name}`, attributes);
  }

  public getCharacter(name: string): Record<string, string> | undefined {
    return this.characters.get(name);
  }

  public getCharacterAttribute(charName: string, attrName: string): string | undefined {
    const char = this.characters.get(charName);
    return char ? char[attrName] : undefined;
  }

  // ============================================
  // Expression Evaluator
  // ============================================

  public evaluateExpression(expression: string): void {
    expression = expression.trim();

    const addAssignPattern = /^(\w+)\s*\+=\s*(.+)$/;
    const subAssignPattern = /^(\w+)\s*-=\s*(.+)$/;
    const mulAssignPattern = /^(\w+)\s*\*=\s*(.+)$/;
    const divAssignPattern = /^(\w+)\s*\/=\s*(.+)$/;
    const assignPattern    = /^(\w+)\s*=\s*(.+)$/;

    let match = expression.match(addAssignPattern);
    if (match) {
      this.setVariable(match[1], (this.getVariable(match[1]) || 0) + this.parseValue(match[2]));
      return;
    }
    match = expression.match(subAssignPattern);
    if (match) {
      this.setVariable(match[1], (this.getVariable(match[1]) || 0) - this.parseValue(match[2]));
      return;
    }
    match = expression.match(mulAssignPattern);
    if (match) {
      this.setVariable(match[1], (this.getVariable(match[1]) || 0) * this.parseValue(match[2]));
      return;
    }
    match = expression.match(divAssignPattern);
    if (match) {
      this.setVariable(match[1], (this.getVariable(match[1]) || 0) / this.parseValue(match[2]));
      return;
    }
    match = expression.match(assignPattern);
    if (match) {
      this.setVariable(match[1], this.parseValue(match[2]));
      return;
    }

    console.warn(`[Runtime] Unknown expression: ${expression}`);
  }

  private parseValue(valueStr: string): any {
    valueStr = valueStr.trim();

    if (valueStr.startsWith('"') || valueStr.startsWith("'")) {
      return valueStr.slice(1, -1);
    }
    if (valueStr === 'true') return true;
    if (valueStr === 'false') return false;
    if (!isNaN(Number(valueStr))) return Number(valueStr);

    if (valueStr.includes('.')) {
      const [charName, attrName] = valueStr.split('.');
      const attrValue = this.getCharacterAttribute(charName, attrName);
      if (attrValue !== undefined) return attrValue;
    }

    if (this.hasVariable(valueStr)) return this.getVariable(valueStr);

    return valueStr;
  }

  // ============================================
  // Condition Evaluator
  // ============================================

  public evaluateCondition(condition: string): boolean {
    return this.parseOr(condition.trim());
  }

  private parseOr(expr: string): boolean {
    const parts = this.splitLogical(expr, '||');
    return parts.some(p => this.parseAnd(p.trim()));
  }

  private parseAnd(expr: string): boolean {
    const parts = this.splitLogical(expr, '&&');
    return parts.every(p => this.parseComparison(p.trim()));
  }

  /**
   * Splits an expression by a logical operator (|| or &&),
   * respecting parentheses so nested expressions aren't broken.
   */
  private splitLogical(expr: string, op: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';

    for (let i = 0; i < expr.length; i++) {
      if (expr[i] === '(') { depth++; current += expr[i]; continue; }
      if (expr[i] === ')') { depth--; current += expr[i]; continue; }

      if (depth === 0 && expr.startsWith(op, i)) {
        parts.push(current);
        current = '';
        i += op.length - 1;
        continue;
      }
      current += expr[i];
    }
    parts.push(current);
    return parts;
  }

  private parseComparison(expr: string): boolean {
    // Strip outer parens
    if (expr.startsWith('(') && expr.endsWith(')')) {
      return this.evaluateCondition(expr.slice(1, -1));
    }

    const comparePattern = /^([\w.]+)\s*(>=|<=|==|!=|>|<)\s*(.+)$/;
    const match = expr.match(comparePattern);

    if (match) {
      const leftName  = match[1];
      const operator  = match[2];
      const rightVal  = this.parseValue(match[3]);

      let leftVal: any;
      if (leftName.includes('.')) {
        const [charName, attrName] = leftName.split('.');
        leftVal = this.getCharacterAttribute(charName, attrName);
      } else {
        leftVal = this.getVariable(leftName);
      }

      switch (operator) {
        case '==': return leftVal == rightVal;
        case '!=': return leftVal != rightVal;
        case '>':  return leftVal > rightVal;
        case '<':  return leftVal < rightVal;
        case '>=': return leftVal >= rightVal;
        case '<=': return leftVal <= rightVal;
      }
    }

    console.warn(`[Runtime] Unknown condition: ${expr}`);
    return false;
  }

  // ============================================
  // Utility
  // ============================================

  public reset(): void {
    this.currentLabel = 'Start';
    this.currentNodeIndex = 0;
    this.executionStack = [];
    this.variables.clear();
    this.history = [];
    console.log('[Runtime] Reset complete');
  }

  public getState(): string {
    return JSON.stringify({
      label: this.currentLabel,
      node: this.currentNodeIndex,
      variables: Object.fromEntries(this.variables),
    }, null, 2);
  }
}

// ============================================
// Types
// ============================================

export interface RuntimeState {
  label: string;
  nodeIndex: number;
  variables: Record<string, any>;
}
