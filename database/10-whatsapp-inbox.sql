-- ================================================================
-- MIGRATION: WHATSAPP INBOX (EVOLUTION API v2)
-- ================================================================
-- Cria tabelas para armazenar conversas e mensagens do WhatsApp
-- Integrado com Evolution API v2 via webhooks
-- ================================================================

-- 1. Criar tabela de contatos do WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  remote_jid TEXT NOT NULL UNIQUE, -- Ex: 552199999999@s.whatsapp.net
  name TEXT,
  push_name TEXT,
  profile_picture_url TEXT,
  is_group BOOLEAN DEFAULT FALSE,
  
  -- Última interação
  last_message_content TEXT,
  last_message_timestamp TIMESTAMPTZ,
  last_message_from_me BOOLEAN,
  unread_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar tabela de mensagens
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id TEXT UNIQUE, -- ID único da mensagem da Evolution API
  remote_jid TEXT NOT NULL, -- FK para whatsapp_contacts
  
  -- Conteúdo
  content TEXT, -- Texto da mensagem
  message_type TEXT DEFAULT 'text', -- text, image, video, audio, document, sticker
  media_url TEXT, -- URL da mídia se houver
  caption TEXT, -- Legenda se for mídia
  
  -- Metadata
  from_me BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMPTZ NOT NULL,
  status TEXT, -- sent, delivered, read
  
  -- Raw payload
  raw_payload JSONB, -- Payload completo da Evolution API
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_remote_jid ON whatsapp_contacts(remote_jid);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_last_message ON whatsapp_contacts(last_message_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_remote_jid ON whatsapp_messages(remote_jid);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_timestamp ON whatsapp_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_message_id ON whatsapp_messages(message_id);

-- 4. Adicionar foreign key
ALTER TABLE whatsapp_messages 
  DROP CONSTRAINT IF EXISTS fk_whatsapp_messages_contact;

ALTER TABLE whatsapp_messages 
  ADD CONSTRAINT fk_whatsapp_messages_contact 
  FOREIGN KEY (remote_jid) 
  REFERENCES whatsapp_contacts(remote_jid) 
  ON DELETE CASCADE;

-- 5. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_whatsapp_contact_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_whatsapp_contact_timestamp ON whatsapp_contacts;
CREATE TRIGGER trigger_update_whatsapp_contact_timestamp
  BEFORE UPDATE ON whatsapp_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_whatsapp_contact_timestamp();

-- 6. Função para atualizar contato quando nova mensagem chega
CREATE OR REPLACE FUNCTION update_contact_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar ou criar contato
  INSERT INTO whatsapp_contacts (
    remote_jid,
    last_message_content,
    last_message_timestamp,
    last_message_from_me,
    unread_count
  ) VALUES (
    NEW.remote_jid,
    COALESCE(NEW.content, NEW.caption, '[Mídia]'),
    NEW.timestamp,
    NEW.from_me,
    CASE WHEN NEW.from_me THEN 0 ELSE 1 END
  )
  ON CONFLICT (remote_jid) 
  DO UPDATE SET
    last_message_content = COALESCE(NEW.content, NEW.caption, '[Mídia]'),
    last_message_timestamp = NEW.timestamp,
    last_message_from_me = NEW.from_me,
    unread_count = CASE 
      WHEN NEW.from_me THEN 0
      ELSE whatsapp_contacts.unread_count + 1
    END,
    updated_at = NOW();
  
  RAISE NOTICE '✅ Contato atualizado: %', NEW.remote_jid;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_contact_on_message ON whatsapp_messages;
CREATE TRIGGER trigger_update_contact_on_message
  AFTER INSERT ON whatsapp_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_on_new_message();

-- 7. View para facilitar consultas de conversas
CREATE OR REPLACE VIEW whatsapp_conversations AS
SELECT 
  c.id,
  c.remote_jid,
  c.name,
  c.push_name,
  c.profile_picture_url,
  c.is_group,
  c.last_message_content,
  c.last_message_timestamp,
  c.last_message_from_me,
  c.unread_count,
  c.updated_at,
  (
    SELECT COUNT(*) 
    FROM whatsapp_messages m 
    WHERE m.remote_jid = c.remote_jid
  ) as total_messages
FROM whatsapp_contacts c
ORDER BY c.last_message_timestamp DESC NULLS LAST;

-- ================================================================
-- VERIFICAÇÃO
-- ================================================================
SELECT 
  'whatsapp_contacts' as tabela,
  COUNT(*) as total
FROM whatsapp_contacts
UNION ALL
SELECT 
  'whatsapp_messages' as tabela,
  COUNT(*) as total
FROM whatsapp_messages;

COMMENT ON TABLE whatsapp_contacts IS 'Contatos/Conversas do WhatsApp integrados via Evolution API v2';
COMMENT ON TABLE whatsapp_messages IS 'Mensagens do WhatsApp - Populadas via webhook MESSAGES_UPSERT';
COMMENT ON VIEW whatsapp_conversations IS 'View agregada para listagem de conversas com contadores';
