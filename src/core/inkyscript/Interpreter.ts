// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Runtime } from "./Runtime";
import { Node, ScriptAST } from "./types";

/**
 * Interpreter - Executes the AST
 *
 * Uses the Runtime for state management and
 * outputs everything via console.log (Renderer coming later)
 */
export class Interpreter {
  constructor(private runtime: Runtime, private ast: ScriptAST) {}

  /**
   * Starts the story at the "Start" label
   */
  public run(): void {
    console.log('\n=== INTERPRETER START ===\n');
    
    // Register all characters from the AST
    this.registerCharacters();
    
    this.runtime.jump('Start');
    this.executeLabel('Start');
    console.log('\n=== INTERPRETER END ===\n');
  }

  /**
   * Registers all characters from the AST into the runtime
   */
  private registerCharacters(): void {
    for (const [charName, charNode] of Object.entries(this.ast.characters)) {
      this.runtime.registerCharacter(charName, charNode.attributes);
    }
  }

  /**
   * Executes all nodes in a label
   * @param labelName Name of the label
   */
  private executeLabel(labelName: string): void {
    const label = this.ast.labels[labelName];

    if (!label) {
      console.error(`[Interpreter] Label "${labelName}" not found!`);
      return;
    }

    console.log(`\n--- Label: ${labelName} ---`);

    // Execute all nodes in the label
    for (let i = 0; i < label.nodes.length; i++) {
      this.runtime.currentNodeIndex = i;
      const node = label.nodes[i];
      const shouldStop = this.executeNode(node);
      if (shouldStop) {
        break; // Stop executing nodes if a jump occurred
      }
    }
  }

  /**
   * Executes a single node
   * @param node The node to execute
   * @returns true if execution should stop (e.g., after a jump)
   */
  private executeNode(node: Node): boolean {
    switch (node.type) {
      case 'Dialogue':
        console.log(`[${node.character}] "${node.text}"`);
        return false;

      case 'Variable':
        this.runtime.evaluateExpression(node.expression);
        return false;

      case 'Command':
        console.log(`[CMD] ${node.command} ${node.args}`);
        return false;

      case 'Choice':
        console.log('[CHOICE]');
        node.choices.forEach((choice, index) => {
          const conditionText = choice.condition ? ` [if ${choice.condition}]` : '';
          console.log(`  ${index + 1}. ${choice.text}${conditionText} -> ${choice.target}`);
        });
        // TODO: Wait for user input here later
        console.log('  (Auto-selecting first choice for now)');
        this.runtime.jump(node.choices[0].target);
        this.executeLabel(node.choices[0].target);
        return true; // Stop execution after jump

      case 'Condition':
        const result = this.runtime.evaluateCondition(node.condition);
        console.log(`[CONDITION] ${node.condition} => ${result}`);
        if (result) {
          console.log('  Executing thenNodes...');
          for (const thenNode of node.thenNodes) {
            const shouldStop = this.executeNode(thenNode);
            if (shouldStop) {
              return true; // Propagate the stop signal up
            }
          }
        }
        return false;

      case 'Jump':
        console.log(`[JUMP] -> ${node.target}`);
        this.runtime.jump(node.target);
        this.executeLabel(node.target);
        return true; // Stop execution after jump

      default:
        console.warn(`[Interpreter] Unknown node type:`, node);
        return false;
    }
  }
}