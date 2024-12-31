// webDataCollector.js
const cheerio = require('cheerio');
const fetch = require('node-fetch');

class WebDataCollector {
    async scrapeYouTube(query) {
        try {
            const response = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
            const html = await response.text();
            const $ = cheerio.load(html);

            return $('.video-title').map((i, el) => $(el).text()).get();
        } catch (error) {
            console.error('YouTube scraping error:', error);
            return [];
        }
    }

    async scrapeWebsite(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            $('script, style, nav, footer, header').remove();
            return $('p, h1, h2, h3, h4, h5, h6').map((i, el) => $(el).text()).get();
        } catch (error) {
            console.error('Website scraping error:', error);
            return [];
        }
    }
}

module.exports = WebDataCollector;

// Update trainingSystem.js to include web data collection
const WebDataCollector = require('./webDataCollector');
const marked = require('marked');

class AkshewTraining {
    constructor() {
        // Your existing constructor code
        this.webCollector = new WebDataCollector();
    }

    // Add these new methods to your existing AkshewTraining class
    formatResponse(text) {
        return marked.parse(text)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => 
                `<pre><code class="language-${lang || 'plain'}">${code}</code></pre>`
            );
    }

    async enhanceKnowledgeBase(query) {
        try {
            const youtubeData = await this.webCollector.scrapeYouTube(query);
            const wikipediaData = await this.webCollector.scrapeWebsite(
                `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`
            );

            const newData = [...youtubeData, ...wikipediaData].map(text => ({
                prompt: query,
                response: {
                    text,
                    tokens: this.tokenize(text),
                    patterns: this.extractPatterns(text)
                },
                metadata: {
                    source: 'web',
                    timestamp: Date.now()
                }
            }));

            this.trainingData.push(...newData);
            this.saveTrainingData();
        } catch (error) {
            console.error('Error enhancing knowledge base:', error);
        }
    }

    // Update your existing findResponse method
    findResponse(prompt, context = {}) {
        const response = /* your existing response finding logic */;

        if (response) {
            return this.formatResponse(response);
        }

        this.enhanceKnowledgeBase(prompt);
        return null;
    }
}