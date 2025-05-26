import sys
import os
import ffmpeg
import librosa
from transformers import pipeline
from transformers import pipeline, WhisperFeatureExtractor


# Load Whisper ASR model from Hugging Face
asr_pipeline = pipeline("automatic-speech-recognition", model="openai/whisper-small")

asr_pipeline2 = pipeline("automatic-speech-recognition", model="openai/whisper-small", return_timestamps="word")

def extract_audio(input_path: str) -> str:
    output_path = os.path.splitext(input_path)[0] + "_converted.wav"
    try:
        print(f"🎬 Running ffmpeg to extract audio to: {output_path}")
        (
            ffmpeg
            .input(input_path)
            .output(output_path, format='wav', acodec='pcm_s16le', ac=1, ar='16000')
            .overwrite_output()
            .run()
        )
        print(f"✅ Audio extracted and saved to: {output_path}")
    except Exception as e:
        print(f"❌ Audio extraction failed: {e}")
        sys.stdout.flush()
    return output_path

def transcribe_audio(file_path: str) -> str:
    print(f"🎧 Extracting audio from: {file_path}")
    sys.stdout.flush()

    wav_path = extract_audio(file_path)
    if not os.path.exists(wav_path):
        print("❌ WAV file was not created.")
        sys.stdout.flush()
        return "Failed to extract audio."

    try:
        print("🧠 Running ASR...")
        sys.stdout.flush()
        audio, _ = librosa.load(wav_path, sr=16000)
        result = asr_pipeline(audio, chunk_length_s=30, stride_length_s=5)
        print("📝 Transcript result:", result)
        sys.stdout.flush()
        return result["text"]
    except Exception as e:
        print(f"❌ ASR failed: {e}")
        sys.stdout.flush()
        return "Transcription failed."

def transcribe_with_timestamps(file_path: str) -> list:
    print(f"🎬 Extracting audio from: {file_path}")
    wav_path = extract_audio(file_path)

    try:
        print("📚 Running Whisper with timestamps...")
        result = asr_pipeline2(wav_path, return_timestamps="word")
        return result.get("chunks", [])
    except Exception as e:
        print(f"❌ Timestamped ASR failed: {e}")
        return []
