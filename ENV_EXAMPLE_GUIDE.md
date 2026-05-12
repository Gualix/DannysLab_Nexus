# 📝 Ejemplo de .env.local Completado

Copia esto, reemplaza los valores con los TUYOS de Supabase, y guarda en `.env.local`

```env
# ===== SUPABASE - Ir a Settings → API en tu proyecto =====

# Este es tu Project URL (empezará con https://xxxx.supabase.co)
VITE_SUPABASE_URL=https://your-project-name.supabase.co

# Este es tu "Anon Key" (clave pública)
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzeHhweDBzYnh4eHhjeHh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjIzODkxMjAwLCJleHAiOjE5MjM1NTEyMDB9.YOUR_ACTUAL_ANON_KEY_HERE_NOT_THIS_TEXT

# Repetir Project URL
SUPABASE_URL=https://your-project-name.supabase.co

# Repetir Anon Key
SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzeHhweDBzYnh4eHhjeHh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjIzODkxMjAwLCJleHAiOjE5MjM1NTEyMDB9.YOUR_ACTUAL_ANON_KEY_HERE_NOT_THIS_TEXT

# 🔒 SECRETO: Este es tu "Service Role Key" (NUNCA compartir)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzeHhweDBzYnh4eHhjeHh4eCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2MjM4OTEyMDAsImV4cCI6MTkyMzU1MTIwMH0.YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE_NOT_THIS_TEXT

# ===== APP CONFIG (opcional, ya tiene valores por defecto) =====

NODE_ENV=development
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info
DEBUG=false
```

---

## 🔍 Dónde Encontrar Estos Valores

### En Supabase Console:

1. [Abrir Supabase](https://supabase.com)
2. Seleccionar tu proyecto
3. Ir a **Settings** (rueda engranaje en la esquina izquierda)
4. Click en **API**
5. Copiar los valores:

```
📌 Project URL
   └─ Aparece como "https://xxx.supabase.co"

📌 Anon Key (Public)
   └─ Label: "ANON_KEY" o "Anon key"
   └─ Empieza con "eyJhbGc..."

📌 Service Role Key (Secret)
   └─ Label: "SERVICE_ROLE_KEY" o "Service role key"
   └─ Empieza con "eyJhbGc..."
   ⚠️ NUNCA compartir este valor
```

---

## ✅ Ejemplo Real (Valores Ficticios)

```env
VITE_SUPABASE_URL=https://myproject.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIn0.ABCD1234
SUPABASE_URL=https://myproject.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIn0.ABCD1234
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJzZXJ2aWNlX3JvbGUifQ.EFGH5678
```

---

## 📝 Cómo Guardar

### Opción 1: Con nano (recomendado)

```bash
nano .env.local
# Pegar contenido
# CTRL+O (guardar)
# ENTER
# CTRL+X (salir)
```

### Opción 2: Con echo

```bash
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://myproject.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
# ... resto de variables
EOF
```

### Opción 3: Con tu editor favorito

- VS Code: Abrir `.env.local` y editar
- Sublime: File → Open → `.env.local`
- Vim: `vim .env.local`

---

## ⚠️ Importante

- ✅ Los valores deben ser exactamente como aparecen en Supabase
- ✅ NO agregar espacios antes/después
- ✅ NO agregar comillas alrededor de los valores
- ✅ `.env.local` está en `.gitignore` (no se commitea)
- ⚠️ NUNCA compartir `SUPABASE_SERVICE_ROLE_KEY`

---

## 🧪 Verificar

Después de guardar:

```bash
# Ver contenido
cat .env.local

# Debe mostrar todas las variables (valores parcialmente ocultos por seguridad)
```

---

**¡Listo!** Ahora ejecuta: `./setup-and-run.sh`
