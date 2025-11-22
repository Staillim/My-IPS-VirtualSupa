-- PASO 3: Agregar 'reschedule_accepted' al enum notification_type
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'reschedule_accepted';
