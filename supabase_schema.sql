-- =====================================================
-- IPS VIRTUAL - SCHEMA SQL PARA SUPABASE/POSTGRESQL
-- =====================================================
-- Sistema de gestión médica con jerarquía de roles:
-- ADMIN > PERSONAL (Médicos) > PACIENTE
-- 
-- Características:
-- - Autenticación integrada con Supabase Auth
-- - Row Level Security (RLS) para control de acceso
-- - Triggers para auditoría y validaciones
-- - Índices optimizados para rendimiento
-- - Soporte para datos sensibles de salud
-- =====================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- Roles de usuario (jerarquía)
CREATE TYPE user_role AS ENUM ('ADMIN', 'PERSONAL', 'PACIENTE');

-- Estados de citas
CREATE TYPE appointment_status AS ENUM (
    'pendiente',
    'confirmada', 
    'en_curso',
    'completada',
    'cancelada'
);

-- Tipos de consulta
CREATE TYPE consultation_type AS ENUM ('virtual', 'presencial');

-- Estados de fórmulas médicas
CREATE TYPE formula_status AS ENUM ('activa', 'anulada', 'expirada');

-- Estados de solicitudes de renovación
CREATE TYPE renewal_status AS ENUM ('pendiente', 'aprobada', 'rechazada');

-- Tipos de turnos médicos
CREATE TYPE shift_type AS ENUM (
    'diurno',
    'vespertino', 
    'nocturno',
    '12h_dia',
    '12h_noche',
    '24h'
);

-- Estados de turnos
CREATE TYPE shift_status AS ENUM ('proximo', 'activo', 'finalizado');

-- Tipos de notificaciones
CREATE TYPE notification_type AS ENUM (
    'appointment_confirmed',
    'appointment_cancelled',
    'appointment_rescheduled',
    'reschedule_request',
    'diagnosis_ready',
    'formula_created',
    'formula_renewed',
    'note_added',
    'new_message'
);

-- Estados de servicios
CREATE TYPE service_status AS ENUM ('activo', 'inactivo');

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

-- =====================================================
-- TABLA: users (Usuarios del sistema)
-- =====================================================
-- Vinculada con Supabase Auth (auth.users)
-- Almacena información extendida de perfil
-- =====================================================
CREATE TABLE public.users (
    -- Identificadores
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Información personal
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    
    -- Documento de identidad
    document_type VARCHAR(50), -- CC, TI, CE, Pasaporte
    document_number VARCHAR(50) UNIQUE,
    
    -- Ubicación
    department_id VARCHAR(100),
    city_id VARCHAR(100),
    address TEXT,
    
    -- Rol y permisos (jerarquía)
    role user_role NOT NULL DEFAULT 'PACIENTE',
    
    -- Información médica (solo para PERSONAL)
    specialty VARCHAR(100), -- Especialidad médica
    license_number VARCHAR(50), -- Registro médico
    
    -- Información de salud (solo para PACIENTE)
    blood_type VARCHAR(10), -- Tipo de sangre
    age INTEGER,
    allergies TEXT, -- Alergias conocidas
    chronic_conditions TEXT, -- Condiciones crónicas
    
    -- Consentimiento de privacidad (PACIENTE)
    privacy_consent JSONB, -- {acceptedTerms, acceptedDataTreatment, acceptedSensitiveData, etc.}
    
    -- Avatar/Foto
    photo_url TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_role_specialty CHECK (
        (role != 'PERSONAL') OR (specialty IS NOT NULL)
    )
);

-- Índices para users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_document ON users(document_number) WHERE document_number IS NOT NULL;
CREATE INDEX idx_users_specialty ON users(specialty) WHERE specialty IS NOT NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- =====================================================
-- TABLA: services (Servicios médicos)
-- =====================================================
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información del servicio
    name VARCHAR(255) NOT NULL,
    description TEXT,
    specialty VARCHAR(100), -- Relacionado con specialty de users
    
    -- Precio y duración
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    
    -- Estado
    status service_status NOT NULL DEFAULT 'activo',
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT positive_price CHECK (price >= 0),
    CONSTRAINT positive_duration CHECK (duration_minutes > 0)
);

-- Índices para services
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_specialty ON services(specialty);
CREATE INDEX idx_services_name ON services(name);

