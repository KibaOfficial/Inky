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
import { Node } from "./core/inkyscript/types";

interface InkyPlayerProps {
  scriptPath?: string;        // Path to .inky file
  script?: string;             // Or direct script string
  theme?: InkyTheme;           // Custom Theme
  assetBasePath?: string;      // Base path for assets
  autoStart?: boolean;         // Starts automatically
}

export const InkyPlayer: React.FC<InkyPlayerProps> = ({
  scriptPath = "/inks/demo-school-day.inky",
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

  // Initialize Engine
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        setIsLoading(true);
        renderer.initialize();

        // Load script
        if (script) {
          // Load from string
          engine.loadScript(script);
        } else if (scriptPath) {
          // Load from URL (browser)
          await engine.loadScriptFromUrl(scriptPath);
        } else {
          throw new Error("No script or scriptPath provided");
        }

        // Start if autoStart
        if (autoStart) {
          // Create StepInterpreter
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
      // Only handle if we have a state and no choices showing
      if (!vnState || (vnState.choices && vnState.choices.length > 0)) {
        return;
      }

      // Enter or Space to continue
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [vnState]);

  /**
   * Starts the story from the beginning
   */
  const startStory = (interpreter?: StepInterpreter) => {
    const interp = interpreter || stepInterpreter;
    if (!interp) {
      console.error("[InkyPlayer] No interpreter available");
      return;
    }

    console.log("[InkyPlayer] Story started");
    interp.start();
    
    // Execute first step
    executeNextStep(interp);
  };

  /**
   * Executes the next step
   */
  const executeNextStep = (interpreter: StepInterpreter) => {
    const node = interpreter.step();
    
    if (!node) {
      console.log("[InkyPlayer] Story ended");
      // TODO: Show end screen
      return;
    }

    // Process node based on type
    switch (node.type) {
      case "Dialogue":
        // Show dialogue
        const dialogueState = renderer.createDialogueState(node);
        setVnState(dialogueState);
        break;

      case "Command":
        // Process command and continue
        renderer.processCommand(node);
        executeNextStep(interpreter); // Commands are instant, continue
        break;

      case "Choice":
        // Show choices
        const choiceState = renderer.createChoiceState(node);
        setVnState(choiceState);
        break;

      default:
        console.warn(`[InkyPlayer] Unhandled node type: ${node.type}`);
        executeNextStep(interpreter); // Skip and continue
    }
  };

  /**
   * Called on click (next dialogue)
   */
  const handleContinue = () => {
    console.log("[InkyPlayer] Continue clicked");
    if (stepInterpreter) {
      executeNextStep(stepInterpreter);
    }
  };

  /**
   * Called on choice selection
   */
  const handleChoiceSelect = (target: string) => {
    console.log("[InkyPlayer] Choice selected:", target);
    if (stepInterpreter) {
      stepInterpreter.selectChoice(target);
      executeNextStep(stepInterpreter);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">
          Loading Inky Engine...
        </div>
      </div>
    );
  }

  // Error State
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

  // No State Yet
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

  // Visual Novel View
  return (
    <VisualNovelView
      state={vnState}
      theme={theme}
      onContinue={handleContinue}
      onChoiceSelect={handleChoiceSelect}
    />
  );
};
