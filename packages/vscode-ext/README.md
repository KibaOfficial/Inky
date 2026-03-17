# InkyScript Language Support for Visual Studio Code

Rich language support for InkyScript (`.inky`) files — a domain-specific language for creating visual novels with the [Inky Engine](https://github.com/kibaofficial/Inky).

## Features

### Syntax Highlighting
Full highlighting for all InkyScript constructs: character definitions, labels, dialogue, variables, commands, choices, conditionals, jumps, and string interpolation.

### IntelliSense & Auto-completion
- Character names in dialogue
- Label names after `->` (only defined labels)
- Commands (`scene`, `show`, `hide`, `play`, `stop`, `pause`, ...)
- Positions (`left`, `center`, `right`) after `at`
- Audio types after `play`
- Variable names in string interpolation `{...}`
- Character attributes (`{Char.name}`, `{Char.color}`, `{Char.sprite}`)
- `{ else }` block after conditionals

### Code Snippets

| Prefix | Description |
|--------|-------------|
| `char` | Character definition |
| `charexp` | Character with expression template |
| `label` | New label |
| `start` | Start label boilerplate |
| `dia` | Dialogue line |
| `scene` | Scene change |
| `show` | Show character |
| `hide` | Hide character |
| `var` | Variable assignment |
| `inc` | Variable increment |
| `choice` | Single choice |
| `choices` | Multiple choices |
| `choiceif` | Conditional choice |
| `if` | Conditional block |
| `ifelse` | If/else block |
| `jump` | Jump to label |
| `music` | Play music |
| `sound` | Play sound |
| `stopmusic` | Stop music |
| `affection` | Affection system template |

### Hover Documentation
Hover over any element for inline docs with syntax and examples: commands, labels, characters, variables, conditionals, jumps, and string interpolation.

### Go to Definition
`Ctrl/Cmd+Click` on:
- Label names in jumps → jump to label definition
- Character names in dialogue → jump to `@char` definition
- Variables → jump to first assignment

### Document Outline
View Characters, Labels, and Variables organized in the outline panel for quick navigation.

### Validation (Diagnostics)
- Missing `Start` label
- Undefined characters in dialogue (with quick-fix hint)
- Jump targets (`->`) pointing to undefined labels
- Choice targets pointing to undefined labels

## Syntax Examples

### Character Definition
```inky
@char Sayori
    name: "Sayori"
    sprite: "sayori/{expression}.png"
    color: "#FF69B4"
```

### Dialogue & Choices
```inky
Sayori "Walk home together?"

* Sure! -> WalkTogether
* [affection >= 5] Hold her hand -> HoldHands
* Maybe later -> Decline
```

### Variables & Conditionals
```inky
~ affection = 0
~ affection += 10

{ affection >= 10 }
    Sayori "You're so kind!"
    -> GoodPath
{ else }
    Sayori "Nice to meet you."
    -> NeutralPath
```

### Logical Operators
```inky
{ affection >= 10 && knowsSecret == true }
    Sayori "I trust you completely."

{ trust >= 5 || isOldFriend == true }
    Sayori "Good to see you again!"
```

### Commands & Audio
```inky
scene Beach_Sunset
show sayori happy at center
play music theme.mp3 loop fadein 2000
stop music fadeout 1000
play sound door.wav 0.5
hide sayori
clear
```

### String Interpolation
```inky
Narrator "Welcome, {playerName}!"
Sayori "My name is {Sayori.name}."
```

## Requirements

- Visual Studio Code 1.74.0 or higher

## Release Notes

### 1.1.0
- `{ else }` completion, hover, and syntax highlighting
- Jump/choice target validation in diagnostics
- Fixed command keywords (`scene`, `show`, etc.) being flagged as undefined characters
- Fixed string interpolation completions only appearing inside quoted strings
- Fixed `getDefinedVariables` regex matching `==` incorrectly
- Improved hover docs with code examples for all elements
- Updated to TypeScript 5 / ES2022

### 1.0.0
- Initial release: syntax highlighting, IntelliSense, snippets, hover, Go to Definition, outline, basic validation

## License

MIT — see [LICENSE](./LICENSE)

---

**Enjoy writing visual novels with InkyScript!**
