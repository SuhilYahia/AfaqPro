@echo off
echo Starting ERPNext Docker containers...
docker compose up -d
echo ERPNext is starting! Access URL: http://localhost:8080 (or http://127.0.0.1:8080)
echo User: Administrator
echo Password: admin
pause
