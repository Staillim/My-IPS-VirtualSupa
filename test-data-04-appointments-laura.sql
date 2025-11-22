-- =====================================================
-- 04. CITAS DE LAURA (Paciente con Depresión)
-- =====================================================

BEGIN;

DO $$
DECLARE
  psicologo_id UUID;
  paciente2_id UUID;
BEGIN
  SELECT id INTO psicologo_id FROM auth.users WHERE email = 'dra.martinez@ips-virtual.com';
  SELECT id INTO paciente2_id FROM auth.users WHERE email = 'laura.gomez@email.com';

  -- Cita completada hace 3 meses (evaluación inicial)
  INSERT INTO appointments (
    id, patient_id, patient_name, doctor_id, doctor_name, service_id, service_name,
    date, time, status, consultation_type, price, reason, diagnosis, created_at
  ) VALUES (
    uuid_generate_v4(),
    paciente2_id,
    'Laura Patricia Gómez',
    psicologo_id,
    'Dra. María Alejandra Martínez',
    (SELECT id FROM services WHERE name = 'Evaluación Psicológica' LIMIT 1),
    'Evaluación Psicológica',
    (CURRENT_DATE - INTERVAL '3 months')::date,
    '14:00',
    'completada',
    'presencial',
    200000,
    'Episodios depresivos recurrentes, pérdida de interés en actividades, fatiga constante',
    jsonb_build_object(
      'code', 'F33.1',
      'description', 'Trastorno Depresivo Recurrente, Episodio Actual Moderado',
      'treatment', 'Se inicia terapia psicológica con enfoque cognitivo-conductual. Activación conductual y reestructuración cognitiva. Se sugiere valoración psiquiátrica para considerar tratamiento farmacológico complementario. Seguimiento semanal.',
      'date', (CURRENT_DATE - INTERVAL '3 months')::timestamp
    ),
    (CURRENT_DATE - INTERVAL '3 months')::timestamp
  );

  -- Cita completada hace 2 meses
  INSERT INTO appointments (
    id, patient_id, patient_name, doctor_id, doctor_name, service_id, service_name,
    date, time, status, consultation_type, price, reason, diagnosis, created_at
  ) VALUES (
    uuid_generate_v4(),
    paciente2_id,
    'Laura Patricia Gómez',
    psicologo_id,
    'Dra. María Alejandra Martínez',
    (SELECT id FROM services WHERE name = 'Consulta Psicológica Individual' LIMIT 1),
    'Consulta Psicológica Individual',
    (CURRENT_DATE - INTERVAL '2 months')::date,
    '16:00',
    'completada',
    'presencial',
    120000,
    'Seguimiento episodio depresivo, inicio de tratamiento farmacológico',
    jsonb_build_object(
      'code', 'F33.1',
      'description', 'Trastorno Depresivo Recurrente - Seguimiento',
      'treatment', 'Paciente inició tratamiento con sertralina 50mg. Reporta ligera mejoría en ánimo pero persiste fatiga. Se trabaja en activación conductual con programación de actividades placenteras. Registro de pensamientos automáticos negativos.',
      'date', (CURRENT_DATE - INTERVAL '2 months')::timestamp
    ),
    (CURRENT_DATE - INTERVAL '2 months')::timestamp
  );

  -- Cita completada hace 1 mes
  INSERT INTO appointments (
    id, patient_id, patient_name, doctor_id, doctor_name, service_id, service_name,
    date, time, status, consultation_type, price, reason, diagnosis, created_at
  ) VALUES (
    uuid_generate_v4(),
    paciente2_id,
    'Laura Patricia Gómez',
    psicologo_id,
    'Dra. María Alejandra Martínez',
    (SELECT id FROM services WHERE name = 'Consulta Psicológica Individual' LIMIT 1),
    'Consulta Psicológica Individual',
    (CURRENT_DATE - INTERVAL '1 month')::date,
    '15:00',
    'completada',
    'virtual',
    120000,
    'Sesión de seguimiento, evaluación de respuesta al tratamiento',
    jsonb_build_object(
      'code', 'F33.1',
      'description', 'Trastorno Depresivo Recurrente - Evolución Favorable',
      'treatment', 'Mejoría notable. Paciente más activa, retomó actividades laborales. Mejor patrón de sueño. Se trabaja en prevención de recaídas y desarrollo de estrategias de afrontamiento. Continuar con medicación según indicación psiquiátrica.',
      'date', (CURRENT_DATE - INTERVAL '1 month')::timestamp
    ),
    (CURRENT_DATE - INTERVAL '1 month')::timestamp
  );

  -- Cita confirmada HOY
  INSERT INTO appointments (
    id, patient_id, patient_name, doctor_id, doctor_name, service_id, service_name,
    date, time, status, consultation_type, price, reason, created_at
  ) VALUES (
    uuid_generate_v4(),
    paciente2_id,
    'Laura Patricia Gómez',
    psicologo_id,
    'Dra. María Alejandra Martínez',
    (SELECT id FROM services WHERE name = 'Consulta Psicológica Individual' LIMIT 1),
    'Consulta Psicológica Individual',
    CURRENT_DATE,
    '14:00',
    'confirmada',
    'presencial',
    120000,
    'Sesión de mantenimiento, fortalecimiento de habilidades de afrontamiento',
    NOW()
  );

  -- Cita pendiente (en 1 semana)
  INSERT INTO appointments (
    id, patient_id, patient_name, doctor_id, doctor_name, service_id, service_name,
    date, time, status, consultation_type, price, reason, created_at
  ) VALUES (
    uuid_generate_v4(),
    paciente2_id,
    'Laura Patricia Gómez',
    psicologo_id,
    'Dra. María Alejandra Martínez',
    (SELECT id FROM services WHERE name = 'Terapia Cognitivo Conductual' LIMIT 1),
    'Terapia Cognitivo Conductual',
    (CURRENT_DATE + INTERVAL '1 week')::date,
    '15:00',
    'pendiente',
    'presencial',
    150000,
    'Sesión enfocada en prevención de recaídas',
    NOW()
  );

END $$;

COMMIT;

-- Verificar
SELECT 'CITAS LAURA' as resultado, status, COUNT(*) as total
FROM appointments
WHERE patient_name = 'Laura Patricia Gómez'
GROUP BY status;
