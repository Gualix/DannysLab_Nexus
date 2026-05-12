#!/bin/bash

# 🚀 DannysLab_Nexus - Setup & Run Script
# Este script configura y ejecuta la aplicación en Docker

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   DannysLab_Nexus - Setup & Run                               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Check prerequisites
echo -e "${YELLOW}1️⃣ Verificando requisitos...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js no está instalado${NC}"
  echo "   Descargar desde: https://nodejs.org/"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
  echo -e "${RED}❌ npm no está instalado${NC}"
  exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

if ! command -v docker &> /dev/null; then
  echo -e "${RED}❌ Docker no está instalado${NC}"
  echo "   Descargar desde: https://www.docker.com/"
  exit 1
fi
echo -e "${GREEN}✓ Docker instalado${NC}"

echo ""
echo -e "${YELLOW}2️⃣ Configurando variables de entorno...${NC}"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  if [ ! -f ".env.example" ]; then
    echo -e "${RED}❌ .env.example no encuentra (debes estar en la carpeta DannysLab_Nexus)${NC}"
    exit 1
  fi
  
  echo "📋 Creando .env.local desde .env.example..."
  cp .env.example .env.local
  
  echo -e "${YELLOW}⚠️ IMPORTANTE: Edita .env.local con tus credenciales de Supabase${NC}"
  echo ""
  echo "   Necesitas agregar:"
  echo "   - VITE_SUPABASE_URL"
  echo "   - VITE_SUPABASE_PUBLISHABLE_KEY"
  echo "   - SUPABASE_URL"
  echo "   - SUPABASE_PUBLISHABLE_KEY"
  echo "   - SUPABASE_SERVICE_ROLE_KEY"
  echo ""
  echo -e "${BLUE}   Abre .env.local y completa los valores:${NC}"
  echo "   $ nano .env.local  (o vim, o tu editor)"
  echo ""
  read -p "   Presiona ENTER cuando hayas completado .env.local..."
fi

echo -e "${GREEN}✓ .env.local configurado${NC}"

# Verify env vars
if ! grep -q "VITE_SUPABASE_URL" .env.local; then
  echo -e "${RED}❌ VITE_SUPABASE_URL no encontrado en .env.local${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Variables de entorno verificadas${NC}"

echo ""
echo -e "${YELLOW}3️⃣ Instalando dependencias...${NC}"
npm install || { echo -e "${RED}❌ npm install falló${NC}"; exit 1; }
echo -e "${GREEN}✓ Dependencias instaladas${NC}"

echo ""
echo -e "${YELLOW}4️⃣ Compilando aplicación...${NC}"
npm run build || { echo -e "${RED}❌ npm run build falló${NC}"; exit 1; }
echo -e "${GREEN}✓ Aplicación compilada${NC}"

echo ""
echo -e "${YELLOW}5️⃣ Construyendo imagen Docker...${NC}"
docker build -t danny-lab:latest . || { echo -e "${RED}❌ docker build falló${NC}"; exit 1; }
echo -e "${GREEN}✓ Imagen Docker construida${NC}"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🎉 ¡Todo listo! Opciones para ejecutar:${NC}"
echo ""
echo -e "${BLUE}OPCIÓN 1: Con docker-compose (recomendado)${NC}"
echo "  $ docker-compose up"
echo "  → Acceder a http://localhost:3000"
echo ""
echo -e "${BLUE}OPCIÓN 2: Docker manual${NC}"
echo "  $ docker run -p 3000:3000 \\\\"
echo "      -e VITE_SUPABASE_URL=... \\\\"
echo "      -e VITE_SUPABASE_PUBLISHABLE_KEY=... \\\\"
echo "      -e SUPABASE_URL=... \\\\"
echo "      -e SUPABASE_PUBLISHABLE_KEY=... \\\\"
echo "      -e SUPABASE_SERVICE_ROLE_KEY=... \\\\"
echo "      danny-lab:latest"
echo "  → Acceder a http://localhost:3000"
echo ""
echo -e "${BLUE}OPCIÓN 3: Desarrollo local${NC}"
echo "  $ npm run dev"
echo "  → Acceder a http://localhost:5173"
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "  • Verificar salud: curl http://localhost:3000/api/health"
echo "  • Ver logs: docker-compose logs -f"
echo "  • Detener: docker-compose down"
echo ""
