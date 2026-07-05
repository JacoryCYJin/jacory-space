import asyncio

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.services.transcript.local_stt import transcribe_audio_url

router = APIRouter()


@router.post("/transcript/local-stt")
async def local_stt(request: Request):
    body = await request.json()
    audio_url = str(body.get("audio_url") or "").strip()
    if not audio_url:
        return JSONResponse({"error": "缺少 audio_url 参数"}, status_code=400)

    try:
        result = await asyncio.to_thread(
            transcribe_audio_url,
            audio_url,
            client_id=request.state.client_id,
            title=str(body.get("title") or "").strip(),
            language=str(body.get("language") or "").strip(),
            model_name=str(body.get("model") or "").strip(),
            device=str(body.get("device") or "").strip(),
            compute_type=str(body.get("compute_type") or "").strip(),
        )
        return result
    except ValueError as error:
        return JSONResponse({"error": str(error)}, status_code=400)
    except RuntimeError as error:
        return JSONResponse({"error": str(error)}, status_code=501)
    except Exception as error:
        return JSONResponse({"error": f"本地转写失败: {error}"}, status_code=500)
