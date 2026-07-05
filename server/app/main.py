from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.routers import auth, contact_messages, content, uploads, visits

UPLOAD_DIR = Path(settings.upload_dir)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Flat Productions API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compresses JSON responses (the aggregate GET /api/content payload in
# particular is large — all seeded copy for every section in one call).
app.add_middleware(GZipMiddleware, minimum_size=500)


@app.middleware("http")
async def cache_uploaded_files(request: Request, call_next):
    """Uploaded files are named by UUID and never change in place, so once
    served they're safe to cache indefinitely — this alone meaningfully
    speeds up repeat page loads across the site (the same images show up
    on the home page, portfolio, gallery, etc.)."""
    response = await call_next(request)
    if request.url.path.startswith(settings.upload_base_url):
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    return response


app.mount(settings.upload_base_url, StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.include_router(auth.router)
app.include_router(content.router)
app.include_router(uploads.router)
app.include_router(contact_messages.router)
app.include_router(visits.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
