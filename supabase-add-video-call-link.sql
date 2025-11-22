-- Agregar campo para enlace de videollamada en citas virtuales
-- Ejecuta este archivo en Supabase SQL Editor

-- Agregar columna video_call_link a la tabla appointments
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS video_call_link TEXT;

-- Agregar columna video_call_link_sent_at para rastrear cuándo se envió el enlace
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS video_call_link_sent_at TIMESTAMPTZ;

-- Verificar las columnas agregadas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'appointments' 
  AND column_name IN ('video_call_link', 'video_call_link_sent_at')
ORDER BY column_name;
