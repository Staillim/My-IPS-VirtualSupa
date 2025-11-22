# 🚀 Migración de Firebase a Supabase - IPS Virtual

## 📊 Estado Actual de la Migración

### ✅ **Completado (30%)**

#### Infraestructura Base:
- [x] Instalación de dependencias de Supabase
- [x] Configuración de cliente Supabase (browser y server)
- [x] Provider de contexto de Supabase
- [x] Hooks personalizados (`useCollection`, `useDoc`)
- [x] Schema SQL completo con 9 tablas
- [x] 25+ políticas RLS implementadas
- [x] 40+ índices de base de datos
- [x] Triggers y funciones automáticas

#### Componentes y Páginas:
- [x] Layout principal (`app/layout.tsx`)
- [x] Página de registro (`app/signup/page.tsx`)
- [x] Página de login (`app/login/page.tsx`)
- [x] Dashboard principal (`app/dashboard/page.tsx`)
- [x] Protected Route component
- [x] Imports actualizados en página de citas

#### Documentación:
- [x] Guía de migración completa (`MIGRACION_SUPABASE.md`)
- [x] Script de migración de datos (`migrate-data.js`)
- [x] Ejemplos de código migrado (`docs/migration-examples/`)
- [x] Archivo `.env.local.example`

### 🔄 **En Progreso (20%)**
- [ ] Página de gestión de citas (`dashboard/citas/page.tsx`) - imports actualizados
- [ ] Actualizar queries de citas de Firebase a Supabase
- [ ] Migrar lógica de creación de citas
- [ ] Migrar lógica de cancelación/reprogramación

### ⏳ **Pendiente (50%)**

#### Alta Prioridad:
- [ ] Dashboard de administrador
- [ ] Gestión completa de citas (queries y mutaciones)
- [ ] Gestión de fórmulas médicas
- [ ] Sistema de notificaciones en tiempo real
- [ ] Gestión de turnos médicos
- [ ] Historial médico del paciente
- [ ] Perfil de usuario

#### Media Prioridad:
- [ ] Dashboard del personal médico
- [ ] Gestión de servicios (admin)
- [ ] Estadísticas y reportes
- [ ] Búsqueda de médicos
- [ ] Solicitudes de renovación de fórmulas
- [ ] Notas de evolución

#### Baja Prioridad:
- [ ] Gestión de médicos (admin)
- [ ] Gestión de pacientes (admin)
- [ ] Configuración avanzada
- [ ] Exportación de datos
- [ ] Informes PDF

---

## 🎯 Próximos Pasos Inmediatos

### 1. **Configurar Proyecto Supabase** (30 min)
```bash
# Pasos:
1. Crear cuenta en https://supabase.com
2. Crear nuevo proyecto
3. Anotar credenciales (URL y Keys)
4. Ir a SQL Editor
5. Copiar y ejecutar supabase_schema.sql
6. Verificar que las 9 tablas se crearon correctamente
```

### 2. **Configurar Variables de Entorno** (5 min)
```bash
# Crear .env.local en la raíz del proyecto
cp .env.local.example .env.local

# Editar con tus credenciales:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. **Probar Registro y Login** (15 min)
```bash
# Iniciar servidor de desarrollo
npm run dev

# Probar:
1. Registro de nuevo paciente (/signup)
2. Verificar que se crea en users y paciente_roles
3. Login con las credenciales (/login)
4. Verificar que carga el dashboard
```

### 4. **Migrar Datos Existentes (Opcional)** (1-2 horas)
```bash
# Si tienes datos en Firebase que quieres migrar:
1. Descargar Firebase Service Account Key
2. Guardar como firebase-service-account.json
3. Instalar dependencias: npm install firebase-admin
4. Ejecutar: node migrate-data.js
5. Verificar logs y datos migrados
```

### 5. **Continuar con Gestión de Citas** (2-4 horas)
```bash
# Completar migración de dashboard/citas/page.tsx:
1. Actualizar todas las queries de Firebase a Supabase
2. Migrar funciones de creación de citas
3. Migrar funciones de actualización
4. Probar flujo completo de citas
5. Ver ejemplos en docs/migration-examples/appointments-migration.tsx
```

---

## 📁 Estructura de Archivos Creados

```
proyecto/
├── .env.local.example              # Template de variables de entorno
├── supabase_schema.sql             # Schema completo de PostgreSQL
├── migrate-data.js                 # Script de migración de datos
├── MIGRACION_SUPABASE.md           # Guía completa de migración
├── docs/
│   └── migration-examples/
│       └── appointments-migration.tsx  # Ejemplos de código migrado
└── src/
    ├── supabase/
    │   ├── client.ts              # Cliente browser de Supabase
    │   ├── server.ts              # Cliente server de Supabase
    │   ├── provider.tsx           # Context provider
    │   ├── index.ts               # Exports principales
    │   └── hooks/
    │       ├── use-collection.tsx # Hook para colecciones
    │       └── use-doc.tsx        # Hook para documentos
    └── firebase/
        └── config.ts              # Config actualizada (Supabase + Firebase)
