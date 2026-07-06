document.addEventListener('DOMContentLoaded', () => {
    // 1. Core DOM Element Bindings
    const gridRoot = document.getElementById('slang-grid-root');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modeCheckbox = document.getElementById('flashcard-mode-checkbox');

    // 2. Global State Parameters
    let activeCategory = 'all';
    let isFlashcardMode = modeCheckbox ? modeCheckbox.checked : false;

    /**
     * 3. HTML String Template Assembly Channel (Restored)
     */
    function createSlangCardTemplate(item) {
        // FIXED: Escaping single quotes safely using standard entity strings to avoid syntax errors
        const escapedWord = String(item.word).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
        const escapedDefinition = String(item.definition).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
        const escapedCategory = String(item.category).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));

        const badgeMarkup = `<span class="category-badge">${escapedCategory}</span>`;
        const audioButtonMarkup = `
            <button class="audio-btn" data-word="${escapedWord}" aria-label="Listen to pronunciation of ${escapedWord}">
                <span class="btn-icon">🔊</span> Listen
            </button>
        `;

        if (isFlashcardMode) {
            return `
                <div class="slang-card" data-spoken="${escapedWord}" style="width: 100%; display: block; padding: 0;">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            <div class="slang-card-header">
                                ${badgeMarkup}
                                ${audioButtonMarkup}
                            </div>
                            <div class="slang-card-body">
                                <h3 class="aussie-word">${escapedWord}</h3>
                            </div>
                        </div>
                        <div class="flashcard-back">
                            <div class="slang-card-header">
                                <span class="category-badge" style="background: rgba(255,255,255,0.1)">Definition</span>
                            </div>
                            <div class="slang-card-body">
                                <p class="english-translation">${escapedDefinition}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="slang-card" style="width: 100%;">
                <div class="slang-card-header">
                    ${badgeMarkup}
                    ${audioButtonMarkup}
                </div>
                <div class="slang-card-body">
                    <h3 class="aussie-word">${escapedWord}</h3>
                    <p class="english-translation">${escapedDefinition}</p>
                </div>
            </div>
        `;
    }

    /**
     * 4. Core Interface Render Canvas Channel
     */
    function renderDictionaryGrid() {
        if (!gridRoot) return;

        if (typeof AUSSIE_SLANG_DATA === 'undefined' || !Array.isArray(AUSSIE_SLANG_DATA)) {
            gridRoot.innerHTML = `
                <div class="no-results" style="border-color: #ef4444; color: #ef4444;">
                    <p><strong>Initialization Error:</strong> Could not load array layer data safely from dictionary-data.js.</p>
                </div>
            `;
            return;
        }

        const filteredData = (activeCategory === 'all')
            ? AUSSIE_SLANG_DATA
            : AUSSIE_SLANG_DATA.filter(item => item.category === activeCategory);

        if (filteredData.length === 0) {
            gridRoot.innerHTML = `
                <div class="no-results">
                    <p>No Aussie terms found matching your criteria.</p>
                </div>
            `;
            return;
        }

        gridRoot.innerHTML = filteredData.map(item => createSlangCardTemplate(item)).join('');
    }

    /**
     * 5. Navigation Control Filter Core Mechanism
     */
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) return;

            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.removeAttribute('aria-current');
            });

            button.classList.add('active');
            button.setAttribute('aria-current', 'page');

            activeCategory = button.getAttribute('data-category');
            renderDictionaryGrid();
        });
    });

    /**
     * 6. Interactive Flashcard Mode State Change Delegate Switch
     */
    if (modeCheckbox) {
        modeCheckbox.addEventListener('change', (e) => {
            isFlashcardMode = e.target.checked;
            const appWrapper = document.querySelector('.app-wrapper');
            
            if (isFlashcardMode) {
                if (appWrapper) appWrapper.classList.add('flashcard-active');
                gridRoot.classList.add('flashcard-active');
            } else {
                if (appWrapper) appWrapper.classList.remove('flashcard-active');
                gridRoot.classList.remove('flashcard-active');
                if (window.speechSynthesis) window.speechSynthesis.cancel();
            }
            
            renderDictionaryGrid();
        });
    }

    /**
     * 7. Live Container Event Delegate for Flashcard 3D Rotation & Audio Channels
     */
    gridRoot.addEventListener('click', (event) => {
        const audioBtn = event.target.closest('.audio-btn');
        const slangCard = event.target.closest('.slang-card');
        
        if (!slangCard) return;

        // --- AUDIO TRIGGER PIPELINE (Speaker Button Manual Taps) ---
        if (audioBtn) {
            event.stopPropagation();
            event.preventDefault();

            const targetText = audioBtn.getAttribute('data-word');

            if (targetText && typeof window.speakAussieSlang === 'function') {
                window.speakAussieSlang(targetText, audioBtn);
            }
            return;
        }

        // --- FLASHCARD FLIP PIPELINE (Card Space Tapped) ---
        if (isFlashcardMode) {
            const internalAudioButton = slangCard.querySelector('.audio-btn');
            
            // Extract the word string payload safely before running the flip transitions
            const targetText = slangCard.getAttribute('data-spoken') || 
                               (internalAudioButton ? internalAudioButton.getAttribute('data-word') : '');
            
            const willBeFlipped = !slangCard.classList.contains('flipped');

            slangCard.classList.toggle('flipped');

            if (willBeFlipped) {
                // Execute a micro-delay execution track to ensure mobile browsers don't clip the audio thread
                setTimeout(() => {
                    if (targetText && typeof window.speakAussieSlang === 'function') {
                        window.speakAussieSlang(targetText, internalAudioButton);
                    }
                }, 50);
            } else {
                if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                }
                if (internalAudioButton) {
                    internalAudioButton.classList.remove('playing');
                    internalAudioButton.innerHTML = '<span class="btn-icon">🔊</span> Listen';
                }
            }
        }
    });

    /**
     * 8. Text-to-Speech Engine Definition
     */
    function speakAussieSlang(textToSpeak, triggerButton) {
        if (!window.speechSynthesis) return;

        window.speechSynthesis.cancel();

        document.querySelectorAll('.audio-btn.playing').forEach(btn => {
            btn.classList.remove('playing');
            btn.innerHTML = '<span class="btn-icon">🔊</span> Listen';
        });

        const cleanText = String(textToSpeak).trim();
        if (!cleanText || cleanText === 'undefined') return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        const availableVoices = window.speechSynthesis.getVoices();
        
        // Scan internal system voice array layers for authentic Australian accents
        const australianVoice = availableVoices.find(v => v.lang === 'en-AU' || v.lang.includes('AU')) || 
                               availableVoices.find(v => v.lang.startsWith('en-'));

        if (australianVoice) utterance.voice = australianVoice;
        utterance.rate = 0.88; // Pace modifier to simulate authentic strine presentation channels

        utterance.onstart = () => {
            if (triggerButton) {
                triggerButton.classList.add('playing');
                triggerButton.innerHTML = '<span class="btn-icon">⏳</span> Talkin...';
            }
        };

        utterance.onend = () => {
            if (triggerButton) {
                triggerButton.classList.remove('playing');
                triggerButton.innerHTML = '<span class="btn-icon">🔊</span> Listen';
            }
        };

        utterance.onerror = () => {
            if (triggerButton) {
                triggerButton.classList.remove('playing');
                triggerButton.innerHTML = '<span class="btn-icon">🔊</span> Listen';
            }
        };

        window.speechSynthesis.speak(utterance);
    }

    // Explicit registration directly onto the global window object layer
    window.speakAussieSlang = speakAussieSlang;

    // 9. Initial Execution Invocations
    renderDictionaryGrid();

    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
}); // Ends DOMContentLoaded Hook




