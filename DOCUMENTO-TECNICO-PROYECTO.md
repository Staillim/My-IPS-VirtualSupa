# 📋 Documento Técnico del Proyecto - IPS Virtual

## 🎯 1. Propósito del Sistema

### 🔴 Problema Identificado

En Colombia y Latinoamérica, el sector salud enfrenta múltiples desafíos que afectan la calidad y accesibilidad de los servicios médicos:

- **Congestión en centros médicos**: Largas filas y tiempos de espera que pueden superar las 3 horas para una consulta general
- **Dificultad en el agendamiento**: Procesos manuales o telefónicos que generan confusión y citas duplicadas
- **Pérdida de historial médico**: Documentos físicos extraviados, ilegibles o inaccesibles para el paciente
- **Limitaciones geográficas**: Pacientes en zonas rurales o alejadas sin acceso fácil a especialistas
- **Falta de seguimiento**: Ausencia de trazabilidad en tratamientos y evolución del paciente
- **Gestión administrativa ineficiente**: Procesos manuales propensos a errores en el manejo de citas, turnos y prescripciones médicas
- **Barreras de comunicación**: Dificultad para contactar al médico después de la consulta o para aclarar dudas sobre tratamientos

Estos problemas generan:
- ✖️ Sobrecarga del sistema de salud
- ✖️ Insatisfacción de pacientes y personal médico
- ✖️ Costos operativos elevados
- ✖️ Riesgos médicos por falta de información histórica
- ✖️ Baja adherencia a tratamientos por seguimiento deficiente

### ✅ Solución Propuesta

**IPS Virtual** es una plataforma integral de gestión médica que digitaliza y centraliza todos los procesos de atención en salud, proporcionando:

**Para Pacientes:**
- 📱 Agendamiento de citas 24/7 desde cualquier dispositivo
- 🏥 Consultas virtuales que eliminan barreras geográficas
- 📊 Acceso permanente a su historial clínico digital
- 💊 Gestión de fórmulas médicas con alertas de vencimiento
- 🔔 Notificaciones automáticas de citas y tratamientos
- 📄 Descarga de documentos médicos en PDF

**Para Médicos:**
- 🖥️ Panel de control centralizado de todas sus consultas
- 📝 Registro estructurado de diagnósticos con código CIE-10
- 🎥 Herramientas para telemedicina con enlaces de videollamada
- 👥 Acceso completo al historial de sus pacientes
- ⏰ Gestión eficiente de turnos y disponibilidad
- 📈 Métricas de desempeño y estadísticas

**Para Administradores:**
- 👨‍💼 Gestión completa de personal médico y especialidades
- 📊 Reportes y estadísticas en tiempo real
- 🎯 Optimización de recursos y turnos médicos
- 💰 Control de servicios y tarifas
- 📉 Análisis de ocupación y tiempos de atención

**Beneficios Clave:**
- ✅ Reducción de tiempos de espera hasta un 70%
- ✅ Eliminación de errores de agendamiento manual
- ✅ Trazabilidad completa del historial médico
- ✅ Acceso a salud desde cualquier ubicación
- ✅ Reducción de costos operativos
- ✅ Mejora en la adherencia a tratamientos
- ✅ Satisfacción aumentada de pacientes y médicos

---

## 🏥 2. Nombre del Sistema

**IPS Virtual - Sistema Integral de Gestión Médica**

**Significado:**
- **IPS**: Institución Prestadora de Servicios de Salud
- **Virtual**: Plataforma digital accesible desde cualquier lugar
- **Sistema Integral**: Solución completa que abarca todos los procesos médicos y administrativos

**Descripción:** Plataforma web para la gestión completa de servicios médicos virtuales y presenciales, que conecta pacientes, médicos y administradores en un ecosistema digital unificado.

---

## 👥 3. Asignación de Roles del Equipo

### Equipo de Desarrollo

