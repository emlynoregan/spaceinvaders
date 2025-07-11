// Mobile Fullscreen Helper
export class FullscreenHelper {
    constructor() {
        this.isFullscreen = false;
        this.originalHeight = window.innerHeight;
        this.hideAddressBarAttempts = 0;
        this.maxHideAttempts = 10;
        
        this.init();
    }
    
    init() {
        // Hide address bar on load
        this.hideAddressBar();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Try to hide address bar when orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.hideAddressBar();
            }, 500);
        });
        
        // Hide address bar when the page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => {
                    this.hideAddressBar();
                }, 100);
            }
        });
    }
    
    setupEventListeners() {
        // Listen for resize events to adjust layout
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Listen for scroll events to hide address bar
        window.addEventListener('scroll', () => {
            this.hideAddressBar();
        });
        
        // Listen for touch events to trigger address bar hiding
        document.addEventListener('touchstart', () => {
            setTimeout(() => {
                this.hideAddressBar();
            }, 100);
        }, { passive: true });
    }
    
    hideAddressBar() {
        if (this.hideAddressBarAttempts >= this.maxHideAttempts) {
            return;
        }
        
        // Method 1: Scroll to hide address bar
        if (window.scrollY === 0) {
            window.scrollTo(0, 1);
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 10);
        }
        
        // Method 2: Force viewport height
        this.setViewportHeight();
        
        // Method 3: Request fullscreen if available
        this.requestFullscreen();
        
        this.hideAddressBarAttempts++;
        
        // Reset attempts after delay
        setTimeout(() => {
            this.hideAddressBarAttempts = 0;
        }, 5000);
    }
    
    setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Force height calculation
        document.body.style.height = '100vh';
        document.body.style.height = `calc(var(--vh, 1vh) * 100)`;
    }
    
    requestFullscreen() {
        const element = document.documentElement;
        
        if (element.requestFullscreen && !document.fullscreenElement) {
            // Only request if user interacted first (to avoid browser blocking)
            if (this.userHasInteracted) {
                element.requestFullscreen().catch(() => {
                    // Fullscreen request failed, that's okay
                });
            }
        } else if (element.webkitRequestFullscreen && !document.webkitFullscreenElement) {
            if (this.userHasInteracted) {
                element.webkitRequestFullscreen().catch(() => {
                    // Fullscreen request failed, that's okay
                });
            }
        }
    }
    
    handleResize() {
        // Update viewport height when window resizes
        this.setViewportHeight();
        
        // If height increased significantly, address bar probably hid
        const currentHeight = window.innerHeight;
        if (currentHeight > this.originalHeight * 1.1) {
            this.isFullscreen = true;
            document.body.classList.add('fullscreen-active');
        } else {
            this.isFullscreen = false;
            document.body.classList.remove('fullscreen-active');
        }
    }
    
    enableFullscreenMode() {
        // Add fullscreen class to body
        document.body.classList.add('mobile-fullscreen');
        
        // Hide address bar aggressively
        this.hideAddressBar();
        
        // Prevent scrolling
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Set up game container to fill screen
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.position = 'fixed';
            gameContainer.style.top = '0';
            gameContainer.style.left = '0';
            gameContainer.style.width = '100vw';
            gameContainer.style.height = '100vh';
            gameContainer.style.height = 'calc(var(--vh, 1vh) * 100)';
            gameContainer.style.zIndex = '1';
        }
    }
    
    disableFullscreenMode() {
        // Remove fullscreen class
        document.body.classList.remove('mobile-fullscreen');
        
        // Restore scrolling
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        
        // Reset game container
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.position = '';
            gameContainer.style.top = '';
            gameContainer.style.left = '';
            gameContainer.style.width = '';
            gameContainer.style.height = '';
            gameContainer.style.zIndex = '';
        }
    }
    
    // Call this when user first interacts
    markUserInteraction() {
        this.userHasInteracted = true;
    }
    
    // Check if we're in landscape mode
    isLandscape() {
        return window.innerWidth > window.innerHeight;
    }
    
    // Auto-enable fullscreen in landscape
    autoFullscreenInLandscape() {
        if (this.isLandscape()) {
            this.enableFullscreenMode();
        } else {
            this.disableFullscreenMode();
        }
    }
} 