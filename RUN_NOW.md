# 🎬 EJECUTAR AHORA - 3 Pasos

## 📋 Lo Que Necesitas

- ✅ **Node.js 22+** - Descargar desde https://nodejs.org/
- ✅ **Docker** - Descargar desde https://www.docker.com/
- ✅ **Credenciales Supabase** - Crear en https://supabase.com (gratis)

---

## 🚀 PASO 1: Preparar Supabase (5 min)

### 1a. Crear Proyecto

1. Ir a https://supabase.com
2. Click en **"New Project"**
3. Seleccionar región (e.g., São Paulo)
4. Esperar a que se cree (2-3 min)

### 1b. Obtener Credenciales

1. Una vez creado, ir a **Settings → API**
2. Copiar estos 3 valores:

```
📋 VITE_SUPABASE_URL = Project URL (https://xxxxxxxxxxxx.supabase.co)
📋 VITE_SUPABASE_PUBLISHABLE_KEY = Anon key (eyJhbGc...)
📋 SUPABASE_SERVICE_ROLE_KEY = Service Role Key (eyJhbGc...)
```

Guardar estos valores en un archivo de texto temporal.

---

## 🐳 PASO 2: Ejecutar Script Automatizado (5 min)

Abre terminal y copia/pega esto:

```bash
cd /Users/gurena/Documents/GitHub/DannysLab_Nexus
cp .env.example .env.local
nano .env.local
```

En el editor que se abre (nano):
1. Busca `VITE_SUPABASE_URL`
2. Reemplaza el valor con tu Project URL
3. Haz lo mismo para `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Haz lo mismo para `SUPABASE_SERVICE_ROLE_KEY`
5. Guarda: `CTRL+O` → `ENTER` → `CTRL+X`

Luego ejecuta:

```bash
./setup-and-run.sh
```

Este script automáticamente:
- ✅ Verifica Node.js y Docker
- ✅ Valida variables de entorno
- ✅ Instala dependencias (`npm install`)
- ✅ Compila (`npm run build`)
- ✅ Construye imagen Docker

**Tiempo**: ~5-10 minutos

---

## ▶️ PASO 3: Ejecutar Aplicación (3 min)

Una vez que termina el script, ejecuta:

```bash
docker-compose up
```

Espera a ver:
```
app  | listening on port 3000
```

---

## ✅ Verificar Que Funciona

Abre otra terminal:

```bash
# Verificar health
curl http://localhost:3000/api/health

# Esperar respuesta:
# {"status":"healthy","timestamp":"...","uptime":...}
```

---

## 🎉 ¡LISTO!

Acceder a la app en tu navegador:

👉 **http://localhost:3000**

---

## 📊 Qué Ves

| URL | Descripción |
|-----|-------------|
| http://localhost:3000 | Home page con servicios |
| http://localhost:3000/login | Login/signup |
| http://localhost:3000/admin | Admin dashboard |
| http://localhost:3000/request/lab-space | Reservar laboratorio |
| http://localhost:3000/api/health | Health check |

---

## 🛑 Detener

En la terminal donde corre `docker-compose up`:

```
CTRL+C
```

O en otra terminal:

```bash
docker-compose down
```

---

## 🔁 Volver a Ejecutar

La próxima vez, solo necesitas:

```bash
cd /Users/gurena/Documents/GitHub/DannysLab_Nexus
docker-compose up
```

---

## ⚠️ Problemas Comunes

### "Node.js not found"
- Descargar desde https://nodejs.org/
- Reiniciar terminal después de instalar

### "Docker: command not found"
- Descargar desde https://www.docker.com/
- Reiniciar terminal después de instalar

### "Port 3000 already in use"
```bash
# Opción 1: Cambiar puerto
nano docker-compose.yml
# Cambiar "3000:3000" a "3001:3000"

# Opción 2: Matar proceso
lsof -ti:3000 | xargs kill -9
```

### "Missing environment variables"
- Editar .env.local de nuevo
- Verificar que todos los values están llenos
- Restart: `docker-compose down && docker-compose up`

---

## 💡 Tips

- **Ver logs**: `docker-compose logs -f`
- **Ejecutar en background**: `docker-compose up -d`
- **Recompilación automática**: Editar archivos en `src/` y guardar
- **Limpiar todo**: `docker-compose down && docker rmi danny-lab:latest`

---

## 🔗 Documentación

Si necesitas más detalles:
- [QUICK_START.md](./QUICK_START.md) - Guía rápida
- [SETUP.md](./SETUP.md) - Guía completa
- [ANALYSIS.md](./ANALYSIS.md) - Análisis técnico

---

**Total de tiempo: ~15-20 minutos desde cero**

¿Listos? ✅ Comienza en PASO 1 arriba 👆
