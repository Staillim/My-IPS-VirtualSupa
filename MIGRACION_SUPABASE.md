# 📘 Guía de Migración de Firebase a Supabase

## 🎯 Resumen de la Migración

Se ha completado la migración del proyecto **IPS Virtual** de Firebase/Firestore a Supabase/PostgreSQL. Esta guía documenta los cambios realizados y los próximos pasos necesarios.

---

## ✅ Cambios Completados

### 1. **Dependencias Instaladas**
```json
{
  "@supabase/supabase-js": "^2.x",
  "@supabase/ssr": "^0.x"
}
```

### 2. **Estructura de Archivos Creada**

#### Nuevos Directorios:
```
src/
├── supabase/
│   ├── client.ts          # Cliente de Supabase para componentes cliente
│   ├── server.ts          # Cliente de Supabase para componentes servidor
│   ├── provider.tsx       # Context Provider de Supabase
│   ├── index.ts           # Exports principales
│   └── hooks/
│       ├── use-collection.tsx  # Hook para colecciones (reemplaza useCollection de Firebase)
│       └── use-doc.tsx         # Hook para documentos (reemplaza useDoc de Firebase)
```

### 3. **Configuración**

#### Archivo: `src/firebase/config.ts`
- ✅ Agregada configuración de Supabase
- ✅ Mantenida configuración de Firebase (para rollback si es necesario)

#### Archivo: `.env.local.example`
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. **Componentes Migrados**

#### ✅ Layout Principal (`src/app/layout.tsx`)
- Reemplazado `FirebaseClientProvider` por `SupabaseProvider`

#### ✅ Página de Registro (`src/app/signup/page.tsx`)
- Migrado de `createUserWithEmailAndPassword` a `supabase.auth.signUp`
- Actualizado para insertar datos en tabla `users` y `paciente_roles`
- Mantiene campos de consentimiento de privacidad (Ley 1581/2012)

#### ✅ Página de Login (`src/app/login/page.tsx`)
- Migrado de Firebase Auth a `supabase.auth.signInWithPassword`
- Actualizado hook `useUser` por `useSupabase`

#### ✅ Protected Route (`src/components/auth/ProtectedRoute.tsx`)
- Actualizado para usar Supabase Auth
- Mantiene lógica de roles y redirección

#### ✅ Dashboard Principal (`src/app/dashboard/page.tsx`)
- Actualizado para obtener datos de usuario desde Supabase
- Mantiene lógica de routing basada en roles

---

## 🗄️ Base de Datos

### Schema SQL Creado (`supabase_schema.sql`)

El archivo contiene:
- ✅ 9 tablas principales con relaciones
- ✅ 9 tipos ENUM para estados
- ✅ 25+ políticas RLS (Row Level Security)
- ✅ 40+ índices optimizados
- ✅ Triggers automáticos
- ✅ Funciones de validación
- ✅ Vistas útiles

**Jerarquía de Roles:**
```
ADMIN (acceso total)
  ↓
PERSONAL (médicos, acceso a datos médicos)
  ↓
PACIENTE (solo sus propios datos)
```

---

## 🔧 Pasos de Configuración Necesarios

### 1. **Crear Proyecto en Supabase**
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Anota las credenciales:
   - Project URL
   - Anon/Public Key
   - Service Role Key (solo para servidor)

### 2. **Ejecutar el Schema SQL**
```bash
# En el panel de Supabase:
# 1. Ir a SQL Editor
# 2. Copiar el contenido de supabase_schema.sql
# 3. Ejecutar el script completo
```

### 3. **Configurar Variables de Entorno**
```bash
# Crear archivo .env.local en la raíz del proyecto
cp .env.local.example .env.local

# Editar .env.local con tus credenciales de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. **Configurar Email Templates (Opcional)**
En Supabase Dashboard → Authentication → Email Templates:
- Personalizar email de confirmación
- Personalizar email de recuperación de contraseña
- Configurar redirect URLs

---

## 📋 Pendientes de Migración

### Alta Prioridad:
- [ ] **Dashboard de Administrador** (`src/app/dashboard/admin/page.tsx`)
- [ ] **Gestión de Citas** (`src/app/dashboard/citas/page.tsx`)
- [ ] **Gestión de Fórmulas** (`src/app/dashboard/formulas/page.tsx`)
- [ ] **Sistema de Notificaciones** (`src/components/NotificationListener.tsx`)
- [ ] **Gestión de Turnos** (`src/app/dashboard/admin/turnos/`)

### Media Prioridad:
- [ ] **Perfil de Usuario** (`src/app/dashboard/perfil/page.tsx`)
- [ ] **Historial Médico** (`src/app/dashboard/historial/page.tsx`)
- [ ] **Gestión de Servicios** (`src/app/dashboard/admin/servicios/`)
- [ ] **Estadísticas** (`src/app/dashboard/admin/estadisticas/`)

### Baja Prioridad:
- [ ] **Gestión de Médicos** (`src/app/dashboard/admin/medicos/`)
- [ ] **Gestión de Pacientes** (`src/app/dashboard/admin/pacientes/`)
- [ ] **Búsqueda de Médicos** (`src/app/dashboard/medicos/page.tsx`)

---

## 🔄 Migración de Hooks Comunes

### Firebase → Supabase

#### Obtener Colección:
```typescript
// ANTES (Firebase)
import { useCollection } from '@/firebase';
const { data } = useCollection(collectionRef);

