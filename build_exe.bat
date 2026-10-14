@echo off
cd /d "%~dp0"
python -m pip install --upgrade pip
python -m pip install -r requirements.txt pyinstaller
python -m PyInstaller --noconfirm --clean --windowed --name "Cricket Manager 27" --add-data "index.html;." cricket_manager_27.py
echo.
echo Build complete. Check the dist folder.
pause
