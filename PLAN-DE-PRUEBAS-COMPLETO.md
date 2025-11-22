# 🧪 Plan de Pruebas Completo - IPS Virtual (Supabase)

## 📋 Checklist de Verificación por Rol

### ✅ **PREREQUISITOS - EJECUTAR SQL**
Antes de probar, asegúrate de ejecutar estos archivos SQL en orden:

- [ ] `supabase-fix-evolution-notes.sql`
- [ ] `supabase-fix-medical-documents.sql`
- [ ] `supabase-rls-evolution-notes.sql`
- [ ] `supabase-rls-medical-documents.sql`
- [ ] `supabase-rls-appointments-admin.sql`

---

## 👤 **PRUEBAS COMO PACIENTE**

### 1. Autenticación y Perfil
- [ ] **Login**: Inicia sesión con credenciales de paciente
- [ ] **Dashboard**: `/dashboard` - Verifica que se muestre el dashboard de paciente
- [ ] **Perfil**: `/dashboard/perfil`
  - [ ] Ver información personal
  - [ ] Editar foto de perfil
  - [ ] Cambiar contraseña
  - [ ] Actualizar información de contacto

### 2. Citas Médicas
- [ ] **Ver Citas**: `/dashboard/citas`
  - [ ] Ver lista de citas pendientes
  - [ ] Ver lista de citas confirmadas
  - [ ] Ver lista de citas completadas
  - [ ] Ver lista de citas canceladas
- [ ] **Solicitar Cita**: 
  - [ ] Crear nueva solicitud de cita
  - [ ] Seleccionar servicio médico
  - [ ] Seleccionar fecha y hora
  - [ ] Agregar observaciones
  - [ ] Verificar notificación de cita creada

### 3. Médicos
- [ ] **Ver Médicos**: `/dashboard/medicos`
  - [ ] Ver lista de médicos disponibles
  - [ ] Ver especialidades
  - [ ] Ver información de contacto
  - [ ] Filtrar por especialidad

### 4. Fórmulas Médicas
- [ ] **Ver Fórmulas**: `/dashboard/formulas`
  - [ ] Ver fórmulas activas
  - [ ] Ver fórmulas vencidas
  - [ ] Ver detalles de cada fórmula
  - [ ] Descargar fórmula en PDF
  - [ ] **Solicitar Renovación**: 
    - [ ] Abrir diálogo de renovación
    - [ ] Agregar motivo de renovación
    - [ ] Enviar solicitud
    - [ ] Verificar notificación enviada

### 5. Historial Clínico
- [ ] **Ver Historial**: `/dashboard/historial`
  - [ ] **Resumen del Paciente**: Ver edad, tipo de sangre, alergias
  - [ ] **Antecedentes**: Ver diagnósticos de consultas completadas
  - [ ] **Diagnósticos y Consultas**: 
    - [ ] Ver diagnósticos recientes con código CIE-10
    - [ ] Ver lista de consultas anteriores
    - [ ] Descargar diagnóstico en PDF
  - [ ] **Notas de Evolución Médica**: Ver notas creadas por médicos (NUEVA FUNCIONALIDAD)
  - [ ] **Documentos y Estudios Anexos**: Ver documentos médicos (vacío por ahora)
  - [ ] **Descargar Resumen Completo en PDF**

### 6. Notificaciones
- [ ] **Ver Notificaciones**: `/dashboard/notificaciones`
  - [ ] Ver notificaciones no leídas
  - [ ] Marcar como leída
  - [ ] Ver notificaciones de:
    - [ ] Cita confirmada
    - [ ] Cita cancelada
    - [ ] Diagnóstico listo
    - [ ] Fórmula creada
    - [ ] Renovación aprobada/rechazada

---

## 👨‍⚕️ **PRUEBAS COMO MÉDICO (PERSONAL)**

