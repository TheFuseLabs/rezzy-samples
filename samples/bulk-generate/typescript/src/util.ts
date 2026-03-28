import { readFileSync } from "node:fs";
import { join } from "node:path";
import { logger } from "./logger.js";
import type { Job } from "./types.js";

export type Mode = "resume" | "cover-letter" | "both";

export function parseMode(): Mode {
  const idx = process.argv.indexOf("--mode");
  if (idx === -1 || !process.argv[idx + 1]) {
    logger.error("Usage: tsx src/index.ts --mode <resume|cover-letter|both>");
    process.exit(1);
  }
  const mode = process.argv[idx + 1] as Mode;
  if (mode !== "resume" && mode !== "cover-letter" && mode !== "both") {
    logger.error("Mode must be: resume, cover-letter, or both");
    process.exit(1);
  }
  return mode;
}

export function loadJobs(): Job[] {
  const path = join(process.cwd(), "jobs.json");
  let raw: string;
  try {
    raw = readFileSync(path, "utf-8");
  } catch {
    logger.error(`Could not read jobs.json at ${path}`);
    process.exit(1);
  }
  let jobs: Job[];
  try {
    jobs = JSON.parse(raw) as Job[];
  } catch {
    logger.error("jobs.json is not valid JSON");
    process.exit(1);
  }
  if (!Array.isArray(jobs) || jobs.length === 0) {
    logger.error("jobs.json must be a non-empty array of jobs");
    process.exit(1);
  }
  for (const job of jobs) {
    if (
      typeof job.title !== "string" ||
      typeof job.job_description !== "string" ||
      typeof job.company !== "string"
    ) {
      logger.error("Each job must have title, company, and job_description (strings)");
      process.exit(1);
    }
    if (job.company_url !== undefined && typeof job.company_url !== "string") {
      logger.error("When set, company_url must be a string");
      process.exit(1);
    }
  }
  return jobs;
}
