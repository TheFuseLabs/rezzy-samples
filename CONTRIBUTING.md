# Contributing to Rezzy Samples

Thanks for your interest in contributing. This repo is for **samples and examples** only; please keep changes focused on that.

## Start with an issue

All contributions start on the [Issues](https://github.com/TheFuseLabs/rezzy-samples/issues) page. Whether you have a bug report, a feature request, or an idea:

1. Go to the [issues page](https://github.com/TheFuseLabs/rezzy-samples/issues).
2. Search open and closed issues to see if it has already been filed or if someone is already working on it.
3. Check **open issues** for work we’re actively looking for help on.

### Taking an issue

- If you have permission, **assign the issue to yourself**.
- If the issue doesn’t exist yet, **create it** and then assign it to yourself.
- If you can’t assign yourself, **comment on the issue** and ask a maintainer to assign it to you.

Once the issue is yours, you can start working on it.

## Contributing a sample

### New sample

- All samples live under the **`samples/`** directory.
- Create a **new folder** for your sample (e.g. `samples/<sample-name>/<language-or-variant>/`).
- Put **everything** for that sample inside that folder: a **README** that explains how to use it, the code, config files, and any sample data (e.g. `jobs.json.sample`). Do not scatter files at the repo root.

### Changing an existing sample

- Follow the **same structure and conventions** as that sample (e.g. `samples/bulk-generate/typescript`: README, `src/`, config files, `.sample` files).
- Match the style and layout of the existing code so the repo stays consistent.

## Submitting changes

1. **Fork** the repository on GitHub.
2. **Clone your fork** and create a branch (e.g. `feature/my-sample`, `fix/bulk-generate-typo`, or `docs/...`).
3. **Make your changes.** If you touch an existing sample, ensure it still runs.
4. **Push** the branch to your fork and **open a Pull Request** against [TheFuseLabs/rezzy-samples](https://github.com/TheFuseLabs/rezzy-samples).
5. **Review:** Maintainers will review and may request changes.
6. **Merge:** Once approved, we’ll merge your PR and your changes will be in the repo.

### What we look for in a PR

- A clear description of what changed and why.
- One logical change per PR.
- For new or updated samples: a README that explains how to run and use the sample.
