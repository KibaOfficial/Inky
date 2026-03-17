// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Inky Theme Configuration
 * User können alle visuellen Aspekte customizen
 */

export interface InkyTheme {
  // Dialogue Box Styling
  dialogueBox: {
    background: string;          // Tailwind class oder CSS
    textColor: string;
    characterNameColor: string;
    padding: string;
    fontSize: string;
    fontFamily?: string;
    borderRadius?: string;
    backdropBlur?: boolean;
  };

  // Choice Button Styling
  choiceButton: {
    background: string;
    hoverBackground: string;
    textColor: string;
    fontSize: string;
    fontFamily?: string;
    borderRadius: string;
    padding: string;
  };

  // Scene Styling
  scene: {
    background: string;          // Fallback wenn kein Image
    characterHeight: string;     // z.B. "85%"
  };

  // Animations
  animations: {
    dialogueTransition: string;  // z.B. "duration-300"
    choiceHover: boolean;
    characterTransition: string;
  };

  // Continue Indicator
  continueIndicator: {
    enabled: boolean;
    symbol: string;              // z.B. "▼", "→", "..."
    color: string;
    animation: string;           // z.B. "animate-pulse"
  };
}

/**
 * Default Theme - Klassisches Visual Novel Look
 */
export const defaultTheme: InkyTheme = {
  dialogueBox: {
    background: "bg-black/80",
    textColor: "text-white",
    characterNameColor: "text-blue-300",
    padding: "p-6",
    fontSize: "text-lg",
    fontFamily: undefined,
    borderRadius: undefined,
    backdropBlur: true,
  },
  choiceButton: {
    background: "bg-blue-600",
    hoverBackground: "hover:bg-blue-500",
    textColor: "text-white",
    fontSize: "text-lg",
    fontFamily: undefined,
    borderRadius: "rounded-lg",
    padding: "px-6 py-4",
  },
  scene: {
    background: "bg-black",
    characterHeight: "h-[85%]",
  },
  animations: {
    dialogueTransition: "transition-all duration-300",
    choiceHover: true,
    characterTransition: "transition-all duration-300 ease-in-out",
  },
  continueIndicator: {
    enabled: true,
    symbol: "▼",
    color: "text-gray-400",
    animation: "animate-pulse",
  },
};

/**
 * Alternative Theme - Modern/Minimalist
 */
export const modernTheme: InkyTheme = {
  dialogueBox: {
    background: "bg-white/95",
    textColor: "text-gray-900",
    characterNameColor: "text-blue-600",
    padding: "p-8",
    fontSize: "text-xl",
    borderRadius: "rounded-2xl",
    backdropBlur: false,
  },
  choiceButton: {
    background: "bg-gradient-to-r from-blue-500 to-purple-600",
    hoverBackground: "hover:from-blue-600 hover:to-purple-700",
    textColor: "text-white",
    fontSize: "text-lg",
    borderRadius: "rounded-full",
    padding: "px-8 py-5",
  },
  scene: {
    background: "bg-gradient-to-b from-gray-100 to-gray-200",
    characterHeight: "h-[80%]",
  },
  animations: {
    dialogueTransition: "transition-all duration-500",
    choiceHover: true,
    characterTransition: "transition-all duration-500 ease-out",
  },
  continueIndicator: {
    enabled: true,
    symbol: "→",
    color: "text-blue-500",
    animation: "animate-bounce",
  },
};

/**
 * Alternative Theme - Dark/Cyberpunk
 */
export const cyberpunkTheme: InkyTheme = {
  dialogueBox: {
    background: "bg-purple-900/90",
    textColor: "text-cyan-100",
    characterNameColor: "text-pink-400",
    padding: "p-6",
    fontSize: "text-lg",
    fontFamily: "font-mono",
    borderRadius: "rounded-none",
    backdropBlur: true,
  },
  choiceButton: {
    background: "bg-pink-600 border-2 border-cyan-400",
    hoverBackground: "hover:bg-pink-500 hover:border-cyan-300",
    textColor: "text-white",
    fontSize: "text-lg",
    fontFamily: "font-mono",
    borderRadius: "rounded-none",
    padding: "px-6 py-4",
  },
  scene: {
    background: "bg-black",
    characterHeight: "h-[90%]",
  },
  animations: {
    dialogueTransition: "transition-all duration-200",
    choiceHover: true,
    characterTransition: "transition-all duration-200",
  },
  continueIndicator: {
    enabled: true,
    symbol: "▶",
    color: "text-cyan-400",
    animation: "animate-pulse",
  },
};
