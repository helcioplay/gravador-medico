-- =====================================================
-- FIX: Dashboard Admin - Bypass RLS
-- =====================================================
-- PROBLEMA: Dashboard admin mostra dados vazios porque as funções 
--           e views respeitam RLS do usuário logado
--
-- SOLUÇÃO: Adicionar SECURITY DEFINER nas funções para que executem
--          com permissões do owner (postgres/admin) e ignorem RLS
--
-- Data: 29/01/2026
-- =====================================================

-- =====================================================
-- 1. FIX: get_analytics_period - ADICIONAR SECURITY DEFINER
-- =====================================================

-- Drop da função existente para evitar conflitos
DROP FUNCTION IF EXISTS public.get_analytics_period(timestamp with time zone, timestamp with time zone) CASCADE;

CREATE OR REPLACE FUNCTION public.get_analytics_period(
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
    unique_visitors BIGINT,
    total_sales BIGINT,
    pending_sales BIGINT,
    paid_sales BIGINT,
    failed_sales BIGINT,
    total_revenue NUMERIC,
    gross_revenue NUMERIC,
    total_discount NUMERIC,
    conversion_rate NUMERIC,
    average_order_value NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER  -- 🔑 BYPASS RLS - Executa com permissões do owner
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH period_visits AS (
        SELECT
            COUNT(DISTINCT session_id) as unique_visitors
        FROM public.analytics_visits
        WHERE created_at BETWEEN start_date AND end_date
    ),
    period_sales AS (
        SELECT
            -- Total de vendas (incluindo pending e processing)
            COUNT(*) as total_sales,
            COUNT(*) FILTER (WHERE order_status IN ('pending', 'processing', 'fraud_analysis')) as pending_sales,
            COUNT(*) FILTER (WHERE order_status IN ('paid', 'provisioning', 'active')) as paid_sales,
            COUNT(*) FILTER (WHERE order_status IN ('cancelled', 'refused', 'failed')) as failed_sales,
            
            -- Receita líquida (só vendas pagas)
            COALESCE(SUM(total_amount) FILTER (WHERE order_status IN ('paid', 'provisioning', 'active')), 0) as total_revenue,
            
            -- Receita bruta (subtotal antes de descontos - só vendas pagas)
            COALESCE(SUM(subtotal) FILTER (WHERE order_status IN ('paid', 'provisioning', 'active')), 0) as gross_revenue,
            
            -- Total de descontos aplicados (só vendas pagas)
            COALESCE(SUM(COALESCE(discount, 0)) FILTER (WHERE order_status IN ('paid', 'provisioning', 'active')), 0) as total_discount
            
        FROM public.sales
        WHERE created_at BETWEEN start_date AND end_date
    )
    SELECT
        pv.unique_visitors,
        ps.total_sales,
        ps.pending_sales,
        ps.paid_sales,
        ps.failed_sales,
        ps.total_revenue,
        ps.gross_revenue,
        ps.total_discount,
        -- Taxa de conversão (vendas pagas / visitantes únicos * 100)
        CASE 
            WHEN pv.unique_visitors > 0 THEN (ps.paid_sales::NUMERIC / pv.unique_visitors::NUMERIC * 100)
            ELSE 0
        END as conversion_rate,
        -- Ticket médio (receita / vendas pagas)
        CASE 
            WHEN ps.paid_sales > 0 THEN (ps.total_revenue / ps.paid_sales)
            ELSE 0
        END as average_order_value
    FROM period_visits pv
    CROSS JOIN period_sales ps;
END;
$$;

-- Adicionar comentário explicativo
COMMENT ON FUNCTION public.get_analytics_period IS 
'Retorna métricas do período - SECURITY DEFINER para bypass de RLS (uso admin apenas)';

-- =====================================================
-- 2. FIX: get_sales_chart_data - ADICIONAR SECURITY DEFINER
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_sales_chart_data(
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
    date TEXT,
    sales BIGINT,
    amount NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER  -- 🔑 BYPASS RLS
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        TO_CHAR(DATE(s.created_at AT TIME ZONE 'America/Sao_Paulo'), 'YYYY-MM-DD') as date,
        COUNT(*) as sales,
        COALESCE(SUM(s.total_amount), 0) as amount
    FROM public.sales s
    WHERE s.created_at BETWEEN start_date AND end_date
        AND s.order_status IN ('paid', 'provisioning', 'active')
    GROUP BY DATE(s.created_at AT TIME ZONE 'America/Sao_Paulo')
    ORDER BY DATE(s.created_at AT TIME ZONE 'America/Sao_Paulo') ASC;
END;
$$;

COMMENT ON FUNCTION public.get_sales_chart_data IS 
'Retorna dados do gráfico de vendas por dia - SECURITY DEFINER para bypass de RLS';

-- =====================================================
-- 3. FIX: get_funnel_data - ADICIONAR SECURITY DEFINER
-- =====================================================

-- Drop da função existente (se houver conflito de assinatura)
DROP FUNCTION IF EXISTS public.get_funnel_data(timestamp with time zone, timestamp with time zone) CASCADE;

CREATE OR REPLACE FUNCTION public.get_funnel_data(
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
    stage TEXT,
    count BIGINT,
    conversion_rate NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER  -- 🔑 BYPASS RLS
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH funnel AS (
        SELECT
            COUNT(DISTINCT av.session_id) as visitors,
            COUNT(DISTINCT CASE WHEN ae.event_name = 'add_to_cart' THEN ae.session_id::TEXT END) as add_to_cart,
            COUNT(DISTINCT CASE WHEN ae.event_name = 'begin_checkout' THEN ae.session_id::TEXT END) as checkout_initiated,
            COUNT(DISTINCT s.customer_email) as completed_purchase
        FROM public.analytics_visits av
        LEFT JOIN public.analytics_events ae 
            ON av.session_id::TEXT = ae.session_id::TEXT 
            AND ae.created_at BETWEEN start_date AND end_date
        LEFT JOIN public.sales s 
            ON s.created_at BETWEEN start_date AND end_date
            AND s.order_status IN ('paid', 'provisioning', 'active')
        WHERE av.created_at BETWEEN start_date AND end_date
    )
    SELECT stage, stage_count, 
        CASE 
            WHEN visitors > 0 THEN (stage_count::NUMERIC / visitors::NUMERIC * 100)
            ELSE 0
        END as conversion_rate
    FROM (
        SELECT 'Visitantes' as stage, visitors as stage_count, visitors FROM funnel
        UNION ALL
        SELECT 'Adicionou ao Carrinho', add_to_cart, visitors FROM funnel
        UNION ALL
        SELECT 'Iniciou Checkout', checkout_initiated, visitors FROM funnel
        UNION ALL
        SELECT 'Finalizou Compra', completed_purchase, visitors FROM funnel
    ) t
    ORDER BY 
        CASE stage
            WHEN 'Visitantes' THEN 1
            WHEN 'Adicionou ao Carrinho' THEN 2
            WHEN 'Iniciou Checkout' THEN 3
            WHEN 'Finalizou Compra' THEN 4
        END;
END;
$$;

COMMENT ON FUNCTION public.get_funnel_data IS 
'Retorna dados do funil de conversão - SECURITY DEFINER para bypass de RLS';

-- =====================================================
-- 4. FIX: get_operational_health - ADICIONAR SECURITY DEFINER
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_operational_health(
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
    total_transactions BIGINT,
    successful_transactions BIGINT,
    failed_transactions BIGINT,
    success_rate NUMERIC,
    average_processing_time NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER  -- 🔑 BYPASS RLS
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_transactions,
        COUNT(*) FILTER (WHERE order_status IN ('paid', 'provisioning', 'active'))::BIGINT as successful_transactions,
        COUNT(*) FILTER (WHERE order_status IN ('cancelled', 'refused', 'failed'))::BIGINT as failed_transactions,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                (COUNT(*) FILTER (WHERE order_status IN ('paid', 'provisioning', 'active'))::NUMERIC / COUNT(*)::NUMERIC * 100)
            ELSE 0
        END as success_rate,
        0::NUMERIC as average_processing_time  -- Placeholder
    FROM public.sales
    WHERE created_at BETWEEN start_date AND end_date;
END;
$$;

COMMENT ON FUNCTION public.get_operational_health IS 
'Retorna saúde operacional do sistema - SECURITY DEFINER para bypass de RLS';

-- =====================================================
-- 5. TESTAR AS FUNÇÕES
-- =====================================================

-- Teste: Últimos 7 dias
SELECT 
    '📊 TESTE: Últimos 7 dias' as teste,
    * 
FROM get_analytics_period(NOW() - INTERVAL '7 days', NOW());

-- Teste: Últimos 30 dias
SELECT 
    '📊 TESTE: Últimos 30 dias' as teste,
    * 
FROM get_analytics_period(NOW() - INTERVAL '30 days', NOW());

-- Teste: Gráfico
SELECT 
    '📈 TESTE: Gráfico' as teste,
    * 
FROM get_sales_chart_data(NOW() - INTERVAL '7 days', NOW())
LIMIT 5;

-- Teste: Funil
SELECT 
    '🔄 TESTE: Funil' as teste,
    * 
FROM get_funnel_data(NOW() - INTERVAL '7 days', NOW());

-- Teste: Saúde Operacional
SELECT 
    '❤️ TESTE: Saúde' as teste,
    * 
FROM get_operational_health(NOW() - INTERVAL '7 days', NOW());

-- =====================================================
-- 6. VERIFICAR SECURITY DEFINER
-- =====================================================

SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_name LIKE 'get_%'
ORDER BY routine_name;

-- Resultado esperado: security_type = 'DEFINER' para todas as funções

-- =====================================================
-- ✅ FIM DO FIX
-- =====================================================

-- INSTRUÇÕES DE USO:
-- 1. Execute este SQL no SQL Editor do Supabase
-- 2. Verifique se todos os testes retornam dados
-- 3. Acesse o dashboard admin e verifique se os dados aparecem
-- 4. Se ainda não funcionar, verifique se o RLS está ativado nas tabelas

-- REVERTER (se necessário):
-- Para remover SECURITY DEFINER, recrie as funções sem essa cláusula
