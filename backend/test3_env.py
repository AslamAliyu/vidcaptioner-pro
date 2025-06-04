# backend/test_env.py
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

print("✅ TOKEN:", os.getenv("HF_TOKEN"))

