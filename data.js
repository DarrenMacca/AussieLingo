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
     * Single shared container listener managing media events and interactions securely
     */
    gridRoot.addEventListener('click', (event) => {
        // Bubble up detection to verify if the clicked element is our audio action button
        const audioBtn = event.target.closest('.audio-btn');
        if (!audioBtn) return;

        const audioFile = audioBtn.getAttribute('data-audio-file');
        if (!audioFile) return;

        // Immediately pause and terminate any pre-existing playing audio track
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Construct standard audio target file path routing pointing to your asset directory
        const audioPath = `audio/${audioFile}`;
        currentAudio = new Audio(audioPath);

        // UI Feedback Indicator State shifts
        const initialText = audioBtn.innerHTML;
        audioBtn.innerHTML = `<span class="btn-icon">⏳</span> Loading...`;
        audioBtn.style.opacity = '0.7';

        currentAudio.play()
            .then(() => {
                audioBtn.innerHTML = `<span class="btn-icon">🔊</span> Playing...`;
            })
            .catch((error) => {
                console.warn(`Audio track error at ${audioPath}: File may not exist yet in your repository.`, error);
                audioBtn.innerHTML = `<span class="btn-icon">❌</span> File Missing`;
            })
            .finally(() => {
                audioBtn.style.opacity = '1';
                // Automatically reset button copy formatting back to original layout specification after track ends
                currentAudio.onended = () => {
                    audioBtn.innerHTML = initialText;
                };
            });
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
