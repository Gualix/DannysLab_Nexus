# 🧪 DannysLab_Nexus - Setup & Deployment Guide

## 📖 Descripción General

**DannysLab_Nexus** es un portal de servicios para reservas y consultas en un laboratorio mákerspace. La aplicación permite:

- **🏢 Reserva de Espacio de Laboratorio** - Booking para eventos y visitas
- **👨‍🎓 Talleres STEM** - Registro para talleres educativos
- **🖨️ Servicios de Fabricación** - Impresión 3D y corte láser
- **🎓 Visitas Institucionales** - Portal para escuelas y universidades
- **👨‍💼 Panel Admin** - Gestión de solicitudes y estados

### Stack de Tecnología

- **Frontend**: React 19, TypeScript, TanStack Router/Query
- **Backend**: TanStack Start, Node.js (SSR)
- **UI**: Shadcn/UI + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Hosting**: Docker / Cloudflare Workers

---

## 🚀 Quick Start - Desarrollo Local

### Prerequisitos

- **Node.js 22+** (verificar con `node --version`)
- **npm 10+** (verificar con `npm --version`)
- **Supabase Project** (free tier suficiente)
- **Git**

### 1. Clonar Repositorio

```bash
git clone https://github.com/Gualix/DannysLab_Nexus.git
cd DannysLab_Nexus
```

### 2. Configurar Variables de Entorno

```bash
# Copiar template
cp .env.example .env.local

# Editar con tus variables Supabase
nano .env.local  # o vim / tu editor favorito
```

Variables requeridas:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Acceder a: http://localhost:5173

---

## 🐳 Ejecución en Docker

### Opción 1: Docker Compose (Recomendado para desarrollo)

```bash
# Crear archivo .env.local con tus variables
cp .env.example .env.local
# Editar .env.local...

# Levantar contenedor
docker-compose up

# En otra terminal, ver logs
docker-compose logs -f

# Detener
docker-compose down
```

La aplicación estará disponible en: http://localhost:3000

### Opción 2: Docker Manual (Producción)

#### Build

```bash
docker build -t danny-lab:latest .
```

#### Run

```bash
docker run --rm \
  -p 3000:3000 \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=your-key \
  -e SUPABASE_URL=https://your-project.supabase.co \
  -e SUPABASE_PUBLISHABLE_KEY=your-key \
  -e SUPABASE_SERVICE_ROLE_KEY=your-service-key \
  danny-lab:latest
```

### Verificar Salud

```bash
# Health check endpoint
curl http://localhost:3000/api/health
# Respuesta esperada:
# {"status":"healthy","timestamp":"2026-05-12T...","uptime":123.456}
```

---

## 📊 Setup Supabase

### 1. Crear Proyecto

