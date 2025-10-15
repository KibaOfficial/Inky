// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Runtime - State Management for the Inky Engine
 *
 * The Runtime manages:
 * - Current Position (Label + Node Index)
 * - Variables (affection, playerName, etc.)
 * - Characters (character objects with attributes)
 * - History (for Rollback/Save)
 */
export class Runtime {
  // ============================================
  // State Properties
  // ============================================

  /**
   * Current label (e.g. "Start", "NicePath")
   */
  public currentLabel: string = 'Start';

  /**
   * Index of the current node in the label (0-based)
   */
  public currentNodeIndex: number = 0;

  /**
   * Variable Storage (Key-Value Map)
   * Example: { "affection": 10, "playerName": "Alex", "hasKey": true }
   */
  public variables: Map<string, any> = new Map();

  /**
   * Character Registry (Key = Character Name, Value = Attributes Object)
   * Example: { "MC": { name: "Player", sprite: "Player.png", color: "#4A90E2" } }
   */
  public characters: Map<string, Record<string, string>> = new Map();

  /**
   * History for Rollback (optional, will be implemented later)
   */
  public history: Array<RuntimeState> = [];

  // ============================================
  // Constructor
  // ============================================

  constructor(startLabel: string = 'Start') {
    this.currentLabel = startLabel;
    this.currentNodeIndex = 0;
  }

  // ============================================
  // Variable Management (STEP 1)
  // ============================================

  /**
   * Sets a variable
   * @param name Variable name (e.g. "affection")
   * @param value Value (any type)
   */
  public setVariable(name: string, value: any): void {
    this.variables.set(name, value);
    console.log(`[Runtime] Set variable: ${name} = ${value}`);
  }

  /**
   * Gets a variable
   * @param name Variable name
   * @returns Value or undefined
   */
  public getVariable(name: string): any {
    return this.variables.get(name);
  }

  /**
   * Checks if a variable exists
   * @param name Variable name
   * @returns true if exists
   */
  public hasVariable(name: string): boolean {
    return this.variables.has(name);
  }

  /**
   * Registers a character with attributes
   * @param name Character name (e.g., "MC", "Sayori")
   * @param attributes Attributes object (e.g., { name: "Player", sprite: "Player.png", color: "#4A90E2" })
   */
  public registerCharacter(name: string, attributes: Record<string, string>): void {
    this.characters.set(name, attributes);
    console.log(`[Runtime] Registered character: ${name}`, attributes);
  }

  /**
   * Gets a character's attributes
   * @param name Character name
   * @returns Attributes object or undefined
   */
  public getCharacter(name: string): Record<string, string> | undefined {
    return this.characters.get(name);
  }

  /**
   * Gets a character attribute (dot notation support)
   * @param charName Character name (e.g., "MC")
   * @param attrName Attribute name (e.g., "name", "sprite", "color")
   * @returns Attribute value or undefined
   */
  public getCharacterAttribute(charName: string, attrName: string): string | undefined {
    const char = this.characters.get(charName);
    return char ? char[attrName] : undefined;
  }

  // ============================================
  // Expression Evaluator (STEP 2)
  // ============================================

  /**
   * Evaluates a variable expression
   * Examples:
   * - "affection = 0"      → sets affection to 0
   * - "affection += 10"    → increases affection by 10
   * - "playerName = 'Alex'" → sets string
   *
   * @param expression The expression as a string
   */
  public evaluateExpression(expression: string): void {
    expression = expression.trim();

    // Patterns for different operators (order matters!)
    const assignPattern = /^(\w+)\s*=\s*(.+)$/;           // affection = 0
    const addAssignPattern = /^(\w+)\s*\+=\s*(.+)$/;      // affection += 10
    const subAssignPattern = /^(\w+)\s*-=\s*(.+)$/;      // affection -= 5
    const mulAssignPattern = /^(\w+)\s*\*=\s*(.+)$/;     // affection *= 2
    const divAssignPattern = /^(\w+)\s*\/=\s*(.+)$/;     // affection /= 2

    // Check compound operators FIRST (+=, -=, etc.)
    let match = expression.match(addAssignPattern);
    if (match) {
      const varName = match[1];
      const rightValue = this.parseValue(match[2]);
      const currentValue = this.getVariable(varName) || 0;
      this.setVariable(varName, currentValue + rightValue);
      return;
    }

    match = expression.match(subAssignPattern);
    if (match) {
      const varName = match[1];
      const rightValue = this.parseValue(match[2]);
      const currentValue = this.getVariable(varName) || 0;
      this.setVariable(varName, currentValue - rightValue);
      return;
    }

    match = expression.match(mulAssignPattern);
    if (match) {
      const varName = match[1];
      const rightValue = this.parseValue(match[2]);
      const currentValue = this.getVariable(varName) || 0;
      this.setVariable(varName, currentValue * rightValue);
      return;
    }

    match = expression.match(divAssignPattern);
    if (match) {
      const varName = match[1];
      const rightValue = this.parseValue(match[2]);
      const currentValue = this.getVariable(varName) || 0;
      this.setVariable(varName, currentValue / rightValue);
      return;
    }

    // Simple Assignment (=) LAST
    match = expression.match(assignPattern);
    if (match) {
      const varName = match[1];
      const rightValue = this.parseValue(match[2]);
      this.setVariable(varName, rightValue);
      return;
    }

    // If nothing matched
    console.warn(`[Runtime] Unknown expression: ${expression}`);
  }