-- =====================================================
-- TABLA: appointments (Citas médicas)
-- =====================================================
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relaciones
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    
    -- Información de la cita
    date DATE NOT NULL,
    time TIME NOT NULL,
    consultation_type consultation_type NOT NULL DEFAULT 'presencial',
    
    -- Nombres denormalizados para rendimiento
    patient_name VARCHAR(200) NOT NULL,
    doctor_name VARCHAR(200) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    
    -- Estado y precio
    status appointment_status NOT NULL DEFAULT 'pendiente',
    price DECIMAL(10, 2) NOT NULL,
    
    -- Motivo de la cita
    reason TEXT,
    
    -- Solicitud de reprogramación (JSONB para flexibilidad)
    reschedule_request JSONB, -- {requestedBy: 'doctor'|'patient', newDate, newTime, reason}
    
    -- Diagnóstico (cuando está completada)
    diagnosis JSONB, -- {code: CIE-10, description, treatment, date}
    
    -- Confirmación
    confirmed_by VARCHAR(50), -- 'admin', 'doctor', 'system'
    confirmed_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para appointments
CREATE INDEX idx_appointments_patient ON appointments(patient_id, date DESC);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id, date DESC);
CREATE INDEX idx_appointments_date ON appointments(date DESC);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_service ON appointments(service_id);
CREATE INDEX idx_appointments_datetime ON appointments(date, time);

-- Índice compuesto para consultas comunes
CREATE INDEX idx_appointments_patient_status_date ON appointments(patient_id, status, date DESC);
CREATE INDEX idx_appointments_doctor_status_date ON appointments(doctor_id, status, date DESC);

-- =====================================================
-- TABLA: formulas (Fórmulas médicas / Prescripciones)
-- =====================================================
CREATE TABLE public.formulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relaciones
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    
    -- Información de la fórmula
    patient_name VARCHAR(200) NOT NULL,
    doctor_name VARCHAR(200) NOT NULL,
    
    -- Fechas
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiration_date DATE,
    
    -- Medicamentos (array de objetos JSON)
    medications JSONB NOT NULL, -- [{name, dosage, frequency, duration, instructions}]
    
    -- Observaciones del médico
    observations TEXT,
    
    -- Estado
    status formula_status NOT NULL DEFAULT 'activa',
    
    -- Firma digital
    digital_signature TEXT, -- URL o data URI
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_expiration CHECK (
        expiration_date IS NULL OR expiration_date >= date
    ),
    CONSTRAINT medications_not_empty CHECK (
        jsonb_array_length(medications) > 0
    )
);

-- Índices para formulas
CREATE INDEX idx_formulas_patient ON formulas(patient_id, date DESC);
CREATE INDEX idx_formulas_doctor ON formulas(doctor_id, date DESC);
CREATE INDEX idx_formulas_appointment ON formulas(appointment_id);
CREATE INDEX idx_formulas_status ON formulas(status);
CREATE INDEX idx_formulas_expiration ON formulas(expiration_date) WHERE expiration_date IS NOT NULL;
CREATE INDEX idx_formulas_date ON formulas(date DESC);

-- =====================================================
-- TABLA: formula_renewal_requests (Solicitudes de renovación)
-- =====================================================
CREATE TABLE public.formula_renewal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relaciones
    formula_id UUID NOT NULL REFERENCES formulas(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Información de la solicitud
    original_date DATE NOT NULL,
    medications JSONB NOT NULL, -- Copia de los medicamentos originales
    reason TEXT NOT NULL, -- Motivo de la renovación
    
    -- Estado
    status renewal_status NOT NULL DEFAULT 'pendiente',
    
    -- Respuesta del médico
    rejection_reason TEXT,
    responded_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_status_transition CHECK (
        (status = 'pendiente' AND responded_at IS NULL) OR
        (status IN ('aprobada', 'rechazada') AND responded_at IS NOT NULL)
    )
);

-- Índices para formula_renewal_requests
CREATE INDEX idx_renewal_requests_patient ON formula_renewal_requests(patient_id, created_at DESC);
CREATE INDEX idx_renewal_requests_doctor ON formula_renewal_requests(doctor_id, status, created_at DESC);
CREATE INDEX idx_renewal_requests_formula ON formula_renewal_requests(formula_id);
CREATE INDEX idx_renewal_requests_status ON formula_renewal_requests(status);

