-- ==========================================
-- 🔧 CORREÇÃO: Analytics - Fix total_amount
-- ==========================================
-- Resolve: ERROR 42703 - column "total_amount" does not exist
-- Data: 21/01/2026

BEGIN;

-- ==========================================
-- 1️⃣ GARANTIR QUE total_amount EXISTE
-- ==========================================

-- Adiciona a coluna se não existir
ALTER TABLE public.checkout_attempts 
ADD COLUMN IF NOT EXISTS total_amount NUMERIC DEFAULT 0;

-- Preenche com dados de colunas alternativas que possam existir
DO $$
DECLARE
    has_amount boolean;
    has_value boolean;
    has_price boolean;
    has_cart_total boolean;
    has_cart_value boolean;
    sql text;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'checkout_attempts'
          AND column_name = 'amount'
    ) INTO has_amount;

    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'checkout_attempts'
          AND column_name = 'value'
    ) INTO has_value;

    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'checkout_attempts'
          AND column_name = 'price'
    ) INTO has_price;

    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'checkout_attempts'
          AND column_name = 'cart_total'
    ) INTO has_cart_total;

    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'checkout_attempts'
          AND column_name = 'cart_value'
    ) INTO has_cart_value;

    sql := 'UPDATE public.checkout_attempts SET total_amount = COALESCE(total_amount';

    IF has_amount THEN
        sql := sql || ', (checkout_attempts.amount)::numeric';
    END IF;
    IF has_value THEN
        sql := sql || ', (checkout_attempts.value)::numeric';
    END IF;
    IF has_price THEN
        sql := sql || ', (checkout_attempts.price)::numeric';
    END IF;
    IF has_cart_total THEN
        sql := sql || ', (checkout_attempts.cart_total)::numeric';
    END IF;
    IF has_cart_value THEN
        sql := sql || ', (checkout_attempts.cart_value)::numeric';
    END IF;

    sql := sql || ', 299.90) WHERE total_amount IS NULL OR total_amount = 0';

    EXECUTE sql;
END $$;

-- ==========================================
-- 2️⃣ RECRIAR VIEWS (Agora total_amount existe)
-- ==========================================

-- Limpar views antigas
DROP VIEW IF EXISTS public.marketing_attribution CASCADE;
DROP VIEW IF EXISTS public.analytics_funnel CASCADE;
DROP VIEW IF EXISTS public.analytics_health CASCADE;
DROP VIEW IF EXISTS public.analytics_visitors_online CASCADE;
DROP FUNCTION IF EXISTS public.get_analytics_period CASCADE;

-- ==========================================
-- 3️⃣ VIEW: MARKETING ATTRIBUTION
-- ==========================================

CREATE OR REPLACE VIEW public.marketing_attribution AS
WITH completed_sales AS (
    SELECT 
        customer_email,
        total_amount,
        created_at,
        payment_method
    FROM public.checkout_attempts
    WHERE status IN ('paid', 'approved', 'completed')
),
traffic_sources AS (
    SELECT 
        id as visit_id,
        session_id,
        user_agent,
        COALESCE(
            utm_source, 
            CASE 
                WHEN referrer_domain LIKE '%google%' THEN 'google-organic'
                WHEN referrer_domain LIKE '%facebook%' OR referrer_domain LIKE '%instagram%' THEN 'social-organic'
                WHEN referrer_domain LIKE '%youtube%' THEN 'youtube'
                WHEN referrer_domain LIKE '%linkedin%' THEN 'linkedin'
                WHEN referrer_domain IS NULL THEN 'direct'
                ELSE referrer_domain 
            END
        ) as source,
        COALESCE(utm_medium, 'organic') as medium,
        COALESCE(utm_campaign, 'none') as campaign,
        created_at
    FROM public.analytics_visits
    WHERE created_at >= NOW() - INTERVAL '90 days'
)
SELECT 
    ts.source,
    ts.medium,
    ts.campaign,
    COUNT(DISTINCT ts.visit_id) as visitors,
    COUNT(DISTINCT ts.session_id) as sessions,
    COUNT(DISTINCT cs.customer_email) as sales_count,
    COALESCE(SUM(cs.total_amount), 0) as total_revenue,
    CASE 
        WHEN COUNT(DISTINCT ts.session_id) > 0 
        THEN ROUND((COUNT(DISTINCT cs.customer_email)::numeric / COUNT(DISTINCT ts.session_id)::numeric) * 100, 2)
        ELSE 0 
    END as conversion_rate,
    CASE 
        WHEN COUNT(DISTINCT cs.customer_email) > 0 
        THEN ROUND(COALESCE(SUM(cs.total_amount), 0) / COUNT(DISTINCT cs.customer_email), 2)
        ELSE 0 
    END as average_order_value,
    MODE() WITHIN GROUP (ORDER BY 
        CASE 
            WHEN ts.user_agent LIKE '%Mobile%' OR ts.user_agent LIKE '%Android%' THEN 'mobile'
            WHEN ts.user_agent LIKE '%Tablet%' OR ts.user_agent LIKE '%iPad%' THEN 'tablet'
            ELSE 'desktop'
        END
    ) as primary_device
