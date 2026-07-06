/**
 * ==========================================================================
 * THE GREAT AUSSIE SLANG DICTIONARY ENGINE
 * Core Runtime Application Pipeline Script
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core DOM Element Cache Handles
    const gridRoot = document.getElementById('slang-grid-root');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Global operational audio reference pointer to prevent multi-track overlapping
    let currentAudio = null;

    /**
     * 2. Component Card Generation Engine
     * Transforms an individual slang record object into a structural HTML template string
     * Includes a clean backup fallback to gracefully handle your stylesheet typo: "Bothers"
     */
    function createSlangCardTemplate(item) {
        // Safe mapping to convert machine category strings into clean display labels
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
        
        // Clean display handling matching your .aussie-term and .english-translation classes
        return `
            <article class="slang-card">
                <div>
                    <span class="category-badge">${readableCategory}</span>
                    <h3 class="aussie-term">${item.aussie}</h3>
                    <p class="english-translation">${item.english}</p>
                </div>
                <div class="card-actions">
                    <button class="audio-btn" data-audio-file="${item.audio}">
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
        // Zero-state exception path handling utilizing the empty state CSS selector
        if (!filteredData || filteredData.length === 0) {
            gridRoot.innerHTML = `
                <div class="no-results">
                    <p>No Aussie terms found in this track matching your criteria.</p>
                </div>
            `;
            return;
        }

        // Optimized structural string aggregation loop for performant DOM loading
        gridRoot.innerHTML = filteredData.map(item => createSlangCardTemplate(item)).join('');
    }

        /**
     * 4. Multi-Layer Interactivity Pipeline Event Delegates
     * Uses Built-in Browser Text-to-Speech Engine
     */
    gridRoot.addEventListener('click', (event) => {
        // Detect if the clicked element is our audio button
        const audioBtn = event.target.closest('.audio-btn');
        if (!audioBtn) return;

        // Extract the raw slang term text directly out of the active card markup
        const slangCard = audioBtn.closest('.slang-card');
        const slangText = slangCard.querySelector('.aussie-term').textContent;
        if (!slangText) return;

        // Terminate any audio tracks currently outputting to speakers
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        // Initialize standard speech parameters
        const utterance = new SpeechSynthesisUtterance(slangText);
        
        // Scan the client system engine profiles to request a native Australian voice
        const voices = window.speechSynthesis.getVoices();
        const aussieVoice = voices.find(voice => voice.lang === 'en-AU');
        if (aussieVoice) {
            utterance.voice = aussieVoice;
        }

        // Slow down playback speed slightly for global pronunciation clarity
        utterance.rate = 0.85;
        utterance.pitch = 1.0;

        // Provide immediate visual feedback state adjustments to the interface
        const initialText = `<span class="btn-icon">🔊</span> Listen Intro`;
        audioBtn.innerHTML = `<span class="btn-icon">💬</span> Speaking...`;
        audioBtn.style.opacity = '0.7';

        // Trigger voice output
        window.speechSynthesis.speak(utterance);

        // Reset the interface interactive layouts clean when pronunciation concludes
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
     * Loops control panels and configures selection state indicators matching data attributes
     */
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Prevent execution loops if clicking an already active navigation element
            if (button.classList.contains('active')) return;

            // Remove structural focus configuration styling classes across peer navigation row nodes
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.removeAttribute('aria-current');
            });

            // Apply interactive dynamic focus highlighting attributes onto selected node layout element
            button.classList.add('active');
            button.setAttribute('aria-current', 'page');

            const targetCategory = button.getAttribute('data-category');

            // Evaluate target dataset slicing route matching global dictionary variable key records
            const results = (targetCategory === 'all') 
                ? slangData 
                : slangData.filter(item => item.category === targetCategory);

            // Re-render interface window frames dynamically
            renderDictionaryGrid(results);
        });
    });

    // 6. Runtime Initial Initialization Spark Execution Core Path
    // Validates global availability of loaded data resource layers before rendering UI
    if (typeof slangData !== 'undefined' && Array.isArray(slangData)) {
        renderDictionaryGrid(slangData);
    } else {
        console.error('Critical Engine Error: "slangData" array missing from initialization lifecycle runtime framework contexts.');
        gridRoot.innerHTML = `
            <div class="no-results" style="border-color: #ef4444; color: #ef4444;">
                <p><strong>Initialization Error:</strong> Could not load dictionary array layers securely. Verify dictionary-data.js placement mapping configurations.</p>
            </div>
        `;
    }
});
