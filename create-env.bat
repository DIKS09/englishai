@echo off
chcp 65001 > nul
echo OPENAI_API_KEY=your_key_here> .env
echo PORT=5000>> .env
echo .env file created!
pause

