/**
 * ==========================================================================
 * THE GREAT AUSSIE SLANG DICTIONARY ENGINE
 * Core Runtime Application Pipeline Script (Unified Web Speech Engine)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core DOM Element Cache Handles
    const gridRoot = document.getElementById('slang-grid-root');
    const filterButtons = document.querySelectorAll('.filter-btn');

    /**
     * 2. Component Card Generation Engine
     * Transforms an individual slang record object into a structural HTML template string
     */
    function createSlangCardTemplate(item) {
        const displayCategories = {
            'everyday-people': '👥 People',
            'core-phrases': '💬 Phrases',
            'food-drink': '🍺 Food & Drink',
            'time-places': '📍 Places',
            'clothing-items': '🩴 Clothing',
            'adjectives-modifiers': '✨ Adjective',
            'actions-verbs': '🏃 Verbs',
            'idioms': '🦘 Idiom',
            'misc': '🃏 Misc'
        };

        const readableCategory = displayCategories[item.category] || '🇦🇺 Slang';
        
        return `
            <article class="slang-card">
                <div>
                    <span class="category-badge">${readableCategory}</span>
                    <h3 class="aussie-term">${item.aussie}</h3>
                    <p class="english-translation">${item.english}</p>
                </div>
                <div class="card-actions">
                    <button class="audio-btn">
                        <span class="btn-icon">🔊</span> Listen Intro
                    </button>
                </div>
            </article>
        `;
    }

    /**
     * 3. Core Interface Render Canvas Channel
     * Flushes current grid elements and loops array contents into the display viewport space
     */
    function renderDictionaryGrid(filteredData) {
        if (!filteredData || filteredData.length === 0) {
            gridRoot.innerHTML = `
                <div class="no-results">
                    <p>No Aussie terms found in this track matching your criteria.</p>
                </div>
            `;
            return;
        }
        gridRoot.innerHTML = filteredData.map(item => createSlangCardTemplate(item)).join('');
    }

    /**
     * 4. Multi-Layer Interactivity Pipeline Event Delegates
     * Uses Built-in Browser Text-to-Speech Engine with Australian Voice Filters
     */
    gridRoot.addEventListener('click', (event) => {
        const audioBtn = event.target.closest('.audio-btn');
        if (!audioBtn) return;

        const slangCard = audioBtn.closest('.slang-card');
        const slangText = slangCard.querySelector('.aussie-term').textContent;
        if (!slangText) return;

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(slangText);
        utterance.lang = 'en-AU';
        
        const voices = window.speechSynthesis.getVoices();
        const aussieVoice = voices.find(voice => 
            voice.lang === 'en-AU' || 
            voice.lang.includes('en-AU') || 
            voice.name.toLowerCase().includes('australia')
        );

        if (aussieVoice) {
            utterance.voice = aussieVoice;
        }

        utterance.rate = 0.82;
        utterance.pitch = 0.95;

        const initialText = `<span class="btn-icon">🔊</span> Listen Intro`;
        audioBtn.innerHTML = `<span class="btn-icon">💬</span> Speaking...`;
        audioBtn.style.opacity = '0.7';

        window.speechSynthesis.speak(utterance);

        utterance.onend = () => {
            audioBtn.innerHTML = initialText;
            audioBtn.style.opacity = '1';
        };

        utterance.onerror = () => {
            audioBtn.innerHTML = initialText;
            audioBtn.style.opacity = '1';
        };
    });

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

            const targetCategory = button.getAttribute('data-category');
            const results = (targetCategory === 'all') 
                ? AUSSIE_SLANG_DATA 
                : AUSSIE_SLANG_DATA.filter(item => item.category === targetCategory);

            renderDictionaryGrid(results);
        });
    });

    // 6. Runtime Initial Initialization Spark Execution Core Path
    if (typeof AUSSIE_SLANG_DATA !== 'undefined' && Array.isArray(AUSSIE_SLANG_DATA)) {
        renderDictionaryGrid(AUSSIE_SLANG_DATA);
    } else {
        gridRoot.innerHTML = `
            <div class="no-results" style="border-color: #ef4444; color: #ef4444;">
                <p><strong>Initialization Error:</strong> Could not load dictionary array layers securely.</p>
            </div>
        `;
    }
});
