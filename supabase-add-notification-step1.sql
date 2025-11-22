-- PASO 1: Agregar 'video_call_ready' al enum notification_type
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'video_call_ready';
