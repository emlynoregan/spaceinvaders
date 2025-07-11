// Space Invaders - Game Configuration
export const gameConfig = {
    // Basic game settings
    width: 800,
    height: 600,
    
    // Responsive scaling settings
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
        min: {
            width: 320,
            height: 240
        },
        max: {
            width: 1920,
            height: 1440
        }
    },
    
    // Physics settings
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    
    // Gameplay settings
    gameplay: {
        playerSpeed: 200,
        bulletSpeed: 300,
        alienSpeed: 50,
        alienDropDistance: 20,
        alienFormation: {
            rows: 5,
            cols: 11,
            spacing: 60,
            offsetX: 100,
            offsetY: 150
        },
        barriers: {
            count: 4,
            width: 80,
            height: 60,
            spacing: 120,
            offsetY: 450
        }
    },
    
    // Difficulty scaling
    difficulty: {
        speedIncreasePerWave: 0.8, // More aggressive: 20% faster each wave (was 1.2 = 20% slower)
        fireRateIncreasePerWave: 1.3, // 30% more firing each wave  
        maxSpeed: 100, // Minimum delay between alien moves (was 300, lower = faster)
        minFireDelay: 500,
        baseFiringChance: 0.08, // Starting firing chance (8%)
        maxFiringChance: 0.25   // Cap at 25% firing chance per move
    },
    
    // Lives and scoring
    scoring: {
        startingLives: 3,
        extraLifeScore: 10000,
        alienPoints: {
            green: 10,
            yellow: 20,
            red: 30
        },
        ufoPoints: 500,
        waveBonus: 1000,
        perfectWaveBonus: 2000,
        barrierBonus: 500
    },
    
    // Audio settings
    audio: {
        soundEnabled: true,
        musicVolume: 0.5,
        sfxVolume: 0.7,
        sounds: {
            playerShoot: 'player_shoot',
            alienDeath: 'alien_death',
            playerDeath: 'player_death',
            ufoSound: 'ufo_sound',
            alienMove: 'alien_move',
            powerUp: 'power_up'
        }
    },
    
    // Mobile settings
    mobile: {
        touchControlType: 'gesture', // 'gesture' or 'buttons'
        hapticFeedback: true,
        autoFire: false,
        sensitivity: 1.0,
        buttonOpacity: 0.6,
        gestureThreshold: 10, // pixels to distinguish tap from drag
        fireTapDuration: 200, // max ms for a tap to register as fire
        doubleTapPreventionDelay: 300 // ms to prevent accidental double taps
    },
    
    // Visual settings
    visual: {
        pixelPerfect: true,
        backgroundColor: '#000000',
        starField: true,
        particleEffects: true,
        screenShake: true,
        flashEffects: true
    },
    
    // Performance settings
    performance: {
        maxParticles: 100,
        maxBullets: 20,
        objectPooling: true,
        targetFPS: 60,
        powerSaveMode: false // reduces effects on low-end devices
    },
    
    // Debug settings
    debug: {
        enabled: false,
        showFPS: false,
        showTouchZones: false,
        godMode: false,
        skipIntro: false
    }
};

// Device detection utilities
export const deviceUtils = {
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    },
    
    isTablet: () => {
        return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    },
    
    isLandscape: () => {
        return window.innerWidth > window.innerHeight;
    },
    
    getScreenSize: () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.innerWidth / window.innerHeight
        };
    },
    
    supportsHaptics: () => {
        return 'vibrate' in navigator;
    },
    
    getPerformanceProfile: () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return 'low';
        
        const renderer = gl.getParameter(gl.RENDERER).toLowerCase();
        const memory = navigator.deviceMemory || 4; // default to 4GB if not available
        
        if (memory >= 8) return 'high';
        if (memory >= 4) return 'medium';
        return 'low';
    }
};

