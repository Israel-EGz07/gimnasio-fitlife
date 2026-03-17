#!/bin/bash

echo "========================================"
echo "  Gimnasio FitLife - Deploy Script"
echo "========================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "[ERROR] Git no está instalado"
    echo "Descarga Git desde: https://git-scm.com"
    exit 1
fi

echo "[1/5] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js no está instalado"
    echo "Descarga Node desde: https://nodejs.org"
    exit 1
fi
echo "     Node.js encontrado: $(node --version)"

echo ""
echo "[2/5] Instalando dependencias..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Error instalando dependencias"
    exit 1
fi
echo "     Dependencias instaladas"

echo ""
echo "[3/5] Inicializando Git..."
cd ..
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial commit - Gimnasio FitLife"
else
    echo "     Git ya estaba inicializado"
fi

echo ""
echo "[4/5] Subiendo a GitHub..."
echo ""
echo "     Por favor, crea un repositorio en GitHub"
echo "     URL format: https://github.com/usuario/repositorio.git"
echo ""
read -p "URL del repositorio (Enter para saltar): " GITHUB_URL

if [ ! -z "$GITHUB_URL" ]; then
    git remote add origin $GITHUB_URL
    git branch -M main
    git push -u origin main
    echo ""
    echo "     Código subido a GitHub!"
fi

echo ""
echo "[5/5] ¡Listo!"
echo ""
echo "========================================"
echo "  Pasos para desplegar en Netlify:"
echo "========================================"
echo ""
echo "  1. Ve a https://netlify.com"
echo "  2. Crea una cuenta (gratis)"
echo "  3. Click 'Add new site' - 'Import existing project'"
echo "  4. Selecciona este repositorio de GitHub"
echo "  5. Configura:"
echo "     - Build command: (vacío)"
echo "     - Publish directory: ./"
echo "  6. Click 'Deploy'"
echo ""
echo "  ¡Tu sitio estará vivo en minutos!"
echo ""
