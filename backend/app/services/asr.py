# app/services/asr.py

import os
import requests
import ffmpeg
import sys

API_URL = "https://api-inference.huggingface.co/models/openai/whisper-small"
HUGGINGFACE_API_TOKEN = os.getenv("HF_API_TOKEN")

headers = {
    "Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"
}


def extract_audio(input_path: str) -> str:
    """
    Converts any audio/video file to mono 16kHz WAV for ASR processing.
    """
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
    """
    Sends audio to Hugging Face Inference API for transcription.
    """
    print(f"🎧 Extracting audio from: {file_path}")
    sys.stdout.flush()

    wav_path = extract_audio(file_path)
    if not os.path.exists(wav_path):
        print("❌ WAV file was not created.")
        return "Failed to extract audio."

    try:
        with open(wav_path, "rb") as f:
            print("🧠 Sending to Hugging Face API...")
            response = requests.post(API_URL, headers=headers, data=f)

        if response.status_code != 200:
            print(f"❌ API Error: {response.status_code} - {response.text}")
            return "Transcription failed."

        result = response.json()
        print("📝 Transcript:", result.get("text"))
        return result.get("text", "Transcription failed.")
    except Exception as e:
        print(f"❌ ASR request failed: {e}")
        return "Transcription failed."
