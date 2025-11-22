-- PASO 2: Agregar 'document_uploaded' al enum notification_type
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'document_uploaded';