### 1. Dashboard y Perfil
- [ ] **Login**: Inicia sesión con credenciales de médico (rol PERSONAL)
- [ ] **Dashboard**: `/dashboard` - Verifica dashboard de médico
- [ ] **Perfil**: `/dashboard/perfil`
  - [ ] Actualizar especialidad
  - [ ] Actualizar foto de perfil
  - [ ] Actualizar firma digital (si aplica)

### 2. Gestión de Citas
- [ ] **Ver Citas**: `/dashboard/personal/citas`
  - [ ] Ver citas del día
  - [ ] Ver calendario de citas
  - [ ] Filtrar por:
    - [ ] Estado (pendiente, confirmada, en curso, completada)
    - [ ] Fecha
    - [ ] Paciente (búsqueda)
  - [ ] Ver detalles de cada cita con información del paciente

### 3. Completar Consulta (NUEVA FUNCIONALIDAD)
- [ ] **Completar Consulta**: Desde `/dashboard/personal/citas`
  - [ ] Abrir diálogo "Completar Consulta"
  - [ ] **Llenar Diagnóstico**:
    - [ ] Ingresar código CIE-10 (opcional)
    - [ ] Ingresar descripción del diagnóstico (obligatorio)
    - [ ] Ingresar tratamiento recomendado
  - [ ] **Llenar Nota de Evolución Médica** (obligatorio, NUEVO):
    - [ ] Ingresar nota detallada de evolución
    - [ ] Verificar mensaje de validación si está vacía
  - [ ] **Emitir Fórmula Médica** (opcional):
    - [ ] Activar checkbox "Emitir Fórmula Médica"
    - [ ] Agregar medicamentos (nombre y dosis)
    - [ ] Agregar observaciones
    - [ ] Seleccionar fecha de vencimiento
  - [ ] **Guardar Consulta**:
    - [ ] Verificar que la cita cambie a "completada"
    - [ ] Verificar notificación enviada al paciente
    - [ ] Verificar que se guardó diagnóstico
    - [ ] Verificar que se guardó nota de evolución (NUEVO)
    - [ ] Verificar que se creó fórmula (si se incluyó)

### 4. Gestión de Pacientes
- [ ] **Ver Pacientes**: `/dashboard/personal/pacientes`
  - [ ] Ver lista de pacientes
  - [ ] Buscar paciente por nombre
  - [ ] Ver historial de cada paciente
  - [ ] Ver datos de contacto

### 5. Fórmulas Médicas
- [ ] **Ver Fórmulas**: `/dashboard/personal/formulas`
  - [ ] Ver fórmulas emitidas por el médico
  - [ ] **Crear Fórmula Manual**:
    - [ ] Seleccionar paciente
    - [ ] Agregar medicamentos
    - [ ] Agregar observaciones
    - [ ] Seleccionar fecha de vencimiento
    - [ ] Guardar fórmula
  - [ ] **Gestionar Solicitudes de Renovación**:
    - [ ] Ver solicitudes pendientes
    - [ ] Ver información del paciente solicitante (foto, nombre, email)
    - [ ] Ver motivo de renovación
    - [ ] **Aprobar Renovación**:
      - [ ] Revisar medicamentos
      - [ ] Ajustar dosis si es necesario
      - [ ] Aprobar y crear nueva fórmula
      - [ ] Verificar notificación enviada
    - [ ] **Rechazar Renovación**:
      - [ ] Ingresar motivo de rechazo
      - [ ] Enviar rechazo
      - [ ] Verificar notificación enviada

### 6. Servicios
- [ ] **Ver Servicios**: `/dashboard/personal/servicios`
  - [ ] Ver servicios médicos disponibles
  - [ ] Ver turnos asignados

---

## 👨‍💼 **PRUEBAS COMO ADMINISTRADOR (ADMIN)**

### 1. Dashboard Administrativo
- [ ] **Login**: Inicia sesión con credenciales de admin (rol ADMIN)
- [ ] **Dashboard**: `/dashboard/admin`
  - [ ] Ver estadísticas generales
  - [ ] Ver métricas del sistema

