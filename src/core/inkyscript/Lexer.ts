// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Token, TokenType } from './types';

export class Lexer {
  public script: string;

  // Regex Patterns

  /**
   * Example: == LabelName ==
   */
  private labelPattern = /^==\s*(.+?)\s*==$/;
  
  /**
   * Example: Sayori "Hello!"
   * Multi-line: Sayori "Text
   *                    more text"
   */
  private dialoguePattern = /^(\w+)\s+"(.+)"$/;
  private dialogueStartPattern = /^(\w+)\s+"(.*)$/; // Start without closing "

  /**
   * Example: -> LabelName
   */
  private jumpPattern = /^->\s*(\w+)$/;

  /**
   * Example: * Choice Text -> LabelName
   */
  private choicePattern = /^\*\s*(.+?)\s*->\s*(\w+)$/;

  /**
   * Example: * [condition] Choice Text -> LabelName
   */
  private conditionalChoicePattern = /^\*\s*\[(.+?)\]\s*(.+?)\s*->\s*(\w+)$/;

  /**
   * Example: scene school_hallway
   *          show sayori happy
   *          play music theme.mp3
   *          pause
   *          clear
   */
  private commandPattern = /^(scene|show|hide|play|stop|pause|wait|clear|shake|flash)\s*(.*)$/;

  /**
   * Example: ~ varName = value
   *          ~ affection += 10
   *          ~ playerName = "Alex"
   */
  private variablePattern = /^~\s*(.+)$/;

  /**
   * Example: { affection > 10 }
   *          { hasKey == true }
   *
   */
  private conditionPattern = /^{\s*(.+?)\s*}$/;

  /**
   * Example: @char MC
   */
  private charDefPattern = /^@char\s+(\w+)$/;

  /**
   * Example: name: "Player"
   *           sprite: "Player.png"
   *           color: "#4A90E2"
   *           expressions: happy, sad, angry
   */
  private charAttrPattern = /^(\w+):\s*(.+)$/;

  constructor(script: string) {
    this.script = script;
  }

  public tokenize(script: string): Token[] {
    let inCharDef = false;
    let currentCharName = '';
    const lines = script.split(/\r?\n/);
    const tokens: Token[] = [];
    let inMultiLineComment = false;
    let inMultiLineDialogue = false;
    let multiLineDialogueCharacter = '';
    let multiLineDialogueText = '';
    let multiLineDialogueStartLine = 0;

    for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  const lineNumber = i + 1;

      // Character Definition Start
      const charDefMatch = line.match(this.charDefPattern);
      if (charDefMatch) {
        inCharDef = true;
        currentCharName = charDefMatch[1];
        tokens.push({
          type: TokenType.CHAR_DEF,
          value: currentCharName,
          line: lineNumber
        });
        continue;
      }

      // Character Attribute (only if inCharDef and indented)
      if (inCharDef && (lines[i].startsWith(' ') || lines[i].startsWith('\t'))) {
        const attrLine = lines[i].trim();
        if (attrLine.length === 0) continue;
        const attrMatch = attrLine.match(this.charAttrPattern);
        if (attrMatch) {
          tokens.push({
            type: TokenType.CHAR_ATTR,
            value: attrMatch[1], // attribute name
            line: lineNumber,
            metadata: {
              charName: currentCharName,
              attrValue: attrMatch[2].trim()
            }
          });
          continue;
        }
      } else if (inCharDef && !(lines[i].startsWith(' ') || lines[i].startsWith('\t'))) {
        // End of char block if not indented
        inCharDef = false;
        currentCharName = '';
        // Do not redeclare line/lineNumber here
      }

      // Multi-line Comment Start
      if (line.startsWith('/*')) {
        inMultiLineComment = true;
        continue;
      }

      // Multi-line Comment End
      if (line.endsWith('*/')) {
        inMultiLineComment = false;
        continue;
      }

      // Skip lines inside multi-line comments
      if (inMultiLineComment) {
        continue;
      }

      // Multi-line Dialogue Handling
      if (inMultiLineDialogue) {
        // Check if this line ends the dialogue
        if (line.endsWith('"')) {
          // Add final line and create token
          multiLineDialogueText += '\n' + line.slice(0, -1); // Remove closing "
          tokens.push({
            type: TokenType.DIALOGUE,
            value: multiLineDialogueText.trim(),
            line: multiLineDialogueStartLine,
            metadata: {
              character: multiLineDialogueCharacter,
              text: multiLineDialogueText.trim()
            }
          });
          // Reset state
          inMultiLineDialogue = false;
          multiLineDialogueCharacter = '';
          multiLineDialogueText = '';
          multiLineDialogueStartLine = 0;
          continue;
        } else {
          // Continue collecting text
          multiLineDialogueText += '\n' + line;
          continue;
        }
      }

      // Check for multi-line dialogue start
      const dialogueStartMatch = line.match(this.dialogueStartPattern);
      if (dialogueStartMatch && !line.endsWith('"')) {
        // This is a multi-line dialogue start
        inMultiLineDialogue = true;
        multiLineDialogueCharacter = dialogueStartMatch[1];
        multiLineDialogueText = dialogueStartMatch[2];
        multiLineDialogueStartLine = lineNumber;
        continue;
      }

      // Skip empty lines
      if (line.length === 0) continue;

      // Skip comments (only // for now)
      if (line.startsWith('//')) continue;

      // Pattern Matching
      const token = this.matchPattern(line, lineNumber);
      if (token) {
        tokens.push(token);
      }
    }

