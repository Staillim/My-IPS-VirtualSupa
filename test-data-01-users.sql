-- =====================================================
-- 01. USUARIOS DE PRUEBA
-- =====================================================
-- Crea primero los usuarios en Supabase Authentication con estos emails:
-- - dra.martinez@ips-virtual.com (Password: Test123!)
-- - carlos.rodriguez@email.com (Password: Test123!)
-- - laura.gomez@email.com (Password: Test123!)

BEGIN;

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
    RAISE EXCEPTION 'Usuario dra.martinez@ips-virtual.com no encontrado en auth.users';
  END IF;
  IF paciente1_id IS NULL THEN
    RAISE EXCEPTION 'Usuario carlos.rodriguez@email.com no encontrado en auth.users';
  END IF;
  IF paciente2_id IS NULL THEN
    RAISE EXCEPTION 'Usuario laura.gomez@email.com no encontrado en auth.users';
  END IF;

  -- Psicólogo
  INSERT INTO users (
    id, first_name, last_name, email, role, specialty, license_number,
    document_type, document_number, phone_number, photo_url, created_at, updated_at
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

  -- Paciente 1: Carlos (Ansiedad)
  INSERT INTO users (
    id, first_name, last_name, email, role, document_type, document_number,
    phone_number, age, address, city_id, blood_type, allergies, photo_url,
    created_at, updated_at
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

  -- Paciente 2: Laura (Depresión)
  INSERT INTO users (
    id, first_name, last_name, email, role, document_type, document_number,
    phone_number, age, address, city_id, blood_type, allergies, photo_url,
    created_at, updated_at
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

END $$;

COMMIT;

-- Verificar
SELECT 'USUARIOS CREADOS' as resultado, COUNT(*) as total 
FROM users 
WHERE email IN ('dra.martinez@ips-virtual.com', 'carlos.rodriguez@email.com', 'laura.gomez@email.com');