  /**
   * Parses a value (String, Number, Boolean, or Variable)
   * Supports dot notation for character attributes (e.g., MC.name)
   * @param valueStr The value as a string
   * @returns The parsed value
   */
  private parseValue(valueStr: string): any {
    valueStr = valueStr.trim();

    // String (with quotes)
    if (valueStr.startsWith('"') || valueStr.startsWith("'")) {
      return valueStr.slice(1, -1); // Remove quotes
    }

    // Boolean
    if (valueStr === 'true') return true;
    if (valueStr === 'false') return false;

    // Number
    if (!isNaN(Number(valueStr))) {
      return Number(valueStr);
    }

    // Character attribute (dot notation, e.g., MC.name)
    if (valueStr.includes('.')) {
      const [charName, attrName] = valueStr.split('.');
      const attrValue = this.getCharacterAttribute(charName, attrName);
      if (attrValue !== undefined) {
        return attrValue;
      }
    }

    // Variable (lookup)
    if (this.hasVariable(valueStr)) {
      return this.getVariable(valueStr);
    }

    // Fallback: Return as string
    return valueStr;
  }

  // ============================================
  // Condition Evaluator (STEP 3)
  // ============================================

  /**
   * Evaluates a condition (returns true/false)
   * Examples:
   * - "affection > 10"     → true if affection > 10
   * - "hasKey == true"     → true if hasKey is true
   * - "affection > 10 && hasKey == true" → combined
   *
   * @param condition The condition as a string
   * @returns true or false
   */
  public evaluateCondition(condition: string): boolean {
    condition = condition.trim();

    // Logical Operators: && (AND), || (OR)
    // Split by && or ||
    if (condition.includes('&&')) {
      const parts = condition.split('&&').map(p => p.trim());
      return parts.every(part => this.evaluateCondition(part));
    }

    if (condition.includes('||')) {
      const parts = condition.split('||').map(p => p.trim());
      return parts.some(part => this.evaluateCondition(part));
    }

    // Comparison Pattern (supports dot notation in left side)
  // Important: Longer operators first, so >= is not recognized as >
  const comparePattern = /^([\w.]+)\s*(>=|<=|==|!=|>|<)\s*(.+)$/;
    const match = condition.match(comparePattern);

    if (match) {
      const leftName = match[1];
      const operator = match[2];
      const rightValue = this.parseValue(match[3]);
      
      // Left side: check for dot notation
      let leftValue: any;
      if (leftName.includes('.')) {
        const [charName, attrName] = leftName.split('.');
        leftValue = this.getCharacterAttribute(charName, attrName);
      } else {
        leftValue = this.getVariable(leftName);
      }

      console.log('COND', leftName, operator, rightValue, '->', leftValue, typeof leftValue, rightValue, typeof rightValue);

      // Compare based on operator
      switch (operator) {
        case '==': return leftValue == rightValue;
        case '!=': return leftValue != rightValue;
        case '>': return leftValue > rightValue;
        case '<': return leftValue < rightValue;
        case '>=': return leftValue >= rightValue;
        case '<=': return leftValue <= rightValue;
        default: return false;
      }
    }

    console.warn(`[Runtime] Unknown condition: ${condition}`);
    return false;
  }

  // ============================================
  // Navigation (STEP 4)
  // ============================================

  /**
   * Jumps to another label
   * @param label Label name (e.g. "NicePath")
   */
  public jump(label: string): void {
    this.currentLabel = label;
    this.currentNodeIndex = 0;
    console.log(`[Runtime] Jumped to label: ${label}`);
  }

  /**
   * Goes to the next node in the current label
   */
  public nextNode(): void {
    this.currentNodeIndex++;
    console.log(`[Runtime] Next node: ${this.currentNodeIndex}`);
  }

  // ============================================
  // Utility
  // ============================================

  /**
   * Resets the runtime (new game)
   */
  public reset(): void {
    this.currentLabel = 'Start';
    this.currentNodeIndex = 0;
    this.variables.clear();
    this.history = [];
    console.log('[Runtime] Reset complete');
  }

  /**
   * Returns the current state as a string (for debugging)
   */
  public getState(): string {
    return JSON.stringify({
      label: this.currentLabel,
      node: this.currentNodeIndex,
      variables: Object.fromEntries(this.variables)
    }, null, 2);
  }
}

// ============================================
// Types
// ============================================

/**
 * Runtime State Snapshot (for History/Save)
 */
export interface RuntimeState {
  label: string;
  nodeIndex: number;
  variables: Record<string, any>;
}
