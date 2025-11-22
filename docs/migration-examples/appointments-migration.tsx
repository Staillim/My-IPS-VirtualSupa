/**
 * EJEMPLO DE MIGRACIÓN: Gestión de Citas
 * 
 * Este archivo muestra cómo migrar las principales operaciones
 * de la gestión de citas de Firebase a Supabase
 */

import { supabase, useSupabase, useCollection } from '@/supabase';
import { format } from 'date-fns';

// ============================================
// 1. OBTENER DATOS CON useCollection
// ============================================

// ANTES (Firebase):
/*
const servicesCollectionRef = useMemoFirebase(
  () => firestore ? collection(firestore, 'services') : null,
  [firestore]
);
const { data: services } = useCollection(servicesCollectionRef);
*/

// AHORA (Supabase):
const { data: services, loading: isLoadingServices } = useCollection('services', {
  filters: [{ column: 'status', operator: '==', value: 'activo' }],
  orderBy: { column: 'name', ascending: true }
});

// ============================================
// 2. OBTENER DOCTORES (con filtro de rol)
// ============================================

// ANTES (Firebase):
/*
const doctorsQuery = useMemoFirebase(
  () => firestore ? query(
    collection(firestore, 'users'),
    where('role', 'not-in', ['PACIENTE', 'ADMIN'])
  ) : null,
  [firestore]
);
const { data: doctors } = useCollection(doctorsQuery);
*/

// AHORA (Supabase):
const { data: doctors, loading: isLoadingDoctors } = useCollection('users', {
  filters: [{ column: 'role', operator: '==', value: 'PERSONAL' }],
  orderBy: { column: 'display_name', ascending: true }
});

// ============================================
// 3. OBTENER CITAS DEL PACIENTE
// ============================================

// ANTES (Firebase):
/*
const appointmentsQuery = useMemoFirebase(() => {
  if (!firestore || !user) return null;
  return query(
    collection(firestore, 'appointments'),
    where('patientId', '==', user.uid)
  );
}, [firestore, user]);
const { data: appointments } = useCollection(appointmentsQuery);
*/

// AHORA (Supabase):
function AppointmentsComponent() {
  const { user } = useSupabase();
  
  const { data: appointments, loading: isLoadingAppointments } = useCollection('appointments', {
    filters: user ? [{ column: 'patient_id', operator: '==', value: user.id }] : [],
    orderBy: { column: 'date', ascending: false }
  });

  return null; // Component JSX
}

// ============================================
// 4. CREAR UNA CITA
// ============================================

// ANTES (Firebase):
/*
const appointmentData = {
  patientId: user.uid,
  patientName: `${user.displayName}`,
  doctorId: selectedDoctor.id,
  doctorName: selectedDoctor.displayName,
  serviceId: selectedService.id,
  serviceName: selectedService.name,
  date: format(date, 'yyyy-MM-dd'),
  time: selectedTime,
  consultationType: consultationType,
  price: selectedService.price,
  status: 'pendiente',
  reason: appointmentReason,
  createdAt: new Date(),
};
addDocumentNonBlocking(collection(firestore, 'appointments'), appointmentData);
*/

// AHORA (Supabase):
async function handleBookAppointment(user: any, selectedDoctor: any, selectedService: any, date: Date, selectedTime: string, consultationType: string, appointmentReason: string) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        patient_id: user.id,
        patient_name: user.user_metadata?.display_name || `${user.user_metadata?.first_name} ${user.user_metadata?.last_name}`,
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.display_name,
        service_id: selectedService.id,
        service_name: selectedService.name,
        date: format(date, 'yyyy-MM-dd'),
        time: selectedTime,
        consultation_type: consultationType,
        price: selectedService.price,
        status: 'pendiente',
        reason: appointmentReason,
      })
      .select()
      .single();

    if (error) throw error;

    // Crear notificación para el doctor
    await supabase.from('notifications').insert({
      user_id: selectedDoctor.id,
      type: 'appointment_confirmed',
      title: 'Nueva Cita Agendada',
      message: `${user.user_metadata?.display_name} ha agendado una cita`,
      related_id: data.id,
    });

    return data;
  } catch (error) {
    console.error('Error al crear cita:', error);
    throw error;
  }
}

// ============================================
// 5. ACTUALIZAR ESTADO DE CITA
// ============================================

// ANTES (Firebase):
/*
updateDocumentNonBlocking(
  doc(firestore, 'appointments', appointmentId),
  { status: 'cancelada' }
);
*/

// AHORA (Supabase):
async function cancelAppointment(appointmentId: string) {
  const { error } = await supabase
    .from('appointments')
    .update({ status: 'cancelada' })
    .eq('id', appointmentId);

  if (error) throw error;
}

// ============================================
// 6. SOLICITAR REPROGRAMACIÓN
// ============================================

// ANTES (Firebase):
/*
updateDocumentNonBlocking(
  doc(firestore, 'appointments', appointment.id),
  {
    rescheduleRequest: {
      requestedBy: 'patient',
      newDate: format(newDate, 'yyyy-MM-dd'),
      newTime: newTime,
      reason: reason
    }
  }
);
*/

// AHORA (Supabase):
async function requestReschedule(appointmentId: string, newDate: Date, newTime: string, reason: string) {
  const { error } = await supabase
    .from('appointments')
    .update({
      reschedule_request: {
        requestedBy: 'patient',
        newDate: format(newDate, 'yyyy-MM-dd'),
        newTime: newTime,
        reason: reason
      }
    })
    .eq('id', appointmentId);

  if (error) throw error;

  // Notificar al doctor
  const { data: appointment } = await supabase
    .from('appointments')
    .select('doctor_id')
    .eq('id', appointmentId)
    .single();

  if (appointment) {
    await supabase.from('notifications').insert({
      user_id: appointment.doctor_id,
      type: 'reschedule_request',
      title: 'Solicitud de Reprogramación',
      message: 'Un paciente ha solicitado reprogramar su cita',
      related_id: appointmentId,
    });
  }
}

