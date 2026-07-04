import subprocess
from pathlib import Path

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.services.user_data import (
    get_user_settings,
    normalize_browser_cookie_source,
    normalize_cookie_mode,
    normalize_output_dir,
    save_user_settings,
)

router = APIRouter()


@router.get("/settings")
async def get_settings(request: Request):
    return get_user_settings(request.state.client_id)


@router.post("/settings")
async def save_settings(request: Request):
    body = await request.json()
    current_settings = get_user_settings(request.state.client_id)
    default_dir = normalize_output_dir(
        body.get("default_download_dir", current_settings["default_download_dir"]),
        request.state.client_id,
    )
    default_dir.mkdir(parents=True, exist_ok=True)

    settings = {
        "default_download_dir": str(default_dir),
        "cookie_mode": normalize_cookie_mode(body.get("cookie_mode", current_settings["cookie_mode"])),
        "browser_cookie_source": normalize_browser_cookie_source(
            body.get("browser_cookie_source", current_settings["browser_cookie_source"])
        ),
    }
    save_user_settings(request.state.client_id, settings)
    return {"message": "默认下载目录保存成功", **settings}


@router.post("/folder-dialog")
async def folder_dialog():
    try:
        script = 'POSIX path of (choose folder with prompt "请选择下载文件夹")'
        completed = subprocess.run(
            ["osascript", "-e", script],
            capture_output=True,
            text=True,
            check=False,
        )
        if completed.returncode != 0:
            err = completed.stderr.strip()
            if "User canceled" in err:
                return {"cancelled": True}
            return JSONResponse({"error": f"选取目录失败: {err or 'unknown error'}"}, status_code=500)

        selected = completed.stdout.strip()
        if not selected:
            return {"cancelled": True}
        return {"cancelled": False, "path": str(Path(selected).resolve())}
    except Exception as error:
        return JSONResponse({"error": f"打开目录选择失败: {error}"}, status_code=500)
