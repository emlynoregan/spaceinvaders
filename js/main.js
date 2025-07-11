// Space Invaders - Main Application
import { getAdaptiveConfig, deviceUtils } from './config.js';
import { FullscreenHelper } from './mobile/FullscreenHelper.js';
import { SimpleFullscreen } from './mobile/SimpleFullscreen.js';

class SpaceInvadersApp {
    constructor() {
        this.game = null;
        this.config = getAdaptiveConfig();
        this.isMobile = deviceUtils.isMobile();
        this.currentSettings = this.loadSettings();
        this.isGameLoaded = false;
        
        // Initialize fullscreen helpers for mobile
        if (this.isMobile) {
            this.fullscreenHelper = new FullscreenHelper();
            this.simpleFullscreen = new SimpleFullscreen();
            this.simpleFullscreen.init();
            
            // Listen for orientation changes to toggle fullscreen
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    if (this.fullscreenHelper && this.isGameLoaded) {
                        this.fullscreenHelper.autoFullscreenInLandscape();
                    }
                }, 500);
            });
        }
        
        // Debug logging
        console.log('🚀 SpaceInvadersApp constructor');
        console.log('📱 Is Mobile:', this.isMobile);
        console.log('⚙️ User Agent:', navigator.userAgent);
        console.log('👆 Touch Support:', 'ontouchstart' in window);
        console.log('📐 Screen Size:', window.innerWidth, 'x', window.innerHeight);
        
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
        
        // Pause menu controls
        const btnResume = document.getElementById('btn-resume');
        const btnQuitGame = document.getElementById('btn-quit-game');
        const btnConfirmQuit = document.getElementById('btn-confirm-quit');
        const btnCancelQuit = document.getElementById('btn-cancel-quit');
        
        btnPlay?.addEventListener('click', () => this.startGame());
        btnSettings?.addEventListener('click', () => this.showSettings());
        btnHelp?.addEventListener('click', () => this.showHelp());
        btnPlayAgain?.addEventListener('click', () => this.restartGame());
        btnMainMenu?.addEventListener('click', () => this.returnToMainMenu());
        btnCloseHelp?.addEventListener('click', () => this.hideHelp());
        
        // Pause menu events
        btnResume?.addEventListener('click', () => this.resumeGame());
        btnQuitGame?.addEventListener('click', () => this.showQuitConfirmation());
        btnConfirmQuit?.addEventListener('click', () => this.confirmQuitGame());
        btnCancelQuit?.addEventListener('click', () => this.hideQuitConfirmation());
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
        console.log('📱 Initializing mobile features...');
        
        // Setup touch controls
        this.initializeTouchControls();
        
        // Prevent mobile browser behaviors
        this.preventMobileBrowserBehaviors();
        
        console.log('📱 Mobile features initialized');
    }
    
    initializeTouchControls() {
        const touchControls = document.getElementById('touch-controls');
        
        if (!touchControls) return;
        
        // Show the touch controls container
        touchControls.classList.add('active');
        
        // Let the GameScene handle the actual touch control setup
        // This will be done when the game starts and the scene is created
        console.log('📱 Touch controls container activated');
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
        this.hideLoadingScreen();
        this.hideAllMenus();
        this.showGameUI();
        this.showTouchControls();
        
        // Enable fullscreen mode on mobile
        if (this.isMobile && this.fullscreenHelper) {
            this.fullscreenHelper.markUserInteraction();
            this.fullscreenHelper.autoFullscreenInLandscape();
        }
        
        // Hide wave announcement in case it was showing
        this.hideWaveAnnouncement();
        
        try {
            // Initialize or restart Phaser game
            if (!this.game) {
                await this.loadPhaserGame();
            } else {
                // Restart the game scene
                this.game.scene.stop('MenuScene');
                this.game.scene.stop('GameOverScene');
                this.game.scene.start('GameScene');
            }
            
            console.log('🎮 Game started successfully');
        } catch (error) {
            console.error('Failed to start game:', error);
            this.showMainMenu();
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
            
            // Auto-fullscreen if in landscape
            if (this.isMobile && this.fullscreenHelper) {
                this.fullscreenHelper.autoFullscreenInLandscape();
            }
            
        } catch (error) {
            console.error('❌ Failed to load Phaser game:', error);
            this.showError('Failed to load game engine. Please refresh and try again.');
        }
    }
    
    restartGame() {
        this.hideGameOver();
        
        // Reset audio context if it was suspended
        if (this.game) {
            const gameScene = this.game.scene.getScene('GameScene');
            if (gameScene && gameScene.audioContext && gameScene.audioContext.state === 'suspended') {
                gameScene.audioContext.resume();
            }
        }
        
        this.startGame();
    }
    
    returnToMainMenu() {
        console.log('🏠 Return to Main Menu clicked');
        
        this.hideGameOver();
        this.hideTouchControls();
        this.hideWaveAnnouncement(); // Ensure wave announcement is hidden too
        
        // Stop all scenes and return to menu
        if (this.game) {
            console.log('🎮 Stopping game scenes...');
            this.game.scene.stop('GameScene');
            this.game.scene.stop('GameOverScene');
            this.game.scene.start('MenuScene');
        }
        
        console.log('🏠 Showing main menu...');
        this.showMainMenu();
    }
    
    // UI management methods
    showMainMenu() {
        this.hideLoadingScreen();
        this.hideAllMenus();
        
        // Hide the game UI when showing main menu
        document.getElementById('game-ui').style.display = 'none';
        document.getElementById('game-container').style.display = 'block'; // Keep game container for Phaser canvas
        
        // Load and display current high score
        const currentHighScore = parseInt(localStorage.getItem('spaceinvaders_highscore') || '0');
        this.updateHighScore(currentHighScore);
        
        // Start MenuScene in Phaser
        if (this.game) {
            this.game.scene.start('MenuScene');
        }
        
        // Show HTML menu overlay
        document.getElementById('game-menu').style.display = 'flex';
        
        console.log('🏠 Returned to main menu');
    }
    
    hideAllMenus() {
        document.getElementById('game-menu').style.display = 'none';
        document.getElementById('settings-panel').style.display = 'none';
        document.getElementById('help-panel').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('wave-announcement').style.display = 'none';
        document.getElementById('pause-menu').style.display = 'none';
        document.getElementById('quit-confirmation').style.display = 'none';
    }
    
    showGameUI() {
        document.getElementById('game-ui').style.display = 'block';
        document.getElementById('game-container').style.display = 'block';
    }
    
    showTouchControls() {
        const touchControls = document.getElementById('touch-controls');
        if (touchControls && this.isMobile) {
            touchControls.style.display = 'block';
            touchControls.classList.add('active');
            
            // Set up control type based on user settings
            const controlButtons = document.querySelector('.control-buttons');
            const touchZones = document.querySelector('.touch-zones');
            
            // Always use virtual buttons
            controlButtons?.classList.add('visible');
            console.log('📱 Virtual buttons enabled');
        }
    }
    
    hideTouchControls() {
        const touchControls = document.getElementById('touch-controls');
        if (touchControls) {
            touchControls.style.display = 'none';
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
    
    showGameOver(score, message = 'GAME OVER') {
        // Ensure score is a valid number
        const validScore = (typeof score === 'number' && !isNaN(score)) ? score : 0;
        document.getElementById('final-score').textContent = validScore.toLocaleString();
        
        // Update game over title if custom message provided
        const gameOverTitle = document.querySelector('#game-over h2');
        if (gameOverTitle) {
            gameOverTitle.textContent = message;
        }
        
        document.getElementById('game-over').style.display = 'flex';
        console.log('Game Over displayed with score:', validScore);
    }
    
    hideGameOver() {
        document.getElementById('game-over').style.display = 'none';
    }
    
    // Wave announcement methods
    showWaveAnnouncement(waveNumber) {
        const waveNumberElement = document.getElementById('wave-number');
        waveNumberElement.textContent = `WAVE ${waveNumber}`;
        document.getElementById('wave-announcement').style.display = 'flex';
        
        // Add haptic feedback for mobile devices
        this.triggerHapticFeedback('medium');
        
        console.log(`🌊 Wave ${waveNumber} announcement displayed`);
    }
    
    hideWaveAnnouncement() {
        document.getElementById('wave-announcement').style.display = 'none';
        console.log('🌊 Wave announcement hidden');
    }

    // Pause menu methods
    showPauseMenu() {
        document.getElementById('pause-menu').style.display = 'flex';
        console.log('⏸️ Pause menu shown');
    }
    
    hidePauseMenu() {
        document.getElementById('pause-menu').style.display = 'none';
        console.log('▶️ Pause menu hidden');
    }
    
    resumeGame() {
        this.hidePauseMenu();
        this.hideQuitConfirmation();
        
        // Resume the Phaser game scene
        if (this.game) {
            const gameScene = this.game.scene.getScene('GameScene');
            if (gameScene) {
                gameScene.resumeGame();
            }
        }
        
        console.log('▶️ Game resumed');
    }
    
    showQuitConfirmation() {
        document.getElementById('quit-confirmation').style.display = 'flex';
        console.log('⚠️ Quit confirmation shown');
    }
    
    hideQuitConfirmation() {
        document.getElementById('quit-confirmation').style.display = 'none';
        console.log('❌ Quit confirmation hidden');
    }
    
    confirmQuitGame() {
        console.log('🚪 Quitting game to main menu');
        this.hideQuitConfirmation();
        this.hidePauseMenu();
        this.returnToMainMenu();
    }

    // Game UI update methods
    updateScore(score) {
        const validScore = (typeof score === 'number' && !isNaN(score)) ? score : 0;
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = validScore.toLocaleString();
        }
    }
    
    updateLives(lives) {
        const validLives = (typeof lives === 'number' && !isNaN(lives)) ? Math.max(0, lives) : 0;
        const livesContainer = document.getElementById('lives-container');
        if (livesContainer) {
            livesContainer.innerHTML = '';
            for (let i = 0; i < validLives; i++) {
                const lifeSpan = document.createElement('span');
                lifeSpan.className = 'life';
                lifeSpan.textContent = '🚀';
                livesContainer.appendChild(lifeSpan);
            }
        }
    }
    
    updateWave(wave) {
        const validWave = (typeof wave === 'number' && !isNaN(wave)) ? Math.max(1, wave) : 1;
        const waveElement = document.getElementById('wave');
        if (waveElement) {
            waveElement.textContent = validWave;
        }
    }
    
    updateHighScore(highScore) {
        const validHighScore = (typeof highScore === 'number' && !isNaN(highScore)) ? highScore : 0;
        const highScoreElement = document.getElementById('high-score');
        if (highScoreElement) {
            highScoreElement.textContent = validHighScore.toLocaleString();
        }
        
        // Also update localStorage
        localStorage.setItem('spaceinvaders_highscore', validHighScore.toString());
    }
    
    // Settings management
    loadSettings() {
        const defaultSettings = {
            controlType: 'buttons',
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
            // Update touch controls configuration if TouchControls system is active
            if (this.game) {
                const gameScene = this.game.scene.getScene('GameScene');
                if (gameScene && gameScene.touchControls) {
                    gameScene.touchControls.setControlType(this.currentSettings.controlType);
                }
            }
            
            // Update the visual appearance
            this.showTouchControls();
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
        // For mobile users, show the pause menu when they tap the hamburger menu
        if (this.game) {
            const gameScene = this.game.scene.getScene('GameScene');
            if (gameScene && !gameScene.gameState.isGameOver) {
                gameScene.pauseGame();
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.spaceInvadersApp = new SpaceInvadersApp();
});

export default SpaceInvadersApp; 