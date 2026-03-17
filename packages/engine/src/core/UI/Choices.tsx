// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from "react";

interface Choice {
  text: string;
  target: string; // Label name
  condition?: string; // Optional: Condition
  enabled?: boolean; // Is the choice displayed?
}

interface ChoicesProps {
  choices: Choice[];
  onSelect: (target: string) => void;
}

export const Choices: React.FC<ChoicesProps> = ({ choices, onSelect }) => {
  // Filter only enabled choices
  const availableChoices = choices.filter(choice => choice.enabled !== false);

  return (
    <div className="absolute bottom-36 left-0 right-0 px-4" style={{ zIndex: 150 }}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-linear-to-b from-black/60 to-black/40 backdrop-blur-md rounded-lg shadow-2xl p-4 border border-white/10">
          <div className="space-y-2">
            {availableChoices.map((choice, index) => (
              <button
                key={index}
                onClick={() => onSelect(choice.target)}
                className="w-full px-5 py-3 bg-linear-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg transition-all duration-200 text-left font-medium hover:scale-[1.02] active:scale-[0.98] group shadow-lg hover:shadow-blue-500/30 border border-blue-400/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{choice.text}</span>
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity text-lg">
                    →
                  </span>
                </div>
                {choice.condition && (
                  <div className="text-xs text-blue-200 mt-1 opacity-75">
                    {choice.condition}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