-- =====================================================
-- TABLA: shifts (Turnos de trabajo médico)
-- =====================================================
CREATE TABLE public.shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relaciones
    doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Información del médico (denormalizada)
    doctor_name VARCHAR(200) NOT NULL,
    doctor_role VARCHAR(50),
    doctor_specialty VARCHAR(100),
    
    -- Fechas (pueden abarcar más de un día para turnos de 24h)
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Horarios
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Tipo y características
    type shift_type NOT NULL,
    duration_hours DECIMAL(4, 2) NOT NULL,
    nocturno BOOLEAN NOT NULL DEFAULT FALSE,
    spans_midnight BOOLEAN NOT NULL DEFAULT FALSE,
    recargo_percent DECIMAL(5, 2) DEFAULT 0,
    
    -- Estado (calculado dinámicamente pero almacenado)
    status shift_status NOT NULL DEFAULT 'proximo',
    
    -- Ubicación
    area VARCHAR(100), -- Área de atención
    
    -- Observaciones
    observations TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (end_date >= start_date),
    CONSTRAINT positive_duration CHECK (duration_hours > 0)
);

-- Índices para shifts
CREATE INDEX idx_shifts_doctor ON shifts(doctor_id, start_date DESC);
CREATE INDEX idx_shifts_date_range ON shifts(start_date, end_date);
CREATE INDEX idx_shifts_status ON shifts(status);
CREATE INDEX idx_shifts_type ON shifts(type);
CREATE INDEX idx_shifts_nocturno ON shifts(nocturno) WHERE nocturno = TRUE;

-- =====================================================
-- TABLA: evolution_notes (Notas de evolución médica)
-- =====================================================
-- Notas inmutables del historial clínico
-- =====================================================
CREATE TABLE public.evolution_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relaciones
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Información de la nota
    doctor_name VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT content_not_empty CHECK (LENGTH(TRIM(content)) > 0)
);

-- Índices para evolution_notes
CREATE INDEX idx_evolution_notes_patient ON evolution_notes(patient_id, date DESC);
CREATE INDEX idx_evolution_notes_doctor ON evolution_notes(doctor_id, date DESC);
CREATE INDEX idx_evolution_notes_date ON evolution_notes(date DESC);

-- =====================================================
-- TABLA: notifications (Notificaciones del sistema)
-- =====================================================
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relaciones
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Información de la notificación
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Estado
    read BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Referencia al documento relacionado
    related_id UUID, -- ID de appointment, formula, etc.
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_read_state CHECK (
        (read = FALSE AND read_at IS NULL) OR
        (read = TRUE AND read_at IS NOT NULL)
    )
);

-- Índices para notifications
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read, created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_related ON notifications(related_id) WHERE related_id IS NOT NULL;

-- =====================================================
-- TABLA: paciente_roles (Tabla auxiliar para pacientes)
-- =====================================================
-- Mantiene compatibilidad con estructura Firebase
-- =====================================================
CREATE TABLE public.paciente_roles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_formulas_updated_at BEFORE UPDATE ON formulas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_renewal_requests_updated_at BEFORE UPDATE ON formula_renewal_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Función para actualizar read_at en notifications
-- =====================================================
CREATE OR REPLACE FUNCTION update_notification_read_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.read = TRUE AND OLD.read = FALSE THEN
        NEW.read_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_read BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_notification_read_at();

-- =====================================================
-- Función para auto-expirar fórmulas vencidas
-- =====================================================
CREATE OR REPLACE FUNCTION auto_expire_formulas()
RETURNS void AS $$
BEGIN
    UPDATE formulas
    SET status = 'expirada'
    WHERE status = 'activa'
      AND expiration_date IS NOT NULL
      AND expiration_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Función para validar turnos no solapados
-- =====================================================
CREATE OR REPLACE FUNCTION validate_shift_overlap()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar si el médico ya tiene un turno activo en ese rango
    IF EXISTS (
        SELECT 1 FROM shifts
        WHERE doctor_id = NEW.doctor_id
          AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
          AND status IN ('proximo', 'activo')
          AND (
              (NEW.start_date BETWEEN start_date AND end_date) OR
              (NEW.end_date BETWEEN start_date AND end_date) OR
              (start_date BETWEEN NEW.start_date AND NEW.end_date)
          )
    ) THEN
        RAISE EXCEPTION 'El médico ya tiene un turno asignado en ese rango de fechas';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_shift_overlap_trigger BEFORE INSERT OR UPDATE ON shifts
    FOR EACH ROW EXECUTE FUNCTION validate_shift_overlap();

-- =====================================================
-- Función para validar roles en appointments
-- =====================================================
CREATE OR REPLACE FUNCTION validate_appointment_roles()
RETURNS TRIGGER AS $$
DECLARE
    patient_role user_role;
    doctor_role user_role;