| Nombre | Rol | Funciones y Responsabilidades |
|--------|-----|-------------------------------|
| **Desarrollador 1** | **Full Stack Developer & Arquitecto de Software** | • Diseño de arquitectura del sistema<br>• Desarrollo frontend con Next.js y React<br>• Implementación de componentes UI con Tailwind CSS<br>• Integración de APIs y servicios<br>• Optimización de rendimiento |
| **Desarrollador 2** | **Backend Developer & Database Engineer** | • Configuración de Supabase<br>• Diseño y modelado de base de datos PostgreSQL<br>• Implementación de políticas RLS (Row Level Security)<br>• Creación de scripts SQL<br>• Gestión de autenticación y seguridad |
| **Desarrollador 3** | **Frontend Developer & UX/UI Designer** | • Diseño de interfaz de usuario<br>• Implementación de componentes Shadcn/ui<br>• Desarrollo de dashboards interactivos<br>• Diseño responsive y accesibilidad<br>• Experiencia de usuario (UX) |
| **Desarrollador 4** | **QA Engineer & DevOps** | • Pruebas de funcionalidad y integración<br>• Configuración de CI/CD<br>• Deployment en Netlify/Vercel<br>• Monitoreo de errores<br>• Documentación técnica |
| **Product Owner** | **Líder de Proyecto & Analista de Negocio** | • Definición de requisitos<br>• Priorización de features<br>• Comunicación con stakeholders<br>• Planificación de sprints<br>• Control de calidad |

### Roles por Módulo del Sistema

**Módulo de Autenticación:**
- Responsable: Backend Developer
- Soporte: Full Stack Developer

**Módulo de Gestión de Citas:**
- Responsable: Full Stack Developer
- Soporte: Frontend Developer

**Módulo de Historial Clínico:**
- Responsable: Backend Developer
- Soporte: Full Stack Developer

**Módulo de Videollamadas:**
- Responsable: Frontend Developer
- Soporte: Full Stack Developer

**Módulo Administrativo:**
- Responsable: Full Stack Developer
- Soporte: Backend Developer

---

## 🎯 4. ¿A Quién Está Dirigido?

### Usuarios Finales del Sistema

#### 👤 **Pacientes** (Usuario Principal)
**Perfil:**
- Personas de todas las edades que requieren servicios médicos
- Usuarios con acceso a internet y dispositivos móviles o computadores
- Pacientes en zonas urbanas y rurales
- Personas con movilidad reducida que prefieren consultas virtuales

**Necesidades que satisface:**
- Agendar citas médicas sin desplazarse
- Acceder a su historial clínico completo
- Recibir atención médica virtual
- Gestionar sus fórmulas y tratamientos
- Reducir tiempos de espera

#### 👨‍⚕️ **Personal Médico** (Profesionales de la Salud)
**Perfil:**
- Médicos generales y especialistas
- Enfermeros y personal de salud
- Profesionales registrados con título médico

**Necesidades que satisface:**
- Gestionar consultas de manera eficiente
- Acceder al historial completo de pacientes
- Emitir prescripciones digitales
- Realizar telemedicina
- Optimizar su tiempo de atención

#### 🔧 **Administradores** (Personal Administrativo)
**Perfil:**
- Directores de IPS
- Personal administrativo de centros médicos
- Gerentes de operaciones de salud

**Necesidades que satisface:**
- Supervisar todas las operaciones
- Gestionar recursos humanos (médicos)
- Analizar métricas y reportes
- Optimizar procesos administrativos
- Controlar servicios y tarifas

### Alcance Geográfico
- 🇨🇴 **Primario**: Colombia (IPS y centros médicos)
- 🌎 **Secundario**: Latinoamérica (expansión futura)

### Segmentos de Mercado
- **IPS Privadas**: Clínicas y centros médicos privados
- **IPS Públicas**: Hospitales y centros de salud estatales
- **Consultorios Médicos**: Prácticas individuales o grupales
- **Telemedicina**: Plataformas de salud digital

---

## 💻 5. Tecnologías del Software