### 2. Gestión de Citas (FUNCIONALIDAD MEJORADA)
- [ ] **Ver Citas**: `/dashboard/admin/citas`
  - [ ] Ver todas las citas del sistema
  - [ ] **Filtros Dinámicos** (MEJORADO):
    - [ ] Buscar por nombre de paciente (búsqueda en tiempo real)
    - [ ] Filtrar por médico (dropdown)
    - [ ] Filtrar por estado (todas/pendiente/confirmada/completada/cancelada/expirada)
    - [ ] Filtrar por fecha (calendario)
    - [ ] Combinar múltiples filtros simultáneamente
  - [ ] **Crear Cita Manual** (MEJORADO):
    - [ ] Seleccionar paciente
    - [ ] Seleccionar médico
    - [ ] Seleccionar servicio
    - [ ] Seleccionar fecha (calendario)
    - [ ] **Seleccionar hora** (NUEVO: dropdown 08:00-17:00)
    - [ ] Agregar observaciones
    - [ ] Crear cita
    - [ ] Verificar que la lista se actualiza automáticamente
  - [ ] **Cancelar Cita**:
    - [ ] Abrir diálogo de cancelación
    - [ ] Ingresar motivo
    - [ ] Cancelar cita
    - [ ] Verificar actualización automática de la lista
  - [ ] **Reprogramar Cita**:
    - [ ] Seleccionar nueva fecha y hora
    - [ ] Ingresar motivo
    - [ ] Reprogramar
    - [ ] Verificar actualización automática

### 3. Gestión de Usuarios
- [ ] **Ver Usuarios**: `/dashboard/admin/pacientes`
  - [ ] Ver lista de pacientes
  - [ ] Ver información detallada
  - [ ] Buscar pacientes

- [ ] **Ver Médicos**: `/dashboard/admin/medicos`
  - [ ] Ver lista de médicos
  - [ ] Crear nuevo médico
  - [ ] Editar información de médico
  - [ ] Asignar especialidades

### 4. Servicios y Turnos
- [ ] **Gestión de Servicios**: `/dashboard/admin/servicios`
  - [ ] Ver servicios disponibles
  - [ ] Crear nuevo servicio
  - [ ] Editar servicio
  - [ ] Activar/desactivar servicio

- [ ] **Gestión de Turnos**: `/dashboard/admin/turnos`
  - [ ] Ver turnos de médicos
  - [ ] Crear turnos
  - [ ] Editar turnos
  - [ ] Asignar médicos a turnos

### 5. Fórmulas
- [ ] **Ver Fórmulas**: `/dashboard/admin/formulas`
  - [ ] Ver todas las fórmulas del sistema
  - [ ] Ver fórmulas por estado
  - [ ] Ver detalles de fórmulas

### 6. Estadísticas
- [ ] **Ver Estadísticas**: `/dashboard/admin/estadisticas`
  - [ ] Ver métricas de citas
  - [ ] Ver métricas de pacientes
  - [ ] Ver métricas de médicos
  - [ ] Ver gráficos de rendimiento

---

## 🔍 **PRUEBAS DE SEGURIDAD (RLS)**

### Políticas de Seguridad a Verificar

#### 1. Evolution Notes (NUEVO)
- [ ] **Paciente**: Puede ver solo SUS notas de evolución
- [ ] **Paciente**: NO puede ver notas de otros pacientes
- [ ] **Médico**: Puede ver notas que ÉL creó
- [ ] **Médico**: NO puede ver notas de otros médicos
- [ ] **Médico**: Puede crear notas para sus pacientes
- [ ] **Médico**: NO puede crear notas con doctor_id de otro médico
- [ ] **Admin**: Puede ver TODAS las notas de evolución

#### 2. Medical Documents (NUEVO)
- [ ] **Paciente**: Puede ver solo SUS documentos
- [ ] **Paciente**: Puede subir sus propios documentos (futuro)
- [ ] **Médico**: Puede ver documentos que ÉL subió
- [ ] **Médico**: Puede subir documentos para pacientes
- [ ] **Admin**: Puede ver TODOS los documentos
- [ ] **Admin**: Puede eliminar cualquier documento