BEGIN
    -- Verificar rol del paciente
    SELECT role INTO patient_role FROM users WHERE id = NEW.patient_id;
    IF patient_role IS NULL OR patient_role != 'PACIENTE' THEN
        RAISE EXCEPTION 'El patient_id debe ser un usuario con rol PACIENTE';
    END IF;
    
    -- Verificar rol del doctor
    SELECT role INTO doctor_role FROM users WHERE id = NEW.doctor_id;
    IF doctor_role IS NULL OR doctor_role NOT IN ('PERSONAL', 'ADMIN') THEN
        RAISE EXCEPTION 'El doctor_id debe ser un usuario con rol PERSONAL o ADMIN';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_appointment_roles_trigger BEFORE INSERT OR UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION validate_appointment_roles();

-- =====================================================
-- Función para validar roles en formulas
-- =====================================================
CREATE OR REPLACE FUNCTION validate_formula_roles()
RETURNS TRIGGER AS $$
DECLARE
    patient_role user_role;
    doctor_role user_role;
BEGIN
    -- Verificar rol del paciente
    SELECT role INTO patient_role FROM users WHERE id = NEW.patient_id;
    IF patient_role IS NULL OR patient_role != 'PACIENTE' THEN
        RAISE EXCEPTION 'El patient_id debe ser un usuario con rol PACIENTE';
    END IF;
    
    -- Verificar rol del doctor
    SELECT role INTO doctor_role FROM users WHERE id = NEW.doctor_id;
    IF doctor_role IS NULL OR doctor_role NOT IN ('PERSONAL', 'ADMIN') THEN
        RAISE EXCEPTION 'El doctor_id debe ser un usuario con rol PERSONAL o ADMIN';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_formula_roles_trigger BEFORE INSERT OR UPDATE ON formulas
    FOR EACH ROW EXECUTE FUNCTION validate_formula_roles();

-- =====================================================
-- Función para validar roles en evolution_notes
-- =====================================================
CREATE OR REPLACE FUNCTION validate_evolution_note_roles()
RETURNS TRIGGER AS $$
DECLARE
    patient_role user_role;
    doctor_role user_role;
BEGIN
    -- Verificar rol del paciente
    SELECT role INTO patient_role FROM users WHERE id = NEW.patient_id;
    IF patient_role IS NULL OR patient_role != 'PACIENTE' THEN
        RAISE EXCEPTION 'El patient_id debe ser un usuario con rol PACIENTE';
    END IF;
    
    -- Verificar rol del doctor
    SELECT role INTO doctor_role FROM users WHERE id = NEW.doctor_id;
    IF doctor_role IS NULL OR doctor_role NOT IN ('PERSONAL', 'ADMIN') THEN
        RAISE EXCEPTION 'El doctor_id debe ser un usuario con rol PERSONAL o ADMIN';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_evolution_note_roles_trigger BEFORE INSERT OR UPDATE ON evolution_notes
    FOR EACH ROW EXECUTE FUNCTION validate_evolution_note_roles();

-- =====================================================
-- Función para validar roles en shifts
-- =====================================================
CREATE OR REPLACE FUNCTION validate_shift_doctor_role()
RETURNS TRIGGER AS $$
DECLARE
    doctor_role user_role;
BEGIN
    -- Verificar rol del doctor
    SELECT role INTO doctor_role FROM users WHERE id = NEW.doctor_id;
    IF doctor_role IS NULL OR doctor_role NOT IN ('PERSONAL', 'ADMIN') THEN
        RAISE EXCEPTION 'El doctor_id debe ser un usuario con rol PERSONAL o ADMIN';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_shift_doctor_role_trigger BEFORE INSERT OR UPDATE ON shifts
    FOR EACH ROW EXECUTE FUNCTION validate_shift_doctor_role();

-- =====================================================
-- Función para validar roles en paciente_roles
-- =====================================================
CREATE OR REPLACE FUNCTION validate_paciente_role()
RETURNS TRIGGER AS $$
DECLARE
    user_role_value user_role;
BEGIN
    -- Verificar que el usuario sea PACIENTE
    SELECT role INTO user_role_value FROM users WHERE id = NEW.user_id;
    IF user_role_value IS NULL OR user_role_value != 'PACIENTE' THEN
        RAISE EXCEPTION 'El user_id debe ser un usuario con rol PACIENTE';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_paciente_role_trigger BEFORE INSERT OR UPDATE ON paciente_roles
    FOR EACH ROW EXECUTE FUNCTION validate_paciente_role();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE formula_renewal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolution_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE paciente_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: users