### 🎨 Frontend (Interfaz de Usuario)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15.3.3 | Framework React con SSR, App Router y optimizaciones automáticas |
| **React** | 18.3.1 | Biblioteca para construcción de interfaces interactivas |
| **TypeScript** | 5.0 | Lenguaje con tipado estático para JavaScript |
| **Tailwind CSS** | 3.4.1 | Framework CSS utility-first para diseño rápido |
| **Shadcn/ui** | Latest | Sistema de componentes UI accesibles y personalizables |
| **Lucide React** | Latest | Librería de iconos SVG optimizados |
| **React Hook Form** | 7.54.2 | Gestión de formularios con validación |
| **Zod** | 3.24.2 | Validación de esquemas y tipos |
| **date-fns** | 3.6.0 | Manipulación y formato de fechas |
| **Recharts** | 2.15.1 | Gráficos y visualizaciones de datos |
| **jsPDF** | 3.0.3 | Generación de documentos PDF |

### ⚙️ Backend & Base de Datos

| Tecnología | Tipo | Propósito |
|------------|------|-----------|
| **Supabase** | BaaS | Backend as a Service completo |
| **PostgreSQL** | Database | Base de datos relacional robusta |
| **Supabase Auth** | Authentication | Sistema de autenticación seguro |
| **Row Level Security (RLS)** | Security | Políticas de seguridad a nivel de fila |
| **Supabase Storage** | Storage | Almacenamiento de archivos médicos |
| **Supabase Realtime** | Real-time | Notificaciones en tiempo real |

### 🔐 Seguridad y Autenticación

- **Autenticación**: Email/Password con Supabase Auth
- **Autorización**: Sistema de roles (ADMIN, PERSONAL, PACIENTE)
- **Políticas RLS**: Seguridad a nivel de base de datos
- **Encriptación**: SSL/TLS para comunicaciones
- **Validación**: Zod para validación de datos en frontend

### 🚀 Despliegue y Ejecución

#### Entorno de Desarrollo
- **Local**: `npm run dev` (puerto 9002)
- **Hot Reload**: Turbopack para recarga rápida
- **Variables de entorno**: `.env.local`

#### Entorno de Producción
- **Hosting**: Netlify / Vercel
- **Base de Datos**: Supabase Cloud
- **CDN**: Next.js optimizations + Netlify CDN
- **SSL**: Certificados automáticos

#### Requisitos del Sistema

**Para Desarrollo:**
- Node.js 18+ y npm
- Git para control de versiones
- Editor de código (VS Code recomendado)
- Cuenta de Supabase

**Para Producción:**
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet estable
- Dispositivo: PC, tablet o smartphone

### 📦 Gestión de Dependencias

```json
{
  "package-manager": "npm",
  "node-version": "18+",
  "total-dependencies": 40+,
  "build-tool": "Next.js Build",
  "test-framework": "En desarrollo"
}
```

### 🌐 Tipo de Software

| Característica | Especificación |
|----------------|----------------|
| **Tipo** | Aplicación Web (SaaS) |
| **Arquitectura** | Cliente-Servidor |
| **Acceso** | Multiplataforma vía navegador web |
| **Conectividad** | Requiere conexión a internet |
| **Deployment** | Cloud (Netlify/Vercel + Supabase) |
| **Escalabilidad** | Horizontal (auto-scaling) |
| **Disponibilidad** | 24/7 con uptime >99.9% |

---

## 📦 6. Módulos del Sistema

### 🔐 Módulo 1: Autenticación y Gestión de Usuarios

**Descripción:**
Sistema completo de registro, inicio de sesión y gestión de perfiles de usuario con autenticación segura mediante Supabase Auth. Implementa un sistema de roles multinivel (ADMIN, PERSONAL, PACIENTE) con permisos diferenciados.

**Funcionalidades Principales:**
- ✅ Registro de nuevos usuarios con validación de datos
- ✅ Inicio de sesión con email y contraseña
- ✅ Recuperación de contraseña
- ✅ Gestión de perfiles (foto, información personal, especialidad)
- ✅ Cambio de roles (solo para administradores)
- ✅ Cierre de sesión seguro
- ✅ Protección de rutas según rol

**Tecnologías:**
- Supabase Auth para autenticación
- React Hook Form para formularios
- Zod para validación
- Row Level Security (RLS) en PostgreSQL

**Tablas de Base de Datos:**
- `users`: Información completa de usuarios
- `auth.users`: Tabla de autenticación de Supabase

---

### 📅 Módulo 2: Gestión de Citas Médicas