#### 3. Appointments
- [ ] **Admin**: Puede crear citas para cualquier paciente (NUEVO)
- [ ] **Admin**: Puede ver todas las citas (NUEVO)
- [ ] **Admin**: Puede actualizar cualquier cita (NUEVO)
- [ ] **Paciente**: Solo puede ver SUS citas
- [ ] **Médico**: Solo puede ver citas donde ÉL es el doctor

#### 4. Formula Renewal Requests
- [ ] **Paciente**: Puede crear solicitudes de renovación
- [ ] **Paciente**: Puede ver SUS solicitudes
- [ ] **Médico**: Puede ver solicitudes dirigidas a ÉL
- [ ] **Médico**: Puede actualizar (aprobar/rechazar) solicitudes dirigidas a ÉL
- [ ] **Médico**: NO puede actualizar solicitudes de otros médicos

---

## 📱 **PRUEBAS DE UI/UX**

### Responsividad
- [ ] **Desktop** (1920x1080): Todas las páginas se ven correctamente
- [ ] **Tablet** (768x1024): Layout se adapta correctamente
- [ ] **Mobile** (375x667): Menú hamburguesa funciona, cards se apilan

### Componentes Dinámicos (NUEVO)
- [ ] **Filtros en Admin Citas**:
  - [ ] Escribir en búsqueda actualiza resultados en tiempo real
  - [ ] Cambiar dropdown actualiza resultados instantáneamente
  - [ ] Seleccionar fecha actualiza resultados
  - [ ] Múltiples filtros funcionan juntos correctamente
- [ ] **Calendarios Separados**:
  - [ ] Calendario de filtro NO interfiere con calendario de formulario
  - [ ] Cada calendario mantiene su propia fecha

### Skeletons de Carga (NUEVO)
- [ ] **Historial Clínico**: Muestra skeletons mientras carga:
  - [ ] Diagnósticos
  - [ ] Notas de evolución
  - [ ] Documentos médicos
- [ ] **Todas las listas**: Muestran skeletons mientras cargan datos

### Notificaciones Toast
- [ ] Éxito: Se muestran en verde
- [ ] Error: Se muestran en rojo
- [ ] Info: Se muestran en azul
- [ ] Se pueden cerrar manualmente
- [ ] Desaparecen automáticamente después de 5 segundos

---

## 🐛 **PRUEBAS DE MANEJO DE ERRORES**

### Validaciones de Formularios
- [ ] **Completar Consulta**:
  - [ ] Mostrar error si diagnóstico está vacío
  - [ ] **Mostrar error si nota de evolución está vacía** (NUEVO)
  - [ ] Mostrar error si incluye fórmula pero no hay medicamentos
  - [ ] Mostrar error si incluye fórmula pero no hay fecha de vencimiento

- [ ] **Crear Cita (Admin)**:
  - [ ] Mostrar error si falta paciente
  - [ ] Mostrar error si falta médico
  - [ ] Mostrar error si falta servicio
  - [ ] Mostrar error si falta fecha
  - [ ] **Mostrar error si falta hora** (NUEVO)

- [ ] **Solicitar Renovación**:
  - [ ] Mostrar error si motivo está vacío
  - [ ] Mostrar error si no se puede identificar la fórmula

### Errores de Base de Datos
- [ ] **Error al guardar nota de evolución**:
  - [ ] Mostrar toast con mensaje claro
  - [ ] Indicar que las tablas deben ser creadas
  - [ ] No perder datos del formulario

- [ ] **Error de permisos RLS**:
  - [ ] Mostrar mensaje 403 Forbidden de forma amigable
  - [ ] Indicar problema de permisos

---

## ✅ **CHECKLIST DE FUNCIONALIDADES NUEVAS**

