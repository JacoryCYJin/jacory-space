from app.services.media.resolver import resolve_media_target


def parse_podcast_target(url: str) -> dict:
    target = resolve_media_target(url)
    if target["type"] not in {"podcast", "audio"}:
        return {
            "type": target["type"],
            "platform": target["platform"],
            "source_url": target["url"],
            "supported": False,
            "error": "当前链接不是播客或音频链接",
        }

    return {
        "type": "podcast" if target["type"] == "podcast" else "audio",
        "platform": target["platform"],
        "source_url": target["url"],
        "supported": True,
        "transcript": "",
        "transcript_status": "missing",
        "transcript_source": "",
        "summary": "",
    }
