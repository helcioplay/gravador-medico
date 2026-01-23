-- ================================================================
-- CORREÇÃO RÁPIDA E SIMPLES: Marcar TODAS mensagens enviadas
-- ================================================================
-- Execute este script COMPLETO no Supabase SQL Editor
-- ================================================================

-- PASSO 1: Ver situação atual
SELECT 
  '📊 SITUAÇÃO ATUAL' as info,
  from_me,
  COUNT(*) as total
FROM whatsapp_messages
GROUP BY from_me;

-- PASSO 2: CORRIGIR mensagens enviadas (baseado nos padrões de ID)
UPDATE whatsapp_messages
SET from_me = true
WHERE from_me = false
  AND (
    -- Todos os padrões conhecidos de mensagens ENVIADAS
    message_id LIKE '3EB%'
    OR message_id LIKE 'BAE%'
    OR message_id LIKE '3EE%'
    OR message_id LIKE '3EF%'
    OR message_id LIKE '3EA%'
    OR message_id LIKE '3A%'
    OR message_id LIKE '3AA%'
    OR message_id LIKE '2551%'
    OR message_id LIKE 'true_%'  -- IDs gerados pelo sistema
  );

-- PASSO 3: Ver resultado
SELECT 
  '✅ APÓS CORREÇÃO' as info,
  from_me,
  COUNT(*) as total
FROM whatsapp_messages
GROUP BY from_me;

-- PASSO 4: Verificar últimas 20 mensagens
SELECT 
  SUBSTRING(message_id, 1, 15) as id,
  SUBSTRING(content, 1, 40) as texto,
  from_me,
  TO_CHAR(timestamp, 'DD/MM HH24:MI') as quando
FROM whatsapp_messages
ORDER BY timestamp DESC
LIMIT 20;
