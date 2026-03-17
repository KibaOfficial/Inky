// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Runtime } from "./Runtime";
import { ScriptAST, Node } from "./types";

/**
 * StepInterpreter - Executes InkyScript node-by-node.
 *
 * The Runtime is the single source of truth for position and state.
 * The StepInterpreter is a pure executor/cursor — it reads where
 * the Runtime says it is and advances it accordingly.
 */
export class StepInterpreter {
  private runtime: Runtime;
  private ast: ScriptAST;
  private isRunning: boolean = false;

  constructor(runtime: Runtime, ast: ScriptAST) {
    this.runtime = runtime;
    this.ast = ast;
  }

  public start(): void {
    this.isRunning = true;
    this.runtime.jump('Start');

    for (const [charName, charNode] of Object.entries(this.ast.characters)) {
      this.runtime.registerCharacter(charName, charNode.attributes);
    }

    console.log('[StepInterpreter] Started at label: Start');
  }

  /**
   * Advances the story and returns the next node that requires UI interaction
   * (Dialogue, Choice, or Command), or null if the story has ended.
   *
   * Internally loops over silent nodes (Variable, Jump, Condition)
   * until something UI-relevant is reached.
   */
  public step(): Node | null {
    if (!this.isRunning) {
      console.warn('[StepInterpreter] Not running. Call start() first.');
      return null;
    }

    while (true) {
      const node = this.currentNode();

      if (!node) {
        console.log('[StepInterpreter] Story ended.');
        this.isRunning = false;
        return null;
      }

      console.log(`[StepInterpreter] Executing node type: ${node.type}`);

      switch (node.type) {
        case 'Dialogue':
          this.advanceCursor();
          return node;

        case 'Choice':
          // Don't advance — wait for selectChoice()
          return node;

        case 'Command':
          this.advanceCursor();
          return node;

        case 'Variable':
          this.runtime.evaluateExpression(node.expression);
          this.advanceCursor();
          continue;

        case 'Jump':
          this.runtime.jump(node.target);
          continue;

        case 'Condition': {
          const met = this.runtime.evaluateCondition(node.condition);
          console.log(`[StepInterpreter] Condition: ${node.condition} = ${met}`);
          this.advanceCursor(); // Always move past the condition node itself

          if (met && node.thenNodes.length > 0) {
            this.runtime.pushStack(node.thenNodes);
          } else if (!met && node.elseNodes.length > 0) {
            this.runtime.pushStack(node.elseNodes);
          }
          continue;
        }

        default:
          console.warn(`[StepInterpreter] Unknown node type: ${(node as any).type}`);
          this.advanceCursor();
          continue;
      }
    }
  }

  public selectChoice(targetLabel: string): void {
    // Choice node sits at currentNodeIndex — advance past it, then jump
    this.advanceCursor();
    this.runtime.jump(targetLabel);
  }

  public isStoryRunning(): boolean {
    return this.isRunning;
  }

  public stop(): void {
    this.isRunning = false;
  }

  public reset(): void {
    this.isRunning = false;
    this.runtime.reset();
  }

  // ============================================
  // Private helpers
  // ============================================

  /**
   * Returns the current node based on Runtime state.
   * Prefers the top of the execution stack (nested nodes in conditions),
   * falls back to the current label position.
   */
  private currentNode(): Node | null {
    // Drain exhausted stack frames
    while (this.runtime.executionStack.length > 0) {
      const frame = this.runtime.peekStack()!;
      if (frame.index < frame.nodes.length) {
        return frame.nodes[frame.index];
      }
      this.runtime.popStack();
    }

    // Normal label execution
    const label = this.ast.labels[this.runtime.currentLabel];
    if (!label) {
      console.error(`[StepInterpreter] Label not found: ${this.runtime.currentLabel}`);
      return null;
    }

    if (this.runtime.currentNodeIndex >= label.nodes.length) {
      return null;
    }

    return label.nodes[this.runtime.currentNodeIndex];
  }

  /**
   * Advances the cursor — stack frame first, then label index.
   */
  private advanceCursor(): void {
    const frame = this.runtime.peekStack();
    if (frame) {
      frame.index++;
    } else {
      this.runtime.advanceNode();
    }
  }
}
