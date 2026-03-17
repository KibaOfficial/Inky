<!--
 Copyright (c) 2025 KibaOfficial

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# Changelog

## [1.2.0] - 2026-03-17

### Added
- **`{ else }` support** - Conditional blocks now support an optional else branch
  ```inky
  { affection >= 10 }
      Sayori "I really like you!"
  { else }
      Sayori "Nice to meet you."
  ```
- **Logical operators in conditions** - `&&` (and) and `||` (or) with correct precedence
  ```inky
  { affection >= 10 && knowsSecret == true }
  { trust >= 5 || isOldFriend == true }
  ```
- **Parentheses in conditions** - Group expressions for complex logic
  ```inky
  { (affection >= 10 && knowsSecret) || trust >= 20 }
  ```

### Changed
- **Runtime is now the Single Source of Truth** - `currentLabel`, `currentNodeIndex`, and `executionStack` all live in `Runtime`. `StepInterpreter` is now a pure executor/cursor with no duplicated state.
- **`StepInterpreter.step()` is now iterative** - No more recursion for silent nodes (Variable, Command, Jump, Condition). The internal loop runs until a UI-relevant node (Dialogue, Choice) or story end is reached.
- **`InkyPlayer.advance()` is now iterative** - Commands are processed inline in a loop, no recursive `executeNextStep` calls.
- **Condition evaluator rebuilt as recursive-descent parser** - Correct `||` → `&&` → comparison precedence, parentheses support. Replaces the fragile `split()`-based approach.
- **Story end is now handled cleanly** - `storyEnded` state in `InkyPlayer` disables Continue button and shows "— The End —". No more "Not running. Call start() first." warnings on extra clicks.
- **`InkyEngine` is now browser-only** - Removed `fs` and `path` Node.js imports. `loadScriptFromFile()` removed; use `loadScriptFromUrl()` or `loadScript()`.
- **Monorepo structure** - Engine and VSCode extension are now in `packages/engine` and `packages/vscode-ext` under a pnpm workspace.
- **All packages updated to latest versions** - Vite 8, `@vitejs/plugin-react` 6, React 19.2.4, Tailwind 4.2, TypeScript 5.9.

### Fixed
- `executionStack` is now cleared on `runtime.jump()` — nested condition frames can no longer leak across label boundaries.
- `{ else }` following a condition with a Jump no longer causes index drift.

---

## [1.1.0] - 2025-10-17

### Added
- **Audio System**: Full audio support for music and sound effects
  - `AudioManager` class for managing audio playback
  - `play music <filename> [loop] [fadein <duration>]` command
  - `play sound <filename>` command
  - `stop music [fadeout <duration>]` command
  - `pause music` and `resume music` commands
  - Fade-in and fade-out effects with configurable duration
  - Audio caching for better performance
  - Support for multiple simultaneous sound effects

### Changed
- **Lexer**: Command arguments now parsed as `string[]` instead of `string`
- **Types**: Updated `CommandNode.args` type from `string` to `string[]`
- **Renderer**: Refactored command processing for array-based arguments

### Fixed
- Parser bug where Jumps and Choices inside Conditional blocks were not included in `thenNodes`
- Regex operator precedence issue: `>=` and `<=` now matched before `>` and `<`

---

## [1.1.0] - 2025-10-21

### Added
- `stop sound [fadeout <duration>]` command
- Active sound tracking and automatic cleanup

### Changed
- **UI**: Redesigned Choices component with gradient styling
- **Renderer**: Dialogue persists when choices are displayed (`lastDialogue`)

### Fixed
- Choices box positioning and transparency issues
- Dialogue box disappearing when choices appeared

---

## [1.0.0] - 2025-10-01

- Initial release of InkyScript Visual Novel Engine
