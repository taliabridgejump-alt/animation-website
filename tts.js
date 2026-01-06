// JavaScript module for handling TTS voices

// Define namespaces or constants for TTS
const TTS = {
    voices: [], // Array to hold available voices
    init() {
        // Initialize text-to-speech voices
        console.log("Initializing TTS voices...");
        if (window.speechSynthesis) {
            TTS.voices = window.speechSynthesis.getVoices();
            console.log("Voices loaded:", TTS.voices);
        } else {
            console.error("Speech Synthesis API not supported in this browser.");
        }
    },
    speak(text, voiceName) {
        // Generate speech with the specified text and voice
        if (!text) {
            console.error("No text provided for speech.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        if (voiceName) {
            const voice = TTS.voices.find(v => v.name === voiceName);
            if (voice) {
                utterance.voice = voice;
            } else {
                console.warn(`Voice '${voiceName}' not found. Using default voice.`);
            }
        }

        window.speechSynthesis.speak(utterance);
    },
    integrateCepstral(apiUrl, text, callback) {
        // Integrate with external TTS provider (e.g., Cepstral)
        if (!apiUrl || !text || !callback) {
            console.error("API URL, text, or callback function missing for Cepstral integration.");
            return;
        }

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        })
            .then(response => response.json())
            .then(data => callback(null, data))
            .catch(err => callback(err));
    },
};

// Automatically initialize the voices on load
window.addEventListener('load', TTS.init);

export default TTS;