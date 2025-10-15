# Getting Started with InkyScript

> Learn to write your first visual novel with InkyScript in 10 minutes

## What You'll Build

By the end of this guide, you'll have created a simple visual novel with:
- Multiple characters
- Branching dialogue choices
- Variable tracking (affection system)
- Multiple endings

## Prerequisites

- Basic text editing skills
- Understanding of visual novel concepts (dialogue, choices, branching)

## Step 1: Create Your Script File

Create a new file with the `.inky` extension:

```
my-first-story.inky
```

## Step 2: Define Your Characters

Every InkyScript story starts with character definitions. Add these at the top of your file:

```inky
@char MC
    name: "You"
    color: "#4A90E2"

@char Friend
    name: "Your Friend"
    sprite: "friend/{expression}.png"
    color: "#FF69B4"

@char Narrator
    name: "Narrator"
    color: "#CCCCCC"
```

### Character Attributes Explained

- **name**: How the character appears in the UI
- **sprite**: Path to character image (use `{expression}` for dynamic expressions)
- **color**: Character's text color in hex format

## Step 3: Start Your Story

Every story needs a `Start` label. This is where execution begins:

```inky
== Start ==
scene Park_Day

Narrator "It's a beautiful sunny day at the park."
```

The `scene` command changes the background image.

## Step 4: Add Dialogue

Make your characters talk:

```inky
== Start ==
scene Park_Day

Narrator "It's a beautiful sunny day at the park."
MC "What a nice day!"

show friend happy at center
Friend "Hey! Want to hang out?"
```

### Dialogue Syntax

```inky
CharacterName "What they say"
```

## Step 5: Track State with Variables

Use variables to track story progress:

```inky
== Start ==
~ affection = 0
~ playerName = "Alex"

scene Park_Day

Narrator "It's a beautiful sunny day at the park."
Friend "Hi {playerName}!"
```

### Variable Operations

```inky
~ affection = 0      # Set to 0
~ affection += 5     # Add 5
~ affection -= 3     # Subtract 3
```

## Step 6: Add Player Choices

Let the player make decisions:

```inky
== Start ==
~ affection = 0

scene Park_Day
show friend neutral at center

Friend "Want to grab some ice cream?"

* "Sure, I'd love to!" -> IceCream
* "Maybe later." -> Decline
```

Each choice leads to a different label using `->`.

## Step 7: Create Choice Outcomes

Define what happens for each choice:

```inky
== IceCream ==
~ affection += 10

scene IceCreamShop
show friend happy at center

Friend "This is so fun!"
MC "Yeah, I'm having a great time!"

-> Continue

== Decline ==
~ affection -= 5

show friend sad at center
Friend "Oh... okay then."

-> Continue
```

## Step 8: Use Conditionals

Make the story react to variables:

```inky
== Continue ==
scene Park_Sunset

{ affection >= 10 }
    show friend happy at center
    Friend "I had an amazing time with you!"
    -> GoodEnding

{ affection < 10 }
    show friend neutral at center
    Friend "Well, see you around."
    -> NormalEnding
```

### Conditional Syntax

```inky
{ condition }
    content if true...
```

## Step 9: Create Multiple Endings

Add different endings based on player choices:

```inky
== GoodEnding ==
scene Park_Night
show friend happy at center

Friend "I'm so glad we're friends!"
MC "Me too!"

Narrator "You became best friends!"
Narrator "Affection: {affection}"
-> Credits

== NormalEnding ==
scene Park_Night

Narrator "You went your separate ways."
Narrator "Affection: {affection}"
-> Credits

== Credits ==
clear
Narrator "The End"
Narrator "Thanks for playing!"
```

## Complete Script

Here's your complete first story:

```inky
// Character Definitions
@char MC
    name: "You"
    color: "#4A90E2"

@char Friend
    name: "Your Friend"
    sprite: "friend/{expression}.png"
    color: "#FF69B4"

@char Narrator
    name: "Narrator"
    color: "#CCCCCC"

// Story Start
== Start ==
~ affection = 0
~ playerName = "Alex"

scene Park_Day

Narrator "It's a beautiful sunny day at the park."
MC "What a nice day!"

show friend happy at center
Friend "Hey {playerName}! Want to grab some ice cream?"

* "Sure, I'd love to!" -> IceCream
* "Maybe later." -> Decline

== IceCream ==
~ affection += 10

scene IceCreamShop
show friend happy at center

Friend "This is so fun!"
MC "Yeah, I'm having a great time!"

-> Continue

== Decline ==
~ affection -= 5

show friend sad at center
Friend "Oh... okay then."

-> Continue

== Continue ==
scene Park_Sunset

{ affection >= 10 }
    show friend happy at center
    Friend "I had an amazing time with you!"
    -> GoodEnding

{ affection < 10 }
    show friend neutral at center
    Friend "Well, see you around."
    -> NormalEnding

== GoodEnding ==
scene Park_Night
show friend happy at center

Friend "I'm so glad we're friends!"
MC "Me too!"

Narrator "You became best friends!"
Narrator "Affection: {affection}"
-> Credits

== NormalEnding ==
scene Park_Night

Narrator "You went your separate ways."
Narrator "Affection: {affection}"
-> Credits

== Credits ==
clear
Narrator "The End"
Narrator "Thanks for playing!"
```

## Running Your Story

1. Save your `.inky` file to `public/inks/`
2. Run the development server: `npm run dev:react`
3. Open the browser and load your story!

## Next Steps

Now that you've created your first story, learn more:

- [InkyScript Language Reference](./InkyScript-Language-Reference.md) - Complete syntax guide
- [Quick Reference](./Quick-Reference.md) - Syntax cheat sheet
- [Examples](./Examples.md) - More example stories

## Tips for Beginners

### 1. Plan Your Story First

Before coding, sketch out:
- Your characters
- Main story branches
- Key decision points
- Possible endings

### 2. Use Comments Liberally

```inky
// --- Morning Scene ---
== Morning ==
scene Bedroom_Day
// Player wakes up
Narrator "A new day begins."
```

### 3. Test Frequently

Run your story often to catch errors early.

### 4. Start Simple

Don't try to build a complex branching story immediately. Start with:
- 2-3 characters
- Linear story with one branch
- Simple variable tracking

### 5. Learn by Example

Check out the demo story at `public/inks/demo-school-day.inky` to see more patterns.

## Common Mistakes

### ❌ Forgetting the Start Label

```inky
== Chapter1 ==  // Error: No Start label
```

### ✅ Always Include Start

```inky
== Start ==
-> Chapter1

== Chapter1 ==
```

### ❌ Character Not Defined

```inky
Bob "Hello!"  // Error: Bob not defined
```

### ✅ Define Characters First

```inky
@char Bob
    name: "Bob"

== Start ==
Bob "Hello!"
```

### ❌ Jump to Non-existent Label

```inky
-> Chapter99  // Error: Label doesn't exist
```

### ✅ Jump to Existing Labels

```inky
-> Chapter1

== Chapter1 ==
```

## Getting Help

- Check the [Language Reference](./InkyScript-Language-Reference.md) for syntax details
- Look at [example stories](./Examples.md)
- Review the demo at `public/inks/demo-school-day.inky`

---

**Congratulations!** You've written your first InkyScript story! 🎉
