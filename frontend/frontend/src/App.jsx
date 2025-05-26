import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState(""); // 🌟 [May 25, 2025] Added for summary state
  const [loading, setLoading] = useState(false);

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
      setSummary(""); // 🌟 [May 25, 2025] Clear previous summary on new upload
    } catch (err) {
      setTranscript("Error during upload/transcription.");
    } finally {
      setLoading(false);
    }
  };

  // 🌟 [May 25, 2025] Added: Summarization function
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

  // 🌟 [May 26, 2025] Added: Subtitle (.srt) generation and download
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 space-y-4">
      <h1 className="text-3xl font-bold text-blue-700">VidCaptioner Pro</h1>

      <input
        type="file"
        accept="video/mp4"
        onChange={(e) => setFile(e.target.files[0])}
        className="bg-white border p-2 rounded"
      />

      <button
        onClick={handleUpload}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Processing..." : "Upload & Transcribe"}
      </button>

      {transcript && (
        <div className="mt-4 p-4 bg-white rounded shadow w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-2">Transcript</h2>
          <p className="whitespace-pre-wrap">{transcript}</p>

          {/* 🌟 [May 25, 2025] Added: Summarize button */}
          <button
            onClick={handleSummarize}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Summarize Transcript
          </button>

          {/* 🌟 [May 26, 2025] Added: Subtitles download button */}
          <button
            onClick={handleDownloadSRT}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            🕒 Generate Subtitles (.srt)
          </button>
        </div>
      )}

      {/* 🌟 [May 25, 2025] Added: Summary display */}
      {summary && (
        <div className="mt-4 p-4 bg-gray-200 rounded shadow w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
