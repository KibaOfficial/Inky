<!--
 Copyright (c) 2025 KibaOfficial
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# Changelog

## [1.1.0]

- 17.10.2025

### Added
- **Audio System**: Full audio support for music and sound effects
  - `AudioManager` class for managing audio playback
  - `play music <filename> [loop] [fadein <duration>]` command
  - `play sound <filename>` command
  - `stop music [fadeout <duration>]` command
  - `pause music` and `resume music` commands (not yet exposed in InkyScript)
  - Fade-in and fade-out effects with configurable duration
  - Audio caching for better performance
  - Support for multiple simultaneous sound effects

### Changed
- **Lexer**: Command arguments now parsed as `string[]` instead of `string`
  - Improved argument handling for all commands
  - Better support for multi-argument commands
- **Types**: Updated `CommandNode.args` type from `string` to `string[]`
- **Renderer**: Refactored command processing to work with array-based arguments
  - Improved audio path resolution (`/music/` and `/sounds/` folders)

### Fixed
- Parser bug where Jumps and Choices inside Conditional blocks were not included in `thenNodes`
- Regex operator precedence issue: `>=` and `<=` now matched before `>` and `<` in conditions


- 21.10.2025

### Added
- **Audio System Extensions**:
  - `stop sound [fadeout <duration>]` command to stop all active sound effects
  - Active sound tracking for better sound management
  - Automatic cleanup of finished sound effects

### Changed
- **UI Improvements**:
  - Redesigned Choices component with modern gradient styling
  - Choices now display above dialogue box with transparent overlay
  - Removed redundant "What do you want to do?" title
  - Improved button hover effects with scale and glow
  - Better spacing and visual hierarchy
- **Renderer**: 
  - Dialogue now persists when choices are displayed (stored in `lastDialogue`)
  - Improved visual state management for choice scenarios

### Fixed
- Choices box positioning and transparency issues
- Dialogue box disappearing when choices appeared
