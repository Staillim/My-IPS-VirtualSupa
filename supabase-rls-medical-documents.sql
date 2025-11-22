-- Políticas RLS para medical_documents

-- Política para que pacientes puedan ver sus propios documentos
DROP POLICY IF EXISTS "Pacientes pueden ver sus documentos" ON medical_documents;
CREATE POLICY "Pacientes pueden ver sus documentos"
ON medical_documents
FOR SELECT
TO authenticated
USING (patient_id = auth.uid());

-- Política para que médicos puedan ver documentos que ellos subieron
DROP POLICY IF EXISTS "Médicos pueden ver documentos que subieron" ON medical_documents;
CREATE POLICY "Médicos pueden ver documentos que subieron"
ON medical_documents
FOR SELECT
TO authenticated
USING (
  uploaded_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'PERSONAL'
  )
);

-- Política para que médicos puedan subir documentos
DROP POLICY IF EXISTS "Médicos pueden subir documentos" ON medical_documents;
CREATE POLICY "Médicos pueden subir documentos"
ON medical_documents
FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'PERSONAL'
  )
);

-- Política para que pacientes puedan subir sus propios documentos
DROP POLICY IF EXISTS "Pacientes pueden subir sus documentos" ON medical_documents;
CREATE POLICY "Pacientes pueden subir sus documentos"
ON medical_documents
FOR INSERT
TO authenticated
WITH CHECK (
  patient_id = auth.uid()
  AND uploaded_by = auth.uid()
);

-- Política para que quien subió el documento pueda eliminarlo
DROP POLICY IF EXISTS "Usuario puede eliminar documentos que subió" ON medical_documents;
CREATE POLICY "Usuario puede eliminar documentos que subió"
ON medical_documents
FOR DELETE
TO authenticated
USING (uploaded_by = auth.uid());

-- Política para que administradores puedan ver todos los documentos
DROP POLICY IF EXISTS "Administradores pueden ver todos los documentos" ON medical_documents;
CREATE POLICY "Administradores pueden ver todos los documentos"
ON medical_documents
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'ADMIN'
  )
);

-- Política para que administradores puedan eliminar cualquier documento
DROP POLICY IF EXISTS "Administradores pueden eliminar documentos" ON medical_documents;
CREATE POLICY "Administradores pueden eliminar documentos"
ON medical_documents
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'ADMIN'
  )
);
