-- Políticas RLS para appointments - Admin

-- Eliminar política existente si hay
DROP POLICY IF EXISTS "Administradores pueden crear citas" ON appointments;

-- Política para que administradores puedan crear citas
CREATE POLICY "Administradores pueden crear citas"
ON appointments
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'ADMIN'
  )
);

-- Política para que administradores puedan ver todas las citas
DROP POLICY IF EXISTS "Administradores pueden ver todas las citas" ON appointments;
CREATE POLICY "Administradores pueden ver todas las citas"
ON appointments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'ADMIN'
  )
);

-- Política para que administradores puedan actualizar citas
DROP POLICY IF EXISTS "Administradores pueden actualizar citas" ON appointments;
CREATE POLICY "Administradores pueden actualizar citas"
ON appointments
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'ADMIN'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'ADMIN'
  )
);
