import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
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
    } catch (err) {
      setTranscript("Error during upload/transcription.");
    } finally {
      setLoading(false);
    }
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
        </div>
      )}
    </div>
  );
}

export default App;
