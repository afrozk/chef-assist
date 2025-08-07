// Chef Assist - Smart Cooking Companion
// Intelligent cooking assistance application

class ChefAssistApp {
    constructor() {
        this.currentScreen = 'welcomeScreen';
        this.currentRecipe = null;
        this.currentStep = 0;
        this.timers = new Map();
        this.timerCounter = 0;
        this.voiceRecognition = null;
        this.voiceSynthesis = window.speechSynthesis;
        this.settings = this.loadSettings();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupVoiceRecognition();
        this.applySettings();
        this.showScreen('welcomeScreen');
        this.startCookingStatusUpdates();
    }

    // Cooking Status Updates
    startCookingStatusUpdates() {
        // Random cooking status updates
        const cookingStatuses = ['COOKING', 'READY', 'PREPPING', 'MIXING', 'HEATING'];
        setInterval(() => {
            const statusText = document.querySelector('.ai-text');
            if (statusText) {
                statusText.textContent = cookingStatuses[Math.floor(Math.random() * cookingStatuses.length)];
            }
        }, 4000);
    }

    // Settings Management
    loadSettings() {
        const defaultSettings = {
            voiceEnabled: true,
            voiceLanguage: 'en-US',
            timerSound: 'bell',
            timerVolume: 80,
            keepScreenOn: true,
            darkMode: true, // Default to dark mode for cyberpunk theme
            skillLevel: 'intermediate',
            dietaryRestrictions: [],
            particleEffects: true,
            cyberEffects: true
        };

        const saved = localStorage.getItem('chefAssistSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('chefAssistSettings', JSON.stringify(this.settings));
    }

    applySettings() {
        // Apply dark mode
        if (this.settings.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
        }

        // Keep screen on
        if (this.settings.keepScreenOn && 'wakeLock' in navigator) {
            this.requestWakeLock();
        }

        // Update settings UI
        this.updateSettingsUI();
    }

    async requestWakeLock() {
        try {
            this.wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
            console.log('Wake lock failed:', err);
        }
    }

    updateSettingsUI() {
        const elements = {
            voiceEnabled: document.getElementById('voiceEnabled'),
            voiceLanguage: document.getElementById('voiceLanguage'),
            timerSound: document.getElementById('timerSound'),
            timerVolume: document.getElementById('timerVolume'),
            keepScreenOn: document.getElementById('keepScreenOn'),
            darkMode: document.getElementById('darkMode'),
            skillLevel: document.getElementById('skillLevel')
        };

        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings[key];
                } else {
                    element.value = this.settings[key];
                }
            }
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.getElementById('addRecipeBtn').addEventListener('click', () => {
            this.showScreen('recipeInputScreen');
        });

        document.getElementById('voiceInputBtn').addEventListener('click', () => {
            this.showScreen('recipeInputScreen');
            this.switchTab('voice');
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showScreen('settingsScreen');
        });

        // Back buttons
        document.getElementById('backToWelcome').addEventListener('click', () => {
            this.showScreen('welcomeScreen');
        });

        document.getElementById('backToInput').addEventListener('click', () => {
            this.showScreen('recipeInputScreen');
        });

