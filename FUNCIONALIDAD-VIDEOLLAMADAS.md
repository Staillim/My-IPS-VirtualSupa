# Funcionalidad de Videollamadas para Citas Virtuales

## 📋 Descripción

Esta funcionalidad permite a los médicos enviar enlaces de videollamada a pacientes que tienen citas virtuales programadas. El paciente recibe una notificación con el enlace y un recordatorio para ingresar 5 minutos antes.

## 🔧 Configuración Inicial

### 1. Ejecutar el Script SQL

Antes de usar esta funcionalidad, debes ejecutar el siguiente archivo SQL en tu editor de Supabase:

```
supabase-add-video-call-link.sql
```

Este script agrega dos columnas nuevas a la tabla `appointments`:
- `video_call_link`: Almacena el enlace de la videollamada
- `video_call_link_sent_at`: Registra cuándo se envió el enlace

### 2. Verificar el tipo de notificación

Asegúrate de que el tipo de notificación `video_call_ready` esté registrado en tu sistema de notificaciones.

## 📱 Flujo de Uso

### Para el Médico:

1. **Acceder a las citas**: Ve a `/dashboard/personal/citas`

2. **Iniciar consulta virtual**:
   - Localiza la cita virtual en la lista
   - Haz clic en el menú de acciones (⋮)
   - Selecciona "Enviar enlace de videollamada"

3. **Ingresar el enlace**:
   - Se abrirá un diálogo donde puedes pegar el enlace de la videollamada
   - Puedes usar cualquier plataforma:
     - Google Meet
     - Zoom
     - Microsoft Teams
     - Cualquier otra plataforma de videollamadas
   - El enlace debe incluir `https://`

4. **Enviar notificación**:
   - Al hacer clic en "Enviar Enlace", el sistema:
     - Guarda el enlace en la base de datos
     - Envía una notificación al paciente
     - Actualiza el estado de la cita

5. **Actualizar el enlace** (si es necesario):
   - Si ya enviaste un enlace, el botón cambiará a "Ver/Editar enlace"
   - Puedes modificar el enlace y el paciente recibirá una notificación del cambio

### Para el Paciente:

1. **Recibir notificación**:
   - El paciente recibe una notificación que dice:
     > "El Dr. [Nombre] ha enviado el enlace para su consulta virtual. Por favor, ingrese 5 minutos antes de la hora programada."

2. **Acceder al enlace**:
   - Ve a `/dashboard/citas`
   - En la tarjeta de la cita verás:
     - ✅ Indicador "Enlace de videollamada disponible"
     - Botón verde "Unirse a Videollamada"

3. **Unirse a la videollamada**:
   - Haz clic en el botón "Unirse a Videollamada"
   - Se abrirá una nueva pestaña con el enlace de la videollamada
   - Se recomienda ingresar 5 minutos antes de la hora programada

## 🎨 Características

### Indicadores Visuales

- **En la vista del médico**:
  - El menú de acciones muestra "Enviar enlace de videollamada" para citas sin enlace
  - Muestra "Ver/Editar enlace" para citas que ya tienen un enlace
  - Solo está disponible para citas de tipo `virtual`

- **En la vista del paciente**:
  - Icono de video verde (✅) cuando hay enlace disponible
  - Botón verde destacado "Unirse a Videollamada"
  - Solo visible para citas confirmadas y no completadas

### Notificaciones

El sistema envía notificaciones automáticas con:
- Tipo: `video_call_ready`
- Título: "Enlace de Videollamada Disponible"
- Mensaje personalizado con el nombre del médico
- Recordatorio de ingresar 5 minutos antes

## 🔒 Validaciones

El sistema valida:

1. ✅ Que el enlace sea una URL válida (formato correcto)
2. ✅ Que el enlace incluya el protocolo (`https://`)
3. ✅ Que solo se pueda enviar para citas de tipo `virtual`
4. ✅ Que la cita no esté cancelada o completada

## 📝 Campos en la Base de Datos

### Tabla: `appointments`

```sql
video_call_link TEXT            -- Enlace de la videollamada
video_call_link_sent_at TIMESTAMPTZ  -- Fecha y hora de envío
```

### Tabla: `notifications`

```sql
type: 'video_call_ready'        -- Tipo de notificación
related_id: appointment.id      -- ID de la cita relacionada
```

## 🚨 Solución de Problemas

### El botón no aparece
- Verifica que la cita sea de tipo `virtual`
- Asegúrate de haber ejecutado el script SQL

### El enlace no se guarda
- Verifica que el enlace tenga el formato correcto (`https://...`)
- Revisa los logs de la consola para ver errores específicos

### El paciente no recibe notificación
- Verifica que el sistema de notificaciones esté funcionando
- Revisa que el tipo `video_call_ready` esté registrado
- Comprueba los permisos RLS en la tabla `notifications`

## 🔄 Actualizaciones Futuras

Posibles mejoras:
- Recordatorio automático 10 minutos antes de la cita
- Historial de cambios de enlace
- Integración directa con plataformas de videollamada
- Generación automática de enlaces de Google Meet

## 📌 Notas Importantes

1. El médico puede actualizar el enlace en cualquier momento
2. El paciente solo puede ver el enlace cuando está confirmada la cita
3. El enlace permanece accesible hasta que la cita se complete o cancele
4. Se recomienda usar enlaces que no expiren automáticamente
