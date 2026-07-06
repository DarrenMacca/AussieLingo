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
        
        // Web-safe sanitization for HTML attribute data targeting
        const safeAudioSrc = encodeURIComponent(item.audio);

        return `
            <article class="slang-card" data-category="${item.category}">
                <div class="slang-card-header">
                    <span class="category-badge">${categoryLabel}</span>
                    <button class="audio-btn" onclick="playSlangAudio('${safeAudioSrc}', this)" aria-label="Play audio pronunciation">
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
            
            // Verifies if the dataset array from dictionary-data.js exists globally before filtering
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
});

/**
 * ==========================================================================
 * GLOBAL AUDIO CONTROLLER ENGINE
 * Placed outside DOM scope so inline 'onclick' elements can access it.
 * ==========================================================================
 */
let currentAudioInstance = null;
let currentActiveButton = null;

function playSlangAudio(audioFile, buttonElement) {
    // If the exact same audio is playing, pause it and reset state
    if (currentAudioInstance && currentActiveButton === buttonElement) {
        if (!currentAudioInstance.paused) {
            currentAudioInstance.pause();
            buttonElement.classList.remove('playing');
            buttonElement.innerHTML = '<span class="btn-icon">🔊</span> Listen Intro';
            return;
        }
    }

    // Stop and scrub any prior instance before executing the new string path
    if (currentAudioInstance) {
        currentAudioInstance.pause();
        if (currentActiveButton) {
            currentActiveButton.classList.remove('playing');
            currentActiveButton.innerHTML = '<span class="btn-icon">🔊</span> Listen Intro';
        }
    }

    // Path structure configuration matching your asset architecture folder
    // Change "assets/audio/" to your absolute or relative asset path
    const audioPath = `assets/audio/${decodeURIComponent(audioFile)}`;
    
    currentAudioInstance = new Audio(audioPath);
    currentActiveButton = buttonElement;

    buttonElement.classList.add('playing');
    buttonElement.innerHTML = '<span class="btn-icon">⏳</span> Loading...'; // Loader stream feedback

    currentAudioInstance.play()
        .then(() => {
            buttonElement.innerHTML = '<span class="btn-icon">⏸️</span> Pause';
        })
        .catch(error => {
            console.error("Audio stream asset dropped 404 mismatch error:", error);
            buttonElement.classList.remove('playing');
            buttonElement.innerHTML = '<span class="btn-icon">❌</span> Error';
            setTimeout(() => {
                buttonElement.innerHTML = '<span class="btn-icon">🔊</span> Listen Intro';
            }, 1500);
        });

    // Reset indicator elements automatically once the clip successfully runs to completion
    currentAudioInstance.onended = () => {
        buttonElement.classList.remove('playing');
        buttonElement.innerHTML = '<span class="btn-icon">🔊</span> Listen Intro';
        currentAudioInstance = null;
        currentActiveButton = null;
    };

