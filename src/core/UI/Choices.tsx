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
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm" style={{ zIndex: 200 }}>
      <div className="bg-gray-900/95 rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          What do you want to do?
        </h2>
        
        <div className="space-y-3">
          {availableChoices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onSelect(choice.target)}
              className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 text-left font-medium hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] group"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{choice.text}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </div>
              {choice.condition && (
                <div className="text-sm text-blue-200 mt-1 opacity-75">
                  {choice.condition}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Choice Count Indicator */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          {availableChoices.length} {availableChoices.length === 1 ? 'Option' : 'Options'}
        </div>
      </div>
    </div>
  );
};
