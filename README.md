# Animation Website with Cepstral TTS Integration

A web application that demonstrates Text-to-Speech (TTS) capabilities using Cepstral's David 4.1.0 voice, integrated with an animated character interface.

## Features

- 🎤 **Cepstral TTS Integration**: Uses Cepstral SDK with the David voice (Male, US English)
- 🎭 **Animated Character**: Visual representation that syncs with speech playback
- 📊 **Audio Visualizer**: Real-time visualization of audio playback
- 🎨 **Modern UI**: Clean, responsive interface with gradient design
- 🔊 **Audio Controls**: Built-in audio player with standard controls

## Project Structure

```
animation-website/
├── api/
│   └── server.js          # Backend Express server with Cepstral TTS integration
├── assets/
│   └── audio/             # Temporary storage for generated audio files
├── public/
│   ├── index.html         # Main frontend HTML
│   ├── styles.css         # Styling for the UI
│   └── app.js             # Frontend JavaScript logic
├── package.json           # Node.js dependencies
└── README.md              # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- (Optional) Cepstral SDK with Swift CLI tool for production use

## Installation

1. Clone the repository:
```bash
git clone https://github.com/taliabridgejump-alt/animation-website.git
cd animation-website
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The Cepstral TTS is configured with the following credentials in `api/server.js`:

- **License Key**: `9a-9f615f-8a8671-89fa16-cf9134-77a336`
- **Name**: Black Rider
- **Company**: BRD Cult
- **Voice**: David 4.1.0

**Note**: For production use, these should be stored as environment variables rather than hardcoded.

## Usage

### Development Mode

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Use the interface:
   - Select "David (Cepstral)" from the voice dropdown
   - Enter text in the textarea (up to 5000 characters)
   - Click "Generate Speech" button
   - The audio will be generated and played automatically with animation

### API Endpoints

#### GET /api/health
Check the health status of the TTS service.

#### GET /api/voices
Get list of available TTS voices.

#### POST /api/generate-speech
Generate speech from text.

**Request Body:**
```json
{
  "text": "Your text here",
  "voice": "david-cepstral"
}
```

**Response:**
```json
{
  "success": true,
  "filename": "speech_xxxxx.wav",
  "url": "/audio/speech_xxxxx.wav",
  "message": "Speech generated successfully"
}
```

#### POST /api/cleanup
Clean up old audio files (older than 1 hour).

## Cepstral SDK Integration

The application is designed to work with the Cepstral Swift CLI tool. When the Cepstral SDK is properly installed:

1. The `swift` command should be available in the system PATH
2. The David voice should be installed
3. The license should be activated

If Cepstral is not available, the application runs in **mock mode**, generating placeholder audio files for demonstration purposes.

### Installing Cepstral (Production)

For production deployment with actual Cepstral TTS:

1. Download and install the Cepstral SDK from https://www.cepstral.com
2. Install the David voice package
3. Activate the license using the provided key
4. Verify installation: `swift --voices`

## Architecture

### Backend (api/server.js)
- Express.js server handling API requests
- Cepstral TTS integration via Swift CLI
- Audio file generation and serving
- CORS enabled for frontend communication

### Frontend (public/)
- HTML5 interface with text input and controls
- CSS3 animations for character and visualizer
- JavaScript for API communication and audio playback
- Responsive design for mobile and desktop

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern mobile browsers

## Security Considerations

⚠️ **Important for Production**:

1. Store license keys and credentials in environment variables
2. Implement rate limiting on the API endpoints
3. Add authentication for API access
4. Sanitize user input to prevent injection attacks
5. Set up HTTPS for secure communication
6. Implement proper CORS policies
7. Add audio file size limits and validation

## Troubleshooting

### "Cepstral SDK not available" message
- The application is running in mock mode
- Install Cepstral SDK for actual TTS generation

### Audio not playing
- Check browser autoplay policies
- Click the play button manually if autoplay is blocked
- Ensure audio files are being generated in `assets/audio/`

### Connection errors
- Verify the server is running on port 3000
- Check firewall settings
- Ensure no other service is using port 3000

## License

See LICENSE file for details.

## Credits

- Cepstral TTS SDK
- David Voice 4.1.0
- Licensed to: Black Rider, BRD Cult