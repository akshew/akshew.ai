
## Akshew.AI: A Hybrid AI System with Dynamic Learning and Live Data Fetching

**Akshew.AI** is a customizable and adaptive AI system that operates in two modes: **Local AI (Akshew)**, which uses locally stored training data, and **Gemini AI**, which fetches live data for real-time responses. The project is designed to provide users with intelligent, context-aware, and personalized interactions, with the flexibility to toggle between the two modes based on user needs.

### How It Works:
1. **Frontend (HTML/CSS/JS)**: The web interface allows users to query the AI and toggle between modes. It displays responses from either Akshew's local knowledge or Gemini's live search results.
2. **Backend (Node.js)**: The system stores training data in `training_data.json` and updates it with new entries based on user interactions. Akshew uses similarity scoring and topic classification to provide relevant responses.
3. **AI Enhancement**: Through **AkshewEnhancement.js**, the AI can adjust its responses according to emotional markers, personality traits, and user context.
4. **Training**: **AkshewTraining.js** manages the continuous learning process, collecting feedback and refining the AI's understanding to deliver more accurate and personalized replies.

### Technologies Used:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, JSON for data storage
- **AI Components**: Custom training algorithms, emotional response adjustments, pattern matching
- **Web Scraping (Optional)**: WebDataCollector.js for gathering external knowledge

### Installation:
1. Clone the repository:  
   ```bash
   git clone https://github.com/akshew/akshew-ai.git
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Run the application:  
   ```bash
   npm start
   ```
4. Access the app in your browser at `http://localhost:3000`.

### Future Enhancements:
- Integration with external databases for improved data management and scalability.
- Expansion of personality traits and conversational depth.
- Enhanced error handling and logging for debugging.

