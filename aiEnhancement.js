// aiEnhancement.js
class AkshewEnhancement {
    constructor() {
        this.personality = {
            traits: {
                helpfulness: 0.9,
                formality: 0.7,
                enthusiasm: 0.8,
                humor: 0.6
            },
            tone: 'friendly',
            characteristics: ['knowledgeable', 'patient', 'encouraging']
        };

        this.contextMemory = {
            shortTerm: new Map(), // Recent conversations
            longTerm: new Map(),  // Common patterns
            userPreferences: new Map() // User preferences
        };

        this.rules = {
            greeting: [
                { pattern: /^(hi|hello|hey)/i, response: 'greeting' },
                { pattern: /how are you/i, response: 'statusQuery' },
                { pattern: /bye|goodbye/i, response: 'farewell' }
            ],
            safety: [
                { pattern: /(hack|exploit|attack)/i, response: 'security' },
                { pattern: /(harm|hurt|kill)/i, response: 'harmful' },
                { pattern: /(illegal|crime)/i, response: 'legal' }
            ],
            correction: [
                { pattern: /that('s| is) (wrong|incorrect|false)/i, response: 'correction' },
                { pattern: /what do you mean/i, response: 'clarification' }
            ]
        };

        this.responseTemplates = {
            greeting: [
                "Hello! How can I help you today?",
                "Hi there! I'm Akshew. What's on your mind?",
                "Greetings! I'm here to assist you."
            ],
            statusQuery: [
                "I'm functioning well and ready to help!",
                "I'm doing great, thanks for asking. How can I assist you?"
            ],
            farewell: [
                "Goodbye! Feel free to return if you need more help.",
                "Take care! I'll be here if you need anything else."
            ],
            security: "I can only provide information about ethical and legal practices.",
            harmful: "I'm designed to be helpful while avoiding any harmful actions.",
            legal: "I can only assist with legal and ethical activities.",
            correction: "Thank you for the correction. Could you help me understand the right information?",
            clarification: "Let me explain that in more detail..."
        };
    }

    enhanceResponse(originalResponse, prompt, context = {}) {
        // Check for rule matches
        for (const [category, rules] of Object.entries(this.rules)) {
            for (const rule of rules) {
                if (rule.pattern.test(prompt)) {
                    return this.handleRuleMatch(category, rule.response, context);
                }
            }
        }

        // Apply personality and context
        let enhancedResponse = this.applyPersonality(originalResponse);
        enhancedResponse = this.addContext(enhancedResponse, context);

        return enhancedResponse;
    }

    handleRuleMatch(category, responseType, context) {
        const templates = this.responseTemplates[responseType];
        if (Array.isArray(templates)) {
            const randomIndex = Math.floor(Math.random() * templates.length);
            return templates[randomIndex];
        }
        return templates;
    }

    applyPersonality(response) {
        // Add personality-based modifications
        if (this.personality.tone === 'friendly') {
            response = this.addEmotionalMarkers(response);
        }

        // Add characteristic-based enhancements
        if (this.personality.characteristics.includes('encouraging')) {
            response = this.addEncouragement(response);
        }

        return response;
    }

    addEmotionalMarkers(text) {
        // Add friendly touches based on personality traits
        if (this.personality.traits.enthusiasm > 0.7) {
            text = text.replace(/\./g, '! ').trim();
        }
        return text;
    }

    addEncouragement(text) {
        const encouragements = [
            " I hope this helps!",
            " Let me know if you need more information!",
            " Feel free to ask more questions!"
        ];
        return text + encouragements[Math.floor(Math.random() * encouragements.length)];
    }

    addContext(response, context) {
        // Add relevant context from memory
        if (context.previousQuery) {
            this.contextMemory.shortTerm.set(context.previousQuery, {
                response: response,
                timestamp: Date.now()
            });
        }

        // Add contextual continuity
        if (this.contextMemory.shortTerm.size > 0) {
            const recentContext = Array.from(this.contextMemory.shortTerm.entries())
                .sort((a, b) => b[1].timestamp - a[1].timestamp)[0];

            if (this.isRelated(response, recentContext[1].response)) {
                response = this.addContextualTransition(response, recentContext);
            }
        }

        return response;
    }

    isRelated(current, previous) {
        const currentWords = new Set(current.toLowerCase().split(' '));
        const previousWords = new Set(previous.toLowerCase().split(' '));
        const intersection = new Set([...currentWords].filter(x => previousWords.has(x)));
        return intersection.size >= 3;
    }

    addContextualTransition(response, recentContext) {
        const transitions = [
            "Building on our previous discussion, ",
            "Following up on that, ",
            "Related to what we discussed, "
        ];
        return transitions[Math.floor(Math.random() * transitions.length)] + response;
    }

    updateUserPreference(userId, preference) {
        this.contextMemory.userPreferences.set(userId, {
            ...this.contextMemory.userPreferences.get(userId),
            ...preference,
            lastUpdated: Date.now()
        });
    }

    cleanup() {
        // Clean up old context (older than 1 hour)
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        for (const [key, value] of this.contextMemory.shortTerm.entries()) {
            if (value.timestamp < oneHourAgo) {
                this.contextMemory.shortTerm.delete(key);
            }
        }
    }
}

module.exports = AkshewEnhancement;