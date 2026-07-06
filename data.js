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

    // Safely fallback to the raw category string if an undefined key is passed
    const categoryLabel = displayCategories[item.category] || item.category;

    // Your template rendering logic continues below...
}


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
     * Synchronizes and locks on native, realistic Australian dialect strings
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
        
        // Step A: Hardcode primary locale instruction strings
        utterance.lang = 'en-AU';

        // Step B: Deep-scan system engine directories for a high-quality regional accent
        const voices = window.speechSynthesis.getVoices();
        
        // Filter specifically for "Microsoft Natasha" (Windows), "Karen/Siri" (Apple), or local Google neural streams
        let aussieVoice = voices.find(voice => 
            voice.lang === 'en-AU' || 
            voice.lang === 'en_AU' ||
            voice.name.toLowerCase().includes('australia') ||
            voice.name.toLowerCase().includes('en-au')
        );

        if (aussieVoice) {
            utterance.voice = aussieVoice;
        }

        // Step C: Accent modulation layers for a true blue casual flow
        utterance.rate = 0.78;   // Slowed down a bit more so vowels naturally stretch/drawl out
        utterance.pitch = 0.92;  // Lower pitch slightly to remove robotic, stiff high notes

        // UI Visual Feedback configuration changes
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

    // 7. Background Voice Loading Cache Warm-up Handshake
    // Forces Chrome, Edge, and mobile browsers to pre-fetch voice profiles early
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
});
