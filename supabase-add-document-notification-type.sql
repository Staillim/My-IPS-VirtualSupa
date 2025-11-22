-- Agregar tipo de notificación para documentos subidos
-- Ejecuta este archivo en Supabase SQL Editor

-- Agregar 'document_uploaded' al enum notification_type
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'document_uploaded';

-- Verificar los valores del enum
SELECT enumlabel as notification_types
FROM pg_enum
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')
ORDER BY enumsortorder;
