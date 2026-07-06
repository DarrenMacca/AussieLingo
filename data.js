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
        
        // Clean out any slashes or multiple word variations for clean pronunciation execution
        const spokenWordClean = item.aussie.split('/')[0].trim();
        const safeSpokenWord = encodeURIComponent(spokenWordClean);

        return `
            <article class="slang-card" data-category="${item.category}">
                <div class="slang-card-header">
                    <span class="category-badge">${categoryLabel}</span>
                    <button class="audio-btn" onclick="speakAussieSlang('${safeSpokenWord}', this)" aria-label="Listen to pronunciation">
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

    /**
     * 3. Core Interface Render Canvas Channel
     */
    function renderDictionaryGrid(filteredData) {
        if (!gridRoot) return;

        if (!filteredData || filteredData.length === 0) {
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

            const targetCategory = button.getAttribute('data-category');
            
            if (typeof AUSSIE_SLANG_DATA !== 'undefined' && Array.isArray(AUSSIE_SLANG_DATA)) {
                const results = (targetCategory === 'all') 
                    ? AUSSIE_SLANG_DATA 
                    : AUSSIE_SLANG_DATA.filter(item => item.category === targetCategory);

                renderDictionaryGrid(results);
            }
        });
    });

    /**
     * 5. Runtime Initial Initialization Spark Execution Core Path
     */
    if (typeof AUSSIE_SLANG_DATA !== 'undefined' && Array.isArray(AUSSIE_SLANG_DATA)) {
        renderDictionaryGrid(AUSSIE_SLANG_DATA);
    } else {
        if (gridRoot) {
            gridRoot.innerHTML = `
                <div class="no-results" style="border-color: #ef4444; color: #ef4444;">
                    <p><strong>Initialization Error:</strong> Could not load dictionary array layers securely from dictionary-data.js.</p>
                </div>
            `;
        }
    }

    // 6. Background Voice Loading Cache Warm-up Handshake
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
});

/**
 * ==========================================================================
 * NATIVE TEXT-TO-SPEECH SYNTHESIZER ENGINE
 * Placed outside DOM scope so inline 'onclick' elements can access it.
 * ==========================================================================
 */
let currentActiveButton = null;

function speakAussieSlang(textToSpeak, buttonElement) {
    if (!window.speechSynthesis) {
        console.warn("Speech Synthesis is not supported in this browser.");
        return;
    }

    // If already speaking, click pauses it and resets state
    if (window.speechSynthesis.speaking && currentActiveButton === buttonElement) {
        window.speechSynthesis.cancel();
        buttonElement.classList.remove('playing');
        buttonElement.innerHTML = '<span class="btn-icon">🔊</span> Listen Intro';
        currentActiveButton = null;
        return;
    }

    // Stop any active speeches before running the new phrase string
    window.speechSynthesis.cancel();
    if (currentActiveButton) {
        currentActiveButton.classList.remove('playing');
        currentActiveButton.innerHTML = '<span class="btn-icon">🔊</span> Listen Intro';
    }

    const cleanPhrase = decodeURIComponent(textToSpeak);
    const utterance = new SpeechSynthesisUtterance(cleanPhrase);
    currentActiveButton = buttonElement;

    // Layer A: Enforce native en-AU locale target formatting
    utterance.lang = 'en-AU';

    // Layer B: Extract deep system voices looking for premium local streams
    const voices = window.speechSynthesis.getVoices();
    const aussieVoice = voices.find(voice => 
        voice.lang === 'en-AU' || 
        voice.lang === 'en_AU' ||
        voice.name.toLowerCase().includes('australia') ||
        voice.name.toLowerCase().includes('en-au')
    );

    if (aussieVoice) {
        utterance.voice = aussieVoice;
    }

    // Layer C: Accent modulation tweaks for a relaxed Australian flow
    utterance.rate = 0.78;   // Natural down-under drawl pacing
    utterance.pitch = 0.92;  // Flattens stiff, high-pitched robotic notes

    // Update UI button elements to show action status
    buttonElement.classList.add('playing');
    buttonElement.innerHTML = '<span class="btn-icon">💬</span> Speaking...';

    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
        buttonElement.classList.remove('playing');
        buttonElement.innerHTML = '<span class="btn-icon">🔊</span> Listen Intro';
        currentActiveButton = null;
    };

    utterance.onerror = () => {
        buttonElement.classList.remove('playing');
        buttonElement.innerHTML = '<span class="btn-icon">🔊</span> Listen Intro';
        currentActiveButton = null;
    };
}
