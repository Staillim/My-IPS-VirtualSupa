-- Agregar nuevos tipos de notificación para renovaciones de fórmulas

-- Primero verificar los tipos actuales del enum
-- SELECT enum_range(NULL::notification_type);

-- Agregar los nuevos tipos al enum notification_type
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'renewal_approved';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'renewal_rejected';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'renewal_requested';
