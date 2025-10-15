// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from "react";

interface SceneProps {
  background: string; // Image URL or path
  characters: Array<{
    name: string;
    sprite: string; // Image URL or path (sprite is more common than pose)
    expression?: string; // Optional: happy, sad, angry etc.
    position: "left" | "center" | "right";
    visible?: boolean; // Optional: for show/hide
  }>;
  dialogue: {
    character: string;
    text: string;
    color?: string; // Optional character color
  } | null;
  onClick?: () => void; // For "click to continue"
}

export const Scene: React.FC<SceneProps> = ({
  background,
  characters,
  dialogue,
  onClick,
}) => {
  // Position mapping with better distribution
  const getPositionClass = (position: "left" | "center" | "right") => {
    const positions = {
      left: "left-[20%]",
      center: "left-1/2",
      right: "left-[80%]",
    };
    return positions[position];
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden cursor-pointer select-none"
      onClick={onClick}
    >
      {/* Background */}
      <img 
        src={background} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          // Fallback to solid color if image fails to load
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Characters Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {characters
          .filter(char => char.visible !== false)
          .map((char, index) => (
            <img 
              key={`${char.name}-${index}`}
              src={char.sprite} 
              alt={char.name} 
              className={`absolute bottom-0 ${getPositionClass(char.position)} -translate-x-1/2 h-[85%] object-contain transition-all duration-300 ease-in-out`}
              style={{ zIndex: 10 + index }}
              onError={(e) => {
                // Hide character sprite if image fails to load
                (e.target as HTMLImageElement).style.display = 'none';
                console.warn(`[Scene] Failed to load sprite for ${char.name}: ${char.sprite}`);
              }}
            />
          ))
        }
      </div>

      {/* Dialogue Box */}
      {dialogue && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-6 backdrop-blur-sm" style={{ zIndex: 100 }}>
          <div className="max-w-4xl mx-auto">
            <h2 
              className="font-bold text-xl mb-2"
              style={{ color: dialogue.color || "#60A5FA" }} // Use character color or default blue
            >
              {dialogue.character}
            </h2>
            <p className="text-lg leading-relaxed whitespace-pre-line">
              {dialogue.text}
            </p>
            {/* Continue Indicator */}
            <div className="absolute bottom-2 right-4 text-sm text-gray-400 flex items-center gap-2">
              <span className="animate-pulse">▼</span>
              <span className="hidden sm:inline">Enter/Space</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
