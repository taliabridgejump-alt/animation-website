// Configuration
const API_BASE_URL = window.location.origin;

// DOM Elements
const voiceSelect = document.getElementById('voice-select');
const textInput = document.getElementById('text-input');
const charCount = document.getElementById('char-count');
const generateBtn = document.getElementById('generate-btn');
const stopBtn = document.getElementById('stop-btn');
const statusMessage = document.getElementById('status-message');
const audioPlayer = document.getElementById('audio-player');
const mouth = document.getElementById('mouth');
const visualizer = document.getElementById('visualizer');

// State
let isGenerating = false;
let isPlaying = false;

// Initialize the application
async function init() {
    // Load available voices
    await loadVoices();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update character count
    updateCharCount();
    
    // Show ready status
    showStatus('Ready to generate speech', 'info');
}

/**
 * Load available TTS voices from the API
 */
async function loadVoices() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/voices`);
        const data = await response.json();
        
        if (data.voices && data.voices.length > 0) {
            voiceSelect.innerHTML = '';
            data.voices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.id;
                option.textContent = voice.name;
                voiceSelect.appendChild(option);
            });
            
            // Select the first voice by default
            voiceSelect.selectedIndex = 0;
        } else {
            showStatus('No voices available', 'error');
        }
    } catch (error) {
        console.error('Error loading voices:', error);
        showStatus('Error loading voices. Please check if the server is running.', 'error');
        
        // Add a fallback option
        voiceSelect.innerHTML = '<option value="david-cepstral">David (Cepstral)</option>';
    }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Generate button
    generateBtn.addEventListener('click', generateSpeech);
    
    // Stop button
    stopBtn.addEventListener('click', stopAudio);
    
    // Text input character counter
    textInput.addEventListener('input', updateCharCount);
    
    // Audio player events
    audioPlayer.addEventListener('play', onAudioPlay);
    audioPlayer.addEventListener('pause', onAudioPause);
    audioPlayer.addEventListener('ended', onAudioEnded);
    
    // Enter key in textarea (with Ctrl/Cmd)
    textInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            generateSpeech();
        }
    });
}

/**
 * Update character count display
 */
function updateCharCount() {
    const count = textInput.value.length;
    charCount.textContent = count;
    
    if (count > 5000) {
        charCount.style.color = '#f44336';
    } else if (count > 4500) {
        charCount.style.color = '#ff9800';
    } else {
        charCount.style.color = '#888';
    }
}

/**
 * Generate speech from text
 */
async function generateSpeech() {
    const text = textInput.value.trim();
    const voice = voiceSelect.value;
    
    // Validation
    if (!text) {
        showStatus('Please enter some text', 'warning');
        return;
    }
    
    if (text.length > 5000) {
        showStatus('Text is too long (maximum 5000 characters)', 'error');
        return;
    }
    
    // Update UI state
    isGenerating = true;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '⏳ Generating...';
    showStatus('Generating speech...', 'info');
    
    try {
        // Make API call
        const response = await fetch(`${API_BASE_URL}/api/generate-speech`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, voice })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Load and play the audio
            audioPlayer.src = `${API_BASE_URL}${data.url}`;
            audioPlayer.load();
            
            // Show success message
            let message = data.message;
            if (data.mock) {
                message += ' (Note: Running in mock mode for demonstration)';
            }
            showStatus(message, data.mock ? 'warning' : 'success');
            
            // Auto-play the audio
            setTimeout(() => {
                audioPlayer.play().catch(err => {
                    console.error('Autoplay failed:', err);
                    showStatus('Speech generated. Click play to listen.', 'success');
                });
            }, 100);
            
        } else {
            showStatus(data.error || 'Failed to generate speech', 'error');
        }
        
    } catch (error) {
        console.error('Error generating speech:', error);
        showStatus('Error: Could not connect to the server. Please ensure the server is running.', 'error');
    } finally {
        // Reset UI state
        isGenerating = false;
        generateBtn.disabled = false;
        generateBtn.innerHTML = '🎤 Generate Speech';
    }
}

/**
 * Stop audio playback
 */
function stopAudio() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
}

/**
 * Handle audio play event
 */
function onAudioPlay() {
    isPlaying = true;
    stopBtn.disabled = false;
    mouth.classList.add('talking');
    visualizer.classList.add('active');
}

/**
 * Handle audio pause event
 */
function onAudioPause() {
    if (isPlaying) {
        mouth.classList.remove('talking');
        visualizer.classList.remove('active');
    }
}

/**
 * Handle audio ended event
 */
function onAudioEnded() {
    isPlaying = false;
    stopBtn.disabled = true;
    mouth.classList.remove('talking');
    visualizer.classList.remove('active');
    showStatus('Playback complete', 'info');
}

/**
 * Show status message
 */
function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (statusMessage.textContent === message) {
                statusMessage.textContent = '';
                statusMessage.className = 'status-message';
            }
        }, 5000);
    }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
