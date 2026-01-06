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
    
    // Helper function to animate an element's transform
    function animate(element, transforms, duration, callback) {
        const startTime = performance.now();
        
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing (ease-in-out)
            const eased = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            if (transforms.translate) {
                const x = transforms.translate.x || 0;
                const y = transforms.translate.y || 0;
                element.setAttribute('transform', `translate(${x * eased}, ${y * eased})`);
            }
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else if (callback) {
                callback();
            }
        }
        
        requestAnimationFrame(step);
    }
    
    // Helper function to animate SVG line attributes
    function animateLine(element, toAttrs, duration, callback) {
        const startTime = performance.now();
        const fromAttrs = {
            x2: parseFloat(element.getAttribute('x2')),
            y2: parseFloat(element.getAttribute('y2'))
        };
        
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing
            const eased = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            if (toAttrs.x2 !== undefined) {
                const x2 = fromAttrs.x2 + (toAttrs.x2 - fromAttrs.x2) * eased;
                element.setAttribute('x2', x2);
            }
            if (toAttrs.y2 !== undefined) {
                const y2 = fromAttrs.y2 + (toAttrs.y2 - fromAttrs.y2) * eased;
                element.setAttribute('y2', y2);
            }
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else if (callback) {
                callback();
            }
        }
        
        requestAnimationFrame(step);
    }
    
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
        
        // Raise arm
        animateLine(rightArm, { x2: 25, y2: -40 }, 300, () => {
            // Wave motion
            let waveCount = 0;
            const waveInterval = setInterval(() => {
                if (waveCount >= 6) {
                    clearInterval(waveInterval);
                    // Lower arm back
                    animateLine(rightArm, { x2: 25, y2: -10 }, 300, () => {
                        isAnimating = false;
                    });
                    return;
                }
                const targetY = waveCount % 2 === 0 ? -35 : -40;
                animateLine(rightArm, { x2: 25, y2: targetY }, 200);
                waveCount++;
            }, 200);
        });
    }
    
    // Animation: Jump
    function jumpAnimation() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Get current position
        const currentTransform = stickman.getAttribute('transform') || 'translate(100, 250)';
        const match = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        const baseX = match ? parseFloat(match[1]) : 100;
        const baseY = match ? parseFloat(match[2]) : 250;
        
        // Crouch
        stickman.setAttribute('transform', `translate(${baseX}, ${baseY + 20})`);
        
        setTimeout(() => {
            // Jump up
            stickman.setAttribute('transform', `translate(${baseX}, ${baseY - 80})`);
            animateLine(leftArm, { y2: -30 }, 400);
            animateLine(rightArm, { y2: -30 }, 400);
            
            setTimeout(() => {
                // Fall down
                stickman.setAttribute('transform', `translate(${baseX}, ${baseY})`);
                animateLine(leftArm, { y2: -10 }, 400);
                animateLine(rightArm, { y2: -10 }, 400, () => {
                    isAnimating = false;
                });
            }, 400);
        }, 200);
    }
    
    // Animation: Dance
    function danceAnimation() {
        if (isAnimating) return;
        isAnimating = true;
        
        const currentTransform = stickman.getAttribute('transform') || 'translate(100, 250)';
        const match = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        const baseX = match ? parseFloat(match[1]) : 100;
        const baseY = match ? parseFloat(match[2]) : 250;
        
        let danceStep = 0;
        const danceInterval = setInterval(() => {
            if (danceStep >= 6) {
                clearInterval(danceInterval);
                stickman.setAttribute('transform', `translate(${baseX}, ${baseY})`);
                animateLine(leftArm, { x2: -25, y2: -10 }, 250);
                animateLine(rightArm, { x2: 25, y2: -10 }, 250, () => {
                    isAnimating = false;
                });
                return;
            }
            
            const rotation = danceStep % 2 === 0 ? -10 : 10;
            stickman.setAttribute('transform', `translate(${baseX}, ${baseY}) rotate(${rotation})`);
            
            if (danceStep % 2 === 0) {
                animateLine(leftArm, { x2: -30, y2: -35 }, 250);
                animateLine(rightArm, { x2: 30, y2: -35 }, 250);
            } else {
                animateLine(leftArm, { x2: -25, y2: -10 }, 250);
                animateLine(rightArm, { x2: 25, y2: -10 }, 250);
            }
            
            danceStep++;
        }, 500);
    }
    
    // Animation: Walk
    function walkAnimation() {
        if (isAnimating) return;
        isAnimating = true;
        
        const currentTransform = stickman.getAttribute('transform') || 'translate(100, 250)';
        const match = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        let currentX = match ? parseFloat(match[1]) : 100;
        const baseY = match ? parseFloat(match[2]) : 250;
        
        let walkStep = 0;
        const walkInterval = setInterval(() => {
            if (walkStep >= 8) {
                clearInterval(walkInterval);
                // Reset limbs
                animateLine(leftLeg, { x2: -20, y2: 60 }, 300);
                animateLine(rightLeg, { x2: 20, y2: 60 }, 300);
                animateLine(leftArm, { x2: -25, y2: -10 }, 300);
                animateLine(rightArm, { x2: 25, y2: -10 }, 300, () => {
                    isAnimating = false;
                });
                return;
            }
            
            // Move forward
            currentX += 25;
            stickman.setAttribute('transform', `translate(${currentX}, ${baseY})`);
            
            // Alternate leg and arm movements
            if (walkStep % 2 === 0) {
                animateLine(leftLeg, { x2: -25, y2: 50 }, 250);
                animateLine(rightLeg, { x2: 15, y2: 65 }, 250);
                animateLine(leftArm, { x2: -20, y2: -5 }, 250);
                animateLine(rightArm, { x2: 30, y2: -15 }, 250);
            } else {
                animateLine(leftLeg, { x2: -15, y2: 65 }, 250);
                animateLine(rightLeg, { x2: 25, y2: 50 }, 250);
                animateLine(leftArm, { x2: -30, y2: -15 }, 250);
                animateLine(rightArm, { x2: 20, y2: -5 }, 250);
            }
            
            walkStep++;
        }, 500);
    }
    
    // Text-to-Speech function
    // Uses third-party TTS API from lazypy.ro as specified in requirements
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
            // API call to external TTS service
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
