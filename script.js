// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const stickman = document.getElementById('stickman');
    const leftArm = document.getElementById('left-arm');
    const rightArm = document.getElementById('right-arm');
    const leftLeg = document.getElementById('left-leg');
    const rightLeg = document.getElementById('right-leg');
    const head = document.getElementById('head');
    const body = document.getElementById('body');
    
    const waveBtn = document.getElementById('wave-btn');
    const jumpBtn = document.getElementById('jump-btn');
    const danceBtn = document.getElementById('dance-btn');
    const walkBtn = document.getElementById('walk-btn');
    const playTtsBtn = document.getElementById('play-tts-btn');
    const ttsInput = document.getElementById('tts-input');
    const voiceSelector = document.getElementById('voice-selector');
    const statusMessage = document.getElementById('status-message');
    
    // Animation state
    let isAnimating = false;
    let currentAudio = null;
    
    // Helper function to show status message
    function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = type;
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusMessage.textContent = '';
                statusMessage.className = '';
            }, 5000);
        }
    }
    
    // Animation: Wave
    function waveAnimation() {
        if (isAnimating) return;
        isAnimating = true;
        
        const tl = gsap.timeline({
            onComplete: () => { isAnimating = false; }
        });
        
        tl.to(rightArm, {
            attr: { x2: 25, y2: -40 },
            duration: 0.3,
            ease: "power2.out"
        })
        .to(rightArm, {
            attr: { x2: 30, y2: -35 },
            duration: 0.2,
            repeat: 3,
            yoyo: true
        })
        .to(rightArm, {
            attr: { x2: 25, y2: -10 },
            duration: 0.3,
            ease: "power2.in"
        });
    }
    
    // Animation: Jump
    function jumpAnimation() {
        if (isAnimating) return;
        isAnimating = true;
        
        const tl = gsap.timeline({
            onComplete: () => { isAnimating = false; }
        });
        
        // Prepare to jump (crouch)
        tl.to(stickman, {
            y: 20,
            duration: 0.2,
            ease: "power2.in"
        })
        // Jump up
        .to(stickman, {
            y: -80,
            duration: 0.4,
            ease: "power2.out"
        })
        // Move arms during jump
        .to([leftArm, rightArm], {
            attr: { y2: -30 },
            duration: 0.4,
            ease: "power2.out"
        }, "-=0.4")
        // Fall down
        .to(stickman, {
            y: 0,
            duration: 0.4,
            ease: "power2.in"
        })
        // Return arms to normal
        .to([leftArm, rightArm], {
            attr: { y2: -10 },
            duration: 0.4,
            ease: "power2.in"
        }, "-=0.4");
    }
    
    // Animation: Dance
    function danceAnimation() {
        if (isAnimating) return;
        isAnimating = true;
        
        const tl = gsap.timeline({
            repeat: 2,
            onComplete: () => { isAnimating = false; }
        });
        
        tl.to(stickman, {
            rotation: -10,
            duration: 0.25,
            ease: "power1.inOut"
        })
        .to(leftArm, {
            attr: { x2: -30, y2: -35 },
            duration: 0.25,
            ease: "power1.inOut"
        }, "-=0.25")
        .to(rightArm, {
            attr: { x2: 30, y2: -35 },
            duration: 0.25,
            ease: "power1.inOut"
        }, "-=0.25")
        .to(stickman, {
            rotation: 10,
            duration: 0.25,
            ease: "power1.inOut"
        })
        .to(leftArm, {
            attr: { x2: -25, y2: -10 },
            duration: 0.25,
            ease: "power1.inOut"
        }, "-=0.25")
        .to(rightArm, {
            attr: { x2: 25, y2: -10 },
            duration: 0.25,
            ease: "power1.inOut"
        }, "-=0.25")
        .to(stickman, {
            rotation: 0,
            duration: 0.25,
            ease: "power1.inOut"
        });
    }
    
    // Animation: Walk
    function walkAnimation() {
        if (isAnimating) return;
        isAnimating = true;
        
        const tl = gsap.timeline({
            onComplete: () => { isAnimating = false; }
        });
        
        // Walk cycle
        for (let i = 0; i < 4; i++) {
            tl.to(stickman, {
                x: `+=${50}`,
                duration: 0.5,
                ease: "none"
            })
            .to(leftLeg, {
                attr: { x2: -25, y2: 50 },
                duration: 0.25,
                ease: "power1.inOut"
            }, `-=0.5`)
            .to(rightLeg, {
                attr: { x2: 15, y2: 65 },
                duration: 0.25,
                ease: "power1.inOut"
            }, `-=0.5`)
            .to(leftArm, {
                attr: { x2: -20, y2: -5 },
                duration: 0.25,
                ease: "power1.inOut"
            }, `-=0.5`)
            .to(rightArm, {
                attr: { x2: 30, y2: -15 },
                duration: 0.25,
                ease: "power1.inOut"
            }, `-=0.5`)
            // Second step
            .to(leftLeg, {
                attr: { x2: -15, y2: 65 },
                duration: 0.25,
                ease: "power1.inOut"
            }, `-=0.25`)
            .to(rightLeg, {
                attr: { x2: 25, y2: 50 },
                duration: 0.25,
                ease: "power1.inOut"
            }, `-=0.25`)
            .to(leftArm, {
                attr: { x2: -30, y2: -15 },
                duration: 0.25,
                ease: "power1.inOut"
            }, `-=0.25`)
            .to(rightArm, {
                attr: { x2: 20, y2: -5 },
                duration: 0.25,
                ease: "power1.inOut"
            }, `-=0.25`);
        }
        
        // Reset limbs
        tl.to([leftLeg, rightLeg], {
            attr: { x2: function(i) { return i === 0 ? -20 : 20; }, y2: 60 },
            duration: 0.3,
            ease: "power2.out"
        })
        .to([leftArm, rightArm], {
            attr: { x2: function(i) { return i === 0 ? -25 : 25; }, y2: -10 },
            duration: 0.3,
            ease: "power2.out"
        }, "-=0.3");
    }
    
    // Text-to-Speech function
    async function playTextToSpeech() {
        const text = ttsInput.value.trim();
        
        if (!text) {
            showStatus('Please enter some text to speak.', 'error');
            return;
        }
        
        const voice = voiceSelector.value;
        
        // Stop any currently playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        
        showStatus('Generating speech...', 'info');
        
        try {
            const response = await fetch('https://lazypy.ro/tts/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    voice: voice
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            currentAudio = new Audio(audioUrl);
            
            currentAudio.onplay = () => {
                showStatus('Playing speech...', 'info');
                // Trigger wave animation while speaking
                waveAnimation();
            };
            
            currentAudio.onended = () => {
                showStatus('Speech completed!', 'success');
                URL.revokeObjectURL(audioUrl);
                currentAudio = null;
            };
            
            currentAudio.onerror = () => {
                showStatus('Error playing audio.', 'error');
                URL.revokeObjectURL(audioUrl);
                currentAudio = null;
            };
            
            await currentAudio.play();
            
        } catch (error) {
            console.error('TTS Error:', error);
            showStatus(`Error: ${error.message}. The TTS service may be unavailable.`, 'error');
        }
    }
    
    // Event listeners
    waveBtn.addEventListener('click', waveAnimation);
    jumpBtn.addEventListener('click', jumpAnimation);
    danceBtn.addEventListener('click', danceAnimation);
    walkBtn.addEventListener('click', walkAnimation);
    playTtsBtn.addEventListener('click', playTextToSpeech);
    
    // Allow Enter key to trigger TTS (Ctrl+Enter for multi-line)
    ttsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            playTextToSpeech();
        }
    });
    
    // Initial welcome message
    showStatus('Welcome! Select an animation or enter text for TTS.', 'success');
});
