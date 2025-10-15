# InkyScript Assets

This folder structure organizes all assets for the InkyScript visual novel project.

## Structure

```
public/assets/
├── backgrounds/ # Background images for scenes
├── characters/ # Character sprites (organized by character)
├── music/ # Background music (BGM)
├── sounds/ # Sound Effects (SFX)
└── ui/ # UI elements (buttons, icons, etc.)
```

## Use in InkyScript

### Backgrounds
```inky
scene Classroom_Day
scene Bedroom_Night
scene City_Morning
```

File name without extension is used automatically.
Path: `public/assets/backgrounds/{name}.png`

### Characters
```inky
@char Sayori
sprite: "sayori/{expression}.png"

show sayori happy
show sayori sad at left
hide sayori
```

The `{expression}` placeholder is automatically replaced.
Path: `public/assets/characters/sayori/happy.png`

###Music
```inky
play music morning_theme.mp3
play music sad_theme.mp3 fadein 2.0
stop music fadeout 3.0
```

Path: `public/assets/music/{filename}`

### Sounds
```inky
play sound door_open.wav
play sound footsteps.mp3
```

Path: `public/assets/sounds/{filename}`

## Available backgrounds

### Apartments & rooms
- Apartment_Exterior, Apartment_Exterior_Night
- Bathroom, Bathroom_Foggy
- Bedroom_Day, Bedroom_Evening, Bedroom_Night, Bedroom_Night_Dark
- Futon_Room, Futon_Room_Night
- Kitchen_Day, Kitchen_Night
- Livingroom_Dark, Livingroom_Day, Livingroom_Night
- Sitting_Room, Sitting_Room_Dark
- Small_Apartment_Kitchen, Small_Apartment_Kitchen_Night

### School
- Cafeteria_Day
- Classroom_Day
- School_Hallway_Day

### Outdoor areas (city)
- City_Afternoon, City_Morning, City_Night, City_Raining
- Street_Spring_Day, Street_Spring_Evening, Street_Spring_Night, Street_Spring_Rain
- Street_Summer_Day, Street_Summer_Evening, Street_Summer_Night, Street_Summer_Rain, Street_Summer_Stars
- Street_Autumn_Day, Street_Autumn_Evening, Street_Autumn_Night

### Outdoor areas (lanes & stops)
- Backstreet_Spring_Day, Backstreet_Spring_Afternoon, Backstreet_Spring_Cloudy, Backstreet_Spring_Night, Backstreet_Spring_Night_Rain, Backstreet_Spring_Rain
- Backstreet_Summer_Day, Backstreet_Summer_Afternoon, Backstreet_Summer_Cloudy, Backstreet_Summer_Night, Backstreet_Summer_Night_Rain, Backstreet_Summer_Rain
- BusStop_Spring_Day, BusStop_Spring_Afternoon, BusStop_Spring_Cloudy, BusStop_Spring_Night, BusStop_Spring_Night_Rain, BusStop_Spring_Rain
- BusStop_Summer_Day, BusStop_Summer_Afternoon, BusStop_Summer_Cloudy, BusStop_Summer_Night, BusStop_Summer_Night_Rain, BusStop_Summer_Rain

### Temples & Shrines
- Temple_Spring_Day, Temple_Spring_Afternoon, Temple_Spring_Clouds, Temple_Spring_Night, Temple_Spring_Rain
- Temple_Summer_Day, Temple_Summer_Afternoon, Temple_Summer_Clouds, Temple_Summer_Night, Temple_Summer_Night_Clouds, Temple_Summer_Night_Rain, Temple_Summer_Rain
- Shrine_Spring_Day, Shrine_Spring_Cloudy, Shrine_Spring_Evening, Shrine_Spring_Night, Shrine_Spring_Rain, Shrine_Spring_Storm, Shrine_Spring_Storm_Rain
- Shrine_Summer_Day, Shrine_Summer_Evening, Shrine_Summer_Night

### Places
- Laundromat
- Onsen_Building, Onsen_Building_Night
-Outdoor_Stairs
- Restaurant_A, Restaurant_B

### Transportation
- Train_beach, Train_Day, Train_Day_Rain, Train_Evening, Train_Night, Train_Night_Rain, Train_Transparent, Train_Tunnel

## Available Characters

### Sayori
- Expressions: neutral, happy, sad, angry, surprised
- Path: `public/assets/characters/sayori/{expression}.png`

### Player (MC)
- Sprite: Player.png
- Path: `public/assets/characters/Player.png`

## Asset Guidelines

### Backgrounds
- Format: PNG or JPG
- Recommended resolution: 1920x1080 (16:9)
- File name: PascalCase (e.g., `School_Hallway_Day.png`)

### Characters
- Format: PNG with transparency
- Recommended size: ~1200px height
- Folder structure: `characters/{character_name}/{expression}.png`
- Character names: lowercase (e.g., `sayori/`)
- Expressions: lowercase (e.g., `happy.png`) `sad.png`)

### Music
- Format: MP3 or OGG
- Recommended bitrate: 128-192 kbps
- Loopable tracks preferred

### Sounds
- Format: WAV or MP3
- Short clips (< 5 seconds)
- Clear, descriptive names

## Credits

Background packs used in the project (please license accordingly).