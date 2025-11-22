-- =====================================================
-- 03. CITAS DE CARLOS (Paciente con Ansiedad)
-- =====================================================

BEGIN;

DO $$
DECLARE
  psicologo_id UUID;
  paciente1_id UUID;
BEGIN
  SELECT id INTO psicologo_id FROM auth.users WHERE email = 'dra.martinez@ips-virtual.com';
  SELECT id INTO paciente1_id FROM auth.users WHERE email = 'carlos.rodriguez@email.com';

  -- Cita completada hace 2 meses (primera consulta)
  INSERT INTO appointments (
    id, patient_id, patient_name, doctor_id, doctor_name, service_id, service_name,
    date, time, status, consultation_type, price, reason, diagnosis, created_at
  ) VALUES (
    uuid_generate_v4(),
    paciente1_id,
    'Carlos Andrés Rodríguez',
    psicologo_id,
    'Dra. María Alejandra Martínez',
    (SELECT id FROM services WHERE name = 'Consulta Psicológica Individual' LIMIT 1),
    'Consulta Psicológica Individual',
    (CURRENT_DATE - INTERVAL '2 months')::date,
    '10:00',
    'completada',
    'presencial',
    120000,
    'Síntomas de ansiedad generalizada, dificultad para dormir y concentrarse',
    jsonb_build_object(
      'code', 'F41.1',
      'description', 'Trastorno de Ansiedad Generalizada (TAG)',
      'treatment', 'Terapia cognitivo-conductual. Técnicas de relajación y respiración. Reestructuración cognitiva. Control de estímulos. Se recomienda continuar con sesiones semanales.',
      'date', (CURRENT_DATE - INTERVAL '2 months')::timestamp
    ),
    (CURRENT_DATE - INTERVAL '2 months')::timestamp
  );

  -- Cita completada hace 1 mes (seguimiento)
  INSERT INTO appointments (
    id, patient_id, patient_name, doctor_id, doctor_name, service_id, service_name,
    date, time, status, consultation_type, price, reason, diagnosis, created_at
  ) VALUES (
    uuid_generate_v4(),
    paciente1_id,
    'Carlos Andrés Rodríguez',
    psicologo_id,
    'Dra. María Alejandra Martínez',
    (SELECT id FROM services WHERE name = 'Terapia Cognitivo Conductual' LIMIT 1),
    'Terapia Cognitivo Conductual',
    (CURRENT_DATE - INTERVAL '1 month')::date,
    '10:00',
    'completada',
    'virtual',
    150000,
    'Seguimiento trastorno de ansiedad, evaluación de técnicas aprendidas',
    jsonb_build_object(
      'code', 'F41.1',
      'description', 'Trastorno de Ansiedad Generalizada - Seguimiento',
      'treatment', 'Paciente muestra mejoría significativa. Reporta mejor calidad de sueño y mayor capacidad de concentración. Se continúa con TCC, enfocándose en exposición gradual a situaciones ansiógenas. Reforzar técnicas de mindfulness.',
      'date', (CURRENT_DATE - INTERVAL '1 month')::timestamp
    ),
    (CURRENT_DATE - INTERVAL '1 month')::timestamp
  );

  -- Cita cancelada hace 2 semanas
  INSERT INTO appointments (
    id, patient_id, patient_name, doctor_id, doctor_name, service_id, service_name,
    date, time, status, consultation_type, price, reason, created_at
  ) VALUES (
    uuid_generate_v4(),
    paciente1_id,
    'Carlos Andrés Rodríguez',
    psicologo_id,
    'Dra. María Alejandra Martínez',
    (SELECT id FROM services WHERE name = 'Consulta Psicológica Individual' LIMIT 1),
    'Consulta Psicológica Individual',
    (CURRENT_DATE - INTERVAL '2 weeks')::date,
    '15:00',
    'cancelada',
    'presencial',
    120000,
    'Paciente tuvo compromiso laboral de último momento',
    (CURRENT_DATE - INTERVAL '3 weeks')::timestamp
  );

  -- Cita confirmada próxima (en 3 días)
  INSERT INTO appointments (
    id, patient_id, patient_name, doctor_id, doctor_name, service_id, service_name,
    date, time, status, consultation_type, price, reason, created_at
  ) VALUES (
    uuid_generate_v4(),
    paciente1_id,
    'Carlos Andrés Rodríguez',
    psicologo_id,
    'Dra. María Alejandra Martínez',
    (SELECT id FROM services WHERE name = 'Terapia Cognitivo Conductual' LIMIT 1),
    'Terapia Cognitivo Conductual',
    (CURRENT_DATE + INTERVAL '3 days')::date,
    '11:00',
    'confirmada',
    'virtual',
    150000,
    'Sesión de seguimiento, práctica de técnicas de afrontamiento',
    NOW()
  );

  -- Cita pendiente (en 2 semanas)
  INSERT INTO appointments (
    id, patient_id, patient_name, doctor_id, doctor_name, service_id, service_name,
    date, time, status, consultation_type, price, reason, created_at
  ) VALUES (
    uuid_generate_v4(),
    paciente1_id,
    'Carlos Andrés Rodríguez',
    psicologo_id,
    'Dra. María Alejandra Martínez',
    (SELECT id FROM services WHERE name = 'Consulta Psicológica Individual' LIMIT 1),
    'Consulta Psicológica Individual',
    (CURRENT_DATE + INTERVAL '2 weeks')::date,
    '10:00',
    'pendiente',
    'presencial',
    120000,
    'Evaluación de progreso y cierre de fase inicial',
    NOW()
  );

END $$;

COMMIT;

-- Verificar
SELECT 'CITAS CARLOS' as resultado, status, COUNT(*) as total
FROM appointments
WHERE patient_name = 'Carlos Andrés Rodríguez'
GROUP BY status;
