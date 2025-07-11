// Space Invaders - Game Over Scene
export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    init(data) {
        this.app = this.registry.get('app');
        this.config = this.registry.get('config');
        this.finalScore = data.score || 0;
    }
    
    create() {
        // Create background
        this.add.rectangle(
            this.config.width / 2,
            this.config.height / 2,
            this.config.width,
            this.config.height,
            0x000000
        );
        
        // Add some stars
        this.createStarfield();
        
        // Game Over text
        this.add.text(
            this.config.width / 2,
            this.config.height / 2 - 120,
            'GAME OVER',
            {
                fontSize: '64px',
                fill: '#ff0000',
                fontFamily: 'Courier New',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        // Final Score
        this.add.text(
            this.config.width / 2,
            this.config.height / 2 - 40,
            `FINAL SCORE: ${this.finalScore.toLocaleString()}`,
            {
                fontSize: '32px',
                fill: '#00ff00',
                fontFamily: 'Courier New',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        // High Score check
        const highScore = parseInt(localStorage.getItem('spaceinvaders_highscore') || '0');
        if (this.finalScore > highScore) {
            this.add.text(
                this.config.width / 2,
                this.config.height / 2 + 20,
                '🎉 NEW HIGH SCORE! 🎉',
                {
                    fontSize: '24px',
                    fill: '#ffff00',
                    fontFamily: 'Courier New',
                    align: 'center'
                }
            ).setOrigin(0.5);
        }
        
        // Instructions
        this.add.text(
            this.config.width / 2,
            this.config.height / 2 + 80,
            'Use the menu buttons to play again or return to main menu',
            {
                fontSize: '18px',
                fill: '#00cc00',
                fontFamily: 'Courier New',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        console.log('💀 GameOverScene created with score:', this.finalScore);
    }
    
    createStarfield() {
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, this.config.width);
            const y = Phaser.Math.Between(0, this.config.height);
            const alpha = Phaser.Math.FloatBetween(0.2, 0.8);
            this.add.circle(x, y, 1, 0xffffff, alpha);
        }
    }
} 