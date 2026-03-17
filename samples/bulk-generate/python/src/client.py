import os
import time
from typing import Any

import requests

from src.types import ApiResponse

BASE_URL = "https://api.rezzy.dev/v1"
RATE_LIMIT_SLEEP_SEC = 7


class RezzyClient:
    def __init__(self, api_key: str | None = None) -> None:
        key = api_key or os.environ.get("REZZY_API_KEY")
        if not key:
            raise ValueError("REZZY_API_KEY is not set")
        self._api_key = key

    def _request(
        self, method: str, path: str, body: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        url = f"{BASE_URL}{path}"
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }
        resp = requests.request(
            method, url, json=body, headers=headers, timeout=60
        )
        try:
            data = resp.json()
        except requests.exceptions.JSONDecodeError:
            data = {}
        if resp.status_code == 429:
            retry_after = resp.headers.get("Retry-After")
            if retry_after is None and isinstance(data.get("data"), dict):
                details = data["data"].get("details") or {}
                retry_after = details.get("retry_after")
            wait = int(retry_after) if retry_after is not None else 60
            time.sleep(wait)
            return self._request(method, path, body)
        if not resp.ok:
            msg = data.get("message") if isinstance(data, dict) else None
            raise RuntimeError(msg or f"HTTP {resp.status_code}")
        return data

    def create_resume(self, title: str, job_description: str) -> ApiResponse:
        result = self._request("POST", "/resume/create", {"title": title, "job_description": job_description})
        return result

    def create_cover_letter(
        self, title: str, job_description: str, company_name: str
    ) -> ApiResponse:
        result = self._request(
            "POST",
            "/cover-letter/create",
            {"title": title, "job_description": job_description, "company_name": company_name},
        )
        return result

    def create_resume_with_rate_limit(
        self, title: str, job_description: str
    ) -> dict[str, Any]:
        out = self.create_resume(title, job_description)
        time.sleep(RATE_LIMIT_SLEEP_SEC)
        return out

    def create_cover_letter_with_rate_limit(
        self, title: str, job_description: str, company_name: str
    ) -> dict[str, Any]:
        out = self.create_cover_letter(title, job_description, company_name)
        time.sleep(RATE_LIMIT_SLEEP_SEC)
        return out
