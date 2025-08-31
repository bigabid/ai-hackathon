# Golden Pharaoh Slot Machine - MRAID Playable Ad

A fully functional slot machine game built with Phaser 3, designed for MRAID-compliant playable advertisements. Features Egyptian-themed graphics, authentic slot machine mechanics, and the original audio from the reference video.

## 🎰 Game Features

- **Authentic Slot Machine Gameplay**: 3-reel slot machine with Egyptian symbols
- **Egyptian Theme**: Golden Pharaoh, Scarab, Eye of Horus, Gold Coins, Ankh, and Pyramid symbols
- **Original Audio**: Background music extracted from the reference video
- **Responsive Design**: Works in both portrait and landscape orientations
- **MRAID Compliant**: Ready for deployment on ad networks
- **Touch & Click Support**: Optimized for mobile and desktop

## 🚀 Quick Start

### Development Mode
```bash
# Install dependencies (if any)
npm install

# Start preview server
npm run preview

# Open http://localhost:5173 in your browser
```

### Production Build
```bash
# Build single HTML file for MRAID deployment
npm run build:phaser

# Output: dist/golden-pharaoh-slot.html
```

## 🎮 How to Play

1. **Loading Screen**: Game loads with Egyptian-themed loading animation
2. **Gameplay**: Tap the SPIN button to spin the 3 reels
3. **Winning**: Match 3 symbols to win points
   - 3 Pharaoh symbols = Jackpot (100 points)
   - 3 Gold Coin symbols = Bonus (50 points)
   - 3 matching symbols = Base win (10 points)
4. **Session**: Game runs for 30 seconds
5. **CTA**: "DOWNLOAD GAME" button appears at the end

## 🎨 Game Assets

### Audio
- **Background Music**: `assets/audio/background-music.mp3` (extracted from video)
- **Sound Effects**: Reel spin, win chime, jackpot celebration

### Video Reference
- **Source**: `JPSC_Slot_GoldenPharoah_Video_720x1080_15s_WRP.mp4`
- **Frames**: 15 extracted frames in `assets/frames/` for reference
- **Duration**: 15 seconds (extended to 30 seconds for gameplay)

### Symbols
- Pharaoh (Jackpot symbol)
- Scarab
- Eye of Horus
- Gold Coins (Bonus symbol)
- Ankh
- Pyramid

## 🏗️ Technical Architecture

### Engine
- **Phaser 3**: Full-featured HTML5 game framework
- **Scenes**: BootScene (loading), GameScene (gameplay), EndScene (results)
- **Responsive**: Automatically adapts to screen size and orientation

### MRAID Integration
- **State Management**: Handles MRAID loading, ready, and viewable states
- **CTA Button**: Uses `mraid.open()` for store navigation
- **Mock MRAID**: Development-friendly mock implementation

### Performance
- **60fps Gameplay**: Smooth reel spinning animations
- **Audio Preloading**: Background music and sound effects
- **Asset Optimization**: Placeholder graphics with room for custom assets

## 📱 MRAID Compliance

### Required Functions
- `mraid.getState()`: Check ad readiness
- `mraid.addEventListener('ready')`: Initialize on load
- `mraid.addEventListener('viewable')`: Start when visible
- `mraid.open()`: Navigate to store

### Orientation Support
- **Portrait**: 720x1080 (original video dimensions)
- **Landscape**: Automatically adapts
- **Responsive**: Scales to any screen size

### File Structure
- **Single HTML**: All assets inlined for easy deployment
- **No External Dependencies**: Phaser bundled inline
- **MRAID Ready**: Compatible with major ad networks

## 🎯 Customization

### Symbols
Replace placeholder graphics in `main.js`:
```javascript
// In loadGraphics() method, replace placeholder images
this.load.image('pharaoh', 'path/to/pharaoh-sprite.png');
```

### Audio
- **Background Music**: Replace `assets/audio/background-music.mp3`
- **Sound Effects**: Add custom SFX files and update loadAudio()

### Visual Style
- **Colors**: Modify CSS variables in `styles.css`
- **Fonts**: Update font-family declarations
- **Layout**: Adjust positioning in `main.js`

## 🚀 Deployment

### Ad Network Requirements
1. **File Size**: Under 2MB total
2. **Format**: Single HTML file
3. **MRAID**: Version 2.0+ compatible
4. **Orientation**: Both portrait and landscape

### Testing
- **MRAID Simulator**: Test with official MRAID simulator
- **Mobile Devices**: Test on iOS and Android
- **Ad Networks**: Verify compatibility with target networks

## 📋 Development Checklist

- [x] Phaser 3 game engine integration
- [x] Egyptian-themed slot machine mechanics
- [x] Original audio integration
- [x] MRAID compliance
- [x] Responsive design
- [x] Touch and click support
- [x] Loading and end screens
- [x] Score system and win conditions
- [x] CTA button implementation
- [x] Production build script

## 🔧 Troubleshooting

### Common Issues
1. **Audio not playing**: Check browser autoplay policies
2. **MRAID errors**: Verify mraid.js is loaded
3. **Performance issues**: Check device capabilities
4. **Orientation problems**: Test on different devices

### Debug Mode
Enable console logging for development:
```javascript
// In main.js, set debug mode
this.debug = true;
```

## 📄 License

This project is provided as-is for educational and hackathon use. The Golden Pharaoh theme and audio are extracted from the reference video for demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Ready to spin the reels and discover ancient Egyptian riches! 🎰✨**
