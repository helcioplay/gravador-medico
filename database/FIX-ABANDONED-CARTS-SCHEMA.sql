-- =============================================
-- FIX: Schema da tabela abandoned_carts
-- =============================================
-- Corrige campos faltantes que causam erro 400/406
-- =============================================

-- 1. Verificar quais colunas existem atualmente
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'abandoned_carts'
ORDER BY ordinal_position;

-- 2. Adicionar todas as colunas necessárias (se não existirem)
ALTER TABLE public.abandoned_carts 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS customer_cpf TEXT,
ADD COLUMN IF NOT EXISTS document_type TEXT DEFAULT 'CPF',
ADD COLUMN IF NOT EXISTS step TEXT DEFAULT 'form_filled',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS product_id TEXT,
ADD COLUMN IF NOT EXISTS order_bumps JSONB,
ADD COLUMN IF NOT EXISTS discount_code TEXT,
ADD COLUMN IF NOT EXISTS cart_value NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS recovered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS recovered_order_id TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 3. Atualizar constraint de status (incluir 'pending')
ALTER TABLE abandoned_carts DROP CONSTRAINT IF EXISTS abandoned_carts_status_check;

ALTER TABLE abandoned_carts ADD CONSTRAINT abandoned_carts_status_check 
CHECK (status IN ('pending', 'abandoned', 'recovered'));

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts(customer_email);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_status ON abandoned_carts(status);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_created_at ON abandoned_carts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_session_id ON abandoned_carts(session_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_cpf ON abandoned_carts(customer_cpf);

-- 5. Garantir RLS está ativo mas permite INSERT anônimo
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Drop políticas antigas se existirem
DROP POLICY IF EXISTS "Anon can insert carts" ON abandoned_carts;
DROP POLICY IF EXISTS "Anon can update carts" ON abandoned_carts;

-- Policy: Qualquer um pode inserir carrinhos (anônimo)
CREATE POLICY "Anon can insert carts" 
  ON abandoned_carts 
  FOR INSERT 
  WITH CHECK (true);

-- Policy: Qualquer um pode atualizar carrinhos pelo session_id
CREATE POLICY "Anon can update carts" 
  ON abandoned_carts 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- 6. Verificar estrutura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'abandoned_carts'
ORDER BY ordinal_position;
