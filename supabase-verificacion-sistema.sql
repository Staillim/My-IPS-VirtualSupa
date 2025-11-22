-- Script de Verificación del Estado del Sistema
-- Ejecuta este script en Supabase SQL Editor para verificar que todo está configurado correctamente

-- ============================================
-- 1. VERIFICAR QUE TODAS LAS TABLAS EXISTEN
-- ============================================
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'users' THEN '✅ Core - Usuarios'
        WHEN table_name = 'appointments' THEN '✅ Core - Citas'
        WHEN table_name = 'formulas' THEN '✅ Core - Fórmulas'
        WHEN table_name = 'formula_renewal_requests' THEN '✅ Core - Renovaciones'
        WHEN table_name = 'notifications' THEN '✅ Core - Notificaciones'
        WHEN table_name = 'services' THEN '✅ Core - Servicios'
        WHEN table_name = 'evolution_notes' THEN '🆕 NUEVO - Notas de Evolución'
        WHEN table_name = 'medical_documents' THEN '🆕 NUEVO - Documentos Médicos'
        ELSE '❓ Otra tabla'
    END as descripcion
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN (
        'users', 'appointments', 'formulas', 'formula_renewal_requests', 
        'notifications', 'services', 'evolution_notes', 'medical_documents'
    )
ORDER BY 
    CASE 
        WHEN table_name IN ('evolution_notes', 'medical_documents') THEN 1 
        ELSE 0 
    END DESC,
    table_name;

-- ============================================
-- 2. VERIFICAR COLUMNAS DE EVOLUTION_NOTES
-- ============================================
SELECT 
    '🔍 Verificando evolution_notes' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'evolution_notes'
ORDER BY ordinal_position;

-- Debe mostrar: id, patient_id, doctor_id, appointment_id, note, date, created_at, updated_at

-- ============================================
-- 3. VERIFICAR COLUMNAS DE MEDICAL_DOCUMENTS
-- ============================================
SELECT 
    '🔍 Verificando medical_documents' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'medical_documents'
ORDER BY ordinal_position;

-- Debe mostrar: id, patient_id, uploaded_by, appointment_id, document_name, document_type, document_url, file_size, notes, uploaded_at, created_at

-- ============================================
-- 4. VERIFICAR POLÍTICAS RLS
-- ============================================
SELECT 
    schemaname,
    tablename,
    policyname,
    CASE 
        WHEN tablename = 'evolution_notes' THEN '🆕 NUEVO'
        WHEN tablename = 'medical_documents' THEN '🆕 NUEVO'
        WHEN tablename = 'appointments' AND policyname LIKE '%Admin%' THEN '🔧 MEJORADO'
        ELSE '✅ Existente'
    END as estado,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('evolution_notes', 'medical_documents', 'appointments', 'formula_renewal_requests')
ORDER BY 
    tablename,
    policyname;

-- ============================================
-- 5. VERIFICAR VALORES DEL ENUM user_role
-- ============================================
SELECT 
    '📋 Valores válidos para user_role' as info,
    enumlabel as valor,
    CASE 
        WHEN enumlabel = 'ADMIN' THEN '👨‍💼 Administrador'
        WHEN enumlabel = 'PERSONAL' THEN '👨‍⚕️ Médico/Personal (NO es MEDICO)'
        WHEN enumlabel = 'PACIENTE' THEN '👤 Paciente'
        ELSE '❓ Desconocido'
    END as descripcion
FROM pg_enum
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;

-- ============================================
-- 6. CONTAR REGISTROS EN TABLAS NUEVAS
-- ============================================
SELECT 
    '📊 Conteo de registros' as info,
    (SELECT COUNT(*) FROM evolution_notes) as notas_evolucion,
    (SELECT COUNT(*) FROM medical_documents) as documentos_medicos,
    (SELECT COUNT(*) FROM appointments WHERE status = 'completada') as consultas_completadas;

-- ============================================
-- 7. VERIFICAR FOREIGN KEYS
-- ============================================
SELECT
    '🔗 Foreign Keys de evolution_notes' as info,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'evolution_notes'
    AND tc.constraint_type = 'FOREIGN KEY';

-- Debe mostrar referencias a: users (patient_id, doctor_id) y appointments (appointment_id)

-- ============================================
-- 8. VERIFICAR ÍNDICES
-- ============================================
SELECT
    '📇 Índices de evolution_notes' as info,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'evolution_notes'
ORDER BY indexname;

-- Debe mostrar índices en: patient_id, doctor_id, appointment_id, date

-- ============================================
-- 9. VERIFICAR TRIGGERS
-- ============================================
SELECT
    '⚡ Triggers de evolution_notes' as info,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'evolution_notes';

-- Debe mostrar: trigger_update_evolution_notes_updated_at

-- ============================================
-- 10. TEST RÁPIDO DE PERMISOS (Opcional)
-- ============================================
-- Descomenta estas líneas si quieres probar permisos RLS
-- IMPORTANTE: Cambia '<tu_user_id>' por un ID real de tu tabla users

-- SET request.jwt.claims = '{"sub": "<tu_user_id>"}';
-- SET ROLE authenticated;
-- SELECT * FROM evolution_notes; -- Debería funcionar solo con tus notas
-- RESET ROLE;

-- ============================================
-- RESUMEN FINAL
-- ============================================
SELECT 
    '✅ RESUMEN DEL SISTEMA' as "╔════════════════════════════════╗",
    '' as "║",
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'evolution_notes')
        THEN '✅ evolution_notes creada'
        ELSE '❌ evolution_notes NO existe'
    END as tabla_evolution_notes,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'medical_documents')
        THEN '✅ medical_documents creada'
        ELSE '❌ medical_documents NO existe'
    END as tabla_medical_documents,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'evolution_notes')
        THEN '✅ Políticas RLS configuradas'
        ELSE '⚠️ Faltan políticas RLS'
    END as politicas_rls,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'evolution_notes') = 8
        THEN '✅ Todas las columnas presentes'
        ELSE '⚠️ Faltan columnas'
    END as columnas_evolution_notes;

-- Si todo muestra ✅ → Sistema listo para usar
-- Si hay ❌ o ⚠️ → Revisa los archivos SQL y ejecútalos
