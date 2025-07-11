// Space Invaders - Touch Controls Module
export class TouchControls {
    constructor(config, gameScene) {
        this.config = config;
        this.gameScene = gameScene;
        this.isActive = false;
        this.currentControlType = config.mobile.touchControlType;
        
        // Touch state tracking
        this.touchState = {
            isMoving: false,
            isFiring: false,
            currentX: 0,
            startX: 0,
            startY: 0,
            startTime: 0,
            isDragging: false
        };
        
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
        this.touchZones = this.touchControlsContainer?.querySelector('.touch-zones');
        
        // Get individual buttons
        this.buttons.left = document.getElementById('btn-left');
        this.buttons.right = document.getElementById('btn-right');
        this.buttons.fire = document.getElementById('btn-fire');
        
        // Get touch zones
        this.movementZone = document.getElementById('movement-zone');
        this.fireZone = document.getElementById('fire-zone');
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
        
        // Bind gesture events to the game container
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            this.bindGestureEvents(gameContainer);
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
    
    bindGestureEvents(container) {
        const handleTouchStart = (e) => {
            if (this.currentControlType !== 'gesture') return;
            
            e.preventDefault();
            
            const touch = e.touches[0];
            this.touchState.startX = touch.clientX;
            this.touchState.startY = touch.clientY;
            this.touchState.startTime = Date.now();
            this.touchState.isDragging = false;
            this.touchState.currentX = touch.clientX;
            
            // Show visual feedback
            this.showTouchFeedback(touch.clientX, touch.clientY);
            
            // Determine if touch is in movement zone or fire zone
            const containerRect = container.getBoundingClientRect();
            const relativeY = (touch.clientY - containerRect.top) / containerRect.height;
            
            if (relativeY > 0.6) {
                // Lower 40% is movement zone
                this.touchState.isMoving = true;
            } else {
                // Upper 60% is fire zone
                this.touchState.isFiring = true;
            }
        };
        
        const handleTouchMove = (e) => {
            if (this.currentControlType !== 'gesture') return;
            
            e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - this.touchState.startX);
            const deltaY = Math.abs(touch.clientY - this.touchState.startY);
            
            // If movement exceeds threshold, consider it a drag
            if (deltaX > this.config.mobile.gestureThreshold || 
                deltaY > this.config.mobile.gestureThreshold) {
                this.touchState.isDragging = true;
            }
            
            // Handle player movement if in movement zone and dragging horizontally
            if (this.touchState.isMoving && deltaX > this.config.mobile.gestureThreshold) {
                const containerRect = container.getBoundingClientRect();
                const relativeX = (touch.clientX - containerRect.left) / containerRect.width;
                const gameX = relativeX * this.config.width;
                
                this.handlePlayerMovement(gameX);
                this.touchState.currentX = touch.clientX;
            }
        };
        
        const handleTouchEnd = (e) => {
            if (this.currentControlType !== 'gesture') return;
            
            e.preventDefault();
            
            const touchDuration = Date.now() - this.touchState.startTime;
            
            // If it was a quick tap in fire zone and not a drag, fire
            if (this.touchState.isFiring && 
                touchDuration < this.config.mobile.fireTapDuration && 
                !this.touchState.isDragging) {
                this.handlePlayerFire();
                this.triggerHapticFeedback('medium');
            }
            
            // Reset touch state
            this.touchState.isMoving = false;
            this.touchState.isFiring = false;
            this.touchState.isDragging = false;
        };
        
        // Bind touch events
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: false });
        container.addEventListener('touchcancel', handleTouchEnd, { passive: false });
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
                    this.gameScene?.startFiring?.();
                } else {
                    this.gameScene?.stopFiring?.();
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
        this.currentControlType = type;
        
        if (!this.touchControlsContainer) return;
        
        if (type === 'buttons') {
            this.showVirtualButtons();
        } else {
            this.showGestureControls();
        }
    }
    
    showVirtualButtons() {
        if (this.controlButtons) {
            this.controlButtons.classList.add('visible');
            this.controlButtons.style.opacity = this.config.mobile.buttonOpacity;
        }
        
        if (this.touchZones) {
            this.touchZones.classList.remove('active');
        }
    }
    
    showGestureControls() {
        if (this.controlButtons) {
            this.controlButtons.classList.remove('visible');
        }
        
        if (this.touchZones) {
            this.touchZones.classList.add('active');
            
            // Show debug zones if enabled
            if (this.config.debug.showTouchZones) {
                this.touchZones.classList.add('debug');
            }
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