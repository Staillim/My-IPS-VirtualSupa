-- Políticas RLS para evolution_notes

-- Política para que pacientes puedan ver sus propias notas de evolución
DROP POLICY IF EXISTS "Pacientes pueden ver sus notas de evolución" ON evolution_notes;
CREATE POLICY "Pacientes pueden ver sus notas de evolución"
ON evolution_notes
FOR SELECT
TO authenticated
USING (patient_id = auth.uid());

-- Política para que médicos puedan ver las notas que ellos crearon
DROP POLICY IF EXISTS "Médicos pueden ver sus propias notas" ON evolution_notes;
CREATE POLICY "Médicos pueden ver sus propias notas"
ON evolution_notes
FOR SELECT
TO authenticated
USING (
  doctor_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'PERSONAL'
  )
);

-- Política para que médicos puedan crear notas de evolución
DROP POLICY IF EXISTS "Médicos pueden crear notas de evolución" ON evolution_notes;
CREATE POLICY "Médicos pueden crear notas de evolución"
ON evolution_notes
FOR INSERT
TO authenticated
WITH CHECK (
  doctor_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'PERSONAL'
  )
);

-- Política para que médicos puedan actualizar sus propias notas
DROP POLICY IF EXISTS "Médicos pueden actualizar sus propias notas" ON evolution_notes;
CREATE POLICY "Médicos pueden actualizar sus propias notas"
ON evolution_notes
FOR UPDATE
TO authenticated
USING (
  doctor_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'PERSONAL'
  )
)
WITH CHECK (
  doctor_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'PERSONAL'
  )
);

-- Política para que administradores puedan ver todas las notas
DROP POLICY IF EXISTS "Administradores pueden ver todas las notas de evolución" ON evolution_notes;
CREATE POLICY "Administradores pueden ver todas las notas de evolución"
ON evolution_notes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'ADMIN'
  )
);
