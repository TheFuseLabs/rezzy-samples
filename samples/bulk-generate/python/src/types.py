from typing import TypedDict


class Job(TypedDict, total=False):
    title: str
    company: str
    job_description: str
    company_url: str


class ResumeCreateData(TypedDict):
    id: str
    resume_title: str
    status: str
    dashboard_url: str


class CoverLetterCreateData(TypedDict):
    id: str
    title: str
    status: str
    dashboard_url: str


class ApiResponse(TypedDict, total=False):
    success: bool
    message: str
    data: object


class GenerationResult(TypedDict):
    title: str
    type: str
    status: str
    dashboard_url: str
