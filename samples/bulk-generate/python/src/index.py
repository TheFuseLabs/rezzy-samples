from src.client import RezzyClient
from src.logger import logger
from src.types import GenerationResult
from src.util import load_jobs, parse_mode

RESUMES_DASHBOARD_URL = "https://rezzy.dev/dashboard/resumes"
COVER_LETTERS_DASHBOARD_URL = "https://www.rezzy.dev/dashboard/cover-letters"


def _run() -> None:
    mode = parse_mode()
    jobs = load_jobs()
    client = RezzyClient()
    results: list[GenerationResult] = []

    logger.info(f"Running in mode: {mode} ({len(jobs)} job(s))")
    if mode == "both":
        logger.info(
            f"Check status at: {RESUMES_DASHBOARD_URL} (resumes), {COVER_LETTERS_DASHBOARD_URL} (cover letters)"
        )
    elif mode == "resume":
        logger.info(f"Check status at: {RESUMES_DASHBOARD_URL}")
    else:
        logger.info(f"Check status at: {COVER_LETTERS_DASHBOARD_URL}")

    for i, job in enumerate(jobs):
        logger.info(f"[{i + 1}/{len(jobs)}] {job['title']} @ {job['company']}")

        if mode in ("resume", "both"):
            try:
                res = client.create_resume_with_rate_limit(
                    job["title"], job["job_description"]
                )
                data = res.get("data") or {}
                results.append({
                    "title": job["title"],
                    "type": "resume",
                    "status": data.get("status", ""),
                    "dashboard_url": RESUMES_DASHBOARD_URL,
                })
                logger.success("Resume queued")
            except Exception as e:
                logger.error(f"Resume failed: {e}")

        if mode in ("cover-letter", "both"):
            try:
                res = client.create_cover_letter_with_rate_limit(
                    job["title"], job["job_description"], job["company"]
                )
                data = res.get("data") or {}
                results.append({
                    "title": job["title"],
                    "type": "cover-letter",
                    "status": data.get("status", ""),
                    "dashboard_url": COVER_LETTERS_DASHBOARD_URL,
                })
                logger.success("Cover letter queued")
            except Exception as e:
                logger.error(f"Cover letter failed: {e}")

    logger.info("--- Summary ---")
    for r in results:
        logger.dim(f"{r['type']}: {r['title']}")
    if mode == "both":
        logger.info(
            f"Check status for all at: {RESUMES_DASHBOARD_URL} (resumes), {COVER_LETTERS_DASHBOARD_URL} (cover letters)"
        )
    elif mode == "resume":
        logger.info(f"Check status for all at: {RESUMES_DASHBOARD_URL}")
    else:
        logger.info(f"Check status for all at: {COVER_LETTERS_DASHBOARD_URL}")


def main() -> None:
    try:
        _run()
    except Exception as e:
        logger.error(str(e))
        raise SystemExit(1)
