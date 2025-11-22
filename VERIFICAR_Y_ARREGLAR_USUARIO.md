# VERIFICAR Y ARREGLAR DATOS DE USUARIO

## Problema
Los datos del perfil aparecen en blanco porque el registro del usuario en la tabla `users` está incompleto o no existe.

## PASO 1: Verificar si tu usuario existe en la tabla

Ve a **Supabase Dashboard** → **SQL Editor** y ejecuta:

```sql
-- Reemplaza 'tu_email@example.com' con tu email real
SELECT 
  id,
  first_name,
  last_name,
  email,
  phone_number,
  department_id,
  city_id,
  address,
  age,
  blood_type,
  allergies,
  role,
  created_at
FROM users
WHERE email = 'tu_email@example.com';
```

### Resultado A: No aparece nada (0 rows)
**Significa:** Tu usuario no existe en la tabla `users`, solo en `auth.users`

**Solución:** Ve al PASO 2A

### Resultado B: Aparece pero todos los campos están NULL o vacíos
**Significa:** El registro existe pero no tiene datos

**Solución:** Ve al PASO 2B

### Resultado C: Aparece con datos
**Significa:** El problema es en el frontend (página de perfil)

**Solución:** Ve al PASO 3

---

## PASO 2A: Crear registro de usuario manualmente

Si tu usuario NO existe en la tabla, ejecuta esto en SQL Editor:

```sql
-- 1. Primero, obtén tu ID de auth.users
SELECT id, email FROM auth.users WHERE email = 'tu_email@example.com';

-- 2. Copia el ID (UUID) que aparece

-- 3. Inserta el registro en users (reemplaza los valores)
INSERT INTO users (
  id,
  first_name,
  last_name,
  email,
  phone_number,
  department_id,
  city_id,
  role
) VALUES (
  'PEGA_AQUI_EL_UUID_DE_AUTH_USERS', -- El ID que copiaste del paso 1
  'Tu Nombre',                        -- Reemplaza
  'Tu Apellido',                      -- Reemplaza
  'tu_email@example.com',            -- Reemplaza
  '3001234567',                       -- Reemplaza con tu teléfono
  '11',                               -- ID del departamento (ejemplo: 11 = Bogotá D.C.)
  '11001',                            -- ID de la ciudad (ejemplo: 11001 = Bogotá)
  'PACIENTE'
);

-- 4. Crear registro en paciente_roles
INSERT INTO paciente_roles (user_id)
VALUES ('PEGA_AQUI_EL_MISMO_UUID');
```

**Después de ejecutar esto, recarga la página de perfil.**

---

## PASO 2B: Actualizar registro existente con datos

Si tu usuario existe pero los campos están vacíos:

```sql
-- Actualiza el registro (reemplaza los valores)
UPDATE users
SET
  first_name = 'Tu Nombre',
  last_name = 'Tu Apellido',
  phone_number = '3001234567',
  department_id = '11',        -- Ejemplo: Bogotá D.C.
  city_id = '11001',            -- Ejemplo: Bogotá
  address = 'Tu dirección',
  age = 30,                     -- Tu edad
  blood_type = 'O+',            -- Tu grupo sanguíneo
  allergies = 'Ninguna'         -- Tus alergias
WHERE email = 'tu_email@example.com';
```

**Después de ejecutar esto, recarga la página de perfil.**

---

## PASO 3: Verificar que la página esté consultando correctamente

Si los datos SÍ existen en la base de datos pero no aparecen en el formulario:

1. **Abre la página de perfil** en http://localhost:9002/dashboard/perfil
2. **Presiona F12** para abrir DevTools
3. **Ve a la pestaña Console**
4. **Busca estos mensajes:**
   ```
   User data fetched: {first_name: "...", last_name: "...", ...}
   Populating form with userData: {first_name: "...", last_name: "...", ...}
   ```

### Si NO aparecen estos logs:
- Hay un error de permisos (RLS policies)
- El `user.id` no coincide con el registro de la tabla

**Solución:** Ejecuta esto para verificar permisos:

```sql
-- Verifica las RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'users';

-- Verifica que tu auth.uid() coincide con el id en users
SELECT 
  auth.uid() as mi_auth_id,
  u.id as mi_user_id,
  u.email,
  u.first_name,
  u.last_name
FROM users u
WHERE u.id = auth.uid();
```

### Si los logs SÍ aparecen pero los datos son NULL:
- El registro existe pero está vacío
- Ve al PASO 2B para llenar los datos

---

## PASO 4: Volver a registrarse (última opción)

Si nada funciona, es más fácil crear una cuenta nueva:

1. **Elimina tu usuario actual** (SQL Editor):
   ```sql
   -- Esto eliminará el usuario de todas las tablas (CASCADE)
   DELETE FROM auth.users WHERE email = 'tu_email@example.com';
   ```

2. **Vuelve a registrarte** en http://localhost:9002/signup

3. **Verifica que se creen los datos** ejecutando:
   ```sql
   SELECT * FROM users WHERE email = 'tu_nuevo_email@example.com';
   ```

---

## Códigos de Departamentos y Ciudades comunes

Para el PASO 2A y 2B, aquí están algunos códigos:

**Departamentos:**
- `05` = Antioquia
- `08` = Atlántico  
- `11` = Bogotá D.C.
- `13` = Bolívar
- `76` = Valle del Cauca

**Ciudades (ejemplos):**
- `05001` = Medellín
- `08001` = Barranquilla
- `11001` = Bogotá
- `13001` = Cartagena
- `76001` = Cali

**Puedes ver la lista completa en:** `src/lib/colombia-data.ts`

---

## ¿Necesitas ayuda?

Después de ejecutar cualquiera de estos pasos, comparte:
1. El resultado de la consulta SELECT
2. Los mensajes de la consola del navegador
3. Si aparecieron errores al ejecutar los SQL
