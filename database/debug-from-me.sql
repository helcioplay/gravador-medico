-- ================================================================
-- DEBUG: Ver todas as mensagens com seus valores de from_me
-- ================================================================

-- 1. Contagem geral
SELECT 
  from_me,
  COUNT(*) as total
FROM whatsapp_messages
GROUP BY from_me
ORDER BY from_me DESC;

-- 2. Ver últimas 50 mensagens com detalhes
SELECT 
  id,
  LEFT(message_id, 20) as msg_id,
  LEFT(content, 50) as conteudo,
  from_me,
  status,
  to_char(timestamp, 'DD/MM HH24:MI:SS') as quando,
  to_char(created_at, 'DD/MM HH24:MI:SS') as criado_em
FROM whatsapp_messages
ORDER BY timestamp DESC
LIMIT 50;

-- 3. Ver apenas as enviadas (from_me = true)
SELECT 
  LEFT(message_id, 20) as msg_id,
  LEFT(content, 50) as conteudo,
  status,
  to_char(timestamp, 'DD/MM HH24:MI:SS') as quando
FROM whatsapp_messages
WHERE from_me = true
ORDER BY timestamp DESC
LIMIT 20;

-- 4. Ver apenas as recebidas (from_me = false)
SELECT 
  LEFT(message_id, 20) as msg_id,
  LEFT(content, 50) as conteudo,
  to_char(timestamp, 'DD/MM HH24:MI:SS') as quando
FROM whatsapp_messages
WHERE from_me = false
ORDER BY timestamp DESC
LIMIT 20;

-- 5. Verificar se existem mensagens recentes sem from_me definido
SELECT 
  COUNT(*) as total_sem_from_me,
  MIN(timestamp) as primeira,
  MAX(timestamp) as ultima
FROM whatsapp_messages
WHERE from_me IS NULL;