FROM 
    traffic_sources ts
    LEFT JOIN completed_sales cs ON 
        cs.created_at BETWEEN ts.created_at AND (ts.created_at + INTERVAL '24 hours')
GROUP BY 
    ts.source, ts.medium, ts.campaign
ORDER BY 
    total_revenue DESC, conversion_rate DESC;

-- ==========================================
-- 4️⃣ VIEW: FUNIL DE CONVERSÃO
-- ==========================================

CREATE OR REPLACE VIEW public.analytics_funnel AS
SELECT
    (SELECT COUNT(DISTINCT session_id) 
     FROM public.analytics_visits 
     WHERE created_at > NOW() - INTERVAL '30 days') as step_visitors,
    
    (SELECT COUNT(DISTINCT session_id) 
     FROM public.analytics_visits 
     WHERE (page_path LIKE '%checkout%' OR page_path LIKE '%pricing%' OR page_path LIKE '%plano%')
     AND created_at > NOW() - INTERVAL '30 days') as step_interested,
    
    (SELECT COUNT(*) 
     FROM public.checkout_attempts 
     WHERE created_at > NOW() - INTERVAL '30 days') as step_checkout_started,
    
    (SELECT COUNT(*) 
     FROM public.checkout_attempts 
     WHERE status IN ('paid', 'approved', 'completed')
     AND created_at > NOW() - INTERVAL '30 days') as step_purchased;

-- ==========================================
-- 5️⃣ VIEW: HEALTH METRICS
-- ==========================================

CREATE OR REPLACE VIEW public.analytics_health AS
WITH current_visits AS (
    SELECT
        COUNT(DISTINCT session_id) as unique_visitors,
        COALESCE(AVG(EXTRACT(EPOCH FROM (last_seen - created_at))), 0) as avg_time_on_site
    FROM public.analytics_visits
    WHERE created_at >= NOW() - INTERVAL '30 days'
),
current_sales AS (
    SELECT
        COUNT(*) FILTER (WHERE status IN ('paid', 'approved', 'completed')) as sales,
        COALESCE(SUM(total_amount) FILTER (WHERE status IN ('paid', 'approved', 'completed')), 0) as revenue,
        COALESCE(AVG(total_amount) FILTER (WHERE status IN ('paid', 'approved', 'completed')), 0) as aov
    FROM public.checkout_attempts
    WHERE created_at >= NOW() - INTERVAL '30 days'
),
previous_visits AS (
    SELECT
        COUNT(DISTINCT session_id) as unique_visitors,
        COALESCE(AVG(EXTRACT(EPOCH FROM (last_seen - created_at))), 0) as avg_time_on_site
    FROM public.analytics_visits
    WHERE created_at >= NOW() - INTERVAL '60 days' AND created_at < NOW() - INTERVAL '30 days'
),
previous_sales AS (
    SELECT
        COUNT(*) FILTER (WHERE status IN ('paid', 'approved', 'completed')) as sales,
        COALESCE(SUM(total_amount) FILTER (WHERE status IN ('paid', 'approved', 'completed')), 0) as revenue,
        COALESCE(AVG(total_amount) FILTER (WHERE status IN ('paid', 'approved', 'completed')), 0) as aov
    FROM public.checkout_attempts
    WHERE created_at >= NOW() - INTERVAL '60 days' AND created_at < NOW() - INTERVAL '30 days'
)
SELECT
    cv.unique_visitors,
    cs.sales,
    cs.revenue,
    ROUND(cs.aov, 2) as average_order_value,
    ROUND(cv.avg_time_on_site, 0) as avg_time_seconds,
    CASE 
        WHEN cv.unique_visitors > 0 
        THEN ROUND((cs.sales::numeric / cv.unique_visitors::numeric) * 100, 2)
        ELSE 0 
    END as conversion_rate,
    CASE 
        WHEN pv.unique_visitors > 0 
        THEN ROUND(((cv.unique_visitors::numeric - pv.unique_visitors::numeric) / pv.unique_visitors::numeric) * 100, 1)
        ELSE 0 
    END as visitors_change,
    CASE 
        WHEN ps.revenue > 0 
        THEN ROUND(((cs.revenue - ps.revenue) / ps.revenue) * 100, 1)
        ELSE 0 
    END as revenue_change,
    CASE 
        WHEN ps.aov > 0 
        THEN ROUND(((cs.aov - ps.aov) / ps.aov) * 100, 1)
        ELSE 0 
    END as aov_change,
    CASE 
        WHEN pv.avg_time_on_site > 0 
        THEN ROUND(((cv.avg_time_on_site - pv.avg_time_on_site) / pv.avg_time_on_site) * 100, 1)
        ELSE 0 
    END as time_change
