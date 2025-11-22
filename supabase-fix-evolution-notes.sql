-- Script para LIMPIAR y RECREAR evolution_notes correctamente
-- Ejecuta este archivo SI ya intentaste crear la tabla y hubo errores

-- 1. ELIMINAR TODO relacionado con evolution_notes
DROP TRIGGER IF EXISTS trigger_update_evolution_notes_updated_at ON evolution_notes;
DROP FUNCTION IF EXISTS update_evolution_notes_updated_at();
DROP TABLE IF EXISTS evolution_notes CASCADE;

-- 2. CREAR tabla evolution_notes desde cero
CREATE TABLE evolution_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Comentarios para documentación
COMMENT ON TABLE evolution_notes IS 'Notas de evolución médica asociadas a consultas completadas';
COMMENT ON COLUMN evolution_notes.patient_id IS 'ID del paciente al que pertenece la nota';
COMMENT ON COLUMN evolution_notes.doctor_id IS 'ID del médico que escribió la nota';
COMMENT ON COLUMN evolution_notes.appointment_id IS 'ID de la cita asociada (opcional)';
COMMENT ON COLUMN evolution_notes.note IS 'Contenido de la nota de evolución médica';
COMMENT ON COLUMN evolution_notes.date IS 'Fecha y hora de la nota de evolución';

-- 4. Índices para optimizar consultas
CREATE INDEX idx_evolution_notes_patient_id ON evolution_notes(patient_id);
CREATE INDEX idx_evolution_notes_doctor_id ON evolution_notes(doctor_id);
CREATE INDEX idx_evolution_notes_appointment_id ON evolution_notes(appointment_id);
CREATE INDEX idx_evolution_notes_date ON evolution_notes(date DESC);

-- 5. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_evolution_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger para actualizar updated_at
CREATE TRIGGER trigger_update_evolution_notes_updated_at
  BEFORE UPDATE ON evolution_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_evolution_notes_updated_at();

-- 7. Habilitar RLS
ALTER TABLE evolution_notes ENABLE ROW LEVEL SECURITY;

-- 8. Verificación - esto debería mostrar todas las columnas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'evolution_notes'
ORDER BY ordinal_position;
