# Diagnóstico del Problema del Perfil

## Problemas Identificados

### 1. ✅ Datos Profesionales Mostrándose Incorrectamente
**Causa**: La lógica `isPersonalRole` estaba mal.
```typescript
// ANTES (INCORRECTO):
const isPersonalRole = userData?.role !== "PACIENTE" && userData?.role !== "ADMIN";
// Esto considera NULL/undefined como PERSONAL

// AHORA (CORRECTO):
const isPersonalRole = userData?.role === "PERSONAL";
// Solo muestra datos profesionales si el rol es exactamente "PERSONAL"
```

**Estado**: ✅ CORREGIDO

### 2. ⚠️ Campos en Blanco - Posibles Causas

#### Causa A: Campo 'city' Faltante en la Base de Datos
**Verificar**: ¿Ejecutaste el script SQL para agregar el campo `city`?

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
```

**Cómo verificar**:
1. Ve a Supabase Dashboard > SQL Editor
2. Ejecuta:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'city';
```

Si no devuelve nada, ejecuta:
```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city) WHERE city IS NOT NULL;
```

#### Causa B: Usuario No Tiene Datos en la Base de Datos
**Verificar**: ¿El usuario actual tiene datos guardados?

1. Ve a Supabase Dashboard > SQL Editor
2. Ejecuta (reemplaza con tu email):
```sql
SELECT * FROM users WHERE email = 'tu-email@ejemplo.com';
```

**Resultados esperados**:
- Si devuelve `NULL` o está vacío → El usuario no se registró correctamente
- Si devuelve datos → Los datos están guardados

#### Causa C: Error de RLS (Row Level Security)
**Verificar**: Las políticas RLS podrían estar bloqueando la lectura

1. Ve a Supabase Dashboard > SQL Editor
2. Ejecuta (esto desactiva temporalmente RLS para testing):
```sql
-- Ver si las políticas están causando el problema
SELECT * FROM users WHERE id = auth.uid();
```

## Pasos de Diagnóstico

### Paso 1: Verificar en la Consola del Navegador
1. Abre http://localhost:9002/dashboard/perfil
2. Presiona F12 para abrir DevTools
3. Ve a la pestaña "Console"
4. Busca estos mensajes:

```
User data fetched: { ... }  ← Debería mostrar tus datos
Populating form with userData: { ... }  ← Debería mostrar los mismos datos
```

**¿Qué ver?**:
- Si `User data fetched:` es `null` o `{}` → No hay datos en la BD
- Si `User data fetched:` tiene datos pero `Populating form` no se muestra → El useEffect no se ejecuta
- Si ambos tienen datos → El problema está en otro lugar

### Paso 2: Verificar la Tabla de Usuarios en Supabase
1. Ve a Supabase Dashboard
2. Abre "Table Editor"
3. Selecciona la tabla "users"
4. Busca tu usuario por email

**¿Qué buscar?**:
- ¿Existe el registro?
- ¿Los campos `first_name`, `last_name`, etc. tienen valores?
- ¿El campo `role` es "PACIENTE"?
- ¿Existe el campo `city`?

### Paso 3: Verificar Network Tab
1. Con DevTools abierto, ve a la pestaña "Network"
2. Recarga la página
3. Busca una petición a Supabase (generalmente a `supabase.co`)
4. Haz clic en ella y ve a "Preview" o "Response"

**¿Qué ver?**:
- Si hay un error 401/403 → Problema de autenticación/permisos
- Si la respuesta está vacía → No hay datos
- Si hay datos → El problema está en el frontend

## Soluciones Rápidas

### Si No Hay Datos en la BD:
```typescript
// Registra un nuevo usuario o actualiza el existente manualmente en Supabase
```

### Si Falta el Campo 'city':
```sql
-- Ejecuta en Supabase SQL Editor
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
```

### Si hay Problema con RLS:
```sql
-- Verifica las políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'users';
```

## Instrucciones para el Usuario

**Por favor, haz lo siguiente y comparte los resultados:**

1. **Abre la consola del navegador** (F12) y ve a http://localhost:9002/dashboard/perfil
2. **Copia TODO lo que aparece en la consola** (especialmente los mensajes "User data fetched" y "Populating form")
3. **Ve a Supabase Dashboard** → Table Editor → users
4. **Toma un screenshot** de tu registro de usuario (oculta datos sensibles si quieres)
5. **Verifica si el campo `city` existe** en la tabla users

Con esta información podré identificar exactamente cuál es el problema.
