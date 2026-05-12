# DannysLab_Nexus
The Danny’s Lab Nexus serves as the definitive intersection of operational precision and creative inspiration, transforming complex logistics into a seamless digital gateway that elevates service delivery and democratizes STEM innovation for the entire community, both within and beyond Akamai.
## 🚀 Quick Links
- 🎯 **[QUICK START](./QUICK_START.md)** - ¡EMPIEZA AQUÍ! (3 pasos para correr)- 📖 **[Setup & Deployment Guide](./SETUP.md)** - Instrucciones completas para desarrollo y producción
- � **[Full Documentation Index](./DOCUMENTATION.md)** - Índice completo de toda la documentación
- 📋 **[Code Analysis](./ANALYSIS.md)** - Análisis de código y puntos de mejora
- ✨ **[What's New](./IMPROVEMENTS.md)** - Resumen de mejoras implementadas
- 🚢 **[Deployment Checklist](./DEPLOY_CHECKLIST.md)** - Checklist pre-producción
- 🐳 **[Docker Setup](#docker)** - Ejecutar en contenedor

## 🌟 Features

- **Lab Space Booking** - Reserva del espacio de laboratorio con gestión de capacidad
- **STEM Workshops** - Registro para talleres educativos
- **Fabrication Services** - Solicitudes de impresión 3D y corte láser  
- **Institutional Visits** - Portal para visitas de escuelas/universidades
- **Admin Dashboard** - Gestión centralizada de solicitudes

## 🛠️ Tech Stack

- React 19 + TypeScript
- TanStack Router/Query
- Supabase (PostgreSQL + Auth)
- Tailwind CSS + Shadcn UI
- Node.js SSR (TanStack Start)

## 🚀 Getting Started

### Desarrollo Local

```bash
# Clonar repo
git clone https://github.com/Gualix/DannysLab_Nexus.git
cd DannysLab_Nexus

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con credenciales Supabase

# Iniciar dev server
npm run dev
```

Disponible en: http://localhost:5173

### 🐳 Docker

```bash
# Con docker-compose (recomendado)
docker-compose up

# Manual build & run
docker build -t danny-lab:latest .
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=your_key \
  danny-lab:latest
```

## 📝 Scripts

```bash
npm run dev          # Desarrollo local
npm run build        # Build para producción
npm run preview      # Preview del build
npm start            # Ejecutar producción
npm run lint         # ESLint check
npm run format       # Prettier format
```

## 📚 Documentation

- **[Guía Completa de Setup](./SETUP.md)** - Desarrollo, Docker, Supabase setup
- **[Análisis de Código](./ANALYSIS.md)** - Problemas identificados y soluciones aplicadas
- **[Supabase Docs](https://supabase.com/docs)**
- **[TanStack Start](https://tanstack.com/start/latest)**

## 🔒 Environment Variables

```env
# Public (VITE_)
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_PUBLISHABLE_KEY=...

# Private (server-only)
SUPABASE_URL=https://...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... # ⚠️ SECRETO

# App config
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
```

Ver [.env.example](./.env.example) para más detalles.

## 🏗️ Project Structure

```
src/
├── components/      # React components (UI + features)
├── hooks/          # Custom React hooks
├── integrations/   # Supabase, external APIs
├── lib/            # Utilities, schemas, helpers
├── routes/         # TanStack Router pages & API
└── styles.css      # Global styles
```

## 🤝 Mejoras Realizadas

✅ **Docker Support**
- Multi-stage Dockerfile optimizado
- docker-compose.yml para desarrollo
- .dockerignore configurado

✅ **Code Quality**
- Validación centralizada de env (lib/env.ts)
- Mejor error handling en rutas
- Health check endpoint (/api/health)
- useAuth hook mejorado (sin setTimeout)

✅ **Documentation**
- SETUP.md completo
- ANALYSIS.md con problemas y soluciones
- Ejemplos en .env.example
- Scripts de producción en package.json

✅ **Type Safety**
- Tipos properly defined para API requests
- Eliminación de `any` casts
- Validación con Zod

## 🐛 Troubleshooting

### "Missing environment variables"
```bash
cp .env.example .env.local
# Editar con tus credenciales Supabase
```

### "Port already in use"
```bash
# Cambiar puerto en docker-compose.yml o:
lsof -ti:3000 | xargs kill -9
```

### Build issues
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

Ver [SETUP.md](./SETUP.md) para más info.

## 📈 Monitoreo

Acceder a health check:
```bash
curl http://localhost:3000/api/health
# {"status":"healthy","timestamp":"...","uptime":123.45}
```

## 📄 License

Ver [LICENSE](./LICENSE) file.

---

**Status**: ✅ Listo para producción  
**Last Updated**: 2026-05-12  
**Version**: 1.0.0