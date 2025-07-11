// Space Invaders - Main Application
import { getAdaptiveConfig, deviceUtils } from './config.js';

class SpaceInvadersApp {
    constructor() {
        this.game = null;
        this.config = getAdaptiveConfig();
        this.isMobile = deviceUtils.isMobile();
        this.currentSettings = this.loadSettings();
        this.isGameLoaded = false;
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Initializing Space Invaders...');
        
        // Show loading screen
        this.showLoadingScreen();
        
        // Initialize UI event listeners
        this.initializeUI();
        
        // Setup mobile-specific features
        if (this.isMobile) {
            this.initializeMobileFeatures();
        }
        
        // Load the Phaser game and then show menu
        await this.loadPhaserGame();
        setTimeout(() => {
            this.showMainMenu();
        }, 1000);
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingText = document.getElementById('loading-text');
        const progressFill = document.getElementById('progress-fill');
        
        loadingScreen.style.display = 'flex';
        
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
            }
            
            progressFill.style.width = `${progress}%`;
            
            if (progress < 30) {
                loadingText.textContent = 'Loading Phaser.js...';
            } else if (progress < 60) {
                loadingText.textContent = 'Preparing alien invasion...';
            } else if (progress < 90) {
                loadingText.textContent = 'Charging laser cannons...';
            } else {
                loadingText.textContent = 'Ready for battle!';
            }
        }, 100);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'none';
    }
    
    initializeUI() {
        // Menu buttons
        this.bindMenuEvents();
        
        // Settings
        this.bindSettingsEvents();
        
        // Mobile menu
        if (this.isMobile) {
            this.bindMobileMenuEvents();
        }
    }
    
    bindMenuEvents() {
        const btnPlay = document.getElementById('btn-play');
        const btnSettings = document.getElementById('btn-settings');
        const btnHelp = document.getElementById('btn-help');
        const btnPlayAgain = document.getElementById('btn-play-again');
        const btnMainMenu = document.getElementById('btn-main-menu');
        const btnCloseHelp = document.getElementById('btn-close-help');
        
        btnPlay?.addEventListener('click', () => this.startGame());
        btnSettings?.addEventListener('click', () => this.showSettings());
        btnHelp?.addEventListener('click', () => this.showHelp());
        btnPlayAgain?.addEventListener('click', () => this.restartGame());
        btnMainMenu?.addEventListener('click', () => this.showMainMenu());
        btnCloseHelp?.addEventListener('click', () => this.hideHelp());
    }
    
    bindSettingsEvents() {
        const btnSaveSettings = document.getElementById('btn-save-settings');
        const btnCancelSettings = document.getElementById('btn-cancel-settings');
        const sfxVolume = document.getElementById('sfx-volume');
        const musicVolume = document.getElementById('music-volume');
        
        btnSaveSettings?.addEventListener('click', () => this.saveSettings());
        btnCancelSettings?.addEventListener('click', () => this.hideSettings());
        
        // Real-time volume updates
        sfxVolume?.addEventListener('input', (e) => {
            document.getElementById('sfx-value').textContent = `${e.target.value}%`;
        });
        
        musicVolume?.addEventListener('input', (e) => {
            document.getElementById('music-value').textContent = `${e.target.value}%`;
        });
    }
    
    bindMobileMenuEvents() {
        const mobileMenuBtn = document.getElementById('mobile-menu');
        mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    initializeMobileFeatures() {
        // Setup touch controls
        this.initializeTouchControls();
        
        // Prevent mobile browser behaviors
        this.preventMobileBrowserBehaviors();
    }
    
    initializeTouchControls() {
        const touchControls = document.getElementById('touch-controls');
        
        if (!touchControls) return;
        
        if (this.currentSettings.controlType === 'buttons') {
            this.setupVirtualButtons();
        } else {
            this.setupGestureControls();
        }
        
        touchControls.classList.add('active');
    }
    
    setupVirtualButtons() {
        const controlButtons = document.querySelector('.control-buttons');
        const touchZones = document.querySelector('.touch-zones');
        
        controlButtons?.classList.add('visible');
        touchZones?.classList.remove('active');
        
        // Bind virtual button events
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnFire = document.getElementById('btn-fire');
        
        this.bindVirtualButtonEvents(btnLeft, 'left');
        this.bindVirtualButtonEvents(btnRight, 'right');
        this.bindVirtualButtonEvents(btnFire, 'fire');
    }
    
    setupGestureControls() {
        const controlButtons = document.querySelector('.control-buttons');
        const touchZones = document.querySelector('.touch-zones');
        
        controlButtons?.classList.remove('visible');
        touchZones?.classList.add('active');
        
        // Bind gesture events
        const gameContainer = document.getElementById('game-container');
        this.bindGestureEvents(gameContainer);
    }
    
    bindVirtualButtonEvents(button, action) {
        if (!button) return;
        
        const handleStart = (e) => {
            e.preventDefault();
            button.classList.add('pressed');
            console.log(`Mobile input: ${action} pressed`);
            this.triggerHapticFeedback('light');
        };
        
        const handleEnd = (e) => {
            e.preventDefault();
            button.classList.remove('pressed');
            console.log(`Mobile input: ${action} released`);
        };
        
        button.addEventListener('touchstart', handleStart, { passive: false });
        button.addEventListener('touchend', handleEnd, { passive: false });
        button.addEventListener('touchcancel', handleEnd, { passive: false });
    }
    
    bindGestureEvents(container) {
        if (!container) return;
        
        let touchStartX = 0;
        let touchStartTime = 0;
        let isDragging = false;
        
        const handleTouchStart = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartTime = Date.now();
            isDragging = false;
            
            // Show touch feedback
            this.showTouchFeedback(touch.clientX, touch.clientY);
        };
        
        const handleTouchMove = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - touchStartX);
            
            if (deltaX > this.config.mobile.gestureThreshold) {
                isDragging = true;
                console.log('Player moving to:', touch.clientX);
            }
        };
        
        const handleTouchEnd = (e) => {
            e.preventDefault();
            const touchDuration = Date.now() - touchStartTime;
            
            // If it was a quick tap and not a drag, fire
            if (touchDuration < this.config.mobile.fireTapDuration && !isDragging) {
                console.log('Player firing!');
                this.triggerHapticFeedback('medium');
            }
        };
        
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: false });
        container.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    }
    
    showTouchFeedback(x, y) {
        const feedback = document.createElement('div');
        feedback.className = 'touch-feedback';
        feedback.style.left = `${x - 30}px`;
        feedback.style.top = `${y - 30}px`;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (document.body.contains(feedback)) {
                document.body.removeChild(feedback);
            }
        }, 600);
    }
    
    preventMobileBrowserBehaviors() {
        // Prevent zoom
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        // Prevent context menu
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    // Game control methods
    async startGame() {
        console.log('🎮 Starting game...');
        this.hideAllMenus();
        this.showGameUI();
        
        if (this.isMobile) {
            this.showTouchControls();
        }
        
        // Load Phaser game if not already loaded
        if (!this.isGameLoaded) {
            await this.loadPhaserGame();
        }
        
        // Start the game scene
        if (this.game) {
            this.game.scene.start('GameScene');
        }
    }
    
    async loadPhaserGame() {
        if (this.game) {
            this.game.destroy(true);
        }
        
        try {
            // Clear the game container
            const gameContainer = document.getElementById('game-container');
            gameContainer.innerHTML = '';
            
            // Import game scenes
            const [
                { MenuScene },
                { GameScene },
                { GameOverScene }
            ] = await Promise.all([
                import('./scenes/MenuScene.js'),
                import('./scenes/GameScene.js'),
                import('./scenes/GameOverScene.js')
            ]);
            
            // Configure Phaser
            const phaserConfig = {
                type: Phaser.AUTO,
                width: this.config.width,
                height: this.config.height,
                parent: 'game-container',
                backgroundColor: this.config.visual.backgroundColor,
                scale: this.config.scale,
                physics: this.config.physics,
                scene: [MenuScene, GameScene, GameOverScene],
                input: {
                    touch: true,
                    mouse: true
                },
                render: {
                    pixelArt: this.config.visual.pixelPerfect,
                    antialias: false
                }
            };
            
            // Create Phaser game instance
            this.game = new Phaser.Game(phaserConfig);
            
            // Pass app reference to scenes
            this.game.registry.set('app', this);
            this.game.registry.set('config', this.config);
            this.game.registry.set('settings', this.currentSettings);
            
            // Start with MenuScene
            this.game.scene.start('MenuScene');
            
            this.isGameLoaded = true;
            console.log('✅ Phaser game loaded successfully');
            
        } catch (error) {
            console.error('❌ Failed to load Phaser game:', error);
            this.showError('Failed to load game engine. Please refresh and try again.');
        }
    }
    
    restartGame() {
        this.hideGameOver();
        this.startGame();
    }
    
    // UI management methods
    showMainMenu() {
        this.hideLoadingScreen();
        this.hideAllMenus();
        this.showGameUI(); // Show the game container
        
        // Start MenuScene in Phaser
        if (this.game) {
            this.game.scene.start('MenuScene');
        }
        
        // Also show HTML menu overlay
        document.getElementById('game-menu').style.display = 'flex';
    }
    
    hideAllMenus() {
        document.getElementById('game-menu').style.display = 'none';
        document.getElementById('settings-panel').style.display = 'none';
        document.getElementById('help-panel').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';
    }
    
    showGameUI() {
        document.getElementById('game-ui').style.display = 'block';
        document.getElementById('game-container').style.display = 'block';
    }
    
    showTouchControls() {
        const touchControls = document.getElementById('touch-controls');
        if (touchControls) {
            touchControls.style.display = 'block';
        }
    }
    
    showSettings() {
        this.populateSettingsForm();
        document.getElementById('settings-panel').style.display = 'flex';
    }
    
    hideSettings() {
        document.getElementById('settings-panel').style.display = 'none';
    }
    
    showHelp() {
        document.getElementById('help-panel').style.display = 'flex';
    }
    
    hideHelp() {
        document.getElementById('help-panel').style.display = 'none';
    }
    
    showGameOver(score) {
        document.getElementById('final-score').textContent = score?.toLocaleString() || '0';
        document.getElementById('game-over').style.display = 'flex';
    }
    
    hideGameOver() {
        document.getElementById('game-over').style.display = 'none';
    }
    
    // Settings management
    loadSettings() {
        const defaultSettings = {
            controlType: 'gesture',
            sfxVolume: 70,
            musicVolume: 50,
            hapticFeedback: true
        };
        
        try {
            const saved = localStorage.getItem('spaceinvaders_settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    }
    
    saveSettings() {
        const controlType = document.getElementById('control-type').value;
        const sfxVolume = parseInt(document.getElementById('sfx-volume').value);
        const musicVolume = parseInt(document.getElementById('music-volume').value);
        const hapticFeedback = document.getElementById('haptic-feedback').checked;
        
        this.currentSettings = {
            controlType,
            sfxVolume,
            musicVolume,
            hapticFeedback
        };
        
        localStorage.setItem('spaceinvaders_settings', JSON.stringify(this.currentSettings));
        
        // Apply settings
        this.updateMobileControls();
        this.hideSettings();
    }
    
    populateSettingsForm() {
        document.getElementById('control-type').value = this.currentSettings.controlType;
        document.getElementById('sfx-volume').value = this.currentSettings.sfxVolume;
        document.getElementById('music-volume').value = this.currentSettings.musicVolume;
        document.getElementById('haptic-feedback').checked = this.currentSettings.hapticFeedback;
        
        document.getElementById('sfx-value').textContent = `${this.currentSettings.sfxVolume}%`;
        document.getElementById('music-value').textContent = `${this.currentSettings.musicVolume}%`;
    }
    
    updateMobileControls() {
        if (this.isMobile) {
            if (this.currentSettings.controlType === 'buttons') {
                this.setupVirtualButtons();
            } else {
                this.setupGestureControls();
            }
        }
    }
    
    // Utility methods
    triggerHapticFeedback(intensity = 'light') {
        if (this.currentSettings.hapticFeedback && deviceUtils.supportsHaptics()) {
            const durations = { light: 50, medium: 100, heavy: 200 };
            navigator.vibrate(durations[intensity] || 50);
        }
    }
    
    toggleMobileMenu() {
        const gameMenu = document.getElementById('game-menu');
        const isVisible = gameMenu.style.display === 'flex';
        
        if (isVisible) {
            this.hideAllMenus();
        } else {
            gameMenu.style.display = 'flex';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.spaceInvadersApp = new SpaceInvadersApp();
});

export default SpaceInvadersApp; 