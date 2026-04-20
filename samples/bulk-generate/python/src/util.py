import json
import sys
from pathlib import Path

from src.logger import logger
from src.types import Job

Mode = str


def parse_mode() -> Mode:
    args = sys.argv
    if "--mode" not in args:
        logger.error("Usage: generate --mode <resume|cover-letter|both>")
        sys.exit(1)
    idx = args.index("--mode")
    if idx + 1 >= len(args):
        logger.error("Usage: generate --mode <resume|cover-letter|both>")
        sys.exit(1)
    mode = args[idx + 1]
    if mode not in ("resume", "cover-letter", "both"):
        logger.error("Mode must be: resume, cover-letter, or both")
        sys.exit(1)
    return mode


def load_jobs() -> list[Job]:
    path = Path.cwd() / "jobs.json"
    try:
        raw = path.read_text()
    except OSError:
        logger.error(f"Could not read jobs.json at {path}")
        sys.exit(1)
    try:
        jobs = json.loads(raw)
    except json.JSONDecodeError:
        logger.error("jobs.json is not valid JSON")
        sys.exit(1)
    if not isinstance(jobs, list) or len(jobs) == 0:
        logger.error("jobs.json must be a non-empty array of jobs")
        sys.exit(1)
    for job in jobs:
        if not isinstance(job.get("title"), str) or not isinstance(
            job.get("job_description"), str
        ):
            logger.error("Each job must have title and job_description (strings)")
            sys.exit(1)
        if "company" in job and not isinstance(job.get("company"), str):
            logger.error("When set, company must be a string")
            sys.exit(1)
        if "company_url" in job and not isinstance(job.get("company_url"), str):
            logger.error("When set, company_url must be a string")
            sys.exit(1)
    return jobs
