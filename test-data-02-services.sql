-- =====================================================
-- 02. SERVICIOS DE PSICOLOGÍA
-- =====================================================

BEGIN;

INSERT INTO services (
  name, description, price, duration_minutes, specialty, status, created_at
) VALUES 
(
  'Consulta Psicológica Individual',
  'Sesión individual de psicoterapia para evaluación y tratamiento de trastornos emocionales, ansiedad, depresión y otros.',
  120000,
  60,
  'Psicología Clínica',
  'activo',
  NOW()
),
(
  'Terapia Cognitivo Conductual',
  'Sesión especializada en TCC para manejo de ansiedad, fobias y trastornos del comportamiento.',
  150000,
  90,
  'Psicología Clínica',
  'activo',
  NOW()
),
(
  'Evaluación Psicológica',
  'Aplicación de pruebas psicológicas y elaboración de informe diagnóstico.',
  200000,
  120,
  'Psicología Clínica',
  'activo',
  NOW()
);

COMMIT;

-- Verificar
SELECT 'SERVICIOS CREADOS' as resultado, COUNT(*) as total 
FROM services 
WHERE specialty = 'Psicología Clínica';