    // EOF Token at the end
    tokens.push({
      type: TokenType.EOF,
      value: '',
      line: lines.length
    });

    return tokens;
  }

  private matchPattern(line: string, lineNumber: number): Token | null {
    try {

      const labelMatch = line.match(this.labelPattern);
      if (labelMatch) {
        return {
          type: TokenType.Label,
          value: labelMatch[1], // The label name (from the capture group)
          line: lineNumber
        };
      }

      const dialogueMatch = line.match(this.dialoguePattern);
      if (dialogueMatch) {
        return {
          type: TokenType.DIALOGUE,
          value: dialogueMatch[2], // The text is more important than the whole line
          line: lineNumber,
          metadata: {
            character: dialogueMatch[1], // Character name
            text: dialogueMatch[2]       // Spoken text
          }
        };
      }

      const jumpMatch = line.match(this.jumpPattern);
      if (jumpMatch) {
        return {
          type: TokenType.JUMP,
          value: jumpMatch[1], // Target label
          line: lineNumber
        };
      }

      const conditionalChoiceMatch = line.match(this.conditionalChoicePattern);
      if (conditionalChoiceMatch) {
        return {
          type: TokenType.CHOICE,
          value: conditionalChoiceMatch[2], // The choice text
          line: lineNumber,
          metadata: {
            condition: conditionalChoiceMatch[1], // Condition
            text: conditionalChoiceMatch[2],      // Choice text
            target: conditionalChoiceMatch[3]     // Target label
          }
        };
      }

      // Then Simple Choice
      const choiceMatch = line.match(this.choicePattern);
      if (choiceMatch) {
        return {
          type: TokenType.CHOICE,
          value: choiceMatch[1], // The choice text
          line: lineNumber,
          metadata: {
            text: choiceMatch[1],   // Choice text
            target: choiceMatch[2]  // Target label
          }
        };
      }

      const commandMatch = line.match(this.commandPattern);
      if (commandMatch) {
        return {
          type: TokenType.COMMAND,
          value: commandMatch[1], // The command type is more important
          line: lineNumber,
          metadata: {
            command: commandMatch[1], // The command type
            args: commandMatch[2]     // The arguments
          }
        };
      }

      const variableMatch = line.match(this.variablePattern);
      if (variableMatch) {
        return {
          type: TokenType.VARIABLE,
          value: variableMatch[1], // The entire expression is important
          line: lineNumber,
          metadata: {
            expression: variableMatch[1] // The entire expression
          }
        };
      }

      const conditionMatch = line.match(this.conditionPattern);
      if (conditionMatch) {
        return {
          type: TokenType.CONDITION,
          value: conditionMatch[1], // The condition is important
          line: lineNumber,
          metadata: {
            condition: conditionMatch[1] // The condition
          }
        };
      }
    } catch (error) {
      console.error(`[Lexer] Error parsing line ${lineNumber}:`, error);
    }

    // If nothing matched, return null
    console.warn(`[Lexer] Unknown pattern in line ${lineNumber}: "${line}"`);
    return null;
  }
}