// Dynamic configuration based on device
export const getAdaptiveConfig = () => {
    const config = { ...gameConfig };
    const isMobile = deviceUtils.isMobile();
    const performanceProfile = deviceUtils.getPerformanceProfile();
    const screenSize = deviceUtils.getScreenSize();
    
    // Mobile adaptations
    if (isMobile) {
        config.mobile.touchControlType = 'gesture';
        config.gameplay.playerSpeed = 180; // slightly slower for touch
        
        // Adjust for small screens
        if (screenSize.width < 480) {
            config.performance.maxParticles = 50;
            config.performance.maxBullets = 15;
            config.visual.particleEffects = false;
        }
    }
    
    // Performance adaptations
    switch (performanceProfile) {
        case 'low':
            config.performance.maxParticles = 25;
            config.performance.maxBullets = 10;
            config.visual.particleEffects = false;
            config.visual.screenShake = false;
            config.performance.powerSaveMode = true;
            break;
            
        case 'medium':
            config.performance.maxParticles = 50;
            config.performance.maxBullets = 15;
            break;
            
        case 'high':
            // Use default settings
            break;
    }
    
    // Landscape mobile adjustments
    if (isMobile && deviceUtils.isLandscape() && screenSize.height < 500) {
        config.mobile.buttonOpacity = 0.8; // more visible in landscape
    }
    
    return config;
};

// Input configuration
export const inputConfig = {
    desktop: {
        moveLeft: ['LEFT', 'A'],
        moveRight: ['RIGHT', 'D'],
        fire: ['SPACE'],
        pause: ['P', 'ESC'],
        restart: ['R']
    },
    
    mobile: {
        gestureDeadZone: 10,
        dragSensitivity: 1.0,
        tapThreshold: 200,
        doubleTapDelay: 300,
        longPressDelay: 500
    }
};

// Animation configurations
export const animationConfig = {
    player: {
        idle: { key: 'player_idle', frameRate: 1, repeat: -1 },
        move: { key: 'player_move', frameRate: 8, repeat: -1 },
        death: { key: 'player_death', frameRate: 12, repeat: 0 }
    },
    
    aliens: {
        move: { key: 'alien_move', frameRate: 2, repeat: -1 },
        death: { key: 'alien_death', frameRate: 10, repeat: 0 }
    },
    
    explosions: {
        small: { key: 'explosion_small', frameRate: 15, repeat: 0 },
        large: { key: 'explosion_large', frameRate: 12, repeat: 0 }
    },
    
    ui: {
        buttonHover: { duration: 200, ease: 'Power2' },
        sceneTransition: { duration: 500, ease: 'Power2' },
        scoreCounter: { duration: 1000, ease: 'Back.easeOut' }
    }
};

// Asset paths configuration
export const assetConfig = {
    images: {
        // Player
        player: 'assets/images/player.png',
        playerBullet: 'assets/images/player_bullet.png',
        
        // Aliens
        alienGreen: 'assets/images/alien_green.png',
        alienYellow: 'assets/images/alien_yellow.png',
        alienRed: 'assets/images/alien_red.png',
        alienBullet: 'assets/images/alien_bullet.png',
        
        // UFO
        ufo: 'assets/images/ufo.png',
        
        // Environment
        barrier: 'assets/images/barrier.png',
        stars: 'assets/images/stars.png',
        
        // Effects
        explosion: 'assets/images/explosion_spritesheet.png',
        particles: 'assets/images/particles.png'
    },
    
    audio: {
        // SFX
        playerShoot: 'assets/audio/player_shoot.mp3',
        alienDeath: 'assets/audio/alien_death.mp3',
        playerDeath: 'assets/audio/player_death.mp3',
        ufoSound: 'assets/audio/ufo_sound.mp3',
        alienMove: 'assets/audio/alien_move.mp3',
        powerUp: 'assets/audio/power_up.mp3',
        
        // Music
        menuMusic: 'assets/audio/menu_music.mp3',
        gameMusic: 'assets/audio/game_music.mp3',
        gameOverMusic: 'assets/audio/game_over_music.mp3'
    },
    
    fonts: {
        pixel: 'assets/fonts/pixel_font.png',
        retro: 'assets/fonts/retro_font.png'
    }
};

export default gameConfig; 