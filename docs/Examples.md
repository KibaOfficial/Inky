# InkyScript Examples

> Collection of example scripts demonstrating various patterns and techniques

## Table of Contents

- [Hello World](#hello-world)
- [Simple Conversation](#simple-conversation)
- [Branching Choices](#branching-choices)
- [Affection System](#affection-system)
- [Multiple Stat Tracking](#multiple-stat-tracking)
- [Complex Conditionals](#complex-conditionals)
- [Route System](#route-system)
- [Time-Based Events](#time-based-events)
- [Inventory System](#inventory-system)
- [Quest System](#quest-system)

---

## Hello World

The simplest possible InkyScript story:

```inky
@char Narrator
    name: "Narrator"
    color: "#CCCCCC"

== Start ==
Narrator "Hello, World!"
Narrator "Welcome to InkyScript!"
```

---

## Simple Conversation

A basic two-character conversation:

```inky
@char Alice
    name: "Alice"
    sprite: "alice.png"
    color: "#FF69B4"

@char Bob
    name: "Bob"
    sprite: "bob.png"
    color: "#4A90E2"

== Start ==
scene CoffeeShop

Alice "Hey Bob, how are you?"
Bob "I'm doing great! How about you?"
Alice "Pretty good, thanks for asking!"
Bob "Want to grab some coffee?"
Alice "Sure, that sounds nice!"
```

---

## Branching Choices

Story with multiple branching paths:

```inky
@char MC
    name: "You"
    color: "#4A90E2"

@char Guide
    name: "Guide"
    sprite: "guide/{expression}.png"
    color: "#22AA22"

== Start ==
scene Crossroads

show guide neutral at center
Guide "You've reached a crossroads. Where will you go?"

* Take the forest path -> Forest
* Take the mountain path -> Mountain
* Take the coastal path -> Coast

== Forest ==
scene Forest
show guide happy at center

Guide "The forest is peaceful and green."
MC "It's beautiful here."

-> End

== Mountain ==
scene Mountain
show guide surprised at center

Guide "The mountain path is steep!"
MC "This is challenging!"

-> End

== Coast ==
scene Beach
show guide happy at center

Guide "The ocean breeze is refreshing!"
MC "I love the sea!"

-> End

== End ==
Guide "Your journey ends here."
Narrator "Thanks for playing!"
```

---

## Affection System

Track relationship progress:

```inky
@char MC
    name: "Player"
    color: "#4A90E2"

@char Love
    name: "Love Interest"
    sprite: "love/{expression}.png"
    color: "#FF1493"

@char Narrator
    name: "Narrator"
    color: "#CCCCCC"

== Start ==
~ affection = 0
scene Park

show love neutral at center
Love "Oh, hi there!"

* Compliment them -> Compliment
* Ignore them -> Ignore

== Compliment ==
~ affection += 10
show love happy at center

MC "You look great today!"
Love "Aww, thank you so much!"

-> CheckAffection

== Ignore ==
~ affection -= 5
show love sad at center

MC "..."
Love "Um... okay then."

-> CheckAffection

== CheckAffection ==
scene Park_Sunset

{ affection >= 10 }
    show love happy at center
    Love "I really enjoy spending time with you!"
    MC "Me too!"
    -> HighAffection

{ affection < 10 }
    show love neutral at center
    Love "Well, see you around."
    -> LowAffection

== HighAffection ==
Narrator "Your relationship blossomed!"
Narrator "Affection Level: {affection}"
-> End

== LowAffection ==
Narrator "They seemed distant."
Narrator "Affection Level: {affection}"
-> End

== End ==
clear
Narrator "The End"
```

---

## Multiple Stat Tracking

Track multiple character stats:

```inky
@char MC
    name: "Hero"
    color: "#FFD700"

@char Trainer
    name: "Trainer"
    sprite: "trainer.png"
    color: "#FF4500"

== Start ==
~ strength = 10
~ intelligence = 10
~ charisma = 10

scene TrainingGround
show trainer neutral at center

Trainer "What do you want to train today?"

* Build strength -> TrainStrength
* Study magic -> TrainIntelligence
* Practice speech -> TrainCharisma

== TrainStrength ==
~ strength += 5
Trainer "Your muscles grow stronger!"
MC "I feel powerful!"
-> ShowStats

== TrainIntelligence ==
~ intelligence += 5
Trainer "Your mind expands!"
MC "I understand now!"
-> ShowStats

== TrainCharisma ==
~ charisma += 5
Trainer "Your charm increases!"
MC "People like me more!"
-> ShowStats

== ShowStats ==
Narrator "--- Your Stats ---"
Narrator "Strength: {strength}"
Narrator "Intelligence: {intelligence}"
Narrator "Charisma: {charisma}"

{ strength >= 20 }
    Narrator "You're incredibly strong!"

{ intelligence >= 20 }
    Narrator "You're incredibly smart!"

{ charisma >= 20 }
    Narrator "You're incredibly charming!"

-> End

== End ==
Trainer "Training complete!"
```

---

## Complex Conditionals

Multiple conditions and logical operators:

```inky
@char MC
    name: "Player"
    color: "#4A90E2"

@char Guard
    name: "Guard"
    sprite: "guard.png"
    color: "#8B0000"

== Start ==
~ hasKey = true
~ goldCoins = 50
~ reputation = 15

scene CastleGate
show guard neutral at center

Guard "Halt! Who goes there?"

{ hasKey == true && reputation >= 10 }
    Guard "Ah, you have the royal key! Enter freely."
    -> EnterCastle

{ goldCoins >= 100 }
    Guard "Your gold is payment enough. Welcome."
    ~ goldCoins -= 100
    -> EnterCastle

{ reputation >= 20 }
    Guard "Your reputation precedes you. Go ahead."
    -> EnterCastle

// Default/fallback
Guard "You cannot enter!"
-> Rejected

== EnterCastle ==
scene CastleHall
Narrator "You enter the grand castle hall."
-> End

== Rejected ==
Guard "Come back when you're worthy!"
-> End

== End ==
Narrator "End of demo."
```

---

## Route System

Character-specific story routes:

```inky
@char MC
    name: "Player"
    color: "#4A90E2"

@char Alice
    name: "Alice"
    sprite: "alice/{expression}.png"
    color: "#FF69B4"

@char Bob
    name: "Bob"
    sprite: "bob/{expression}.png"
    color: "#1E90FF"

== Start ==
~ aliceRoute = false
~ bobRoute = false
~ aliceAffection = 0
~ bobAffection = 0

scene School

show alice neutral at left
show bob neutral at right

Alice "Want to study together?"
Bob "Or we could play basketball?"

* Study with Alice -> StudyWithAlice
* Play with Bob -> PlayWithBob

== StudyWithAlice ==
~ aliceAffection += 10
~ aliceRoute = true

hide bob
show alice happy at center

Alice "Thanks for helping me!"
MC "Anytime!"

-> RouteCheck

== PlayWithBob ==
~ bobAffection += 10
~ bobRoute = true

hide alice
show bob happy at center

Bob "Nice shot!"
MC "You too!"

-> RouteCheck

== RouteCheck ==
{ aliceRoute == true }
    -> AliceEnding

{ bobRoute == true }
    -> BobEnding

== AliceEnding ==
scene Library
show alice happy at center

Alice "I'm so glad we're close!"
Narrator "Alice Route - Complete!"
-> End

== BobEnding ==
scene Gym
show bob happy at center

Bob "You're my best friend!"
Narrator "Bob Route - Complete!"
-> End

== End ==
clear
Narrator "Thanks for playing!"
```

---

## Time-Based Events

Simulate day/time progression:

```inky
@char MC
    name: "Player"
    color: "#4A90E2"

@char Narrator
    name: "Narrator"
    color: "#CCCCCC"

== Start ==
~ currentDay = 1
~ timeOfDay = "morning"

-> Morning

== Morning ==
{ currentDay == 1 }
    scene Bedroom_Morning
    Narrator "Day {currentDay} - Morning"
    MC "Time to start the day!"
    ~ timeOfDay = "afternoon"
    -> Afternoon

== Afternoon ==
{ currentDay == 1 }
    scene School_Afternoon
    Narrator "Day {currentDay} - Afternoon"
    MC "Classes are done."
    ~ timeOfDay = "evening"
    -> Evening

== Evening ==
{ currentDay == 1 }
    scene Home_Evening
    Narrator "Day {currentDay} - Evening"
    MC "Time to rest."
    ~ timeOfDay = "night"
    -> Night

== Night ==
scene Bedroom_Night
Narrator "Day {currentDay} - Night"
MC "Another day done."

{ currentDay < 3 }
    ~ currentDay += 1
    ~ timeOfDay = "morning"
    Narrator "Next day begins..."
    -> Morning

-> End

== End ==
Narrator "Three days have passed."
Narrator "End of demo."
```

---

## Inventory System

Track collected items:

```inky
@char MC
    name: "Adventurer"
    color: "#FFD700"

@char Merchant
    name: "Merchant"
    sprite: "merchant.png"
    color: "#8B4513"

== Start ==
~ hasKey = false
~ hasSword = false
~ hasPotion = false
~ gold = 100

scene TownSquare
show merchant neutral at center

Merchant "Welcome! What would you like to buy?"

* Buy Key (50 gold) -> BuyKey
* Buy Sword (80 gold) -> BuySword
* Buy Potion (30 gold) -> BuyPotion
* Check inventory -> Inventory

== BuyKey ==
{ gold >= 50 }
    ~ gold -= 50
    ~ hasKey = true
    Merchant "Here's your key!"
    -> Inventory

{ gold < 50 }
    Merchant "Not enough gold!"
    -> Start

== BuySword ==
{ gold >= 80 }
    ~ gold -= 80
    ~ hasSword = true
    Merchant "A fine blade!"
    -> Inventory

{ gold < 80 }
    Merchant "Not enough gold!"
    -> Start

== BuyPotion ==
{ gold >= 30 }
    ~ gold -= 30
    ~ hasPotion = true
    Merchant "This will heal you!"
    -> Inventory

{ gold < 30 }
    Merchant "Not enough gold!"
    -> Start

== Inventory ==
Narrator "--- Inventory ---"
Narrator "Gold: {gold}"

{ hasKey == true }
    Narrator "✓ Key"

{ hasSword == true }
    Narrator "✓ Sword"

{ hasPotion == true }
    Narrator "✓ Potion"

{ hasKey == false && hasSword == false && hasPotion == false }
    Narrator "(Empty)"

* Continue shopping -> Start
* Leave shop -> End

== End ==
Merchant "Come again!"
```

---

## Quest System

Track quest progress:

```inky
@char MC
    name: "Hero"
    color: "#FFD700"

@char QuestGiver
    name: "Elder"
    sprite: "elder.png"
    color: "#8B4513"

@char Enemy
    name: "Monster"
    sprite: "monster.png"
    color: "#8B0000"

== Start ==
~ questActive = false
~ questComplete = false
~ monstersDefeated = 0

scene Village
show elder neutral at center

QuestGiver "There are monsters nearby! Can you help?"

* Accept quest -> AcceptQuest
* Decline quest -> DeclineQuest

== AcceptQuest ==
~ questActive = true
show elder happy at center

QuestGiver "Thank you! Defeat 3 monsters!"

-> Hunt

== DeclineQuest ==
show elder sad at center
QuestGiver "I understand... be safe."
-> End

== Hunt ==
scene Forest

{ questActive == true && monstersDefeated < 3 }
    show enemy neutral at center
    Enemy "Grrr!"

    * Fight -> Fight
    * Run away -> RunAway

{ monstersDefeated >= 3 }
    -> QuestComplete

== Fight ==
hide enemy
Narrator "You defeated the monster!"
~ monstersDefeated += 1

Narrator "Monsters defeated: {monstersDefeated}/3"

{ monstersDefeated >= 3 }
    -> QuestComplete

-> Hunt

== RunAway ==
Narrator "You fled!"
-> Village_Return

== QuestComplete ==
~ questComplete = true
~ questActive = false

scene Village
show elder happy at center

QuestGiver "You did it! Thank you so much!"
MC "Happy to help!"

-> End

== Village_Return ==
scene Village
show elder neutral at center

QuestGiver "Changed your mind? The quest is still available."

* Try again -> Hunt
* Give up -> End

== End ==
{ questComplete == true }
    Narrator "Quest Complete!"

{ questComplete == false }
    Narrator "Quest Incomplete."

clear
Narrator "End of demo."
```

---

## Tips for Writing Good Stories

### 1. **Use Meaningful Variable Names**
```inky
// Good
~ playerTrustLevel = 50
~ hasCompletedTutorial = true

// Avoid
~ x = 50
~ flag = true
```

### 2. **Comment Your Branches**
```inky
// --- Good Ending Path ---
{ affection >= 20 }
    -> GoodEnding

// --- Normal Ending Path ---
{ affection >= 10 }
    -> NormalEnding
```

### 3. **Provide Fallbacks**
```inky
{ condition1 }
    // Path 1

{ condition2 }
    // Path 2

// Always have a default path
Narrator "Default outcome"
```

### 4. **Test All Paths**
Play through your story multiple times with different choices to ensure all paths work correctly.

---

## Next Steps

- Read the [Language Reference](./InkyScript-Language-Reference.md) for complete syntax
- Check out the [Getting Started Guide](./Getting-Started.md) for tutorials
- Study the full demo at `public/inks/demo-school-day.inky`

---

**Happy writing!** ✨
