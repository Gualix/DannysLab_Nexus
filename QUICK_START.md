# 🚀 GUÍA RÁPIDA DE EJECUCIÓN

## ✨ Forma Más Rápida (3 pasos)

### Paso 1: Obtener Credenciales Supabase

1. Ir a https://supabase.com
2. Crear proyecto (free tier está bien)
3. Ir a **Settings → API**
4. Copiar:
   - **Project URL** → `SUPABASE_URL` y `VITE_SUPABASE_URL`
   - **Anon key** → `SUPABASE_PUBLISHABLE_KEY` y `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

### Paso 2: Crear `.env.local`

```bash
cd /Users/gurena/Documents/GitHub/DannysLab_Nexus

# Copiar template
cp .env.example .env.local

# Editar con tus valores
nano .env.local
```

Ejemplo `.env.local` completado:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
```

### Paso 3: Ejecutar Script Automatizado

```bash
./setup-and-run.sh
```

Este script:
- ✅ Verifica Node.js, npm, Docker
- ✅ Valida variables de entorno
- ✅ Instala dependencias (`npm install`)
- ✅ Compila (`npm run build`)
- ✅ Construye imagen Docker
- ✅ Muestra opciones de ejecución

---

## 🐳 Después del Setup: Ejecutar la App

### Opción A: Docker Compose (Recomendado)

```bash
docker-compose up

# En otra terminal, verificar:
curl http://localhost:3000/api/health
```

Acceder a: **http://localhost:3000**

Detener:
```bash
docker-compose down
```

### Opción B: Docker Manual

```bash
# Build (si no lo hizo el script)
docker build -t danny-lab:latest .

# Run
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=your-key \
  -e SUPABASE_URL=https://your-project.supabase.co \
  -e SUPABASE_PUBLISHABLE_KEY=your-key \
  -e SUPABASE_SERVICE_ROLE_KEY=your-service-key \
  danny-lab:latest
```

### Opción C: Desarrollo Local (Sin Docker)

```bash
npm run dev

# Acceder a: http://localhost:5173
```

---

## ✅ Verificar que Funciona

```bash
# Health check
curl http://localhost:3000/api/health

# Respuesta esperada:
# {"status":"healthy","timestamp":"2026-05-12T...","uptime":123.45}
```

---

## 🔧 Troubleshooting

### "npm: command not found"
```bash
# Instalar Node.js desde https://nodejs.org/
# Descargar versión 22+ LTS
```

### "Docker: command not found"
```bash
# Instalar Docker desde https://www.docker.com/
# Reiniciar terminal después de instalar
```

### "Port 3000 already in use"
```bash
# Opción 1: Cambiar puerto en docker-compose.yml
nano docker-compose.yml
# Cambiar: - "3001:3000"

# Opción 2: Matar proceso
lsof -ti:3000 | xargs kill -9
```

### "Missing environment variables"
```bash
# Verificar que .env.local existe
cat .env.local

# Si está vacío, editar:
nano .env.local
```

### Build falla con errores de Supabase
```bash
# Asegúrate de que .env.local tiene todas las variables
grep "SUPABASE" .env.local

# Si falta algo:
nano .env.local  # Completar
```

---

## 📊 Lo que Sucede en Cada Etapa

| Paso | Comando | Qué Hace | Tiempo |
|------|---------|----------|--------|
| 1 | `npm install` | Descarga 100+ paquetes | 2-5 min |
| 2 | `npm run build` | Compila TypeScript + React | 1-3 min |
| 3 | `docker build` | Crea imagen finalmente | 2-5 min |
| 4 | `docker-compose up` | Inicia contenedor | 5-10 seg |
| Total | - | **Todo** | **5-15 min** |

---

## 🎯 Setup Completo (Paso a Paso - 15 min)

```bash
# 1. Abrir terminal
cd /Users/gurena/Documents/GitHub/DannysLab_Nexus

# 2. Copiar env
cp .env.example .env.local

# 3. Editar (usa tu editor favorito)
nano .env.local
# → Pegar credenciales de Supabase

# 4. Ejecutar setup
./setup-and-run.sh
# → Verifica todo y compila

# 5. Ejecutar app
docker-compose up

# 6. En otra terminal, verificar
curl http://localhost:3000/api/health

# 7. Abrir en navegador
# http://localhost:3000
```

---

## 💡 Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f app

# Detener contenedor
docker-compose down

# Reconstruir imagen
docker-compose up --build

# Ejecutar en background
docker-compose up -d

# Shell dentro del contenedor
docker exec -it <container_id> sh

# Ver imágenes
docker images | grep danny

# Ver contenedores
docker ps -a
```

---

## 🎓 Estructura

**DannysLab_Nexus** es una aplicación web con:
- **Frontend**: React + TypeScript (TanStack Router)
- **Backend**: Node.js SSR con TanStack Start
- **Database**: Supabase (PostgreSQL) 
- **UI**: Shadcn/UI + Tailwind CSS

La aplicación permite:
1. 📅 Reservar espacio de laboratorio
2. 👨‍🎓 Registrarse en talleres STEM
3. 🖨️ Solicitar servicios de fabricación
4. 🎓 Coordinación de visitas institucionales
5. 👨‍💼 Panel admin para gestión

---

## 📞 ¿Problemas?

1. **Verificar todo esta bien:**
   ```bash
   ./validate.sh
   ```

2. **Ver documentación completa:**
   - [SETUP.md](./SETUP.md) - Guía detallada
   - [ANALYSIS.md](./ANALYSIS.md) - Análisis técnico
   - [TROUBLESHOOTING](./SETUP.md#-troubleshooting) - Problemas comunes

3. **Ver logs:**
   ```bash
   docker-compose logs -f
   ```

---

**¡Listo! Ahora solo falta que ejecutes `./setup-and-run.sh` 🚀**
