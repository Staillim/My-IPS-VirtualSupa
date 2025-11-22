-- =====================================================
-- AGREGAR COLUMNAS PARA DOCUMENTOS EN FORMATO JSONB
-- =====================================================
-- Estas columnas almacenarán documentos como objetos JSON
-- con la imagen comprimida en base64
-- Estructura: { name: string, data: string (base64), type: string }
-- =====================================================

-- Agregar columna para documento personal (cédula, pasaporte, etc.)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS document JSONB;

-- Agregar columna para documento profesional (licencia médica, certificados)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS professional_document JSONB;

-- Comentarios para documentación
COMMENT ON COLUMN users.document IS 'Documento de identidad almacenado como JSONB: {name: string, data: base64, type: string}';
COMMENT ON COLUMN users.professional_document IS 'Documento profesional almacenado como JSONB: {name: string, data: base64, type: string}';

-- Opcional: Agregar restricción para validar la estructura JSON
-- ALTER TABLE users ADD CONSTRAINT valid_document_structure 
-- CHECK (
--   document IS NULL OR (
--     document ? 'name' AND 
--     document ? 'data' AND 
--     document ? 'type'
--   )
-- );

-- ALTER TABLE users ADD CONSTRAINT valid_professional_document_structure 
-- CHECK (
--   professional_document IS NULL OR (
--     professional_document ? 'name' AND 
--     professional_document ? 'data' AND 
--     professional_document ? 'type'
--   )
-- );

-- Nota: Las restricciones están comentadas porque pueden ser muy estrictas
-- Descoméntalas si quieres validación estricta de la estructura JSON
