@echo off
:: set path to Conceal Assistant in next line
cd "C:/conceal-assistant"
:ccx
CLS
Echo ===================================
Echo          Conceal Assistant
Echo ===================================
Echo Press 'Ctrl + c' to quit
Echo,
nodemon server.js
PAUSE
GOTO ccx
