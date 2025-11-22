-- Agregar política para que ADMIN pueda actualizar usuarios
-- Ejecuta este archivo en Supabase SQL Editor

-- Permitir que los administradores actualicen cualquier perfil de usuario
CREATE POLICY "Admins can update any user profile" ON users
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- Verificar las políticas de la tabla users
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
