/**
 * ==========================================================================
 * THE GREAT AUSSIE SLANG DICTIONARY ENGINE
 * Core Runtime Application Pipeline Script (Ultimate en-AU Accent Filter)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core DOM Element Cache Handles
    const gridRoot = document.getElementById('slang-grid-root');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modeCheckbox = document.getElementById('flashcard-mode-checkbox');

    // Runtime state tracking flags
    let isFlashcardMode = false;
    let activeCategory = 'all';

    /**
     * 2. Component Card Generation Engine
     */
    function createSlangCardTemplate(item) {
        const displayCategories = {
            'everyday-people': '👥 Everyday People',
            'core-phrases': '💬 Core Greetings & Phrases',
            'Multiple Use - Same Word': '🔄 Multiple Use - Same Word',
            'food-drink': '🍺 Food & Drink',
            'time-places': '📍 Time & Places',
            'clothing-items': '🩴 Clothing & Items',
            'adjectives-modifiers': '✨ Adjectives & Modifiers',
            'actions-verbs': '🏃 Actions & Verbs',
            'idioms': '🦘 Metaphors & Idioms',
            'misc': '🃏 Miscellaneous Slang'
        };

        const categoryLabel = displayCategories[item.category] || item.category;
        
        // Split variations safely if a word holds multiple slash slangs
        const splitArray = item.aussie.split('/');
const firstVariant = splitArray[0].trim();
const safeSpokenWord = encodeURIComponent(firstVariant);

        // Standard Regular Dictionary Card Layout
        if (!isFlashcardMode) {
            return `
                <article class="slang-card" data-category="${item.category}">
                    <div class="slang-card-header">
                        <span class="category-badge">${categoryLabel}</span>
                        <button class="audio-btn" onclick="speakAussieSlang('${safeSpokenWord}', this); event.stopPropagation();" aria-label="Play audio pronunciation">
                            <span class="btn-icon">🔊</span> Listen Intro
                        </button>
                    </div>
                    <div class="slang-card-body">
                        <h3 class="aussie-term">${item.aussie}</h3>
                        <p class="english-translation">${item.english}</p>
                    </div>
                </article>
            `;
        }

        // Upgraded Double-Sided 3D Flashcard Mode Layout
        return `
            <article class="slang-card" data-category="${item.category}" data-spoken="${safeSpokenWord}">
                <div class="flashcard-inner">
                    <!-- FRONT FACE LAYER PANEL: Standard English translation display -->
                    <div class="flashcard-front">
                        <div class="slang-card-header">
                            <span class="category-badge">${categoryLabel}</span>
                            <span style="font-size: 0.8rem; color: var(--text-dark-subtle); font-weight: 600;">❔ Definition</span>
                        </div>
                        <div class="slang-card-body">
                            <p class="english-translation" style="font-size: 1.1rem; text-align: center; font-weight: 500;">${item.english}</p>
                        </div>
                        <div style="font-size: 0.75rem; text-align: center; color: var(--text-dark-subtle);">Click Card to Flip</div>
                    </div>
                    <!-- BACK FACE LAYER PANEL: Aussie slang term reveal display with active speaker triggers -->
                    <div class="flashcard-back">
                        <div class="slang-card-header">
                            <span class="category-badge">${categoryLabel}</span>
                            <button class="audio-btn" aria-label="Listen audio profile" style="pointer-events: none;">
                                <span class="btn-icon">🔊</span>
                            </button>
                        </div>
                        <div class="slang-card-body">
                            <h3 class="aussie-term" style="font-size: 1.8rem; text-align: center; color: var(--primary-neon-glow);">${item.aussie}</h3>
                        </div>
                        <div style="font-size: 0.75rem; text-align: center; color: var(--text-dark-subtle);">Click Card to Reset</div>
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * 3. Core Interface Render Canvas Channel
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
     * 4. Navigation Control Filter Core Mechanism
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
     * 5. Interactive Flashcard Mode State Change Delegate Switch
     */
    if (modeCheckbox) {
        modeCheckbox.addEventListener('change', (e) => {
            isFlashcardMode = e.target.checked;
            
            // Toggle container classes to toggle explicit card height and properties
            if (isFlashcardMode) {
                gridRoot.classList.add('flashcard-active');
            } else {
                gridRoot.classList.remove('flashcard-active');
                if (window.speechSynthesis) window.speechSynthesis.cancel();
            }
            
            renderDictionaryGrid();
        });
    }

    /**
     * 6. Live Container Event Delegate for Flashcard 3D Rotation Triggers
     */
    gridRoot.addEventListener('click', (event) => {
        if (!isFlashcardMode) return;

        const slangCard = event.target.closest('.slang-card');
        if (!slangCard) return;

        // Toggle rotation state animation handles on clicked card node
        slangCard.classList.toggle('flipped');

        const isFlipped = slangCard.classList.contains('flipped');
        const textTarget = slangCard.getAttribute('data-spoken');
        const internalAudioButton = slangCard.querySelector('.flashcard-back .audio-btn');

        if (isFlipped && textTarget && internalAudioButton) {
            // Card flipped to Aussie side -> Execute drawl vocalisation engine path
            speakAussieSlang(textTarget, internalAudioButton);
        } else {
            // Card flipped back to English side -> Kill voices silently immediately
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            if (internalAudioButton) {
                internalAudioButton.classList.remove('playing');
                internalAudioButton.innerHTML = '<span class="btn-icon">🔊</span>';
            }
        }
    });

    // 7. Initial Runtime Boot Trigger Execution Path
    renderDictionaryGrid();

    // 8. Background Voice Loading Cache Warm-up Handshake
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
});

/**
 * ==========================================================================
 * NATIVE TEXT-TO-SPEECH SYNTHESIZER ENGINE
 * ==========================================================================
 */
let currentActiveButton = null;

function speakAussieSlang(textToSpeak, buttonElement) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    if (currentActiveButton) {
        currentActiveButton.classList.remove('playing');
        currentActiveButton.innerHTML = '<span class="btn-icon">🔊</span>';
    }

    const cleanPhrase = decodeURIComponent(textToSpeak);
    const utterance = new SpeechSynthesisUtterance(cleanPhrase);
    currentActiveButton = buttonElement;

    utterance.lang = 'en-AU';

    const voices = window.speechSynthesis.getVoices();
    const aussieVoice = voices.find(voice => 
        voice.lang === 'en-AU' || 
        voice.lang === 'en_AU' ||
        voice.name.toLowerCase().includes('australia') ||
        voice.name.toLowerCase().includes('en-au')
    );

    if (aussieVoice) utterance.voice = aussieVoice;

    utterance.rate = 0.78;   // Aussie Drawl pacing
    utterance.pitch = 0.92;  // Natural flatted notes modulation

    if (buttonElement) {
        buttonElement.classList.add('playing');
        buttonElement.innerHTML = '<span class="btn-icon">💬</span>';
    }

    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
        if (buttonElement) {
            buttonElement.classList.remove('playing');
            buttonElement.innerHTML = '<span class="btn-icon">🔊</span>';
        }
        currentActiveButton = null;
    };

    utterance.onerror = () => {
        if (buttonElement) {
            buttonElement.classList.remove('playing');
            buttonElement.innerHTML = '<span class="btn-icon">🔊</span>';
        }
        currentActiveButton = null;
    };
}
