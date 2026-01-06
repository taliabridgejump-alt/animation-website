const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/audio', express.static('assets/audio'));

// Cepstral configuration
const CEPSTRAL_CONFIG = {
  license: '9a-9f615f-8a8671-89fa16-cf9134-77a336',
  name: 'Black Rider',
  company: 'BRD Cult',
  voice: 'David 4.1.0'
};

// Ensure audio directory exists
const audioDir = path.join(__dirname, '../assets/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

/**
 * Generate speech using Cepstral TTS
 * This is a mock implementation since we don't have actual Cepstral SDK installed
 * In production, this would use the Cepstral SDK with the provided license
 */
async function generateCepstralSpeech(text) {
  return new Promise((resolve, reject) => {
    const filename = `speech_${crypto.randomBytes(8).toString('hex')}.wav`;
    const filepath = path.join(audioDir, filename);
    
    // Mock implementation: In a real scenario, this would call Cepstral SDK
    // Example command (if swift command-line tool was available):
    // swift -n David -o output.wav "Text to speak"
    
    // For demonstration purposes, we'll check if swift (Cepstral CLI) is available
    // and create a placeholder audio file if not
    
    const cepstralCommand = 'swift';
    const args = [
      '-n', 'David',
      '-p', `audio/encoding=pcm16,audio/channels=1,audio/sampling-rate=22050`,
      '-o', filepath,
      text
    ];
    
    // Try to run Cepstral swift command
    const process = spawn(cepstralCommand, args);
    
    let stderr = '';
    
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0 && fs.existsSync(filepath)) {
        // Success - audio file generated
        resolve({
          success: true,
          filename: filename,
          url: `/audio/${filename}`,
          message: 'Speech generated successfully using Cepstral David voice'
        });
      } else {
        // Cepstral not available, create a mock response
        // In production, this would be an error
        console.log('Cepstral swift not available, creating mock response');
        
        // Create a simple WAV header for a silent audio file (mock)
        const wavHeader = createWavHeader(1, 22050, 16, 22050); // 1 second of silence
        const audioBuffer = Buffer.alloc(44 + 22050 * 2); // Header + 1 second of 16-bit audio
        wavHeader.copy(audioBuffer, 0);
        
        fs.writeFileSync(filepath, audioBuffer);
        
        resolve({
          success: true,
          filename: filename,
          url: `/audio/${filename}`,
          message: 'Speech generated (mock mode - Cepstral SDK not available)',
          mock: true
        });
      }
    });
    
    process.on('error', (err) => {
      // Command not found or other error
      console.log('Cepstral command error, using mock mode:', err.message);
      
      // Create mock audio file
      const wavHeader = createWavHeader(1, 22050, 16, 22050);
      const audioBuffer = Buffer.alloc(44 + 22050 * 2);
      wavHeader.copy(audioBuffer, 0);
      
      fs.writeFileSync(filepath, audioBuffer);
      
      resolve({
        success: true,
        filename: filename,
        url: `/audio/${filename}`,
        message: 'Speech generated (mock mode - Cepstral SDK not available)',
        mock: true
      });
    });
  });
}

/**
 * Create a WAV file header
 */
function createWavHeader(durationSeconds, sampleRate, bitsPerSample, numSamples) {
  const numChannels = 1;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = numSamples * blockAlign;
  
  const buffer = Buffer.alloc(44);
  
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  
  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk size
  buffer.writeUInt16LE(1, 20); // Audio format (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  
  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  return buffer;
}

// API Endpoints

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'Cepstral TTS API',
    voice: CEPSTRAL_CONFIG.voice
  });
});

/**
 * Get available TTS voices
 */
app.get('/api/voices', (req, res) => {
  res.json({
    voices: [
      {
        id: 'david-cepstral',
        name: 'David (Cepstral)',
        language: 'en-US',
        gender: 'male',
        provider: 'Cepstral',
        version: '4.1.0'
      }
    ]
  });
});

/**
 * Generate speech from text
 */
app.post('/api/generate-speech', async (req, res) => {
  try {
    const { text, voice } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        error: 'Text is required' 
      });
    }
    
    if (text.length > 5000) {
      return res.status(400).json({ 
        error: 'Text too long (max 5000 characters)' 
      });
    }
    
    // Log the request (exclude sensitive data in production logs)
    console.log(`Generating speech for text: "${text.substring(0, 50)}..."`);
    console.log(`Using voice: ${voice || 'david-cepstral'}`);
    console.log(`License holder: ${CEPSTRAL_CONFIG.name}, ${CEPSTRAL_CONFIG.company}`);
    
    // Generate speech using Cepstral
    const result = await generateCepstralSpeech(text);
    
    res.json(result);
    
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ 
      error: 'Failed to generate speech',
      details: error.message 
    });
  }
});

/**
 * Clean up old audio files (optional maintenance endpoint)
 */
app.post('/api/cleanup', (req, res) => {
  try {
    const files = fs.readdirSync(audioDir);
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour
    
    let deletedCount = 0;
    
    files.forEach(file => {
      const filepath = path.join(audioDir, file);
      const stats = fs.statSync(filepath);
      
      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filepath);
        deletedCount++;
      }
    });
    
    res.json({ 
      message: `Cleaned up ${deletedCount} old audio files` 
    });
    
  } catch (error) {
    console.error('Error cleaning up files:', error);
    res.status(500).json({ 
      error: 'Failed to clean up files',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Cepstral TTS API Server running on http://localhost:${PORT}`);
  console.log(`Voice: ${CEPSTRAL_CONFIG.voice}`);
  console.log(`Licensed to: ${CEPSTRAL_CONFIG.name}, ${CEPSTRAL_CONFIG.company}`);
  console.log(`License key: ${CEPSTRAL_CONFIG.license.substring(0, 10)}...`);
});