**Descripción:**
Sistema integral para el agendamiento, seguimiento y gestión de citas médicas tanto virtuales como presenciales. Permite a pacientes reservar citas, a médicos gestionarlas, y a administradores supervisar todo el proceso.

**Funcionalidades Principales:**

**Para Pacientes:**
- ✅ Explorar catálogo de servicios médicos
- ✅ Agendar cita seleccionando fecha, hora y médico
- ✅ Ver citas programadas y historial
- ✅ Recibir notificaciones de confirmación
- ✅ Acceder a enlaces de videollamada (citas virtuales)
- ✅ Cancelar o reprogramar citas
- ✅ Ver detalles de consultas completadas

**Para Médicos:**
- ✅ Dashboard con citas del día
- ✅ Lista filtrable de citas (estado, fecha, paciente)
- ✅ Envío de enlaces de videollamada
- ✅ Confirmación de citas
- ✅ Registro de asistencia
- ✅ Reprogramación de citas
- ✅ Ver información completa del paciente

**Para Administradores:**
- ✅ Vista completa de todas las citas
- ✅ Filtros avanzados (médico, servicio, fecha, estado)
- ✅ Estadísticas de ocupación
- ✅ Gestión de cancelaciones masivas
- ✅ Reportes de citas por período

**Estados de Citas:**
- `pendiente`: Cita creada, esperando confirmación
- `confirmada`: Cita aceptada por el médico
- `en curso`: Consulta en desarrollo
- `completada`: Consulta finalizada con diagnóstico
- `cancelada`: Cita cancelada por paciente o médico

**Tecnologías:**
- React Calendar para selección de fechas
- Notificaciones en tiempo real con Supabase Realtime
- Validación de horarios disponibles

**Tablas de Base de Datos:**
- `appointments`: Información de citas
- `services`: Catálogo de servicios médicos
- `notifications`: Notificaciones automáticas

---

### 🩺 Módulo 3: Historial Clínico Digital

**Descripción:**
Sistema completo para el registro, almacenamiento y consulta del historial médico de los pacientes. Centraliza diagnósticos, tratamientos, notas de evolución y documentos médicos en un formato digital seguro y accesible.

**Funcionalidades Principales:**

**Resumen del Paciente:**
- ✅ Información demográfica (nombre, edad, grupo sanguíneo)
- ✅ Alergias conocidas
- ✅ Antecedentes personales y familiares

**Diagnósticos y Consultas:**
- ✅ Listado de diagnósticos con código CIE-10
- ✅ Descripción detallada de cada diagnóstico
- ✅ Tratamientos recomendados
- ✅ Fecha y médico que realizó el diagnóstico
- ✅ Consultas anteriores con estado
- ✅ Exportación de diagnósticos individuales en PDF

**Notas de Evolución Médica:**
- ✅ Registro cronológico de la evolución del paciente
- ✅ Observaciones clínicas detalladas
- ✅ Respuesta a tratamientos
- ✅ Cambios en el estado de salud
- ✅ Médico responsable de cada nota

**Documentos y Estudios:**
- ✅ Almacenamiento de exámenes médicos
- ✅ Resultados de laboratorio
- ✅ Imágenes diagnósticas
- ✅ Documentos de especialistas
- ✅ Descarga y visualización de archivos
- ✅ Metadatos (fecha de subida, tipo, responsable)

**Exportación:**
- ✅ PDF del historial completo
- ✅ PDF de diagnósticos específicos
- ✅ Resumen médico
- ✅ Formato imprimible

**Tecnologías:**
- jsPDF y jsPDF-AutoTable para generación de PDFs
- Supabase Storage para documentos
- Base64 encoding para archivos

**Tablas de Base de Datos:**
- `evolution_notes`: Notas de evolución médica
- `medical_documents`: Documentos adjuntos
- `appointments`: Diagnósticos asociados a citas

---

### 💊 Módulo 4: Gestión de Fórmulas Médicas

**Descripción:**
Sistema para la emisión, gestión y seguimiento de prescripciones médicas digitales. Permite a los médicos emitir fórmulas electrónicas y a los pacientes acceder a sus medicamentos recetados con alertas de vencimiento.

