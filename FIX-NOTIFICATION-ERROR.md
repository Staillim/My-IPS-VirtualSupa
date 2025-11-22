# 🔧 Solución de Error: Notificaciones (Error 400)

## 🔴 Problema Identificado

**Error en consola:**
```
Failed to load resource: the server responded with a status of 400 ()
Error creating notification: Object
```

**Causa raíz:**
El código intenta crear notificaciones con tipos (`video_call_ready`, `document_uploaded`, `reschedule_accepted`) que **no existen** en el enum `notification_type` de la base de datos PostgreSQL en Supabase.

## 📋 Tipos de Notificación Faltantes

Los siguientes tipos están siendo usados en el código pero no están definidos en la base de datos:

1. ✖️ **`video_call_ready`** - Usado en: `src/app/dashboard/personal/citas/page.tsx` (línea 723)
   - Se envía cuando un médico comparte el enlace de videollamada
   
2. ✖️ **`document_uploaded`** - Usado en: `src/app/dashboard/personal/pacientes/page.tsx` (línea 198)
   - Se envía cuando un médico sube un documento al historial del paciente
   
3. ✖️ **`reschedule_accepted`** - Usado en: `src/app/dashboard/citas/page.tsx` (línea 267)
   - Se envía cuando se acepta una reprogramación de cita

## ✅ Solución

### ⚠️ IMPORTANTE: Ejecutar en 3 pasos separados

PostgreSQL requiere que cada valor de enum sea ejecutado en transacciones separadas.

### Paso 1: Agregar 'video_call_ready'

1. Abre **Supabase Dashboard** → **SQL Editor**
2. Copia y pega el contenido de **`supabase-add-notification-step1.sql`**:
   ```sql
   ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'video_call_ready';
   ```
3. Haz clic en **Run** ✅
4. **Espera** a que complete antes de continuar

### Paso 2: Agregar 'document_uploaded'

1. En el mismo **SQL Editor**
2. Copia y pega el contenido de **`supabase-add-notification-step2.sql`**:
   ```sql
   ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'document_uploaded';
   ```
3. Haz clic en **Run** ✅
4. **Espera** a que complete antes de continuar

### Paso 3: Agregar 'reschedule_accepted'

1. En el mismo **SQL Editor**
2. Copia y pega el contenido de **`supabase-add-notification-step3.sql`**:
   ```sql
   ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'reschedule_accepted';
   ```
3. Haz clic en **Run** ✅

### Paso 4: Verificar la Solución

Después de ejecutar los 3 pasos, verifica que los tipos se agregaron:

```sql
SELECT enum_range(NULL::notification_type);
```

**Resultado esperado:**
```
{
  appointment_confirmed,
  appointment_cancelled,
  appointment_rescheduled,
  reschedule_request,
  diagnosis_ready,
  formula_created,
  formula_renewed,
  note_added,
  new_message,
  renewal_approved,
  renewal_rejected,
  renewal_requested,
  video_call_ready,          ← NUEVO
  document_uploaded,         ← NUEVO
  reschedule_accepted        ← NUEVO
}
```

### Paso 5: Probar las Funcionalidades

Una vez ejecutados los 3 scripts, prueba las siguientes funcionalidades:

**1. Video Call Ready:**
- Como **médico**: Ve a `/dashboard/personal/citas`
- Selecciona una cita y envía un enlace de videollamada
- Verifica que el paciente reciba la notificación ✅

**2. Document Uploaded:**
- Como **médico**: Ve a `/dashboard/personal/pacientes`
- Selecciona un paciente y sube un documento
- Verifica que el paciente reciba la notificación ✅

**3. Reschedule Accepted:**
- Como **paciente**: Solicita reprogramar una cita
- Como **médico**: Acepta la reprogramación
- Verifica que el paciente reciba la notificación ✅

## 🔍 Tipos de Notificación Completos

Después de aplicar el fix, el sistema tendrá los siguientes tipos de notificación:

| Tipo | Descripción | Usuario Receptor | Funcionalidad |
|------|-------------|------------------|---------------|
| `appointment_confirmed` | Cita confirmada por el médico | Paciente | Gestión de citas |
| `appointment_cancelled` | Cita cancelada | Paciente/Médico | Gestión de citas |
| `appointment_rescheduled` | Cita reprogramada | Paciente/Médico | Gestión de citas |
| `reschedule_request` | Solicitud de reprogramación | Médico | Gestión de citas |
| `reschedule_accepted` | Reprogramación aceptada | Paciente | **NUEVO** - Gestión de citas |
| `diagnosis_ready` | Diagnóstico completado | Paciente | Historial clínico |
| `formula_created` | Nueva fórmula emitida | Paciente | Gestión de fórmulas |
| `formula_renewed` | Fórmula renovada | Paciente | Gestión de fórmulas |
| `renewal_approved` | Renovación aprobada | Paciente | Gestión de fórmulas |
| `renewal_rejected` | Renovación rechazada | Paciente | Gestión de fórmulas |
| `renewal_requested` | Solicitud de renovación | Médico | Gestión de fórmulas |
| `note_added` | Nota de evolución agregada | Paciente | Historial clínico |
| `document_uploaded` | Documento médico subido | Paciente | **NUEVO** - Historial clínico |
| `video_call_ready` | Enlace de videollamada listo | Paciente | **NUEVO** - Telemedicina |
| `new_message` | Nuevo mensaje | Usuario | Mensajería |

## 🚨 Prevención de Errores Futuros

### Checklist antes de agregar nuevas notificaciones:

1. **Verificar el enum en la base de datos:**
   ```sql
   SELECT enum_range(NULL::notification_type);
   ```

2. **Si el tipo no existe, agregarlo:**
   ```sql
   ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'nuevo_tipo';
   ```

3. **Crear una migración SQL** documentada en la carpeta raíz

4. **Documentar el nuevo tipo** en este archivo

## 📝 Archivos Relacionados

- **SQL Script:** `supabase-add-missing-notification-types.sql`
- **Schema Original:** `supabase_schema.sql` (línea 58 - definición del enum)
- **Código que usa notificaciones:**
  - `src/app/dashboard/personal/citas/page.tsx` (video_call_ready)
  - `src/app/dashboard/personal/pacientes/page.tsx` (document_uploaded)
  - `src/app/dashboard/citas/page.tsx` (reschedule_accepted)

## ✅ Verificación Final

Después de ejecutar el script, abre la consola del navegador y verifica que **NO aparezcan** errores como:

❌ `Failed to load resource: the server responded with a status of 400`
❌ `Error creating notification: Object`

✅ Las notificaciones se crean correctamente
✅ Los pacientes reciben las notificaciones en tiempo real
✅ El contador de notificaciones se actualiza

---

## 🎯 Resumen

**Problema:** Tipos de notificación faltantes en el enum de PostgreSQL  
**Solución:** Ejecutar `supabase-add-missing-notification-types.sql`  
**Tiempo estimado:** 2 minutos  
**Estado:** ✅ Listo para ejecutar  

---

<div align="center">

**Fecha de creación:** Noviembre 2025  
**IPS Virtual** - Sistema Integral de Gestión Médica

</div>
