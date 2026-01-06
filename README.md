# Animation Website - Animated Stick-Men Theatre

A fun and interactive website showcasing animated stick-men characters with Text-to-Speech (TTS) functionality.

## Features

- **Interactive Animations**: Watch stick-men characters perform various animations:
  - 👋 Wave
  - 🦘 Jump
  - 💃 Dance
  - 🚶 Walk

- **Text-to-Speech**: Make your stick-man speak! Enter any text and select a voice to generate speech using the TTS API.

- **Smooth Animations**: Powered by GSAP (GreenSock Animation Platform) for fluid, professional animations.

- **Responsive Design**: Works on desktop and mobile devices.

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/taliabridgejump-alt/animation-website.git
   cd animation-website
   ```

2. **Open in browser**:
   Simply open `index.html` in your web browser. No build process required!

## Project Structure

```
animation-website/
├── index.html          # Main HTML file with canvas and UI
├── style.css           # Styling for layout and animations
├── script.js           # Animation logic and TTS integration
├── assets/             # SVG stick-man character files
│   ├── stickman-basic.svg
│   ├── stickman-waving.svg
│   └── stickman-jumping.svg
└── README.md           # This file
```

## Technologies Used

- **HTML5**: Structure and SVG canvas for animations
- **CSS3**: Styling with gradients, flexbox, and responsive design
- **JavaScript (ES6+)**: Animation logic and API integration
- **GSAP 3.12**: Professional-grade animation library
- **TTS API**: Text-to-speech service from https://lazypy.ro/tts/

## How to Use

1. **Try Animations**: Click any of the animation buttons (Wave, Jump, Dance, Walk) to see the stick-man perform.

2. **Text-to-Speech**: 
   - Enter text in the textarea
   - Select a voice from the dropdown
   - Click "Play Speech" to hear the text spoken aloud
   - The stick-man will wave while speaking!

## API Integration

The TTS feature uses the LazyPy TTS API:
- **Endpoint**: `https://lazypy.ro/tts/request`
- **Method**: POST
- **Body**: JSON with `text` and `voice` parameters
- **Response**: Audio blob that can be played directly

## Browser Compatibility

Works on all modern browsers that support:
- HTML5 Canvas/SVG
- ES6 JavaScript
- GSAP 3.x
- Fetch API

## License

This project is licensed under the terms specified in the LICENSE file.

## Future Enhancements

- Add more character animations
- Support for multiple stick-men on screen
- Interactive drag-and-drop for positioning
- Additional voice options
- Animation sequencing and combinations