import { useCallback, useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import { generateContent } from './components/Model';
import { BookOpen, Settings, Share2, Moon, Sun, FileText, List, AlignLeft, Clock, Target } from 'lucide-react';
import { SummaryView } from './components/SummaryView';

function App() {
  const [url, setUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [transcriptWithTimestamps, setTranscriptWithTimestamps] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [transcriptFormat, setTranscriptFormat] = useState('full');
  const [summaryFormat, setSummaryFormat] = useState('bullet points');
  const [focusArea, setFocusArea] = useState('general');
  const [showKeywords, setShowKeywords] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setloading] = useState(false);


  const getSummary = useCallback(async (videoTranscript: string) => {
    const summary = await generateContent(videoTranscript, { summaryFormat, summaryLength, focusArea, showKeywords });
    setSummary(summary);
    console.log(summary);
  }, [summaryFormat, summaryLength, focusArea, showKeywords]);


  useEffect(() => {

    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          setUrl(tabs[0].url || "No URL found");
        }
      });
    }
  }, []);

  useEffect(() => {
    try {
      if (url) {
        (async () => {
          const videoId = url?.split("v=")[1];
          const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/transcript/${videoId}`);
          console.log(response.data);
          if (response.data?.detail) {
            setTranscript("false");
            setTranscriptWithTimestamps("false");
            return;
          }
          setTranscript(response.data.transcript);
          setTranscriptWithTimestamps(JSON.stringify(response.data.transcriptWithTimestamps));
        })();
      }
    } catch (err) {
      console.log(err);
    }
  }, [url])



  function downloadTranscript(transcript: string) {
    // Create a Blob from the transcript string
    const blob = new Blob([transcript], { type: "text/plain" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt"; // Filename

    // Trigger a click event to start download
    document.body.appendChild(a);
    a.click();

    // Cleanup: Remove the element & revoke the URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleSummary = async ({ transcript }: { transcript: string }) => {
    await getSummary(transcript);
  }

  if (url && !url.includes("youtube.com/watch?v=")) {
    return <div className="w-[400px] bg-white p-4">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-semibold underline ">Go on a valid youtube video</h1>
      </div>
    </div>
  }

  if (showSummary && summary) {
    return <SummaryView onBack={() => setShowSummary(false)} summary={summary} />;
  }


  return (
    <div className={`w-[400px] min-h-[600px] ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <header className={`p-4 border-b  ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
            <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Video Summarizer <br />
            </h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

      </header>

      <main className={`p-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Summary Options -<span className='text-sm underline'> {url || "loading"}</span></h2>
            <Settings className="w-5 h-5" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Summary Format</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'bullet points', label: 'Bullet Points', icon: List },
                  { value: 'paragraphs', label: 'Paragraphs', icon: AlignLeft },
                  { value: 'topics', label: 'By Topics', icon: Target },
                  { value: 'Timestamps with key moments', label: 'Key Moments', icon: Clock },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSummaryFormat(value)}
                    className={`flex items-center gap-2 p-2 rounded-md border transition-colors ${summaryFormat === value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : `${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'}`
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Focus Area</label>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className={`w-full p-2 rounded-md border ${isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-300'
                  }`}
              >
                <option value="general">General Overview</option>
                <option value="key takeaways">Key Takeaways</option>
                <option value="definitions and terms">Definitions & Terms</option>
                <option value="questions and answers">Questions & Answers</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Summary Length</label>
              <div className="flex gap-2">
                {['short', 'medium', 'long'].map((length) => (
                  <button
                    key={length}
                    onClick={() => setSummaryLength(length)}
                    className={`flex-1 py-2 px-3 rounded-md border capitalize transition-colors ${summaryLength === length
                      ? 'bg-blue-600 text-white border-blue-600'
                      : `${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'}`
                      }`}
                  >
                    {length}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Highlight Keywords</label>
              <button
                onClick={() => setShowKeywords(!showKeywords)}
                className={`relative w-11 h-6 rounded-full transition-colors ${showKeywords ? 'bg-blue-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${showKeywords ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Transcript Format</label>
              <select
                value={transcriptFormat}
                onChange={(e) => setTranscriptFormat(e.target.value)}
                className={`w-full p-2 rounded-md border ${isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-300'
                  }`}
              >
                <option value="full">Full Transcript</option>
                <option value="timestamped">With Timestamps</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (transcript && transcriptWithTimestamps && transcript == "false") {
                  setError("No transcript available for this video");
                }
                else if (transcript && transcriptWithTimestamps) {
                  if (transcriptFormat == "full") downloadTranscript(transcript);
                  else if (transcriptFormat == "timestamped") downloadTranscript(transcriptWithTimestamps);
                }
                else {
                  setError("wait...");
                }
              }}
              className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Download Transcript
            </button>
            <button
              onClick={async () => {
                setloading(true);
                if (!transcript || transcript == "false" || transcriptWithTimestamps == "false") {
                  setError("No transcript available  for this video so cant generate summary");
                  setloading(false);
                  return;
                }
                if (summaryFormat == "Timestamps with key moments" && transcriptWithTimestamps) {
                  await handleSummary({ transcript: transcriptWithTimestamps });
                  setloading(false)
                  setShowSummary(true);
                }
                else {
                  await handleSummary({ transcript });
                  setloading(false)
                  setShowSummary(true);
                }
              }}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {loading ? <div role="status" className='flex items-center justify-center gap-3'>
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                Summarizing...
              </div> : "Summarize"}
            </button>
          </div>

          <div className={`mt-6 p-4 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-sm">
              Click "Get Transcript" to fetch the video transcript, or "Summarize" to generate an AI-powered summary.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
