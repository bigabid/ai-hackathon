// Golden Pharaoh Slot Machine - Main Game Logic
// Built with Phaser 3 for MRAID-compliant playable ads

// Boot Scene - Loading assets
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create loading bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading Ancient Riches...',
            style: {
                font: '20px Arial',
                fill: '#ffd700'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 115,
            text: '0%',
            style: {
                font: '18px Arial',
                fill: '#ffd700'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        const assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '14px Arial',
                fill: '#ffd700'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        // Update progress bar
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffd700, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });

        this.load.on('fileprogress', (file) => {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        // Load assets
        this.loadAudio();
        this.loadGraphics();
    }

    loadAudio() {
        // Load background music
        this.load.audio('background-music', 'assets/audio/background-music.mp3');
        
        // Create placeholder sound effects
        this.load.audio('spin-sound', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        this.load.audio('win-sound', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        this.load.audio('jackpot-sound', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    }

    loadGraphics() {
        // Load the actual extracted video frames as background images
        for (let i = 1; i <= 15; i++) {
            const frameNum = i.toString().padStart(4, '0');
            this.load.image(`frame-${frameNum}`, `assets/frames/frame-${frameNum}.png`);
        }
        
        // Create placeholder symbols using graphics (these will be replaced with actual sprites later)
        this.load.image('pharaoh', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        this.load.image('scarab', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        this.load.image('eye', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        this.load.image('coin', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        this.load.image('ankh', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        this.load.image('pyramid', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    }

    create() {
        // Don't start background music automatically (browser autoplay policy)
        // Music will start when user first interacts with the game
        
        // Transition to game scene immediately
        this.scene.start('GameScene');
    }
}

// Main Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.reels = [];
        this.symbols = ['pharaoh', 'scarab', 'eye', 'coin', 'ankh', 'pyramid'];
        this.isSpinning = false;
        this.score = 0;
        this.gameTime = 0;
        this.maxGameTime = 30000; // 30 seconds
    }

    create() {
        // Create background
        this.createBackground();
        
        // Create slot machine
        this.createSlotMachine();
        
        // Create UI
        this.createUI();
        
        // Start game timer
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    createBackground() {
        // Create Egyptian-themed background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a1a, 0x2d1f0d, 0x1a1a1a, 0x2d1f0d, 1);
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        
        // Add some decorative elements
        const decor = this.add.graphics();
        decor.lineStyle(2, 0xffd700, 0.3);
        decor.strokeRect(50, 50, this.cameras.main.width - 100, this.cameras.main.height - 100);
    }

    createSlotMachine() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create 3 reels
        for (let i = 0; i < 3; i++) {
            const reel = this.createReel(centerX + (i - 1) * 120, centerY);
            this.reels.push(reel);
        }
        
        // Create spin button
        this.createSpinButton(centerX, centerY + 200);
    }

    createReel(x, y) {
        const reel = this.add.container(x, y);
        
        // Reel background
        const reelBg = this.add.graphics();
        reelBg.fillStyle(0x2d1f0d, 0.8);
        reelBg.fillRect(-40, -80, 80, 160);
        reelBg.lineStyle(3, 0xffd700, 1);
        reelBg.strokeRect(-40, -80, 80, 160);
        reel.add(reelBg);
        
        // Create 3 symbol slots
        const symbols = [];
        for (let j = 0; j < 3; j++) {
            const symbol = this.createSymbol(0, (j - 1) * 50, this.symbols[Phaser.Math.Between(0, this.symbols.length - 1)]);
            symbols.push(symbol);
            reel.add(symbol);
        }
        
        reel.symbols = symbols;
        return reel;
    }

    createSymbol(x, y, symbolType) {
        // Create placeholder symbol (in real implementation, use actual sprite images)
        const symbol = this.add.graphics();
        symbol.fillStyle(0xffd700, 0.8);
        symbol.fillRect(-25, -25, 50, 50);
        symbol.lineStyle(2, 0xffffff, 1);
        symbol.strokeRect(-25, -25, 50, 50);
        
        // Add symbol text
        const text = this.add.text(0, 0, symbolType.charAt(0).toUpperCase(), {
            fontSize: '16px',
            fill: '#000000',
            fontFamily: 'Arial'
        });
        text.setOrigin(0.5, 0.5);
        symbol.add(text);
        
        symbol.setPosition(x, y);
        symbol.symbolType = symbolType;
        
        return symbol;
    }

    createSpinButton(x, y) {
        const button = this.add.graphics();
        button.fillStyle(0xffd700, 1);
        button.fillRoundedRect(-60, -25, 120, 50, 25);
        button.lineStyle(3, 0xffffff, 1);
        button.strokeRoundedRect(-60, -25, 120, 50, 25);
        
        const text = this.add.text(x, y, 'SPIN', {
            fontSize: '18px',
            fill: '#000000',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });
        text.setOrigin(0.5, 0.5);
        
        // Make button interactive
        button.setInteractive(new Phaser.Geom.Rectangle(-60, -25, 120, 50), Phaser.Geom.Rectangle.Contains);
        button.on('pointerdown', () => this.spinReels());
        
        this.add.existing(button);
        this.add.existing(text);
    }

    createUI() {
        // Score display
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffd700',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });
        
        // Timer display
        this.timerText = this.add.text(20, 50, 'Time: 30s', {
            fontSize: '20px',
            fill: '#ffd700',
            fontFamily: 'Arial'
        });
    }

    spinReels() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.sound.play('spin-sound');
        
        // Animate each reel
        this.reels.forEach((reel, index) => {
            this.tweens.add({
                targets: reel,
                y: reel.y + 50,
                duration: 1000 + index * 200,
                ease: 'Power2',
                onComplete: () => {
                    if (index === this.reels.length - 1) {
                        this.onSpinComplete();
                    }
                }
            });
            });
        }

        onSpinComplete() {
            this.isSpinning = false;
            
            // Check for wins
            this.checkWins();
            
            // Update score
            this.score += Phaser.Math.Between(5, 25);
            this.scoreText.setText('Score: ' + this.score);
            
            // Check if game should end
            if (this.gameTime >= this.maxGameTime) {
                this.endGame();
            }
        }

        checkWins() {
            // Simple win checking - in real implementation, check symbol combinations
            const winAmount = Phaser.Math.Between(10, 50);
            this.score += winAmount;
            
            if (winAmount >= 40) {
                this.sound.play('jackpot-sound');
            } else {
                this.sound.play('win-sound');
            }
        }

        updateTimer() {
            this.gameTime += 1000;
            const remainingTime = Math.max(0, (this.maxGameTime - this.gameTime) / 1000);
            this.timerText.setText('Time: ' + Math.ceil(remainingTime) + 's');
            
            if (this.gameTime >= this.maxGameTime) {
                this.endGame();
            }
        }

        endGame() {
            // Store final score
            window.gameInstance.currentScore = this.score;
            
            // Transition to end scene
            this.scene.start('EndScene');
        }
    }

    // End Game Scene
    class EndScene extends Phaser.Scene {
        constructor() {
            super({ key: 'EndScene' });
        }

        create() {
            // Create end game background
            const bg = this.add.graphics();
            bg.fillGradientStyle(0x1a1a1a, 0x2d1f0d, 0x1a1a1a, 0x2d1f0d, 1);
            bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
            
            // Show final score
            const score = window.gameInstance.currentScore;
            const scoreText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 
                'Final Score: ' + score, {
                fontSize: '32px',
                fill: '#ffd700',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            });
            scoreText.setOrigin(0.5, 0.5);
            
            // Transition back to HTML end screen after 2 seconds
            this.time.delayedCall(2000, () => {
                window.gameInstance.showEndScreen();
            });
        }
    }

    // Main Game Controller
    class GoldenPharaohGame {
        constructor() {
            this.game = null;
            this.currentScore = 0;
            this.gameTime = 0;
            this.maxGameTime = 30000; // 30 seconds
            this.isGameActive = false;
            this.mraid = window.mraid || this.createMockMraid();
            
            this.init();
        }

        init() {
            // Wait for MRAID to be ready
            if (this.mraid.getState() === 'loading') {
                this.mraid.addEventListener('ready', () => this.startGame());
            } else {
                this.startGame();
            }
        }

        createMockMraid() {
            // Mock MRAID for development/testing
            return {
                getState: () => 'ready',
                addEventListener: (event, callback) => {
                    if (event === 'ready') callback();
                },
                open: () => console.log('MRAID: Opening store URL'),
                expand: () => console.log('MRAID: Expanding ad'),
                close: () => console.log('MRAID: Closing ad')
            };
        }

        startGame() {
            this.showLoadingScreen();
            this.initPhaserGame();
        }

        showLoadingScreen() {
            document.getElementById('screen-loading').classList.add('active');
            document.getElementById('screen-game').classList.remove('active');
            document.getElementById('screen-end').classList.remove('active');
        }

        showGameScreen() {
            document.getElementById('screen-loading').classList.remove('active');
            document.getElementById('screen-game').classList.add('active');
            document.getElementById('screen-end').classList.remove('active');
        }

        showEndScreen() {
            document.getElementById('screen-loading').classList.remove('active');
            document.getElementById('screen-game').classList.remove('active');
            document.getElementById('screen-end').classList.add('active');
            
            document.getElementById('final-score').textContent = this.currentScore;
            
            // Setup CTA button
            document.getElementById('btn-cta').addEventListener('click', () => {
                this.mraid.open();
            });
        }

        initPhaserGame() {
            const config = {
                type: Phaser.AUTO,
                parent: 'game-container',
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: '#1a1a1a',
                scale: {
                    mode: Phaser.Scale.RESIZE,
                    autoCenter: Phaser.Scale.CENTER_BOTH
                },
                scene: [BootScene, GameScene, EndScene],
                audio: {
                    disableWebAudio: false
                }
            };

            this.game = new Phaser.Game(config);
            
            // Handle window resize
            window.addEventListener('resize', () => {
                if (this.game) {
                    this.game.scale.resize(window.innerWidth, window.innerHeight);
                }
            });
        }
    }

    // Initialize game when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🌐 DOM loaded, initializing Golden Pharaoh game...');
        
        // Check if Phaser is available
        if (typeof Phaser === 'undefined') {
            console.error('❌ Phaser is not loaded! Check the CDN.');
            document.body.innerHTML = '<h1>Error: Phaser not loaded</h1><p>Please check your internet connection.</p>';
            return;
        }
        
        console.log('✅ Phaser version:', Phaser.VERSION);
        
        try {
            window.gameInstance = new GoldenPharaohGame();
            console.log('✅ Game instance created successfully');
        } catch (error) {
            console.error('❌ Error creating game instance:', error);
        }
    });