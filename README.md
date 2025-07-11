# 🚀 Space Invaders

**🎮 [Play Live Game](https://yoursite.com/spaceinvaders)** | **Status: 🚧 In Development**

A browser-based recreation of the classic Space Invaders arcade game, built with Phaser.js. Fight off waves of alien invaders in this retro-style shooter that runs entirely in your browser!

## 🎯 **Game Overview**

Command your laser cannon and defend Earth from waves of descending alien invaders. Each wave gets faster and more challenging. How long can you survive the invasion?

**Key Features:**
- 🛸 Classic Space Invaders gameplay
- 🎨 Retro pixel art style
- 🎵 Authentic arcade sound effects
- 🏆 High score tracking
- 📱 Mobile-friendly controls
- 🌐 Runs on GitHub Pages

## 🎮 **Gameplay Design**

### **Core Mechanics**

**Player Ship:**
- Move left/right with arrow keys or A/D
- Fire laser bullets with spacebar
- 3 lives per game
- Cannot move off screen edges

**Alien Invaders:**
- 5 rows of 11 aliens (55 total per wave)
- 3 different alien types with different point values:
  - Top row (red): 30 points each
  - Middle rows (yellow): 20 points each  
  - Bottom rows (green): 10 points each
- Move in formation: side-to-side, then drop down
- Speed increases as aliens are destroyed
- Occasionally drop bonus UFO (500 points)

**Barriers:**
- 4 destructible barriers between player and aliens
- Protect player from alien fire
- Gradually destroyed by bullets (both player and alien)
- Regenerate each wave

### **Game Progression**

**Wave System:**
- Each wave has 55 aliens in formation
- Surviving aliens from previous wave carry over
- Speed increases each wave
- Alien fire rate increases each wave
- Bonus UFO appears more frequently

**Scoring:**
- Green aliens: 10 points
- Yellow aliens: 20 points  
- Red aliens: 30 points
- Bonus UFO: 500 points
- Extra life every 10,000 points

**Difficulty Scaling:**
- Alien movement speed increases each wave
- Alien firing frequency increases
- More aggressive AI patterns
- Faster bullet speeds

### **Power-ups & Special Features**

**Bonus UFO:**
- Appears randomly across top of screen
- Worth 500 points
- Moves quickly from side to side
- Distinctive sound effect

**Special Mechanics:**
- Last alien moves fastest
- Aliens change direction when hitting screen edge
- Player bullets destroy alien bullets on contact
- Screen wrapping for bonus UFO

## 🛠️ **Technical Specifications**

### **Technology Stack**
- **Game Engine**: Phaser.js 3.x
- **Language**: JavaScript (ES6+)
- **Graphics**: HTML5 Canvas
- **Audio**: Web Audio API
- **Deployment**: GitHub Pages
- **Development**: Local HTTP server

### **Architecture**

**Scene Structure:**
```
scenes/
├── PreloadScene.js     # Asset loading
├── MenuScene.js        # Main menu
├── GameScene.js        # Main gameplay
├── GameOverScene.js    # Game over screen
└── PauseScene.js       # Pause overlay
```

**Game Objects:**
```
objects/
├── Player.js           # Player ship
├── Alien.js            # Individual alien
├── AlienFormation.js   # Alien formation manager
├── Bullet.js           # Bullets (player & alien)
├── Barrier.js          # Destructible barriers
├── UFO.js              # Bonus UFO
└── Explosion.js        # Explosion effects
```

**Managers:**
```
managers/
├── InputManager.js     # Input handling
├── SoundManager.js     # Audio management
├── ScoreManager.js     # Score & high scores
└── GameStateManager.js # Game state & progression
```

### **File Structure**
```
spaceinvaders/
├── index.html              # Main entry point
├── css/
│   ├── style.css           # Game styling
│   └── mobile.css          # Mobile-specific styles
├── js/
│   ├── main.js             # Game initialization
│   ├── config.js           # Game configuration
│   ├── scenes/             # Game scenes
│   ├── objects/            # Game objects
│   ├── managers/           # Game managers
│   └── mobile/             # Mobile-specific modules
│       ├── TouchControls.js # Touch input handling
│       ├── ResponsiveManager.js # Screen adaptation
│       └── MobileUI.js     # Mobile UI components
├── assets/
│   ├── images/             # Sprites and graphics
│   ├── audio/              # Sound effects and music
│   └── fonts/              # Custom fonts
├── docs/
│   └── GAME_DESIGN.md      # Detailed game design
├── run_game.py             # Local development server
└── README.md               # This file
```

## 📱 **Mobile Optimization**

### **Responsive Design**
- **Full-screen gameplay**: Game fills entire viewport on mobile devices
- **Aspect ratio preservation**: Maintains 4:3 game area with letterboxing if needed
- **Dynamic scaling**: UI elements scale based on screen size
- **Orientation support**: Optimized for both portrait and landscape modes
- **Safe area handling**: Respects device notches and home indicators

### **Touch Control Implementation**

**Gesture-Based Controls:**
```javascript
// Touch and drag for movement
touchStartX = touch.clientX;
playerShip.x = Phaser.Math.Clamp(touch.clientX, 0, gameWidth);

// Tap to fire with gesture recognition
if (touchDuration < 200 && !isDragging) {
    playerShip.fire();
}
```

**Virtual Button Controls:**
- **Left/Right buttons**: Semi-transparent overlays on screen edges
- **Fire button**: Large, accessible button in bottom center
- **Visual feedback**: Buttons highlight when pressed
- **Haptic feedback**: Subtle vibration on supported devices

### **Mobile UI Considerations**
- **Larger touch targets**: Minimum 44px touch areas
- **Thumb-friendly positioning**: Controls positioned for comfortable reach
- **Visual clarity**: High contrast UI elements for outdoor visibility
- **Battery optimization**: Efficient rendering to preserve battery life
- **Performance scaling**: Adjustable quality settings for older devices

### **Screen Size Adaptations**

**Phone (Portrait):**
- **Game area**: Centered with black bars on sides
- **Controls**: Bottom overlay with virtual buttons
- **HUD**: Compact layout with essential info only

**Phone (Landscape):**
- **Game area**: Full width with letterboxing top/bottom
- **Controls**: Left/right edge zones plus fire button
- **HUD**: Distributed across top edge

**Tablet:**
- **Game area**: Centered with optimal scaling
- **Controls**: Choice between drag or virtual buttons
- **HUD**: Full desktop layout with larger fonts

## 🎨 **Visual Design**

### **Art Style**
- **Retro pixel art aesthetic**
- **8-bit color palette**: Green, white, red, yellow
- **Low-resolution sprites** (authentic arcade feel)
- **Smooth animations** with modern interpolation
- **Particle effects** for explosions and impacts

### **Screen Layout**
- **Desktop**: 800x600 pixels (4:3 aspect ratio)
- **Mobile**: Full screen responsive (maintains aspect ratio)
- **Score display**: Top left corner
- **Lives display**: Top right corner
- **High score**: Top center
- **HUD elements**: Retro green text on black background
- **Touch controls**: Bottom overlay (mobile only)

### **Sprite Specifications**
- **Player ship**: 24x16 pixels
- **Aliens**: 16x16 pixels each
- **Bullets**: 2x8 pixels
- **Barriers**: 64x48 pixels
- **UFO**: 32x16 pixels

## 🎵 **Audio Design**

### **Sound Effects**
- **Player shoot**: Classic laser sound
- **Alien movement**: Rhythmic marching beat
- **Alien destruction**: Explosion sound
- **Player hit**: Dramatic explosion
- **UFO appearance**: Distinctive warbling sound
- **Game over**: Dramatic game over tune

### **Music**
- **Menu theme**: Retro arcade music
- **Game background**: Tense ambient music
- **Victory**: Triumphant fanfare
- **Game over**: Somber defeat music

## 🚀 **Quick Start**

### **Play Online** (Once Deployed)
Visit: **[Your GitHub Pages URL]**

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/yourusername/spaceinvaders.git
cd spaceinvaders

# Start local server
python run_game.py

# Or manually:
python -m http.server 8000

# Open http://localhost:8000 in your browser
```

## 🎮 **Controls**

### **Desktop**
- **Move Left**: A key or Left arrow
- **Move Right**: D key or Right arrow
- **Fire**: Spacebar
- **Pause**: P key or Escape
- **Restart**: R key (when game over)

### **Mobile Touch Controls**

**Primary Control Scheme (Recommended):**
- **Move**: Touch and drag anywhere on screen to move ship horizontally
- **Fire**: Tap anywhere on screen (separate from drag gesture)
- **Pause**: Tap pause button in top corner

**Alternative Control Scheme:**
- **Move Left**: Touch and hold left side of screen (virtual left button)
- **Move Right**: Touch and hold right side of screen (virtual right button)
- **Fire**: Tap fire button in bottom center
- **Auto-fire**: Optional toggle for continuous shooting

**Mobile Features:**
- **Responsive UI**: Game scales to fill screen while maintaining aspect ratio
- **Touch feedback**: Haptic feedback on supported devices
- **Gesture recognition**: Distinguishes between move and fire gestures
- **Control customization**: Choose between control schemes in settings

## 🏆 **Game Modes**

### **Classic Mode**
- Traditional Space Invaders gameplay
- Increasing difficulty
- High score tracking
- Lives system

### **Survival Mode** (Future)
- Endless waves
- Power-ups
- Multiple weapon types
- Leaderboards

### **Time Attack** (Future)
- 3-minute rounds
- Score multipliers
- Bonus objectives

## 📊 **Scoring System**

| Target | Points |
|--------|--------|
| Green Alien | 10 |
| Yellow Alien | 20 |
| Red Alien | 30 |
| Bonus UFO | 500 |
| **Extra Life** | Every 10,000 points |

**Multipliers:**
- Wave completion bonus: +1000 points
- Perfect wave (no lives lost): +2000 points
- Barrier preservation bonus: +500 per intact barrier

## 🔧 **Configuration**

### **Game Settings** (config.js)
```javascript
const gameConfig = {
    // Screen dimensions
    width: 800,
    height: 600,
    
    // Responsive settings
    scaleMode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    
    // Gameplay settings
    playerSpeed: 200,
    bulletSpeed: 300,
    alienSpeed: 50,
    alienDropDistance: 20,
    
    // Difficulty scaling
    speedIncreasePerWave: 1.2,
    fireRateIncreasePerWave: 1.1,
    
    // Lives and scoring
    startingLives: 3,
    extraLifeScore: 10000,
    
    // Audio settings
    soundEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.8,
    
    // Mobile settings
    mobile: {
        touchControlType: 'gesture', // 'gesture' or 'buttons'
        hapticFeedback: true,
        autoFire: false,
        sensitivity: 1.0,
        buttonOpacity: 0.6
    }
};
```

## 🌐 **Deployment Options**

### **GitHub Pages** (Recommended)
1. **Fork/Clone**: This repository
2. **Enable Pages**: Repository Settings → Pages → Deploy from main branch
3. **Custom Domain**: Optional - set up your own domain
4. **Access**: `https://yourusername.github.io/spaceinvaders`

### **Local Development**
```bash
# Quick start
python run_game.py

# Manual setup
python -m http.server 8000
```

## 📱 **Browser Compatibility**

| Browser | Min Version | Status |
|---------|-------------|--------|
| Chrome | 80+ | ✅ Full support |
| Firefox | 75+ | ✅ Full support |
| Safari | 13+ | ✅ Full support |
| Edge | 80+ | ✅ Full support |
| iOS Safari | 13+ | ✅ Mobile support |
| Android Chrome | 80+ | ✅ Mobile support |

## 🎯 **Development Status**

### **✅ Planned Features**

**Core Gameplay:**
- [ ] Player ship movement and shooting
- [ ] Alien formation and movement
- [ ] Collision detection
- [ ] Destructible barriers
- [ ] Sound effects and music
- [ ] Score system and high scores
- [ ] Multiple waves/levels
- [ ] Bonus UFO
- [ ] Game over and restart

**Mobile Features:**
- [ ] Touch and drag ship movement
- [ ] Tap to fire gesture recognition
- [ ] Virtual button controls (alternative)
- [ ] Responsive full-screen design
- [ ] Mobile-optimized UI scaling
- [ ] Haptic feedback integration
- [ ] Portrait/landscape orientation support
- [ ] Touch control customization
- [ ] Performance optimization for mobile devices

### **🚀 Future Enhancements**
- [ ] Power-ups and special weapons
- [ ] Multiple game modes
- [ ] Online leaderboards
- [ ] Achievement system
- [ ] Customizable controls
- [ ] Screen shake and juice effects
- [ ] Particle systems
- [ ] Progressive Web App features

## 🛠️ **Development Guidelines**

### **Code Structure**
- **Modular design**: Each class in separate file
- **ES6 modules**: Import/export syntax
- **Clean architecture**: Separation of concerns
- **Performance focused**: 60fps gameplay on all devices
- **Mobile-first**: Touch controls and responsive design
- **Progressive enhancement**: Desktop features add to mobile base

### **Asset Requirements**
- **Images**: PNG format, transparent backgrounds
- **Audio**: MP3 format, compressed for web
- **Fonts**: Web-safe fonts or Google Fonts
- **Sprites**: Power-of-2 dimensions for optimal performance

### **Mobile Development Guidelines**

**Touch Input Implementation:**
```javascript
// Register touch events
this.input.on('pointerdown', this.onTouchStart, this);
this.input.on('pointermove', this.onTouchMove, this);
this.input.on('pointerup', this.onTouchEnd, this);

// Handle gesture recognition
onTouchStart(pointer) {
    this.touchStartTime = Date.now();
    this.touchStartX = pointer.x;
    this.isDragging = false;
}

onTouchMove(pointer) {
    if (Math.abs(pointer.x - this.touchStartX) > 10) {
        this.isDragging = true;
        this.movePlayerTo(pointer.x);
    }
}

onTouchEnd(pointer) {
    const touchDuration = Date.now() - this.touchStartTime;
    if (touchDuration < 200 && !this.isDragging) {
        this.firePlayerBullet();
    }
}
```

**Responsive Scaling:**
```javascript
// Configure responsive scaling
const config = {
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    }
};
```

**Performance Optimization:**
- **Object pooling**: Reuse bullet and explosion objects
- **Efficient collision detection**: Use Phaser's built-in systems
- **Texture atlasing**: Combine sprites into single texture
- **Audio preloading**: Load sounds during boot scene
- **Frame rate monitoring**: Adjust quality based on performance

## 📚 **Learning Resources**

### **Phaser.js Documentation**
- [Official Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 Examples](https://phaser.io/examples)
- [Phaser Community](https://phaser.discourse.group/)

### **Game Development**
- [Space Invaders Game Analysis](https://www.gamedeveloper.com/design/analyzing-space-invaders)
- [Classic Arcade Game Design](https://www.gamedeveloper.com/design/classic-arcade-game-design)

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** a feature branch
3. **Commit** your changes
4. **Push** to the branch
5. **Open** a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Credits**

- **Original Game**: Space Invaders by Taito (1978)
- **Game Engine**: [Phaser.js](https://phaser.io/)
- **Development**: Your Name
- **Inspiration**: Classic arcade gaming

---

*Built with ❤️ and lots of nostalgia for the golden age of arcade gaming*
