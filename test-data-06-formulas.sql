-- =====================================================
-- 06. FÓRMULAS MÉDICAS
-- =====================================================

BEGIN;

DO $$
DECLARE
  psicologo_id UUID;
  paciente2_id UUID;
BEGIN
  SELECT id INTO psicologo_id FROM auth.users WHERE email = 'dra.martinez@ips-virtual.com';
  SELECT id INTO paciente2_id FROM auth.users WHERE email = 'laura.gomez@email.com';

  -- Fórmula para Laura (indicaciones psicológicas y coordinación con psiquiatría)
  INSERT INTO formulas (
    id, patient_id, patient_name, doctor_id, doctor_name, date,
    medications, observations, expiration_date, status, created_at
  ) VALUES (
    uuid_generate_v4(),
    paciente2_id,
    'Laura Patricia Gómez',
    psicologo_id,
    'Dra. María Alejandra Martínez',
    (CURRENT_DATE - INTERVAL '2 months')::date,
    jsonb_build_array(
      jsonb_build_object(
        'name', 'Sertralina',
        'dosage', '50mg cada 24 horas en la mañana (prescrita por Psiquiatría)'
      ),
      jsonb_build_object(
        'name', 'Terapia Cognitivo-Conductual',
        'dosage', 'Sesiones semanales, ejercicios de activación conductual diarios'
      ),
      jsonb_build_object(
        'name', 'Mindfulness y Relajación',
        'dosage', '10-15 minutos diarios, preferiblemente en la mañana'
      )
    ),
    'Continuar con tratamiento farmacológico según indicación psiquiátrica. Realizar actividad física moderada al menos 3 veces por semana. Mantener rutina de sueño regular (acostar antes de 11pm). Practicar técnicas de mindfulness diariamente. Evitar consumo de alcohol. Control con psiquiatría en 4 semanas. Próxima cita psicológica en 2 semanas.',
    (CURRENT_DATE + INTERVAL '3 months')::date,
    'activa',
    (CURRENT_DATE - INTERVAL '2 months')::timestamp
  );

END $$;

COMMIT;

-- Verificar
SELECT 'FÓRMULAS' as resultado, COUNT(*) as total 
FROM formulas 
WHERE doctor_name = 'Dra. María Alejandra Martínez';
