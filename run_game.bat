@echo off
cd /d "%~dp0"
python cricket_manager_27.py
if errorlevel 1 pause
