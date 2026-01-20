-- =============================================
-- GRAVADOR MÉDICO - TABELA USERS
-- =============================================
-- Adiciona tabela de usuários para autenticação
-- =============================================

-- ========================================
-- TABELA: users (Usuários do Sistema)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Dados de autenticação
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  
  -- Relacionamento com APPMAX
  appmax_customer_id TEXT,
  
  -- Controle de acesso
  has_access BOOLEAN DEFAULT true,
  
  -- Role (futuro uso)
  role TEXT DEFAULT 'user', -- user, admin, support
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_appmax_customer_id ON users(appmax_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_has_access ON users(has_access);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura de users" ON users;
CREATE POLICY "Permitir leitura de users" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir escrita de users" ON users;
CREATE POLICY "Permitir escrita de users" ON users FOR ALL USING (true);

-- ========================================
-- CRIAR USUÁRIOS ADMIN
-- ========================================
-- Insere os 2 admins se não existirem

-- Admin 1: helciomattos@gmail.com
INSERT INTO users (email, name, has_access, role)
VALUES ('helciomattos@gmail.com', 'Helcio Mattos', true, 'admin')
ON CONFLICT (email) DO UPDATE
SET 
  has_access = true,
  role = 'admin',
  updated_at = NOW();

-- Admin 2: contato@helciomattos.com.br
INSERT INTO users (email, name, has_access, role)
VALUES ('contato@helciomattos.com.br', 'Helcio Mattos', true, 'admin')
ON CONFLICT (email) DO UPDATE
SET 
  has_access = true,
  role = 'admin',
  updated_at = NOW();

-- ========================================
-- FIM
-- ========================================
-- Execute este script no Supabase SQL Editor
-- 
-- ACESSO:
-- Email: helciomattos@gmail.com OU contato@helciomattos.com.br
-- Senha: QUALQUER (o sistema aceita qualquer senha por enquanto)
