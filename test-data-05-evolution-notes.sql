-- =====================================================
-- 05. NOTAS DE EVOLUCIÓN
-- =====================================================

BEGIN;

DO $$
DECLARE
  psicologo_id UUID;
  paciente1_id UUID;
  paciente2_id UUID;
BEGIN
  SELECT id INTO psicologo_id FROM auth.users WHERE email = 'dra.martinez@ips-virtual.com';
  SELECT id INTO paciente1_id FROM auth.users WHERE email = 'carlos.rodriguez@email.com';
  SELECT id INTO paciente2_id FROM auth.users WHERE email = 'laura.gomez@email.com';

  -- Notas de Carlos
  INSERT INTO evolution_notes (
    id, patient_id, doctor_id, note, date, created_at
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
    id, patient_id, doctor_id, note, date, created_at
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

END $$;

COMMIT;

-- Verificar
SELECT 'NOTAS DE EVOLUCIÓN' as resultado, COUNT(*) as total 
FROM evolution_notes 
WHERE doctor_id = (SELECT id FROM auth.users WHERE email = 'dra.martinez@ips-virtual.com');
