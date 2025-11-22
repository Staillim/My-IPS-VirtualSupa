-- =====================================================
-- 07. NOTIFICACIONES
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

  -- Notificaciones para el psicólogo
  INSERT INTO notifications (
    id, user_id, type, title, message, read, created_at
  ) VALUES 
  (
    uuid_generate_v4(),
    psicologo_id,
    'reschedule_request',
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
    'new_message',
    'Recordatorio de Cita',
    'Tienes una cita con Laura Patricia Gómez hoy a las 14:00.',
    false,
    NOW() - INTERVAL '1 hour'
  );

  -- Notificaciones para Carlos
  INSERT INTO notifications (
    id, user_id, type, title, message, read, read_at, created_at
  ) VALUES 
  (
    uuid_generate_v4(),
    paciente1_id,
    'appointment_confirmed',
    'Cita Confirmada',
    'Tu cita con la Dra. María Alejandra Martínez ha sido confirmada para el ' || to_char((CURRENT_DATE + INTERVAL '3 days'), 'DD "de" TMMonth') || ' a las 11:00.',
    true,
    NOW() - INTERVAL '12 hours',
    NOW() - INTERVAL '1 day'
  ),
  (
    uuid_generate_v4(),
    paciente1_id,
    'new_message',
    'Recordatorio de Cita',
    'Recuerda tu cita de Terapia Cognitivo Conductual el ' || to_char((CURRENT_DATE + INTERVAL '3 days'), 'DD "de" TMMonth') || ' a las 11:00 (Virtual).',
    false,
    NULL,
    NOW()
  );

  -- Notificaciones para Laura
  INSERT INTO notifications (
    id, user_id, type, title, message, read, read_at, created_at
  ) VALUES 
  (
    uuid_generate_v4(),
    paciente2_id,
    'new_message',
    'Cita Hoy',
    'Tienes una cita con la Dra. María Alejandra Martínez hoy a las 14:00 en modalidad presencial.',
    false,
    NULL,
    NOW() - INTERVAL '2 hours'
  ),
  (
    uuid_generate_v4(),
    paciente2_id,
    'formula_created',
    'Nueva Fórmula Disponible',
    'La Dra. Martínez ha emitido una fórmula médica para ti. Revísala en la sección de fórmulas.',
    true,
    (CURRENT_DATE - INTERVAL '2 months' + INTERVAL '1 hour')::timestamp,
    (CURRENT_DATE - INTERVAL '2 months')::timestamp
  );

END $$;

COMMIT;

-- Verificar
SELECT 'NOTIFICACIONES' as resultado, COUNT(*) as total 
FROM notifications 
WHERE user_id IN (
  SELECT id FROM users WHERE email IN ('dra.martinez@ips-virtual.com', 'carlos.rodriguez@email.com', 'laura.gomez@email.com')
);
