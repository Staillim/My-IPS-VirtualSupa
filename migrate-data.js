/**
 * Script de Migración de Datos: Firebase → Supabase
 * 
 * Este script migra los datos existentes de Firebase/Firestore a Supabase/PostgreSQL
 * 
 * INSTRUCCIONES:
 * 1. Configurar credenciales de Firebase y Supabase
 * 2. Ejecutar: node migrate-data.js
 * 3. Verificar logs para confirmar la migración
 * 
 * NOTA: Este script debe ejecutarse DESPUÉS de crear el schema en Supabase
 */

const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');

// ============================================
// CONFIGURACIÓN
// ============================================

// Firebase Admin SDK (descargar de Firebase Console)
const firebaseServiceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount)
});

const firestore = admin.firestore();

// Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Usar Service Role Key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================
// FUNCIONES DE TRANSFORMACIÓN
// ============================================

/**
 * Transforma un documento de usuario de Firebase a formato Supabase
 */
function transformUser(firestoreDoc) {
  const data = firestoreDoc.data();
  return {
    id: firestoreDoc.id,
    first_name: data.firstName || '',
    last_name: data.lastName || '',
    email: data.email || '',
    phone_number: data.phoneNumber || null,
    document_type: data.documentType || null,
    document_number: data.documentNumber || null,
    department_id: data.departmentId || null,
    city_id: data.cityId || null,
    address: data.address || null,
    role: data.role || 'PACIENTE',
    specialty: data.specialty || null,
    license_number: data.licenseNumber || null,
    blood_type: data.bloodType || null,
    age: data.age || null,
    allergies: data.allergies || null,
    chronic_conditions: data.chronicConditions || null,
    privacy_consent: data.privacyConsent || null,
    photo_url: data.photoURL || null,
    created_at: data.createdAt?.toDate() || new Date(),
    updated_at: data.updatedAt?.toDate() || new Date(),
  };
}

/**
 * Transforma un servicio de Firebase a formato Supabase
 */
function transformService(firestoreDoc) {
  const data = firestoreDoc.data();
  return {
    id: firestoreDoc.id,
    name: data.name || '',
    description: data.description || null,
    specialty: data.specialty || null,
    price: data.price || 0,
    duration_minutes: data.duration || 30,
    status: data.status || 'activo',
    created_at: data.createdAt?.toDate() || new Date(),
    updated_at: data.updatedAt?.toDate() || new Date(),
  };
}

/**
 * Transforma una cita de Firebase a formato Supabase
 */
function transformAppointment(firestoreDoc) {
  const data = firestoreDoc.data();
  return {
    id: firestoreDoc.id,
    patient_id: data.patientId || '',
    doctor_id: data.doctorId || '',
    service_id: data.serviceId || '',
    date: data.date || null,
    time: data.time || null,
    consultation_type: data.consultationType || 'presencial',
    patient_name: data.patientName || '',
    doctor_name: data.doctorName || '',
    service_name: data.serviceName || '',
    status: data.status || 'pendiente',
    price: data.price || 0,
    reason: data.reason || null,
    reschedule_request: data.rescheduleRequest || null,
    diagnosis: data.diagnosis || null,
    confirmed_by: data.confirmedBy || null,
    confirmed_at: data.confirmedAt?.toDate() || null,
    created_at: data.createdAt?.toDate() || new Date(),
    updated_at: data.updatedAt?.toDate() || new Date(),
  };
}

/**
 * Transforma una fórmula de Firebase a formato Supabase
 */
function transformFormula(firestoreDoc) {
  const data = firestoreDoc.data();
  return {
    id: firestoreDoc.id,
    patient_id: data.patientId || '',
    doctor_id: data.doctorId || '',
    appointment_id: data.appointmentId || null,
    patient_name: data.patientName || '',
    doctor_name: data.doctorName || '',
    date: data.date || new Date(),
    expiration_date: data.expirationDate || null,
    medications: data.medications || [],
    observations: data.observations || null,
    status: data.status || 'activa',
    digital_signature: data.digitalSignature || null,
    created_at: data.createdAt?.toDate() || new Date(),
    updated_at: data.updatedAt?.toDate() || new Date(),
  };
}

/**
 * Transforma una nota de evolución de Firebase a formato Supabase
 */
function transformEvolutionNote(firestoreDoc) {
  const data = firestoreDoc.data();
  return {
    id: firestoreDoc.id,
    patient_id: data.patientId || '',
    doctor_id: data.doctorId || '',
    doctor_name: data.doctorName || '',
    content: data.content || '',
    date: data.date || new Date(),
    created_at: data.createdAt?.toDate() || new Date(),
  };
}

/**
 * Transforma una notificación de Firebase a formato Supabase
 */
function transformNotification(firestoreDoc) {
  const data = firestoreDoc.data();
  return {
    id: firestoreDoc.id,
    user_id: data.userId || '',
    type: data.type || 'new_message',
    title: data.title || '',
    message: data.message || '',
    read: data.read || false,
    related_id: data.relatedId || null,
    created_at: data.createdAt?.toDate() || new Date(),
    read_at: data.readAt?.toDate() || null,
  };
}