**Funcionalidades Principales:**

**Para Médicos:**
- ✅ Emisión de fórmulas durante la consulta
- ✅ Agregar múltiples medicamentos con dosificación
- ✅ Establecer fecha de vencimiento
- ✅ Observaciones y recomendaciones
- ✅ Generación automática de PDF profesional
- ✅ Gestión de renovaciones
- ✅ Historial de fórmulas emitidas

**Para Pacientes:**
- ✅ Visualización de fórmulas activas
- ✅ Historial completo de prescripciones
- ✅ Alertas de vencimiento próximo
- ✅ Descarga de fórmulas en PDF
- ✅ Información detallada de cada medicamento
- ✅ Notificaciones de nuevas fórmulas

**Para Administradores:**
- ✅ Supervisión de prescripciones emitidas
- ✅ Estadísticas de medicamentos
- ✅ Control de renovaciones
- ✅ Reportes por médico y período

**Estructura de la Fórmula:**
- Datos del paciente (nombre, documento, edad)
- Datos del médico (nombre, registro médico)
- Lista de medicamentos (nombre, dosis, frecuencia, duración)
- Fecha de emisión y vencimiento
- Observaciones generales
- Código QR para validación (futuro)

**Tecnologías:**
- jsPDF para generación de fórmulas
- Sistema de plantillas PDF
- Cálculo automático de fechas de vencimiento

**Tablas de Base de Datos:**
- `formulas`: Información de prescripciones
- `medications`: (JSON) Lista de medicamentos por fórmula

---

### 🔔 Módulo 5: Sistema de Notificaciones

**Descripción:**
Sistema centralizado de notificaciones en tiempo real que mantiene informados a todos los usuarios sobre eventos importantes del sistema. Gestiona diferentes tipos de notificaciones según el rol del usuario.

**Funcionalidades Principales:**

**Tipos de Notificaciones:**

**Para Pacientes:**
- ✅ `appointment_reminder`: Recordatorio de cita próxima (24h antes)
- ✅ `appointment_confirmed`: Confirmación de cita por el médico
- ✅ `appointment_cancelled`: Cancelación de cita
- ✅ `diagnosis_ready`: Diagnóstico completado y disponible
- ✅ `video_call_ready`: Enlace de videollamada disponible
- ✅ `formula_ready`: Nueva fórmula médica emitida
- ✅ `formula_expiring`: Fórmula próxima a vencer (7 días antes)

**Para Médicos:**
- ✅ `new_appointment`: Nueva cita agendada
- ✅ `appointment_cancelled`: Paciente canceló cita
- ✅ `appointment_today`: Recordatorio de citas del día

**Para Administradores:**
- ✅ `system_alert`: Alertas del sistema
- ✅ `new_user`: Nuevo usuario registrado
- ✅ `report_ready`: Reporte generado

**Características:**
- ✅ Centro de notificaciones con contador
- ✅ Notificaciones no leídas destacadas
- ✅ Marcado de leído/no leído
- ✅ Eliminación de notificaciones
- ✅ Filtrado por tipo
- ✅ Acceso directo a la sección relacionada
- ✅ Persistencia en base de datos

**Tecnologías:**
- Supabase Realtime para notificaciones en tiempo real
- React Context para estado global
- Badge indicators para contador

**Tablas de Base de Datos:**
- `notifications`: Almacenamiento de notificaciones
  * `user_id`: Usuario destinatario
  * `type`: Tipo de notificación
  * `title`: Título
  * `message`: Mensaje descriptivo
  * `read`: Estado de lectura
  * `related_id`: ID del recurso relacionado
  * `created_at`: Fecha de creación

---

### 🎥 Módulo 6: Telemedicina y Videollamadas

**Descripción:**
Sistema que facilita las consultas médicas virtuales mediante el envío y gestión de enlaces de videollamada. Permite a los médicos iniciar consultas virtuales y a los pacientes acceder fácilmente a la videollamada.

**Funcionalidades Principales:**

**Para Médicos:**
- ✅ Envío de enlaces de videollamada
- ✅ Compatibilidad con múltiples plataformas:
  * Google Meet
  * Zoom
  * Microsoft Teams
  * Cualquier URL de videollamada
