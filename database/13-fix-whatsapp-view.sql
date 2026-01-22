-- ================================================================
-- CORREÇÃO: Recriar VIEW whatsapp_conversations
-- ================================================================
-- A VIEW pode estar causando erro após adicionar coluna from_me
-- Vamos recriá-la garantindo compatibilidade

DROP VIEW IF EXISTS whatsapp_conversations CASCADE;

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
  ) as total_messages,
  (
    SELECT COUNT(*) 
    FROM whatsapp_messages m 
    WHERE m.remote_jid = c.remote_jid 
    AND m.from_me = false
  ) as received_messages,
  (
    SELECT COUNT(*) 
    FROM whatsapp_messages m 
    WHERE m.remote_jid = c.remote_jid 
    AND m.from_me = true
  ) as sent_messages
FROM whatsapp_contacts c
ORDER BY c.last_message_timestamp DESC NULLS LAST;

COMMENT ON VIEW whatsapp_conversations IS 'View agregada para listagem de conversas com contadores de mensagens enviadas/recebidas';

-- ================================================================
-- ATUALIZAR MENSAGENS EXISTENTES
-- ================================================================
-- Importante: Mensagens do webhook vêm com from_me, 
-- mas mensagens antigas podem estar com FALSE por padrão

-- Se você tiver como identificar mensagens enviadas pelo sistema,
-- atualize aqui. Exemplo:
-- UPDATE whatsapp_messages 
-- SET from_me = true 
-- WHERE <sua_condição_para_identificar_mensagens_enviadas>;

-- Se não souber, deixe como está e apenas novas mensagens 
-- virão com o campo correto do webhook
