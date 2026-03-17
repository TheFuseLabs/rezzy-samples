import { RezzyClient } from "./client.js";
import { logger } from "./logger.js";
import type { GenerationResult } from "./types.js";
import { loadJobs, parseMode } from "./util.js";

const RESUMES_DASHBOARD_URL = "https://rezzy.dev/dashboard/resumes";
const COVER_LETTERS_DASHBOARD_URL = "https://www.rezzy.dev/dashboard/cover-letters";

async function run(): Promise<void> {
  const mode = parseMode();
  const jobs = loadJobs();
  const client = new RezzyClient();
  const results: GenerationResult[] = [];

  logger.info(`Running in mode: ${mode} (${jobs.length} job(s))`);
  if (mode === "both") {
    logger.info(`Check status at: ${RESUMES_DASHBOARD_URL} (resumes), ${COVER_LETTERS_DASHBOARD_URL} (cover letters)`);
  } else if (mode === "resume") {
    logger.info(`Check status at: ${RESUMES_DASHBOARD_URL}`);
  } else {
    logger.info(`Check status at: ${COVER_LETTERS_DASHBOARD_URL}`);
  }

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    logger.info(`[${i + 1}/${jobs.length}] ${job.title} @ ${job.company}`);

    if (mode === "resume" || mode === "both") {
      try {
        const res = await client.createResumeWithRateLimit(job.title, job.job_description);
        results.push({
          title: job.title,
          type: "resume",
          status: res.data.status,
          dashboardUrl: RESUMES_DASHBOARD_URL,
        });
        logger.success("Resume queued");
      } catch (err) {
        logger.error(`Resume failed: ${err instanceof Error ? err.message : err}`);
      }
    }

    if (mode === "cover-letter" || mode === "both") {
      try {
        const res = await client.createCoverLetterWithRateLimit(
          job.title,
          job.job_description,
          job.company,
        );
        results.push({
          title: job.title,
          type: "cover-letter",
          status: res.data.status,
          dashboardUrl: COVER_LETTERS_DASHBOARD_URL,
        });
        logger.success("Cover letter queued");
      } catch (err) {
        logger.error(`Cover letter failed: ${err instanceof Error ? err.message : err}`);
      }
    }
  }

  logger.info("--- Summary ---");
  for (const r of results) {
    logger.dim(`${r.type}: ${r.title}`);
  }
  if (mode === "both") {
    logger.info(`Check status for all at: ${RESUMES_DASHBOARD_URL} (resumes), ${COVER_LETTERS_DASHBOARD_URL} (cover letters)`);
  } else if (mode === "resume") {
    logger.info(`Check status for all at: ${RESUMES_DASHBOARD_URL}`);
  } else {
    logger.info(`Check status for all at: ${COVER_LETTERS_DASHBOARD_URL}`);
  }
}

run().catch((err) => {
  logger.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
