// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabs = document.querySelectorAll('.tab');
    const generatorTab = document.getElementById('generator-tab');
    const writerTab = document.getElementById('writer-tab');
    const savedTab = document.getElementById('saved-tab');
    const categories = document.querySelectorAll('.category');
    const currentPrompt = document.getElementById('current-prompt');
    const writingPrompt = document.getElementById('writing-prompt');
    const generatePromptBtn = document.getElementById('generate-prompt');
    const usePromptBtn = document.getElementById('use-prompt');
    const savePromptBtn = document.getElementById('save-prompt');
    const getContinuationBtn = document.getElementById('get-continuation');
    const storyText = document.getElementById('story-text');
    const wordCount = document.getElementById('word-count');
    const getHelpBtn = document.getElementById('get-help');
    const aiSuggestions = document.getElementById('ai-suggestions');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const savedPromptsList = document.getElementById('saved-prompts-list');
    const noSaved = document.getElementById('no-saved');
    
    // State
    let currentPromptText = '';
    let savedPrompts = JSON.parse(localStorage.getItem('savedPrompts')) || [];
    let selectedCategory = 'all';
    
    // Initialize only if elements exist
    if (storyText && wordCount) {
        updateWordCount();
    }
    displaySavedPrompts();
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (tab.dataset.tab === 'generator') {
                generatorTab.classList.add('active');
                writerTab.classList.remove('active');
                savedTab.classList.remove('active');
            } else if (tab.dataset.tab === 'writer') {
                writerTab.classList.add('active');
                generatorTab.classList.remove('active');
                savedTab.classList.remove('active');
            } else {
                savedTab.classList.add('active');
                generatorTab.classList.remove('active');
                writerTab.classList.remove('active');
            }
        });
    });
    
    // Category selection
    categories.forEach(category => {
        category.addEventListener('click', () => {
            categories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            selectedCategory = category.dataset.category;
        });
    });
    
    // Generate new prompt
    if (generatePromptBtn) {
        generatePromptBtn.addEventListener('click', generatePrompt);
    }
    
    // Use prompt for writing
    if (usePromptBtn) {
        usePromptBtn.addEventListener('click', () => {
            if (!currentPromptText) {
                showError('Please generate a prompt first.');
                return;
            }
            
            if (writingPrompt) {
                writingPrompt.textContent = currentPromptText;
            }
            
            // Switch to writer tab
            tabs.forEach(t => t.classList.remove('active'));
            const writerTabElement = document.querySelector('.tab[data-tab="writer"]');
            if (writerTabElement) writerTabElement.classList.add('active');
            if (generatorTab) generatorTab.classList.remove('active');
            if (writerTab) writerTab.classList.add('active');
            if (savedTab) savedTab.classList.remove('active');
        });
    }
    
    // Save prompt
    if (savePromptBtn) {
        savePromptBtn.addEventListener('click', () => {
            if (!currentPromptText) {
                showError('No prompt to save. Generate one first.');
                return;
            }
            
            // Check if already saved
            if (savedPrompts.some(prompt => prompt.text === currentPromptText)) {
                showError('This prompt is already saved.');
                return;
            }
            
            savedPrompts.push({
                text: currentPromptText,
                category: selectedCategory,
                date: new Date().toLocaleDateString()
            });
            
            localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
            displaySavedPrompts();
            
            // Show confirmation
            alert('Prompt saved successfully!');
        });
    }
    
    // Get story continuation
    if (getContinuationBtn) {
        getContinuationBtn.addEventListener('click', () => {
            if (!currentPromptText) {
                showError('Please generate a prompt first.');
                return;
            }
            
            generateContinuation(currentPromptText);
        });
    }
    
    // Update word count
    if (storyText) {
        storyText.addEventListener('input', updateWordCount);
    }
    
    // Get AI help for current story
    if (getHelpBtn) {
        getHelpBtn.addEventListener('click', () => {
            const storySoFar = storyText ? storyText.value.trim() : '';
            
            if (!storySoFar) {
                showError('Please write some of your story first.');
                return;
            }
            
            generateContinuation(storySoFar, true);
        });
    }
    
    // Generate a new prompt
    function generatePrompt() {
        showLoading();
        
        // Simulate API call delay
        setTimeout(() => {
            hideLoading();
            
            const prompts = {
                all: [
                    "Write a story about a character who discovers an object that allows them to see into parallel universes.",
                    "Create a tale about a librarian who finds that the books in their library are rewriting reality.",
                    "Imagine a world where emotions are visible as colored auras around people. What happens when someone is born without one?",
                    "Write about a chef who can cook meals that evoke specific memories in those who eat them.",
                    "Tell the story of a person who receives a letter from their future self warning them about a single choice they must make."
                ],
                fiction: [
                    "Write about a family reunion where a long-buried secret is unexpectedly revealed.",
                    "Create a story about an unlikely friendship that forms between two completely different people.",
                    "Describe a character who must confront their greatest fear in an ordinary setting.",
                    "Write about a person who finds a mysterious key that opens a door they've never noticed before."
                ],
                scifi: [
                    "In a future where dreams can be recorded and watched, a person discovers someone else's dreams in their collection.",
                    "Write about the first contact with an alien species that communicates entirely through music.",
                    "Create a story set on a generation ship where the inhabitants have forgotten they're on a ship.",
                    "Imagine a world where time travel exists but is strictly regulated. What happens when someone breaks the rules?"
                ],
                fantasy: [
                    "Write about a modern-day person who discovers they're the heir to a magical kingdom they thought was fictional.",
                    "Create a tale about a dragon who prefers baking to hoarding treasure.",
                    "Imagine a world where everyone has a magical talent except for one person. How do they find their place?",
                    "Write about a magical shop that appears only when someone truly needs it."
                ],
                mystery: [
                    "A detective wakes up with amnesia and must solve a crime they might have committed.",
                    "Write about a small town where everyone knows a secret, but no one will talk about it.",
                    "Create a story about a series of thefts where nothing valuable is taken, only seemingly random objects.",
                    "A person receives a photo in the mail of themselves doing something they have no memory of."
                ],
                romance: [
                    "Write about two rival chefs who are forced to work together on a cooking competition.",
                    "Create a story about pen pals who have been writing for years but have never met.",
                    "Imagine a romance between a time traveler and someone from the present, with the complication that the time traveler's visits are unpredictable.",
                    "Write about two people who keep accidentally swapping lives due to a magical mix-up."
                ]
            };
            
            let promptPool = prompts.all;
            
            if (selectedCategory !== 'all' && prompts[selectedCategory]) {
                promptPool = prompts[selectedCategory];
            }
            
            const randomIndex = Math.floor(Math.random() * promptPool.length);
            currentPromptText = promptPool[randomIndex];
            if (currentPrompt) {
                currentPrompt.textContent = currentPromptText;
            }
        }, 1500);
    }
    
    // Generate continuation for a story
    function generateContinuation(text, forStory = false) {
        showLoading();
        
        // Simulate API call delay
        setTimeout(() => {
            hideLoading();
            
            const continuations = [
                "As they looked closer, they noticed something unusual that changed everything.",
                "Little did they know, this discovery would set them on a path they could never have imagined.",
                "Suddenly, a noise from the other room made them freeze in place.",
                "With a deep breath, they made a decision that would alter the course of their life forever.",
                "The memory came flooding back, vivid and unsettling, explaining everything and nothing at the same time.",
                "Just when they thought they had it all figured out, a new piece of information turned everything upside down.",
                "The world seemed to shift around them, reality bending in ways they couldn't comprehend.",
                "They realized they weren't alone; someone—or something—had been watching them the entire time."
            ];
            
            const randomIndex = Math.floor(Math.random() * continuations.length);
            const continuation = continuations[randomIndex];
            
            if (forStory) {
                // Add to AI suggestions
                const suggestionId = 'suggestion-' + Date.now();
                const suggestionHTML = `
                    <div class="suggestion" id="${suggestionId}">
                        <div class="suggestion-header">
                            <div class="suggestion-title">AI Suggestion</div>
                            <button class="use-suggestion" data-suggestion="${suggestionId}">Use This</button>
                        </div>
                        <div class="suggestion-content">${continuation}</div>
                    </div>
                `;
                
                if (aiSuggestions) {
                    aiSuggestions.innerHTML = suggestionHTML + aiSuggestions.innerHTML;
                    
                    // Add event listener to the new button
                    const suggestionButton = document.querySelector(`[data-suggestion="${suggestionId}"]`);
                    if (suggestionButton) {
                        suggestionButton.addEventListener('click', function() {
                            const suggestionElement = document.getElementById(this.dataset.suggestion);
                            if (suggestionElement) {
                                const suggestionText = suggestionElement.querySelector('.suggestion-content').textContent;
                                
                                // Add the suggestion to the story
                                if (storyText) {
                                    storyText.value += ' ' + suggestionText;
                                    updateWordCount();
                                }
                                
                                // Remove the suggestion
                                suggestionElement.remove();
                            }
                        });
                    }
                }
            } else {
                // Show continuation for the prompt
                if (currentPrompt) {
                    currentPrompt.textContent = currentPromptText + ' ' + continuation;
                    currentPromptText = currentPrompt.textContent;
                }
            }
        }, 2000);
    }
    
    // Update word count
    function updateWordCount() {
        if (!storyText || !wordCount) return;
        
        const text = storyText.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        wordCount.textContent = words;
    }
    
    // Display saved prompts
    function displaySavedPrompts() {
        if (!savedPromptsList || !noSaved) return;
        
        if (savedPrompts.length === 0) {
            noSaved.style.display = 'block';
            savedPromptsList.innerHTML = '';
            return;
        }
        
        noSaved.style.display = 'none';
        savedPromptsList.innerHTML = '';
        
        savedPrompts.forEach((prompt, index) => {
            const promptElement = document.createElement('div');
            promptElement.className = 'saved-prompt';
            promptElement.innerHTML = `
                <div class="saved-prompt-content">
                    <strong>${prompt.text}</strong>
                    <div style="font-size: 0.8rem; color: var(--gray); margin-top: 5px;">
                        Category: ${prompt.category} | Saved: ${prompt.date}
                    </div>
                </div>
                <div class="saved-prompt-actions">
                    <button class="outline-btn use-saved-prompt" data-index="${index}">
                        <i class="fas fa-pen-fancy"></i> Use
                    </button>
                    <button class="outline-btn delete-saved-prompt" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            savedPromptsList.appendChild(promptElement);
        });
        
        // Add event listeners to the new buttons
        document.querySelectorAll('.use-saved-prompt').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                currentPromptText = savedPrompts[index].text;
                if (currentPrompt) {
                    currentPrompt.textContent = currentPromptText;
                }
                
                // Switch to generator tab
                tabs.forEach(t => t.classList.remove('active'));
                const generatorTabElement = document.querySelector('.tab[data-tab="generator"]');
                if (generatorTabElement) generatorTabElement.classList.add('active');
                if (generatorTab) generatorTab.classList.add('active');
                if (writerTab) writerTab.classList.remove('active');
                if (savedTab) savedTab.classList.remove('active');
            });
        });
        
        document.querySelectorAll('.delete-saved-prompt').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                savedPrompts.splice(index, 1);
                localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
                displaySavedPrompts();
            });
        });
    }
    
    // Show loading state
    function showLoading() {
        if (loading) {
            loading.style.display = 'block';
        }
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
    
    // Hide loading state
    function hideLoading() {
        if (loading) {
            loading.style.display = 'none';
        }
    }
    
    // Show error message
    function showError(message) {
        if (errorText && errorMessage) {
            errorText.textContent = message;
            errorMessage.style.display = 'block';
        }
        hideLoading();
    }
    
    // Generate initial prompt on load
    generatePrompt();
});
