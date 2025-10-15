// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  metadata?: any;
}

export enum TokenType {
  Label, // == Name ==
  DIALOGUE, // Character "Text"
  JUMP, // -> Label
  CHOICE, // * Text -> Label
  COMMAND, // scene, show, play, etc.
  VARIABLE, // ~ varName = value
  CONDITION, // { condition }
  COMMENT, // // Comment or /* */
  NEWLINE,
  EOF, // End of File
  CHAR_DEF, // Character Definition
  CHAR_ATTR, // Character Attributes
}

// ============================================
// AST Node Types
// ============================================

export interface DialogueNode {
  type: 'Dialogue';
  character: string;
  text: string;
  line: number;
}

export interface VariableNode {
  type: 'Variable';
  expression: string; // e.g. "affection = 0" or "affection += 10"
  line: number;
}

export interface CommandNode {
  type: 'Command';
  command: string; // e.g. "scene", "show", "play"
  args: string; // e.g. "school_hallway", "sayori happy"
  line: number;
}

export interface ChoiceNode {
  type: 'Choice';
  choices: Array<{
    text: string;
    target: string;
    condition?: string; // Optional for conditional choices
  }>;
  line: number;
}

export interface ConditionNode {
  type: 'Condition';
  condition: string; // e.g. "affection > 10"
  thenNodes: Node[]; // Nodes that are executed if true
  line: number;
}

export interface JumpNode {
  type: 'Jump';
  target: string; // Label Name
  line: number;
}

export interface CharacterDefNode {
  type: 'CharacterDef';
  name: string; // Character name (e.g., "MC", "Sayori")
  attributes: Record<string, string>; // name: "Player", sprite: "Player.png", etc.
  line: number;
}

export type Node =
  | DialogueNode
  | VariableNode
  | CommandNode
  | ChoiceNode
  | ConditionNode
  | JumpNode
  | CharacterDefNode;

export interface LabelNode {
  name: string;
  nodes: Node[];
}

export interface ScriptAST {
  type: 'Script';
  labels: Record<string, LabelNode>; // Key = Label Name
  characters: Record<string, CharacterDefNode>; // Key = Character Name
}
