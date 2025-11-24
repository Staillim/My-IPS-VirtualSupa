-- =====================================================
-- FUNCIÓN PARA EXPIRAR CITAS VENCIDAS AUTOMÁTICAMENTE
-- =====================================================
-- Esta función se ejecuta con privilegios de SECURITY DEFINER
-- para evitar problemas con RLS

-- IMPORTANTE: Primero eliminar la función anterior si existe
DROP FUNCTION IF EXISTS expire_old_appointments();

-- Crear la función (retorna el número de citas actualizadas)
CREATE OR REPLACE FUNCTION expire_old_appointments()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  UPDATE appointments
  SET status = 'expirada',
      updated_at = NOW()
  WHERE status IN ('pendiente', 'confirmada')
    AND date < CURRENT_DATE;
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows;
END;
$$;

-- Otorgar permisos de ejecución
GRANT EXECUTE ON FUNCTION expire_old_appointments() TO authenticated;

-- Comentario
COMMENT ON FUNCTION expire_old_appointments() IS 'Marca como expiradas las citas pendientes o confirmadas cuya fecha ya pasó';
