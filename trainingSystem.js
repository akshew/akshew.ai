const fs = require('fs');
const AkshewEnhancement = require('./aiEnhancement.js');

class AkshewTraining {
    constructor() {
        this.trainingData = [];
        this.dataFile = 'training_data.json';
        this.enhancement = new AkshewEnhancement();

        // Load training data on initialization
        this.loadTrainingData();

        // Add emotional understanding
        this.emotions = {
            positive: ['happy', 'excited', 'grateful', 'satisfied'],
            negative: ['sad', 'angry', 'frustrated', 'disappointed'],
            neutral: ['curious', 'interested', 'wondering']
        };

        // Add topic categorization
        this.topics = {
            technical: ['programming', 'code', 'software', 'computer'],
            personal: ['feel', 'think', 'believe', 'opinion'],
            factual: ['what', 'when', 'where', 'who', 'how'],
            procedural: ['steps', 'process', 'method', 'way to']
        };
    }

    loadTrainingData() {
        try {
            if (fs.existsSync(this.dataFile)) {
                const rawData = fs.readFileSync(this.dataFile, 'utf8');
                this.trainingData = JSON.parse(rawData);
            } else {
                console.log(`Data file ${this.dataFile} not found, initializing with an empty dataset.`);
                this.trainingData = [];
            }
        } catch (error) {
            console.error('Error loading training data:', error);
            this.trainingData = [];
        }
    }

    saveTrainingData() {
        try {
            fs.writeFileSync(this.dataFile, JSON.stringify(this.trainingData, null, 4));
        } catch (error) {
            console.error('Error saving training data:', error);
        }
    }

    tokenize(text) {
        return text.split(/\s+/); // Simple tokenizer, split by whitespace
    }

    extractPatterns(response) {
        // Placeholder for pattern extraction logic
        return [];
    }

    classifyPromptType(prompt) {
        // Placeholder for prompt type classification logic
        return 'general';
    }

    detectEmotion(text) {
        const lowercase = text.toLowerCase();
        for (const [category, words] of Object.entries(this.emotions)) {
            if (words.some(word => lowercase.includes(word))) {
                return category;
            }
        }
        return 'neutral';
    }

    classifyTopic(text) {
        const lowercase = text.toLowerCase();
        for (const [category, keywords] of Object.entries(this.topics)) {
            if (keywords.some(word => lowercase.includes(word))) {
                return category;
            }
        }
        return 'general';
    }

    async learnFromGemini(prompt, geminiResponse, context = {}) {
        const trainingEntry = {
            prompt: {
                text: prompt,
                tokens: this.tokenize(prompt),
                type: this.classifyPromptType(prompt),
                emotion: this.detectEmotion(prompt),
                topic: this.classifyTopic(prompt),
                timestamp: Date.now()
            },
            response: {
                text: geminiResponse,
                tokens: this.tokenize(geminiResponse),
                patterns: this.extractPatterns(geminiResponse),
                enhanced: this.enhancement.enhanceResponse(geminiResponse, prompt, context)
            },
            metadata: {
                usageCount: 0,
                successRate: 1.0,
                context: context
            }
        };

        this.trainingData.push(trainingEntry);
        this.saveTrainingData();
        return trainingEntry;
    }

    findResponse(prompt, context = {}) {
        const promptTokens = this.tokenize(prompt);
        const promptType = this.classifyPromptType(prompt);
        const emotion = this.detectEmotion(prompt);
        const topic = this.classifyTopic(prompt);

        const similarPrompts = this.trainingData
            .map(entry => ({
                entry,
                similarity: this.calculateSimilarity(promptTokens, entry.prompt.tokens),
                typeMatch: promptType === entry.prompt.type,
                emotionMatch: emotion === entry.prompt.emotion,
                topicMatch: topic === entry.prompt.topic
            }))
            .filter(match => match.similarity > 0.6 || match.typeMatch)
            .sort((a, b) => {
                const scoreA = this.calculateMatchScore(a);
                const scoreB = this.calculateMatchScore(b);
                return scoreB - scoreA;
            });

        if (similarPrompts.length > 0) {
            const bestMatch = similarPrompts[0].entry;
            bestMatch.metadata.usageCount++;
            this.saveTrainingData();

            // Return enhanced response
            return this.enhancement.enhanceResponse(
                bestMatch.response.text,
                prompt,
                { ...context, previousResponse: bestMatch.response.text }
            );
        }

        return null;
    }

    calculateSimilarity(tokens1, tokens2) {
        const set1 = new Set(tokens1);
        const set2 = new Set(tokens2);
        const intersection = [...set1].filter(x => set2.has(x));
        return intersection.length / Math.max(set1.size, set2.size);
    }

    calculateMatchScore(match) {
        return (
            match.similarity * 0.4 +
            (match.typeMatch ? 0.2 : 0) +
            (match.emotionMatch ? 0.2 : 0) +
            (match.topicMatch ? 0.2 : 0)
        );
    }
}

module.exports = AkshewTraining;
