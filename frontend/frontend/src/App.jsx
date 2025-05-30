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
      const res = await fetch("http://localhost:8001/upload/", {
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
    const res = await fetch("http://localhost:8001/summarize/", {
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

    const res = await fetch("http://localhost:8001/generate-srt/", {
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
    <div className="min-h-screen transition bg-[#fcfaf8] dark:bg-slate-900 text-[#1b140e] dark:text-gray-100 font-sans">
      <div className="flex justify-between items-center px-10 py-3 border-b border-[#f3ede7]">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold tracking-tight">VidCaptioner Pro</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg h-10 px-4 bg-[#f3ede7] text-[#1b140e] text-sm font-bold tracking-wide"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      <main className="px-10 py-5 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-6">
          <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6">
            <input
              type="file"
              accept="video/mp4"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm bg-white dark:bg-slate-700"
            />

            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={handleUpload}
                className="flex-1 py-2 bg-[#ea9847] hover:bg-orange-500 text-white font-bold rounded"
              >
                {loading ? "Processing..." : "Upload & Transcribe"}
              </button>
              <button
                onClick={handleSummarize}
                className="flex-1 py-2 bg-[#f3ede7] hover:bg-[#ebded4] text-[#1b140e] font-bold rounded"
              >
                Summarize
              </button>
              <button
                onClick={handleDownloadSRT}
                className="flex-1 py-2 bg-[#f3ede7] hover:bg-[#ebded4] text-[#1b140e] font-bold rounded"
              >
                Download
              </button>
            </div>
          </div>

          {transcript && (
            <div className="bg-[#f3ede7] dark:bg-slate-700 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold">📝 Transcript</h2>
              <p className="whitespace-pre-wrap text-sm">{transcript}</p>
            </div>
          )}

          {summary && (
            <div className="bg-[#f3ede7] dark:bg-slate-700 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold">📌 Summary</h2>
              <p className="whitespace-pre-wrap text-sm">{summary}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
