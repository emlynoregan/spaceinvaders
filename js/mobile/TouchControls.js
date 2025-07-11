// Space Invaders - Touch Controls Module
export class TouchControls {
    constructor(config, gameScene) {
        this.config = config;
        this.gameScene = gameScene;
        this.isActive = false;
        this.currentControlType = 'buttons'; // Always use buttons now
        
        // Virtual button elements
        this.buttons = {
            left: null,
            right: null,
            fire: null
        };
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.bindEvents();
        this.setControlType(this.currentControlType);
    }
    
    setupElements() {
        // Get touch control elements
        this.touchControlsContainer = document.getElementById('touch-controls');
        this.controlButtons = this.touchControlsContainer?.querySelector('.control-buttons');
        
        // Get individual buttons
        this.buttons.left = document.getElementById('btn-left');
        this.buttons.right = document.getElementById('btn-right');
        this.buttons.fire = document.getElementById('btn-fire');
    }
    
    bindEvents() {
        if (this.buttons.left) {
            this.bindButtonEvents(this.buttons.left, 'left');
        }
        
        if (this.buttons.right) {
            this.bindButtonEvents(this.buttons.right, 'right');
        }
        
        if (this.buttons.fire) {
            this.bindButtonEvents(this.buttons.fire, 'fire');
        }
    }
    
    bindButtonEvents(button, action) {
        const handleStart = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            button.classList.add('pressed');
            button.classList.add('tap-animation');
            
            this.handleButtonPress(action, true);
            this.triggerHapticFeedback('light');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                button.classList.remove('tap-animation');
            }, 200);
        };
        
        const handleEnd = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            button.classList.remove('pressed');
            this.handleButtonPress(action, false);
        };
        
        // Touch events
        button.addEventListener('touchstart', handleStart, { passive: false });
        button.addEventListener('touchend', handleEnd, { passive: false });
        button.addEventListener('touchcancel', handleEnd, { passive: false });
        
        // Mouse events for testing on desktop
        button.addEventListener('mousedown', handleStart);
        button.addEventListener('mouseup', handleEnd);
        button.addEventListener('mouseleave', handleEnd);
    }
    

    
    handleButtonPress(action, pressed) {
        switch (action) {
            case 'left':
                if (pressed) {
                    this.gameScene?.startMovingLeft?.();
                } else {
                    this.gameScene?.stopMovingLeft?.();
                }
                break;
                
            case 'right':
                if (pressed) {
                    this.gameScene?.startMovingRight?.();
                } else {
                    this.gameScene?.stopMovingRight?.();
                }
                break;
                
            case 'fire':
                if (pressed) {
                    // Fire when button is pressed (not when released)
                    this.gameScene?.firePlayerBullet?.();
                    this.triggerHapticFeedback('medium');
                }
                break;
        }
    }
    
    handlePlayerMovement(x) {
        // Clamp to game boundaries
        const clampedX = Phaser.Math.Clamp(x, 50, this.config.width - 50);
        this.gameScene?.setPlayerPosition?.(clampedX);
    }
    
    handlePlayerFire() {
        this.gameScene?.firePlayerBullet?.();
    }
    
    showTouchFeedback(x, y) {
        const feedback = document.createElement('div');
        feedback.className = 'touch-feedback';
        feedback.style.left = `${x - 30}px`;
        feedback.style.top = `${y - 30}px`;
        feedback.style.position = 'fixed';
        feedback.style.pointerEvents = 'none';
        feedback.style.zIndex = '1000';
        
        document.body.appendChild(feedback);
        
        // Remove after animation completes
        setTimeout(() => {
            if (document.body.contains(feedback)) {
                document.body.removeChild(feedback);
            }
        }, 600);
    }
    
    triggerHapticFeedback(intensity = 'light') {
        if (navigator.vibrate && this.config.mobile.hapticFeedback) {
            const durations = { 
                light: 50, 
                medium: 100, 
                heavy: 200 
            };
            navigator.vibrate(durations[intensity] || 50);
        }
    }
    
    setControlType(type) {
        this.currentControlType = 'buttons'; // Always use buttons
        this.showVirtualButtons();
    }
    
    showVirtualButtons() {
        if (this.controlButtons) {
            this.controlButtons.classList.add('visible');
            this.controlButtons.style.opacity = this.config.mobile.buttonOpacity || 0.8;
        }
    }
    
    activate() {
        if (this.touchControlsContainer) {
            this.touchControlsContainer.style.display = 'block';
            this.touchControlsContainer.classList.add('active');
            this.isActive = true;
        }
    }
    
    deactivate() {
        if (this.touchControlsContainer) {
            this.touchControlsContainer.style.display = 'none';
            this.touchControlsContainer.classList.remove('active');
            this.isActive = false;
        }
    }
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    updateGameScene(gameScene) {
        this.gameScene = gameScene;
    }
    
    destroy() {
        // Clean up event listeners and elements
        this.deactivate();
        
        // Remove any remaining touch feedback elements
        const feedbacks = document.querySelectorAll('.touch-feedback');
        feedbacks.forEach(feedback => {
            if (document.body.contains(feedback)) {
                document.body.removeChild(feedback);
            }
        });
    }
    
    // Utility methods for debugging
    logTouchState() {
        console.log('Touch State:', this.touchState);
    }
    
    toggleDebugMode() {
        if (this.touchZones) {
            this.touchZones.classList.toggle('debug');
        }
    }
} 