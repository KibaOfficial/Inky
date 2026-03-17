// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { useState, useEffect } from "react";
import { InkyEngine } from "./core/inkyscript/InkyEngine";
import { Renderer } from "./core/Renderer";
import { StepInterpreter } from "./core/inkyscript/StepInterpreter";
import { VisualNovelView } from "./core/UI/VisualNovelView";
import { VisualNovelState } from "./core/UI/VisualNovelView";
import { InkyTheme, defaultTheme } from "./core/UI/theme";

interface InkyPlayerProps {
  scriptPath?: string;
  script?: string;
  theme?: InkyTheme;
  assetBasePath?: string;
  autoStart?: boolean;
}

export const InkyPlayer: React.FC<InkyPlayerProps> = ({
  scriptPath,
  script,
  theme = defaultTheme,
  assetBasePath = "/assets",
  autoStart = true,
}) => {
  const [engine] = useState(() => new InkyEngine());
  const [renderer] = useState(() => new Renderer(engine, assetBasePath));
  const [stepInterpreter, setStepInterpreter] = useState<StepInterpreter | null>(null);
  const [vnState, setVnState] = useState<VisualNovelState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storyEnded, setStoryEnded] = useState(false);

  // Initialize Engine
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        setIsLoading(true);
        renderer.initialize();

        if (script) {
          engine.loadScript(script);
        } else if (scriptPath) {
          await engine.loadScriptFromUrl(scriptPath);
        } else {
          throw new Error("No script or scriptPath provided");
        }

        if (autoStart) {
          const ast = engine.getAST();
          if (ast) {
            const interpreter = new StepInterpreter(engine.getRuntime(), ast);
            setStepInterpreter(interpreter);
            startStory(interpreter);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("[InkyPlayer] Failed to initialize:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setIsLoading(false);
      }
    };

    initializeEngine();
  }, []);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (storyEnded) return;
      if (!vnState || (vnState.choices && vnState.choices.length > 0)) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [vnState, storyEnded]);

  const startStory = (interpreter?: StepInterpreter) => {
    const interp = interpreter || stepInterpreter;
    if (!interp) {
      console.error("[InkyPlayer] No interpreter available");
      return;
    }

    console.log("[InkyPlayer] Story started");
    setStoryEnded(false);
    setVnState(null);
    interp.reset();
    interp.start();
    advance(interp);
  };

  /**
   * Advances the story until a UI-relevant node (Dialogue or Choice) is reached,
   * or the story ends. Commands are processed inline without returning to React.
   */
  const advance = (interpreter: StepInterpreter) => {
    while (true) {
      const node = interpreter.step();

      if (!node) {
        console.log("[InkyPlayer] Story ended");
        setStoryEnded(true);
        return;
      }

      if (node.type === "Dialogue") {
        setVnState(renderer.createDialogueState(node));
        return;
      }

      if (node.type === "Choice") {
        setVnState(renderer.createChoiceState(node));
        return;
      }

      if (node.type === "Command") {
        renderer.processCommand(node);
        // Commands are silent — loop to next node
        continue;
      }

      // Unknown UI node — skip
      console.warn(`[InkyPlayer] Unhandled node type: ${node.type}`);
    }
  };

  const handleContinue = () => {
    if (storyEnded || !stepInterpreter) return;
    advance(stepInterpreter);
  };

  const handleChoiceSelect = (target: string) => {
    if (!stepInterpreter) return;
    stepInterpreter.selectChoice(target);
    advance(stepInterpreter);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading Inky Engine...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-red-900 flex items-center justify-center">
        <div className="text-white text-center p-8">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  if (!vnState) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <button
          onClick={() => startStory()}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-2xl rounded-lg transition-all"
        >
          Start Story
        </button>
      </div>
    );
  }

  return (
    <VisualNovelView
      state={vnState}
      theme={theme}
      onContinue={storyEnded ? undefined : handleContinue}
      onChoiceSelect={handleChoiceSelect}
      storyEnded={storyEnded}
    />
  );
};
