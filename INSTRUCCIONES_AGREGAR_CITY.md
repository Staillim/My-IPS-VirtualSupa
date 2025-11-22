# Instrucciones para Agregar el Campo 'city' a la Base de Datos

## Problema Identificado

El sistema está intentando guardar un campo `city` (nombre de la ciudad) en la tabla `users`, pero este campo no existe en el esquema actual de la base de datos.

## Solución

Debes agregar el campo `city` a la tabla `users` en Supabase. Hay dos formas de hacerlo:

### Opción 1: Usando el Editor SQL de Supabase (Recomendado)

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto (mqwqpgstapsjqmprsnsb)
3. En el menú lateral, haz clic en "SQL Editor"
4. Haz clic en "+ New query"
5. Copia y pega el siguiente SQL:

```sql
-- Agregar campo 'city' a la tabla users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Crear índice para búsquedas por ciudad
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city) WHERE city IS NOT NULL;

-- Comentario de documentación
COMMENT ON COLUMN users.city IS 'Nombre de la ciudad (legible), complementa city_id';
```

6. Haz clic en "Run" o presiona Ctrl+Enter
7. Verifica que aparezca un mensaje de "Success"

### Opción 2: Usando el archivo SQL

También puedes usar el archivo `add_city_field.sql` que he creado:

1. Ve a tu proyecto en Supabase
2. Abre el SQL Editor
3. Haz clic en "+ New query"
4. Copia el contenido del archivo `add_city_field.sql`
5. Pégalo en el editor y ejecuta

## Verificación

Después de ejecutar el script, verifica que el campo se agregó correctamente:

```sql
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'city';
```

Deberías ver:
```
column_name | data_type      | character_maximum_length
city        | character varying | 100
```

## Cambios Realizados en el Código

He actualizado automáticamente:

1. **src/app/signup/page.tsx**: Ahora guarda el campo `city` con el nombre legible de la ciudad al registrarse
2. **src/app/dashboard/perfil/page.tsx**: Ya estaba configurado para guardar el campo `city` al actualizar el perfil

## Próximos Pasos

1. Ejecuta el script SQL en Supabase (ver arriba)
2. Prueba registrar un nuevo usuario
3. Ve a /dashboard/perfil y verifica que los datos se muestren correctamente

## Nota Importante

Si ya tienes usuarios registrados antes de este cambio, tendrán `city_id` pero no `city`. Esos usuarios podrán actualizar su perfil y se guardará el campo `city` automáticamente.
