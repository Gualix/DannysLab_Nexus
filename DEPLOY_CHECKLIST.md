# 🚀 Checklist de Deployment a Producción

## ✅ Pre-Deployment

### Configuración
- [ ] Variables de entorno configuradas en `.env.local`
  - [ ] `VITE_SUPABASE_URL` válido
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` válido
  - [ ] `SUPABASE_URL` válido
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` guardado de forma segura
- [ ] Node.js 22+ instalado (`node --version`)
- [ ] npm 10+ instalado (`npm --version`)
- [ ] Git configurado

### Dependencias
- [ ] `npm install` completado
- [ ] Sin vulnerabilities críticas (`npm audit`)
- [ ] Dependencias actualizadas

### Database
- [ ] Crear proyecto Supabase
- [ ] Ejecutar migraciones SQL (ver SETUP.md)
- [ ] Crear primer usuario admin
- [ ] Verificar tablas creadas
- [ ] RLS policies activas

### Testing Local
- [ ] `npm run lint` sin errores
- [ ] `npm run build` exitoso
- [ ] `npm run preview` funciona
- [ ] Rutas principales accesibles
- [ ] Login funciona
- [ ] Admin dashboard accesible
- [ ] API `/api/health` responde
- [ ] Formularios validan correctamente

---

## 🐳 Docker Deployment

### Build
- [ ] `docker build -t danny-lab:v1.0 .` exitoso
- [ ] Image size razonable (~170MB)
- [ ] Sin warnings en build

### Testing Container
```bash
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=... \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=... \
  -e SUPABASE_URL=... \
  -e SUPABASE_PUBLISHABLE_KEY=... \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  danny-lab:v1.0
```
- [ ] App arranca sin errores
- [ ] Logs están limpios
- [ ] Health endpoint responde: `curl http://localhost:3000/api/health`
- [ ] Rutas principales accesibles
- [ ] Base de datos conecta

### Registry
- [ ] Docker image tagged (`danny-lab:v1.0`)
- [ ] Pushed a registry (Docker Hub, ECR, etc.)
- [ ] Verificar pull funciona

---

## ☸️ Kubernetes (Opcional)

Si desplegando en K8s:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: danny-lab
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: app
        image: danny-lab:v1.0
        ports:
        - containerPort: 3000
        env:
        - name: VITE_SUPABASE_URL
          valueFrom:
            secretKeyRef:
              name: danny-lab-secrets
              key: supabase-url
        - name: SUPABASE_SERVICE_ROLE_KEY
          valueFrom:
            secretKeyRef:
              name: danny-lab-secrets
              key: service-role-key
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 40
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
```

- [ ] Secrets creados en K8s
- [ ] Deployment YAML validado
- [ ] Resources requests/limits configurados
- [ ] Health checks configurados
- [ ] Ingress/LoadBalancer configurado

---

## 🔐 Seguridad

### Antes de Deploy
- [ ] Todas las variables SECRETAS en `.env` (no en `.env.example`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` nunca en código fuente
- [ ] `.env` añadido a `.gitignore` ✅ (ya hecho)
- [ ] No hay secrets en Git history
- [ ] Node.js version specified en package.json ✅ (ya hecho)
- [ ] Docker runs como usuario no-root ✅ (ya hecho)

### En Servidor
- [ ] HTTPS configurado (SSL/TLS)
- [ ] CORS restrictivo (una sola origin)
- [ ] Rate limiting activo
- [ ] WAF habilitado (si aplica)
- [ ] Logs enviados a servicio centralizado
- [ ] Backups automáticos de base de datos

---

## 📊 Monitoreo Post-Deployment

### Health & Uptime
- [ ] Ping a `/api/health` cada 30s
  ```bash
  while true; do
    curl -s http://localhost:3000/api/health
    sleep 30
  done
  ```
- [ ] Alertas si status ≠ "healthy"
- [ ] Dashboard de uptime visible

### Logs
- [ ] Stdout/stderr redirigido a logger
- [ ] Logs indexados (ELK, Splunk, etc.)
- [ ] Alertas en errores críticos
- [ ] Retención de logs mínimo 30 días

### Performance
- [ ] Response time promedio < 200ms
- [ ] P99 latency monitoreada
- [ ] Error rate < 0.1%
- [ ] CPU/Memory usage normal

### Base de Datos
- [ ] Conexiones Supabase activas
- [ ] Query performance monitoreada
- [ ] Backups verificados
- [ ] Plan de recuperación testeado

---

## 💬 Post-Deployment Validation

### Testing
```bash
# Health check
curl https://your-domain.com/api/health

# Homepage
curl https://your-domain.com/

# Login flow
# (manual en navegador)

# Admin dashboard
# (con credenciales de prueba)

# Form submission
curl -X POST https://your-domain.com/api/public/request-submit \
  -H "Content-Type: application/json" \
  -d '{...}'
```

- [ ] Todos los endpoints responden
- [ ] HTML se sirve correctamente
- [ ] CSS/JS se cargan
- [ ] Imágenes se cargan
- [ ] Base de datos conecta

### User Testing
- [ ] Email de contacto funciona
- [ ] Notificaciones se envían
- [ ] Admin dashboard funciona
- [ ] Búsqueda/filtros funcionan
- [ ] Persistencia de datos (refrescar página mantiene state)

---

## 📋 Documentación a Completar

- [ ] Runbook de incidentes creado
- [ ] Procedimiento de rollback documentado
- [ ] Escalation contacts definidos
- [ ] Status page actualizada
- [ ] Changelog actualizado
- [ ] Release notes publicadas

---

## 🔄 Rollback Plan

Si algo va mal:

```bash
# Opción 1: Volver a versión anterior
docker pull danny-lab:v0.9
docker tag danny-lab:v0.9 danny-lab:latest
docker restart container

# Opción 2: Revert de database (si aplica)
# Usar backup de Supabase

# Opción 3: Detener servicio
docker stop container
docker remove container
```

- [ ] Versión anterior taggeada y preservada
- [ ] Backups de database accesibles
- [ ] Plan de comunicación a usuarios

---

## 📞 Escalation

Si hay problemas críticos:

1. **Ops Team**: Verificar logs del container
2. **Dev Team**: Revisar cambios en deploy
3. **Database Team**: Revisar Supabase status
4. **DevOps**: Revisar infrastructure

Contacts:
- Ops Lead: `ops@company.com`
- Dev Lead: `dev-lead@company.com`
- On-call: [en rotation]

---

## ✨ Post-Deployment Tasks

Una vez que todo está funcionando:

- [ ] Comunicar a stakeholders
- [ ] Crear incident post-mortem (si hubo issues)
- [ ] Actualizar documentación
- [ ] Plan próximas mejoras
- [ ] Celebrar! 🎉

---

## 📝 Notas

- [x] Verificar que `.env.example` no tiene secrets (✅)
- [x] `.gitignore` contiene `.env*` (✅)
- [x] Health endpoint existe (✅)
- [x] Docker image optimizada (✅)
- [x] Documentación SETUP.md completa (✅)

**Última actualización**: 12 de mayo de 2026
