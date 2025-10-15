<!--
 Copyright (c) 2025 KibaOfficial

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# Inky - Visual Novel Engine

> A Ren'Py-inspired Visual Novel Engine built with TypeScript and React

## 🎮 About

**Inky** is a complete Visual Novel/Narrative Engine for the web, inspired by Ren'Py. It features its own scripting language **InkyScript** (`.inky` files) for writing interactive stories with choices, variables, and conditions.

## ✨ Features

### InkyScript DSL
- 📝 **Labels & Jumps** - Story sections and navigation
- 💬 **Dialogues** - Character conversations with typewriter effects
- 🎯 **Choices** - Player decisions with branching paths
- 🔢 **Variables** - Dynamic story state management
- ⚡ **Conditions** - If/else logic for branching narratives
- 🎨 **Commands** - Scene management, character sprites, audio
- 👤 **Character System** - Character definitions with sprites and colors
- 🖼️ **Sprite System** - Dynamic character expressions with placeholder support

### Engine Components
- ⚡️ **Vite** - Lightning fast development
- ⚙️ **React** - Modern UI framework
- 🎨 **Tailwind CSS** - Modern UI styling
- 📘 **TypeScript** - Type-safe codebase
- 🔧 **Lexer + Parser** - Custom DSL compiler
- 🎭 **Interpreter** - Runtime execution engine with step-by-step execution
- 🎮 **Visual Novel Player** - Complete React-based player UI

## 📚 InkyScript Syntax

```inky
// Character Definitions
@char MC
    name: "Player"
    sprite: "Player.png"
    color: "#4A90E2"

@char Sayori
    name: "Sayori"
    sprite: "sayori/{expression}.png"
    color: "#FF69B4"

// Story Start
== Start ==
scene school_hallway
~ affection = 0

Narrator "Welcome to Inky!"
Sayori "Hi! How are you?"

* Say something nice -> NicePath
* [affection > 5] Be romantic -> RomancePath
* Ignore her -> IgnorePath

== NicePath ==
~ affection += 10
show sayori happy at center
Sayori "That's so sweet!"

{ affection >= 10 }
    Sayori "I really like you!"
    -> GoodEnding

-> End

== End ==
Narrator "Thanks for playing!"
```

See the demo script at `public/inks/demo-school-day.inky` for a complete example.

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development Mode

```bash
# Run the React-based player
npm run dev
```

Then open http://localhost:3000/index.html

### Build for Production

```bash
npm run build
```

## 📖 Documentation

### InkyScript Language

- **[InkyScript Documentation](docs/README.md)** - Complete language documentation
- **[Getting Started Guide](docs/Getting-Started.md)** - Learn InkyScript in 10 minutes
- **[Language Reference](docs/InkyScript-Language-Reference.md)** - Complete syntax guide
- **[Quick Reference](docs/Quick-Reference.md)** - Syntax cheat sheet
- **[Examples](docs/Examples.md)** - Example scripts and patterns

### Engine Documentation

- **[Character System](CHARACTER_SYSTEM.md)** - Character definition and sprite system
- **[Asset Reference](ASSET_REFERENCE.md)** - Asset organization and usage
- **[Project Structure](PROJECT_STRUCTURE.md)** - Codebase architecture
- **[Path Fixes](PATH_FIXES.md)** - Asset path resolution details

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              .inky Script File                   │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│              Lexer (Tokenizer)                   │
│  Converts text → Tokens (Label, Dialogue, etc)  │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│              Parser (AST Builder)                │
│  Converts Tokens → Abstract Syntax Tree (AST)   │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│          StepInterpreter (Runtime)               │
│  Executes AST step-by-step for UI integration   │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│           InkyPlayer (React UI)                  │
│  Renders visual novel with scenes & characters  │
└─────────────────────────────────────────────────┘
```

## 📂 Project Structure

```
Inky/
├── public/
│   ├── inks/                  # InkyScript files
│   │   └── demo-school-day.inky
│   └── assets/
│       ├── backgrounds/       # Scene backgrounds
│       └── characters/        # Character sprites
├── src/
│   ├── core/
│   │   ├── inkyscript/
│   │   │   ├── Lexer.ts       # Tokenizer
│   │   │   ├── Parser.ts      # AST Generator
│   │   │   ├── Interpreter.ts # Basic interpreter
│   │   │   ├── StepInterpreter.ts # UI-integrated interpreter
│   │   │   ├── Runtime.ts     # State management
│   │   │   ├── InkyEngine.ts  # Main engine class
│   │   │   ├── Renderer.ts    # Command renderer
│   │   │   └── types.ts       # Type definitions
│   │   └── UI/
│   │       ├── InkyPlayer.tsx # Main player component
│   │       ├── VisualNovelView.tsx
│   │       ├── DialogueBox.tsx
│   │       ├── ChoiceBox.tsx
│   │       ├── Scene.tsx
│   │       └── Character.tsx
│   └── main.tsx               # React entry point
└── index.html                 # HTML entry point
```

## 🎯 Current Status

### ✅ Completed
- [x] InkyScript DSL specification
- [x] Lexer (Tokenizer) - All patterns working
- [x] Parser (AST Builder) - Complete AST generation
- [x] StepInterpreter - Step-by-step execution for UI
- [x] Runtime - Variable & state management
- [x] Character System - Definitions with attributes
- [x] Sprite System - Dynamic expressions with placeholders
- [x] React UI - Complete visual novel player
- [x] Scene Management - Background rendering
- [x] Dialogue System - Typewriter effect
- [x] Choice System - Interactive branching
- [x] Conditional Logic - Dynamic story flow

### 🚧 Potential Improvements
- [ ] Save/Load System
- [ ] Rollback/History
- [ ] Transitions & Animations
- [ ] Audio System
- [ ] Dev Tools (Debugger, Script Editor)

## 🤝 Contributing

This is a personal learning project built in an afternoon, but feedback and suggestions are welcome!

## 📄 License

MIT License - see LICENSE file for details

## 🎮 Inspiration

Inspired by:
- **Ren'Py** - Visual Novel engine
- **Ink** - Narrative scripting language by Inkle Studios
- **Twine** - Interactive fiction tool

---

**Inky** - *Write Stories, Not Code* ✨

Made with ❤️ using Vite, React, Tailwind CSS, and TypeScript
