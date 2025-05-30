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
    <div
      className="min-h-screen bg-[#fcfaf8] dark:bg-slate-900 text-[#1b140e] dark:text-gray-100 font-sans"
      style={{ fontFamily: 'Newsreader, "Noto Sans", sans-serif' }}
    >
      <header className="flex items-center justify-between border-b border-[#f3ede7] px-10 py-3">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold">Media Editor</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded-lg bg-[#f3ede7] text-sm font-bold"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      <main className="px-10 py-6 max-w-5xl mx-auto">
        <div className="flex flex-col gap-6">
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setFile(e.target.files[0])}
            className="bg-white border border-gray-300 dark:border-gray-600 rounded p-2"
          />

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleUpload}
              className="bg-[#ea9847] text-[#1b140e] px-4 py-2 rounded-lg font-bold"
            >
              {loading ? "Processing..." : "Upload & Transcribe"}
            </button>
            <button
              onClick={handleSummarize}
              className="bg-[#f3ede7] text-[#1b140e] px-4 py-2 rounded-lg font-bold"
            >
              Summarize
            </button>
            <button
              onClick={handleDownloadSRT}
              className="bg-[#f3ede7] text-[#1b140e] px-4 py-2 rounded-lg font-bold"
            >
              Download
            </button>
          </div>

          {transcript && (
            <section className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-bold mb-2">Transcript</h3>
              <p className="text-sm whitespace-pre-wrap">{transcript}</p>
            </section>
          )}

          {summary && (
            <section className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-bold mb-2">Summary</h3>
              <p className="text-sm whitespace-pre-wrap">{summary}</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
