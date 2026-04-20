export interface Job {
  title: string;
  job_description: string;
  company?: string;
  company_url?: string;
}

export interface ResumeCreateData {
  id: string;
  resume_title: string;
  status: string;
  dashboard_url: string;
}

export interface CoverLetterCreateData {
  id: string;
  title: string;
  status: string;
  dashboard_url: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface GenerationResult {
  title: string;
  type: "resume" | "cover-letter";
  status: string;
  dashboardUrl: string;
}