        document.getElementById('backFromSettings').addEventListener('click', () => {
            this.showScreen('welcomeScreen');
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Recipe processing
        document.getElementById('processRecipeBtn').addEventListener('click', () => {
            this.processRecipe();
        });

        document.getElementById('fetchRecipeBtn').addEventListener('click', () => {
            this.fetchRecipeFromUrl();
        });

        // Voice recording
        document.getElementById('voiceRecordBtn').addEventListener('click', () => {
            this.toggleVoiceRecording();
        });

        // Cooking navigation
        document.getElementById('nextStepBtn').addEventListener('click', () => {
            this.nextStep();
        });

        document.getElementById('prevStepBtn').addEventListener('click', () => {
            this.previousStep();
        });

        // Voice controls
        document.getElementById('voiceControlBtn').addEventListener('click', () => {
            this.showVoiceCommandModal();
        });

        document.getElementById('closeVoiceModal').addEventListener('click', () => {
            this.hideVoiceCommandModal();
        });

        // Dietary restrictions
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleDietaryRestriction(e.target.dataset.restriction);
            });
        });

        // Settings
        this.setupSettingsListeners();
    }

    setupSettingsListeners() {
        const settingElements = [
            'voiceEnabled', 'voiceLanguage', 'timerSound', 'timerVolume',
            'keepScreenOn', 'darkMode', 'skillLevel'
        ];

        settingElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                    this.settings[id] = value;
                    this.saveSettings();
                    this.applySettings();
                });
            }
        });
    }

    // Voice Recognition Setup
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.voiceRecognition = new SpeechRecognition();
            
            this.voiceRecognition.continuous = true;
            this.voiceRecognition.interimResults = true;
            this.voiceRecognition.lang = this.settings.voiceLanguage;

            this.voiceRecognition.onresult = (event) => {
                this.handleVoiceResult(event);
            };

            this.voiceRecognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                this.updateVoiceStatus('Voice recognition error. Please try again.');
            };

            this.voiceRecognition.onend = () => {
                this.stopVoiceRecording();
            };
        }
    }

    // Screen Management
    showScreen(screenId) {
        // Hide current screen
        const currentScreenEl = document.getElementById(this.currentScreen);
        if (currentScreenEl) {
            currentScreenEl.classList.remove('active');
        }

        // Show new screen
        const newScreenEl = document.getElementById(screenId);
        if (newScreenEl) {
            newScreenEl.classList.add('active');
        }

        this.currentScreen = screenId;
    }

    // Tab Management
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    // Recipe Processing
    async processRecipe() {
        const activeTab = document.querySelector('.tab-content.active').id;
        let recipeText = '';

        if (activeTab === 'textTab') {
            recipeText = document.getElementById('recipeTextInput').value.trim();
        } else if (activeTab === 'voiceTab') {
            recipeText = this.voiceRecordedText || '';
        } else if (activeTab === 'urlTab') {
            const url = document.getElementById('recipeUrlInput').value.trim();
            if (url) {
                recipeText = await this.fetchRecipeFromUrl(url);
            }
        }

        if (!recipeText) {
            alert('Please provide a recipe to process.');
            return;
        }

        this.showLoading('Processing your recipe...');

        try {
            // Simulate AI processing delay
            await this.delay(2000);

            const processedRecipe = this.parseRecipe(recipeText);
            this.currentRecipe = processedRecipe;
            this.currentStep = 0;

            this.hideLoading();
            this.showScreen('cookingScreen');
            this.updateCookingInterface();
        } catch (error) {
            this.hideLoading();
            alert('Error processing recipe. Please try again.');
            console.error('Recipe processing error:', error);
        }
    }

    parseRecipe(recipeText) {
        // Simulate AI recipe parsing
        const lines = recipeText.split('\n').filter(line => line.trim());
        
        // Extract title (first non-empty line or default)
        const title = lines[0] || 'Delicious Recipe';
        
        // Simple ingredient detection (lines with measurements)
        const ingredients = lines.filter(line => 
            /\d+/.test(line) && (
                line.includes('cup') || line.includes('tbsp') || line.includes('tsp') ||
                line.includes('oz') || line.includes('lb') || line.includes('g') ||
                line.includes('ml') || line.includes('l')
            )
        );

        // Simple step detection (numbered lines or action words)
        const steps = lines.filter(line => {
            const actionWords = ['heat', 'add', 'mix', 'stir', 'cook', 'bake', 'fry', 'boil', 'simmer', 'chop', 'dice', 'slice'];
            return /^\d+\./.test(line) || actionWords.some(word => line.toLowerCase().includes(word));
        }).map((step, index) => ({
            id: index + 1,
            title: this.generateStepTitle(step),
            instructions: step.replace(/^\d+\.\s*/, ''),
            estimatedTime: this.estimateStepTime(step),
            tips: this.generateStepTips(step)
        }));

        return {
            title: title,
            ingredients: ingredients,
            steps: steps.length > 0 ? steps : this.generateDefaultSteps(),
            totalTime: steps.reduce((total, step) => total + step.estimatedTime, 0),
            servings: parseInt(document.getElementById('servings').value) || 4,
            skillLevel: document.getElementById('skillLevel').value,
            dietaryRestrictions: this.getSelectedDietaryRestrictions()
        };
    }

    generateStepTitle(stepText) {
        const actionWords = {
            'heat': 'Heat ingredients',
            'add': 'Add ingredients',
            'mix': 'Mix ingredients',
            'stir': 'Stir mixture',
            'cook': 'Cook ingredients',
            'bake': 'Bake in oven',
            'fry': 'Fry ingredients',
            'boil': 'Boil ingredients',
            'simmer': 'Simmer mixture',
            'chop': 'Prepare ingredients',
            'dice': 'Prepare ingredients',
            'slice': 'Prepare ingredients'
        };

        for (const [word, title] of Object.entries(actionWords)) {
            if (stepText.toLowerCase().includes(word)) {
                return title;
            }
        }

        return 'Cooking step';
    }

    estimateStepTime(stepText) {
        // Extract time mentions from step text
        const timeMatch = stepText.match(/(\d+)\s*(minute|min|hour|hr)/i);
        if (timeMatch) {
            const value = parseInt(timeMatch[1]);
            const unit = timeMatch[2].toLowerCase();
            return unit.startsWith('hour') || unit.startsWith('hr') ? value * 60 : value;
        }

        // Default time estimates based on cooking actions
        const timeEstimates = {
            'prep': 5, 'chop': 3, 'dice': 3, 'slice': 2,
            'heat': 5, 'boil': 10, 'simmer': 15, 'bake': 25,
            'fry': 8, 'cook': 10, 'mix': 2, 'stir': 1
        };

        for (const [action, time] of Object.entries(timeEstimates)) {
            if (stepText.toLowerCase().includes(action)) {
                return time;
            }
        }

        return 5; // Default 5 minutes
    }

    generateStepTips(stepText) {
        const tips = [];
        const text = stepText.toLowerCase();

        if (text.includes('heat') || text.includes('oil')) {
            tips.push('💡 Heat oil until it shimmers but doesn\'t smoke');
        }
        if (text.includes('onion')) {
            tips.push('🧅 Cook onions until translucent for best flavor');
        }
        if (text.includes('garlic')) {
            tips.push('🧄 Add garlic last to prevent burning');
        }
        if (text.includes('salt')) {
            tips.push('🧂 Taste and adjust seasoning as needed');
        }
        if (text.includes('bake') || text.includes('oven')) {
            tips.push('🔥 Preheat oven for even cooking');
        }

        return tips;
    }

    generateDefaultSteps() {
        return [
            {
                id: 1,
                title: 'Prepare ingredients',
                instructions: 'Gather and prepare all ingredients according to the recipe.',
                estimatedTime: 10,
                tips: ['📋 Read through the entire recipe first', '🔪 Prep all ingredients before cooking']
            },
            {
                id: 2,
                title: 'Start cooking',
                instructions: 'Begin cooking according to the recipe instructions.',
                estimatedTime: 20,
                tips: ['🔥 Maintain proper heat levels', '⏰ Set timers for important steps']
            },
            {
                id: 3,
                title: 'Finish and serve',
                instructions: 'Complete the cooking process and serve the dish.',
                estimatedTime: 5,
                tips: ['🍽️ Let hot dishes cool slightly before serving', '🌿 Garnish for presentation']
            }
        ];
    }

    async fetchRecipeFromUrl(url) {
        // In a real app, this would fetch and parse recipe from URL
        // For demo purposes, return a sample recipe
        return `Delicious Pasta Recipe
        
        Ingredients:
        - 2 cups pasta
        - 1 tbsp olive oil
        - 2 cloves garlic
        - 1 cup tomatoes
        - Salt and pepper to taste
        
        Instructions:
        1. Boil water and cook pasta for 8-10 minutes
        2. Heat olive oil in a pan
        3. Add garlic and cook for 1 minute
        4. Add tomatoes and simmer for 5 minutes
        5. Mix with pasta and season with salt and pepper`;
    }

    // Voice Recording
    toggleVoiceRecording() {
        if (!this.voiceRecognition) {
            alert('Voice recognition is not supported in your browser.');
            return;
        }

        const btn = document.getElementById('voiceRecordBtn');
        
        if (btn.classList.contains('recording')) {
            this.stopVoiceRecording();
        } else {
            this.startVoiceRecording();
        }
    }

    startVoiceRecording() {
        const btn = document.getElementById('voiceRecordBtn');
        btn.classList.add('recording');
        btn.innerHTML = '<i class="fas fa-stop"></i><span>Stop Recording</span>';
        
        this.updateVoiceStatus('Listening... Speak your recipe now.');
        this.voiceRecordedText = '';
        
        this.voiceRecognition.start();
    }

    stopVoiceRecording() {
        const btn = document.getElementById('voiceRecordBtn');
        btn.classList.remove('recording');
        btn.innerHTML = '<i class="fas fa-microphone"></i><span>Tap to speak your recipe</span>';
        
        this.updateVoiceStatus('Recording stopped. Click "Process Recipe" to continue.');
        
        if (this.voiceRecognition) {
            this.voiceRecognition.stop();
        }
    }

    handleVoiceResult(event) {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        this.voiceRecordedText = finalTranscript;
        this.updateVoiceStatus(`Recorded: ${finalTranscript}${interimTranscript ? ` (${interimTranscript})` : ''}`);
    }

    updateVoiceStatus(message) {
        document.getElementById('voiceStatus').textContent = message;
    }

    // Cooking Interface
    updateCookingInterface() {
        if (!this.currentRecipe) return;

        // Update recipe info
        document.getElementById('recipeTitle').textContent = this.currentRecipe.title;
        document.getElementById('totalTime').innerHTML = `<i class="fas fa-clock"></i> ${this.currentRecipe.totalTime} min`;
        document.getElementById('servingCount').innerHTML = `<i class="fas fa-users"></i> ${this.currentRecipe.servings} servings`;

        // Update progress
        this.updateProgress();

        // Update current step
        this.updateCurrentStep();
    }

    updateProgress() {
        const progress = ((this.currentStep + 1) / this.currentRecipe.steps.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('currentStep').textContent = `Step ${this.currentStep + 1} of ${this.currentRecipe.steps.length}`;
        
        const remainingTime = this.currentRecipe.steps
            .slice(this.currentStep)
            .reduce((total, step) => total + step.estimatedTime, 0);
        document.getElementById('timeRemaining').textContent = `~${remainingTime} min remaining`;
    }

    updateCurrentStep() {
        const step = this.currentRecipe.steps[this.currentStep];
        if (!step) return;

        document.getElementById('stepNumber').textContent = step.id;
        document.getElementById('stepTitle').textContent = step.title;
        document.getElementById('stepInstructions').textContent = step.instructions;

        // Update tips
        const tipsContainer = document.getElementById('stepTips');
        tipsContainer.innerHTML = '';
        step.tips.forEach(tip => {
            const tipElement = document.createElement('div');
            tipElement.className = 'step-tip';
            tipElement.textContent = tip;
            tipsContainer.appendChild(tipElement);
        });

        // Update navigation buttons
        document.getElementById('prevStepBtn').disabled = this.currentStep === 0;
        document.getElementById('nextStepBtn').textContent = 
            this.currentStep === this.currentRecipe.steps.length - 1 ? 'Complete Recipe' : 'Next Step';

        // Auto-suggest timer for this step
        if (step.estimatedTime > 2) {
            this.suggestTimer(step.title, step.estimatedTime);
        }
    }

    nextStep() {
        if (this.currentStep < this.currentRecipe.steps.length - 1) {
            this.currentStep++;
            this.updateCookingInterface();
        } else {
            this.completeRecipe();
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateCookingInterface();
        }
    }

    completeRecipe() {
        alert('🎉 Congratulations! You\'ve completed the recipe. Enjoy your meal!');
        this.showScreen('welcomeScreen');
        this.currentRecipe = null;
        this.currentStep = 0;
        this.clearAllTimers();
    }

    // Timer Management
    suggestTimer(label, minutes) {
        // Auto-create suggested timer (user can dismiss)
        const timerId = this.createTimer(label, minutes * 60);
        
        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Suggested', {
                body: `${minutes} minute timer suggested for: ${label}`,
                icon: '/favicon.ico'
            });
        }
    }

    createTimer(label, seconds) {
        const timerId = ++this.timerCounter;
        const timer = {
            id: timerId,
            label: label,
            totalSeconds: seconds,
            remainingSeconds: seconds,
            interval: null,
            isRunning: false
        };

        this.timers.set(timerId, timer);
        this.renderTimer(timer);
        this.startTimer(timerId);
        
        return timerId;
    }

    startTimer(timerId) {
        const timer = this.timers.get(timerId);
        if (!timer || timer.isRunning) return;

        timer.isRunning = true;
        timer.interval = setInterval(() => {
            timer.remainingSeconds--;
            this.updateTimerDisplay(timer);

            if (timer.remainingSeconds <= 0) {
                this.timerComplete(timer);
            }
        }, 1000);

        this.updateTimerControls(timer);
    }

    pauseTimer(timerId) {
        const timer = this.timers.get(timerId);
        if (!timer || !timer.isRunning) return;

        timer.isRunning = false;
        clearInterval(timer.interval);
        this.updateTimerControls(timer);
    }

    removeTimer(timerId) {
        const timer = this.timers.get(timerId);
        if (!timer) return;

        if (timer.interval) {
            clearInterval(timer.interval);
        }

        this.timers.delete(timerId);
        const timerElement = document.getElementById(`timer-${timerId}`);
        if (timerElement) {
            timerElement.remove();
        }
    }

    renderTimer(timer) {
        const container = document.getElementById('timersContainer');
        const timerElement = document.createElement('div');
        timerElement.className = 'timer-item';
        timerElement.id = `timer-${timer.id}`;
        
        timerElement.innerHTML = `
            <div class="timer-info">
                <div class="timer-label">${timer.label}</div>
                <div class="timer-time" id="timer-time-${timer.id}">${this.formatTime(timer.remainingSeconds)}</div>
            </div>
            <div class="timer-controls">
                <button class="timer-btn" id="timer-pause-${timer.id}" onclick="app.pauseTimer(${timer.id})">
                    <i class="fas fa-pause"></i>
                </button>
                <button class="timer-btn danger" onclick="app.removeTimer(${timer.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        container.appendChild(timerElement);
        
        // Show timers section if hidden
        document.getElementById('timersSection').style.display = 'block';
    }

    updateTimerDisplay(timer) {
        const timeElement = document.getElementById(`timer-time-${timer.id}`);
        if (timeElement) {
            timeElement.textContent = this.formatTime(timer.remainingSeconds);
            
            // Change color when time is running low
            if (timer.remainingSeconds <= 60) {
                timeElement.style.color = 'var(--danger-color)';
            } else if (timer.remainingSeconds <= 300) {
                timeElement.style.color = 'var(--warning-color)';
            }
        }
    }

    updateTimerControls(timer) {
        const pauseBtn = document.getElementById(`timer-pause-${timer.id}`);
        if (pauseBtn) {
            if (timer.isRunning) {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                pauseBtn.onclick = () => this.pauseTimer(timer.id);
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                pauseBtn.onclick = () => this.startTimer(timer.id);
            }
        }
    }

    timerComplete(timer) {
        clearInterval(timer.interval);
        timer.isRunning = false;
        timer.remainingSeconds = 0;

        // Play sound
        this.playTimerSound();

        // Show notification
        this.showTimerNotification(timer);

        // Update display
        this.updateTimerDisplay(timer);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            this.removeTimer(timer.id);
        }, 10000);
    }

    playTimerSound() {
        // Create audio context for timer sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(this.settings.timerVolume / 100, audioContext.currentTime);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    showTimerNotification(timer) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
                body: `${timer.label} timer has finished`,
                icon: '/favicon.ico'
            });
        }

        // Vibrate if supported
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    clearAllTimers() {
        this.timers.forEach((timer, id) => {
            this.removeTimer(id);
        });
        document.getElementById('timersSection').style.display = 'none';
    }

    // Voice Commands
    handleVoiceCommand(command) {
        const cmd = command.toLowerCase().trim();

        if (cmd.includes('next step')) {
            this.nextStep();
            this.speak('Moving to next step');
        } else if (cmd.includes('previous step') || cmd.includes('go back')) {
            this.previousStep();
            this.speak('Going back to previous step');
        } else if (cmd.includes('repeat') || cmd.includes('read again')) {
            this.repeatCurrentStep();
        } else if (cmd.includes('set timer')) {
            this.handleTimerCommand(cmd);
        } else if (cmd.includes('time left') || cmd.includes('how long')) {
            this.announceTimeRemaining();
        } else if (cmd.includes('what\'s next')) {
            this.previewNextStep();
        }
    }

    repeatCurrentStep() {
        if (this.currentRecipe && this.currentRecipe.steps[this.currentStep]) {
            const step = this.currentRecipe.steps[this.currentStep];
            this.speak(`${step.title}. ${step.instructions}`);
        }
    }

    handleTimerCommand(command) {
        const match = command.match(/(\d+)\s*minute/);
        if (match) {
            const minutes = parseInt(match[1]);
            this.createTimer(`Voice Timer`, minutes * 60);
            this.speak(`${minutes} minute timer started`);
        }
    }

    announceTimeRemaining() {
        if (this.currentRecipe) {
            const remainingTime = this.currentRecipe.steps
                .slice(this.currentStep)
                .reduce((total, step) => total + step.estimatedTime, 0);
            this.speak(`Approximately ${remainingTime} minutes remaining`);
        }
    }

    previewNextStep() {
        if (this.currentRecipe && this.currentStep < this.currentRecipe.steps.length - 1) {
            const nextStep = this.currentRecipe.steps[this.currentStep + 1];
            this.speak(`Next step: ${nextStep.title}`);
        } else {
            this.speak('This is the final step');
        }
    }

    speak(text) {
        if (this.settings.voiceEnabled && this.voiceSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.settings.voiceLanguage;
            this.voiceSynthesis.speak(utterance);
        }
    }

    // Modal Management
    showVoiceCommandModal() {
        document.getElementById('voiceCommandModal').classList.add('active');
    }

    hideVoiceCommandModal() {
        document.getElementById('voiceCommandModal').classList.remove('active');
    }

    // Loading Management
    showLoading(message = 'Loading...') {
        document.getElementById('loadingText').textContent = message;
        document.getElementById('loadingOverlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    // Dietary Restrictions
    toggleDietaryRestriction(restriction) {
        const btn = document.querySelector(`[data-restriction="${restriction}"]`);
        btn.classList.toggle('active');
        
        if (!this.settings.dietaryRestrictions) {
            this.settings.dietaryRestrictions = [];
        }
        
        const index = this.settings.dietaryRestrictions.indexOf(restriction);
        if (index > -1) {
            this.settings.dietaryRestrictions.splice(index, 1);
        } else {
            this.settings.dietaryRestrictions.push(restriction);
        }
        
        this.saveSettings();
    }

    getSelectedDietaryRestrictions() {
        return Array.from(document.querySelectorAll('.tag-btn.active'))
            .map(btn => btn.dataset.restriction);
    }

    // Utility Functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ChefAssistApp();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

// Service Worker Registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}