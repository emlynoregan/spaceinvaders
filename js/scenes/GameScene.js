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
        
        // Initialize game state
        this.gameState = {
            score: 0,
            lives: this.config.scoring.startingLives,
            wave: 1,
            isGameOver: false,
            isPaused: false
        };
        
        // Player state
        this.playerState = {
            canFire: true,
            fireDelay: 250,
            speed: this.config.gameplay.playerSpeed,
            isMovingLeft: false,
            isMovingRight: false
        };
        
        console.log('🎮 GameScene initialized');
    }
    
    preload() {
        // Create simple colored rectangles as placeholders for sprites
        this.createPlaceholderAssets();
    }
    
    createPlaceholderAssets() {
        // Player ship (triangular spaceship)
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0x00ff00);
        // Draw a triangular spaceship
        playerGraphics.fillTriangle(16, 0, 0, 16, 32, 16);
        playerGraphics.fillRect(12, 10, 8, 6); // body
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
        const graphics = this.add.graphics();
        graphics.fillStyle(0x00ff00);
        
        // Create a pixelated barrier pattern
        const pixels = [
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
        
        const pixelSize = 5;
        pixels.forEach((row, y) => {
            row.forEach((pixel, x) => {
                if (pixel) {
                    graphics.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            });
        });
        
        graphics.generateTexture('barrier', 70, 60);
        graphics.destroy();
    }
    
    create() {
        // Create starfield background
        this.createStarfield();
        
        // Create game objects
        this.createPlayer();
        this.createAliens();
        this.createBarriers();
        this.createBulletGroups();
        
        // Setup input
        this.setupInput();
        
        // Setup touch controls if mobile
        if (this.app?.isMobile) {
            this.setupTouchControls();
        }
        
        // Setup physics
        this.setupPhysics();
        
        // Update UI
        this.updateUI();
        
        console.log('✅ GameScene created successfully');
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
                alien.setData('points', this.getAlienPoints(alienType));
                alien.setData('row', row);
                alien.setData('col', col);
                
                this.aliens.add(alien);
            }
        }
        
        // Setup alien movement
        this.alienDirection = 1; // 1 for right, -1 for left
        this.alienSpeed = this.config.gameplay.alienSpeed;
        this.lastAlienMove = 0;
        this.alienMoveDelay = 1000; // Start slow
    }
    
    createBarriers() {
        this.barriers = this.physics.add.staticGroup();
        
        const barrierConfig = this.config.gameplay.barriers;
        const startX = (this.config.width - (barrierConfig.count * barrierConfig.width + 
                       (barrierConfig.count - 1) * barrierConfig.spacing)) / 2;
        
        for (let i = 0; i < barrierConfig.count; i++) {
            const x = startX + i * (barrierConfig.width + barrierConfig.spacing) + barrierConfig.width / 2;
            const barrier = this.physics.add.sprite(x, barrierConfig.offsetY, 'barrier');
            barrier.setData('health', 5); // 5 hits to destroy
            this.barriers.add(barrier);
        }
    }
    
    createBulletGroups() {
        this.playerBullets = this.physics.add.group({
            defaultKey: 'player_bullet',
            maxSize: this.config.performance.maxBullets
        });
        
        this.alienBullets = this.physics.add.group({
            defaultKey: 'alien_bullet',
            maxSize: this.config.performance.maxBullets
        });
    }
    
    setupInput() {
        // Desktop keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('A,D,SPACE,P,ESC');
    }
    
    setupTouchControls() {
        // Import and setup touch controls
        import('../mobile/TouchControls.js').then(({ TouchControls }) => {
            this.touchControls = new TouchControls(this.config, this);
            this.touchControls.activate();
        });
    }
    
    setupPhysics() {
        // Player bullets vs aliens
        this.physics.add.overlap(this.playerBullets, this.aliens, this.playerBulletHitAlien, null, this);
        
        // Player bullets vs barriers
        this.physics.add.overlap(this.playerBullets, this.barriers, this.bulletHitBarrier, null, this);
        
        // Alien bullets vs player
        this.physics.add.overlap(this.alienBullets, this.player, this.alienBulletHitPlayer, null, this);
        
        // Alien bullets vs barriers
        this.physics.add.overlap(this.alienBullets, this.barriers, this.bulletHitBarrier, null, this);
        
        // Aliens vs player (collision)
        this.physics.add.overlap(this.aliens, this.player, this.alienHitPlayer, null, this);
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
        
        // Reset velocity
        player.setVelocityX(0);
        
        // Handle movement
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
            
            // Increase speed
            this.alienMoveDelay = Math.max(200, this.alienMoveDelay * 0.95);
        } else {
            // Move horizontally
            this.aliens.children.entries.forEach(alien => {
                alien.x += moveDistance * this.alienDirection;
            });
        }
    }
    
    alienFire() {
        if (this.aliens.children.size === 0) return;
        
        // Random chance to fire
        if (Math.random() < 0.02) {
            const randomAlien = Phaser.Utils.Array.GetRandom(this.aliens.children.entries);
            this.fireAlienBullet(randomAlien.x, randomAlien.y);
        }
    }
    
    updateBullets() {
        // Update player bullets
        this.playerBullets.children.entries.forEach(bullet => {
            if (bullet.active) {
                bullet.y -= 5;
                if (bullet.y < 0) {
                    bullet.setActive(false).setVisible(false);
                }
            }
        });
        
        // Update alien bullets
        this.alienBullets.children.entries.forEach(bullet => {
            if (bullet.active) {
                bullet.y += 3;
                if (bullet.y > this.config.height) {
                    bullet.setActive(false).setVisible(false);
                }
            }
        });
    }
    
    firePlayerBullet() {
        if (!this.playerState.canFire) return;
        
        const bullet = this.playerBullets.get(this.player.x, this.player.y - 20);
        
        if (bullet) {
            bullet.setActive(true).setVisible(true);
            bullet.body.enable = true;
            
            this.playerState.canFire = false;
            this.time.delayedCall(this.playerState.fireDelay, () => {
                this.playerState.canFire = true;
            });
            
            // Play sound effect (placeholder)
            console.log('🔫 Player fires!');
        }
    }
    
    fireAlienBullet(x, y) {
        const bullet = this.alienBullets.get(x, y + 20);
        
        if (bullet) {
            bullet.setActive(true).setVisible(true);
            bullet.body.enable = true;
        }
    }
    
    // Collision handlers
    playerBulletHitAlien(bullet, alien) {
        bullet.setActive(false).setVisible(false);
        alien.destroy();
        
        // Add score
        const points = alien.getData('points');
        this.addScore(points);
        
        console.log(`💥 Alien destroyed! +${points} points`);
    }
    
    bulletHitBarrier(bullet, barrier) {
        bullet.setActive(false).setVisible(false);
        
        // Damage barrier
        let health = barrier.getData('health');
        health--;
        barrier.setData('health', health);
        
        if (health <= 0) {
            barrier.destroy();
        } else {
            // Visual damage effect
            barrier.setTint(0x888888);
        }
    }
    
    alienBulletHitPlayer(bullet, player) {
        bullet.setActive(false).setVisible(false);
        this.playerHit();
    }
    
    alienHitPlayer(alien, player) {
        this.playerHit();
    }
    
    playerHit() {
        this.gameState.lives--;
        this.updateUI();
        
        console.log(`💀 Player hit! Lives remaining: ${this.gameState.lives}`);
        
        if (this.gameState.lives <= 0) {
            this.gameOver();
        } else {
            // Brief invincibility
            this.player.setTint(0xff0000);
            this.time.delayedCall(1000, () => {
                this.player.clearTint();
            });
        }
    }
    
    addScore(points) {
        this.gameState.score += points;
        this.updateUI();
        
        // Check for extra life
        if (this.gameState.score % this.config.scoring.extraLifeScore === 0) {
            this.gameState.lives++;
            console.log('🎁 Extra life earned!');
        }
    }
    
    checkWaveComplete() {
        if (this.aliens.children.size === 0) {
            this.nextWave();
        }
    }
    
    nextWave() {
        this.gameState.wave++;
        this.addScore(this.config.scoring.waveBonus);
        
        console.log(`🌊 Wave ${this.gameState.wave} starting!`);
        
        // Create new aliens
        this.createAliens();
        
        // Increase difficulty
        this.alienMoveDelay = Math.max(200, this.alienMoveDelay * this.config.difficulty.speedIncreasePerWave);
        
        this.updateUI();
    }
    
    pauseGame() {
        this.gameState.isPaused = true;
        this.scene.pause();
        this.app?.showPauseMenu?.();
    }
    
    gameOver() {
        this.gameState.isGameOver = true;
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
        switch (alienType) {
            case 'alien_red': return this.config.scoring.alienPoints.red;
            case 'alien_yellow': return this.config.scoring.alienPoints.yellow;
            case 'alien_green': return this.config.scoring.alienPoints.green;
            default: return this.config.scoring.alienPoints.green;
        }
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