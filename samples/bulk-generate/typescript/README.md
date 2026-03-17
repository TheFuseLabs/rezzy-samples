# Rezzy Bulk Generate

Generate resumes and/or cover letters in bulk from a `jobs.json` file using the [Rezzy API](https://docs.rezzy.dev).

## Prerequisites

- Node.js 18+
- A [Rezzy](https://rezzy.dev) account and API key

## Setup

1. Clone the repo and go to this sample:

   ```bash
   git clone git@github.com:TheFuseLabs/rezzy-samples.git
   cd rezzy-samples/samples/bulk-generate/typescript
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set your API key:

   ```bash
   export REZZY_API_KEY=your_api_key
   ```

4. Create your jobs file from the sample:

   ```bash
   cp jobs.json.sample jobs.json
   ```

5. Edit `jobs.json` with your jobs. Each entry must have:
   - `title` – Job title (e.g. "Senior Software Engineer")
   - `company` – Company name (required for cover letters)
   - `job_description` – Full job description text

   Use unique names for each resume and cover letter. The API call will fail if a resume or cover letter with the same name already exists on the platform.

`jobs.json` is gitignored so your real job data is never committed.

## Usage

Run from this directory so `jobs.json` is found:

- **Resumes only:** `npm run generate:resume`
- **Cover letters only:** `npm run generate:cover-letter`
- **Both:** `npm run generate:both`

## What to expect

- The script sends one API request per job (and per type when using `both`). Each request is queued on Rezzy’s side; the script does not wait for the full generation to finish.
- Progress is logged for each job (e.g. `[1/3] Senior Software Engineer @ Acme Corp`). After each successful request you’ll see “Resume queued” or “Cover letter queued.”
- Requests are spaced to respect [API rate limits](https://docs.rezzy.dev/rate-limiting). If you get a 429, the script waits and retries automatically.
- At the end, the script prints the dashboard URL so you can open it and see all your items.

## Viewing your resumes and cover letters

- **Resumes:** [Rezzy Dashboard → Resumes](https://rezzy.dev/dashboard/resumes)
- **Cover letters:** [Rezzy Dashboard → Cover Letters](https://www.rezzy.dev/dashboard/cover-letters)

There you can see every resume and cover letter generated from this run, filter by status, and download or share them. New items appear as Rezzy finishes generating them; refresh the page to see updates.
