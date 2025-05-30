import { useState, useEffect } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(https://vidcaptioner-backend.onrender.com"/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setTranscript(data.transcript || "No transcript returned.");
      setSummary("");
    } catch (err) {
      setTranscript("Error during upload/transcription.");
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!transcript) return;
    const res = await fetch("https://vidcaptioner-backend.onrender.com/summarize/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transcript),
    });
    const data = await res.json();
    setSummary(data.summary);
  };

  const handleDownloadSRT = async () => {
    if (!file) return alert("Upload a file first.");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://vidcaptioner-backend.onrender.com/generate-srt/", {
      method: "POST",
      body: formData,
    });

    const srtBlob = await res.blob();
    const url = window.URL.createObjectURL(srtBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "captions.srt");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] dark:bg-slate-900 text-[#1b140e] dark:text-white font-sans px-6 py-4">
      <header className="flex justify-between items-center border-b border-[#f3ede7] pb-3">
        <h1 className="text-2xl font-bold">VidCaptioner Pro</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-[#f3ede7] text-[#1b140e] px-4 py-2 rounded-md text-sm font-semibold"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      <main className="max-w-3xl mx-auto mt-8 space-y-6">
        <div className="space-y-4">
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleUpload}
              className="bg-orange-400 text-white px-4 py-2 rounded-md"
            >
              {loading ? "Processing..." : "Upload & Transcribe"}
            </button>
            <button
              onClick={handleSummarize}
              className="bg-[#f3ede7] text-[#1b140e] px-4 py-2 rounded-md"
            >
              Summarize
            </button>
            <button
              onClick={handleDownloadSRT}
              className="bg-[#f3ede7] text-[#1b140e] px-4 py-2 rounded-md"
            >
              Download Subtitles
            </button>
          </div>
        </div>

        {transcript && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-lg mb-2">Transcript</h2>
            <p className="whitespace-pre-wrap text-sm">{transcript}</p>
          </div>
        )}

        {summary && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-lg mb-2">Summary</h2>
            <p className="whitespace-pre-wrap text-sm">{summary}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
