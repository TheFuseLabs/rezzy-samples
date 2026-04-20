import type { ApiResponse, CoverLetterCreateData, ResumeCreateData } from "./types.js";

const BASE_URL = "https://api.rezzy.dev/v1";

const RATE_LIMIT_SLEEP_MS = 7000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class RezzyClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    const key = apiKey ?? process.env.REZZY_API_KEY;
    if (!key) {
      throw new Error("REZZY_API_KEY is not set");
    }
    this.apiKey = key;
  }

  async request<T>(method: string, path: string, body?: object): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${path}`;
    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    const json = (await response.json()) as ApiResponse<T> & {
      data?: { error_code?: string; details?: { retry_after?: number } };
    };
    if (response.status === 429) {
      const retryAfter =
        response.headers.get("Retry-After") ?? json.data?.details?.retry_after ?? 60;
      await sleep(Number(retryAfter) * 1000);
      return this.request(method, path, body);
    }
    if (!response.ok) {
      throw new Error(json.message ?? `HTTP ${response.status}`);
    }
    return json as ApiResponse<T>;
  }

  async createResume(
    title: string,
    jobDescription: string,
    companyUrl?: string,
  ): Promise<ApiResponse<ResumeCreateData>> {
    const body: { title: string; job_description: string; company_url?: string } = {
      title,
      job_description: jobDescription,
    };
    if (companyUrl) {
      body.company_url = companyUrl;
    }
    const result = await this.request<ResumeCreateData>("POST", "/resume/create", body);
    return result;
  }

  async createCoverLetter(
    title: string,
    jobDescription: string,
    companyUrl?: string,
  ): Promise<ApiResponse<CoverLetterCreateData>> {
    const body: { title: string; job_description: string; company_url?: string } = {
      title,
      job_description: jobDescription,
    };
    if (companyUrl) {
      body.company_url = companyUrl;
    }
    const result = await this.request<CoverLetterCreateData>("POST", "/cover-letter/create", body);
    return result;
  }

  async createResumeWithRateLimit(
    title: string,
    jobDescription: string,
    companyUrl?: string,
  ): Promise<ApiResponse<ResumeCreateData>> {
    const result = await this.createResume(title, jobDescription, companyUrl);
    await sleep(RATE_LIMIT_SLEEP_MS);
    return result;
  }

  async createCoverLetterWithRateLimit(
    title: string,
    jobDescription: string,
    companyUrl?: string,
  ): Promise<ApiResponse<CoverLetterCreateData>> {
    const result = await this.createCoverLetter(title, jobDescription, companyUrl);
    await sleep(RATE_LIMIT_SLEEP_MS);
    return result;
  }
}
