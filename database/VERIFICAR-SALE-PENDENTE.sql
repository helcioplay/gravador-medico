-- =============================================
-- VERIFICAR VENDA PENDENTE NA FILA
-- =============================================
-- Sale ID: 55a82f19-4738-4b66-bbfe-3639af0d2a1e
-- =============================================

-- 1️⃣ VER DETALHES DA FILA (incluindo next_retry_at)
SELECT 
    id,
    sale_id,
    status,
    retry_count,
    next_retry_at,
    last_error,
    created_at,
    updated_at
FROM public.provisioning_queue
WHERE sale_id = '55a82f19-4738-4b66-bbfe-3639af0d2a1e';

-- 2️⃣ BUSCAR NA TABELA SALES
SELECT 
    id,
    customer_name,
    customer_email,
    customer_phone,
    total_amount,
    order_status,
    payment_gateway,
    metadata,
    created_at
FROM public.sales
WHERE id = '55a82f19-4738-4b66-bbfe-3639af0d2a1e';

-- 3️⃣ BUSCAR NA TABELA ORDERS
SELECT 
    id,
    customer_name,
    customer_email,
    amount,
    status,
    gateway_provider,
    created_at
FROM public.orders
WHERE id = '55a82f19-4738-4b66-bbfe-3639af0d2a1e';

-- 4️⃣ VERIFICAR SE USUÁRIO JÁ FOI CRIADO (procurar pelo email)
-- Primeiro, pegue o email da venda e depois execute:
-- SELECT * FROM auth.users WHERE email = 'EMAIL_DO_CLIENTE';

-- 5️⃣ CORRIGIR STATUS E FORÇAR REPROCESSAMENTO
-- Execute este bloco para corrigir:
/*
-- Passo 1: Atualizar status da venda para 'paid'
UPDATE public.sales
SET order_status = 'paid'
WHERE id = '55a82f19-4738-4b66-bbfe-3639af0d2a1e';

-- Passo 2: Resetar fila de provisioning
UPDATE public.provisioning_queue
SET 
    next_retry_at = NULL,
    status = 'pending',
    retry_count = 0
WHERE sale_id = '55a82f19-4738-4b66-bbfe-3639af0d2a1e';
*/

-- 6️⃣ CORRIGIR AGORA (REMOVA O COMENTÁRIO E EXECUTE)
UPDATE public.sales
SET order_status = 'paid'
WHERE id = '55a82f19-4738-4b66-bbfe-3639af0d2a1e';

UPDATE public.provisioning_queue
SET 
    next_retry_at = NULL,
    status = 'pending',
    retry_count = 0
WHERE sale_id = '55a82f19-4738-4b66-bbfe-3639af0d2a1e';
