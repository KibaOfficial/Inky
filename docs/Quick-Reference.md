# InkyScript Quick Reference

> Quick syntax reference for InkyScript

## Character Definition

```inky
@char CharacterName
    name: "Display Name"
    sprite: "path/to/sprite.png"
    color: "#HexColor"
```

## Labels

```inky
== LabelName ==
```

## Dialogue

```inky
CharacterName "What they say"
```

## Variables

```inky
~ variable = value          # Set
~ variable += 5             # Add
~ variable -= 3             # Subtract
~ variable *= 2             # Multiply
~ variable /= 2             # Divide
```

## Commands

```inky
scene BackgroundName                    # Change background
show character expression at position   # Show character
hide character                          # Hide character
clear                                   # Clear all characters
```

### Positions
- `left`
- `center`
- `right`

## Choices

```inky
* Choice text -> TargetLabel
* [condition] Conditional choice -> Label
```

## Conditionals

```inky
{ condition }
    content...
```

### Operators
- `==` Equal
- `!=` Not equal
- `>` Greater than
- `<` Less than
- `>=` Greater or equal
- `<=` Less or equal

## Jumps

```inky
-> TargetLabel
```

## String Interpolation

```inky
"Text with {variableName}"
"Access attribute: {Character.name}"
```

## Comments

```inky
// Single line comment
```

## Complete Example

```inky
@char Sayori
    name: "Sayori"
    sprite: "sayori/{expression}.png"
    color: "#FF69B4"

== Start ==
scene Classroom
~ affection = 0

Sayori "Hello!"

* Be nice -> Nice
* Be mean -> Mean

== Nice ==
~ affection += 10
Sayori "You're sweet!"
-> End

== Mean ==
~ affection -= 5
Sayori "That's rude..."
-> End

== End ==
{ affection >= 10 }
    Sayori "Let's be friends!"

Narrator "The end."
```
