/**
 * ==========================================================================
 * THE GREAT AUSSIE SLANG DICTIONARY ENGINE
 * Compiled & Optimized Production Runtime
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const gridRoot = document.getElementById('slang-grid-root');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modeCheckbox = document.getElementById('flashcard-mode-checkbox');

    let isFlashcardMode = modeCheckbox ? modeCheckbox.checked : false;
    let activeCategory = 'all';

    /**
     * 1. Component Card Generation Engine
     */
    function createSlangCardTemplate(item) {
        const displayCategories = {
            'everyday-people': '👥 Everyday People',
            'core-phrases': '💬 Core Greetings & Phrases',
            'food-drink': '🍺 Food & Drink',
            'time-places': '📍 Time & Places',
            'clothing-items': '🩴 Clothing & Items',
            'adjectives-modifiers': '✨ Adjectives & Modifiers',
            'actions-verbs': '🏃 Actions & Verbs',
            'idioms': '🦘 Metaphors & Idioms',
            'Multiple-Use-Same-Word': '🔄 Multiple Use',
        };

        const categoryLabel = displayCategories[item.category] || item.category;
        const safeSpokenWord = encodeURIComponent(item.aussie.split('/')[0].trim());

        if (!isFlashcardMode) {
            return `
                <article class="slang-card" data-category="${item.category}">
                    <div class="slang-card-header">
                        <span class="category-badge">${categoryLabel}</span>
                        <button class="audio-btn" onclick="speakAussieSlang('${safeSpokenWord}', this); event.stopPropagation();">
                            <span class="btn-icon">🔊</span> Listen
                        </button>
                    </div>
                    <div class="slang-card-body">
                        <h3 class="aussie-term">${item.aussie}</h3>
                        <p class="english-translation">${item.english}</p>
                    </div>
                </article>
            `;
        }
return `
            <article class="slang-card" data-category="${item.category}" data-spoken="${safeSpokenWord}">
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <div class="slang-card-header"><span class="category-badge">${categoryLabel}</span></div>
                        <div class="slang-card-body"><p class="english-translation">${item.english}</p></div>
                    </div>
                    <div class="flashcard-back">
                        <div class="slang-card-header">
                            <span class="category-badge">${categoryLabel}</span>
                            <button class="audio-btn" style="pointer-events: none;"><span class="btn-icon">🔊</span></button>
                        </div>
                        <div class="slang-card-body"><h3 class="aussie-term">${item.aussie}</h3></div>
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * 2. Rendering & UI Event Handlers
     */
    function renderDictionaryGrid() {
        if (!gridRoot) return;
        const filteredData = (activeCategory === 'all')
            ? AUSSIE_SLANG_DATA
            : AUSSIE_SLANG_DATA.filter(item => item.category === activeCategory);

        gridRoot.innerHTML = filteredData.length > 0 
            ? filteredData.map(item => createSlangCardTemplate(item)).join('')
            : '<div class="no-results"><p>No Aussie terms found matching your criteria.</p></div>';
    }

    // Filter Buttons Listener
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            activeCategory = button.getAttribute('data-category');
            renderDictionaryGrid();
        });
    });

    // Flashcard Mode Toggle
    if (modeCheckbox) {
        modeCheckbox.addEventListener('change', (e) => {
            isFlashcardMode = e.target.checked;
            gridRoot.classList.toggle('flashcard-active', isFlashcardMode);
            if (!isFlashcardMode && window.speechSynthesis) window.speechSynthesis.cancel();
            renderDictionaryGrid();
        });
    }
/**
 * 1. Flashcard & Interaction Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const gridRoot = document.getElementById('slang-grid-root');
    const quizNavBtn = document.getElementById('quiz-nav-btn');
    const backBtn = document.getElementById('back-to-dashboard-btn');
    const dashboard = document.querySelector('.main-content-display');
    const quizScreen = document.getElementById('quiz-screen');

    // Flashcard Click Delegation
    if (gridRoot) {
        gridRoot.addEventListener('click', (event) => {
            // Assumes isFlashcardMode is defined globally or elsewhere
            if (typeof isFlashcardMode !== 'undefined' && !isFlashcardMode) return;
            
            const slangCard = event.target.closest('.slang-card');
            if (!slangCard) return;

            slangCard.classList.toggle('flipped');
            const isFlipped = slangCard.classList.contains('flipped');
            const textTarget = slangCard.getAttribute('data-spoken');
            const audioBtn = slangCard.querySelector('.flashcard-back .audio-btn');

            if (isFlipped && textTarget) {
                speakAussieSlang(textTarget, audioBtn);
            } else if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        });
    }

    // Screen Switching Logic
    if (quizNavBtn && backBtn && dashboard && quizScreen) {
        quizNavBtn.addEventListener('click', () => {
            dashboard.classList.add('dashboard-hidden');
            quizScreen.classList.add('visible-screen');
            startQuiz(); // Initialize quiz when navigating to it
        });

        backBtn.addEventListener('click', () => {
            dashboard.classList.remove('dashboard-hidden');
            quizScreen.classList.remove('visible-screen');
        });
    }

    // Initial Render
    if (typeof renderDictionaryGrid === 'function') {
        renderDictionaryGrid();
    }
});

/**
 * 2. Native Australian Text-to-Speech Synthesizer Engine
 */
function speakAussieSlang(textToSpeak, buttonElement) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const cleanPhrase = decodeURIComponent(textToSpeak);
    const utterance = new SpeechSynthesisUtterance(cleanPhrase);

    const voices = window.speechSynthesis.getVoices();
    const aussieVoice = voices.find(v => v.lang.includes('en-AU') || v.name.toLowerCase().includes('australia'));

    if (aussieVoice) utterance.voice = aussieVoice;
    utterance.rate = 0.85; 
    utterance.pitch = 0.90;

    if (buttonElement) {
        buttonElement.classList.add('playing');
        buttonElement.innerHTML = '<span class="btn-icon">💬</span>';
    }

    utterance.onend = utterance.onerror = () => {
        if (buttonElement) {
            buttonElement.classList.remove('playing');
            buttonElement.innerHTML = '<span class="btn-icon">🔊</span>';
        }
    };
    window.speechSynthesis.speak(utterance);
}

/**
 * 3. Quiz Engine
 */
let currentQuizIndex = 0;
let quizScore = 0;
const TOTAL_QUESTIONS = 20;

function startQuiz() {
    console.log("Quiz initializing...");
    currentQuizIndex = 0;
    quizScore = 0;
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const progress = (currentQuizIndex / TOTAL_QUESTIONS) * 100;
        progressBar.style.width = `${progress}%`;
    }

    const target = AUSSIE_SLANG_DATA[Math.floor(Math.random() * AUSSIE_SLANG_DATA.length)];
    let options = [target.aussie];
    
    while(options.length < 4) {
        let rand = AUSSIE_SLANG_DATA[Math.floor(Math.random() * AUSSIE_SLANG_DATA.length)].aussie;
        if(!options.includes(rand)) options.push(rand);
    }
    options.sort(() => Math.random() - 0.5);

    const questionEl = document.getElementById('quiz-question');
    const grid = document.getElementById('options-grid');
    if (questionEl) questionEl.innerText = target.english;
    
    if (grid) {
        grid.innerHTML = '';
        options.forEach(opt => {
            const pill = document.createElement('button');
            pill.className = 'pill-btn';
            pill.innerText = opt;
            pill.onclick = () => handleAnswer(opt, target.aussie);
            grid.appendChild(pill);
        });
    }
}

function handleAnswer(selected, correct) {
    if(selected === correct) quizScore++;
    currentQuizIndex++;
    
    if(currentQuizIndex < TOTAL_QUESTIONS) {
        renderQuizQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const finalScore = (quizScore / TOTAL_QUESTIONS) * 100;
    if(finalScore >= 85) {
        alert("Crikey! You earned your Certificate! Score: " + finalScore + "%");
    } else {
        alert("You muppet. Not quite, mate. You scored " + finalScore + "%. Try again!");
        startQuiz();
    }
}
   
