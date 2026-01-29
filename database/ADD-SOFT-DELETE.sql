-- =====================================================
-- SOFT DELETE: Adicionar campo deleted_at
-- =====================================================
-- Permite "excluir" registros sem apagar do banco
-- Mantém histórico completo para auditoria
-- =====================================================

-- Adicionar coluna deleted_at nas tabelas principais
ALTER TABLE sales 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE abandoned_carts 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_sales_deleted_at ON sales(deleted_at);
CREATE INDEX IF NOT EXISTS idx_customers_deleted_at ON customers(deleted_at);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_deleted_at ON abandoned_carts(deleted_at);

-- Comentários
COMMENT ON COLUMN sales.deleted_at IS 'Data de exclusão lógica (soft delete) - NULL = ativo';
COMMENT ON COLUMN customers.deleted_at IS 'Data de exclusão lógica (soft delete) - NULL = ativo';
COMMENT ON COLUMN abandoned_carts.deleted_at IS 'Data de exclusão lógica (soft delete) - NULL = ativo';
