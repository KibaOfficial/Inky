// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Interpreter } from "./Interpreter";
import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import { Runtime } from "./Runtime";
import { ScriptAST } from "./types";

/**
 * InkyEngine - The central API for the Inky Visual Novel Engine.
 *
 * Pipeline: .inky Script → Lexer → Parser → Interpreter → (Renderer)
 *
 * Browser-only: use loadScriptFromUrl() or loadScript().
 */
export class InkyEngine {
  private lexer: Lexer;
  private parser: Parser;
  private runtime: Runtime;
  private interpreter: Interpreter | null = null;
  private ast: ScriptAST | null = null;

  constructor() {
    this.lexer = new Lexer('');
    this.parser = new Parser([]);
    this.runtime = new Runtime();
  }

  /**
   * Loads an InkyScript from a URL (Browser).
   */
  public async loadScriptFromUrl(url: string): Promise<void> {
    console.log(`[InkyEngine] Loading script from URL: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`[InkyEngine] HTTP ${response.status}: ${response.statusText}`);
    }

    const inkyScript = await response.text();
    console.log(`[InkyEngine] File loaded: ${inkyScript.split('\n').length} lines`);
    this.loadScript(inkyScript);
  }

  /**
   * Loads an InkyScript from a string.
   */
  public loadScript(inkyScript: string): void {
    console.log('[InkyEngine] Parsing script...');

    this.lexer = new Lexer(inkyScript);
    const tokens = this.lexer.tokenize(inkyScript);
    console.log(`[InkyEngine] Lexer: ${tokens.length} tokens generated`);

    this.parser = new Parser(tokens);
    this.ast = this.parser.parse();
    console.log(`[InkyEngine] Parser: ${Object.keys(this.ast.labels).length} labels parsed`);

    this.interpreter = new Interpreter(this.runtime, this.ast);
    console.log('[InkyEngine] Interpreter ready');
  }

  public run(): void {
    if (!this.interpreter) {
      console.error('[InkyEngine] No script loaded. Call loadScript() or loadScriptFromUrl() first.');
      return;
    }
    this.interpreter.run();
  }

  public async loadUrlAndRun(url: string): Promise<void> {
    await this.loadScriptFromUrl(url);
    this.run();
  }

  public getState(): string {
    return this.runtime.getState();
  }

  public reset(): void {
    this.runtime.reset();
    this.interpreter = null;
    this.ast = null;
    console.log('[InkyEngine] Reset complete');
  }

  public getAST(): ScriptAST | null {
    return this.ast;
  }

  public getRuntime(): Runtime {
    return this.runtime;
  }
}
