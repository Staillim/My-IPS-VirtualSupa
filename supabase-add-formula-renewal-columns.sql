-- Agregar columnas para el sistema de renovación de fórmulas

-- Agregar columna para marcar si una fórmula es una renovación
ALTER TABLE formulas 
ADD COLUMN IF NOT EXISTS is_renewal BOOLEAN DEFAULT FALSE;

-- Agregar columna para referenciar la fórmula original en caso de renovación
ALTER TABLE formulas 
ADD COLUMN IF NOT EXISTS original_formula_id UUID REFERENCES formulas(id) ON DELETE SET NULL;

-- Crear índice para mejorar las consultas de renovaciones
CREATE INDEX IF NOT EXISTS idx_formulas_is_renewal ON formulas(is_renewal);
CREATE INDEX IF NOT EXISTS idx_formulas_original_formula_id ON formulas(original_formula_id);

-- Comentarios para documentación
COMMENT ON COLUMN formulas.is_renewal IS 'Indica si esta fórmula es una renovación de otra fórmula anterior';
COMMENT ON COLUMN formulas.original_formula_id IS 'ID de la fórmula original si esta es una renovación';
