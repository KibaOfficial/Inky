// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Interpreter } from "./Interpreter";
import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import { Runtime } from "./Runtime";
import { ScriptAST } from "./types";
import * as fs from 'fs';
import * as path from 'path';

/**
 * InkyEngine - The central API for the Inky Visual Novel Engine
 *
 * Executes the complete pipeline:
 * .inky Script → Lexer → Parser → Interpreter → (Renderer)
 */
export class InkyEngine {
  private lexer: Lexer;
  private parser: Parser;
  private runtime: Runtime;
  private interpreter: Interpreter | null = null;
  private ast: ScriptAST | null = null;

  constructor() {
    this.lexer = new Lexer(''); // Script will be set later
    this.parser = new Parser([]); // Tokens will be set later
    this.runtime = new Runtime();
  }

  /**
   * Loads an InkyScript from a file path (Node.js only)
   * @param filePath Path to the .inky file
   */
  public loadScriptFromFile(filePath: string): void {
    console.log(`[InkyEngine] Loading script from: ${filePath}`);
    
    // Check if we're in Node.js environment
    if (typeof window === 'undefined') {
      // Node.js environment - use fs
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`[InkyEngine] File not found: ${filePath}`);
      }

      // Read file
      const inkyScript = fs.readFileSync(filePath, 'utf-8');
      console.log(`[InkyEngine] File loaded: ${inkyScript.split('\n').length} lines`);

      // Load the script content
      this.loadScript(inkyScript);
    } else {
      // Browser environment - cannot use fs
      throw new Error('[InkyEngine] loadScriptFromFile() is not supported in browser. Use loadScriptFromUrl() instead.');
    }
  }

  /**
   * Loads an InkyScript from a URL (Browser only)
   * @param url URL to the .inky file
   */
  public async loadScriptFromUrl(url: string): Promise<void> {
    console.log(`[InkyEngine] Loading script from URL: ${url}`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const inkyScript = await response.text();
      console.log(`[InkyEngine] File loaded: ${inkyScript.split('\n').length} lines`);
      
      this.loadScript(inkyScript);
    } catch (error) {
      throw new Error(`[InkyEngine] Failed to load script from ${url}: ${error}`);
    }
  }

  /**
   * Loads an InkyScript as a string
   * @param inkyScript The InkyScript string
   */
  public loadScript(inkyScript: string): void {
    console.log('[InkyEngine] Parsing script...');
    
    // Step 1: Lexer - Text → Tokens
    this.lexer = new Lexer(inkyScript);
    const tokens = this.lexer.tokenize(inkyScript);
    console.log(`[InkyEngine] Lexer: ${tokens.length} tokens generated`);

    // Step 2: Parser - Tokens → AST
    this.parser = new Parser(tokens);
    this.ast = this.parser.parse();
    console.log(`[InkyEngine] Parser: ${Object.keys(this.ast.labels).length} labels parsed`);

    // Step 3: Interpreter - Execute AST
    this.interpreter = new Interpreter(this.runtime, this.ast);
    console.log('[InkyEngine] Interpreter ready');
  }

  /**
   * Starts the story execution
   */
  public run(): void {
    if (!this.interpreter) {
      console.error('[InkyEngine] No script loaded! Call loadScript() or loadScriptFromFile() first.');
      return;
    }

    console.log('[InkyEngine] Starting story execution...\n');
    this.interpreter.run();
  }

  /**
   * Loads and runs a script directly (as a string)
   * @param inkyScript The InkyScript string
   */
  public loadAndRun(inkyScript: string): void {
    this.loadScript(inkyScript);
    this.run();
  }

  /**
   * Loads and runs a script directly (from file - Node.js only)
   * @param filePath Path to the .inky file
   */
  public loadFileAndRun(filePath: string): void {
    this.loadScriptFromFile(filePath);
    this.run();
  }

  /**
   * Loads and runs a script directly (from URL - Browser)
   * @param url URL to the .inky file
   */
  public async loadUrlAndRun(url: string): Promise<void> {
    await this.loadScriptFromUrl(url);
    this.run();
  }

  /**
   * Returns the current runtime state
   */
  public getState(): string {
    return this.runtime.getState();
  }

  /**
   * Resets the engine (new game)
   */
  public reset(): void {
    this.runtime.reset();
    this.interpreter = null;
    this.ast = null;
    console.log('[InkyEngine] Reset complete');
  }

  /**
   * Returns the parsed AST (for debugging)
   */
  public getAST(): ScriptAST | null {
    return this.ast;
  }

  /**
   * Returns the runtime instance (for direct access)
   */
  public getRuntime(): Runtime {
    return this.runtime;
  }
}