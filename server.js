// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const AkshewTraining = require('./trainingSystem.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Initialize Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "api";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Initialize Akshew AI
const akshew = new AkshewTraining();

// Gemini API endpoint
app.post('/api/search', async (req, res) => {
    const searchTerm = req.body.query;
    const userId = req.body.userId || 'anonymous';

    try {
        const geminiResult = await model.generateContent(searchTerm);
        const geminiResponse = await geminiResult.response.text();

        // Learn from Gemini's response
        await akshew.learnFromGemini(searchTerm, geminiResponse, userId);

        res.json({ geminiResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch results',
            details: error.message 
        });
    }
});

// Local (Akshew) search endpoint
app.post('/api/local-search', (req, res) => {
    const searchTerm = req.body.query;
    const userId = req.body.userId || 'anonymous';

    try {
        const response = akshew.findResponse(searchTerm, userId);

        if (response) {
            res.json({ response });
        } else {
            res.json({ 
                response: "I'm still learning about this topic. Try using Gemini mode to help me learn!"
            });
        }
    } catch (error) {
        console.error('Error in local search:', error);
        res.status(500).json({ 
            error: 'Error processing local search',
            details: error.message 
        });
    }
});

// Get AI stats endpoint
app.get('/api/stats', (req, res) => {
    try {
        const stats = akshew.getStats();
        res.json(stats);
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ 
            error: 'Error fetching stats',
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date(),
        trainingDataSize: akshew.trainingData.length
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        details: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Training data loaded with ${akshew.trainingData.length} entries`);
});
