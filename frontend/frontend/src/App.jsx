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
    <div className="min-h-screen transition bg-gradient-to-br from-white via-beige-50 to-beige-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-800 dark:text-gray-100 font-sans">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-700 dark:from-yellow-300 dark:to-yellow-400">
            VidCaptioner Pro
          </span>
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 space-y-6">
        <input
          type="file"
          accept="video/mp4"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm bg-white dark:bg-slate-700"
        />

        <button
          onClick={handleUpload}
          className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md shadow-md transition"
        >
          {loading ? "Processing..." : "Upload & Transcribe"}
        </button>

        {transcript && (
          <div className="space-y-4">
            <section className="bg-yellow-50 dark:bg-slate-700 rounded-md p-4 border border-yellow-200 dark:border-yellow-500">
              <h2 className="text-xl font-semibold mb-2">📝 Transcript</h2>
              <p className="text-sm whitespace-pre-wrap">{transcript}</p>

              <div className="mt-3 flex gap-3 flex-wrap">
                <button
                  onClick={handleSummarize}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  ✨ Summarize
                </button>
                <button
                  onClick={handleDownloadSRT}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                  🕒 Download Subtitles (.srt)
                </button>
              </div>
            </section>

            {summary && (
              <section className="bg-brown-50 dark:bg-slate-700 rounded-md p-4 border border-brown-200 dark:border-brown-500">
                <h2 className="text-xl font-semibold mb-2">📌 Summary</h2>
                <p className="text-sm whitespace-pre-wrap">{summary}</p>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
