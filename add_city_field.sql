-- =====================================================
-- Agregar campo 'city' a la tabla users
-- =====================================================
-- Este script agrega el campo 'city' (nombre de la ciudad)
-- a la tabla users para almacenar el nombre legible además del city_id
-- =====================================================

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Crear índice para búsquedas por ciudad
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city) WHERE city IS NOT NULL;

-- Comentario de documentación
COMMENT ON COLUMN users.city IS 'Nombre de la ciudad (legible), complementa city_id';

-- =====================================================
-- Script para actualizar datos existentes (opcional)
-- =====================================================
-- Si ya tienes usuarios con city_id pero sin city, puedes usar
-- este script para poblar el campo city con los nombres correctos.
-- Nota: Esto requiere que tengas los datos de ciudades disponibles.
-- =====================================================
