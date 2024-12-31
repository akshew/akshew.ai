# Akshew.ai

A dual-mode AI chatbot that combines local learning with Gemini API.

## Features

- Switch between Gemini and local AI modes
- Markdown formatting support
- Code syntax highlighting
- Emotional understanding
- Topic categorization
- Web data collection
- Progressive learning from Gemini responses

## Setup

1. Install dependencies:
```bash
npm install express cors dotenv @google/generative-ai cheerio marked node-fetch
```

2. Configure environment:
```bash
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

3. Run server:
```bash
node server.js
```

## Project Structure
```
project/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── trainingSystem.js
├── aiEnhancement.js
└── webDataCollector.js
```

