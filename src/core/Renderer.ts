// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { InkyEngine } from "./inkyscript/InkyEngine";
import { VisualNovelState } from "./UI/VisualNovelView";
import { DialogueNode, ChoiceNode, CommandNode } from "./inkyscript/types";
import { AudioManager } from "./Audio/AudioManager";

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
  private audioManager: AudioManager;

  // Current Visual State
  private currentBackground: string = "";
  private currentCharacters: Map<
    string,
    {
      name: string;
      sprite: string;
      expression?: string;
      position: "left" | "center" | "right";
      visible: boolean;
    }
  > = new Map();
  private lastDialogue: { character: string; text: string; color?: string } | null = null;

  constructor(engine: InkyEngine, assetBasePath: string = "/assets") {
    this.engine = engine;
    this.assetBasePath = assetBasePath;
    this.audioManager = new AudioManager();
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
      if (name.includes(".")) {
        const [charName, attrName] = name.split(".");
        const value = this.engine
          .getRuntime()
          .getCharacterAttribute(charName, attrName);
        if (value === undefined) {
          console.warn(
            `[Renderer] Character attribute not found: ${charName}.${attrName}`
          );
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
    const args = command.args; // The arguments as array (already parsed by Lexer)

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
          if (!spritePath.startsWith("/") && !spritePath.startsWith("http")) {
            spritePath = `${this.assetBasePath}/characters/${spritePath}`;
          }
          console.log(
            `[Renderer] Generated sprite path for ${charName}:`,
            spritePath
          );
        } else {
          // Fallback to default pattern
          spritePath = `${this.assetBasePath}/characters/${charName}/${expression}.png`;
          console.log(
            `[Renderer] Fallback sprite path for ${charName}:`,
            spritePath
          );
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
        this.currentCharacters.forEach((char) => (char.visible = false));
        break;

      case "play": {
        // play music filename.mp3 (optional: loop, fadein, duration)
        // play sound sfx_door.mp3 (optional: volume)
        if (!command.args || command.args.length < 2) {
          console.warn("[Renderer] play command requires type and filename");
          break;
        }

        const type = command.args[0]; // 'music' or 'sound'
        const filename = command.args[1]; // e.g. 'bgm_school.mp3'
        const folder = type === 'music' ? 'music' : 'sounds';
        const path = `${this.assetBasePath}/${folder}/${filename}`;

        if (type === "music") {
          const loop = command.args.includes("loop");
          const fadeDuration = command.args.includes("fadein")
            ? parseInt(command.args[command.args.indexOf("fadein") + 1])
            : 0;

          this.audioManager.playMusic(path, loop, fadeDuration);
          console.log(
            `[Renderer] Playing music: ${path}, loop: ${loop}, fadeIn: ${fadeDuration}`
          );
        } else if (type === "sound") {
          const loop = command.args.includes("loop");
          
          // Parse volume: can be standalone number after loop, or after "volume" keyword
          let volume: number | undefined;
          const volumeIndex = command.args.indexOf("volume");
          if (volumeIndex !== -1 && command.args[volumeIndex + 1]) {
            volume = parseFloat(command.args[volumeIndex + 1]);
          } else {
            // Check if last arg is a number (volume without keyword)
            const lastArg = command.args[command.args.length - 1];
            const parsedVolume = parseFloat(lastArg);
            if (!isNaN(parsedVolume) && parsedVolume >= 0 && parsedVolume <= 1) {
              volume = parsedVolume;
            }
          }

          this.audioManager.playSound(path, loop, volume);
          console.log(`[Renderer] Playing sound: ${path}, loop: ${loop}, volume: ${volume ?? 'default'}`);
        }
        break;
      }

      case "stop":{
        if (!command.args || command.args.length < 1) {
          console.warn("[Renderer] No audio type specified to stop.");
          break;
        }

        const type = command.args[0];

        if (type === "music") {
          const fadeOutDuration = command.args.includes("fadeout")
            ? parseInt(command.args[command.args.indexOf("fadeout") + 1])
            : 0;
          this.audioManager.stopMusic(fadeOutDuration);
          console.log(`[Renderer] Stopping music, fadeOut: ${fadeOutDuration}`);
        } else if (type === "sound") {
          const fadeOutDuration = command.args.includes("fadeout")
            ? parseInt(command.args[command.args.indexOf("fadeout") + 1])
            : 0;
          this.audioManager.stopSound(fadeOutDuration);
          console.log(`[Renderer] Stopping all sounds, fadeOut: ${fadeOutDuration}`);
        }
        break;
      }

      case "pause":{
        if (command.args && command.args[0] === "music") {
          this.audioManager.pauseMusic();
          console.log(`[Renderer] Pausing music`);
        }
        break;
      }

      case "wait":
        // wait duration
        console.log(`[Renderer] wait ${args[0]}s (timing not implemented yet)`);
        break;

      case "shake":
      case "flash":
        // Effects
        console.log(
          `[Renderer] ${cmd} ${args.join(" ")} (effects not implemented yet)`
        );
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

    // Store dialogue for later use with choices
    this.lastDialogue = {
      character: node.character,
      text: this.interpolateText(node.text), // Interpolate variables
      color: characterColor, // Use character color from definition
    };

    return {
      background: this.currentBackground,
      characters: Array.from(this.currentCharacters.values()).map((char) => ({
        name: char.name,
        sprite: char.sprite,
        expression: char.expression,
        position: char.position,
        visible: char.visible,
      })),
      dialogue: this.lastDialogue,
      choices: null,
    };
  }

  /**
   * Creates VisualNovelState for choice node
   */
  public createChoiceState(node: ChoiceNode): VisualNovelState {
    return {
      background: this.currentBackground,
      characters: Array.from(this.currentCharacters.values()).map((char) => ({
        name: char.name,
        sprite: char.sprite,
        expression: char.expression,
        position: char.position,
        visible: char.visible,
      })),
      dialogue: this.lastDialogue, // Keep last dialogue visible during choices
      choices: node.choices.map((choice) => ({
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
      characters: Array.from(this.currentCharacters.values()).map((char) => ({
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
