// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { 
  LabelNode, 
  ScriptAST, 
  Token, 
  TokenType, 
  Node,
  DialogueNode,
  VariableNode,
  CommandNode,
  JumpNode,
  ChoiceNode,
  ConditionNode,
  CharacterDefNode
} from "./types";

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public parse(): ScriptAST {
    const labels: Record<string, LabelNode> = {};
    const characters: Record<string, CharacterDefNode> = {};

    while (!this.isAtEnd()) {
      const token = this.peek();

      if (token.type === TokenType.Label) {
        const label = this.parseLabel();
        labels[label.name] = label;
      } else if (token.type === TokenType.CHAR_DEF) {
        const char = this.parseCharacterDef();
        characters[char.name] = char;
      } else {
        this.advance(); // Skip unknown token
      }
    }

    return { type: "Script", labels, characters };
  }

  private parseLabel(): LabelNode {
    const token = this.advance();
    const name = token.value;
    const nodes: Node[] = [];

    while (!this.isAtEnd() && this.peek().type !== TokenType.Label) {
      const node = this.parseNode();
      if (node) {
        nodes.push(node);
      }
    }

    return { name, nodes };
  }

  private parseNode(): Node | null {
    const token = this.peek();

    switch (token.type) {
      case TokenType.DIALOGUE: {
        this.advance();
        const node: DialogueNode = {
          type: "Dialogue",
          character: token.metadata.character,
          text: token.metadata.text,
          line: token.line,
        };
        return node;
      }
      case TokenType.VARIABLE: {
        this.advance();
        const node: VariableNode = {
          type: "Variable",
          expression: token.metadata.expression,
          line: token.line,
        };
        return node;
      }
      case TokenType.COMMAND: {
        this.advance();
        const node: CommandNode = {
          type: "Command",
          command: token.metadata.command,
          args: token.metadata.args,
          line: token.line,
        };
        return node;
      }
      case TokenType.JUMP: {
        this.advance();
        const node: JumpNode = {
          type: "Jump",
          target: token.value,
          line: token.line,
        };
        return node;
      }
      case TokenType.CHOICE:
        return this.parseChoice();
      case TokenType.CONDITION:
        return this.parseCondition();
      default:
        this.advance();
        return null;
    }
  }

  private parseChoice(): ChoiceNode {
    const choices: Array<{ text: string; target: string; condition?: string }> = [];
    const firstToken = this.peek(); // Line number of first choice

    while (!this.isAtEnd() && this.peek().type === TokenType.CHOICE) {
      const token = this.advance();
      const meta = token.metadata;
      choices.push({
        text: meta.text,
        target: meta.target,
        condition: meta.condition,
      });
    }

    return {
      type: "Choice",
      choices,
      line: firstToken.line, // Line of first choice token
    };
  }

  private parseCondition(): ConditionNode {
    const token = this.advance();
    const condition = token.metadata.condition;

    const thenNodes: Node[] = [];
    while (
      !this.isAtEnd() &&
      this.peek().type !== TokenType.CONDITION &&
      this.peek().type !== TokenType.Label
    ) {
      const node = this.parseNode();
      if (node) {
        thenNodes.push(node);
        // If we encounter a jump or choice, include it but stop parsing more nodes for this condition
        // because they both represent control flow that ends the conditional block
        if (node.type === "Jump" || node.type === "Choice") {
          break;
        }
      }
    }

    return {
      type: "Condition",
      condition,
      thenNodes,
      line: token.line,
    };
  }

  private parseCharacterDef(): CharacterDefNode {
    const token = this.advance(); // CHAR_DEF token
    const name = token.value;
    const attributes: Record<string, string> = {};

    // Collect all CHAR_ATTR tokens for this character
    while (!this.isAtEnd() && this.peek().type === TokenType.CHAR_ATTR) {
      const attrToken = this.advance();
      const attrName = attrToken.value; // e.g., "name", "sprite", "color"
      let attrValue = attrToken.metadata.attrValue; // e.g., "Player", "Player.png", "#4A90E2"
      
      // Remove surrounding quotes if present
      if ((attrValue.startsWith('"') && attrValue.endsWith('"')) ||
          (attrValue.startsWith("'") && attrValue.endsWith("'"))) {
        attrValue = attrValue.slice(1, -1);
      }
      
      attributes[attrName] = attrValue;
    }

    return {
      type: "CharacterDef",
      name,
      attributes,
      line: token.line,
    };
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private advance(): Token {
    return this.tokens[this.current++];
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }
}
