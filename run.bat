@echo off
echo =======================================================
echo     Starting Student Management System
echo =======================================================

IF NOT EXIST "apache-maven-3.9.6" (
    echo [INFO] Maven not found. Downloading Maven...
    powershell -Command "Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip' -OutFile 'maven.zip'"
    echo [INFO] Extracting Maven...
    powershell -Command "Expand-Archive -Path 'maven.zip' -DestinationPath '.' -Force"
    del maven.zip
)

echo [INFO] Starting Spring Boot Server...
echo [INFO] The server will take a few moments to start.
echo [INFO] Please leave this window open. 
echo [INFO] Once started, access the application at http://localhost:8080
echo.

.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
pause
