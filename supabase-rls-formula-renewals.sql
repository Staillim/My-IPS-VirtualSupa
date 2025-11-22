-- Políticas RLS para formula_renewal_requests

-- Eliminar políticas existentes si hay
DROP POLICY IF EXISTS "Pacientes pueden crear solicitudes de renovación" ON formula_renewal_requests;
DROP POLICY IF EXISTS "Pacientes pueden ver sus propias solicitudes" ON formula_renewal_requests;
DROP POLICY IF EXISTS "Médicos pueden ver solicitudes dirigidas a ellos" ON formula_renewal_requests;
DROP POLICY IF EXISTS "Médicos pueden actualizar solicitudes dirigidas a ellos" ON formula_renewal_requests;

-- Habilitar RLS
ALTER TABLE formula_renewal_requests ENABLE ROW LEVEL SECURITY;

-- Política para que pacientes puedan crear solicitudes
CREATE POLICY "Pacientes pueden crear solicitudes de renovación"
ON formula_renewal_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = patient_id);

-- Política para que pacientes puedan ver sus propias solicitudes
CREATE POLICY "Pacientes pueden ver sus propias solicitudes"
ON formula_renewal_requests
FOR SELECT
TO authenticated
USING (auth.uid() = patient_id);

-- Política para que médicos puedan ver solicitudes dirigidas a ellos
CREATE POLICY "Médicos pueden ver solicitudes dirigidas a ellos"
ON formula_renewal_requests
FOR SELECT
TO authenticated
USING (auth.uid() = doctor_id);

-- Política para que médicos puedan actualizar solicitudes dirigidas a ellos
CREATE POLICY "Médicos pueden actualizar solicitudes dirigidas a ellos"
ON formula_renewal_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = doctor_id)
WITH CHECK (auth.uid() = doctor_id);