/**
 * Transforma un turno de Firebase a formato Supabase
 */
function transformShift(firestoreDoc) {
  const data = firestoreDoc.data();
  return {
    id: firestoreDoc.id,
    doctor_id: data.doctorId || '',
    doctor_name: data.doctorName || '',
    doctor_role: data.doctorRole || null,
    doctor_specialty: data.doctorSpecialty || null,
    start_date: data.startDate || new Date(),
    end_date: data.endDate || new Date(),
    start_time: data.startTime || '08:00',
    end_time: data.endTime || '17:00',
    type: data.type || 'diurno',
    duration_hours: data.durationHours || 8,
    nocturno: data.nocturno || false,
    spans_midnight: data.spansMidnight || false,
    recargo_percent: data.recargoPercent || 0,
    status: data.status || 'proximo',
    area: data.area || null,
    observations: data.observations || null,
    created_at: data.createdAt?.toDate() || new Date(),
    updated_at: data.updatedAt?.toDate() || new Date(),
  };
}

// ============================================
// FUNCIONES DE MIGRACIÓN
// ============================================

async function migrateCollection(
  firestoreCollection,
  supabaseTable,
  transformFn,
  batchSize = 100
) {
  console.log(`\n📦 Migrando ${firestoreCollection} → ${supabaseTable}...`);

  try {
    // Obtener documentos de Firebase
    const snapshot = await firestore.collection(firestoreCollection).get();
    const total = snapshot.size;
    console.log(`   Total de documentos: ${total}`);

    if (total === 0) {
      console.log(`   ⚠️  No hay datos para migrar`);
      return { success: 0, errors: 0 };
    }

    let success = 0;
    let errors = 0;
    let batch = [];

    for (const doc of snapshot.docs) {
      try {
        const transformed = transformFn(doc);
        batch.push(transformed);

        // Insertar en lotes
        if (batch.length >= batchSize) {
          const { error } = await supabase.from(supabaseTable).insert(batch);
          if (error) {
            console.error(`   ❌ Error en lote:`, error.message);
            errors += batch.length;
          } else {
            success += batch.length;
          }
          batch = [];
          console.log(`   ✅ Migrados: ${success}/${total}`);
        }
      } catch (error) {
        console.error(`   ❌ Error transformando documento ${doc.id}:`, error.message);
        errors++;
      }
    }

    // Insertar el último lote
    if (batch.length > 0) {
      const { error } = await supabase.from(supabaseTable).insert(batch);
      if (error) {
        console.error(`   ❌ Error en último lote:`, error.message);
        errors += batch.length;
      } else {
        success += batch.length;
      }
    }

    console.log(`   ✅ Completado: ${success} exitosos, ${errors} errores`);
    return { success, errors };
  } catch (error) {
    console.error(`   ❌ Error fatal en migración:`, error);
    return { success: 0, errors: 0 };
  }
}

// ============================================
// SCRIPT PRINCIPAL
// ============================================

async function main() {
  console.log('🚀 Iniciando migración de Firebase a Supabase...\n');
  console.log('⚠️  IMPORTANTE: Asegúrate de haber ejecutado el schema SQL primero\n');

  const results = {};

  // Migrar en orden para respetar las foreign keys
  
  // 1. Usuarios (sin dependencias)
  results.users = await migrateCollection('users', 'users', transformUser);

  // 2. Servicios (sin dependencias)
  results.services = await migrateCollection('services', 'services', transformService);

  // 3. Citas (depende de users y services)
  results.appointments = await migrateCollection('appointments', 'appointments', transformAppointment);

  // 4. Fórmulas (depende de users y appointments)
  results.formulas = await migrateCollection('formulas', 'formulas', transformFormula);

  // 5. Notas de evolución (depende de users)
  results.evolution_notes = await migrateCollection('evolution_notes', 'evolution_notes', transformEvolutionNote);

  // 6. Notificaciones (depende de users)
  results.notifications = await migrateCollection('notifications', 'notifications', transformNotification);

  // 7. Turnos (depende de users)
  results.shifts = await migrateCollection('shifts', 'shifts', transformShift);

  // 8. Roles de pacientes
  results.paciente_roles = await migrateCollection(
    'paciente_roles',
    'paciente_roles',
    (doc) => ({ user_id: doc.id })
  );

  // Resumen final
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE MIGRACIÓN');
  console.log('='.repeat(50));
  
  let totalSuccess = 0;
  let totalErrors = 0;

  Object.entries(results).forEach(([table, { success, errors }]) => {
    console.log(`${table.padEnd(20)} ✅ ${success}  ❌ ${errors}`);
    totalSuccess += success;
    totalErrors += errors;
  });

  console.log('='.repeat(50));
  console.log(`TOTAL:              ✅ ${totalSuccess}  ❌ ${totalErrors}`);
  console.log('='.repeat(50));

  if (totalErrors === 0) {
    console.log('\n🎉 ¡Migración completada exitosamente!');
  } else {
    console.log(`\n⚠️  Migración completada con ${totalErrors} errores`);
    console.log('   Revisa los logs arriba para más detalles');
  }

  process.exit(totalErrors > 0 ? 1 : 0);
}

// Ejecutar
main().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
