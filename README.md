<!--
 Copyright (c) 2025 KibaOfficial

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# Inky - Visual Novel Engine

> A Ren'Py-inspired Visual Novel Engine built with TypeScript and React

## About

**Inky** is a web-based Visual Novel / Narrative Engine with its own scripting language, **InkyScript** (`.inky` files). Write interactive stories with dialogue, choices, variables, conditions, and audio — no programming knowledge required.

## Monorepo Structure

```
Inky/
├── packages/
│   ├── engine/        # @inky/engine — React + Vite player (v1.2.0)
│   └── vscode-ext/    # InkyScript VSCode Extension (v1.1.0)
├── docs/              # InkyScript language documentation
├── package.json       # pnpm workspace root
└── pnpm-workspace.yaml
```

## Quick Start

```bash
pnpm install

pnpm dev          # Start the engine dev server
pnpm build        # Build the engine
pnpm build:ext    # Compile the VSCode extension
```

## InkyScript

```inky
@char Sayori
    name: "Sayori"
    sprite: "sayori/{expression}.png"
    color: "#FF69B4"

== Start ==
scene school_hallway
~ affection = 0

Narrator "Welcome to Inky!"
show sayori happy at center
Sayori "Hi! How are you?"

* Say something nice -> NicePath
* [affection > 5] Be romantic -> RomancePath
* Ignore her -> IgnorePath

== NicePath ==
~ affection += 10
Sayori "That's so sweet!"

{ affection >= 10 }
    Sayori "I really like you!"
    -> GoodEnding
{ else }
    -> NeutralEnding

== GoodEnding ==
Narrator "You made a friend today."
```

See [docs/](docs/) for full language documentation.

## Features

### InkyScript Language
- Labels & Jumps — story sections and navigation
- Dialogue — character conversations with typewriter effect
- Choices — branching decisions, with optional conditions
- Variables — dynamic story state (`=`, `+=`, `-=`, `*=`, `/=`)
- Conditionals — `{ condition }` / `{ else }` blocks
- Logical operators — `&&`, `||`, parentheses, correct precedence
- String interpolation — `{variableName}`, `{Char.attribute}`
- Commands — scene, show, hide, clear, audio
- Character System — sprite templates with `{expression}` placeholder
- Audio System — music and sound effects with fade in/out

### Engine
- Vite 8 + React 19 + TypeScript 5 + Tailwind CSS 4
- Custom Lexer → Parser → Runtime → StepInterpreter pipeline
- Runtime as single source of truth for all story state
- Iterative step execution (no recursion)
- Clean story-end handling

### VSCode Extension
- Syntax highlighting for `.inky` files
- IntelliSense: characters, labels, commands, variables
- `{ else }` completion and hover
- Diagnostics: undefined characters, undefined jump targets
- Go to Definition, Document Outline, Snippets

## Architecture

```
.inky File
    │
    ▼
Lexer (Tokenizer)
    │  text → tokens
    ▼
Parser (AST Builder)
    │  tokens → AST
    ▼
Runtime (Single Source of Truth)
    │  variables, characters, position, stack
    ▼
StepInterpreter (Executor)
    │  iterative node-by-node execution
    ▼
Renderer (Bridge)
    │  AST nodes → VisualNovelState + Audio
    ▼
InkyPlayer (React UI)
    │  scene, dialogue, choices, characters
```

## Documentation

- [Getting Started](docs/Getting-Started.md)
- [Language Reference](docs/InkyScript-Language-Reference.md)
- [Quick Reference](docs/Quick-Reference.md)
- [Examples](docs/Examples.md)

## License

MIT — see [LICENSE](LICENSE)

---

*Inky — Write Stories, Not Code*
