-- =====================================================
-- DATOS DE PRUEBA REALISTAS: PSICÓLOGO Y 2 PACIENTES
-- =====================================================

-- IMPORTANTE: Este script genera UUIDs automáticamente
-- Primero crea los usuarios en Supabase Authentication con estos emails:
-- - dra.martinez@ips-virtual.com
-- - carlos.rodriguez@email.com  
-- - laura.gomez@email.com
-- Luego ejecuta este script que buscará los UUIDs automáticamente

BEGIN;

-- Variables para almacenar los UUIDs de auth.users
DO $$
DECLARE
  psicologo_id UUID;
  paciente1_id UUID;
  paciente2_id UUID;
BEGIN
  -- Buscar UUIDs en auth.users por email
  SELECT id INTO psicologo_id FROM auth.users WHERE email = 'dra.martinez@ips-virtual.com';
  SELECT id INTO paciente1_id FROM auth.users WHERE email = 'carlos.rodriguez@email.com';
  SELECT id INTO paciente2_id FROM auth.users WHERE email = 'laura.gomez@email.com';
  
  -- Verificar que existen
  IF psicologo_id IS NULL THEN
    RAISE EXCEPTION 'Usuario dra.martinez@ips-virtual.com no encontrado en auth.users. Créalo primero en Authentication.';
  END IF;
  IF paciente1_id IS NULL THEN
    RAISE EXCEPTION 'Usuario carlos.rodriguez@email.com no encontrado en auth.users. Créalo primero en Authentication.';
  END IF;
  IF paciente2_id IS NULL THEN
    RAISE EXCEPTION 'Usuario laura.gomez@email.com no encontrado en auth.users. Créalo primero en Authentication.';
  END IF;

-- =====================================================
-- 1. USUARIO PSICÓLOGO
-- =====================================================
INSERT INTO users (
  id,
  first_name,
  last_name,
  email,
  role,
  specialty,
  license_number,
  document_type,
  document_number,
  phone_number,
  photo_url,
  created_at,
  updated_at
) VALUES (
  psicologo_id,
  'María Alejandra',
  'Martínez',
  'dra.martinez@ips-virtual.com',
  'PERSONAL',
  'Psicología Clínica',
  'PSI-12345',
  'CC',
  '52789456',
  '3201234567',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
  NOW(),
  NOW()
);

-- =====================================================
-- 2. PACIENTES
-- =====================================================

-- Paciente 1: Joven con ansiedad
INSERT INTO users (
  id,
  first_name,
  last_name,
  email,
  role,
  document_type,
  document_number,
  phone_number,
  age,
  address,
  city_id,
  blood_type,
  allergies,
  photo_url,
  created_at,
  updated_at
) VALUES (
  paciente1_id,
  'Carlos Andrés',
  'Rodríguez',
  'carlos.rodriguez@email.com',
  'PACIENTE',
  'CC',
  '1023456789',
  '3159876543',
  26,
  'Calle 45 #12-34 Apto 501',
  'BOG-BOG',
  'O+',
  'Ninguna conocida',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
  NOW(),
  NOW()
);

-- Paciente 2: Adulta con depresión
INSERT INTO users (
  id,
  first_name,
  last_name,
  email,
  role,
  document_type,
  document_number,
  phone_number,
  age,
  address,
  city_id,
  blood_type,
  allergies,
  photo_url,
  created_at,
  updated_at
) VALUES (
  paciente2_id,
  'Laura Patricia',
  'Gómez',
  'laura.gomez@email.com',
  'PACIENTE',
  'CC',
  '1034567890',
  '3145678901',
  39,
  'Carrera 15 #78-90 Casa 10',
  'BOG-BOG',
  'A+',
  'Penicilina',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=laura',
  NOW(),
  NOW()
);

-- =====================================================
-- 3. SERVICIOS DE PSICOLOGÍA
-- =====================================================

