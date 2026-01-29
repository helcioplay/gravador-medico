-- =============================================
-- DIAGNÓSTICO: Verificar timestamps das vendas
-- =============================================
-- Execute este SQL no Supabase SQL Editor para ver
-- como as vendas estão armazenadas e depurar filtros
-- =============================================

-- 1️⃣ VER TODAS AS VENDAS DOS ÚLTIMOS 3 DIAS (com timezone)
SELECT 
    id,
    customer_name,
    customer_email,
    total_amount,
    order_status,
    payment_gateway,
    created_at AS created_at_utc,
    created_at AT TIME ZONE 'America/Sao_Paulo' AS created_at_brasil,
    DATE(created_at AT TIME ZONE 'America/Sao_Paulo') AS data_brasil
FROM public.sales
WHERE created_at >= NOW() - INTERVAL '3 days'
ORDER BY created_at DESC;

-- 2️⃣ CONTAR VENDAS POR DIA (no fuso Brasil)
SELECT 
    DATE(created_at AT TIME ZONE 'America/Sao_Paulo') AS data_brasil,
    COUNT(*) as total_vendas,
    COUNT(*) FILTER (WHERE order_status IN ('paid', 'approved', 'active')) as vendas_pagas,
    SUM(total_amount) FILTER (WHERE order_status IN ('paid', 'approved', 'active')) as faturamento
FROM public.sales
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at AT TIME ZONE 'America/Sao_Paulo')
ORDER BY data_brasil DESC;

-- 3️⃣ VERIFICAR VENDAS DE ONTEM (28/01/2026)
-- Considerando que "ontem" no Brasil = 28/01/2026 00:00:00 BRT até 28/01/2026 23:59:59 BRT
-- Em UTC = 28/01/2026 03:00:00 UTC até 29/01/2026 02:59:59 UTC
SELECT 
    id,
    customer_name,
    total_amount,
    order_status,
    created_at AS utc,
    created_at AT TIME ZONE 'America/Sao_Paulo' AS brasil
FROM public.sales
WHERE DATE(created_at AT TIME ZONE 'America/Sao_Paulo') = '2026-01-28'
ORDER BY created_at;

-- 4️⃣ VERIFICAR VENDAS DE HOJE (29/01/2026)
SELECT 
    id,
    customer_name,
    total_amount,
    order_status,
    created_at AS utc,
    created_at AT TIME ZONE 'America/Sao_Paulo' AS brasil
FROM public.sales
WHERE DATE(created_at AT TIME ZONE 'America/Sao_Paulo') = '2026-01-29'
ORDER BY created_at;

-- 5️⃣ TAMBÉM VERIFICAR TABELA ORDERS (usada pelo checkout cascade)
SELECT 
    id,
    customer_name,
    total_amount,
    status,
    gateway_provider,
    created_at AS utc,
    created_at AT TIME ZONE 'America/Sao_Paulo' AS brasil
FROM public.orders
WHERE created_at >= NOW() - INTERVAL '3 days'
ORDER BY created_at DESC;

-- 6️⃣ VERIFICAR FILA DE PROVISIONING
SELECT 
    id,
    sale_id,
    order_id,
    status,
    retry_count,
    last_error,
    created_at
FROM public.provisioning_queue
ORDER BY created_at DESC
LIMIT 20;
