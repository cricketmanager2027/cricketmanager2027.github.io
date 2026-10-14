# Cricket Manager 27 — Python Desktop Edition

## What this package does

This wraps the uploaded Cricket Manager 27 game in a native desktop window using
Python and pywebview. The original HTML game is included as `index.html` without
rewriting its game logic. This is the safest way to preserve the existing teams,
ratings, career modes, match simulation, and UI functionality during the desktop
conversion.

**Important:** this is a Python desktop wrapper around the existing HTML/JavaScript
game, not a full rewrite of the game engine in Python. A full rewrite would require
porting and testing the large game logic separately and could lose existing features.

## Run on Windows

1. Install Python 3.10 or newer.
2. Extract this folder somewhere writable.
3. Double-click `run_game.bat`, or run these commands in this folder:

   ```powershell
   python -m pip install -r requirements.txt
   python cricket_manager_27.py
   ```

`pywebview` uses the system WebView runtime on Windows (normally Microsoft Edge
WebView2). If the desktop window fails to open, install the Microsoft Edge
WebView2 Runtime and try again.

## Build a Windows executable

Double-click `build_exe.bat`. When it finishes, look in `dist`. Keep the generated
application's supporting files together as produced by PyInstaller. The build
requires an internet connection to install Python packages; the game itself is
loaded locally.

## Saves and browser storage

The game source is preserved, but save persistence depends on how the original
HTML app stores its data. Embedded WebView storage can behave differently from
Chrome/Edge. Test an existing career and a newly saved career after launching.
If saves need migration or a stable custom save location, that should be handled
as a separate compatibility pass rather than silently changing the original data
logic.

## Included files

- `index.html` — original uploaded game
- `cricket_manager_27.py` — Python desktop launcher
- `requirements.txt` — Python dependency
- `run_game.bat` — launch helper
- `build_exe.bat` — optional Windows executable build helper
