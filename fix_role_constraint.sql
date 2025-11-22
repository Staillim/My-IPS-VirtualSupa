-- =====================================================
-- ARREGLAR CONSTRAINT DE ESPECIALIDAD
-- =====================================================
-- Este script permite cambiar el rol a PERSONAL sin requerir
-- specialty inmediatamente. El usuario puede completar su
-- especialidad después en su perfil.
-- =====================================================

-- 1. Eliminar el constraint actual
ALTER TABLE users DROP CONSTRAINT IF EXISTS valid_role_specialty;

-- 2. El constraint ya no es necesario - la validación se hará en el frontend
-- Los usuarios PERSONAL deben tener specialty, pero pueden agregarlo después

-- 3. Ahora puedes cambiar el rol sin problemas:
-- UPDATE users SET role = 'PERSONAL' WHERE email = 'tu_email@example.com';

-- 4. OPCIONAL: Si quieres mantener cierta validación, puedes crear un trigger
-- que envíe una advertencia pero no bloquee el cambio:

CREATE OR REPLACE FUNCTION warn_missing_specialty()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'PERSONAL' AND NEW.specialty IS NULL THEN
        RAISE WARNING 'Usuario con rol PERSONAL debe completar su especialidad';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_specialty_warning
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION warn_missing_specialty();

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