FROM current_visits cv, current_sales cs, previous_visits pv, previous_sales ps;

-- ==========================================
-- 6️⃣ VIEW: VISITANTES ONLINE
-- ==========================================

CREATE OR REPLACE VIEW public.analytics_visitors_online AS
SELECT 
    COUNT(DISTINCT session_id) as online_count,
    COUNT(DISTINCT CASE WHEN user_agent LIKE '%Mobile%' THEN session_id END) as mobile_count,
    COUNT(DISTINCT CASE WHEN user_agent NOT LIKE '%Mobile%' THEN session_id END) as desktop_count
FROM public.analytics_visits
WHERE last_seen >= NOW() - INTERVAL '5 minutes'
AND is_online = true;

-- ==========================================
-- 7️⃣ ÍNDICES DE PERFORMANCE
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_analytics_visits_created_at ON public.analytics_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_visits_session_id ON public.analytics_visits(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_visits_utm_source ON public.analytics_visits(utm_source);
CREATE INDEX IF NOT EXISTS idx_analytics_visits_last_seen ON public.analytics_visits(last_seen) WHERE is_online = true;
CREATE INDEX IF NOT EXISTS idx_checkout_attempts_created_status ON public.checkout_attempts(created_at DESC, status);

-- ==========================================
-- 8️⃣ FUNÇÃO HELPER
-- ==========================================

CREATE OR REPLACE FUNCTION public.get_analytics_period(
    start_date TIMESTAMP DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP DEFAULT NOW()
)
RETURNS TABLE (
    unique_visitors BIGINT,
    total_sales BIGINT,
    total_revenue NUMERIC,
    conversion_rate NUMERIC,
    average_order_value NUMERIC
) 
LANGUAGE plpgsql
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
            COUNT(*) FILTER (WHERE status IN ('paid', 'approved', 'completed')) as total_sales,
            COALESCE(SUM(total_amount) FILTER (WHERE status IN ('paid', 'approved', 'completed')), 0) as total_revenue
        FROM public.checkout_attempts
        WHERE created_at BETWEEN start_date AND end_date
    )
    SELECT
        pv.unique_visitors,
        ps.total_sales,
        ps.total_revenue,
        CASE 
            WHEN pv.unique_visitors > 0 
            THEN ROUND((ps.total_sales::numeric / pv.unique_visitors::numeric) * 100, 2)
            ELSE 0 
        END,
        CASE 
            WHEN ps.total_sales > 0 
            THEN ROUND(ps.total_revenue / ps.total_sales, 2)
            ELSE 0 
        END
    FROM period_visits pv, period_sales ps;
END;
$$;

COMMIT;

-- ==========================================
-- ✅ VERIFICAÇÃO FINAL
-- ==========================================

-- Testar se funcionou:
SELECT 'Setup completo! Testando views...' as status;

SELECT * FROM analytics_health;
SELECT * FROM analytics_funnel;
SELECT * FROM analytics_visitors_online;
SELECT * FROM marketing_attribution LIMIT 5;

SELECT '✅ Analytics Avançado ativado com sucesso!' as resultado;