// AHORA (Supabase)
import { useCollection } from '@/supabase';
const { data, loading, error } = useCollection('table_name', {
  orderBy: { column: 'created_at', ascending: false },
  filters: [{ column: 'status', operator: '==', value: 'activa' }]
});
```

#### Obtener Documento:
```typescript
// ANTES (Firebase)
import { useDoc } from '@/firebase';
const { data } = useDoc(docRef);

// AHORA (Supabase)
import { useDoc } from '@/supabase';
const { data, loading, error } = useDoc('table_name', 'document-id');
```

#### Insertar Datos:
```typescript
// ANTES (Firebase)
import { collection, addDoc } from 'firebase/firestore';
await addDoc(collection(firestore, 'appointments'), data);

// AHORA (Supabase)
import { supabase } from '@/supabase';
const { data, error } = await supabase
  .from('appointments')
  .insert(data);
```

#### Actualizar Datos:
```typescript
// ANTES (Firebase)
import { doc, updateDoc } from 'firebase/firestore';
await updateDoc(doc(firestore, 'appointments', id), data);

// AHORA (Supabase)
const { data, error } = await supabase
  .from('appointments')
  .update(data)
  .eq('id', id);
```

#### Eliminar Datos:
```typescript
// ANTES (Firebase)
import { doc, deleteDoc } from 'firebase/firestore';
await deleteDoc(doc(firestore, 'appointments', id));

// AHORA (Supabase)
const { error } = await supabase
  .from('appointments')
  .delete()
  .eq('id', id);
```

---

## 🔒 Row Level Security (RLS)

### Políticas Implementadas:

#### Pacientes (PACIENTE):
- ✅ Ver sus propias citas
- ✅ Ver sus propias fórmulas
- ✅ Ver sus notas de evolución
- ✅ Crear citas para sí mismos
- ✅ Crear solicitudes de renovación

#### Personal Médico (PERSONAL):
- ✅ Ver citas asignadas
- ✅ Ver fórmulas emitidas
- ✅ Crear fórmulas
- ✅ Crear notas de evolución
- ✅ Ver todas las notas (historial clínico)
- ✅ Responder solicitudes de renovación

#### Administradores (ADMIN):
- ✅ Acceso completo a todas las tablas
- ✅ Gestión de servicios
- ✅ Gestión de turnos
- ✅ Ver estadísticas completas

---

## 🚀 Cómo Continuar la Migración

### Patrón para Migrar una Página:

1. **Identificar dependencias de Firebase:**
```typescript
import { useFirestore, useCollection, useDoc } from '@/firebase';
```

2. **Reemplazar por Supabase:**
```typescript
import { supabase, useCollection, useDoc } from '@/supabase';
```

3. **Actualizar queries:**
```typescript
// Firebase
const citasRef = collection(firestore, 'appointments');
const { data: citas } = useCollection(citasRef);

// Supabase
const { data: citas } = useCollection('appointments', {
  filters: [{ column: 'patient_id', operator: '==', value: userId }],
  orderBy: { column: 'date', ascending: false }
});
```

4. **Actualizar mutaciones:**
```typescript
// Firebase
await addDoc(collection(firestore, 'appointments'), newAppointment);

// Supabase
await supabase.from('appointments').insert(newAppointment);
```

5. **Probar la funcionalidad**

---

## 📊 Ventajas de Supabase

### ✅ Funcionalidades Mejoradas:
1. **SQL Queries:** Consultas más potentes y flexibles
2. **Joins:** Relacionar tablas fácilmente
3. **Functions:** Lógica de negocio en el backend
4. **Real-time:** Subscripciones a cambios en tiempo real
5. **Storage:** Almacenamiento de archivos integrado
6. **Edge Functions:** Funciones serverless
7. **RLS:** Seguridad a nivel de fila más granular

### 🔧 Herramientas de Desarrollo:
- Dashboard visual completo
- SQL Editor integrado
- Table Editor visual
- API auto-generada
- Logs en tiempo real
- Backup automático

---

## 🆘 Troubleshooting

### Error: "Missing environment variables"
**Solución:** Asegúrate de tener `.env.local` configurado correctamente.

### Error: "Invalid API key"
**Solución:** Verifica que estés usando el `anon key` correcto del proyecto.

### Error: "Permission denied"
**Solución:** Revisa las políticas RLS en Supabase Dashboard → Authentication → Policies.

### Error: "Column does not exist"
**Solución:** Verifica que el schema SQL se haya ejecutado correctamente.

---

## 📞 Soporte

Para problemas con la migración:
1. Revisa la documentación de Supabase: [https://supabase.com/docs](https://supabase.com/docs)
2. Consulta el schema SQL: `supabase_schema.sql`
3. Revisa los ejemplos en los archivos ya migrados

---

## 🎓 Recursos Útiles

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Última actualización:** 19 de Noviembre, 2025
**Estado:** Migración parcial completada (30%)
