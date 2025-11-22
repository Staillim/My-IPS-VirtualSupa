-- =====================================================
-- Agregar tipos de notificación faltantes
-- =====================================================
-- Este script agrega los tipos de notificación que se
-- usan en el código pero no están en el enum
-- 
-- IMPORTANTE: Ejecutar cada comando ALTER TYPE por separado
-- Los valores de enum deben ser committed antes de usarse
-- =====================================================

-- Verificar los tipos actuales
-- SELECT enum_range(NULL::notification_type);

-- PASO 1: Agregar tipo para videollamadas
-- Ejecutar este comando primero y esperar a que complete:
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'video_call_ready';

-- PASO 2: Agregar tipo para documentos subidos
-- Ejecutar este comando después del anterior:
-- ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'document_uploaded';

-- PASO 3: Agregar tipo para reprogramaciones aceptadas
-- Ejecutar este comando al final:
-- ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'reschedule_accepted';

-- VERIFICACIÓN FINAL: Ejecutar esto después de todos los pasos
-- SELECT enum_range(NULL::notification_type);
