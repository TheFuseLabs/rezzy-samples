import type { ApiResponse, CoverLetterCreateData, ResumeCreateData } from "./types.js";

const BASE_URL = "https://api.rezzy.dev/v1";

// Sleep between requests to stay under free-tier limit (10 req/60s). See https://docs.rezzy.dev/rate-limiting
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
  ): Promise<ApiResponse<ResumeCreateData>> {
    const result = await this.request<ResumeCreateData>("POST", "/resume/create", {
      title,
      job_description: jobDescription,
    });
    return result;
  }

  async createCoverLetter(
    title: string,
    jobDescription: string,
    companyName: string,
  ): Promise<ApiResponse<CoverLetterCreateData>> {
    const result = await this.request<CoverLetterCreateData>("POST", "/cover-letter/create", {
      title,
      job_description: jobDescription,
      company_name: companyName,
    });
    return result;
  }

  async createResumeWithRateLimit(
    title: string,
    jobDescription: string,
  ): Promise<ApiResponse<ResumeCreateData>> {
    const result = await this.createResume(title, jobDescription);
    await sleep(RATE_LIMIT_SLEEP_MS);
    return result;
  }

  async createCoverLetterWithRateLimit(
    title: string,
    jobDescription: string,
    companyName: string,
  ): Promise<ApiResponse<CoverLetterCreateData>> {
    const result = await this.createCoverLetter(title, jobDescription, companyName);
    await sleep(RATE_LIMIT_SLEEP_MS);
    return result;
  }
}
