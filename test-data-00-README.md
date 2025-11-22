# 📋 Scripts de Datos de Prueba - IPS Virtual

## 📦 Orden de Ejecución

Ejecuta los scripts **en este orden exacto** en el SQL Editor de Supabase:

### 🔐 Prerequisito: Crear Usuarios en Authentication

Antes de ejecutar cualquier script, crea estos 3 usuarios en **Supabase Dashboard → Authentication → Users**:

| Email | Password | Rol |
|-------|----------|-----|
| `dra.martinez@ips-virtual.com` | `Test123!` | Psicólogo |
| `carlos.rodriguez@email.com` | `Test123!` | Paciente |
| `laura.gomez@email.com` | `Test123!` | Paciente |

**Importante:** Marca "Auto Confirm User" para cada uno.

---

### 📝 Scripts SQL (Ejecutar en orden)

1. **`test-data-01-users.sql`**
   - ✅ 3 usuarios (1 psicólogo, 2 pacientes)
   - Verifica UUIDs de auth.users
   - Crea perfiles completos

2. **`test-data-02-services.sql`**
   - ✅ 3 servicios de Psicología Clínica
   - Consulta Individual ($120,000)
   - Terapia Cognitivo Conductual ($150,000)
   - Evaluación Psicológica ($200,000)

3. **`test-data-03-appointments-carlos.sql`**
   - ✅ 5 citas de Carlos (Ansiedad F41.1)
   - 2 completadas con diagnóstico
   - 1 cancelada
   - 1 confirmada (en 3 días)
   - 1 pendiente (en 2 semanas)

4. **`test-data-04-appointments-laura.sql`**
   - ✅ 5 citas de Laura (Depresión F33.1)
   - 3 completadas con diagnóstico
   - 1 confirmada HOY
   - 1 pendiente (en 1 semana)

5. **`test-data-05-evolution-notes.sql`**
   - ✅ 5 notas de evolución clínica
   - 2 notas de Carlos (evolución ansiedad)
   - 3 notas de Laura (evolución depresión)

6. **`test-data-06-formulas.sql`**
   - ✅ 1 fórmula médica para Laura
   - Sertralina + Terapia + Mindfulness

7. **`test-data-07-notifications.sql`**
   - ✅ 7 notificaciones
   - 3 para psicólogo
   - 2 para Carlos
   - 2 para Laura

---

## ✅ Verificación Post-Ejecución

Cada script incluye una consulta de verificación al final. Resultados esperados:

```sql
-- Después de ejecutar todos los scripts:
USUARIOS CREADOS: 3
SERVICIOS CREADOS: 3
CITAS CARLOS: 5 (2 completadas, 1 cancelada, 1 confirmada, 1 pendiente)
CITAS LAURA: 5 (3 completadas, 1 confirmada, 1 pendiente)
NOTAS DE EVOLUCIÓN: 5
FÓRMULAS: 1
NOTIFICACIONES: 7
```

---

## 🧪 Pruebas Sugeridas

### Login y Dashboards
1. **Psicólogo** (`dra.martinez@ips-virtual.com`)
   - Dashboard con 10 citas totales
   - Cita HOY con Laura a las 14:00
   - 3 notificaciones sin leer

2. **Paciente Carlos** (`carlos.rodriguez@email.com`)
   - Historial: 2 citas completadas
   - Próxima cita: en 3 días (TCC virtual)
   - Diagnóstico: TAG (F41.1)

3. **Paciente Laura** (`laura.gomez@email.com`)
   - Historial: 3 citas completadas
   - Cita HOY a las 14:00
   - Fórmula activa con sertralina
   - Diagnóstico: Depresión Recurrente (F33.1)

---

## 🐛 Solución de Problemas

### Error: "Usuario no encontrado en auth.users"
- Verifica que creaste los 3 usuarios en Authentication
- Confirma los emails exactos
- Marca "Auto Confirm User"

### Error: "column does not exist"
- Verifica que tu schema esté actualizado
- Compara con `supabase_schema.sql`
- Ejecuta scripts de migración primero

### Error: "relation does not exist"
- Ejecuta `supabase_schema.sql` primero
- Verifica que todas las tablas existen

---

## 📊 Casos de Uso Cubiertos

✅ **Ansiedad Generalizada (F41.1)** - Carlos
- Primera consulta → Diagnóstico → Seguimiento → Mejoría
- Terapia Cognitivo-Conductual
- Técnicas de relajación y reestructuración cognitiva

✅ **Depresión Recurrente (F33.1)** - Laura
- Evaluación completa → Tratamiento farmacológico → Evolución favorable
- Coordinación con psiquiatría
- Activación conductual + TCC

✅ **Estados de Citas**
- Completadas (con diagnóstico JSONB)
- Confirmadas (próximas)
- Pendientes (futuras)
- Canceladas (con motivo)

✅ **Formulas Médicas**
- Medicamentos JSONB
- Observaciones clínicas
- Fecha de expiración

✅ **Notificaciones en Tiempo Real**
- Nuevas citas
- Confirmaciones
- Recordatorios
- Fórmulas disponibles

---

## 🔄 Limpieza de Datos

Para eliminar todos los datos de prueba:

```sql
-- ADVERTENCIA: Esto eliminará TODOS los datos de prueba
BEGIN;

DELETE FROM notifications WHERE user_id IN (
  SELECT id FROM users WHERE email IN ('dra.martinez@ips-virtual.com', 'carlos.rodriguez@email.com', 'laura.gomez@email.com')
);

DELETE FROM formulas WHERE doctor_name = 'Dra. María Alejandra Martínez';

DELETE FROM evolution_notes WHERE doctor_id = (
  SELECT id FROM auth.users WHERE email = 'dra.martinez@ips-virtual.com'
);

DELETE FROM appointments WHERE doctor_name = 'Dra. María Alejandra Martínez';

DELETE FROM services WHERE specialty = 'Psicología Clínica';

DELETE FROM users WHERE email IN ('dra.martinez@ips-virtual.com', 'carlos.rodriguez@email.com', 'laura.gomez@email.com');

COMMIT;
```

---

## 📅 Fechas Relativas

Todos los scripts usan `CURRENT_DATE` para fechas dinámicas:

- **Pasado:** `INTERVAL '2 months'`, `'1 month'`, `'2 weeks'`
- **Presente:** `CURRENT_DATE`, `NOW()`
- **Futuro:** `INTERVAL '3 days'`, `'1 week'`, `'2 weeks'`

Esto garantiza que los datos siempre sean relevantes sin importar cuándo ejecutes los scripts.

---

## 🎯 Próximos Pasos

Después de ejecutar todos los scripts:

1. ✅ Inicia sesión con cada usuario
2. ✅ Verifica que el dashboard muestre los datos correctos
3. ✅ Prueba las notificaciones en tiempo real
4. ✅ Verifica el historial clínico
5. ✅ Comprueba que las fórmulas se muestran correctamente
6. ✅ Testea la persistencia de city_id en el perfil

---

**¡Listo para testing! 🚀**
