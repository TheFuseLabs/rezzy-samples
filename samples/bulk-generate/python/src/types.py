from typing import TypedDict


class _JobRequired(TypedDict):
    title: str
    job_description: str


class _JobOptional(TypedDict, total=False):
    company: str
    company_url: str


class Job(_JobRequired, _JobOptional):
    pass


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
