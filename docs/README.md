# InkyScript Documentation

> Complete documentation for the InkyScript visual novel scripting language

## Welcome to InkyScript!

InkyScript is a simple, powerful scripting language for creating visual novels. Whether you're a writer wanting to tell interactive stories or a developer building narrative games, InkyScript makes it easy to bring your ideas to life.

## Documentation Index

### Getting Started

- **[Getting Started Guide](./Getting-Started.md)** - Learn to write your first story in 10 minutes
- **[Quick Reference](./Quick-Reference.md)** - Syntax cheat sheet for quick lookups

### Language Documentation

- **[Language Reference](./InkyScript-Language-Reference.md)** - Complete syntax and feature documentation
- **[Examples](./Examples.md)** - Collection of example scripts and patterns

### Project Documentation

- **[Character System](../CHARACTER_SYSTEM.md)** - Character definitions and sprite system
- **[Asset Reference](../ASSET_REFERENCE.md)** - Asset organization and management
- **[Project Structure](../PROJECT_STRUCTURE.md)** - Codebase architecture

## Quick Links

### For Writers

👉 Start here: [Getting Started Guide](./Getting-Started.md)

Learn to write stories without programming knowledge. The guide covers:
- Character definitions
- Writing dialogue
- Creating choices
- Branching narratives
- Multiple endings

### For Developers

👉 Start here: [Language Reference](./InkyScript-Language-Reference.md)

Comprehensive documentation of InkyScript syntax, including:
- Formal grammar
- Type system
- Command reference
- API integration

### Need Help?

- 📖 Check the [Examples](./Examples.md) for common patterns
- 🔍 Use the [Quick Reference](./Quick-Reference.md) for syntax lookup
- 📝 Study the demo at `public/inks/demo-school-day.inky`

## Language Overview

### What is InkyScript?

InkyScript is a domain-specific language (DSL) designed specifically for visual novels. It features:

- **Natural syntax** - Reads like a screenplay
- **Character-first design** - Built-in character system with sprites
- **Branching narratives** - Powerful choice and conditional systems
- **State management** - Variable tracking for story progression
- **Scene control** - Commands for backgrounds, characters, and effects

### Example Story

```inky
@char Sayori
    name: "Sayori"
    sprite: "sayori/{expression}.png"
    color: "#FF69B4"

== Start ==
~ affection = 0

scene Park_Day
show sayori happy at center

Sayori "Want to hang out?"

* "Sure!" -> HangOut
* "Maybe later." -> Decline

== HangOut ==
~ affection += 10
show sayori happy at center

Sayori "Yay! This is fun!"

{ affection >= 10 }
    Sayori "You're amazing!"
    -> GoodEnding
```

## Core Features

### 1. Character System

Define characters with attributes:

```inky
@char CharacterName
    name: "Display Name"
    sprite: "path/{expression}.png"
    color: "#HexColor"
```

### 2. Dialogue

Natural dialogue syntax:

```inky
Character "What they say"
```

### 3. Variables

Track story state:

```inky
~ variable = value
~ variable += 5
```

### 4. Choices

Player decisions:

```inky
* Choice text -> Label
* [condition] Conditional choice -> Label
```

### 5. Conditionals

Branching logic:

```inky
{ condition }
    content...
```

### 6. Commands

Scene control:

```inky
scene Background
show character expression at position
hide character
```

## Documentation Structure

```
docs/
├── README.md                           # This file
├── Getting-Started.md                  # Tutorial for beginners
├── Quick-Reference.md                  # Syntax cheat sheet
├── InkyScript-Language-Reference.md    # Complete language documentation
└── Examples.md                         # Example scripts and patterns
```

## Learning Path

### 1. **Complete Beginner**

1. Read [Getting Started](./Getting-Started.md)
2. Follow the tutorial to create your first story
3. Experiment with the examples in the guide

### 2. **Want to Learn More**

1. Browse [Examples](./Examples.md) for different patterns
2. Study the [Quick Reference](./Quick-Reference.md)
3. Read sections of the [Language Reference](./InkyScript-Language-Reference.md) as needed

### 3. **Advanced User**

1. Read the complete [Language Reference](./InkyScript-Language-Reference.md)
2. Study the demo at `public/inks/demo-school-day.inky`
3. Explore advanced patterns in [Examples](./Examples.md)

## Common Use Cases

### Visual Novels

InkyScript is perfect for traditional visual novels with:
- Character dialogue and portraits
- Branching story paths
- Multiple endings
- Relationship/affection systems

### Interactive Fiction

Create text-based adventures with:
- Inventory systems
- Quest tracking
- Stat management
- Complex conditionals

### Dating Sims

Build relationship games with:
- Character route systems
- Affection tracking
- Time-based events
- Multiple romance options

### Educational Stories

Make interactive learning experiences:
- Branching scenarios
- Choice-based learning
- Progress tracking
- Adaptive narratives

## Best Practices

### 1. **Plan Before Writing**

Sketch out your story structure:
- Characters and their relationships
- Major decision points
- Story branches
- Possible endings

### 2. **Use Meaningful Names**

```inky
// Good
~ playerTrustLevel = 0
~ hasCompletedQuest = false

// Avoid
~ x = 0
~ flag = false
```

### 3. **Comment Your Code**

```inky
// --- Chapter 1: The Beginning ---
== Chapter1 ==

// Morning scene
scene Bedroom_Morning
```

### 4. **Test All Paths**

Play through your story with different choices to ensure all branches work correctly.

### 5. **Keep It Simple**

Start with a simple linear story, then add complexity gradually.

## Language Features by Version

### Current Version: 1.0

✅ **Implemented**
- Character definitions with attributes
- Labels and jumps
- Dialogue system
- Variables (numbers, strings, booleans)
- Commands (scene, show, hide, clear)
- Choices with conditions
- Conditionals with operators
- String interpolation
- Comments

🚧 **Planned for Future**
- Audio commands (play, stop)
- Transitions and effects
- Save/load system
- Rollback/history
- Advanced expressions

## Contributing to Documentation

Found a mistake or want to improve the docs? Documentation is written in Markdown and lives in the `docs/` directory.

## Additional Resources

- **Main README**: [../README.md](../README.md)
- **Character System**: [../CHARACTER_SYSTEM.md](../CHARACTER_SYSTEM.md)
- **Asset Management**: [../ASSET_REFERENCE.md](../ASSET_REFERENCE.md)
- **Project Structure**: [../PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md)

---

**Ready to start writing?** Head to the [Getting Started Guide](./Getting-Started.md)!

**Need quick syntax help?** Check the [Quick Reference](./Quick-Reference.md)!

**Want complete details?** Read the [Language Reference](./InkyScript-Language-Reference.md)!

---

*InkyScript - Write Stories, Not Code* ✨
