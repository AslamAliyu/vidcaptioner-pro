from fastapi import APIRouter, File, UploadFile
import shutil
import os
from app.services.asr import transcribe_audio

router = APIRouter()
import traceback


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

