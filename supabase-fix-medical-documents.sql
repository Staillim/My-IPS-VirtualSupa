-- Script para LIMPIAR y RECREAR medical_documents correctamente
-- Ejecuta este archivo SI ya intentaste crear la tabla y hubo errores

-- 1. ELIMINAR TODO relacionado con medical_documents
DROP TABLE IF EXISTS medical_documents CASCADE;

-- 2. CREAR tabla medical_documents desde cero
CREATE TABLE medical_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  document_url TEXT NOT NULL,
  file_size INTEGER,
  notes TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Comentarios para documentación
COMMENT ON TABLE medical_documents IS 'Documentos y estudios médicos anexos al historial clínico';
COMMENT ON COLUMN medical_documents.patient_id IS 'ID del paciente al que pertenece el documento';
COMMENT ON COLUMN medical_documents.uploaded_by IS 'ID del usuario que subió el documento (médico o paciente)';
COMMENT ON COLUMN medical_documents.appointment_id IS 'ID de la cita asociada (opcional)';
COMMENT ON COLUMN medical_documents.document_name IS 'Nombre del archivo del documento';
COMMENT ON COLUMN medical_documents.document_type IS 'Tipo de documento (PDF, imagen, laboratorio, etc.)';
COMMENT ON COLUMN medical_documents.document_url IS 'URL del documento en el storage';
COMMENT ON COLUMN medical_documents.file_size IS 'Tamaño del archivo en bytes';
COMMENT ON COLUMN medical_documents.notes IS 'Notas adicionales sobre el documento';

-- 4. Índices para optimizar consultas
CREATE INDEX idx_medical_documents_patient_id ON medical_documents(patient_id);
CREATE INDEX idx_medical_documents_uploaded_by ON medical_documents(uploaded_by);
CREATE INDEX idx_medical_documents_appointment_id ON medical_documents(appointment_id);
CREATE INDEX idx_medical_documents_uploaded_at ON medical_documents(uploaded_at DESC);
CREATE INDEX idx_medical_documents_document_type ON medical_documents(document_type);

-- 5. Habilitar RLS
ALTER TABLE medical_documents ENABLE ROW LEVEL SECURITY;

-- 6. Verificación - esto debería mostrar todas las columnas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'medical_documents'
ORDER BY ordinal_position;
