from fastapi import APIRouter, File, UploadFile, Body
from app.services.asr import transcribe_audio
from fastapi.responses import Response
import shutil
import os
import traceback

from app.services.asr import transcribe_audio  
from app.services.summarize import summarize_text
from app.services.subtitles import generate_srt  # ✅ [May 26, 2025] Subtitle generator

router = APIRouter()

@router.post("/upload/")
async def upload_video(file: UploadFile = File(...)):
    save_path = f"temp_uploads/{file.filename}"
    os.makedirs("temp_uploads", exist_ok=True)

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        transcript = transcribe_audio(save_path)
    except Exception as e:
        print("❌ Transcription error:")
        traceback.print_exc()
        transcript = "Transcription failed."

    return {
        "filename": file.filename,
        "transcript": transcript
    }

@router.post("/summarize/")
async def summarize(transcript: str = Body(...)):
    try:
        summary = summarize_text(transcript)
        return {"summary": summary}
    except Exception as e:
        print(f"❌ Summarization error: {e}")
        return {"summary": "Summarization failed."}

# ✅ [May 26, 2025] Added SRT subtitle generation route
@router.post("/generate-srt/")
async def generate_srt_endpoint(file: UploadFile = File(...)):
    save_path = f"temp_uploads/{file.filename}"
    os.makedirs("temp_uploads", exist_ok=True)

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        transcript = transcribe_audio(save_path)
        srt_content = generate_srt(transcript)
        return Response(content=srt_content, media_type="text/plain")
    except Exception as e:
        print(f"❌ SRT generation error: {e}")
        traceback.print_exc()
        return Response(content="Subtitle generation failed.", media_type="text/plain")
