-- =============================================
-- 🔍 DIAGNÓSTICO COMPLETO - CAROLINA E SILAS
-- =============================================
-- Execute CADA query separadamente e me mande os resultados
-- =============================================

-- 1️⃣ VENDAS DA CAROLINA (ver se há duplicatas)
SELECT 
    id,
    customer_name,
    customer_email,
    total_amount,
    order_status,
    payment_gateway,
    mercadopago_payment_id,
    appmax_order_id,
    idempotency_key,
    fallback_used,
    created_at
FROM sales 
WHERE customer_email ILIKE '%carol%'
ORDER BY created_at DESC;

-- 2️⃣ VENDAS DO SILAS
SELECT 
    id,
    customer_name,
    customer_email,
    total_amount,
    order_status,
    payment_gateway,
    mercadopago_payment_id,
    appmax_order_id,
    idempotency_key,
    fallback_used,
    created_at
FROM sales 
WHERE customer_name ILIKE '%silas%'
ORDER BY created_at DESC;

-- 3️⃣ VER FILA DE PROVISIONAMENTO
SELECT 
    pq.id,
    pq.sale_id,
    pq.status,
    pq.retry_count,
    pq.last_error,
    pq.created_at,
    pq.completed_at,
    s.customer_email,
    s.customer_name,
    s.order_status as sale_status
FROM provisioning_queue pq
LEFT JOIN sales s ON pq.sale_id = s.id
ORDER BY pq.created_at DESC
LIMIT 10;

-- 4️⃣ VER CHECKOUT_LOGS (erros do checkout)
SELECT 
    id,
    order_id,
    gateway,
    status,
    error_message,
    created_at
FROM checkout_logs
ORDER BY created_at DESC
LIMIT 20;

-- 5️⃣ VER SE INTEGRATION_LOGS EXISTE E TEM DADOS
SELECT COUNT(*) as total FROM integration_logs;

-- 6️⃣ VER TODOS OS INTEGRATION_LOGS RECENTES
SELECT * FROM integration_logs ORDER BY created_at DESC LIMIT 10;

-- 7️⃣ VERIFICAR SE HÁ VENDAS SEM PROVISIONING
SELECT 
    s.id,
    s.customer_email,
    s.customer_name,
    s.order_status,
    s.payment_gateway,
    s.created_at,
    CASE WHEN pq.id IS NULL THEN 'NÃO' ELSE 'SIM' END as tem_provisioning,
    pq.status as provisioning_status
FROM sales s
LEFT JOIN provisioning_queue pq ON s.id = pq.sale_id
WHERE s.order_status IN ('paid', 'active')
  AND s.created_at > NOW() - INTERVAL '7 days'
ORDER BY s.created_at DESC;