-- Generar IDs únicos para los servicios
INSERT INTO services (
  name,
  description,
  price,
  duration_minutes,
  specialty,
  status,
  created_at
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

-- =====================================================
-- 4. CITAS - PACIENTE 1 (Carlos)
-- =====================================================

-- Cita completada hace 2 meses (primera consulta)
INSERT INTO appointments (
  id,
  patient_id,
  patient_name,
  doctor_id,
  doctor_name,
  service_id,
  service_name,
  date,
  time,
  status,
  consultation_type,
  price,
  reason,
  diagnosis,
  created_at
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
  id,
  patient_id,
  patient_name,
  doctor_id,
  doctor_name,
  service_id,
  service_name,
  date,
  time,
  status,
  consultation_type,
  price,
  reason,
  diagnosis,
  created_at
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
  id,
  patient_id,
  patient_name,
  doctor_id,
  doctor_name,
  service_id,
  service_name,
  date,
  time,
  status,
  consultation_type,
  price,
  reason,
  created_at
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
  id,
  patient_id,
  patient_name,
  doctor_id,
  doctor_name,
  service_id,
  service_name,
  date,
  time,
  status,
  consultation_type,
  price,
  reason,
  created_at
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
  id,
  patient_id,
  patient_name,
  doctor_id,
  doctor_name,
  service_id,
  service_name,
  date,
  time,
  status,
  consultation_type,
  price,
  reason,
  created_at
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

-- =====================================================
-- 5. CITAS - PACIENTE 2 (Laura)
-- =====================================================

-- Cita completada hace 3 meses (evaluación inicial)
INSERT INTO appointments (
  id,
  patient_id,
  patient_name,
  doctor_id,
  doctor_name,
  service_id,
  service_name,
  date,
  time,
  status,
  consultation_type,
  price,
  reason,
  diagnosis,
  created_at
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
  id,
  patient_id,
  patient_name,
  doctor_id,
  doctor_name,
  service_id,
  service_name,
  date,
  time,
  status,
  consultation_type,
  price,
  reason,
  diagnosis,
  created_at
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
  id,
  patient_id,
  patient_name,
  doctor_id,
  doctor_name,
  service_id,
  service_name,
  date,
  time,
  status,
  consultation_type,
  price,
  reason,
  diagnosis,
  created_at
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
  id,
  patient_id,
  patient_name,
  doctor_id,
  doctor_name,
  service_id,
  service_name,
  date,
  time,
  status,
  consultation_type,
  price,
  reason,
  created_at
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
  id,
  patient_id,
  patient_name,
  doctor_id,
  doctor_name,
  service_id,
  service_name,
  date,
  time,
  status,
  consultation_type,
  price,
  reason,
  created_at
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

-- =====================================================
-- 6. NOTAS DE EVOLUCIÓN
-- =====================================================

-- Notas de Carlos
INSERT INTO evolution_notes (
  id,
  patient_id,
  doctor_id,
  note,
  date,
  created_at
) VALUES 
(
  uuid_generate_v4(),
  paciente1_id,
  psicologo_id,
  'Primera consulta. Paciente masculino de 26 años, refiere cuadro ansioso de aproximadamente 6 meses de evolución. Síntomas: preocupación excesiva, tensión muscular, dificultad para dormir, irritabilidad. Interferencia significativa en área laboral y social. No antecedentes psiquiátricos previos. Se explica diagnóstico y plan de tratamiento. Paciente colaborador, motivado para el cambio.',
  (CURRENT_DATE - INTERVAL '2 months')::timestamp,
  (CURRENT_DATE - INTERVAL '2 months')::timestamp
),
(
  uuid_generate_v4(),
  paciente1_id,
  psicologo_id,
  'Segunda sesión - Seguimiento. Paciente reporta mejoría en calidad de sueño tras implementar higiene del sueño. Ha practicado técnicas de respiración diafragmática. Identifica pensamientos catastróficos relacionados con trabajo. Se trabaja en reestructuración cognitiva usando registro de pensamientos. Tarea: continuar registro diario de situaciones ansiógenas y respuestas.',
  (CURRENT_DATE - INTERVAL '1 month')::timestamp,
  (CURRENT_DATE - INTERVAL '1 month')::timestamp
);

-- Notas de Laura
INSERT INTO evolution_notes (
  id,
  patient_id,
  doctor_id,
  note,
  date,
  created_at
) VALUES 
(
  uuid_generate_v4(),
  paciente2_id,
  psicologo_id,
  'Evaluación inicial. Paciente femenina de 39 años, con historia de episodios depresivos desde hace 5 años. Episodio actual de 4 meses de duración. Síntomas: ánimo depresivo persistente, anhedonia, fatiga, dificultad para concentrarse, pensamientos de inutilidad. No ideación suicida actual. Afectación severa en funcionamiento laboral y familiar. Antecedente de tratamiento farmacológico previo con buena respuesta. Se aplican escalas Beck (puntuación 32 - depresión severa). Se coordina con psiquiatría.',
  (CURRENT_DATE - INTERVAL '3 months')::timestamp,
  (CURRENT_DATE - INTERVAL '3 months')::timestamp
),
(
  uuid_generate_v4(),
  paciente2_id,
  psicologo_id,
  'Cuarta sesión. Paciente asistió a psiquiatría, inició sertralina 50mg hace 2 semanas. Refiere leve mejoría en ánimo pero persiste fatiga y apatía. Se implementa programa de activación conductual, estableciendo horarios y actividades graduales. Identificación de valores personales para aumentar motivación. Psicoeducación sobre medicación y tiempos de respuesta. Paciente con mejor insight.',
  (CURRENT_DATE - INTERVAL '2 months')::timestamp,
  (CURRENT_DATE - INTERVAL '2 months')::timestamp
),
(
  uuid_generate_v4(),
  paciente2_id,
  psicologo_id,
  'Octava sesión - Evolución favorable. Paciente evidencia cambio significativo. Retomó trabajo, mejores relaciones interpersonales. Duerme mejor, realiza actividades físicas 3 veces por semana. Escala Beck actual: 12 (depresión leve). Se trabaja en identificación de señales tempranas de recaída y plan de prevención. Excelente adherencia terapéutica.',
  (CURRENT_DATE - INTERVAL '1 month')::timestamp,
  (CURRENT_DATE - INTERVAL '1 month')::timestamp
);

-- =====================================================
-- 7. FÓRMULAS MÉDICAS (RECOMENDACIONES PSICOLÓGICAS)
-- =====================================================

-- Fórmula para Laura (indicaciones psicológicas y coordinación con psiquiatría)
INSERT INTO formulas (
  id,
  patient_id,
  patient_name,
  doctor_id,
  doctor_name,
  date,
  medications,
  observations,
  expiration_date,
  status,
  created_at
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

-- =====================================================
-- 8. NOTIFICACIONES
-- =====================================================

-- Notificaciones para el psicólogo
INSERT INTO notifications (
  id,
  user_id,
  type,
  title,
  message,
  read,
  created_at
) VALUES 
(
  uuid_generate_v4(),
  psicologo_id,
  'new_appointment',
  'Nueva Cita Solicitada',
  'Carlos Andrés Rodríguez ha solicitado una cita para el ' || to_char((CURRENT_DATE + INTERVAL '2 weeks'), 'DD "de" TMMonth') || ' a las 10:00.',
  false,
  NOW()
),
(
  uuid_generate_v4(),
  psicologo_id,
  'appointment_confirmed',
  'Cita Confirmada',
  'Laura Patricia Gómez ha confirmado su asistencia para hoy ' || to_char(CURRENT_DATE, 'DD "de" TMMonth') || ' a las 14:00.',
  false,
  NOW() - INTERVAL '2 hours'
),
(
  uuid_generate_v4(),
  psicologo_id,
  'appointment_reminder',
  'Recordatorio de Cita',
  'Tienes una cita con Laura Patricia Gómez hoy a las 14:00.',
  false,
  NOW() - INTERVAL '1 hour'
);

-- Notificaciones para Carlos
INSERT INTO notifications (
  id,
  user_id,
  type,
  title,
  message,
  read,
  created_at
) VALUES 
(
  uuid_generate_v4(),
  paciente1_id,
  'appointment_confirmed',
  'Cita Confirmada',
  'Tu cita con la Dra. María Alejandra Martínez ha sido confirmada para el ' || to_char((CURRENT_DATE + INTERVAL '3 days'), 'DD "de" TMMonth') || ' a las 11:00.',
  true,
  NOW() - INTERVAL '1 day'
),
(
  uuid_generate_v4(),
  paciente1_id,
  'appointment_reminder',
  'Recordatorio de Cita',
  'Recuerda tu cita de Terapia Cognitivo Conductual el ' || to_char((CURRENT_DATE + INTERVAL '3 days'), 'DD "de" TMMonth') || ' a las 11:00 (Virtual).',
  false,
  NOW()
);

-- Notificaciones para Laura
INSERT INTO notifications (
  id,
  user_id,
  type,
  title,
  message,
  read,
  created_at
) VALUES 
(
  uuid_generate_v4(),
  paciente2_id,
  'appointment_reminder',
  'Cita Hoy',
  'Tienes una cita con la Dra. María Alejandra Martínez hoy a las 14:00 en modalidad presencial.',
  false,
  NOW() - INTERVAL '2 hours'
),
(
  uuid_generate_v4(),
  paciente2_id,
  'formula_created',
  'Nueva Fórmula Disponible',
  'La Dra. Martínez ha emitido una fórmula médica para ti. Revísala en la sección de fórmulas.',
  true,
  (CURRENT_DATE - INTERVAL '2 months')::timestamp
);

END $$;

COMMIT;

-- =====================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================================

-- Verificar usuarios
SELECT 'USUARIOS' as tabla, COUNT(*) as registros FROM users WHERE email IN ('dra.martinez@ips-virtual.com', 'carlos.rodriguez@email.com', 'laura.gomez@email.com');

-- Verificar servicios
SELECT 'SERVICIOS' as tabla, COUNT(*) as registros FROM services WHERE specialty = 'Psicología Clínica';

-- Verificar citas
SELECT 'CITAS' as tabla, status, COUNT(*) as cantidad 
FROM appointments 
WHERE doctor_name = 'Dra. María Alejandra Martínez'
GROUP BY status
ORDER BY status;

-- Verificar notas de evolución
SELECT 'NOTAS DE EVOLUCIÓN' as tabla, COUNT(*) as registros FROM evolution_notes WHERE doctor_id = (SELECT id FROM auth.users WHERE email = 'dra.martinez@ips-virtual.com');

-- Verificar fórmulas
SELECT 'FÓRMULAS' as tabla, COUNT(*) as registros FROM formulas WHERE doctor_name = 'Dra. María Alejandra Martínez';

-- Verificar notificaciones
SELECT 'NOTIFICACIONES' as tabla, COUNT(*) as registros FROM notifications 
WHERE user_id IN (
  SELECT id FROM users WHERE email IN ('dra.martinez@ips-virtual.com', 'carlos.rodriguez@email.com', 'laura.gomez@email.com')
);

-- =====================================================
-- INSTRUCCIONES DE USO
-- =====================================================

/*
ANTES DE EJECUTAR:
1. Crea los 3 usuarios en Supabase Authentication (Settings > Authentication > Users):
   - dra.martinez@ips-virtual.com (Password: Test123!)
   - carlos.rodriguez@email.com (Password: Test123!)
   - laura.gomez@email.com (Password: Test123!)

2. El script buscará automáticamente los UUIDs de auth.users por email.
   Si algún usuario no existe, el script mostrará un error indicando cuál falta.

3. Las fechas se calculan relativamente a CURRENT_DATE para datos actualizados.

DESPUÉS DE EJECUTAR:
- Inicia sesión con el email de la Dra. Martínez para ver el dashboard del médico
- Inicia sesión con Carlos o Laura para ver el dashboard del paciente
- Verás citas en diferentes estados, historial clínico completo y fórmulas

CREDENCIALES DE PRUEBA (debes crearlas en Supabase Auth):
- dra.martinez@ips-virtual.com (Psicólogo)
- carlos.rodriguez@email.com (Paciente)
- laura.gomez@email.com (Paciente)

DATOS INCLUIDOS:
✓ 1 Psicólogo con especialidad en Psicología Clínica
✓ 2 Pacientes con perfiles completos
✓ 3 Servicios de psicología
✓ 10 Citas (completadas, confirmadas, pendientes, canceladas)
✓ 5 Notas de evolución detalladas
✓ 1 Fórmula con indicaciones terapéuticas
✓ 7 Notificaciones
✓ Diagnósticos reales: F41.1 (TAG), F33.1 (Depresión Recurrente)
✓ Tratamientos realistas con TCC y farmacoterapia
*/
