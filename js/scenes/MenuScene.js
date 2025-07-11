// Space Invaders - Menu Scene
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    init() {
        this.app = this.registry.get('app');
        this.config = this.registry.get('config');
    }
    
    create() {
        // Create a simple background
        this.add.rectangle(
            this.config.width / 2,
            this.config.height / 2,
            this.config.width,
            this.config.height,
            0x000000
        );
        
        // Add some stars for atmosphere
        this.createStarfield();
        
        // Add title
        this.add.text(
            this.config.width / 2,
            this.config.height / 2 - 100,
            '🚀 SPACE INVADERS 🛸',
            {
                fontSize: '48px',
                fill: '#00ff00',
                fontFamily: 'Courier New',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        // Add subtitle
        this.add.text(
            this.config.width / 2,
            this.config.height / 2 - 40,
            'Defend Earth from alien invasion!',
            {
                fontSize: '20px',
                fill: '#00cc00',
                fontFamily: 'Courier New',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        // Add instructions
        const instructions = [
            'Desktop: Arrow keys or A/D to move, SPACE to fire',
            'Mobile: Touch and drag to move, tap to fire'
        ];
        
        instructions.forEach((instruction, index) => {
            this.add.text(
                this.config.width / 2,
                this.config.height / 2 + 40 + (index * 30),
                instruction,
                {
                    fontSize: '16px',
                    fill: '#008800',
                    fontFamily: 'Courier New',
                    align: 'center'
                }
            ).setOrigin(0.5);
        });
        
        // Add high score display
        const highScore = localStorage.getItem('spaceinvaders_highscore') || '0';
        this.add.text(
            this.config.width / 2,
            this.config.height / 2 + 120,
            `HIGH SCORE: ${parseInt(highScore).toLocaleString()}`,
            {
                fontSize: '24px',
                fill: '#ffff00',
                fontFamily: 'Courier New',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        console.log('📋 MenuScene created');
    }
    
    createStarfield() {
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, this.config.width);
            const y = Phaser.Math.Between(0, this.config.height);
            const alpha = Phaser.Math.FloatBetween(0.3, 1.0);
            this.add.circle(x, y, 1, 0xffffff, alpha);
        }
    }
} 