# InkyScript Language Reference

> Complete documentation for the InkyScript visual novel scripting language

## Table of Contents

- [Introduction](#introduction)
- [Basic Concepts](#basic-concepts)
- [Character Definitions](#character-definitions)
- [Labels](#labels)
- [Dialogue](#dialogue)
- [Variables](#variables)
- [Commands](#commands)
- [Choices](#choices)
- [Conditionals](#conditionals)
- [Jumps](#jumps)
- [String Interpolation](#string-interpolation)
- [Comments](#comments)
- [Complete Example](#complete-example)

---

## Introduction

InkyScript is a domain-specific language (DSL) for writing visual novels. It's inspired by Ren'Py and Ink, designed to be simple, readable, and powerful.

### Design Philosophy

- **Write stories, not code** - Natural, readable syntax
- **Type less, express more** - Minimal boilerplate
- **Visual novel focused** - Built-in support for common VN patterns

---

## Basic Concepts

### Script Structure

An InkyScript file (`.inky`) consists of:

1. **Character Definitions** - Define characters at the top
2. **Labels** - Story sections and scenes
3. **Content** - Dialogue, choices, commands, etc.

### Execution Flow

- Stories start at the `Start` label
- Execution proceeds line by line
- Jumps and choices control branching

---

## Character Definitions

Define characters before using them in dialogue.

### Syntax

```inky
@char CharacterName
    attribute: "value"
    attribute: "value"
```

### Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `name` | Display name | `"Sayori"` |
| `sprite` | Image path or template | `"sayori/{expression}.png"` |
| `color` | Character color (hex) | `"#FF69B4"` |

### Examples

**Simple Character**
```inky
@char Narrator
    name: "Narrator"
    color: "#CCCCCC"
```

**Character with Sprite Template**
```inky
@char Sayori
    name: "Sayori"
    sprite: "sayori/{expression}.png"
    color: "#FF69B4"
```

The `{expression}` placeholder allows dynamic sprite switching:
```inky
show sayori happy at center    # Loads: sayori/happy.png
show sayori sad at center      # Loads: sayori/sad.png
```

**Multiple Characters**
```inky
@char MC
    name: "Player"
    sprite: "Player.png"
    color: "#4A90E2"

@char Monika
    name: "Monika"
    sprite: "monika/{expression}.png"
    color: "#22AA22"
```

---

## Labels

Labels define story sections and serve as jump targets.

### Syntax

```inky
== LabelName ==
```

### Rules

- Label names must be unique
- Must start with a letter
- Can contain letters, numbers, underscores
- Case-sensitive

### Examples

```inky
== Start ==
Narrator "This is the start of the story."

== Chapter1 ==
Narrator "Welcome to Chapter 1!"

== BadEnding ==
Narrator "Game Over..."
```

### Special Labels

- `Start` - Entry point of the story (required)

---

## Dialogue

Characters speak using the format: `CharacterName "Text"`

### Syntax

```inky
CharacterName "Dialogue text"
```

### Examples

**Simple Dialogue**
```inky
Sayori "Good morning!"
MC "Hey Sayori, how are you?"
Narrator "They walked to school together."
```

**Multi-line Conversation**
```inky
== MorningScene ==
Sayori "Did you sleep well?"
MC "Yeah, pretty good!"
Sayori "That's great! Let's go to class."
```

---

## Variables

Variables store story state (numbers, strings, booleans).

### Syntax

**Assignment**
```inky
~ variableName = value
```

**Operations**
```inky
~ variableName += value    # Add
~ variableName -= value    # Subtract
~ variableName *= value    # Multiply
~ variableName /= value    # Divide
```

### Value Types

| Type | Examples |
|------|----------|
| Number | `10`, `-5`, `0` |
| String | `"Hello"`, `"Player"` |
| Boolean | `true`, `false` |

### Examples

**Setting Variables**
```inky
~ affection = 0
~ playerName = "Alex"
~ hasKey = false
```

**Arithmetic**
```inky
~ affection += 5
~ coins -= 10
~ score *= 2
```

**Using Variables**
```inky
~ affection = 0
MC "Nice to meet you!"
~ affection += 10

Sayori "You're so kind!"
~ affection += 5
```

---

## Commands

Commands control scenes, characters, and effects.

### Scene Commands

**Change Background**
```inky
scene BackgroundName
```

Examples:
```inky
scene Classroom_Day
scene Beach_Sunset
scene Bedroom_Night
```

### Character Commands

**Show Character**
```inky
show characterName expression at position
```

**Hide Character**
```inky
hide characterName
```

**Positions:** `left`, `center`, `right`

Examples:
```inky
show sayori happy at center
show monika neutral at left
hide sayori
```

### Clear Command

**Clear All Characters**
```inky
clear
```

### Audio Commands (Planned)

```inky
play music "filename.mp3"
play sound "effect.wav"
stop music
```

---

## Choices

Present branching paths to the player.

### Syntax

```inky
* Choice text -> TargetLabel
* Another choice -> AnotherLabel
```

### Examples

**Simple Choices**
```inky
Sayori "Want to have lunch together?"

* Yes, I'd love to -> LunchTogether
* Maybe next time -> Alone
```

**Conditional Choices**
```inky
* [affection >= 10] Ask her out -> Romance
* Be friendly -> Friendship
* Stay quiet -> Neutral
```

Choices with conditions only appear if the condition is true.

**Multiple Choices**
```inky
Narrator "What do you want to do?"

* Go to class -> Classroom
* Visit the library -> Library
* Hang out at cafeteria -> Cafeteria
* Go home early -> Home
```

---

## Conditionals

Execute content based on conditions.

### Syntax

```inky
{ condition }
    content...
    content...
```

### Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `==` | Equal | `affection == 10` |
| `!=` | Not equal | `name != "Alex"` |
| `>` | Greater than | `score > 100` |
| `<` | Less than | `coins < 5` |
| `>=` | Greater or equal | `affection >= 15` |
| `<=` | Less or equal | `level <= 3` |

### Examples

**Simple Conditional**
```inky
{ affection >= 10 }
    Sayori "I really like you!"
    -> GoodEnding
```

**Multiple Conditionals**
```inky
{ affection >= 15 }
    Sayori "I love you!"
    -> BestEnding

{ affection >= 5 }
    Sayori "You're a good friend."
    -> GoodEnding

{ affection < 5 }
    Sayori "See you around."
    -> NormalEnding
```

**Conditionals with Choices**
```inky
{ affection >= 10 }
    Sayori "Want to walk home together?"

    * Sure! -> WalkTogether
    * I have plans -> Decline

{ affection < 10 }
    Narrator "She doesn't seem interested in talking."
    -> EndDay
```

---

## Jumps

Navigate to different labels.

### Syntax

```inky
-> TargetLabel
```

### Examples

**Simple Jump**
```inky
== Start ==
Narrator "The story begins..."
-> Chapter1

== Chapter1 ==
Narrator "Chapter 1 starts here!"
```

**Conditional Jump**
```inky
{ hasKey == true }
    Narrator "You unlock the door."
    -> InsideHouse

{ hasKey == false }
    Narrator "You need a key."
    -> SearchForKey
```

**Jump after Dialogue**
```inky
== MeetSayori ==
Sayori "Let's be friends!"
~ affection += 10
-> NextScene
```

---

## String Interpolation

Insert variable values into text.

### Syntax

```inky
"Text {variableName} more text"
```

### Examples

**Variable in Dialogue**
```inky
~ playerName = "Alex"
Sayori "Hi {playerName}! Nice to meet you!"
```

**Character Attributes**
```inky
Narrator "Her name is {Sayori.name}."
```

**Multiple Variables**
```inky
~ score = 100
~ level = 5
Narrator "Score: {score}, Level: {level}"
```

---

## Comments

Add notes to your script (ignored during execution).

### Syntax

```inky
// This is a comment
```

### Examples

```inky
// Character definitions
@char MC
    name: "Player"

== Start ==
// Morning scene begins
scene Bedroom_Day
Narrator "A new day begins..."  // This shows at the start
```

---

## Complete Example

Here's a full InkyScript example demonstrating all features:

```inky
// Character Definitions
@char MC
    name: "Player"
    sprite: "player.png"
    color: "#4A90E2"

@char Sayori
    name: "Sayori"
    sprite: "sayori/{expression}.png"
    color: "#FF69B4"

@char Narrator
    name: "Narrator"
    color: "#CCCCCC"

// Story Start
== Start ==
scene Bedroom_Day
~ playerName = "Alex"
~ affection = 0

Narrator "You wake up to a sunny morning."
MC "Time to start the day."

scene School_Entrance
show sayori happy at center

Sayori "Good morning, {playerName}!"
MC "Hey Sayori!"

* Be enthusiastic -> Enthusiastic
* Be casual -> Casual

== Enthusiastic ==
~ affection += 10
MC "It's great to see you!"
show sayori happy at center
Sayori "You're so sweet!"
-> SchoolDay

== Casual ==
~ affection += 5
MC "How's it going?"
show sayori neutral at center
Sayori "Pretty good!"
-> SchoolDay

== SchoolDay ==
scene Classroom_Day
hide sayori
Narrator "Classes pass by quickly."

scene School_Hallway
show sayori neutral at left
Sayori "Want to walk home together?"

{ affection >= 10 }
    * Walk together -> WalkTogether
    * Decline politely -> Decline

{ affection < 10 }
    Narrator "She seems distant."
    -> EndDay

== WalkTogether ==
scene Street_Evening
show sayori happy at center
~ affection += 5

Sayori "Today was really fun!"
MC "Yeah, I enjoyed it too."

{ affection >= 15 }
    Sayori "I... I really like you!"
    -> GoodEnding

-> NormalEnding

== Decline ==
~ affection -= 5
MC "Sorry, I have things to do."
show sayori sad at center
Sayori "Oh... okay then."
-> EndDay

== GoodEnding ==
scene Beach_Sunset
show sayori happy at center

Narrator "You spend the evening together watching the sunset."
Sayori "This is perfect."
MC "I couldn't agree more."

Narrator "Affection: {affection}"
Narrator "Good Ending!"
-> Credits

== NormalEnding ==
scene Bedroom_Night
Narrator "You head home alone."
Narrator "Affection: {affection}"
Narrator "Normal Ending"
-> Credits

== EndDay ==
scene Bedroom_Night
Narrator "The day ends quietly."
Narrator "Affection: {affection}"
-> Credits

== Credits ==
clear
scene Black
Narrator "Thank you for playing!"
Narrator "Made with InkyScript"
```

---

## Best Practices

### Organization

1. **Define all characters at the top**
2. **Start label comes first**
3. **Group related scenes together**
4. **Use descriptive label names**

### Naming Conventions

- **Labels:** `PascalCase` (e.g., `MorningScene`, `GoodEnding`)
- **Variables:** `camelCase` (e.g., `playerName`, `affectionLevel`)
- **Commands:** `lowercase` (e.g., `scene`, `show`, `hide`)

### Readability

```inky
// Good: Clear and readable
== Start ==
scene Classroom_Day
show sayori happy at center
Sayori "Hello!"

// Avoid: Too cramped
==Start==
scene Classroom_Day
show sayori happy at center
Sayori "Hello!"
```

### Variable Management

```inky
// Good: Initialize variables early
~ affection = 0
~ playerName = "Alex"

// Good: Use meaningful names
~ hasCompletedQuest = true

// Avoid: Vague names
~ x = true
```

---

## Tips & Tricks

### Dynamic Character Expressions

Use sprite templates for easy expression changes:

```inky
@char Sayori
    sprite: "sayori/{expression}.png"

show sayori happy at center     # sayori/happy.png
show sayori sad at center       # sayori/sad.png
show sayori surprised at center # sayori/surprised.png
```

### Tracking Multiple Stats

```inky
~ affection = 0
~ trust = 0
~ knowledge = 0

{ affection >= 10 && trust >= 5 }
    -> SpecialRoute
```

### Debugging with Narrator

```inky
~ score = 100
Narrator "Debug: Score = {score}"
```

### Fallback Paths

Always provide a fallback for conditionals:

```inky
{ condition1 }
    // Path 1

{ condition2 }
    // Path 2

// Fallback if no conditions match
Narrator "Default path"
```

---

## Error Prevention

### Common Mistakes

❌ **Missing Start Label**
```inky
== Chapter1 ==  // Error: No Start label
```

✅ **Always Include Start**
```inky
== Start ==
-> Chapter1

== Chapter1 ==
```

❌ **Undefined Character**
```inky
Sayori "Hello!"  // Error: Sayori not defined
```

✅ **Define Characters First**
```inky
@char Sayori
    name: "Sayori"

== Start ==
Sayori "Hello!"
```

❌ **Invalid Jump Target**
```inky
-> NonExistentLabel  // Error: Label doesn't exist
```

✅ **Jump to Existing Labels**
```inky
-> Chapter1

== Chapter1 ==
```

---

## Advanced Patterns

### Route System

```inky
~ sayoriRoute = false
~ monikaRoute = false

{ affection >= 15 && sayoriRoute == false }
    ~ sayoriRoute = true
    -> SayoriRoute
```

### State Management

```inky
~ currentDay = 1
~ timeOfDay = "morning"

{ currentDay == 1 && timeOfDay == "morning" }
    scene Classroom_Morning
```

### Complex Conditionals

```inky
{ (affection >= 10 && hasKey == true) || trust >= 20 }
    Narrator "You unlock the secret ending."
    -> SecretEnding
```

---

## Language Grammar (EBNF)

For developers interested in the formal grammar:

```ebnf
script          = { character_def | label }
character_def   = "@char" identifier { attribute }
attribute       = identifier ":" string
label           = "==" identifier "=="
statement       = dialogue | variable | command | choice | conditional | jump | comment
dialogue        = identifier string
variable        = "~" identifier ( "=" | "+=" | "-=" | "*=" | "/=" ) expression
command         = ("scene" | "show" | "hide" | "clear" | ...) arguments
choice          = "*" [ "[" condition "]" ] string "->" identifier
conditional     = "{" condition "}" { statement }
jump            = "->" identifier
comment         = "//" text
```

---

## Further Reading

- [InkyScript Getting Started Guide](./Getting-Started.md)
- [Examples Collection](./Examples.md)
- [API Reference](./API-Reference.md)
- [Asset Management Guide](../ASSET_REFERENCE.md)

---

**InkyScript** - Write Stories, Not Code ✨
