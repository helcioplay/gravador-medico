-- =====================================================
-- 📧 SISTEMA DE TRACKING DE E-MAILS
-- =====================================================
-- Migração: 10-email-tracking-system.sql
-- Criado em: 28/01/2026
-- Descrição: Tabela completa para rastreamento de e-mails
-- =====================================================

-- Tabela principal de e-mails enviados
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  email_id VARCHAR(255) UNIQUE, -- ID retornado pelo Resend
  message_id VARCHAR(255), -- Message-ID do e-mail
  
  -- Destinatário
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  
  -- Conteúdo
  subject TEXT NOT NULL,
  html_content TEXT, -- Conteúdo HTML completo
  text_content TEXT, -- Conteúdo texto plano
  email_type VARCHAR(50) NOT NULL, -- welcome, pix_pending, password_reset, etc
  
  -- Remetente
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255),
  
  -- Contexto
  order_id VARCHAR(255), -- ID do pedido relacionado
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
  
  -- Status de Envio
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, sent, delivered, failed, bounced
  error_message TEXT,
  
  -- Tracking de Abertura
  opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0, -- Quantas vezes foi aberto
  first_opened_at TIMESTAMPTZ, -- Primeira abertura
  last_opened_at TIMESTAMPTZ, -- Última abertura
  
  -- Tracking de Clique (futuro)
  clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  
  -- Device/Browser Info (da primeira abertura)
  user_agent TEXT,
  ip_address INET,
  device_type VARCHAR(50), -- desktop, mobile, tablet
  browser VARCHAR(100),
  os VARCHAR(100),
  location_country VARCHAR(100),
  location_city VARCHAR(100),
  
  -- Metadata adicional
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_order ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_opened ON email_logs(opened);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_id ON email_logs(email_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_customer ON email_logs(customer_id);

-- Tabela de eventos de e-mail (histórico detalhado)
CREATE TABLE IF NOT EXISTS email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_log_id UUID REFERENCES email_logs(id) ON DELETE CASCADE,
  
  event_type VARCHAR(50) NOT NULL, -- sent, delivered, opened, clicked, bounced, complained
  event_data JSONB DEFAULT '{}',
  
  user_agent TEXT,
  ip_address INET,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_events_log ON email_events(email_log_id);
CREATE INDEX IF NOT EXISTS idx_email_events_type ON email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_created ON email_events(created_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_email_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_email_logs_updated_at
  BEFORE UPDATE ON email_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_email_logs_updated_at();

-- View para estatísticas rápidas
CREATE OR REPLACE VIEW email_stats AS
SELECT 
  email_type,
  COUNT(*) as total_sent,
  COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  COUNT(*) FILTER (WHERE opened = true) as opened,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE opened = true) / NULLIF(COUNT(*), 0),
    2
  ) as open_rate,
  COUNT(*) FILTER (WHERE clicked = true) as clicked,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE clicked = true) / NULLIF(COUNT(*), 0),
    2
  ) as click_rate
FROM email_logs
GROUP BY email_type;

-- RLS (Row Level Security) - Opcional
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

-- Política: Admins podem ver tudo
CREATE POLICY "Admin can view all emails" ON email_logs
  FOR SELECT
  USING (true); -- Ajuste conforme seu sistema de autenticação

CREATE POLICY "Admin can view all events" ON email_events
  FOR SELECT
  USING (true);

-- Comentários para documentação
COMMENT ON TABLE email_logs IS 'Registro completo de todos os e-mails enviados pelo sistema';
COMMENT ON COLUMN email_logs.email_id IS 'ID retornado pelo provedor de e-mail (Resend)';
COMMENT ON COLUMN email_logs.opened IS 'Se o e-mail foi aberto ao menos uma vez';
COMMENT ON COLUMN email_logs.open_count IS 'Número total de vezes que o e-mail foi aberto';
COMMENT ON TABLE email_events IS 'Histórico detalhado de eventos de cada e-mail';