### Historial Clínico Completo
- [ ] Sección "Notas de Evolución Médica" visible y funcional
- [ ] Notas muestran fecha, médico y contenido
- [ ] Sección "Documentos y Estudios Anexos" visible (vacía pero lista)
- [ ] Skeletons de carga funcionan correctamente
- [ ] Mensajes "vacío" se muestran cuando no hay datos

### Completar Consulta con Nota de Evolución
- [ ] Campo "Nota de Evolución Médica" visible en formulario
- [ ] Campo es obligatorio (validación funciona)
- [ ] Nota se guarda en tabla evolution_notes
- [ ] Nota aparece en historial del paciente
- [ ] Scroll funciona correctamente en diálogo largo

### Admin Citas Dinámico
- [ ] Filtros funcionan en tiempo real
- [ ] Selector de hora funciona (08:00-17:00)
- [ ] Calendarios no interfieren entre sí
- [ ] Auto-refresh después de crear/cancelar/reprogramar cita
- [ ] Resultados se ordenan correctamente (más recientes primero)

### Renovación de Fórmulas
- [ ] Información del paciente se muestra con foto
- [ ] Scroll funciona en diálogo de revisión
- [ ] Aprobación crea nueva fórmula
- [ ] Rechazo envía notificación con motivo
- [ ] Botones de acción funcionan correctamente

---

## 📊 **MÉTRICAS DE ÉXITO**

Marca como exitosa la migración si:
- [ ] ✅ Todas las funcionalidades de PACIENTE funcionan
- [ ] ✅ Todas las funcionalidades de MÉDICO funcionan
- [ ] ✅ Todas las funcionalidades de ADMIN funcionan
- [ ] ✅ Notas de evolución se guardan y se muestran correctamente (NUEVO)
- [ ] ✅ Políticas RLS protegen los datos correctamente
- [ ] ✅ No hay errores en consola durante uso normal
- [ ] ✅ Filtros dinámicos responden instantáneamente (NUEVO)
- [ ] ✅ UI responsive funciona en mobile/tablet/desktop

---

## 🚀 **QUICK TEST (Prueba Rápida de 15 minutos)**

Si no tienes tiempo para todo, prueba este flujo completo:

1. **Como Paciente**:
   - [ ] Login → Ver dashboard → Solicitar cita → Ver historial

2. **Como Médico**:
   - [ ] Login → Ver cita pendiente → Completar consulta (llenar diagnóstico + nota de evolución + crear fórmula) → Verificar que se guardó

3. **Como Paciente (de nuevo)**:
   - [ ] Ver notificación de diagnóstico listo
   - [ ] Ver historial clínico (debe mostrar: diagnóstico, nota de evolución, fórmula)
   - [ ] Solicitar renovación de fórmula

4. **Como Médico (de nuevo)**:
   - [ ] Ver solicitud de renovación
   - [ ] Aprobar renovación

5. **Como Admin**:
   - [ ] Crear cita manual (con hora)
   - [ ] Filtrar citas por paciente
   - [ ] Cancelar una cita

Si todo este flujo funciona → ✅ **MIGRACIÓN EXITOSA**

---

## 📝 **REGISTRO DE BUGS ENCONTRADOS**

Usa esta sección para documentar problemas:

| Fecha | Funcionalidad | Descripción del Bug | Estado | Notas |
|-------|--------------|---------------------|--------|-------|
|       |              |                     |        |       |
|       |              |                     |        |       |

---

## 💡 **TIPS PARA PRUEBAS**

1. **Usa múltiples navegadores/pestañas**: Abre 3 pestañas con paciente, médico y admin
2. **Limpia cookies**: Si algo falla, prueba con sesión limpia
3. **Revisa la consola**: Presiona F12 para ver errores de JavaScript
4. **Verifica en Supabase**: Usa Table Editor para confirmar que los datos se guardan
5. **Prueba escenarios extremos**: Caracteres especiales, campos muy largos, etc.

---

**Última actualización:** Noviembre 20, 2025
**Versión:** 2.0 (Post-migración Supabase con Historial Clínico Completo)
