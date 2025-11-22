# 🏥 IPS Virtual - Sistema de Gestión Médica

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

**Plataforma integral para la gestión de servicios médicos virtuales y presenciales**

[Características](#-características-principales) • [Tecnologías](#-stack-tecnológico) • [Instalación](#-instalación) • [Arquitectura](#-arquitectura) • [Documentación](#-documentación)

</div>

---

## 📋 Descripción General

**IPS Virtual** es un sistema completo de gestión médica que digitaliza y optimiza los procesos de atención en salud. La plataforma conecta pacientes, médicos y administradores en un ecosistema integrado que facilita desde la reserva de citas hasta el seguimiento clínico completo.

### 🎯 Objetivos del Proyecto

- ✅ **Digitalizar** el proceso de agendamiento de citas médicas
- ✅ **Centralizar** el historial clínico de los pacientes
- ✅ **Facilitar** la comunicación médico-paciente mediante telemedicina
- ✅ **Optimizar** la gestión administrativa de servicios médicos
- ✅ **Garantizar** la seguridad y privacidad de los datos médicos

---

## 🌟 Características Principales

### 👤 Para Pacientes

#### 📅 Gestión de Citas
- Reserva de citas virtuales y presenciales
- Visualización de citas programadas
- Historial completo de consultas
- Notificaciones automáticas de recordatorios
- Reprogramación y cancelación de citas

#### 🩺 Historial Clínico Digital
- Acceso completo al historial médico
- Diagnósticos y tratamientos registrados
- Notas de evolución médica
- Documentos adjuntos (estudios, exámenes)
- Exportación de informes en PDF

#### 💊 Fórmulas Médicas
- Visualización de prescripciones activas
- Historial de medicamentos recetados
- Alertas de vencimiento de fórmulas
- Descarga de fórmulas en formato PDF

#### 🔔 Sistema de Notificaciones
- Notificaciones en tiempo real
- Alertas de citas próximas
- Avisos de diagnósticos listos
- Recordatorios de medicamentos

#### 🎥 Videollamadas
- Acceso directo a consultas virtuales
- Recordatorio para ingresar 5 minutos antes
- Compatible con múltiples plataformas (Google Meet, Zoom, Teams)

### 👨‍⚕️ Para Médicos

#### 📊 Panel de Control Personal
- Dashboard con estadísticas de consultas
- Calendario de citas del día
- Resumen de pacientes atendidos
- Métricas de desempeño

#### 🏥 Gestión de Consultas
- Lista de citas programadas
- Inicio de consultas virtuales
- Envío de enlaces de videollamada
- Registro de diagnósticos
- Creación de notas de evolución

#### 📝 Diagnósticos y Tratamientos
- Formularios estructurados con código CIE-10
- Registro de tratamientos recomendados
- Notas de evolución detalladas
- Historial completo del paciente

#### 💊 Emisión de Fórmulas Médicas
- Creación de prescripciones digitales
- Gestión de medicamentos
- Fecha de vencimiento de fórmulas
- Observaciones y recomendaciones
- Generación automática de PDF

#### 👥 Gestión de Pacientes
- Lista completa de pacientes
- Historial clínico por paciente
- Notas de evolución registradas
- Documentos médicos adjuntos

#### 🕐 Gestión de Turnos
- Asignación de turnos médicos
- Calendario de disponibilidad
- Turnos de 12h y 24h
- Cálculo automático de recargos nocturnos

### 🔧 Para Administradores

#### 👨‍💼 Gestión de Personal
- Registro y administración de médicos
- Cambio de roles (Paciente ↔ Personal)
- Asignación de especialidades
- Gestión de turnos médicos

#### 📋 Gestión de Citas
- Vista completa de todas las citas
- Filtros avanzados (fecha, estado, médico)
- Confirmación y cancelación de citas
- Estadísticas de ocupación

#### 🎯 Gestión de Servicios
- Catálogo de servicios médicos
- Configuración de precios
- Tipos de consulta (virtual/presencial)
- Activación/desactivación de servicios

#### 💊 Gestión de Fórmulas
- Supervisión de prescripciones emitidas
- Control de renovaciones
- Estadísticas de medicamentos

#### 📊 Reportes y Estadísticas
- Dashboard administrativo
- Métricas de citas por estado
- Estadísticas de servicios más solicitados
- Reportes de ocupación médica
- Análisis de tiempos de atención

---

## 🛠 Stack Tecnológico

### Frontend
- **Next.js 15.3.3** - Framework React con SSR y App Router
- **React 18.3.1** - Biblioteca de interfaces de usuario
- **TypeScript 5** - Tipado estático para JavaScript
- **Tailwind CSS 3.4.1** - Framework CSS utility-first
- **Shadcn/ui** - Componentes de UI accesibles y personalizables

### Backend & Base de Datos
- **Supabase** - Backend as a Service (PostgreSQL)
- **PostgreSQL** - Base de datos relacional
- **Row Level Security (RLS)** - Seguridad a nivel de fila

### Librerías Principales
- **date-fns** - Manipulación de fechas
- **jsPDF** - Generación de documentos PDF
- **lucide-react** - Iconos SVG optimizados
- **react-hook-form** - Formularios con validación
- **zod** - Validación de esquemas TypeScript
- **recharts** - Gráficos y visualizaciones

### Autenticación
- **Supabase Auth** - Sistema de autenticación
- Autenticación por email/password
- Gestión de sesiones
- Roles y permisos (ADMIN, PERSONAL, PACIENTE)

### Notificaciones
- Sistema de notificaciones en tiempo real
- Tipos: citas, diagnósticos, fórmulas, videollamadas
- Almacenamiento en Supabase

---

## 📁 Arquitectura del Proyecto

### Estructura de Directorios

```
my-ips-virtual/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── dashboard/          # Rutas protegidas
│   │   │   ├── admin/          # Panel administrativo
│   │   │   │   ├── citas/      # Gestión de citas
│   │   │   │   ├── estadisticas/ # Reportes
│   │   │   │   ├── formulas/   # Gestión de fórmulas
│   │   │   │   ├── medicos/    # Gestión de personal
│   │   │   │   ├── servicios/  # Gestión de servicios
│   │   │   │   └── turnos/     # Gestión de turnos
│   │   │   ├── personal/       # Panel para médicos
│   │   │   │   ├── citas/      # Consultas médicas
│   │   │   │   ├── formulas/   # Emisión de fórmulas
│   │   │   │   ├── pacientes/  # Lista de pacientes
│   │   │   │   └── turnos/     # Turnos asignados
│   │   │   ├── citas/          # Citas del paciente
│   │   │   ├── formulas/       # Fórmulas del paciente
│   │   │   ├── historial/      # Historial clínico
│   │   │   ├── medicos/        # Directorio médico
│   │   │   ├── notificaciones/ # Centro de notificaciones
│   │   │   ├── perfil/         # Perfil de usuario
│   │   │   └── servicios/      # Catálogo de servicios
│   │   ├── login/              # Página de inicio de sesión
│   │   ├── signup/             # Página de registro
│   │   └── layout.tsx          # Layout principal
│   ├── components/             # Componentes React
│   │   ├── ui/                 # Componentes de UI
│   │   ├── auth/               # Componentes de autenticación
│   │   ├── dashboards/         # Componentes de dashboard
│   │   ├── header.tsx          # Encabezado
│   │   └── sidebar.tsx         # Barra lateral
│   ├── firebase/               # Configuración (migrado a Supabase)
│   ├── supabase/               # Hooks y utilidades de Supabase
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Funciones utilitarias
│   └── types/                  # Definiciones de tipos
├── public/                     # Archivos estáticos
├── docs/                       # Documentación
├── *.sql                       # Scripts SQL para Supabase
└── *.md                        # Archivos de documentación
```

### Base de Datos

#### Tablas Principales

**users**
- Información de usuarios (pacientes, médicos, admins)
- Campos: id, email, role, display_name, specialty, etc.

**appointments**
- Gestión de citas médicas
- Campos: patient_id, doctor_id, service_id, date, time, status, type, video_call_link, etc.

**services**
- Catálogo de servicios médicos
- Campos: name, description, price, type, duration, etc.

**formulas**
- Prescripciones médicas
- Campos: patient_id, doctor_id, medications, date, expiration_date, etc.

**evolution_notes**
- Notas de evolución médica
- Campos: patient_id, doctor_id, note, date, etc.

**medical_documents**
- Documentos y estudios médicos
- Campos: patient_id, document_url, document_name, document_type, etc.

**notifications**
- Sistema de notificaciones
- Campos: user_id, type, title, message, read, etc.

**shifts**
- Turnos médicos
- Campos: doctor_id, start_date, end_date, type, status, etc.

---

## 🚀 Instalación

### Prerequisitos

- Node.js 18+ y npm
- Cuenta de Supabase
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Staillim/My-IPS-VirtualSupa.git
cd My-IPS-VirtualSupa
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

4. **Ejecutar scripts SQL en Supabase**

Ejecuta los siguientes archivos en el SQL Editor de Supabase:
- `supabase-create-evolution-notes.sql`
- `supabase-create-medical-documents.sql`
- `supabase-add-video-call-link.sql`
- `supabase-add-admin-update-users-policy.sql`
- Otros archivos SQL según necesites

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:9002`

### Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo (puerto 9002)
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción
npm run lint         # Ejecuta el linter
npm run typecheck    # Verifica tipos de TypeScript
```

---

## 🔐 Seguridad

### Autenticación y Autorización

- **Supabase Auth**: Sistema robusto de autenticación
- **Row Level Security (RLS)**: Políticas de seguridad a nivel de base de datos
- **Roles de usuario**: ADMIN, PERSONAL, PACIENTE
- **Rutas protegidas**: Middleware de Next.js para control de acceso

### Políticas de Seguridad

```sql
-- Los pacientes solo pueden ver sus propios datos
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Los admins pueden actualizar usuarios
CREATE POLICY "Admins can update any user profile" ON users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
  );
```

---

## 📱 Funcionalidades Especiales

### 🎥 Sistema de Videollamadas

Permite a los médicos enviar enlaces de videollamada para consultas virtuales:
- Envío automático de notificaciones
- Recordatorio para ingresar 5 minutos antes
- Compatible con cualquier plataforma de videollamadas
- Ver documentación completa en `FUNCIONALIDAD-VIDEOLLAMADAS.md`

### 📊 Dashboard Administrativo

Panel completo con métricas en tiempo real:
- Estadísticas de citas por estado
- Servicios más solicitados
- Ocupación médica
- Gráficos interactivos con Recharts

### 📄 Generación de PDF

Sistema automático de generación de documentos:
- Fórmulas médicas
- Informes de diagnóstico
- Historial clínico completo
- Exportación con jsPDF

### 🔔 Sistema de Notificaciones

Notificaciones en tiempo real para:
- `appointment_reminder`: Recordatorio de cita
- `appointment_confirmed`: Cita confirmada
- `appointment_cancelled`: Cita cancelada
- `diagnosis_ready`: Diagnóstico completado
- `video_call_ready`: Enlace de videollamada disponible
- `formula_expiring`: Fórmula próxima a vencer

---

## 📚 Documentación

### Archivos de Documentación

- `FUNCIONALIDAD-VIDEOLLAMADAS.md` - Guía de videollamadas
- `ESTADOS_CITAS.md` - Estados y flujo de citas
- `SECURITY.md` - Políticas de seguridad
- `TESTING_BOTONES.md` - Pruebas de funcionalidad
- `docs/backend.json` - Especificación del backend
- `docs/blueprint.md` - Arquitectura del sistema
- `docs/Casos-de-Uso.md` - Casos de uso detallados

### Scripts SQL Disponibles

```
supabase-add-admin-update-users-policy.sql
supabase-add-video-call-link.sql
supabase-create-evolution-notes.sql
supabase-create-medical-documents.sql
supabase-rls-appointments-admin.sql
supabase-rls-evolution-notes.sql
supabase-rls-medical-documents.sql
```

---

## 🎨 Diseño y UX

### Principios de Diseño

- **Accesibilidad**: Componentes compatibles con lectores de pantalla
- **Responsivo**: Diseño adaptable a todos los dispositivos
- **Consistencia**: Sistema de diseño unificado con Shadcn/ui
- **Feedback visual**: Toasts y notificaciones para todas las acciones

### Tema y Personalización

- Soporte para modo claro y oscuro
- Paleta de colores profesional y médica
- Tipografía legible y jerarquía clara
- Animaciones suaves con Tailwind Animate

---

## 🚦 Flujos de Usuario

### Flujo del Paciente

1. Registro → Completar perfil
2. Explorar servicios médicos
3. Agendar cita (virtual o presencial)
4. Recibir notificación de confirmación
5. Para citas virtuales: Recibir enlace de videollamada
6. Asistir a la consulta
7. Recibir diagnóstico y fórmula médica
8. Acceder al historial clínico

### Flujo del Médico

1. Inicio de sesión
2. Ver dashboard con citas del día
3. Revisar lista de citas programadas
4. Para citas virtuales: Enviar enlace de videollamada
5. Atender consulta
6. Registrar diagnóstico y nota de evolución
7. Emitir fórmula médica (si aplica)
8. Completar consulta
9. Paciente recibe notificación

### Flujo Administrativo

1. Gestión de personal médico
2. Asignación de turnos
3. Gestión de servicios y precios
4. Supervisión de citas y consultas
5. Generación de reportes
6. Análisis de estadísticas

---

## 🔄 Estado del Proyecto

### ✅ Completado

- Sistema de autenticación multi-rol
- Gestión completa de citas médicas
- Historial clínico digital
- Emisión de fórmulas médicas
- Sistema de notificaciones
- Videollamadas para consultas virtuales
- Panel administrativo completo
- Gestión de turnos médicos
- Exportación de PDF
- Dashboard con estadísticas

### 🚧 En Desarrollo

- Integración con pasarelas de pago
- Sistema de mensajería médico-paciente
- Calendario de disponibilidad médica
- Recordatorios automáticos por SMS/WhatsApp

### 📋 Roadmap Futuro

- App móvil (React Native)
- Integración con laboratorios
- Sistema de citas recurrentes
- Telemedicina con grabación de consultas
- Análisis de datos con IA
- Integración con wearables

---

## 👥 Roles y Permisos

### PACIENTE
- ✅ Ver y gestionar citas propias
- ✅ Acceder a historial clínico
- ✅ Ver fórmulas médicas
- ✅ Actualizar perfil
- ❌ No puede acceder a datos de otros pacientes

### PERSONAL (Médico)
- ✅ Gestionar consultas asignadas
- ✅ Registrar diagnósticos
- ✅ Emitir fórmulas médicas
- ✅ Ver lista de pacientes
- ✅ Gestionar turnos propios
- ❌ No puede gestionar otros médicos

### ADMIN
- ✅ Acceso completo al sistema
- ✅ Gestionar todo el personal
- ✅ Asignar roles y especialidades
- ✅ Ver todas las citas y consultas
- ✅ Gestionar servicios y precios
- ✅ Acceder a reportes y estadísticas

---

## 🤝 Contribución

Este proyecto fue desarrollado como sistema integral de gestión médica. Para contribuciones o mejoras:

1. Fork del repositorio
2. Crear rama de feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit de cambios (`git commit -m 'Add: Nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abrir Pull Request

---

## 📞 Soporte y Contacto

- **Repositorio**: [My-IPS-VirtualSupa](https://github.com/Staillim/My-IPS-VirtualSupa)
- **Issues**: Reportar problemas en GitHub Issues
- **Documentación**: Ver archivos `.md` en el repositorio

---

## 📄 Licencia

Este proyecto es privado y de uso exclusivo para la IPS Virtual.

---

## 🙏 Agradecimientos

- **Next.js Team** - Por el increíble framework
- **Supabase** - Por el BaaS completo y fácil de usar
- **Shadcn/ui** - Por los componentes de UI de alta calidad
- **Vercel** - Por el hosting y deployment
- **Comunidad Open Source** - Por todas las librerías utilizadas

---

<div align="center">

**Desarrollado con ❤️ para mejorar la atención médica**

[⬆ Volver arriba](#-ips-virtual---sistema-de-gestión-médica)

</div>
