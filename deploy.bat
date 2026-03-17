@echo off
echo ========================================
echo   Gimnasio FitLife - Deploy Script
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git no esta instalado
    echo Descarga Git desde: https://git-scm.com
    pause
    exit /b 1
)

echo [1/5] Verificando Node.js...
node --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado
    echo Descarga Node desde: https://nodejs.org
    pause
    exit /b 1
)
echo     Node.js encontrado

echo.
echo [2/5] Instalando dependencias...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Error instalando dependencias
    pause
    exit /b 1
)
echo     Dependencias instaladas

echo.
echo [3/5] Inicializando Git...
cd ..
if not exist ".git" (
    git init
    git add .
    git commit -m "Initial commit - Gimnasio FitLife"
) else (
    echo     Git ya estaba inicializado
)

echo.
echo [4/5] Subiendo a GitHub...
echo.
echo     Por favor, crea un repositorio en GitHub y pega la URL
echo     ( формат: https://github.com/usuario/repositorio.git )
echo.
set /p GITHUB_URL="URL del repositorio: "

if not "%GITHUB_URL%"=="" (
    git remote add origin %GITHUB_URL%
    git branch -M main
    git push -u origin main
    echo.
    echo     Codigo subido a GitHub!
) else (
    echo     Saltando paso de GitHub
)

echo.
echo [5/5] Listo!
echo.
echo ========================================
echo   Pasos para desplegar:
echo ========================================
echo.
echo   1. Ve a https://netlify.com
echo   2. Crea una cuenta (gratis)
echo   3. Click "Add new site" - "Import an existing project"
echo   4. Selecciona este repositorio de GitHub
echo   5. Configura:
echo      - Build command: (vacio)
echo      - Publish directory: ./
echo   6. Click "Deploy"
echo.
echo   Tu sitio estara vivo en minutos!
echo.
pause