1. Ir a [supabase.com](https://supabase.com)
2. "New Project" → Seleccionar organización/región
3. Esperar 2-3 minutos a que se cree

### 2. Configurar Tablas

Ejecutar migraciones (en Supabase SQL Editor):

```sql
-- Crear tabla de solicitudes de servicio
CREATE TABLE service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT NOT NULL CHECK (service_type IN ('lab_space', 'workshop', 'fabrication', 'institutional')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rescheduled', 'rejected')),
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT,
  affiliation TEXT NOT NULL CHECK (affiliation IN ('akamai', 'external')),
  akamai_pillars TEXT[],
  requested_date DATE NOT NULL,
  safety_agreed BOOLEAN NOT NULL,
  purpose TEXT,
  duration_minutes INTEGER,
  attendees_count INTEGER,
  external_attendees INTEGER DEFAULT 0,
  waiver_agreed BOOLEAN DEFAULT FALSE,
  workshop_id UUID,
  target_age_group TEXT,
  fabrication_description TEXT,
  fabrication_quantity INTEGER,
  file_url TEXT,
  institution_name TEXT,
  institution_type TEXT CHECK (institution_type IN ('school', 'university')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de roles de usuario
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Crear índices para performance
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_requested_date ON service_requests(requested_date);
CREATE INDEX idx_service_requests_affiliation ON service_requests(affiliation);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- Configurar Row Level Security (RLS)
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Política: Ciencia pública puede solo ver/crear solicitudes
CREATE POLICY "Anyone can read public data" ON service_requests
  FOR SELECT USING (true);

CREATE POLICY "Staff can update status" ON service_requests
  FOR UPDATE USING (
    exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'staff'))
  );

-- Política: Solo admin puede ver roles
CREATE POLICY "Only admins can read roles" ON user_roles
  FOR SELECT USING (
    exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
  );
```

### 3. Crear Primer Admin

1. Ir a **Authentication** → **Users**
2. Crear nuevo usuario o usar existente
3. Ir a **SQL Editor** y ejecutar:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin');
```

---

## 📝 Estructura del Proyecto

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   └── *.tsx           # Feature components
├── hooks/              # Custom React hooks
├── integrations/
│   └── supabase/       # Supabase client setup
├── lib/
│   ├── env.ts          # Environment validation
│   ├── schemas.ts      # Zod validation schemas
│   ├── utils.ts        # Utility functions
│   └── date.ts         # Date helpers
├── routes/             # TanStack Router pages
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Home page
│   └── api/            # API routes
├── server.ts           # SSR entry point
└── router.tsx          # Router configuration

wrangler.jsonc         # Cloudflare Workers config
vite.config.ts         # Vite build config
```

---

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Start dev server (http://localhost:5173)

# Build & Producción
npm run build            # Build para producción
npm run preview          # Preview build localmente
npm start                # Ejecutar build en producción
npm run start:preview    # Build + Run (útil para testing)

# Calidad de Código
npm run lint             # Ejecutar ESLint
npm run format           # Formatear con Prettier

# Docker
docker-compose up        # Desarrollo en Docker
docker-compose down      # Parar contenedor
docker build -t danny-lab:latest .  # Build image
docker run -p 3000:3000 danny-lab:latest  # Run image
```

---

## 🔒 Seguridad

### Client vs Server

- **Client-side** (`*.tsx`, `*.ts`):
  - Pueden ver `VITE_*` variables (públicas)
  - NO pueden acceder a `SUPABASE_SERVICE_ROLE_KEY`

- **Server-side** (`.server.ts`, rutas API):
  - Tienen acceso a todas las variables
  - Usan `SUPABASE_SERVICE_ROLE_KEY` para operaciones administrativas
  - Los datos se validan en `@/lib/schemas.ts`

### Variables de Entorno

```
✅ Seguro exponer (public):
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

❌ NUNCA exponer (secreto):
- SUPABASE_SERVICE_ROLE_KEY
- DATABASE_PASSWORD (si aplica)
```

---

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"

```bash
# Verificar archivo .env.local existe
ls -la .env.local

# Verificar variables están presentes
cat .env.local | grep SUPABASE
```

### Error: "Port 3000 already in use"

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Cambiar de 3000 a 3001

# O matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9
```

### Build error: "Module not found"

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Contenedor no inicia

```bash
# Ver logs completos
docker-compose logs --tail=100

# Verificar variables de entorno
docker-compose config
```

---

## 📈 Monitoreo en Producción

### Health Check

```bash
curl http://your-domain.com/api/health
```

### Logs

El contenedor escribe logs a stdout:
```bash
docker logs container-id
# o con Docker Compose
docker-compose logs -f app
```

### Métricas

Register health check en Kubernetes/Docker:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

---

## 📚 Documentación Adicional

- [Análisis de Código](./ANALYSIS.md) - Puntos de mejora identificados
- [Supabase Docs](https://supabase.com/docs)
- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [Shadcn UI](https://ui.shadcn.com)

---

## 🤝 Contribuir

1. Hacer fork del proyecto
2. Crear rama para feature (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a rama (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

---

## 📄 Licencia

Ver [LICENSE](./LICENSE) file.

---

## ✨ Últimas Mejoras

- ✅ Dockerfile para producción (multi-stage)
- ✅ docker-compose.yml para desarrollo
- ✅ Validación centralizada de env variables
- ✅ Mejor error handling en rutas
- ✅ Endpoint `/api/health` para monitores
- ✅ Mejora de useAuth hook (sin setTimeout)
- ✅ Logging estructurado en API
- ✅ Scripts de producción en package.json

---

**Última actualización**: 12 de mayo de 2026
**Versión**: 1.0.0
**Estado**: ✅ Listo para producción (con las mejoras aplicadas)
