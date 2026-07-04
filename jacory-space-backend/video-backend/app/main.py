from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.config import ensure_runtime_dirs
from app.middleware.client_id import client_id_middleware
from app.routes import cookies, download, outline, parse, settings

ensure_runtime_dirs()

app = FastAPI(title="Jacory Space Video Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.middleware("http")(client_id_middleware)


@app.get("/api/health")
async def health(request: Request):
    return {"ok": True, "service": "video-backend", "client_id": request.state.client_id}


app.include_router(settings.router, prefix="/api")
app.include_router(cookies.router, prefix="/api")
app.include_router(parse.router, prefix="/api")
app.include_router(download.router, prefix="/api")
app.include_router(outline.router, prefix="/api")
