# Developer Guide - Cepstral TTS Integration

## Overview

This document provides technical details about the Cepstral TTS integration in the animation website.

## Architecture

### Frontend (Client-side)
- **Location**: `public/`
- **Technology**: HTML5, CSS3, Vanilla JavaScript
- **Key Features**:
  - Voice selection dropdown
  - Text input with character counter
  - Audio playback with animation synchronization
  - Visual feedback (animated character, audio visualizer)

### Backend (Server-side)
- **Location**: `api/`
- **Technology**: Node.js, Express.js
- **Key Features**:
  - RESTful API endpoints
  - Cepstral TTS integration
  - Audio file generation and serving
  - CORS support for cross-origin requests

## API Documentation

### Endpoints

#### 1. Health Check
```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "Cepstral TTS API",
  "voice": "David 4.1.0"
}
```

#### 2. Get Available Voices
```
GET /api/voices
```

**Response:**
```json
{
  "voices": [
    {
      "id": "david-cepstral",
      "name": "David (Cepstral)",
      "language": "en-US",
      "gender": "male",
      "provider": "Cepstral",
      "version": "4.1.0"
    }
  ]
}
```

#### 3. Generate Speech
```
POST /api/generate-speech
Content-Type: application/json
```

**Request Body:**
```json
{
  "text": "Text to convert to speech",
  "voice": "david-cepstral"
}
```

**Response:**
```json
{
  "success": true,
  "filename": "speech_xxxxx.wav",
  "url": "/audio/speech_xxxxx.wav",
  "message": "Speech generated successfully",
  "mock": false
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

#### 4. Cleanup Old Audio Files
```
POST /api/cleanup
```

**Response:**
```json
{
  "message": "Cleaned up N old audio files"
}
```

## Cepstral Integration Details

### Configuration

The Cepstral TTS is configured in `api/server.js`:

```javascript
const CEPSTRAL_CONFIG = {
  license: '9a-9f615f-8a8671-89fa16-cf9134-77a336',
  name: 'Black Rider',
  company: 'BRD Cult',
  voice: 'David 4.1.0'
};
```

### Speech Generation Process

1. **Request Reception**: API receives POST request with text and voice ID
2. **Validation**: Text is validated (max 5000 characters)
3. **TTS Processing**: 
   - Attempts to use Cepstral Swift CLI tool
   - Command: `swift -n David -p audio/encoding=pcm16,audio/channels=1,audio/sampling-rate=22050 -o output.wav "text"`
4. **File Generation**: WAV audio file is created in `assets/audio/`
5. **Response**: URL to audio file is returned to client
6. **Cleanup**: Old files (>1 hour) can be removed via cleanup endpoint

### Mock Mode

When Cepstral SDK is not available, the system operates in **mock mode**:
- Generates silent WAV files with proper headers
- Returns response with `mock: true` flag
- Allows development and testing without Cepstral SDK
- Real implementation requires Cepstral SDK installation

## Frontend Implementation

### Audio Playback Flow

1. User enters text and clicks "Generate Speech"
2. Frontend sends POST request to `/api/generate-speech`
3. Backend generates audio and returns URL
4. Frontend loads audio into `<audio>` element
5. Autoplay attempts to start playback
6. Animation synchronizes with audio events:
   - `play` event: Start mouth animation and visualizer
   - `pause` event: Stop animations
   - `ended` event: Reset UI state

### Animation Features

- **Character**: Animated face with blinking eyes and talking mouth
- **Visualizer**: 8-bar audio visualizer that pulses during playback
- **Synchronization**: Animations tied to audio player events

## Security Considerations

### Production Checklist

- [ ] Move license key to environment variables
- [ ] Implement API authentication
- [ ] Add rate limiting to prevent abuse
- [ ] Validate and sanitize all user inputs
- [ ] Implement HTTPS
- [ ] Configure proper CORS policies
- [ ] Add request logging and monitoring
- [ ] Implement file size limits
- [ ] Add audio file validation
- [ ] Set up automatic cleanup of old files
- [ ] Use secrets management system (AWS Secrets Manager, etc.)

### Environment Variables

For production, use environment variables:

```bash
CEPSTRAL_LICENSE=9a-9f615f-8a8671-89fa16-cf9134-77a336
CEPSTRAL_NAME="Black Rider"
CEPSTRAL_COMPANY="BRD Cult"
PORT=3000
```

Update `api/server.js`:
```javascript
const CEPSTRAL_CONFIG = {
  license: process.env.CEPSTRAL_LICENSE,
  name: process.env.CEPSTRAL_NAME,
  company: process.env.CEPSTRAL_COMPANY,
  voice: 'David 4.1.0'
};
```

## Testing

### Manual Testing

1. Start the server: `npm start`
2. Open browser: `http://localhost:3000`
3. Select "David (Cepstral)" voice
4. Enter test text
5. Click "Generate Speech"
6. Verify audio plays with animations

### API Testing with curl

```bash
# Health check
curl http://localhost:3000/api/health

# Get voices
curl http://localhost:3000/api/voices

# Generate speech
curl -X POST http://localhost:3000/api/generate-speech \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","voice":"david-cepstral"}'

# Cleanup
curl -X POST http://localhost:3000/api/cleanup
```

## Adding Additional TTS Voices

To add more voices:

1. Update `CEPSTRAL_CONFIG` in `api/server.js`
2. Modify `/api/voices` endpoint to return additional voice objects
3. Update `generateCepstralSpeech()` function to handle voice parameter
4. Adjust Swift CLI command with appropriate voice name

Example:
```javascript
{
  id: 'diane-cepstral',
  name: 'Diane (Cepstral)',
  language: 'en-US',
  gender: 'female',
  provider: 'Cepstral',
  version: '4.1.0'
}
```

## Troubleshooting

### Common Issues

**Issue**: "Cepstral SDK not available" message
- **Solution**: Install Cepstral SDK or use mock mode for development

**Issue**: Audio not playing
- **Solution**: Check browser autoplay policies, click play manually

**Issue**: Port 3000 already in use
- **Solution**: Change PORT in package.json or kill process using the port

**Issue**: CORS errors
- **Solution**: Verify CORS middleware is enabled in server.js

### Debug Mode

Enable debug logging:
```javascript
// Add to api/server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

## Performance Considerations

- Audio files are stored temporarily (cleanup after 1 hour)
- Each request generates a new file (consider caching identical requests)
- WAV format is uncompressed (consider MP3/OGG for production)
- Concurrent requests supported (Node.js handles async operations)

## Future Enhancements

- [ ] Add support for multiple languages
- [ ] Implement audio caching to avoid regeneration
- [ ] Add WebSocket for real-time streaming
- [ ] Support for SSML (Speech Synthesis Markup Language)
- [ ] Voice customization (speed, pitch, volume)
- [ ] Background music mixing
- [ ] Export functionality (download audio)
- [ ] User accounts and speech history
- [ ] Batch processing for multiple texts
