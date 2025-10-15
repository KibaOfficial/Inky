// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { InkyEngine } from "./inkyscript/InkyEngine";
import { VisualNovelState } from "./UI/VisualNovelView";
import { DialogueNode, ChoiceNode, CommandNode } from "./inkyscript/types";

/**
 * Renderer - Bridge between InkyEngine and React UI
 *
 * Manages:
 * - Asset Paths (Background, Character Sprites)
 * - UI State from AST Nodes
 * - Command Execution (scene, show, hide)
 */
export class Renderer {
  private engine: InkyEngine;
  private assetBasePath: string;
  
  // Current Visual State
  private currentBackground: string = "";
  private currentCharacters: Map<string, {
    name: string;
    sprite: string;
    expression?: string;
    position: "left" | "center" | "right";
    visible: boolean;
  }> = new Map();

  constructor(engine: InkyEngine, assetBasePath: string = "/assets") {
    this.engine = engine;
    this.assetBasePath = assetBasePath;
  }

  /**
   * Initializes the renderer with default values
   */
  public initialize(): void {
    // Use a solid color background or first available background
    this.currentBackground = `${this.assetBasePath}/backgrounds/Bedroom_Day.png`;
    this.currentCharacters.clear();
  }

  /**
   * Replaces variables in text with their values
   * Syntax: {variableName} -> Value
   * Syntax: {CharName.attribute} -> Character Attribute Value
   */
  private interpolateText(text: string): string {
    return text.replace(/\{([\w.]+)\}/g, (match, name) => {
      // Check for dot notation (CharName.attribute)
      if (name.includes('.')) {
        const [charName, attrName] = name.split('.');
        const value = this.engine.getRuntime().getCharacterAttribute(charName, attrName);
        if (value === undefined) {
          console.warn(`[Renderer] Character attribute not found: ${charName}.${attrName}`);
          return match; // Keep {CharName.attribute} if not found
        }
        return String(value);
      }
      
      // Regular variable lookup
      const value = this.engine.getRuntime().getVariable(name);
      if (value === undefined) {
        console.warn(`[Renderer] Variable not found: ${name}`);
        return match; // Keep {varName} if not found
      }
      return String(value);
    });
  }

  /**
   * Processes a command node and updates the visual state
   */
  public processCommand(command: CommandNode): void {
    const cmd = command.command; // The command type (e.g. "scene", "show")
    const argsString = command.args; // The arguments as a string
    const args = argsString.split(/\s+/).filter(arg => arg.length > 0); // Split and filter empty
    
    switch (cmd) {
      case "scene":
        // scene school_hallway
        if (args[0]) {
          // Try PNG first, fallback to JPG (most backgrounds are PNG)
          this.currentBackground = `${this.assetBasePath}/backgrounds/${args[0]}.png`;
        }
        break;
      
      case "show":
        // show sayori happy at left
        const charName = args[0];
        const expression = args[1] || "neutral";
        const position = this.parsePosition(args);
        
        // Get character definition from runtime
        const charDef = this.engine.getRuntime().getCharacter(charName);
        let spritePath: string;
        
        if (charDef && charDef.sprite) {
          // Use character's sprite template, replace {expression} placeholder
          spritePath = charDef.sprite.replace(/{expression}/g, expression);
          // Make path relative to assets
          if (!spritePath.startsWith('/') && !spritePath.startsWith('http')) {
            spritePath = `${this.assetBasePath}/characters/${spritePath}`;
          }
          console.log(`[Renderer] Generated sprite path for ${charName}:`, spritePath);
        } else {
          // Fallback to default pattern
          spritePath = `${this.assetBasePath}/characters/${charName}/${expression}.png`;
          console.log(`[Renderer] Fallback sprite path for ${charName}:`, spritePath);
        }
        
        this.currentCharacters.set(charName, {
          name: charName,
          sprite: spritePath,
          expression,
          position,
          visible: true,
        });
        break;
      
      case "hide":
        // hide sayori
        const hideChar = args[0];
        const char = this.currentCharacters.get(hideChar);
        if (char) {
          char.visible = false;
        }
        break;
      
      case "clear":
        // clear (hide all characters)
        this.currentCharacters.forEach(char => char.visible = false);
        break;
      
      case "play":
        // play music/sound filename.mp3
        // TODO: Implement audio system
        console.log(`[Renderer] play ${args.join(' ')} (audio not implemented yet)`);
        break;
      
      case "stop":
        // stop music/sound
        // TODO: Implement audio system
        console.log(`[Renderer] stop ${args.join(' ')} (audio not implemented yet)`);
        break;
      
      case "pause":
        // pause (wait for user input)
        console.log(`[Renderer] pause (handled by interpreter)`);
        break;
      
      case "wait":
        // wait duration
        console.log(`[Renderer] wait ${args[0]}s (timing not implemented yet)`);
        break;
      
      case "shake":
      case "flash":
        // Effects
        console.log(`[Renderer] ${cmd} ${args.join(' ')} (effects not implemented yet)`);
        break;
      
      // Additional commands here...
      default:
        console.warn(`[Renderer] Unknown command: ${cmd}`);
    }
  }

  /**
   * Parses position from command args
   */
  private parsePosition(args: string[]): "left" | "center" | "right" {
    const atIndex = args.indexOf("at");
    if (atIndex !== -1 && args[atIndex + 1]) {
      const pos = args[atIndex + 1];
      if (pos === "left" || pos === "center" || pos === "right") {
        return pos;
      }
    }
    return "center"; // Default
  }

  /**
   * Creates VisualNovelState for current dialogue node
   */
  public createDialogueState(node: DialogueNode): VisualNovelState {
    // Get character color from definition
    const charDef = this.engine.getRuntime().getCharacter(node.character);
    const characterColor = charDef?.color;
    
    return {
      background: this.currentBackground,
      characters: Array.from(this.currentCharacters.values()).map(char => ({
        name: char.name,
        sprite: char.sprite,
        expression: char.expression,
        position: char.position,
        visible: char.visible,
      })),
      dialogue: {
        character: node.character,
        text: this.interpolateText(node.text), // Interpolate variables
        color: characterColor, // Use character color from definition
      },
      choices: null,
    };
  }

  /**
   * Creates VisualNovelState for choice node
   */
  public createChoiceState(node: ChoiceNode): VisualNovelState {
    return {
      background: this.currentBackground,
      characters: Array.from(this.currentCharacters.values()).map(char => ({
        name: char.name,
        sprite: char.sprite,
        expression: char.expression,
        position: char.position,
        visible: char.visible,
      })),
      dialogue: null,
      choices: node.choices.map(choice => ({
        text: this.interpolateText(choice.text), // Interpolate variables in choices
        target: choice.target,
        condition: choice.condition,
        enabled: choice.condition 
          ? this.engine.getRuntime().evaluateCondition(choice.condition)
          : true,
      })),
    };
  }

  /**
   * Returns the current visual state (for commands/other nodes)
   */
  public getCurrentState(): VisualNovelState {
    return {
      background: this.currentBackground,
      characters: Array.from(this.currentCharacters.values()).map(char => ({
        name: char.name,
        sprite: char.sprite,
        expression: char.expression,
        position: char.position,
        visible: char.visible,
      })),
      dialogue: null,
      choices: null,
    };
  }

  /**
   * Reset Renderer State
   */
  public reset(): void {
    this.initialize();
  }

  /**
   * Set Asset Base Path (for custom asset locations)
   */
  public setAssetBasePath(path: string): void {
    this.assetBasePath = path;
  }
}
