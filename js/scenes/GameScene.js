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
        // Player ship (green rectangle)
        this.add.graphics()
            .fillStyle(0x00ff00)
            .fillRect(0, 0, 32, 16)
            .generateTexture('player', 32, 16);
        
        // Player bullet (white line)
        this.add.graphics()
            .fillStyle(0xffffff)
            .fillRect(0, 0, 2, 8)
            .generateTexture('player_bullet', 2, 8);
        
        // Alien sprites (different colors)
        this.add.graphics()
            .fillStyle(0xff0000)
            .fillRect(0, 0, 24, 16)
            .generateTexture('alien_red', 24, 16);
        
        this.add.graphics()
            .fillStyle(0xffff00)
            .fillRect(0, 0, 24, 16)
            .generateTexture('alien_yellow', 24, 16);
        
        this.add.graphics()
            .fillStyle(0x00ff00)
            .fillRect(0, 0, 24, 16)
            .generateTexture('alien_green', 24, 16);
        
        // Alien bullet (red line)
        this.add.graphics()
            .fillStyle(0xff0000)
            .fillRect(0, 0, 2, 8)
            .generateTexture('alien_bullet', 2, 8);
        
        // Barrier (brown rectangle)
        this.add.graphics()
            .fillStyle(0x8b4513)
            .fillRect(0, 0, 80, 60)
            .generateTexture('barrier', 80, 60);
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