- ✅ Validación de URLs
- ✅ Edición de enlaces enviados
- ✅ Notificación automática al paciente
- ✅ Registro de fecha/hora de envío

**Para Pacientes:**
- ✅ Recepción de notificación con enlace
- ✅ Botón directo "Unirse a Videollamada"
- ✅ Recordatorio para ingresar 5 minutos antes
- ✅ Apertura automática en nueva pestaña
- ✅ Indicador visual de enlace disponible

**Flujo de Videollamada:**
1. Médico crea enlace de videollamada en la plataforma elegida
2. Médico ingresa enlace en el sistema
3. Sistema valida el formato de URL
4. Se envía notificación al paciente
5. Paciente recibe alerta con recordatorio
6. Paciente hace clic en "Unirse a Videollamada"
7. Se abre la plataforma de videollamada
8. Consulta virtual se realiza
9. Médico registra diagnóstico después

**Validaciones:**
- ✅ URL válida (protocolo https://)
- ✅ Formato correcto de enlace
- ✅ Solo disponible para citas confirmadas
- ✅ No disponible para citas completadas/canceladas

**Tecnologías:**
- Validación de URLs con JavaScript
- Integración con servicios externos de videollamada
- Almacenamiento seguro de enlaces

**Tablas de Base de Datos:**
- `appointments`: 
  * `video_call_link`: URL de la videollamada
  * `video_call_link_sent_at`: Timestamp de envío

---

### 👨‍💼 Módulo 7: Panel Administrativo

**Descripción:**
Sistema completo de administración que permite a los administradores supervisar, gestionar y analizar todas las operaciones de la IPS. Incluye gestión de personal, servicios, turnos y reportes estadísticos.

**Funcionalidades Principales:**

**Gestión de Personal Médico:**
- ✅ Registro de médicos y personal
- ✅ Cambio de roles (PACIENTE ↔ PERSONAL)
- ✅ Asignación de especialidades:
  * Médico general
  * Pediatra
  * Psicólogo
  * Certificador médico
- ✅ Lista de personal activo
- ✅ Gestión de usuarios registrados como pacientes
- ✅ Promoción de pacientes a personal médico

**Gestión de Turnos:**
- ✅ Asignación de turnos médicos
- ✅ Tipos de turnos:
  * Diurno (6:00 AM - 2:00 PM)
  * Vespertino (2:00 PM - 10:00 PM)
  * Nocturno (10:00 PM - 6:00 AM)
  * 12h día (6:00 AM - 6:00 PM)
  * 12h noche (6:00 PM - 6:00 AM)
  * 24h (turno completo)
- ✅ Calendario visual de turnos
- ✅ Cálculo automático de recargos nocturnos
- ✅ Finalización de turnos
- ✅ Historial de turnos por médico

**Gestión de Servicios:**
- ✅ Creación de servicios médicos
- ✅ Configuración de:
  * Nombre y descripción
  * Precio
  * Duración estimada
  * Tipo (virtual/presencial)
- ✅ Activación/desactivación de servicios
- ✅ Edición de servicios existentes
- ✅ Catálogo completo

**Gestión de Citas:**
- ✅ Vista completa de todas las citas
- ✅ Filtros avanzados:
  * Por médico
  * Por servicio
  * Por fecha
  * Por estado
  * Por paciente
- ✅ Confirmación masiva
- ✅ Cancelación con razones
- ✅ Estadísticas de ocupación
- ✅ Exportación de reportes

**Reportes y Estadísticas:**
- ✅ Dashboard con métricas clave:
  * Total de citas por estado
  * Servicios más solicitados
  * Ocupación por médico
  * Ingresos proyectados
  * Tiempos de atención promedio
- ✅ Gráficos interactivos (Recharts)
- ✅ Filtros por período
- ✅ Exportación de reportes

**Tecnologías:**
- Recharts para visualizaciones
- Filtros dinámicos con React
- Cálculos de métricas en tiempo real
- Exportación de datos

**Tablas de Base de Datos:**
- `users`: Gestión de roles y personal
- `shifts`: Turnos médicos
- `services`: Catálogo de servicios
- `appointments`: Todas las citas del sistema

---

### 🔄 Módulo 8: Gestión de Roles y Permisos

**Descripción:**
Sistema de control de acceso basado en roles (RBAC) que define qué puede ver y hacer cada tipo de usuario en la plataforma. Implementa seguridad a nivel de aplicación y base de datos.

**Roles del Sistema:**

**PACIENTE:**
- ✅ Acceso a dashboard personal
- ✅ Agendar y gestionar citas propias
- ✅ Ver historial clínico personal
- ✅ Acceder a fórmulas médicas
- ✅ Actualizar perfil
- ✅ Recibir notificaciones
- ❌ No acceso a datos de otros pacientes
- ❌ No acceso a funciones administrativas

**PERSONAL (Médico):**
- ✅ Dashboard de consultas
- ✅ Gestionar citas asignadas
- ✅ Registrar diagnósticos
- ✅ Emitir fórmulas médicas
- ✅ Ver historial de sus pacientes
- ✅ Gestionar turnos propios
- ✅ Enviar enlaces de videollamada
- ❌ No puede gestionar otros médicos
- ❌ No acceso a reportes globales

**ADMIN:**
- ✅ Acceso completo al sistema
- ✅ Gestionar todo el personal
- ✅ Asignar roles y especialidades
- ✅ Ver todas las citas
- ✅ Gestionar servicios
- ✅ Acceder a reportes y estadísticas
- ✅ Configurar el sistema
- ✅ Control total de usuarios

**Implementación de Seguridad:**

**Frontend:**
```typescript
// Rutas protegidas según rol
if (user.role !== 'ADMIN') {
  redirect('/dashboard');
}
```

**Backend (RLS Policies):**
```sql
-- Pacientes solo ven sus datos
CREATE POLICY "Users can view own data" ON appointments
  FOR SELECT USING (patient_id = auth.uid());

-- Médicos ven sus citas
CREATE POLICY "Doctors can view assigned appointments" ON appointments
  FOR SELECT USING (doctor_id = auth.uid());

-- Admins ven todo
CREATE POLICY "Admins can view all" ON appointments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
  );
```

**Tecnologías:**
- Supabase RLS para seguridad de base de datos
- Middleware de Next.js para rutas protegidas
- React Context para estado de autenticación

**Tablas de Base de Datos:**
- `users.role`: Enum ('ADMIN', 'PERSONAL', 'PACIENTE')
- Políticas RLS en todas las tablas sensibles

---

## 📊 Resumen Técnico

### Arquitectura General
```
┌─────────────────────────────────────────────┐
│         FRONTEND (Next.js + React)          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ Patient │  │ Doctor  │  │  Admin  │    │
│  │  Panel  │  │  Panel  │  │  Panel  │    │
│  └────┬────┘  └────┬────┘  └────┬────┘    │
└───────┼───────────┼──────────────┼──────────┘
        │           │              │
        └───────────┴──────────────┘
                    │
          ┌─────────▼──────────┐
          │   Supabase API     │
          │  (PostgreSQL +     │
          │   Auth + Storage)  │
          └────────────────────┘
```

### Flujo de Datos
1. Usuario interactúa con interfaz (React)
2. Componentes envían peticiones a Supabase
3. Supabase valida autenticación y permisos (RLS)
4. PostgreSQL ejecuta consultas
5. Datos retornan al frontend
6. React actualiza interfaz

### Métricas del Proyecto
- **Líneas de código**: ~15,000+
- **Componentes React**: 50+
- **Páginas**: 25+
- **Tablas de BD**: 10+
- **Scripts SQL**: 15+
- **Módulos principales**: 8
- **Tiempo de desarrollo**: 6 meses
- **Frameworks/Librerías**: 40+

---

<div align="center">

**📅 Fecha de elaboración**: Noviembre 2025

**🏥 IPS Virtual - Transformando la atención médica digital**

---

*Este documento describe la arquitectura técnica y funcional del Sistema IPS Virtual desarrollado para la gestión integral de servicios médicos virtuales y presenciales.*

</div>
