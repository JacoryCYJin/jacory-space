import asyncio
from pathlib import Path

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.errors import ApiError
from app.services.user_data import get_user_settings, normalize_output_dir
from app.services.ytdlp import (
    assert_allowed_download_format,
    detect_platform,
    get_ytdlp_args,
    normalize_video_input,
    run_ytdlp,
)

router = APIRouter()


@router.post("/download")
async def download_video(request: Request):
    body = await request.json()
    try:
        url = normalize_video_input(body.get("url"))
        resolution = str(body.get("resolution") or "").strip()
        format_id = str(body.get("format_id") or "").strip()

        if not url or not resolution:
            return JSONResponse({"error": "缺少 url 或 resolution 参数"}, status_code=400)

        is_audio_only = resolution.lower() in {"audio", "audio only"}
        height = 0 if is_audio_only else int("".join(ch for ch in resolution if ch.isdigit()) or 0)
        if not is_audio_only and not height:
            return JSONResponse({"error": "无效的 resolution 参数"}, status_code=400)

        user_settings = get_user_settings(request.state.client_id)
        target_dir = normalize_output_dir(body.get("output_dir") or user_settings["default_download_dir"], request.state.client_id)
        target_dir.mkdir(parents=True, exist_ok=True)

        selected_format = await asyncio.to_thread(assert_allowed_download_format, request.state.client_id, url, format_id)
        if format_id:
            selected_video_selector = (
                f"{format_id}[ext=mp4]"
                if selected_format and selected_format.get("hasAudio")
                else f"{format_id}[ext=mp4]+bestaudio[ext=m4a]"
            )
        else:
            selected_video_selector = f"bestvideo[height<={height}][ext=mp4]+bestaudio[ext=m4a]/best[height<={height}][ext=mp4]"

        format_selector = (
            (f"{format_id}[ext=m4a][vcodec=none]/bestaudio[ext=m4a]" if format_id else "bestaudio[ext=m4a]")
            if is_audio_only
            else selected_video_selector
        )

        if selected_format and selected_format.get("ext") == "m4a" and not is_audio_only:
            return JSONResponse({"error": "音频格式请使用 Audio 下载项"}, status_code=400)
        if selected_format and selected_format.get("ext") == "mp4" and is_audio_only:
            return JSONResponse({"error": "视频格式不能作为 Audio 下载"}, status_code=400)

        output_template = str(Path(target_dir) / "%(title).140B-%(id)s.%(ext)s")
        base_args = [
            "-f",
            format_selector,
            "--merge-output-format",
            "mp4",
            "-o",
            output_template,
            "--print",
            "after_move:filepath",
        ]

        stdout = ""
        is_youtube = detect_platform(url) == "youtube"
        try:
            result = await asyncio.to_thread(run_ytdlp, get_ytdlp_args(request.state.client_id, url, base_args))
            stdout = result["stdout"]
        except Exception as first_error:
            msg = str(first_error)
            is_403 = "HTTP Error 403" in msg or "Forbidden" in msg
            is_bot_gate = "Sign in to confirm you’re not a bot" in msg
            if not (is_youtube and (is_403 or is_bot_gate)):
                raise

            try:
                retry_no_cookies = await asyncio.to_thread(
                    run_ytdlp,
                    get_ytdlp_args(request.state.client_id, url, base_args, {"useCookies": False}),
                )
                stdout = retry_no_cookies["stdout"]
            except Exception as second_error:
                second_msg = str(second_error)
                still_blocked = "Sign in to confirm you’re not a bot" in second_msg or "HTTP Error 403" in second_msg
                if not still_blocked:
                    raise

                try:
                    retry_safari = await asyncio.to_thread(
                        run_ytdlp,
                        get_ytdlp_args(
                            request.state.client_id,
                            url,
                            base_args,
                            {"useCookies": False, "cookiesFromBrowser": "safari"},
                        ),
                    )
                    stdout = retry_safari["stdout"]
                except Exception:
                    retry_chrome = await asyncio.to_thread(
                        run_ytdlp,
                        get_ytdlp_args(
                            request.state.client_id,
                            url,
                            base_args,
                            {"useCookies": False, "cookiesFromBrowser": "chrome"},
                        ),
                    )
                    stdout = retry_chrome["stdout"]

        saved_path = next((line.strip() for line in reversed(stdout.splitlines()) if line.strip()), "")
        return {"message": "下载完成", "path": saved_path or str(target_dir), "output_dir": str(target_dir)}
    except ApiError as error:
        return JSONResponse({"error": error.message}, status_code=error.status_code)
    except Exception as error:
        msg = str(error)
        if "Sign in to confirm you’re not a bot" in msg:
            return JSONResponse(
                {"error": "下载失败: YouTube 触发了机器人校验，请先在 Cookies 设置里更新 YouTube cookies（建议重新导出）后重试。"},
                status_code=500,
            )
        return JSONResponse({"error": f"下载失败: {msg}"}, status_code=500)