```

---

## 🛠️ Comandos Útiles

### Desarrollo:
```bash
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Build de producción
npm run lint             # Verificar errores de ESLint
```

### Base de Datos:
```bash
# En Supabase Dashboard:
# SQL Editor → New query → Paste schema → Run

# Para ver tablas:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

# Para ver políticas RLS:
SELECT * FROM pg_policies;
```

### Migración de Datos:
```bash
npm install firebase-admin  # Instalar dependencia
node migrate-data.js        # Ejecutar migración
```

---

## 🔑 Diferencias Clave Firebase vs Supabase

| Aspecto | Firebase | Supabase |
|---------|----------|----------|
| **Base de Datos** | NoSQL (Firestore) | SQL (PostgreSQL) |
| **Queries** | Limited queries, no joins | Full SQL power, joins |
| **Real-time** | Built-in listeners | Real-time subscriptions |
| **Auth** | Firebase Auth | Supabase Auth (similar) |
| **Security** | Security Rules | Row Level Security (RLS) |
| **Pricing** | Pay per read/write | Pay per GB storage |
| **Data Structure** | Collections/Documents | Tables/Rows |
| **Relationships** | Manual references | Foreign keys |
| **Indexing** | Automatic | Manual (more control) |
| **Transactions** | Limited | Full ACID support |

---

## 📖 Recursos de Aprendizaje

### Documentación Oficial:
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)

### Tutoriales:
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [SQL vs NoSQL](https://www.mongodb.com/nosql-explained/nosql-vs-sql)

### Comunidad:
- [Supabase Discord](https://discord.supabase.com/)
- [Supabase GitHub](https://github.com/supabase/supabase)

---

## ⚠️ Notas Importantes

### Seguridad:
- ✅ Nunca commitear `.env.local` al repositorio
- ✅ Usar Service Role Key solo en servidor (nunca en cliente)
- ✅ Todas las tablas tienen RLS habilitado
- ✅ Políticas RLS respetan jerarquía ADMIN > PERSONAL > PACIENTE

### Datos Sensibles:
- ✅ Cumple con Ley 1581/2012 de Colombia
- ✅ Consentimiento de privacidad obligatorio
- ✅ Datos de salud protegidos por RLS
- ✅ Acceso a historial médico solo para personal autorizado

### Performance:
- ✅ 40+ índices optimizados
- ✅ Queries eficientes con PostgreSQL
- ✅ Real-time subscriptions solo donde es necesario
- ✅ Paginación recomendada para listas grandes

---

## 🐛 Troubleshooting Común

### Error: "Missing environment variables"
```bash
# Solución:
1. Verificar que existe .env.local
2. Reiniciar servidor: Ctrl+C y npm run dev
3. Verificar que las variables empiezan con NEXT_PUBLIC_
```

### Error: "Invalid API key"
```bash
# Solución:
1. Ir a Supabase Dashboard → Settings → API
2. Copiar "anon" key (no "service_role")
3. Pegar en NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Error: "Permission denied for table"
```bash
# Solución:
1. Ir a Supabase Dashboard → Authentication → Policies
2. Verificar que la tabla tiene políticas RLS
3. Ejecutar supabase_schema.sql nuevamente si es necesario
```

### Error: "relation does not exist"
```bash
# Solución:
1. Ir a Supabase Dashboard → SQL Editor
2. Ejecutar: SELECT * FROM users; (probar cada tabla)
3. Si falta, ejecutar supabase_schema.sql completo
```

---

## 📞 Contacto y Soporte

Para preguntas sobre la migración:
1. Revisar `MIGRACION_SUPABASE.md` para guía detallada
2. Ver ejemplos en `docs/migration-examples/`
3. Consultar documentación oficial de Supabase
4. Revisar el schema SQL: `supabase_schema.sql`

---

## 📈 Progreso Detallado

```
Total de Archivos a Migrar: ~40
Archivos Migrados: 12 (30%)
Tiempo Estimado Restante: 15-20 horas

Fases:
Phase 1: Infraestructura ✅ (100%)
Phase 2: Auth & Layout ✅ (100%)
Phase 3: Citas 🔄 (20%)
Phase 4: Fórmulas ⏳ (0%)
Phase 5: Admin ⏳ (0%)
Phase 6: Notificaciones ⏳ (0%)
Phase 7: Testing ⏳ (0%)
```

---

**Última Actualización:** 19 de Noviembre, 2025
**Autor:** GitHub Copilot
**Estado:** Migración en progreso - Fase 3 de 7
