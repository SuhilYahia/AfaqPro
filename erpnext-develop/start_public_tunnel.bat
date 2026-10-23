@echo off
title AfaqPro Cloudflare Tunnel
echo ========================================================
echo   Starting Public Tunnel for AfaqPro (ERPNext)...
echo ========================================================
"C:\Users\User\Downloads\cloudflared-windows-amd64.exe" tunnel --url http://localhost:8080 --http-host-header localhost
pause
