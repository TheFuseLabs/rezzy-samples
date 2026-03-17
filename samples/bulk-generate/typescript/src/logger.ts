const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";

export const logger = {
  info(message: string): void {
    console.log(`${CYAN}ℹ${RESET} ${message}`);
  },
  success(message: string): void {
    console.log(`${GREEN}✓${RESET} ${message}`);
  },
  warn(message: string): void {
    console.warn(`${YELLOW}⚠${RESET} ${message}`);
  },
  error(message: string): void {
    console.error(`${RED}✗${RESET} ${message}`);
  },
  dim(message: string): void {
    console.log(`${DIM}${message}${RESET}`);
  },
};
