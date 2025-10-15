// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from "react";
import { Scene } from "./Scene";
import { Choices } from "./Choices";
import { InkyTheme, defaultTheme } from "./theme";

export interface VisualNovelState {
  // Scene Data
  background: string;
  characters: Array<{
    name: string;
    sprite: string;
    expression?: string;
    position: "left" | "center" | "right";
    visible?: boolean;
  }>;
  
  // Dialogue Data
  dialogue: {
    character: string;
    text: string;
    color?: string; // Optional character color from definition
  } | null;
  
  // Choice Data
  choices: Array<{
    text: string;
    target: string;
    condition?: string;
    enabled?: boolean;
  }> | null;
}

interface VisualNovelViewProps {
  state: VisualNovelState;
  theme?: InkyTheme;
  onContinue: () => void;           // Called on click (next dialogue)
  onChoiceSelect: (target: string) => void; // Called on choice selection
}

export const VisualNovelView: React.FC<VisualNovelViewProps> = ({
  state,
  theme = defaultTheme,
  onContinue,
  onChoiceSelect,
}) => {
  const showChoices = state.choices && state.choices.length > 0;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Scene with Background, Characters, Dialogue */}
      <Scene
        background={state.background}
        characters={state.characters}
        dialogue={state.dialogue}
        onClick={showChoices ? undefined : onContinue} // Only clickable when no choices
      />

      {/* Choices Overlay (only when choices present) */}
      {showChoices && (
        <Choices
          choices={state.choices!}
          onSelect={onChoiceSelect}
        />
      )}
    </div>
  );
};
