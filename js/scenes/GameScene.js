// Space Invaders - Game Scene
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init() {
        // Get references from game registry
        this.app = this.registry.get('app');
        this.config = this.registry.get('config');
        this.settings = this.registry.get('settings');
        
        // Debug config loading
        console.log('🎮 GameScene init - Config loaded:', !!this.config);
        console.log('🎮 Alien points config:', this.config?.scoring?.alienPoints);
        
        // Initialize game state
        this.gameState = {
            score: 0,
            lives: this.config.scoring.startingLives,
            wave: 1,
            isGameOver: false,
            isPaused: false,
            isTransitioningWave: false, // Prevent multiple wave transitions
            nextExtraLifeScore: this.config.scoring.extraLifeScore, // Track next extra life threshold
            alienFiringChance: this.config.difficulty.baseFiringChance // Dynamic firing frequency
        };
        
        // Player state
        this.playerState = {
            canFire: true,
            fireDelay: 250,
            speed: this.config.gameplay.playerSpeed,
            isMovingLeft: false,
            isMovingRight: false
        };
        
        // Initialize sound system
        this.initSoundSystem();
        
        console.log('🎮 GameScene initialized');
    }
    
    initSoundSystem() {
        // Create AudioContext for Web Audio API
        this.audioContext = null;
        this.sounds = {};
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
            console.log('🎵 Audio system initialized');
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }
    
    createSounds() {
        // Create simple sound effects using oscillators
        this.soundFrequencies = {
            player_shoot: [800, 600],
            alien_death: [200, 150],
            player_death: [100], // Single tone to prevent infinite looping
            barrier_hit: [300],
            barrier_destroy: [150, 100],
            alien_move: [150],
            ufo: [400, 450, 400, 450]
        };
    }
    
    playSound(soundName, duration = 0.1) {
        if (!this.audioContext || 
            this.audioContext.state === 'suspended' || 
            !this.settings?.sfxVolume || 
            this.settings.sfxVolume === 0 ||
            this.gameState.isGameOver) {
            return;
        }
        
        const frequencies = this.soundFrequencies[soundName];
        if (!frequencies) return;
        
        const volume = (this.settings.sfxVolume / 100) * 0.3; // Max 30% volume
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                if (!this.gameState.isGameOver) { // Double check game isn't over
                    this.createBeep(freq, duration, volume);
                }
            }, index * duration * 1000);
        });
    }
    
    createBeep(frequency, duration, volume) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'square'; // Retro sound
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    preload() {
        // Create simple colored rectangles as placeholders for sprites
        this.createPlaceholderAssets();
    }
    
    createPlaceholderAssets() {
        // Player ship (detailed spaceship)
        const playerGraphics = this.add.graphics();
        
        // Main ship body (green)
        playerGraphics.fillStyle(0x00ff00);
        playerGraphics.fillTriangle(16, 0, 4, 12, 28, 12); // main hull
        playerGraphics.fillRect(14, 8, 4, 8); // center body
        
        // Engine details (darker green)
        playerGraphics.fillStyle(0x008800);
        playerGraphics.fillRect(6, 12, 4, 4); // left engine
        playerGraphics.fillRect(22, 12, 4, 4); // right engine
        
        // Cockpit (bright green)
        playerGraphics.fillStyle(0x88ff88);
        playerGraphics.fillRect(15, 4, 2, 4); // cockpit window
        
        // Wing details (white)
        playerGraphics.fillStyle(0xffffff);
        playerGraphics.fillRect(2, 10, 4, 2); // left wing tip
        playerGraphics.fillRect(26, 10, 4, 2); // right wing tip
        
        playerGraphics.generateTexture('player', 32, 16);
        playerGraphics.destroy();
        
        // Player bullet (bright white projectile)
        const bulletGraphics = this.add.graphics();
        bulletGraphics.fillStyle(0xffffff);
        bulletGraphics.fillRect(0, 0, 3, 8);
        bulletGraphics.generateTexture('player_bullet', 3, 8);
        bulletGraphics.destroy();
        
        // Red alien (top row - octopus-like)
        this.createAlienSprite('alien_red', 0xff0000, 'octopus');
        
        // Yellow alien (middle rows - crab-like)
        this.createAlienSprite('alien_yellow', 0xffff00, 'crab');
        
        // Green alien (bottom rows - squid-like)
        this.createAlienSprite('alien_green', 0x00ff00, 'squid');
        
        // Alien bullet (red projectile)
        const alienBulletGraphics = this.add.graphics();
        alienBulletGraphics.fillStyle(0xff0000);
        alienBulletGraphics.fillRect(0, 0, 3, 8);
        alienBulletGraphics.generateTexture('alien_bullet', 3, 8);
        alienBulletGraphics.destroy();
        
        // Barrier (pixelated defensive wall)
        this.createBarrierSprite();
    }
    
    createAlienSprite(textureName, color, type) {
        const graphics = this.add.graphics();
        graphics.fillStyle(color);
        
        switch (type) {
            case 'octopus':
                // Octopus alien (top row)
                graphics.fillRect(8, 4, 8, 2);    // top
                graphics.fillRect(4, 6, 16, 4);   // head
                graphics.fillRect(6, 10, 12, 2);  // body
                graphics.fillRect(2, 12, 4, 2);   // left tentacle
                graphics.fillRect(6, 12, 4, 2);   // left-mid tentacle
                graphics.fillRect(14, 12, 4, 2);  // right-mid tentacle
                graphics.fillRect(18, 12, 4, 2);  // right tentacle
                // Eyes
                graphics.fillStyle(0x000000);
                graphics.fillRect(7, 7, 2, 2);
                graphics.fillRect(15, 7, 2, 2);
                break;
                
            case 'crab':
                // Crab alien (middle rows)
                graphics.fillRect(6, 2, 12, 2);   // top shell
                graphics.fillRect(4, 4, 16, 6);   // main body
                graphics.fillRect(2, 10, 4, 2);   // left claw
                graphics.fillRect(8, 10, 2, 2);   // left leg
                graphics.fillRect(14, 10, 2, 2);  // right leg
                graphics.fillRect(18, 10, 4, 2);  // right claw
                // Eyes
                graphics.fillStyle(0x000000);
                graphics.fillRect(8, 6, 2, 2);
                graphics.fillRect(14, 6, 2, 2);
                break;
                
            case 'squid':
                // Squid alien (bottom rows)
                graphics.fillRect(6, 2, 12, 6);   // head
                graphics.fillRect(8, 8, 8, 2);    // body
                graphics.fillRect(4, 10, 2, 2);   // left tentacle
                graphics.fillRect(8, 10, 2, 2);   // left-mid tentacle
                graphics.fillRect(14, 10, 2, 2);  // right-mid tentacle
                graphics.fillRect(18, 10, 2, 2);  // right tentacle
                graphics.fillRect(10, 12, 4, 2);  // bottom tentacle
                // Eyes
                graphics.fillStyle(0x000000);
                graphics.fillRect(9, 4, 2, 2);
                graphics.fillRect(13, 4, 2, 2);
                break;
        }
        
        graphics.generateTexture(textureName, 24, 16);
        graphics.destroy();
    }
    
    createBarrierSprite() {
        // Create a simple 5x5 barrier pixel sprite
        const graphics = this.add.graphics();
        graphics.fillStyle(0x00ff00);
        graphics.fillRect(0, 0, 5, 5); // 5x5 pixel - simple and effective
        graphics.generateTexture('barrier_pixel', 5, 5);
        graphics.destroy();
        
        console.log('🧱 Simple 5x5 barrier pixel texture created');
    }
    
    create() {
        // Create starfield background
        this.createStarfield();
        
        // Create game objects
        this.createPlayer();
        this.createBulletGroups(); // Create bullets before setting up physics
        this.createAliens();
        this.createBarriers();
        
        // Setup input
        this.setupInput();
        
        // Setup touch controls if mobile
        if (this.app?.isMobile) {
            this.setupTouchControls();
        }
        
        // Setup physics (after all objects are created)
        this.setupPhysics();
        
        // Update UI
        this.updateUI();
        
        console.log('✅ GameScene created successfully');
        console.log('🛡️ Barriers created:', this.barriers.children.size);
    }
    
    createStarfield() {
        // Simple starfield background
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, this.config.width);
            const y = Phaser.Math.Between(0, this.config.height);
            const star = this.add.circle(x, y, 1, 0xffffff, 0.6);
            star.setScrollFactor(0);
        }
    }
    
    createPlayer() {
        this.player = this.physics.add.sprite(
            this.config.width / 2,
            this.config.height - 50,
            'player'
        );
        
        this.player.setCollideWorldBounds(true);
        this.player.setImmovable(true);
        
        // Set player bounds
        const padding = 20;
        this.player.body.setSize(32, 16);
        this.player.body.setMaxVelocity(this.playerState.speed, 0);
    }
    
    createAliens() {
        this.aliens = this.physics.add.group();
        
        const formation = this.config.gameplay.alienFormation;
        const alienTypes = ['alien_red', 'alien_yellow', 'alien_yellow', 'alien_green', 'alien_green'];
        
        for (let row = 0; row < formation.rows; row++) {
            for (let col = 0; col < formation.cols; col++) {
                const x = formation.offsetX + (col * formation.spacing);
                const y = formation.offsetY + (row * 40);
                const alienType = alienTypes[row] || 'alien_green';
                
                const alien = this.physics.add.sprite(x, y, alienType);
                const points = this.getAlienPoints(alienType);
                alien.setData('points', points);
                alien.setData('row', row);
                alien.setData('col', col);
                
                // Debug logging for first few aliens
                if (row === 0 && col < 3) {
                    console.log(`👾 Created ${alienType} alien at (${x},${y}) with ${points} points`);
                }
                
                this.aliens.add(alien);
            }
        }
        
        console.log(`👾 Created ${this.aliens.children.size} aliens total`);
        
        // Setup alien movement
        this.alienDirection = 1; // 1 for right, -1 for left
        this.alienSpeed = this.config.gameplay.alienSpeed;
        this.lastAlienMove = 0;
        this.alienMoveDelay = 800; // Start at a reasonable pace (was 1000ms)
    }
    
    createBarriers() {
        this.barriers = this.physics.add.group(); // Keep as physics group for collision detection
        this.barrierPixels = []; // Store all barrier pixels for easy access
        
        // Classic Space Invaders barrier pattern
        const barrierPattern = [
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,0,0,0,0,0,0,1,1,1,1],
            [1,1,1,0,0,0,0,0,0,0,0,1,1,1],
            [1,1,0,0,0,0,0,0,0,0,0,0,1,1],
            [1,1,0,0,0,0,0,0,0,0,0,0,1,1],
            [1,1,0,0,0,0,0,0,0,0,0,0,1,1]
        ];
        
        const barrierConfig = this.config.gameplay.barriers;
        const pixelSize = 5; // Simple 5x5 pixels
        const patternWidth = barrierPattern[0].length * pixelSize;
        
        // Calculate starting position for barriers
        const totalWidth = barrierConfig.count * patternWidth + (barrierConfig.count - 1) * barrierConfig.spacing;
        const startX = (this.config.width - totalWidth) / 2;
        
        for (let barrierIndex = 0; barrierIndex < barrierConfig.count; barrierIndex++) {
            const barrierX = startX + barrierIndex * (patternWidth + barrierConfig.spacing);
            const barrierPixelGroup = [];
            
            // Create each pixel of the barrier - SIMPLE approach
            barrierPattern.forEach((row, y) => {
                row.forEach((pixel, x) => {
                    if (pixel === 1) {
                        const pixelX = barrierX + x * pixelSize;
                        const pixelY = barrierConfig.offsetY + y * pixelSize;
                        
                        // Just create a simple physics sprite - let Phaser handle everything else
                        const barrierPixel = this.physics.add.sprite(pixelX, pixelY, 'barrier_pixel');
                        barrierPixel.body.setImmovable(true);
                        
                        this.barriers.add(barrierPixel);
                        barrierPixelGroup.push(barrierPixel);
                    }
                });
            });
            
            this.barrierPixels[barrierIndex] = barrierPixelGroup;
        }
        
        console.log(`🛡️ Created ${this.barriers.children.size} barrier pixels across ${barrierConfig.count} barriers (SIMPLE METHOD)`);
    }
    
    createBulletGroups() {
        this.playerBullets = this.physics.add.group({
            defaultKey: 'player_bullet',
            maxSize: this.config.performance.maxBullets,
            runChildUpdate: true
        });
        
        this.alienBullets = this.physics.add.group({
            defaultKey: 'alien_bullet',
            maxSize: this.config.performance.maxBullets,
            runChildUpdate: true
        });
        
        console.log('🔫 Bullet groups created');
    }
    
    setupInput() {
        // Desktop keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('A,D,SPACE,P,ESC');
    }
    
    setupTouchControls() {
        // Import and setup touch controls
        import('../mobile/TouchControls.js').then(({ TouchControls }) => {
            console.log('🎮 Setting up TouchControls for mobile...');
            
            // Get user settings from the app
            const userSettings = this.app?.currentSettings || {};
            const controlType = userSettings.controlType || this.config.mobile.touchControlType;
            
            this.touchControls = new TouchControls(this.config, this);
            this.touchControls.setControlType(controlType);
            this.touchControls.activate();
            
            console.log(`📱 TouchControls activated with type: ${controlType}`);
        }).catch(error => {
            console.error('❌ Failed to load TouchControls:', error);
        });
    }
    
    setupPhysics() {
        // Set up alien collisions (separate method so it can be re-called for new waves)
        this.setupAlienCollisions();
        
        // Set up barrier collisions (separate method so it can be re-called for new waves)
        this.setupBarrierCollisions();
        
        // Alien bullets vs player
        this.physics.add.overlap(this.alienBullets, this.player, this.alienBulletHitPlayer, null, this);
        
        console.log('🔧 Physics setup complete');
    }
    
    setupAlienCollisions() {
        // Player bullets vs aliens
        this.physics.add.overlap(this.playerBullets, this.aliens, this.playerBulletHitAlien, null, this);
        
        // Aliens vs player (collision)
        this.physics.add.overlap(this.aliens, this.player, this.alienHitPlayer, null, this);
        
        console.log('👾 Alien collision detection established');
    }
    
    setupBarrierCollisions() {
        // Player bullets vs barriers
        this.physics.add.overlap(this.playerBullets, this.barriers, this.bulletHitBarrier, null, this);
        
        // Alien bullets vs barriers
        this.physics.add.overlap(this.alienBullets, this.barriers, this.bulletHitBarrier, null, this);
        
        console.log(`🛡️ Barrier collision detection established for ${this.barriers.children.size} barrier pixels`);
    }
    
    update(time, delta) {
        if (this.gameState.isPaused || this.gameState.isGameOver) {
            return;
        }
        
        this.handlePlayerInput();
        this.updateAliens(time);
        this.updateBullets();
        this.checkWaveComplete();
        
        // Clean up off-screen bullets
        this.cleanupBullets();
    }
    
    handlePlayerInput() {
        const player = this.player;
        
        // Don't handle input if player doesn't exist or game is over/paused
        if (!player || this.gameState.isGameOver || this.gameState.isPaused) {
            return;
        }
        
        // Reset velocity (always do this to stop momentum)
        player.setVelocityX(0);
        
        // Handle movement (even if invisible during respawn - the physics should still work)
        if (this.cursors.left.isDown || this.keys.A.isDown || this.playerState.isMovingLeft) {
            player.setVelocityX(-this.playerState.speed);
        } else if (this.cursors.right.isDown || this.keys.D.isDown || this.playerState.isMovingRight) {
            player.setVelocityX(this.playerState.speed);
        }
        
        // Handle firing
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
            this.firePlayerBullet();
        }
        
        // Handle pause
        if (Phaser.Input.Keyboard.JustDown(this.keys.P) || Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
            this.pauseGame();
        }
    }
    
    updateAliens(time) {
        if (time - this.lastAlienMove > this.alienMoveDelay) {
            this.moveAliens();
            this.lastAlienMove = time;
            
            // Randomly fire alien bullets
            this.alienFire();
        }
    }
    
    moveAliens() {
        let shouldDrop = false;
        const moveDistance = 20;
        
        // Check if any alien hits the edge
        this.aliens.children.entries.forEach(alien => {
            if ((this.alienDirection > 0 && alien.x >= this.config.width - 50) ||
                (this.alienDirection < 0 && alien.x <= 50)) {
                shouldDrop = true;
            }
        });
        
        if (shouldDrop) {
            // Change direction and drop down
            this.alienDirection *= -1;
            this.aliens.children.entries.forEach(alien => {
                alien.y += this.config.gameplay.alienDropDistance;
            });
            
            // Check if any alien reached the bottom (game over condition)
            const lowestAlien = Math.max(...this.aliens.children.entries.map(alien => alien.y));
            if (lowestAlien >= this.config.height - 100) { // Close to player level
                console.log('👾 Aliens reached the bottom! Game Over!');
                this.alienInvasionGameOver();
                return;
            }
            
            // Speed increase is now handled by wave progression, not movement cycles
            
            // Play alien drop sound
            this.playSound('alien_move', 0.05);
        } else {
            // Move horizontally
            this.aliens.children.entries.forEach(alien => {
                alien.x += moveDistance * this.alienDirection;
            });
            
            // Play alien movement sound
            this.playSound('alien_move', 0.05);
        }
    }
    
    alienInvasionGameOver() {
        this.gameState.isGameOver = true;
        this.gameState.isTransitioningWave = false; // Reset transition flag for clean restart
        
        // Stop all audio
        if (this.audioContext) {
            this.audioContext.suspend();
        }
        
        console.log('👾 INVASION COMPLETE! The aliens have reached Earth!');
        
        // Show special invasion game over message
        this.app?.showGameOver?.(this.gameState.score, 'INVASION COMPLETE!');
        
        // Update high score
        this.updateHighScore();
    }
    
    alienFire() {
        if (this.aliens.children.size === 0) return;
        
        // Create weighted firing system based on proximity to player
        const playerX = this.player.x;
        const playerY = this.player.y;
        
        // Calculate firing weights for each alien based on proximity
        const alienWeights = [];
        this.aliens.children.entries.forEach(alien => {
            const distanceY = Math.abs(playerY - alien.y); // Vertical distance (most important)
            const distanceX = Math.abs(playerX - alien.x); // Horizontal distance (less important)
            
            // Closer aliens (smaller distance) get higher weight
            // Y-distance is weighted more heavily than X-distance
            const proximityScore = 1000 - (distanceY * 0.8 + distanceX * 0.2);
            const weight = Math.max(1, proximityScore / 100); // Ensure minimum weight of 1
            
            alienWeights.push({ alien, weight });
        });
        
        // Calculate total weight for probability distribution
        const totalWeight = alienWeights.reduce((sum, item) => sum + item.weight, 0);
        
        // Use dynamic firing chance with weighted selection
        if (Math.random() < this.gameState.alienFiringChance) {
            // Select alien based on weighted probability
            let randomValue = Math.random() * totalWeight;
            let selectedAlien = null;
            
            for (const { alien, weight } of alienWeights) {
                randomValue -= weight;
                if (randomValue <= 0) {
                    selectedAlien = alien;
                    break;
                }
            }
            
            // Fallback to random selection if weighted selection fails
            if (!selectedAlien) {
                selectedAlien = Phaser.Utils.Array.GetRandom(this.aliens.children.entries);
            }
            
            this.fireAlienBullet(selectedAlien.x, selectedAlien.y);
            console.log(`👾 Alien fired! (${(this.gameState.alienFiringChance * 100).toFixed(1)}% chance, proximity-weighted)`);
        }
    }
    
    updateBullets() {
        // Clean up off-screen player bullets
        this.playerBullets.children.entries.forEach(bullet => {
            if (bullet.active && bullet.y < 0) {
                bullet.setActive(false).setVisible(false);
                bullet.body.enable = false;
            }
        });
        
        // Clean up off-screen alien bullets
        this.alienBullets.children.entries.forEach(bullet => {
            if (bullet.active && bullet.y > this.config.height) {
                bullet.setActive(false).setVisible(false);
                bullet.body.enable = false;
            }
        });
    }
    
    firePlayerBullet() {
        if (!this.playerState.canFire) return;
        
        // Get or create bullet
        let bullet = this.playerBullets.getFirstDead();
        if (!bullet) {
            bullet = this.physics.add.sprite(0, 0, 'player_bullet');
            this.playerBullets.add(bullet);
        }
        
        // Position and activate bullet
        bullet.setActive(true).setVisible(true);
        bullet.body.enable = true;
        bullet.x = this.player.x;
        bullet.y = this.player.y - 10;
        bullet.setVelocityY(-400);
        
        // console.log(`🔫 Player bullet fired`); // Commented out to reduce spam
        
        // Play shoot sound
        this.playSound('player_shoot', 0.1);
        
        // Set fire cooldown
        this.playerState.canFire = false;
        this.time.delayedCall(this.playerState.fireDelay, () => {
            this.playerState.canFire = true;
        });
    }
    
    fireAlienBullet(x, y) {
        const bullet = this.alienBullets.get(x, y + 20);
        
        if (bullet) {
            bullet.setActive(true).setVisible(true);
            if (bullet.body) {
                bullet.body.enable = true;
                bullet.setVelocityY(200); // Set initial velocity
            }
        }
    }
    
    // Collision handlers
    playerBulletHitAlien(bullet, alien) {
        console.log('🎯 Bullet hit alien detected!'); // Debug
        
        bullet.setActive(false).setVisible(false);
        bullet.body.enable = false;
        
        // Play alien death sound
        this.playSound('alien_death', 0.15);
        
        // Add score BEFORE destroying alien
        const points = alien.getData('points');
        console.log(`💰 Alien points retrieved:`, points); // Debug
        console.log(`💰 Alien type:`, alien.texture.key); // Debug
        
        this.addScore(points);
        
        // Destroy alien after scoring
        alien.destroy();
        
        console.log(`💥 Alien destroyed! +${points} points, new score: ${this.gameState.score}`);
    }
    
    bulletHitBarrier(bullet, barrierPixel) {
        console.log(`🛡️ Bullet hit barrier pixel - guaranteed destruction + explosion!`);
        
        // Destroy the bullet
        bullet.setActive(false).setVisible(false);
        bullet.body.enable = false;
        
        // ALWAYS destroy the pixel that was actually hit first
        const hitPixel = barrierPixel;
        const impactX = hitPixel.x;
        const impactY = hitPixel.y;
        
        // Start with the hit pixel
        const pixelsToDestroy = [hitPixel];
        
        // Add nearby pixels for explosion effect (but exclude the hit pixel to avoid duplicates)
        const explosionRadius = 8;
        this.barriers.children.entries.forEach(pixel => {
            if (pixel.active && pixel !== hitPixel) {
                const distance = Phaser.Math.Distance.Between(impactX, impactY, pixel.x, pixel.y);
                if (distance <= explosionRadius) {
                    pixelsToDestroy.push(pixel);
                }
            }
        });
        
        // Destroy all pixels with slight visual delay for explosion effect
        pixelsToDestroy.forEach((pixel, index) => {
            this.time.delayedCall(index * 5, () => {
                if (pixel.active) {
                    pixel.destroy();
                }
            });
        });
        
        // Play appropriate sound
        if (pixelsToDestroy.length > 1) {
            this.playSound('barrier_destroy');
        } else {
            this.playSound('barrier_hit');
        }
        
        console.log(`💥 Destroyed ${pixelsToDestroy.length} barrier pixels (hit + explosion)!`);
    }
    
    alienBulletHitPlayer(bullet, player) {
        bullet.setActive(false).setVisible(false);
        bullet.body.enable = false;
        this.playerHit();
    }
    
    alienHitPlayer(alien, player) {
        this.playerHit();
    }
    
    playerHit() {
        // Prevent multiple hits in quick succession
        if (this.player.getData('invulnerable')) {
            return;
        }
        
        console.log('💀 Player hit! Starting death sequence...');
        
        this.gameState.lives--;
        this.updateUI();
        
        // Play player hit sound (single tone, shorter)
        this.playSound('player_death', 0.15);
        
        console.log(`💀 Player hit! Lives remaining: ${this.gameState.lives}`);
        
        if (this.gameState.lives <= 0) {
            // Game over - hide player and end game
            this.player.setVisible(false);
            this.gameOver();
        } else {
            // Respawn sequence - hide player temporarily but DON'T disable physics
            this.player.setVisible(false);
            this.player.setData('invulnerable', true);
            
            // Stop any movement but keep physics enabled
            if (this.player.body) {
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                // Keep physics body enabled!
            }
            
            console.log('⏳ Player hidden, will respawn in 2 seconds...');
            
            // Respawn after 2 seconds
            this.time.delayedCall(2000, () => {
                this.respawnPlayer();
            });
        }
    }
    
    respawnPlayer() {
        // Check if aliens reached bottom while player was dead
        const lowestAlien = this.aliens.children.size > 0 ? 
            Math.max(...this.aliens.children.entries.map(alien => alien.y)) : 0;
        
        if (lowestAlien >= this.config.height - 100) {
            console.log('👾 Aliens reached bottom during respawn!');
            this.alienInvasionGameOver();
            return;
        }
        
        // Reset player position and physics
        this.player.x = this.config.width / 2;
        this.player.y = this.config.height - 50;
        
        // Ensure player physics body is properly enabled
        if (this.player.body) {
            this.player.body.enable = true;
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }
        
        // Reset player state
        this.playerState.isMovingLeft = false;
        this.playerState.isMovingRight = false;
        this.playerState.canFire = true;
        
        // Make player visible and flash for invincibility period
        this.player.setVisible(true);
        this.player.setData('invulnerable', true);
        
        console.log('🚀 Player respawning at center position...');
        
        // Flash effect for invincibility
        let flashCount = 0;
        const flashTimer = this.time.addEvent({
            delay: 200,
            repeat: 9, // Flash 10 times (2 seconds)
            callback: () => {
                flashCount++;
                this.player.setVisible(flashCount % 2 === 0);
            }
        });
        
        // End invincibility after flashing
        this.time.delayedCall(2000, () => {
            this.player.setVisible(true);
            this.player.setData('invulnerable', false);
            console.log('✅ Player fully respawned! Movement and firing should work normally.');
        });
    }
    
    addScore(points) {
        // Ensure points is a valid number
        const validPoints = (typeof points === 'number' && !isNaN(points)) ? points : 0;
        
        this.gameState.score = (typeof this.gameState.score === 'number' && !isNaN(this.gameState.score)) ? this.gameState.score : 0;
        this.gameState.score += validPoints;
        
        this.updateUI();
        
        // Check for extra life
        if (this.gameState.score >= this.gameState.nextExtraLifeScore) {
            this.gameState.lives++;
            this.gameState.nextExtraLifeScore += this.config.scoring.extraLifeScore; // Increment for next extra life
            
            // Cap lives at reasonable maximum to prevent UI overflow
            const maxLives = 9;
            if (this.gameState.lives > maxLives) {
                this.gameState.lives = maxLives;
            }
            
            console.log('🎁 Extra life earned!');
        }
        
        console.log(`Score updated: +${validPoints} = ${this.gameState.score}`);
    }
    
    checkWaveComplete() {
        if (this.aliens.children.size === 0 && !this.gameState.isGameOver && !this.gameState.isTransitioningWave) {
            console.log('🎯 All aliens destroyed! Starting next wave...');
            this.gameState.isTransitioningWave = true; // Set flag to prevent multiple calls
            this.nextWave();
        }
    }
    
    nextWave() {
        this.gameState.wave++;
        this.addScore(this.config.scoring.waveBonus);
        
        // Only show wave announcement for Wave 2 and onwards (not the initial game start)
        if (this.gameState.wave > 1) {
            console.log(`🌊 Preparing Wave ${this.gameState.wave} announcement...`);
            
            // Show wave announcement
            this.app?.showWaveAnnouncement?.(this.gameState.wave);
            
            // Wait 2 seconds, then start the actual wave
            this.time.delayedCall(2000, () => {
                this.startNewWave();
            });
        } else {
            // For Wave 1 (initial game), start immediately without announcement
            this.startNewWave();
        }
    }
    
    startNewWave() {
        console.log(`🌊 Wave ${this.gameState.wave} starting! Ramping up difficulty...`);
        
        // Hide wave announcement
        this.app?.hideWaveAnnouncement?.();
        
        // Create new aliens (fresh formation)
        this.createAliens();
        
        // CRITICAL: Re-establish collision detection for new aliens
        this.setupAlienCollisions();
        
        // Reset alien movement direction and position
        this.alienDirection = 1;
        
        // AGGRESSIVE difficulty increase: speed up aliens significantly each wave
        this.alienMoveDelay = Math.max(
            this.config.difficulty.maxSpeed, 
            this.alienMoveDelay * this.config.difficulty.speedIncreasePerWave
        );
        
        // Increase alien firing frequency each wave (cap at maxFiringChance)
        this.gameState.alienFiringChance = Math.min(
            this.config.difficulty.maxFiringChance,
            this.gameState.alienFiringChance * this.config.difficulty.fireRateIncreasePerWave
        );
        
        // Regenerate barriers for new wave (pixel-by-pixel destructible)
        this.barriers.clear(true, true);
        this.barrierPixels = []; // Reset barrier pixel tracking
        this.createBarriers();
        
        // CRITICAL: Re-establish collision detection for new barriers
        this.setupBarrierCollisions();
        
        this.updateUI();
        
        // Reset transition flag now that new wave has started
        this.gameState.isTransitioningWave = false;
        
        console.log(`🔥 Wave ${this.gameState.wave} ready:`, {
            aliens: this.aliens.children.size,
            speed: `${this.alienMoveDelay}ms`,
            firingChance: `${(this.gameState.alienFiringChance * 100).toFixed(1)}%`
        });
    }
    
    pauseGame() {
        this.gameState.isPaused = true;
        this.scene.pause();
        this.app?.showPauseMenu?.();
        console.log('⏸️ Game paused');
    }
    
    resumeGame() {
        this.gameState.isPaused = false;
        this.scene.resume();
        console.log('▶️ Game resumed');
    }
    
    gameOver() {
        this.gameState.isGameOver = true;
        this.gameState.isTransitioningWave = false; // Reset transition flag for clean restart
        
        // Stop all audio to prevent infinite sounds
        if (this.audioContext) {
            this.audioContext.suspend();
        }
        
        console.log('💀 Game Over! Final score:', this.gameState.score);
        
        // Show game over screen
        this.app?.showGameOver?.(this.gameState.score);
        
        // Update high score
        this.updateHighScore();
    }
    
    updateHighScore() {
        const currentHigh = parseInt(localStorage.getItem('spaceinvaders_highscore') || '0');
        if (this.gameState.score > currentHigh) {
            localStorage.setItem('spaceinvaders_highscore', this.gameState.score.toString());
            this.app?.updateHighScore?.(this.gameState.score);
        }
    }
    
    updateUI() {
        // Update the HTML UI elements
        this.app?.updateScore?.(this.gameState.score);
        this.app?.updateLives?.(this.gameState.lives);
        this.app?.updateWave?.(this.gameState.wave);
    }
    
    cleanupBullets() {
        // Remove inactive bullets to prevent memory leaks
        this.playerBullets.children.entries.forEach(bullet => {
            if (!bullet.active && bullet.body) {
                bullet.body.enable = false;
            }
        });
        
        this.alienBullets.children.entries.forEach(bullet => {
            if (!bullet.active && bullet.body) {
                bullet.body.enable = false;
            }
        });
    }
    
    getAlienPoints(alienType) {
        const points = (() => {
            switch (alienType) {
                case 'alien_red': return this.config?.scoring?.alienPoints?.red;
                case 'alien_yellow': return this.config?.scoring?.alienPoints?.yellow;
                case 'alien_green': return this.config?.scoring?.alienPoints?.green;
                default: return this.config?.scoring?.alienPoints?.green;
            }
        })();
        
        // Ensure we always return a valid number
        const finalPoints = (typeof points === 'number' && !isNaN(points)) ? points : 10;
        
        return finalPoints;
    }
    
    // Mobile touch control handlers
    startMovingLeft() {
        this.playerState.isMovingLeft = true;
    }
    
    stopMovingLeft() {
        this.playerState.isMovingLeft = false;
    }
    
    startMovingRight() {
        this.playerState.isMovingRight = true;
    }
    
    stopMovingRight() {
        this.playerState.isMovingRight = false;
    }
    
    setPlayerPosition(x) {
        if (this.player) {
            this.player.x = Phaser.Math.Clamp(x, 50, this.config.width - 50);
        }
    }
    
    destroy() {
        // Clean up
        if (this.touchControls) {
            this.touchControls.destroy();
        }
    }
} 