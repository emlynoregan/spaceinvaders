// Simple Fullscreen API Implementation
export class SimpleFullscreen {
    constructor() {
        this.isFullscreen = false;
        this.userHasInteracted = false;
        this.setupFullscreenButton();
    }
    
    setupFullscreenButton() {
        // Create a fullscreen toggle button
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.id = 'fullscreen-toggle';
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 40px;
            height: 40px;
            background: rgba(0, 255, 0, 0.2);
            border: 2px solid #00ff00;
            border-radius: 5px;
            color: #00ff00;
            font-size: 18px;
            cursor: pointer;
            z-index: 1000;
            display: none;
        `;
        
        fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        document.body.appendChild(fullscreenBtn);
        this.fullscreenBtn = fullscreenBtn;
        
        // Show button on mobile in landscape
        this.updateButtonVisibility();
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.updateButtonVisibility(), 500);
        });
    }
    
    updateButtonVisibility() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (isMobile && isLandscape && !document.fullscreenElement) {
            this.fullscreenBtn.style.display = 'block';
        } else {
            this.fullscreenBtn.style.display = 'none';
        }
    }
    
    async toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                // Enter fullscreen
                const element = document.documentElement;
                
                if (element.requestFullscreen) {
                    await element.requestFullscreen();
                } else if (element.webkitRequestFullscreen) {
                    await element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    await element.msRequestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    await element.mozRequestFullScreen();
                }
                
                this.isFullscreen = true;
                this.fullscreenBtn.innerHTML = '⛷';
                this.fullscreenBtn.style.display = 'none'; // Hide button in fullscreen
                
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    await document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    await document.mozCancelFullScreen();
                }
                
                this.isFullscreen = false;
                this.fullscreenBtn.innerHTML = '⛶';
                this.updateButtonVisibility();
            }
        } catch (error) {
            console.log('Fullscreen request failed:', error);
            // Fallback to scroll method
            this.fallbackFullscreen();
        }
    }
    
    fallbackFullscreen() {
        // Force scroll to hide address bar
        document.body.style.height = '120vh';
        setTimeout(() => {
            window.scrollTo(0, window.innerHeight * 0.1);
        }, 100);
    }
    
    // Listen for fullscreen changes
    init() {
        document.addEventListener('fullscreenchange', () => {
            this.updateButtonVisibility();
        });
        
        document.addEventListener('webkitfullscreenchange', () => {
            this.updateButtonVisibility();
        });
    }
} 