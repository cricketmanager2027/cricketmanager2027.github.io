"""
Cricket Manager 27 — Python desktop launcher

The existing game is kept intact in index.html and displayed in a native desktop
window. This preserves the original JavaScript game logic, teams, ratings, career
modes, and match simulation instead of attempting a risky incomplete rewrite.
"""
from pathlib import Path
import sys
import webbrowser

APP_DIR = Path(__file__).resolve().parent
GAME_FILE = APP_DIR / "index.html"


def main():
    if not GAME_FILE.exists():
        raise FileNotFoundError(
            f"Could not find {GAME_FILE.name}. Keep index.html beside this script."
        )

    try:
        import webview
    except ImportError:
        print("pywebview is not installed.")
        print("Install dependencies with: python -m pip install -r requirements.txt")
        input("Press Enter to close...")
        return 1

    # Use a file URI to load the bundled game locally. No web server or internet
    # connection is needed for the game source itself.
    webview.create_window(
        "Cricket Manager 27",
        GAME_FILE.as_uri(),
        width=1440,
        height=900,
        min_size=(980, 650),
        text_select=False,
    )
    webview.start()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
