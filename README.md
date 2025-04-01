# 🎥 AI-Powered YouTube Video Summarizer

https://github.com/user-attachments/assets/50e59e7b-0e1a-49ea-8698-1b7d03c564a3

A **Chrome extension** built with **Vite + React** that provides **AI-powered** video summarization for YouTube. Extract transcripts, generate concise summaries, and get key takeaways in seconds!

## 🚀 Features

### 1️⃣ AI-Powered Summarization
✅ Automatic video transcript extraction using YouTube’s API  
✅ AI-driven text summarization (GPT, Gemini, BART)  
✅ Multiple summarization formats:
   - Bullet points
   - Concise paragraphs
   - Topic-wise segmentation
   - Timestamps with key moments  

### 2️⃣ Customization Options
✅ Adjustable summary length (short, medium, long)  
✅ Focus area selection (e.g., key takeaways, definitions, Q&A)  
✅ Keyword highlighting for frequently used terms  

### 3️⃣ User-Friendly Chrome Extension Interface
✅ One-click summarization on YouTube videos  
✅ Floating summary widget for quick access  
✅ Dark mode and theme customization  

### 4️⃣ Multi-Language Support
✅ Summarization in multiple languages (based on transcript availability)  
✅ Auto-translate summaries into a preferred language  

### 5️⃣ Export & Sharing Options
✅ Download summary as a text file  
✅ Copy to clipboard for quick sharing  

## 🛠 Installation

### 👉 From Chrome Web Store (Coming Soon)
1. Go to the **Chrome Web Store** (link to be added soon)
2. Click **Add to Chrome**
3. Pin the extension for easy access

### 👉 Manual Installation (Development Mode)
1. Clone this repository:
   ```sh
   git clone https://github.com/MonuYadav05/Ai-YouTube-video-summarizer.git
   cd Ai-YouTube-video-summarizer
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run in development mode:
   ```sh
   npm run dev
   ```

3. Compile extension:
   ```sh
   npm run build 
   ```
4. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable **Developer Mode** (top right corner)
   - Click **Load Unpacked**
   - Select the `dist` folder inside the project directory

## ⚙️ Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Fast Api server for youtube transcript
- **AI Models:** Gemini-1.5-flash  (Api)
- **YouTube API:** Transcript extraction


