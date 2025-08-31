#!/usr/bin/env node

// Test script to debug the Golden Pharaoh game
// This simulates what happens in the browser

import { readFileSync } from 'fs';

console.log('🧪 Testing Golden Pharaoh Game Logic...');

// Mock browser environment
global.window = {
    innerWidth: 800,
    innerHeight: 600,
    addEventListener: () => {},
    mraid: {
        getState: () => 'ready',
        addEventListener: () => {},
        open: () => console.log('MRAID: Opening store URL'),
        expand: () => console.log('MRAID: Expanding ad'),
        close: () => console.log('MRAID: Closing ad')
    }
};

global.document = {
    getElementById: (id) => {
        return {
            classList: {
                add: (cls) => console.log(`Adding class ${cls} to ${id}`),
                remove: (cls) => console.log(`Removing class ${cls} from ${id}`)
            },
            textContent: '',
            addEventListener: () => {}
        };
    },
    addEventListener: (event, callback) => {
        if (event === 'DOMContentLoaded') {
            console.log('📝 DOM ready event listener registered');
            // Store the callback to call it manually
            global.document.domReadyCallback = callback;
        }
    },
    dispatchEvent: (event) => {
        console.log(`📝 Dispatching event: ${event.type}`);
        if (event.type === 'DOMContentLoaded' && global.document.domReadyCallback) {
            console.log('📝 Calling DOM ready callback');
            global.document.domReadyCallback();
        }
    }
};

// Mock Phaser
global.Phaser = {
    Scene: class MockScene {
        constructor(config) {
            console.log('🎬 Mock Scene created:', config.key);
        }
    },
    Game: class MockGame {
        constructor(config) {
            console.log('🎮 Mock Phaser Game created with config:', {
                type: config.type,
                width: config.width,
                height: config.height,
                sceneCount: config.scene.length
            });
        }
    },
    AUTO: 'AUTO',
    Scale: {
        RESIZE: 'RESIZE',
        CENTER_BOTH: 'CENTER_BOTH'
    },
    VERSION: '3.70.0'
};

// Mock Phaser.Scene methods
global.Phaser.Scene.prototype.add = {
    graphics: () => ({
        fillStyle: () => ({ fillRect: () => {} }),
        lineStyle: () => ({ strokeRect: () => {} }),
        clear: () => {},
        destroy: () => {}
    }),
    text: () => ({
        setOrigin: () => {},
        setText: () => {}
    }),
    image: () => ({
        setDisplaySize: () => {}
    }),
    rectangle: () => ({
        setInteractive: () => ({ on: () => {} })
    }),
    container: () => ({
        add: () => {}
    })
};

global.Phaser.Scene.prototype.make = {
    text: () => ({
        setOrigin: () => {}
    })
};

global.Phaser.Scene.prototype.time = {
    addEvent: () => {},
    delayedCall: () => {}
};

global.Phaser.Scene.prototype.tweens = {
    add: () => {}
};

global.Phaser.Scene.prototype.sound = {
    play: () => console.log('🔊 Sound played')
};

global.Phaser.Scene.prototype.scene = {
    start: (sceneName) => console.log(`🚀 Starting scene: ${sceneName}`)
};

global.Phaser.Scene.prototype.cameras = {
    main: {
        width: 800,
        height: 600
    }
};

global.Phaser.Scene.prototype.load = {
    on: (event, callback) => {
        if (event === 'complete') {
            console.log('📦 Assets loaded, calling complete callback');
            setTimeout(callback, 100);
        }
    },
    audio: () => {},
    image: () => {}
};

global.Phaser.Scene.prototype.add = {
    graphics: () => ({
        fillStyle: () => ({ fillRect: () => {} }),
        lineStyle: () => ({ strokeRect: () => {} }),
        clear: () => {},
        destroy: () => {}
    }),
    text: () => ({
        setOrigin: () => {},
        setText: () => {}
    }),
    image: () => ({
        setDisplaySize: () => {}
    }),
    rectangle: () => ({
        setInteractive: () => ({ on: () => {} })
    }),
    container: () => ({
        add: () => {}
    }),
    existing: () => {}
};

global.Phaser.Math = {
    Between: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
};

global.Phaser.Geom = {
    Rectangle: class MockRectangle {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }
};

global.Phaser.Geom.Rectangle.Contains = () => true;

console.log('✅ Mock environment created');

// Now test the game logic
try {
    console.log('\n🎯 Testing game initialization...');
    
    // Import the game logic
    const gameCode = readFileSync('main.js', 'utf8');
    
    // Execute the game code
    eval(gameCode);
    
    console.log('✅ Game code executed successfully');
    
    // Manually trigger the DOM ready event since we're in a mock environment
    console.log('🌐 Manually triggering DOM ready event...');
    
    // Call the stored DOM ready callback directly
    if (global.document.domReadyCallback) {
        console.log('📝 Calling stored DOM ready callback...');
        global.document.domReadyCallback();
    } else {
        console.log('❌ No DOM ready callback found');
    }
    
    // Wait a moment for the event to process
    setTimeout(() => {
        console.log('⏳ Checking game instance after DOM ready...');
        
        // Check if the game instance was created
        if (global.window.gameInstance) {
            console.log('✅ Game instance created successfully');
            console.log('🎮 Game state:', {
                currentScore: global.window.gameInstance.currentScore,
                gameTime: global.window.gameInstance.gameTime,
                maxGameTime: global.window.gameInstance.maxGameTime,
                isGameActive: global.window.gameInstance.isGameActive
            });
        } else {
            console.log('❌ Game instance not created');
        }
    }, 100);
    
} catch (error) {
    console.error('❌ Error testing game:', error);
    console.error('Stack trace:', error.stack);
}
