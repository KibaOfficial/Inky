// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Runtime } from "./Runtime";
import { ScriptAST, Node } from "./types";

/**
 * StepInterpreter - Executes InkyScript node-by-node
 * (For UI integration - waits for user input between nodes)
 */
export class StepInterpreter {
  private runtime: Runtime;
  private ast: ScriptAST;
  private currentLabel: string;
  private currentNodeIndex: number;
  private isRunning: boolean = false;
  
  // Stack for nested node execution (e.g. in conditions)
  private executionStack: Array<{
    nodes: Node[];
    index: number;
  }> = [];

  constructor(runtime: Runtime, ast: ScriptAST) {
    this.runtime = runtime;
    this.ast = ast;
    this.currentLabel = "Start";
    this.currentNodeIndex = 0;
  }

  /**
   * Starts the story from the beginning
   */
  public start(): void {
    this.isRunning = true;
    this.currentLabel = "Start";
    this.currentNodeIndex = 0;
    this.runtime.jump("Start");
    
    // Register all characters from the AST
    for (const [charName, charNode] of Object.entries(this.ast.characters)) {
      this.runtime.registerCharacter(charName, charNode.attributes);
    }
    
    console.log("[StepInterpreter] Started at label: Start");
  }

  /**
   * Executes the next node and returns it
   * @returns The executed node or null if story is finished
   */
  public step(): Node | null {
    if (!this.isRunning) {
      console.warn("[StepInterpreter] Not running. Call start() first.");
      return null;
    }

    // Check if we're executing from the stack (nested nodes)
    if (this.executionStack.length > 0) {
      const current = this.executionStack[this.executionStack.length - 1];
      
      if (current.index < current.nodes.length) {
        const node = current.nodes[current.index];
        current.index++;
        
        console.log(`[StepInterpreter] Executing nested node type: ${node.type}`);
        
        // Execute nested node
        return this.executeNode(node);
      } else {
        // Done with this nested level
        this.executionStack.pop();
        return this.step(); // Continue with parent level
      }
    }

    // Normal execution from current label
    const label = this.ast.labels[this.currentLabel];
    if (!label) {
      console.error(`[StepInterpreter] Label not found: ${this.currentLabel}`);
      this.isRunning = false;
      return null;
    }

    // Check if we're at the end of this label
    if (this.currentNodeIndex >= label.nodes.length) {
      console.log(`[StepInterpreter] End of label: ${this.currentLabel}`);
      this.isRunning = false;
      return null;
    }

    const node = label.nodes[this.currentNodeIndex];
    console.log(`[StepInterpreter] Executing node type: ${node.type} at index ${this.currentNodeIndex} in label ${this.currentLabel}`);

    return this.executeNode(node);
  }

  /**
   * Executes a single node
   */
  private executeNode(node: Node): Node | null {
    switch (node.type) {
      case "Dialogue":
        // Dialogue is only returned, not executed (UI displays it)
        this.currentNodeIndex++;
        return node;

      case "Variable":
        this.runtime.evaluateExpression(node.expression);
        this.currentNodeIndex++;
        // Variable is "silent" - continue to next node
        return this.step();

      case "Command":
        // Command is returned (Renderer processes it)
        this.currentNodeIndex++;
        return node;

      case "Choice":
        // Choice is returned (UI displays it and waits for selection)
        // DON'T increment currentNodeIndex - we're waiting for user input
        return node;

      case "Condition":
        const conditionMet = this.runtime.evaluateCondition(node.condition);
        console.log(`[StepInterpreter] Condition: ${node.condition} = ${conditionMet}`);

        if (conditionMet && node.thenNodes.length > 0) {
          // Check if any of the thenNodes contains a jump or choice (both end control flow)
          const hasControlFlow = node.thenNodes.some(n => n.type === "Jump" || n.type === "Choice");

          // Push nested nodes to execution stack
          console.log(`[StepInterpreter] Condition TRUE, executing ${node.thenNodes.length} nested nodes`);
          this.executionStack.push({
            nodes: node.thenNodes,
            index: 0
          });

          // If there's a control flow statement (jump/choice) in the condition, don't increment currentNodeIndex yet
          // The jump/choice will handle the flow
          if (!hasControlFlow) {
            this.currentNodeIndex++;
          }
        } else {
          this.currentNodeIndex++;
        }

        return this.step(); // Continue to next node

      case "Jump":
        // If we're in a nested context (executionStack), we need to clean it up
        // and move past the conditional in the parent label
        if (this.executionStack.length > 0) {
          this.executionStack = []; // Clear the stack
          this.currentNodeIndex++; // Move past the conditional that contained this jump
        }
        this.jump(node.target);
        return this.step(); // Continue in new label

      default:
        console.warn(`[StepInterpreter] Unknown node type: ${(node as any).type}`);
        this.currentNodeIndex++;
        return this.step();
    }
  }

  /**
   * Jumps to a label (after choice selection)
   */
  public jump(labelName: string): void {
    console.log(`[StepInterpreter] Jumping to label: ${labelName}`);
    this.currentLabel = labelName;
    this.currentNodeIndex = 0;
    this.runtime.jump(labelName);
  }

  /**
   * Selects the choice and jumps to target label
   */
  public selectChoice(targetLabel: string): void {
    // If we're in a nested context (executionStack), we need to clean it up
    // and move past the conditional in the parent label
    if (this.executionStack.length > 0) {
      this.executionStack = []; // Clear the stack
      this.currentNodeIndex++; // Move past the conditional that contained this choice
    } else {
      this.currentNodeIndex++; // Skip the choice node
    }
    this.jump(targetLabel);
  }

  /**
   * Checks if the story is still running
   */
  public isStoryRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Stops the story
   */
  public stop(): void {
    this.isRunning = false;
    console.log("[StepInterpreter] Stopped");
  }

  /**
   * Reset (for restart)
   */
  public reset(): void {
    this.currentLabel = "Start";
    this.currentNodeIndex = 0;
    this.isRunning = false;
    this.runtime.reset();
  }
}