// ============================================
// 7. OBTENER FÓRMULA ASOCIADA A UNA CITA
// ============================================

// ANTES (Firebase):
/*
const formulaQuery = useMemoFirebase(() => {
  if (!firestore || !selectedAppointment?.id) return null;
  return query(
    collection(firestore, 'formulas'),
    where('appointmentId', '==', selectedAppointment.id)
  );
}, [firestore, selectedAppointment?.id]);
const { data: formulas } = useCollection(formulaQuery);
*/

// AHORA (Supabase):
async function getFormulaForAppointment(appointmentId: string) {
  const { data, error } = await supabase
    .from('formulas')
    .select('*')
    .eq('appointment_id', appointmentId)
    .maybeSingle(); // maybeSingle() no lanza error si no hay resultados

  if (error) throw error;
  return data;
}

// ============================================
// 8. FILTRAR DOCTORES POR ESPECIALIDAD
// ============================================

// ANTES (Firebase - filtro en cliente):
/*
const filteredDoctors = doctors?.filter(doctor => {
  if (!selectedService) return true;
  const serviceSpecialties = selectedService.specialties || [selectedService.specialty];
  return serviceSpecialties.some((specialty: string) => 
    doctor.specialty?.toLowerCase().trim() === specialty.toLowerCase().trim()
  );
});
*/

// AHORA (Supabase - puedes filtrar en servidor o cliente):

// Opción A: Filtro en cliente (similar a Firebase)
// const filteredDoctors = doctors?.filter(doctor => {
//   if (!selectedService) return true;
//   return doctor.specialty?.toLowerCase() === selectedService.specialty?.toLowerCase();
// });

// Opción B: Query directo con filtro en servidor (más eficiente)
async function getDoctorsBySpecialty(specialty: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'PERSONAL')
    .eq('specialty', specialty)
    .order('display_name');

  if (error) throw error;
  return data;
}

// ============================================
// 9. CONFIRMAR CITA (por Admin/Doctor)
// ============================================

// AHORA (Supabase):
async function confirmAppointment(appointmentId: string, confirmedBy: string) {
  const { error } = await supabase
    .from('appointments')
    .update({
      status: 'confirmada',
      confirmed_by: confirmedBy,
      confirmed_at: new Date().toISOString(),
    })
    .eq('id', appointmentId);

  if (error) throw error;

  // Notificar al paciente
  const { data: appointment } = await supabase
    .from('appointments')
    .select('patient_id')
    .eq('id', appointmentId)
    .single();

  if (appointment) {
    await supabase.from('notifications').insert({
      user_id: appointment.patient_id,
      type: 'appointment_confirmed',
      title: 'Cita Confirmada',
      message: 'Tu cita ha sido confirmada',
      related_id: appointmentId,
    });
  }
}

// ============================================
// 10. AGREGAR DIAGNÓSTICO A UNA CITA
// ============================================

// AHORA (Supabase):
async function addDiagnosis(appointmentId: string, diagnosis: {
  code: string;
  description: string;
  treatment: string;
}) {
  const { error } = await supabase
    .from('appointments')
    .update({
      diagnosis: {
        ...diagnosis,
        date: new Date().toISOString(),
      },
      status: 'completada',
    })
    .eq('id', appointmentId);

  if (error) throw error;

  // Notificar al paciente
  const { data: appointment } = await supabase
    .from('appointments')
    .select('patient_id')
    .eq('id', appointmentId)
    .single();

  if (appointment) {
    await supabase.from('notifications').insert({
      user_id: appointment.patient_id,
      type: 'diagnosis_ready',
      title: 'Diagnóstico Disponible',
      message: 'El diagnóstico de tu cita está disponible',
      related_id: appointmentId,
    });
  }
}

// ============================================
// 11. QUERIES COMPLEJAS CON JOINS
// ============================================

// Supabase permite hacer joins que Firebase no soporta:
async function getAppointmentsWithDetails(userId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctor:doctor_id (
        id,
        display_name,
        specialty,
        photo_url
      ),
      service:service_id (
        id,
        name,
        price,
        duration_minutes
      )
    `)
    .eq('patient_id', userId)
    .order('date', { ascending: false })
    .order('time', { ascending: false });

  if (error) throw error;
  return data;
}

// ============================================
// 12. BUSCAR CITAS POR RANGO DE FECHAS
// ============================================

async function getAppointmentsByDateRange(startDate: string, endDate: string, userId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date')
    .order('time');

  if (error) throw error;
  return data;
}

// ============================================
// 13. ESTADÍSTICAS DE CITAS
// ============================================

async function getAppointmentStats(userId: string) {
  // Total de citas
  const { count: total } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', userId);

  // Citas pendientes
  const { count: pending } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', userId)
    .eq('status', 'pendiente');

  // Citas completadas
  const { count: completed } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', userId)
    .eq('status', 'completada');

  return { total, pending, completed };
}

export {
  handleBookAppointment,
  cancelAppointment,
  requestReschedule,
  getFormulaForAppointment,
  getDoctorsBySpecialty,
  confirmAppointment,
  addDiagnosis,
  getAppointmentsWithDetails,
  getAppointmentsByDateRange,
  getAppointmentStats,
};
