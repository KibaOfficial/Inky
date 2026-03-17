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
  onContinue?: () => void;
  onChoiceSelect: (target: string) => void;
  storyEnded?: boolean;
}

export const VisualNovelView: React.FC<VisualNovelViewProps> = ({
  state,
  theme: _theme = defaultTheme,
  onContinue,
  onChoiceSelect,
  storyEnded = false,
}) => {
  const showChoices = state.choices && state.choices.length > 0;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Scene
        background={state.background}
        characters={state.characters}
        dialogue={state.dialogue}
        onClick={showChoices || storyEnded ? undefined : onContinue}
      />

      {showChoices && !storyEnded && (
        <Choices
          choices={state.choices!}
          onSelect={onChoiceSelect}
        />
      )}

      {storyEnded && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center p-8">
          <div className="text-white text-lg opacity-60 select-none">
            — The End —
          </div>
        </div>
      )}
    </div>
  );
};
