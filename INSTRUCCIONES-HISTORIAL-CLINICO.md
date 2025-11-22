# Instrucciones para Configurar el Historial Clínico Completo

## ⚠️ IMPORTANTE: Roles en el Sistema

El sistema usa estos roles (definidos en el enum `user_role`):
- `'ADMIN'` - Administradores
- `'PERSONAL'` - Médicos y personal de salud
- `'PACIENTE'` - Pacientes

**Nota:** En el código y políticas se usa `'PERSONAL'` NO `'MEDICO'`.

## Archivos SQL a Ejecutar

Debes ejecutar los siguientes archivos SQL en el **SQL Editor de Supabase** en el siguiente orden:

### 1. Crear Tablas

#### `supabase-create-evolution-notes.sql`
Crea la tabla `evolution_notes` para almacenar las notas de evolución médica.

**Qué hace:**
- Crea la tabla con campos: id, patient_id, doctor_id, appointment_id, note, date, created_at, updated_at
- Crea índices para optimizar las consultas
- Habilita Row Level Security (RLS)
- Crea trigger para actualizar `updated_at` automáticamente

#### `supabase-create-medical-documents.sql`
Crea la tabla `medical_documents` para almacenar documentos y estudios médicos.

**Qué hace:**
- Crea la tabla con campos: id, patient_id, uploaded_by, appointment_id, document_name, document_type, document_url, file_size, notes, uploaded_at, created_at
- Crea índices para optimizar las consultas
- Habilita Row Level Security (RLS)

### 2. Crear Políticas RLS

#### `supabase-rls-evolution-notes.sql`
Crea las políticas de seguridad para la tabla `evolution_notes`.

**Políticas:**
- Pacientes pueden ver sus propias notas
- Médicos pueden ver las notas que ellos crearon
- Médicos pueden crear nuevas notas
- Médicos pueden actualizar sus propias notas
- Administradores pueden ver todas las notas

#### **4️⃣ `supabase-rls-medical-documents.sql`**
Crea las políticas de seguridad para la tabla `medical_documents`.

**Políticas:**
- Pacientes pueden ver sus propios documentos
- Médicos pueden ver documentos que ellos subieron
- Médicos pueden subir documentos
- Pacientes pueden subir sus propios documentos
- Usuarios pueden eliminar documentos que subieron
- Administradores pueden ver y eliminar cualquier documento

#### **5️⃣ `supabase-add-document-notification-type.sql`**
Agrega el tipo de notificación para documentos subidos.

**Qué hace:**
- Agrega 'document_uploaded' al enum notification_type
- Permite enviar notificaciones cuando se sube un documento

### 3. (OPCIONAL) Políticas de Administrador para Citas

#### `supabase-rls-appointments-admin.sql`
Si aún no lo has ejecutado, este archivo crea políticas para que los administradores puedan crear citas.

## Pasos para Ejecutar

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard/project/mqwqpgstapsjqmprsnsb
2. En el menú lateral, haz clic en **SQL Editor**
3. Haz clic en **New Query**
4. Copia y pega el contenido de cada archivo SQL en orden
5. Haz clic en **Run** para ejecutar
6. Repite para cada archivo

## Orden de Ejecución Recomendado

```
1. supabase-create-evolution-notes.sql
2. supabase-create-medical-documents.sql
3. supabase-rls-evolution-notes.sql
4. supabase-rls-medical-documents.sql
5. supabase-add-document-notification-type.sql
6. supabase-rls-appointments-admin.sql (si aún no lo ejecutaste)
```

## Verificación

Después de ejecutar todos los archivos, puedes verificar que todo funcione:

1. **Completar una consulta como médico:**
   - Ve a `/dashboard/personal/citas`
   - Completa una consulta de prueba
   - Llena el diagnóstico Y la nota de evolución médica
   - Guarda la consulta

2. **Ver el historial como paciente:**
   - Inicia sesión como el paciente de esa consulta
   - Ve a `/dashboard/historial`
   - Deberías ver:
     - ✅ Diagnósticos (sección "Antecedentes")
     - ✅ Notas de Evolución Médica (sección nueva)
     - ✅ Documentos y Estudios Anexos (vacío por ahora, se llenará cuando se implemente carga de archivos)

## Cambios en el Código

### `src/app/dashboard/personal/citas/page.tsx`
- ✅ Agregado campo `evolutionNote` al estado
- ✅ Agregado campo "Nota de Evolución Médica" al formulario de completar consulta
- ✅ Agregada validación para que la nota sea obligatoria
- ✅ Modificado `handleCompleteConsultation` para guardar la nota en la tabla `evolution_notes`

### `src/app/dashboard/historial/page.tsx`
- ✅ Agregado query para cargar `evolution_notes` con JOIN a `users` para obtener nombre del doctor
- ✅ Agregado query para cargar `medical_documents` con JOIN a `users` para obtener nombre de quien subió
- ✅ Actualizado el renderizado de "Notas de Evolución Médica" para mostrar datos reales
- ✅ Actualizado el renderizado de "Documentos y Estudios Anexos" para mostrar datos reales
- ✅ Agregados skeletons de carga para ambas secciones

## ✅ Funcionalidad de Carga de Documentos (IMPLEMENTADO)

La funcionalidad de **carga de documentos** está completamente implementada en `/dashboard/personal/pacientes`:

### Características:
- ✅ **Conversión a Base64**: Los archivos se convierten automáticamente a base64 y se guardan en la base de datos
- ✅ **Validación de tipo**: Solo se permiten archivos PDF, imágenes (JPG, PNG), Word, Excel y texto
- ✅ **Validación de tamaño**: Máximo 10MB por archivo
- ✅ **Notas opcionales**: El médico puede agregar notas descriptivas al documento
- ✅ **Detección automática de tipo**: El sistema detecta automáticamente el tipo según la extensión
- ✅ **Notificaciones**: El paciente recibe notificación cuando se sube un documento
- ✅ **Vista previa**: Los documentos base64 se pueden abrir en nueva pestaña

### Formatos Soportados:
- 📄 PDF
- 🖼️ Imágenes (JPG, JPEG, PNG)
- 📝 Word (DOC, DOCX)
- 📊 Excel (XLS, XLSX)
- 📄 Texto plano (TXT)

## Notas Importantes

- Las **notas de evolución médica** son obligatorias al completar una consulta
- Solo los **médicos** pueden crear y editar notas de evolución
- Los **pacientes** pueden ver todas sus notas y documentos
- Los **administradores** tienen acceso completo a todas las notas y documentos
- Los documentos aún no se pueden subir desde la interfaz (funcionalidad futura)