-- =====================================================

-- Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Usuarios autenticados pueden ver perfiles de otros (para búsquedas)
CREATE POLICY "Authenticated users can view other profiles" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Solo al crear cuenta (signup)
CREATE POLICY "Users can create own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- RLS POLICIES: services
-- =====================================================

-- Todos pueden ver servicios activos
CREATE POLICY "Anyone can view active services" ON services
    FOR SELECT USING (status = 'activo' OR auth.role() = 'authenticated');

-- Solo ADMIN puede gestionar servicios
CREATE POLICY "Only admins can manage services" ON services
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- =====================================================
-- RLS POLICIES: appointments
-- =====================================================

-- Pacientes ven sus propias citas
CREATE POLICY "Patients view own appointments" ON appointments
    FOR SELECT USING (patient_id = auth.uid());

-- Médicos ven sus citas asignadas
CREATE POLICY "Doctors view assigned appointments" ON appointments
    FOR SELECT USING (doctor_id = auth.uid());

-- Admins ven todas las citas
CREATE POLICY "Admins view all appointments" ON appointments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- Pacientes pueden crear citas
CREATE POLICY "Patients can create appointments" ON appointments
    FOR INSERT WITH CHECK (
        patient_id = auth.uid() AND
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'PACIENTE')
    );

-- Médicos y admins pueden actualizar citas
CREATE POLICY "Doctors and admins can update appointments" ON appointments
    FOR UPDATE USING (
        doctor_id = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- =====================================================
-- RLS POLICIES: formulas
-- =====================================================

-- Pacientes ven sus propias fórmulas
CREATE POLICY "Patients view own formulas" ON formulas
    FOR SELECT USING (patient_id = auth.uid());

-- Médicos ven fórmulas que emitieron
CREATE POLICY "Doctors view issued formulas" ON formulas
    FOR SELECT USING (doctor_id = auth.uid());

-- Admins ven todas las fórmulas
CREATE POLICY "Admins view all formulas" ON formulas
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- Médicos y admins pueden crear fórmulas
CREATE POLICY "Doctors and admins can create formulas" ON formulas
    FOR INSERT WITH CHECK (
        doctor_id = auth.uid() AND
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('PERSONAL', 'ADMIN'))
    );

-- Médicos pueden actualizar sus propias fórmulas
CREATE POLICY "Doctors can update own formulas" ON formulas
    FOR UPDATE USING (doctor_id = auth.uid());

-- =====================================================
-- RLS POLICIES: formula_renewal_requests
-- =====================================================

-- Pacientes ven sus propias solicitudes
CREATE POLICY "Patients view own renewal requests" ON formula_renewal_requests
    FOR SELECT USING (patient_id = auth.uid());

-- Médicos ven solicitudes asignadas
CREATE POLICY "Doctors view assigned renewal requests" ON formula_renewal_requests
    FOR SELECT USING (doctor_id = auth.uid());

-- Pacientes pueden crear solicitudes
CREATE POLICY "Patients can create renewal requests" ON formula_renewal_requests
    FOR INSERT WITH CHECK (
        patient_id = auth.uid() AND
        status = 'pendiente'
    );

-- Médicos pueden responder solicitudes
CREATE POLICY "Doctors can respond renewal requests" ON formula_renewal_requests
    FOR UPDATE USING (
        doctor_id = auth.uid() AND
        status = 'pendiente'
    );

-- =====================================================
-- RLS POLICIES: shifts
-- =====================================================

-- Médicos ven sus propios turnos
CREATE POLICY "Doctors view own shifts" ON shifts
    FOR SELECT USING (doctor_id = auth.uid());

-- Admins ven todos los turnos
CREATE POLICY "Admins view all shifts" ON shifts
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- Admins pueden gestionar turnos
CREATE POLICY "Admins can manage shifts" ON shifts
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- =====================================================
-- RLS POLICIES: evolution_notes
-- =====================================================

-- Pacientes ven sus propias notas
CREATE POLICY "Patients view own evolution notes" ON evolution_notes
    FOR SELECT USING (patient_id = auth.uid());

-- Médicos ven todas las notas (para historial clínico)
CREATE POLICY "Doctors view all evolution notes" ON evolution_notes
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('PERSONAL', 'ADMIN'))
    );

-- Médicos pueden crear notas
CREATE POLICY "Doctors can create evolution notes" ON evolution_notes
    FOR INSERT WITH CHECK (
        doctor_id = auth.uid() AND
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('PERSONAL', 'ADMIN'))
    );

