# vidcaptioner-pro


# 🎥 VidCaptioner Pro

**VidCaptioner Pro** is an AI-powered platform that automatically transcribes, summarizes, and translates video content into captions and summaries — making videos more accessible, SEO-friendly, and easier to repurpose.

![VidCaptioner Pro Architecture](docs/architecture.md)

---

## 🚀 Features

- 🎙️ Automatic Speech Recognition (ASR)
- 🧠 Natural-Language Summarization
- 🌍 Multilingual Translation Support
- 📼 File Upload or YouTube/TikTok URL support
- 📜 Caption and summary editing interface
- 📤 Export captions in SRT, VTT, and plain text formats

---

## 🧠 Powered by Hugging Face

Uses models for:
- **ASR**: `nvidia/parakeet-tdt-0.6b-v2`
- **Summarization**: `facebook/KernellLM`, `google/medgemma-4b-it`
- **Translation**: Hugging Face `translation_*` pipelines
- **(Optional)** Highlight generation via `Wan-AI/Wan2.1-VACE-14B`

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + TailwindCSS |
| Backend | Python + FastAPI |
| ML Inference | Hugging Face Transformers, Torch |
| Video | FFmpeg, moviepy |
| Auth | Firebase Auth |
| Storage | AWS S3 / Firebase Storage |
| Hosting | Vercel (frontend), AWS EC2 or Render (backend) |

---

## 📁 Project Structure

```bash
vidcaptioner-pro/
├── backend/
│   └── app/
├── frontend/
│   └── src/
├── docs/
│   └── architecture.md
├── data/
├── .env
├── README.md

