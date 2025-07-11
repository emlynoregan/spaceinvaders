# 🚀 Space Invaders - Defend Earth!

**🎮 Classic arcade action meets modern web technology**

A faithful recreation of the iconic Space Invaders arcade game, featuring mobile-optimized controls, fullscreen support, and modern web features. Vibe coded by **Emlyn O'Regan** using Cursor & Claude-4-Sonnet.

🌐 **[Visit emlynoregan.com](https://emlynoregan.com)**

## ✨ **Features**

### 🎮 **Classic Gameplay**
- **Authentic Space Invaders experience** with waves of alien invaders
- **Progressive difficulty** - aliens get faster and more aggressive each wave
- **Destructible barriers** that wear down from both player and alien fire
- **Bonus mothership** - appears periodically for 50-300 bonus points
- **High score tracking** with local storage persistence
- **Extra lives** every 10,000 points

### 📱 **Mobile Optimized**
- **Touch controls** designed for mobile gaming ergonomics
  - Left thumb: ◀ ▶ horizontal movement buttons
  - Right thumb: 🔥 fire button
- **Fullscreen support** with automatic address bar hiding
- **Responsive design** that works on any device
- **PWA capabilities** - install as an app on your phone

### 🌐 **Modern Web Features**
- **Offline functionality** with service worker caching
- **Social media integration** with Open Graph meta tags
- **SEO optimized** with structured data and sitemap
- **Fast loading** with optimized assets and CDN resources

## 🎯 **Gameplay**

### **Scoring System**
- **Green aliens**: 10 points
- **Yellow aliens**: 20 points  
- **Red aliens**: 30 points
- **Mothership**: 50-300 bonus points (random)
- **Wave bonus**: 100 points per completed wave

### **Controls**

**Desktop:**
- **Movement**: Arrow keys or A/D keys
- **Fire**: Spacebar
- **Pause**: P or ESC

**Mobile:**
- **Movement**: ◀ ▶ buttons (left thumb)
- **Fire**: 🔥 button (right thumb)
- **Pause**: ☰ menu button or turn device

### **Special Features**
- **Mothership**: Bonus UFO flies across the top periodically
- **Wave progression**: Each wave increases speed and aggression
- **Destructible barriers**: Pixel-by-pixel destruction with explosion effects
- **Smart alien AI**: Proximity-weighted firing system

## 🛠️ **Technical Stack**

### **Core Technologies**
- **Game Engine**: Phaser.js 3.70.0
- **Language**: JavaScript ES6+ modules
- **Graphics**: HTML5 Canvas with pixel-perfect rendering
- **Audio**: Web Audio API with retro sound synthesis
- **PWA**: Service Worker + Web App Manifest

### **Architecture**
```
spaceinvaders/
├── index.html              # Main entry with PWA meta tags
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker for caching
├── css/
│   ├── style.css           # Main game styling
│   ├── mobile.css          # Mobile-specific styles
│   └── fullscreen.css      # Fullscreen functionality
├── js/
│   ├── main.js             # Game initialization
│   ├── config.js           # Game configuration
│   ├── scenes/
│   │   ├── MenuScene.js    # Main menu
│   │   ├── GameScene.js    # Core gameplay
│   │   └── GameOverScene.js # Game over screen
│   └── mobile/
│       ├── TouchControls.js     # Touch input system
│       ├── FullscreenHelper.js  # Address bar hiding
│       └── SimpleFullscreen.js  # Fullscreen API
├── assets/images/
│   ├── favicon.png         # App icon
│   └── oembed.png          # Social media preview
├── robots.txt              # SEO crawling rules
├── sitemap.xml             # Search engine sitemap
└── README.md               # This file
```

### **Mobile Control System**
```javascript
// Ergonomic button layout for mobile gaming
const controlLayout = {
    left: { position: 'bottom-left', action: 'moveLeft' },
    right: { position: 'bottom-left', action: 'moveRight' },
    fire: { position: 'bottom-right', action: 'fire' }
};

// Touch-optimized physics
const touchResponse = {
    immediate: true,
    precision: 'pixel-perfect',
    feedback: 'visual + haptic'
};
```

### **Fullscreen Implementation**
```javascript
// Dual approach for maximum compatibility
const fullscreenMethods = {
    automatic: 'scroll-based address bar hiding',
    manual: 'fullscreen API with ⛶ button',
    fallback: 'viewport manipulation'
};
```

## 🚀 **Quick Start**

### **Play Immediately**
1. Visit the game URL in any modern browser
2. Click **PLAY** to start
3. Use controls appropriate for your device
4. Defend Earth from the alien invasion!

### **Install as App** (PWA)
1. Open the game in Chrome/Edge/Safari
2. Look for "Install" or "Add to Home Screen" option
3. Install for offline play and app-like experience

### **Local Development**
```bash
# Clone or download the repository
cd spaceinvaders

# Start local server (Python 3)
python -m http.server 8000

# Or use Node.js
npx http-server

# Open browser to localhost:8000
```

## 🎨 **Visual Design**

### **Retro Aesthetic**
- **Classic color palette**: Green #00ff00, White #ffffff, Red #ff0000
- **Pixel-perfect sprites** with authentic 8-bit feel
- **Smooth 60fps gameplay** with modern rendering
- **Retro sound synthesis** using Web Audio API oscillators

### **Modern UX**
- **Responsive layout** adapts to any screen size
- **Touch-friendly controls** with visual feedback
- **Accessibility features** including keyboard navigation
- **Clean, readable UI** with high contrast

## 📱 **Mobile Features**

### **Optimized Controls**
- **No gesture controls** - pure button-based for precision
- **Ergonomic positioning** for comfortable extended play
- **Visual feedback** on button press
- **Landscape orientation** support with fullscreen

### **Performance Optimizations**
- **Efficient rendering** to preserve battery life
- **Optimized asset loading** with service worker caching
- **Responsive scaling** maintains performance across devices
- **Memory management** prevents leaks during long sessions

## 🌟 **Special Game Elements**

### **Mothership System**
- **Random spawning** every 15-30 seconds
- **Alternating flight patterns** (left-to-right, right-to-left)
- **Bonus point variety** (50, 100, 150, or 300 points)
- **Distinctive audio** and visual effects
- **Strategic challenge** - risk vs reward timing

### **Wave Progression**
- **Adaptive difficulty** based on player performance  
- **Speed escalation** with each completed wave
- **Increased alien aggression** over time
- **Barrier regeneration** for fresh defensive positions

## 📊 **SEO & Social Features**

### **Social Media Ready**
- **Open Graph tags** for rich link previews
- **Twitter Card** support for social sharing
- **Structured data** (JSON-LD) for search engines
- **Custom favicon** and app icons

### **SEO Optimized**
- **Semantic HTML** structure
- **Meta descriptions** and keywords
- **Robots.txt** and sitemap.xml
- **Fast loading** and mobile-friendly design

## 🎖️ **Credits**

**Vibe coded by Emlyn O'Regan**  
Using Cursor IDE & Claude-4-Sonnet AI

**Original Game**: Space Invaders (1978) by Tomohiro Nishikado  
**Framework**: Phaser.js Community  
**Inspiration**: Classic arcade gaming era

---

**🚀 Ready to defend Earth? Start playing now!**
