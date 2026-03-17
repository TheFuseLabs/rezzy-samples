import sys

RESET = "\x1b[0m"
DIM = "\x1b[2m"
GREEN = "\x1b[32m"
YELLOW = "\x1b[33m"
RED = "\x1b[31m"
CYAN = "\x1b[36m"


class _Logger:
    @staticmethod
    def info(message: str) -> None:
        print(f"{CYAN}ℹ{RESET} {message}")

    @staticmethod
    def success(message: str) -> None:
        print(f"{GREEN}✓{RESET} {message}")

    @staticmethod
    def warn(message: str) -> None:
        print(f"{YELLOW}⚠{RESET} {message}", file=sys.stderr)

    @staticmethod
    def error(message: str) -> None:
        print(f"{RED}✗{RESET} {message}", file=sys.stderr)

    @staticmethod
    def dim(message: str) -> None:
        print(f"{DIM}{message}{RESET}")


logger = _Logger()