-- Las notas son inmutables (no UPDATE ni DELETE)

-- =====================================================
-- RLS POLICIES: notifications
-- =====================================================

-- Usuarios ven sus propias notificaciones
CREATE POLICY "Users view own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

-- Cualquiera autenticado puede crear notificaciones
CREATE POLICY "Authenticated can create notifications" ON notifications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Usuarios pueden actualizar el estado read de sus notificaciones
CREATE POLICY "Users can mark own notifications as read" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Usuarios pueden eliminar sus propias notificaciones
CREATE POLICY "Users can delete own notifications" ON notifications
    FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- RLS POLICIES: paciente_roles
-- =====================================================

CREATE POLICY "Users can view own paciente_role" ON paciente_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own paciente_role" ON paciente_roles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de citas con información completa
CREATE OR REPLACE VIEW appointments_with_details AS
SELECT 
    a.*,
    p.display_name as patient_display_name,
    p.email as patient_email,
    p.phone_number as patient_phone,
    d.display_name as doctor_display_name,
    d.specialty as doctor_specialty,
    d.email as doctor_email,
    s.name as service_full_name,
    s.description as service_description
FROM appointments a
JOIN users p ON a.patient_id = p.id
JOIN users d ON a.doctor_id = d.id
JOIN services s ON a.service_id = s.id;

-- Vista de fórmulas con información completa
CREATE OR REPLACE VIEW formulas_with_details AS
SELECT 
    f.*,
    p.display_name as patient_display_name,
    p.email as patient_email,
    d.display_name as doctor_display_name,
    d.specialty as doctor_specialty,
    CASE 
        WHEN f.expiration_date < CURRENT_DATE THEN 'expirada'
        ELSE f.status::text
    END as computed_status
FROM formulas f
JOIN users p ON f.patient_id = p.id
JOIN users d ON f.doctor_id = d.id;

-- =====================================================
-- DATOS INICIALES (SEED)
-- =====================================================

-- Insertar servicios médicos base
INSERT INTO services (name, description, specialty, price, duration_minutes, status) VALUES
('Consulta General', 'Consulta médica general para diagnóstico y tratamiento', 'Medicina General', 50000, 30, 'activo'),
('Consulta Especializada', 'Consulta con médico especialista', NULL, 80000, 45, 'activo'),
('Control de Enfermería', 'Control y seguimiento por enfermería', 'Enfermería', 30000, 20, 'activo'),
('Toma de Signos Vitales', 'Medición de presión arterial, temperatura, etc.', 'Enfermería', 15000, 15, 'activo'),
('Consulta Pediátrica', 'Atención médica especializada para niños', 'Pediatría', 70000, 40, 'activo'),
('Consulta Cardiológica', 'Evaluación y tratamiento cardiovascular', 'Cardiología', 100000, 45, 'activo'),
('Consulta Dermatológica', 'Diagnóstico y tratamiento de la piel', 'Dermatología', 85000, 30, 'activo'),
('Teleconsulta', 'Consulta médica virtual', NULL, 40000, 30, 'activo')
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE users IS 'Usuarios del sistema con jerarquía: ADMIN > PERSONAL > PACIENTE';
COMMENT ON TABLE appointments IS 'Citas médicas entre pacientes y personal médico';
COMMENT ON TABLE formulas IS 'Prescripciones médicas emitidas por el personal';
COMMENT ON TABLE formula_renewal_requests IS 'Solicitudes de renovación de fórmulas médicas';
COMMENT ON TABLE shifts IS 'Turnos de trabajo del personal médico';
COMMENT ON TABLE evolution_notes IS 'Notas de evolución inmutables del historial clínico';
COMMENT ON TABLE notifications IS 'Sistema de notificaciones en tiempo real';
COMMENT ON TABLE services IS 'Catálogo de servicios médicos disponibles';

COMMENT ON COLUMN users.role IS 'Jerarquía: ADMIN (administrador) > PERSONAL (médicos) > PACIENTE';
COMMENT ON COLUMN users.privacy_consent IS 'Consentimiento informado según Ley 1581/2012 Colombia';
COMMENT ON COLUMN appointments.reschedule_request IS 'Solicitud de reprogramación pendiente';
COMMENT ON COLUMN appointments.diagnosis IS 'Diagnóstico con código CIE-10';
COMMENT ON COLUMN formulas.medications IS 'Array de medicamentos con dosificación';
COMMENT ON COLUMN shifts.spans_midnight IS 'Indica si el turno cruza la medianoche';

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================
